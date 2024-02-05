import { GameModes } from "@/libs/types";

export const getCurrMode = (
  isJoiner: string | null,
  showResult: string | null
) => {
  const mode = isJoiner
    ? GameModes.JOIN
    : showResult
    ? GameModes.CALCULATE
    : GameModes.NONE;

  return mode;
};
