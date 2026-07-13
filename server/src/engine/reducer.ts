import { GameState, GameAction, PlayerState, PropertyOwnershipState } from './types/game.js';
import { BoardSpaceData, VIETNAMESE_BOARD_SPACES } from './constants/vietnameseBoardData.js';
import { SIX_PLAYER_PRESETS } from './types/playerTokens.js';

const STARTING_CASH = 1500;
const PASS_GO_CASH = 200;
const JAIL_POSITION = 10;
const GO_TO_JAIL_POSITION = 30;
const JAIL_VISIT_GIFT = 100;
const CHANCE_TAX_POT_PERCENTAGES = [10, 50, 100] as const;
const COMMUNITY_TAX_POT_PERCENTAGES = [20, 40, 60, 100] as const;

type TaxCardEvent =
  | { kind: 'COLLECT_POT'; percent: number; title: string }
  | { kind: 'CASH_TAX'; percent: number; title: string }
  | { kind: 'FIXED_TAX'; amount: number; title: string }
  | { kind: 'POT_LEVY'; percent: number; title: string }
  | { kind: 'ASSET_AUDIT'; percent: number; title: string };

const CHANCE_TAX_EVENTS: TaxCardEvent[] = [
  ...CHANCE_TAX_POT_PERCENTAGES.map((percent) => ({ kind: 'COLLECT_POT' as const, percent, title: 'Cơ hội hoàn thuế' })),
  { kind: 'CASH_TAX', percent: 10, title: 'Thuế tiền mặt đột xuất' },
  { kind: 'FIXED_TAX', amount: 100, title: 'Phụ thu hành chính' },
  { kind: 'POT_LEVY', percent: 20, title: 'Sung công quỹ' },
  { kind: 'ASSET_AUDIT', percent: 10, title: 'Truy thu tài sản' },
];

const COMMUNITY_TAX_EVENTS: TaxCardEvent[] = [
  ...COMMUNITY_TAX_POT_PERCENTAGES.map((percent) => ({ kind: 'COLLECT_POT' as const, percent, title: 'Khí vận hoàn thuế' })),
  { kind: 'CASH_TAX', percent: 10, title: 'Đóng góp cộng đồng' },
  { kind: 'FIXED_TAX', amount: 200, title: 'Truy thu thuế cố định' },
  { kind: 'POT_LEVY', percent: 50, title: 'Bổ sung công quỹ' },
  { kind: 'ASSET_AUDIT', percent: 10, title: 'Kiểm kê tài sản' },
];

function roundToTen(amount: number) {
  if (amount <= 0) return 0;
  return Math.max(10, Math.round(amount / 10) * 10);
}

function getRealEstateValue(state: GameState, playerId: number) {
  return VIETNAMESE_BOARD_SPACES.reduce((total, space) => {
    const property = state.properties[space.index];
    if (property?.ownerId !== playerId) return total;
    const buildingValue = space.colorGroup ? property.houses * HOUSE_COST_BY_GROUP[space.colorGroup] : 0;
    return total + (space.price ?? 0) + buildingValue;
  }, 0);
}

function getLiquidationValue(space: BoardSpaceData, property: PropertyOwnershipState) {
  const landValue = (space.price ?? 0) * (property.isMortgaged ? 0.5 : 1);
  const buildingValue = space.colorGroup ? property.houses * HOUSE_COST_BY_GROUP[space.colorGroup] : 0;
  return roundToTen(landValue + buildingValue);
}

function liquidateForCash(
  properties: Record<number, PropertyOwnershipState>,
  playerId: number,
  cashNeeded: number,
) {
  let proceeds = 0;
  const soldNames: string[] = [];
  const nextProperties = { ...properties };
  const candidates = VIETNAMESE_BOARD_SPACES
    .filter((space) => nextProperties[space.index]?.ownerId === playerId)
    .map((space) => ({ space, value: getLiquidationValue(space, nextProperties[space.index]) }));

  while (proceeds < cashNeeded && candidates.length > 0) {
    const remaining = cashNeeded - proceeds;
    const covering = candidates.filter((candidate) => candidate.value >= remaining).sort((a, b) => a.value - b.value)[0];
    const selected = covering ?? candidates.sort((a, b) => b.value - a.value)[0];
    const index = candidates.indexOf(selected);
    candidates.splice(index, 1);
    proceeds += selected.value;
    soldNames.push(selected.space.name);
    nextProperties[selected.space.index] = {
      ...nextProperties[selected.space.index],
      ownerId: null,
      houses: 0,
      isMortgaged: false,
    };
  }

  return { properties: nextProperties, proceeds, soldNames };
}

