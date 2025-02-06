const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5500;

// Middleware
app.use(bodyParser.json());
app.use(cors());
const groq = new Groq({ apiKey: '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' });

const genAI = new GoogleGenerativeAI("AIzaSyCHFceAUb4fZFjqWQfY9gwOSnjwPouRE5c");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to determine the area type
const fetchAreaType = async (location) => {
  const prompt = `Based on the location "${location}", determine if it is a developed, developing, or underdeveloped area. Provide only one of these three options as answer in one word only.`;
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    return result.response.text(); // Extract and return the AI's response
  } catch (error) {
    console.error("Error fetching area type:", error);
    throw new Error("Failed to determine area type.");
  }
};

// POST API Endpoint
app.post("/area-type", async (req, res) => {
  const { location } = req.body;



  // Validate input
  if (!location || typeof location !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'location' parameter." });
  }

  try {
    const areaType = await fetchAreaType(location);
    console.log(areaType)
    return res.status(200).json({ location, areaType });
  } catch (error) {
    return res.status(500).json({ error: "Failed to determine area type." });
  }
});


// MongoDB Connection
mongoose.connect('mongodb+srv://akshat05p:kjkszpj@recyclechain.x2cps.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema and Model
const RecyclePlantSchema = new mongoose.Schema({
  plantName: String,
  companyEmail: String,
  companyValuation: Number,
  recyclingCapacity: Number,
  expectedRecyclingCapacity: Number,
  plantArea: Number,
  cityName: String,
  stateName: String,
  countryName: String,
  requiredFunding: Number,
  fundingReceived: Number,
  walletAddress: String
}, { collection: 'recycle_plants' }); // Explicit collection name


const fundSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  finalFund: { type: Number, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }

});

const RecyclePlant = mongoose.model('recycle_plants', RecyclePlantSchema);
const FundApplication = mongoose.model('FundApplication', fundSchema);


//   app.post('/finalFund', async (req, res) => {
//     const { walletAddress, finalFund, description, email } = req.body;

//     if (!walletAddress || !finalFund || !description || !email) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'All fields (walletAddress, finalFund, description) are required.',
//       });
//     }

//     try {
//       // Check if the finalFund amount is reasonable (optional, based on business logic)
//       if (finalFund <= 0) {
//         return res.status(400).json({
//           status: 'error',
//           message: 'Fund amount must be greater than zero.',
//         });
//       }

//       // Save the fund application to the database
//       const newApplication = new FundApplication({ walletAddress, finalFund, description, email });
//       await newApplication.save();

//       return res.status(200).json({
//         status: 'success',
//         message: 'Fund application submitted successfully.',
//         applicationId: newApplication._id,
//       });
//     } catch (error) {
//       console.error('Error saving fund application:', error);
//       return res.status(500).json({
//         status: 'error',
//         message: 'Internal server error. Please try again later.',
//       });
//     }
//   });

const Joi = require('joi');

const fundValidationSchema = Joi.object({
  walletAddress: Joi.string().required(),
  finalFund: Joi.number().greater(0).required(),
  description: Joi.string().required(),
  email: Joi.string().email().required(),
});


app.get('/companies', async (req, res) => {
  try {
    const companies = await RecyclePlant.find();
    res.json(companies);
  } catch (error) {
    res.status(500).send('Error fetching companies');
  }
});

