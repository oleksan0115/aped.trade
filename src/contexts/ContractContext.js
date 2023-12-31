/* eslint-disable */
import React, {useState, createContext, useEffect} from "react";

export const ContractContext = createContext();

import Web3 from 'web3';

//Contract
import VaultContract from '../contracts/Vault.json';
import MockDAIContract from '../contracts/MockDAI.json';
import TradingStorageContract from '../contracts/TradingStorage.json';
import TradingLogicContract from '../contracts/TradingLogic.json';

//Contract object
const vaultContractAddress = "0x74ddE3f67553b939ED335B55eBe056021C0F80a5"  //vault contract address
const vaultabi = VaultContract.abi;

const daiContractAddress = "0x0D2ABBDf813f003210C08299F6e1a44f108D6FE2";
const daiABI = MockDAIContract.abi;

const tradingStorageAddress = "0xA6BFBB4d45D1699df93431D1E093Df6B660Fa6A4";
const tradingStorageABI = TradingStorageContract.abi;

const tradingLogicAddress = "0x681EA395Cdaaa98692ECeD52a72eF75c14A715B6";
const tradingLogicABI = TradingLogicContract.abi;


const ContractContextProvider = (props) => {

    const [vault, setVault] = useState({});
    const [dai, setDAI] = useState({});
    const [tradingStorage, setTradingStorage] = useState({});
    const [tradingLogic, setTradingLogic] = useState({});
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
        const tradeLogic = new web3.eth.Contract(tradingLogicABI, tradingLogicAddress);
        setTradingLogic(tradeLogic);
    }

    useEffect(() => {
        loadWeb3();
        loadContract();
    }, [])

    return ( 
       <ContractContext.Provider value={{dai, vault, tradingStorage, user, setUser, tradingLogic}}>{props.children}</ContractContext.Provider>
     );
}
 
export default ContractContextProvider;