function chargeTax(players: PlayerState[], playerId: number, amount: number) {
  const taxAmount = roundToTen(amount);
  const payer = players.find((player) => player.id === playerId);
  const paid = Math.min(payer?.cash ?? 0, taxAmount);
  const debt = taxAmount - paid;
  return {
    paid,
    debt,
    players: players.map((player) =>
      player.id === playerId
        ? { ...player, cash: player.cash - paid, taxDebt: (player.taxDebt ?? 0) + debt }
        : player
    ),
  };
}

function resolveTaxCardEvent(state: GameState, players: PlayerState[], playerId: number, taxPot: number, event: TaxCardEvent) {
  if (event.kind === 'COLLECT_POT') {
    const payout = Math.floor((taxPot * event.percent) / 100 / 10) * 10;
    return {
      players: players.map((player) => player.id === playerId ? { ...player, cash: player.cash + payout } : player),
      taxPot: taxPot - payout,
      message: `${event.title}: nhận ${event.percent}% quỹ thuế ($${payout}).`,
    };
  }

  const payer = players.find((player) => player.id === playerId);
  let taxAmount = 0;
  if (event.kind === 'CASH_TAX') taxAmount = (payer?.cash ?? 0) * event.percent / 100;
  if (event.kind === 'FIXED_TAX') taxAmount = event.amount;
  if (event.kind === 'POT_LEVY') taxAmount = taxPot * event.percent / 100;
  if (event.kind === 'ASSET_AUDIT') {
    taxAmount = ((payer?.cash ?? 0) + getRealEstateValue(state, playerId)) * event.percent / 100;
  }

  const charge = chargeTax(players, playerId, taxAmount);
  return {
    players: charge.players,
    taxPot: taxPot + charge.paid,
    message: `${event.title}: thuế $${roundToTen(taxAmount)}, đã trả $${charge.paid}${charge.debt ? `, ghi nợ $${charge.debt}` : ''}.`,
  };
}

function processPassGo(state: GameState, players: PlayerState[], playerId: number, taxPot: number) {
  const player = players.find((candidate) => candidate.id === playerId)!;
  let cash = player.cash + PASS_GO_CASH;
  let taxDebt = player.taxDebt ?? 0;
  let taxDebtRounds = player.taxDebtRounds ?? 0;
  let properties = state.properties;
  let paidAtDeadline = 0;
  let surcharge = 0;
  let soldNames: string[] = [];

  if (taxDebt > 0) {
    surcharge = taxDebt > 400 ? 50 : 20;
    taxDebt += surcharge;
    taxDebtRounds = Math.min(3, taxDebtRounds + 1);
    if (taxDebtRounds >= 3) {
      if (cash < taxDebt) {
        const liquidation = liquidateForCash(properties, playerId, taxDebt - cash);
        properties = liquidation.properties;
        cash += liquidation.proceeds;
        soldNames = liquidation.soldNames;
      }
      paidAtDeadline = Math.min(cash, taxDebt);
      cash -= paidAtDeadline;
      taxDebt -= paidAtDeadline;
    }
  }

  const becameBankrupt = taxDebt > 0 && taxDebtRounds >= 3;
  const nextPlayers = players.map((candidate) => candidate.id === playerId
    ? { ...candidate, cash, taxDebt, taxDebtRounds: taxDebt === 0 ? 0 : taxDebtRounds, isBankrupt: candidate.isBankrupt || becameBankrupt }
    : candidate
  );
  return { players: nextPlayers, properties, taxPot: taxPot + paidAtDeadline, surcharge, paidAtDeadline, soldNames, becameBankrupt };
}

const HOUSE_RENT_MULTIPLIERS = [1, 5, 15, 45, 80, 125];
const HOUSE_COST_BY_GROUP: Record<NonNullable<BoardSpaceData['colorGroup']>, number> = {
  BROWN: 50,
  LIGHT_BLUE: 50,
  PINK: 100,
  ORANGE: 100,
  RED: 150,
  YELLOW: 150,
  GREEN: 200,
  DARK_BLUE: 200,
};

function createLog(message: string, type: GameState['logs'][number]['type'] = 'INFO') {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    message,
    type,
  };
}

function withLog(state: GameState, message: string, type: GameState['logs'][number]['type'] = 'INFO'): GameState {
  return {
    ...state,
    logs: [createLog(message, type), ...state.logs],
  };
}

