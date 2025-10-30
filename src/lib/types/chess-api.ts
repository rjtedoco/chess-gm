// Domain types for Chess.com PubAPI and view models used in the app

export type PlayerResponse = {
  url?: string;
  username: string;
  player_id: number;
  title?: string;
  status?: string;
  name?: string;
  avatar?: string;
  country?: string;
  location?: string;
  followers?: number;
  last_online?: number;
  joined?: number;
  league?: string;
  is_streamer?: boolean;
  verified?: boolean;
  twitch_url?: string;
  youtube_url?: string;
};

export type OneMode = {
  last?: { rating?: number };
  best?: { rating?: number; date?: number };
  record?: { win?: number; loss?: number; draw?: number };
};

export type StatsResponse = Partial<{
  chess_blitz: OneMode;
  chess_rapid: OneMode;
  chess_bullet: OneMode;
}>;

export type ModeKey = "bullet" | "blitz" | "rapid";

export type ModeStat = {
  mode: ModeKey;
  last?: number;
  best?: number;
  win?: number;
  loss?: number;
  draw?: number;
};

export type OngoingGame = {
  url: string;
  opponent: string;
  color: "white" | "black";
  time_class?: string;
  moveBy?: number; // epoch seconds
};

export type FinishedGame = {
  url: string;
  opponent: string;
  color: "white" | "black";
  result: "W" | "L" | "D";
  time_class?: string;
  time_control?: string;
  end_time?: number; // epoch seconds
};

export type ProfileData = {
  player: PlayerResponse;
  countryName?: string;
  stats?: ModeStat[];
  games?: { ongoing?: OngoingGame[]; recent?: FinishedGame[] };
};
