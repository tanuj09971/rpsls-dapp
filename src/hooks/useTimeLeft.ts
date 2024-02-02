import { RpsAbi } from "@/contracts/ABI";
import { GameState } from "@/libs/types";
import { GameTexts } from "@/utils/constants";
import contractInstance from "@/utils/getContractInstance";
import { useEffect, useRef, useState } from "react";

export const useTimeLeft = (
  contractAddress: string,
  connectedAccount: string | undefined,
  gameState: GameState,
  resetTimer: boolean,
  isJoiner: boolean,
  showResult: boolean = false
) => {
  const intervalIdRef = useRef<NodeJS.Timeout | undefined>();
  const [timeLeft, setTimeLeft] = useState<number | string | undefined>();
  const contract = contractInstance(RpsAbi, contractAddress);

  const calculateTimeLeft = async () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    const lastAction = await contract.methods
      .lastAction()
      .call({ from: connectedAccount });
    const timeout = await contract.methods
      .TIMEOUT()
      .call({ from: connectedAccount });
    intervalIdRef.current = setInterval(() => {
      const now = Date.now();
      const timeLeft =
        Number(lastAction) + Number(timeout) - Math.floor(now / 1000);
      setTimeLeft(
        timeLeft > 0 ? `${timeLeft} ${GameTexts.SECONDS}` : GameTexts.TIMED_OUT
      );
      if (timeLeft < 0) clearInterval(intervalIdRef.current);
    }, 1000);
  };
  useEffect(() => {
    if (
      !showResult &&
      contract &&
      (!isJoiner ||
        gameState === GameState.GAME_FOUND ||
        gameState === GameState.JOINED) &&
      (!intervalIdRef.current || resetTimer)
    ) {
      calculateTimeLeft();
    }
  }, [contract, connectedAccount, gameState, isJoiner, showResult, resetTimer]);

  return { timeLeft, intervalIdRef };
};
