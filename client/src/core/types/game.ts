import { BoardSpaceData } from '../constants/vietnameseBoardData';

export interface PlayerState {
  id: number;           // 1 to 6
  name: string;
  cash: number;         // Starts at $1500
  position: number;     // 0 to 39
  inJail: boolean;
  jailTurns: number;
  getOutOfJailCards: number;
  taxDebt: number;
  taxDebtRounds: number;
  isBankrupt: boolean;
}

export interface PropertyOwnershipState {
  spaceIndex: number;
  ownerId: number | null; // null if unowned
  houses: number;         // 0-4 houses, 5 = hotel
  isMortgaged: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'INFO' | 'ACTION' | 'PAYMENT' | 'ALERT';
}

export interface GameState {
  roomCode: string;
  taxPot: number;
  players: PlayerState[];
  activePlayerIndex: number;
  properties: Record<number, PropertyOwnershipState>;
  dice: [number, number];
  hasRolled: boolean;
  doublesCount: number;
  logs: LogEntry[];
  selectedSpaceIndex: number | null;
  auctionState: {
    isOpen: boolean;
    spaceIndex: number | null;
    highestBid: number;
    highestBidderId: number | null;
    passedPlayerIds: number[];
  } | null;
}

export type GameAction =
  | { type: 'START_GAME'; playerNames: string[] }
  | { type: 'ROLL_DICE'; forcedRoll?: [number, number] }
  | { type: 'END_TURN' }
  | { type: 'BUY_PROPERTY'; playerId: number; spaceIndex: number }
  | { type: 'DECLINE_PROPERTY'; playerId: number; spaceIndex: number }
  | { type: 'PLACE_AUCTION_BID'; playerId: number; bidAmount: number }
  | { type: 'PASS_AUCTION'; playerId: number }
  | { type: 'FINALIZE_AUCTION' }
  | { type: 'BUILD_HOUSE'; playerId: number; spaceIndex: number }
  | { type: 'MORTGAGE_PROPERTY'; playerId: number; spaceIndex: number }
  | { type: 'PAY_TAX_DEBT'; playerId: number }
  | { type: 'SELECT_SPACE'; spaceIndex: number | null };
