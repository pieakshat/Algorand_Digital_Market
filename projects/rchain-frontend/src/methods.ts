import * as algokit from '@algorandfoundation/algokit-utils'
import { RchainClient } from './contracts/Rchain'
import { TransactionSigner } from 'algosdk'

/**
 * Create required assets (USDT and SBTs)
 */
export function createAsset(
    algorand: algokit.AlgorandClient,
    sender: string,
    total: bigint,
    unitName: string,
    assetName: string,
    url: string,
    setAssetId: (id: bigint) => void,
) {
    return async () => {
        const assetCreate = await algorand.send.assetCreate({
            sender,
            total,
            unitName,
            assetName,
            url,
            manager: sender,
            reserve: sender,
            freeze: sender,
            clawback: sender,
        })

        const assetId = BigInt(assetCreate.confirmation.assetIndex!)
        setAssetId(assetId)
    }
}

/**
 * Initialize the Rchain contract
 */
export function create(
    algorand: algokit.AlgorandClient,
    rchainClient: RchainClient,
    sender: string,
    usdtId: bigint,
    distributionInterval: bigint,
    totalAmountToRaise: bigint,
    recipient: string,
    bronzeId: bigint,
    silverId: bigint,
    goldId: bigint,
    recipientFundingLeft: bigint,
    setAppId: (id: number) => void,
) {
    return async () => {
        // Create the application
        const createResult = await rchainClient.initialise({
            usdtId,
            distributionInterval,
            totalAmountToRaise,
            recipient,
            bronzeId,
            silverId,
            goldId,
            recipientFundingLeft,
        }, { sender })

        // Fund MBR for asset opt-ins
        const mbrTxn = await algorand.transactions.payment({
            sender,
            receiver: createResult.appAddress,
            amount: algokit.algos(0.3), // Adjust based on required MBR
            extraFee: algokit.algos(0.001),
        })

        // Opt contract into SBT assets
        await rchainClient.optInToAsset({ mbrPay: mbrTxn }, { sender })

        // Transfer initial SBTs to contract
        await Promise.all([
            algorand.send.assetTransfer({
                assetId: bronzeId,
                sender,
                receiver: createResult.appAddress,
                amount: 1000n,
            }),
            algorand.send.assetTransfer({
                assetId: silverId,
                sender,
                receiver: createResult.appAddress,
                amount: 500n,
            }),
            algorand.send.assetTransfer({
                assetId: goldId,
                sender,
                receiver: createResult.appAddress,
                amount: 100n,
            })
        ])

        setAppId(Number(createResult.appId))
    }
}

/**
 * Purchase SBT tokens
 */
export async function buyAndMint(
    algorand: algokit.AlgorandClient,
    rchainClient: RchainClient,
    signer: TransactionSigner,
    sender: string,
    appAddress: string,
    amount: bigint | number
): Promise<void> {
    try {
        console.log("Initiating ALGO payment...");
        console.log(sender);

        const parsedAmount = Number(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            throw new Error(`Invalid amount: ${amount}`);
        }

        // Create ALGO payment transaction
        const paymentTxn = await algorand.createTransaction.payment({
            sender,
            receiver: appAddress,
            amount: algokit.microAlgos(parsedAmount),
            extraFee: algokit.algos(0.001),
        });

        console.log("Transaction created...");
        console.log(paymentTxn)
        //         const signedTxn = await TransactionSigner.signTransaction(paymentTxn);
        // await algorand.sendTransaction(signedTxn);
        // console.log("Transaction sent:", signedTxn.txID());

        // Execute buyAndMint with ALGO payment
        await rchainClient.createTransaction.buyAndMint({
            sender,
            signer,
            args: [parsedAmount, paymentTxn], // Ensure correct arguments
        });

    } catch (error) {
        console.error("Error in buyAndMint:", error);
    }
}



/**
 * Distribute funds to recipient
 */
export function allocateFunds(
    rchainClient: RchainClient,
    sender: string,
    recipient: string,
) {
    return async () => {
        await rchainClient.allocateFunds({
            recipient,
        }, { sender })
    }
}

/**
 * Delete the Rchain application
 */
// export function deleteApp(rchainClient: RchainClient, setAppId: (id: number) => void) {
//     return async () => {
//         await rchainClient.deleteApplication({}, { sendParams: { fee: algokit.algos(0.003) } })
//         setAppId(0)
//     }
// }