from http.client import responses

from flask import Flask, request, jsonify
import pandas as pd
import joblib
import math

import json
from sklearn.ensemble import RandomForestRegressor
import sklearn.pipeline
from flask_cors import CORS


def return_range(types_of_plastics, location):
  model_pipeline = joblib.load("model_pipeline.pkl")
  scaler_y = joblib.load("scaler_y.pkl")
  print("Received types_of_plastics:", types_of_plastics)  # Debugging

  types_of_plastic = list(types_of_plastics.keys())

  price_per_ton_recycle = {
      'PET': 25000,
      'HDPE': 30000,
      'PP': 33000,
      'PVC': 40000,
      'LDPE': 40000,
      'PS': 60000,
      'Other Plastics': 90000
  }

  price_per_ton_selling = {
      'PET': 61000,
      'HDPE': 47000,
      'PP': 30000,
      'PVC': 37000,
      'LDPE': 33000,
      'PS': 25000,
      'Other Plastics': 25000
  }

  def calculate_total_selling_cost(tonnes_dict):
      return sum(price_per_ton_selling[plastic] * tonnes for plastic, tonnes in tonnes_dict.items())

  def calculate_total_recycle_cost(tonnes_dict):
      return sum(price_per_ton_recycle[plastic] * tonnes for plastic, tonnes in tonnes_dict.items())

  total_recycle_cost = calculate_total_recycle_cost(types_of_plastics)
  total_selling_cost = calculate_total_selling_cost(types_of_plastics)
  profit_per_month = total_selling_cost - total_recycle_cost
  print(total_recycle_cost, total_selling_cost, profit_per_month)

  recyclability_scores = {'PET': 10, 'HDPE': 9, 'PP': 7, 'LDPE': 6, 'PVC': 4, 'PS': 3, 'Other Plastics': 1}
  cost_scores = {'PET': 10, 'HDPE': 8, 'PP': 7, 'PVC': 6, 'LDPE': 5, 'PS': 4, 'Other Plastics': 3}
  demand_scores = {'HDPE': 10, 'LDPE': 10, 'PP': 9, 'PVC': 8, 'PET': 8, 'PS': 5, 'Other Plastics': 3}

  location_scores = {'Developing': 3, 'Underdeveloped': 2, 'Developed': 1}

  def calculate_total_score(plastics_list, score_dict):
      return sum(score_dict.get(plastic, 0) for plastic in plastics_list)

  recycle_scores = {plastic: calculate_total_score([plastic], recyclability_scores) for plastic in types_of_plastic}
  cost_scores = {plastic: calculate_total_score([plastic], cost_scores) for plastic in types_of_plastic}
  demand_scores = {plastic: calculate_total_score([plastic], demand_scores) for plastic in types_of_plastic}

  custom_input = {
      'Profit Per Month': profit_per_month,
      'Total Recycling Cost per Month': total_recycle_cost,
      'Total Selling Cost per Month': total_selling_cost,
      'PET': recycle_scores.get('PET', 0) + cost_scores.get('PET', 0) + demand_scores.get('PET', 0),
      'HDPE': recycle_scores.get('HDPE', 0) + cost_scores.get('HDPE', 0) + demand_scores.get('HDPE', 0),
      'PP': recycle_scores.get('PP', 0) + cost_scores.get('PP', 0) + demand_scores.get('PP', 0),
      'PVC': recycle_scores.get('PVC', 0) + cost_scores.get('PVC', 0) + demand_scores.get('PVC', 0),
      'LDPE': recycle_scores.get('LDPE', 0) + cost_scores.get('LDPE', 0) + demand_scores.get('LDPE', 0),
      'PS': recycle_scores.get('PS', 0) + cost_scores.get('PS', 0) + demand_scores.get('PS', 0),
      'Other Plastics': recycle_scores.get('Other Plastics', 0) + cost_scores.get('Other Plastics', 0) + demand_scores.get('Other Plastics', 0),
      'location_score': location_scores.get(location, 0),
      'total_recyclability_score': sum(recycle_scores.values()),
      'total_cost_score': sum(cost_scores.values()),
      'total_demand_score': sum(demand_scores.values())
  }

  print(custom_input)

    ## Testing Custom Input
  new_input_df = pd.DataFrame([custom_input])

  new_input_scaled = model_pipeline.named_steps['scaler'].transform(new_input_df)

  new_pred_scaled = model_pipeline.named_steps['model'].predict(new_input_scaled)

  new_pred = scaler_y.inverse_transform(new_pred_scaled.reshape(-1, 1)).flatten()

  pred_value = new_pred[0]

  rounded_value = math.ceil(pred_value / 10000) * 10000

    ### Graph Returns
  # 2
  recyclability_scores = {'PET': 10, 'HDPE': 9, 'PP': 7, 'LDPE': 6, 'PVC': 4, 'PS': 3, 'Other Plastics': 1}

  plastics, scores = zip(*sorted(recyclability_scores.items(), key=lambda x: x[1], reverse=True))

  # 3
  recycling_cost = {plastic: types_of_plastics[plastic] * price_per_ton_recycle[plastic] for plastic in types_of_plastics}

  total_cost = sum(recycling_cost.values())

  plastics_1, costs_1 = zip(*sorted(recycling_cost.items(), key=lambda x: x[1], reverse=True))

  plastics_1 += ("Total Cost",)
  costs_1 += (total_cost,)

  # 4
  recycling_budget = 0.50 * rounded_value
  expansion_budget = 0.30 * rounded_value
  operational_budget = 0.20 * rounded_value
  total_recycling_cost = sum(recycling_cost.values())
  recycling_allocation = {plastic: (recycling_cost[plastic] / total_recycling_cost) * recycling_budget for plastic in recycling_cost}

  categories = list(recycling_allocation.keys()) + ["Expansion", "Operational Costs"]
  allocations = list(recycling_allocation.values()) + [expansion_budget, operational_budget]

  if (rounded_value / 10) < 1000000:
      allowable_range = (rounded_value * (1 + 1 / 10), rounded_value * (1 - 1 / 10))
  else:
      allowable_range = (rounded_value + 1000000, rounded_value - 1000000)

  # print(allowable_range)
  print(plastics)
  return allowable_range, total_recycle_cost, total_selling_cost, profit_per_month, plastics, scores, plastics_1, costs_1, recycling_budget, expansion_budget, operational_budget, total_recycling_cost, recycling_allocation, categories, allocations


