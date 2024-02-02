import { HasherAbi } from "@/contracts/ABI";
import { HASHER_ADDRESS } from "@/contracts/ContractAddress";
import ethereumProvider from "@/libs/ethereumProvider";
import web3Instance from "@/libs/web3Instance";

const generateHash = async (
  move: number,
  salt: number | string,
  connectedAccount: string | undefined
) => {
  if (ethereumProvider) {
    try {
      const hasherContract = new web3Instance.eth.Contract(
        HasherAbi,
        HASHER_ADDRESS
      );
      const gasEstimate = await hasherContract.methods
        .hash(move, salt)
        .estimateGas({ from: connectedAccount });
      const commitHash = await hasherContract.methods
        .hash(move, salt)
        .call({ from: connectedAccount, gas: gasEstimate.toString() });
      console.log("Hashed Succesfully");
      return commitHash;
    } catch (error) {
      console.error("Error generating the commitment hash:", error);
    }
  }
};

export default generateHash;
