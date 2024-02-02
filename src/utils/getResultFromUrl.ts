import { QueryParams, GameResult } from "@/libs/types";

const getResultFromUrl = (urlQueryParams: URLSearchParams) => {
  const result: GameResult = {
    winner: urlQueryParams.get(QueryParams.WINNER)!,
    p1Address: urlQueryParams.get(QueryParams.P1_ADDRESS)!,
    p2Address: urlQueryParams.get(QueryParams.P2_ADDRESS)!,
    p1Move: urlQueryParams.get(QueryParams.P1_MOVE)!,
    p2Move: urlQueryParams.get(QueryParams.P2_MOVE)!,
    stake: urlQueryParams.get(QueryParams.STAKE)!,
  };
  return result;
};
export default getResultFromUrl;
