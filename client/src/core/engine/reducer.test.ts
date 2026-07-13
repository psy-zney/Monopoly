import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInitialGameState, reduceGameState } from './reducer';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('custom tax pot rules', () => {
  it('puts income tax into the center pot', () => {
    const state = createInitialGameState(2);
    state.players[0].position = 2;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].position).toBe(4);
    expect(next.players[0].cash).toBe(1300);
    expect(next.taxPot).toBe(200);
  });

  it('always awards $200 after passing Start', () => {
    const state = createInitialGameState(2);
    state.players[0].position = 39;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].position).toBe(1);
    expect(next.players[0].cash).toBe(1700);
  });

  it('pays a rounded percentage of the pot on Chance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2); // 50% tier
    const state = createInitialGameState(2);
    state.players[0].position = 5;
    state.taxPot = 300;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].position).toBe(7);
    expect(next.players[0].cash).toBe(1650);
    expect(next.taxPot).toBe(150);
  });

  it('pays a fixed tax refund on Community Chest', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // 20% tier
    const state = createInitialGameState(2);
    state.taxPot = 100;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].position).toBe(2);
    expect(next.players[0].cash).toBe(1520);
    expect(next.taxPot).toBe(80);
  });
});

describe('tax card debt', () => {
  it('includes listed real-estate value in the 10% asset audit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // asset-audit event
    const state = createInitialGameState(2);
    state.players[0].position = 5;
    state.players[0].cash = 0;
    state.properties[39].ownerId = state.players[0].id;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].taxDebt).toBe(40);
    expect(next.taxPot).toBe(0);
  });

  it('adds a $20 surcharge after a lap when debt is at most $400', () => {
    const state = createInitialGameState(2);
    state.players[0].position = 39;
    state.players[0].taxDebt = 300;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].taxDebt).toBe(320);
    expect(next.players[0].taxDebtRounds).toBe(1);
  });

  it('forces payment and bankruptcy at the third-lap deadline', () => {
    const state = createInitialGameState(2);
    state.players[0].position = 39;
    state.players[0].cash = 0;
    state.players[0].taxDebt = 1000;
    state.players[0].taxDebtRounds = 2;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].taxDebt).toBe(850);
    expect(next.players[0].taxDebtRounds).toBe(3);
    expect(next.players[0].isBankrupt).toBe(true);
    expect(next.taxPot).toBe(200);
  });

  it('sells real estate before declaring bankruptcy', () => {
    const state = createInitialGameState(2);
    state.players[0].position = 39;
    state.players[0].cash = 0;
    state.players[0].taxDebt = 500;
    state.players[0].taxDebtRounds = 2;
    state.properties[39].ownerId = state.players[0].id;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].taxDebt).toBe(0);
    expect(next.players[0].cash).toBe(50);
    expect(next.players[0].isBankrupt).toBe(false);
    expect(next.properties[39].ownerId).toBeNull();
    expect(next.taxPot).toBe(550);
  });

  it('allows tax debt to be paid before its deadline', () => {
    const state = createInitialGameState(2);
    state.players[0].cash = 300;
    state.players[0].taxDebt = 200;
    state.players[0].taxDebtRounds = 1;

    const next = reduceGameState(state, { type: 'PAY_TAX_DEBT', playerId: 1 });

    expect(next.players[0].cash).toBe(100);
    expect(next.players[0].taxDebt).toBe(0);
    expect(next.players[0].taxDebtRounds).toBe(0);
    expect(next.taxPot).toBe(200);
  });
});

describe('Jail visit gift', () => {
  it('transfers $100 to each jailed player when visiting', () => {
    const state = createInitialGameState(3);
    state.players[0].position = 8;
    state.players[1].position = 10;
    state.players[1].inJail = true;
    state.players[2].position = 10;
    state.players[2].inJail = true;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].cash).toBe(1300);
    expect(next.players[1].cash).toBe(1600);
    expect(next.players[2].cash).toBe(1600);
  });
});

describe('ten-dollar denominations', () => {
  it('rounds small property rent to a $10 transaction', () => {
    const state = createInitialGameState(2);
    state.players[0].position = 39;
    state.properties[1].ownerId = state.players[1].id;

    const next = reduceGameState(state, { type: 'ROLL_DICE', forcedRoll: [1, 1] });

    expect(next.players[0].cash).toBe(1690);
    expect(next.players[1].cash).toBe(1510);
    expect(next.players.every((player) => player.cash % 10 === 0)).toBe(true);
  });

  it('rejects auction bids outside $10 increments', () => {
    const state = createInitialGameState(2);
    state.auctionState = {
      isOpen: true,
      spaceIndex: 1,
      highestBid: 0,
      highestBidderId: null,
      passedPlayerIds: [],
    };

    const next = reduceGameState(state, { type: 'PLACE_AUCTION_BID', playerId: 1, bidAmount: 15 });

    expect(next).toBe(state);
  });
});
