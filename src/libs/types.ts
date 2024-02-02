export interface GameResult {
  winner: string;
  p1Address: string;
  p2Address: string;
  p1Move: string;
  p2Move: string;
  stake: string;
}

export enum QueryParams {
  JOIN = "join",
  GAME_ID = "gameid",
  RESULT = "result",
  WINNER = "winner",
  P1_ADDRESS = "p1address",
  P2_ADDRESS = "p2address",
  P1_MOVE = "p1move",
  P2_MOVE = "p2move",
  STAKE = "amount",
}

export enum GameState {
  INITIAL = "initial",
  HASHED_COMMITTED = "committed",
  PLAYER_INVITED = "invited",
  GAME_FOUND = "game-found",
  JOINING = "joining",
  JOINED = "joined",
  RESULT_CALCULATED = "result-calculated",
  FUNDS_RETURNED = "funds-returned",
  STUCKED = "stucked",
}

export enum GameModes {
  NONE = "none",
  CREATE = "create-game",
  JOIN = "join-game",
  CALCULATE = "calculate-result",
}