function getGroupSpaces(colorGroup: BoardSpaceData['colorGroup']) {
  return VIETNAMESE_BOARD_SPACES.filter((space) => space.type === 'PROPERTY' && space.colorGroup === colorGroup);
}

function ownsFullColorGroup(state: GameState, playerId: number, colorGroup: BoardSpaceData['colorGroup']) {
  if (!colorGroup) return false;
  const groupSpaces = getGroupSpaces(colorGroup);
  return groupSpaces.length > 0 && groupSpaces.every((space) => state.properties[space.index]?.ownerId === playerId);
}

function getBuildCost(space: BoardSpaceData) {
  return space.colorGroup ? HOUSE_COST_BY_GROUP[space.colorGroup] : 100;
}

function canBuildEvenly(state: GameState, playerId: number, spaceIndex: number) {
  const targetSpace = VIETNAMESE_BOARD_SPACES[spaceIndex];
  const targetProperty = state.properties[spaceIndex];
  if (!targetSpace?.colorGroup || !targetProperty || targetProperty.ownerId !== playerId) return false;
  if (!ownsFullColorGroup(state, playerId, targetSpace.colorGroup)) return false;

  const groupProperties = getGroupSpaces(targetSpace.colorGroup).map((space) => state.properties[space.index]);
  const lowestHouseCount = Math.min(...groupProperties.map((property) => property?.houses ?? 0));
  return targetProperty.houses === lowestHouseCount;
}

function countOwnedByType(state: GameState, playerId: number, type: BoardSpaceData['type']) {
  return VIETNAMESE_BOARD_SPACES.filter((space) => space.type === type && state.properties[space.index]?.ownerId === playerId).length;
}

function calculateRent(state: GameState, space: BoardSpaceData, diceTotal: number) {
  const property = state.properties[space.index];
  if (!property || !property.ownerId || property.isMortgaged) return 0;

  if (space.type === 'RAILROAD') {
    const ownedRailroads = countOwnedByType(state, property.ownerId, 'RAILROAD');
    return roundToTen(25 * Math.pow(2, Math.max(0, ownedRailroads - 1)));
  }

  if (space.type === 'UTILITY') {
    const ownedUtilities = countOwnedByType(state, property.ownerId, 'UTILITY');
    return roundToTen(diceTotal * (ownedUtilities >= 2 ? 10 : 4));
  }

  if (space.type === 'PROPERTY') {
    const baseRent = space.baseRent ?? 0;
    if (property.houses > 0) {
      return roundToTen(baseRent * HOUSE_RENT_MULTIPLIERS[Math.min(property.houses, 5)]);
    }
    return roundToTen(ownsFullColorGroup(state, property.ownerId, space.colorGroup) ? baseRent * 2 : baseRent);
  }

  return 0;
}

function transferCash(players: PlayerState[], fromId: number, toId: number, amount: number) {
  return players.map((player) => {
    if (player.id === fromId) {
      const nextCash = player.cash - amount;
      return { ...player, cash: Math.max(0, nextCash), isBankrupt: nextCash < 0 };
    }
    if (player.id === toId) {
      return { ...player, cash: player.cash + amount };
    }
    return player;
  });
}

function nextActivePlayerIndex(players: PlayerState[], currentIndex: number) {
  for (let offset = 1; offset <= players.length; offset += 1) {
    const nextIndex = (currentIndex + offset) % players.length;
    if (!players[nextIndex].isBankrupt) return nextIndex;
  }
  return currentIndex;
}

export function createInitialGameState(playerCount = 6): GameState {
  const players: PlayerState[] = Array.from({ length: playerCount }).map((_, index) => ({
    id: index + 1,
    name: SIX_PLAYER_PRESETS[index]?.name || `Player ${index + 1}`,
    cash: STARTING_CASH,
    position: 0,
    inJail: false,
    jailTurns: 0,
    getOutOfJailCards: 0,
    taxDebt: 0,
    taxDebtRounds: 0,
    isBankrupt: false,
  }));

  const properties: Record<number, PropertyOwnershipState> = {};
  VIETNAMESE_BOARD_SPACES.forEach((space) => {
    if (space.type === 'PROPERTY' || space.type === 'RAILROAD' || space.type === 'UTILITY') {
      properties[space.index] = {
        spaceIndex: space.index,
        ownerId: null,
        houses: 0,
        isMortgaged: false,
      };
    }
  });

  return {
    roomCode: 'LOCAL',
    taxPot: 0,
    players,
    activePlayerIndex: 0,
    properties,
    dice: [1, 1],
    hasRolled: false,
    doublesCount: 0,
    logs: [
      createLog('Welcome to Doraemon Monopoly. Roll dice to begin.', 'INFO'),
    ],
    selectedSpaceIndex: null,
    auctionState: null,
  };
}

