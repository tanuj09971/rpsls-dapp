import { RpsAbi } from "@/contracts/ABI";
import { rpsBytecode } from "@/contracts/RPSBytecode";
import web3Instance from "@/libs/web3Instance";
import { MatchPrimitiveType } from "web3";

const deployRpsContract = async (
  c1HashValue: MatchPrimitiveType<"bytes32", unknown>,
  j2Address: string,
  stake: string,
  connectedAccount: string | undefined
) => {
  if (web3Instance) {
    try {
      const newRpsContract = new web3Instance.eth.Contract(RpsAbi);
      const deployTransaction = newRpsContract.deploy({
        data: `0x${rpsBytecode}`,
        arguments: [c1HashValue, j2Address],
      } as any);

      const gas = await deployTransaction.estimateGas();

      const deployedContract = await deployTransaction
        .send({
          from: connectedAccount ?? "",
          gas: (Number(gas) * 1.5).toString(),
          value: stake,
        })
        .catch((err) => {
          console.error("Error deploying contract :>>", err);
        });
      const deployedContractAddress = deployedContract?.options?.address;
      if (deployedContractAddress) console.log("Contract deployed");
      return deployedContractAddress;
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  }
  return "";
};

export default deployRpsContract;
