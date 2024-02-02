import Web3 from "web3";
import { ethereumProvider } from "./ethereumProvider";

const web3Instance: Web3 = new Web3(ethereumProvider);

export default web3Instance;
