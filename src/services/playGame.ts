import { RpsAbi } from "@/contracts/ABI";
import web3Instance from "@/libs/web3Instance";
import contractInstance from "@/utils/getContractInstance";

const playGame = async (
  move: number,
  stake: number,
  contractAddress: string,
  connectedAccount: string | undefined
) => {
  if (contractAddress) {
    try {
      const gasEstimate = await web3Instance.eth.estimateGas({
        from: connectedAccount,
      });
      const contract = contractInstance(RpsAbi, contractAddress);
      const playRes = await contract.methods.play(move).send({
        from: connectedAccount,
        value: stake.toString(),
        gas: gasEstimate.toString(),
      });
      console.log("Play successful", playRes);
      return true;
    } catch (error) {
      console.error("Error joining game:", error);
      return false;
    }
  }
};

export default playGame;