app.post('/finalFund', async (req, res) => {
  const { error } = fundValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ status: 'error', message: error.details[0].message });
  }

  try {
    const { walletAddress, finalFund, description, email } = req.body;
    const newApplication = new FundApplication({ walletAddress, finalFund, description, email });
    await newApplication.save();

    return res.status(200).json({
      status: 'success',
      message: 'Fund application submitted successfully.',
      applicationId: newApplication._id,
    });
  } catch (err) {
    console.error('Error saving fund application:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});




// API Endpoint
app.post('/register-plant', async (req, res) => {
  try {
    const plant = new RecyclePlant(req.body); // Create a new document
    await plant.save(); // Save the document to the database


    // Include the plant's `_id` in the response
    res.status(200).json({
      message: 'Recycle Plant registered successfully!',
      plantId: plant._id, // Send the MongoDB ObjectId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to register recycle plant',
      details: error.message,
    });
  }
});

app.get('/plants/:id', async (req, res) => {
  try {
    const plant = await RecyclePlant.findById(req.params.id); // Fetch by ObjectId
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching plant', details: error.message });
  }
});

app.post('/estimate-funds', async (req, res) => {
  const { location, areaType, areaInAcres, initialCapacity, targetCapacity, recyclingDemand, recyclingCost } = req.body;

  console.log('Received Data:', req.body);  // Debugging log

  try {
    const prompt = `You are an expert in estimating required funds for plastic recycling facilities. Use the following algorithm to calculate the fund requirement for a given facility based on provided inputs.

Algorithm:
Input Parameters:

Location: Determines cost multipliers based on economic factors (developed, developing, underdeveloped).
Area in Acres: Affects land cost and setup costs.
Initial Capacity: Current processing capacity in kg/day.
Target Capacity: Desired processing capacity in kg/day.
Recycling Cost per kg: Direct operational cost for processing plastic.
Recycling Plastic Demand: Global demand multiplier (High = 1.2, Medium = 1.0, Low = 0.8).
Constants:

Base land cost per acre (
𝐿
L) varies by location:
Developed: $30,000
Developing: $10,000
Underdeveloped: $5,000
Setup cost multiplier (
𝑆
S):
Developed: 0.3
Developing: 0.2
Underdeveloped: 0.1
Operational cost multiplier (
𝑂
O): Adjusts based on demand.
Contingency percentage (
𝐶
C): 15%.
Steps:

Calculate Land Cost:
LandCost
=
AreaInAcres
⋅
𝐿
LandCost=AreaInAcres⋅L
Calculate Setup Cost:
SetupCost
=
LandCost
⋅
𝑆
SetupCost=LandCost⋅S
Calculate Scaling Cost:
ScalingFactor
=
TargetCapacity
−
InitialCapacity
ScalingFactor=TargetCapacity−InitialCapacity
ScalingCost
=
ScalingFactor
⋅
RecyclingCost
⋅
𝑂
ScalingCost=ScalingFactor⋅RecyclingCost⋅O
Calculate Operational Costs:
OperationalCost
=
TargetCapacity
⋅
RecyclingCost
⋅
𝑂
OperationalCost=TargetCapacity⋅RecyclingCost⋅O
Sum Costs:
TotalCost
=
LandCost
+
SetupCost
+
ScalingCost
+
OperationalCost
TotalCost=LandCost+SetupCost+ScalingCost+OperationalCost
Add Contingency:
FinalEstimate
=
TotalCost
⋅
(
1
+
𝐶
)
FinalEstimate=TotalCost⋅(1+C)
Example:
Given the inputs:

Location: Developing
Area: 50 acres
Initial Capacity: 5000 kg/day
Target Capacity: 20000 kg/day
Recycling Cost: $2/kg
Demand: High
The estimated funds should be calculated step-by-step using the algorithm. Output only the estimated fund amount in dollars without any additional text.

Task:
Use the provided algorithm and the following parameters to estimate the required funds. Return only the fund amount in dollars.

Input Parameters:
Location: ${location}
Area: ${areaInAcres} acres
Initial Capacity: ${initialCapacity} kg/day
Target Capacity: ${targetCapacity} kg/day
Recycling Cost: ${recyclingCost}/kg
Demand: ${recyclingDemand}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant. Provide only the estimated amount in dollars for the recycling facility." },
        { role: "user", content: prompt }
      ],
      model: "gemma2-9b-it",
      temperature: 0.3,
      max_tokens: 20,  // Limit the response length to reduce unnecessary text
    });

    let responseContent = chatCompletion.choices[0]?.message?.content.trim();

    console.log('Raw Model Response:', responseContent);  // Debugging log

    // Extract number using regex
    //   const extractedAmount = responseContent.match(/(\d+(\.\d+)?)/);
    const estimatedFunds = responseContent;

    res.json({ estimatedFunds });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: 'Failed to estimate funds' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
