import { RpsAbi } from "@/contracts/ABI";
import { GameResult } from "@/libs/types";
import web3Instance from "@/libs/web3Instance";
import { GameMoves, GameTexts } from "@/utils/constants";
import contractInstance from "@/utils/getContractInstance";
import { MatchPrimitiveType } from "web3";

const solveGame = async (
  usedSalt: MatchPrimitiveType<"uint256", unknown> | undefined,
  contractAddress: string,
  connectedAccount: string | undefined,
  player1Move: number
) => {
  if (contractAddress && usedSalt && player1Move) {
    try {
      const contract = contractInstance(RpsAbi, contractAddress);
      const stake = await contract.methods
        .stake()
        .call({ from: connectedAccount });
      const gasEstimate = await web3Instance.eth.estimateGas({
        from: connectedAccount,
      });

      const solveRes = await contract.methods
        .solve(player1Move, usedSalt)
        .send({ from: connectedAccount, gas: gasEstimate.toString() });
      const player2Move = await contract.methods
        .c2()
        .call({ from: connectedAccount });
      const winner = await contract.methods
        .win(player1Move, Number(player2Move))
        .call({ from: connectedAccount });
      const p2Address = await contract.methods
        .j2()
        .call({ from: connectedAccount });
      console.log("Solve successful", solveRes);
      let gameResult: GameResult;
      if (winner) {
        console.log("Player 1 won!");
        gameResult = {
          winner: GameTexts.PLAYER1,
          p1Move: GameMoves[player1Move - 1],
          p2Move: GameMoves[Number(player2Move) - 1],
          p1Address: connectedAccount!,
          p2Address: p2Address,
          stake: stake.toString(),
        };
      } else if (
        GameMoves[player1Move - 1] === GameMoves[Number(player2Move) - 1]
      ) {
        console.log("Game Tied!");
        gameResult = {
          winner: GameTexts.TIE,
          p1Move: GameMoves[player1Move - 1],
          p2Move: GameMoves[Number(player2Move) - 1],
          p1Address: connectedAccount!,
          p2Address: p2Address,
          stake: "0",
        };
      } else {
        console.log("Player 2 won!");
        gameResult = {
          winner: GameTexts.PLAYER2,
          p1Move: GameMoves[player1Move - 1],
          p2Move: GameMoves[Number(player2Move) - 1],
          p1Address: connectedAccount!,
          p2Address: p2Address,
          stake: stake.toString(),
        };
      }
      return gameResult;
    } catch (error) {
      console.error("Error solving:", error);
    }
  } else {
    throw new Error("player1 move got cleaned!");
  }
};

export default solveGame;