# return_range(types_of_plastics, location)


app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def sayhello():
  return "hello world"

@app.route('/get_estimation', methods=['POST','GET'])
def estimateFunding():
    request_data = request.get_json()
    types_of_plastics = request_data['types_of_plastics']
    location = request_data['location']
    requestedFunds = request_data['requestedFunds']
    location = location[:len(location)-1]

    print(types_of_plastics)
    print(location)
    print(requestedFunds)
    range, total_recycle_cost, total_selling_cost, profit_per_month, plastics, scores, plastics_1, costs_1, recycling_budget, expansion_budget, operational_budget, total_recycling_cost, recycling_allocation, categories, allocations = return_range(types_of_plastics, location)
    estimateFunding = 0
    requestedFunds = float(requestedFunds)  # Ensure it's a float
    range_vals = [float(range[0]), float(range[1])]  # Convert range values to float

    if range_vals[1] <= requestedFunds <= range_vals[0]:
      estimateFunding = requestedFunds
    else:
      estimateFunding = range_vals[0] + (range_vals[1] - range_vals[0]) / 2

    data = {
        "estimateFunding": estimateFunding,
        "total_recycle_cost": total_recycle_cost,
        "total_selling_cost": total_selling_cost,
        "profit_per_month": profit_per_month,
        "plastics": plastics,
        "scores": scores,
        "plastics_1": plastics_1,
        "costs_1": costs_1,
        "recycling_budget": recycling_budget,
        "expansion_budget": expansion_budget,
        "operational_budget": operational_budget,
        "total_recycling_cost": total_recycling_cost,
        "recycling_allocation": recycling_allocation,
        "categories": categories,
        "allocations": allocations
    }

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, port=5500)
