import { EGameMode, ERaceEnum } from "../types";
import { Map } from "../admin/mapsManagement/types";

export enum ETournamentFormat {
  SINGLE_ELIM,
  DOUBLE_ELIM,
  ROUND_ROBIN,
}

export enum ETournamentState {
  INIT,
  REGISTRATION,
  MATCH_GENERATION,
  STARTED,
  SHOW_WINNER,
  FINISHED,
  CANCELED,
}

export enum ETournamentType {
  AUTOMATED,
  CUSTOM,
}

export enum ESeriesState {
  INIT,
  VETO,
  IN_PROGRESS,
  FINISHED,
  BYE,
  CANCELED,
}

export type TournamentsState = {
  tournaments: ITournament[];
  tournamentMaps: Map[];
};

export interface ITournamentSeed {
  number: number;
  player: ITournamentPlayer;
}

export interface ITournament {
  id: string;
  name: string;
  startDateTime: Date;
  state: ETournamentState;
  mode: EGameMode;
  format: ETournamentFormat;
  type: ETournamentType;
  matcherinoLink: string;
  mapPool: number[];
  players: ITournamentPlayer[];
  winner: ITournamentPlayer;
  rounds: ITournamentRound[];
  admins: ITournamentAdmin[];
  registrationTimeMinutes: number;
  readyTimeSeconds: number;
  vetoTimeSeconds: number;
  showWinnerTimeHours: number;
  matcherinoUrl?: string;
  maxPlayers: number;
  floNode: ITournamentFloNode;
  floNodeMaxPing: number;
}

export interface ITournamentAdmin {
  battleTag: string;
  countryCode?: string;
}

export interface ITournamentPlayer {
  battleTag: string;
  race: ERaceEnum;
  countryCode?: string;
}

export interface ITournamentRound {
  name: string;
  number: number;
  series: ITournamentSeries[];
}

export interface ITournamentSeries {
  id: string;
  state: ESeriesState;
  players?: ISeriesPlayer[];
  matches?: ITournamentMatch[];
}

export interface ISeriesPlayer {
  battleTag: string;
  team: number;
  score?: number;
  won?: boolean;
  race: ERaceEnum; // copied from ITournamentPlayer
  countryCode?: string; // copied from ITournamentPlayer
}

export enum EMatchState {
  INIT,
  STARTED,
  FINISHED,
  CANCELED,
}

export interface ITournamentMatch {
  id?: string;
  state: EMatchState;
  mapId: number;
  players: IMatchPlayer[];
}

export interface IMatchPlayer {
  battleTag: string;
  team: number;
  won?: boolean;
}

export interface BracketDimensions {
  verticalSpace: number;
  marginTop: number;
}

export interface ITournamentFloNode {
  name: string;
  id: number;
}