export function reduceGameState(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return createInitialGameState(Math.max(2, Math.min(6, action.playerNames.length || 6)));
    }

    case 'ROLL_DICE': {
      if (state.auctionState?.isOpen) return state;
      if (state.hasRolled && state.dice[0] !== state.dice[1]) return state;

      const activePlayer = state.players[state.activePlayerIndex];
      if (!activePlayer || activePlayer.isBankrupt) return state;

      const die1 = action.forcedRoll ? action.forcedRoll[0] : Math.floor(Math.random() * 6) + 1;
      const die2 = action.forcedRoll ? action.forcedRoll[1] : Math.floor(Math.random() * 6) + 1;
      const rollSum = die1 + die2;
      const isDoubles = die1 === die2;
      const doublesCount = isDoubles ? state.doublesCount + 1 : 0;

      let nextPosition = (activePlayer.position + rollSum) % 40;
      let nextPlayers = state.players;
      let nextProperties = state.properties;
      let nextTaxPot = state.taxPot ?? 0;
      let logMessage = `${activePlayer.name} rolled ${die1} + ${die2} = ${rollSum}.`;

      if (doublesCount >= 3) {
        nextPlayers = state.players.map((player) =>
          player.id === activePlayer.id
            ? { ...player, position: JAIL_POSITION, inJail: true, jailTurns: 0 }
            : player
        );

        return {
          ...state,
          dice: [die1, die2],
          hasRolled: true,
          doublesCount: 0,
          players: nextPlayers,
          logs: [createLog(`${activePlayer.name} rolled three doubles and went to Jail.`, 'ALERT'), ...state.logs],
        };
      }

      if (activePlayer.position + rollSum >= 40) {
        const passGo = processPassGo({ ...state, properties: nextProperties }, nextPlayers, activePlayer.id, nextTaxPot);
        nextPlayers = passGo.players;
        nextProperties = passGo.properties;
        nextTaxPot = passGo.taxPot;
        logMessage += ` Passed GO and collected $${PASS_GO_CASH}.`;
        if (passGo.surcharge) logMessage += ` Tax debt surcharge: +$${passGo.surcharge}.`;
        if (passGo.paidAtDeadline) logMessage += ` Paid $${passGo.paidAtDeadline} at the three-lap deadline.`;
        if (passGo.soldNames.length) logMessage += ` Sold ${passGo.soldNames.join(', ')} to settle tax debt.`;
        if (passGo.becameBankrupt) logMessage += ' Could not settle tax debt after three laps and became bankrupt.';
      }

      const landedSpace = VIETNAMESE_BOARD_SPACES[nextPosition];
      const activeAfterPassGo = nextPlayers.find((player) => player.id === activePlayer.id) ?? activePlayer;

      if (landedSpace.type === 'CORNER' && landedSpace.index === GO_TO_JAIL_POSITION) {
        nextPosition = JAIL_POSITION;
        nextPlayers = nextPlayers.map((player) =>
          player.id === activePlayer.id
            ? { ...player, position: JAIL_POSITION, inJail: true, jailTurns: 0 }
            : player
        );
        logMessage += ' Went directly to Jail.';
      } else if (landedSpace.type === 'TAX') {
        const taxAmount = landedSpace.price || 100;
        nextPlayers = nextPlayers.map((player) => player.id === activePlayer.id ? { ...player, position: nextPosition } : player);
        const charge = chargeTax(nextPlayers, activePlayer.id, taxAmount);
        nextPlayers = charge.players;
        nextTaxPot += charge.paid;
        logMessage += ` Paid ${landedSpace.name}: $${charge.paid} into the tax pot${charge.debt ? `, tax debt $${charge.debt}` : ''}.`;
      } else if (landedSpace.type === 'CHANCE' || landedSpace.type === 'COMMUNITY_CHEST') {
        nextPlayers = nextPlayers.map((player) =>
          player.id === activePlayer.id ? { ...player, position: nextPosition } : player
        );

        const events = landedSpace.type === 'CHANCE' ? CHANCE_TAX_EVENTS : COMMUNITY_TAX_EVENTS;
        const event = events[Math.floor(Math.random() * events.length)];
        const result = resolveTaxCardEvent(state, nextPlayers, activePlayer.id, nextTaxPot, event);
        nextPlayers = result.players;
        nextTaxPot = result.taxPot;
        logMessage += ` ${result.message}`;
      } else {
        nextPlayers = nextPlayers.map((player) =>
          player.id === activePlayer.id ? { ...player, position: nextPosition } : player
        );

        if (landedSpace.index === JAIL_POSITION) {
          const jailedPlayers = nextPlayers.filter((player) => player.id !== activePlayer.id && player.inJail && !player.isBankrupt);
          for (const jailedPlayer of jailedPlayers) {
            const visitor = nextPlayers.find((player) => player.id === activePlayer.id);
            const gift = Math.min(visitor?.cash ?? 0, JAIL_VISIT_GIFT);
            if (gift <= 0) break;
            nextPlayers = transferCash(nextPlayers, activePlayer.id, jailedPlayer.id, gift);
            logMessage += ` Gave $${gift} to ${jailedPlayer.name} while visiting Jail.`;
          }
        }

        const landedOwnership = state.properties[nextPosition];
        if (landedOwnership?.ownerId && landedOwnership.ownerId !== activePlayer.id) {
          const rent = calculateRent(state, landedSpace, rollSum);
          if (rent > 0 && activeAfterPassGo.cash > 0) {
            nextPlayers = transferCash(nextPlayers, activePlayer.id, landedOwnership.ownerId, rent);
            const owner = state.players.find((player) => player.id === landedOwnership.ownerId);
            logMessage += ` Paid $${rent} rent to ${owner?.name ?? 'owner'}.`;
          }
        }
      }

      return {
        ...state,
        dice: [die1, die2],
        hasRolled: true,
        doublesCount,
        taxPot: nextTaxPot,
        properties: nextProperties,
        players: nextPlayers,
        logs: [createLog(logMessage, 'ACTION'), ...state.logs],
      };
    }

    case 'BUY_PROPERTY': {
      const { playerId, spaceIndex } = action;
      const space = VIETNAMESE_BOARD_SPACES[spaceIndex];
      const prop = state.properties[spaceIndex];
      const player = state.players.find((p) => p.id === playerId);

      if (!space || !prop || prop.ownerId !== null || !player || !space.price) return state;
      if (player.cash < space.price) return state;

      return {
        ...state,
        players: state.players.map((p) =>
          p.id === playerId ? { ...p, cash: p.cash - space.price! } : p
        ),
        properties: {
          ...state.properties,
          [spaceIndex]: { ...prop, ownerId: playerId },
        },
        auctionState: null,
        logs: [createLog(`${player.name} bought ${space.name} for $${space.price}.`, 'ACTION'), ...state.logs],
      };
    }

    case 'DECLINE_PROPERTY': {
      const prop = state.properties[action.spaceIndex];
      const space = VIETNAMESE_BOARD_SPACES[action.spaceIndex];
      if (!prop || prop.ownerId !== null || !space?.price) return state;

      return {
        ...state,
        auctionState: {
          isOpen: true,
          spaceIndex: action.spaceIndex,
          highestBid: 0,
          highestBidderId: null,
          passedPlayerIds: [],
        },
        logs: [createLog(`${space.name} is open for auction.`, 'ALERT'), ...state.logs],
      };
    }

    case 'PLACE_AUCTION_BID': {
      const auction = state.auctionState;
      const bidder = state.players.find((player) => player.id === action.playerId);
      if (!auction?.isOpen || !bidder || action.bidAmount % 10 !== 0 || bidder.cash < action.bidAmount || action.bidAmount <= auction.highestBid) {
        return state;
      }

      return {
        ...state,
        auctionState: {
          ...auction,
          highestBid: action.bidAmount,
          highestBidderId: action.playerId,
          passedPlayerIds: auction.passedPlayerIds.filter((id) => id !== action.playerId),
        },
        logs: [createLog(`${bidder.name} bid $${action.bidAmount}.`, 'ACTION'), ...state.logs],
      };
    }

    case 'PASS_AUCTION': {
      const auction = state.auctionState;
      if (!auction?.isOpen || auction.passedPlayerIds.includes(action.playerId)) return state;

      return {
        ...state,
        auctionState: {
          ...auction,
          passedPlayerIds: [...auction.passedPlayerIds, action.playerId],
        },
      };
    }

    case 'FINALIZE_AUCTION': {
      const auction = state.auctionState;
      if (!auction?.isOpen || auction.spaceIndex === null) return state;
      const space = VIETNAMESE_BOARD_SPACES[auction.spaceIndex];

      if (!auction.highestBidderId || auction.highestBid <= 0) {
        return withLog({ ...state, auctionState: null }, `Auction closed with no buyer for ${space.name}.`, 'INFO');
      }

      const winner = state.players.find((player) => player.id === auction.highestBidderId);
      const prop = state.properties[auction.spaceIndex];
      if (!winner || !prop || winner.cash < auction.highestBid) return state;

      return {
        ...state,
        players: state.players.map((player) =>
          player.id === winner.id ? { ...player, cash: player.cash - auction.highestBid } : player
        ),
        properties: {
          ...state.properties,
          [auction.spaceIndex]: { ...prop, ownerId: winner.id },
        },
        auctionState: null,
        logs: [createLog(`${winner.name} won ${space.name} for $${auction.highestBid}.`, 'ACTION'), ...state.logs],
      };
    }

    case 'BUILD_HOUSE': {
      const { playerId, spaceIndex } = action;
      const prop = state.properties[spaceIndex];
      const space = VIETNAMESE_BOARD_SPACES[spaceIndex];
      const player = state.players.find((p) => p.id === playerId);

      if (!space || space.type !== 'PROPERTY' || !prop || prop.ownerId !== playerId || prop.houses >= 5 || !player) {
        return state;
      }
      if (!canBuildEvenly(state, playerId, spaceIndex)) return state;

      const buildCost = getBuildCost(space);
      if (player.cash < buildCost) return state;

      return {
        ...state,
        players: state.players.map((p) =>
          p.id === playerId ? { ...p, cash: p.cash - buildCost } : p
        ),
        properties: {
          ...state.properties,
          [spaceIndex]: { ...prop, houses: prop.houses + 1 },
        },
        logs: [
          createLog(`${player.name} built on ${space.name} for $${buildCost}.`, 'ACTION'),
          ...state.logs,
        ],
      };
    }

    case 'MORTGAGE_PROPERTY': {
      const prop = state.properties[action.spaceIndex];
      const space = VIETNAMESE_BOARD_SPACES[action.spaceIndex];
      if (!prop || prop.ownerId !== action.playerId || !space?.price || prop.houses > 0) return state;

      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.playerId ? { ...player, cash: player.cash + roundToTen(space.price! / 2) } : player
        ),
        properties: {
          ...state.properties,
          [action.spaceIndex]: { ...prop, isMortgaged: true },
        },
        logs: [createLog(`${space.name} was mortgaged.`, 'PAYMENT'), ...state.logs],
      };
    }

    case 'PAY_TAX_DEBT': {
      const player = state.players.find((candidate) => candidate.id === action.playerId);
      const debt = player?.taxDebt ?? 0;
      if (!player || debt <= 0) return state;
      let availableCash = player.cash;
      let properties = state.properties;
      let soldNames: string[] = [];
      if (availableCash < debt) {
        const liquidation = liquidateForCash(properties, player.id, debt - availableCash);
        properties = liquidation.properties;
        availableCash += liquidation.proceeds;
        soldNames = liquidation.soldNames;
      }
      const payment = Math.min(availableCash, debt);
      const remainingDebt = debt - payment;
      return {
        ...state,
        taxPot: (state.taxPot ?? 0) + payment,
        properties,
        players: state.players.map((candidate) =>
          candidate.id === player.id
            ? { ...candidate, cash: availableCash - payment, taxDebt: remainingDebt, taxDebtRounds: remainingDebt === 0 ? 0 : candidate.taxDebtRounds, isBankrupt: candidate.isBankrupt || remainingDebt > 0 }
            : candidate
        ),
        logs: [createLog(`${player.name} paid $${payment} toward tax debt${soldNames.length ? ` after selling ${soldNames.join(', ')}` : ''}.`, 'PAYMENT'), ...state.logs],
      };
    }

    case 'SELECT_SPACE': {
      return {
        ...state,
        selectedSpaceIndex: action.spaceIndex,
      };
    }

    case 'END_TURN': {
      if (state.auctionState?.isOpen) return state;
      return {
        ...state,
        activePlayerIndex: nextActivePlayerIndex(state.players, state.activePlayerIndex),
        hasRolled: false,
        doublesCount: 0,
      };
    }

    default:
      return state;
  }
}
