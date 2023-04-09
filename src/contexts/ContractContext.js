/* eslint-disable */
import React, {useState, createContext, useEffect} from "react";

export const ContractContext = createContext();

import Web3 from 'web3';

//Contract
import VaultContract from '../contracts/Vault.json';
import MockDAIContract from '../contracts/MockDAI.json';
import TradingStorageContract from '../contracts/TradingStorage.json';

//Contract object
const vaultContractAddress = "0xD143478E1f71A1BBAd3057253fCf7398f3974839"  //vault contract address
const vaultabi = VaultContract.abi;

const daiContractAddress = "0x8f674e4e5C10b5ac3e9405e920b55a3311EedE41";
const daiABI = MockDAIContract.abi;

const tradingStorageAddress = "0xC5f6d82be83bb6fCdAE31FE5c4B81c37823A230C";
const tradingStorageABI = TradingStorageContract.abi;


const ContractContextProvider = (props) => {

    const [vault, setVault] = useState({});
    const [dai, setDAI] = useState({});
    const [tradingStorage, setTradingStorage] = useState({});
    const [user, setUser] = useState("");

    const loadWeb3 = async() => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
          }
          else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
          }
          else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
          }
    }

    const loadContract = () => {
        const web3 = window.web3;
        const vault = new web3.eth.Contract(vaultabi, vaultContractAddress);
        setVault(vault);
        const dai = new web3.eth.Contract(daiABI, daiContractAddress);
        setDAI(dai);
        const tradeStorage = new web3.eth.Contract(tradingStorageABI, tradingStorageAddress);
        setTradingStorage(tradeStorage);
    }

    useEffect(() => {
        loadWeb3();
        loadContract();
    }, [])

    return ( 
       <ContractContext.Provider value={{dai, vault, tradingStorage, user, setUser}}>{props.children}</ContractContext.Provider>
     );
}
 
export default ContractContextProvider;