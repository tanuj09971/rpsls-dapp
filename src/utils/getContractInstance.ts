import { RpsAbi } from "@/contracts/ABI";
import web3Instance from "@/libs/web3Instance";

const contractInstance = (abi: typeof RpsAbi, address: string) =>
  new web3Instance.eth.Contract(abi, address);

export default contractInstance;
