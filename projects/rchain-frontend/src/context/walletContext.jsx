import { Web3Provider } from "@ethersproject/providers";
import { ethers } from 'ethers';
import React, { createContext, useState } from 'react';
import Web3Modal from 'web3modal';
//import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import sbt_abi from '../abis/sbt_abi.json';

//console.log(process.env.REACT_APP_INFURA_ID);
const contractAddress = "0x6A790aa90053f4Bf63f7B8CFdd3FB23D0D9275A5";



const providerOptions = {
    walletlink: {
        package: createCoinbaseWalletSDK,
        options: {
            appName: "Web3 Modal",
            infuraId: "https://base-sepolia.infura.io/v3/a56ee2f67fa347e296cfeb0528c67f60"
        }
    }
};

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [connected, setConnected] = useState(false);
    const [signer, setSigner] = useState(null);
    const [balance, setBalance] = useState('');
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [txnHash, setTxnHash] = useState('');


    async function connectWallet() {
        try {
            console.log("starting...")
            const web3Modal = new Web3Modal({
                cacheProvider: false,
                providerOptions,
            });
            const web3ModalInstance = await web3Modal.connect();
            const web3ModalProvider = new Web3Provider(web3ModalInstance);
            const signer = web3ModalProvider.getSigner();
            const Contract = new ethers.Contract(contractAddress, sbt_abi, signer);
            setContract(Contract);
            setProvider(web3ModalProvider);
            setSigner(signer);
            setConnected(true);
            await getBalance(signer, web3ModalProvider);
            console.log("wallet connected")

        } catch (error) {
            console.log(error);
        }
    }

    const disconnectWallet = async () => {
        try {

            setProvider(null);
            setSigner(null);
            setConnected(false);
            setBalance('');
            setContract(null);

            const web3Modal = new Web3Modal({
                cacheProvider: false,
                providerOptions,
            });

            web3Modal.clearCachedProvider();


            if (provider && provider.provider && provider.provider.disconnect) {
                await provider.provider.disconnect();
            }

            console.log("Wallet disconnected");
        } catch (error) {
            console.log(error);
        }
    }

    async function getBalance(Signer, Provider) {
        try {
            const address = await Signer.getAddress();
            const balance = await Provider.getBalance(address);
            const balanceInEth = (parseFloat(balance.toString() / (10 ** 18))).toFixed(4);
            setBalance(balanceInEth);
        } catch (error) {
            console.error(error);
        }
    }

    async function initiateTransaction(value) {
        try {
            if (!contract) {
                throw new Error("Contract is not initialized.");
            }

            if (!signer) {
                throw new Error("Signer is not available. Connect your wallet first.");
            }

            setLoading(true);

            const formattedValue = (value * 10 ** 6).toString(); // 6 decimals 

            // mint call
            const tx = await contract.mint(formattedValue);

            console.log("Transaction sent. Waiting for confirmation...");
            const txnHash = tx.hash;
            console.log("transaction hash: ", tx.hash);

            // Wait for the transaction to be mined
            let receipt = null;
            while (receipt === null) {
                receipt = await provider.getTransactionReceipt(tx.hash);
                if (receipt) {
                    console.log("Transaction confirmed: ", receipt);
                } else {
                    console.log("Transaction still pending...");
                }
                await new Promise(resolve => setTimeout(resolve, 3000)); // Check every 3 seconds
            }
            setLoading(false);
            setTxnHash(txnHash);
        } catch (error) {
            console.error("Error while initiating transaction:", error);
        }
    }

    return <WalletContext.Provider value={{ provider, connected, signer, contract, connectWallet, disconnectWallet, initiateTransaction, loading, txnHash }}>
        {children}
    </WalletContext.Provider>
}