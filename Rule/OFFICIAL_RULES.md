# MONOPOLY BOARD GAME - OFFICIAL RULEBOOK

This document serves as the **Official Rulebook** for the Monopoly gameboard system. All game mechanics, state transitions, UI/UX behaviors, and AI logic must strictly conform to these rules (Hasbro Classic Monopoly Standard).

---

## TABLE OF CONTENTS
1. [Game Overview & Objective](#1-game-overview--objective)
2. [Components & Game Setup](#2-components--game-setup)
3. [Turn Flow & Dice Rules](#3-turn-flow--dice-rules)
4. [Board Spaces & Space Actions](#4-board-spaces--space-actions)
5. [Buying, Auctions & Paying Rent](#5-buying-auctions--paying-rent)
6. [Building Houses & Hotels](#6-building-houses--hotels)
7. [Jail & Getting Out of Jail](#7-jail--getting-out-of-jail)
8. [Trading & Property Exchanges](#8-trading--property-exchanges)
9. [Mortgages & Unmortgaging](#9-mortgages--unmortgaging)
10. [Bankruptcy & Winning the Game](#10-bankruptcy--winning-the-game)
11. [Short / Timed Game Rules](#11-short--timed-game-rules)

---

## 1. GAME OVERVIEW & OBJECTIVE
- **Players:** 2 to 8 players.
- **Objective:** Become the **only player left not bankrupt** by buying, renting, trading, and developing properties on the board.

---

## 2. COMPONENTS & GAME SETUP

### 2.1. Standard Components
- **40-Space Game Board:** 28 Title Deed properties (22 Colored Street properties, 4 Railroads, 2 Utilities), 3 Chance spaces, 3 Community Chest spaces, 2 Tax spaces, and 4 Corner spaces (`GO`, `Jail / Just Visiting`, `Free Parking`, `Go to Jail`).
- **2 Six-Sided Dice** & **Player Tokens**.
- **28 Title Deed Cards**, **16 Chance Cards**, **16 Community Chest Cards**.
- **32 Houses (Green)** & **12 Hotels (Red)**.

### 2.2. Starting Bankroll ($1,500 per Player)
Each player begins with **$1,500** distributed as follows:
- **2 x $500** = $1,000
- **4 x $100** = $400
- **1 x $50** = $50
- **1 x $20** = $20
- **2 x $10** = $20
- **1 x $5** = $5
- **5 x $1** = $5

### 2.3. The Banker
- The Bank holds all remaining money, Title Deeds, Houses, and Hotels.
- The Bank **never goes bankrupt**. If the Bank runs out of physical bills, the Banker may issue notes or track balances digitally.

---

## 3. TURN FLOW & DICE RULES

On your turn:
1. **Roll both dice** and move your token clockwise the number of spaces equal to the total shown on the dice.
2. Resolve the action of the space you land on.
3. **Doubles Rule:**
   - If you roll doubles (e.g., `4-4`), resolve your space action and then **take another turn** (roll again).
   - > [!WARNING]
     > **Speeding / 3 Consecutive Doubles:** If you roll doubles **3 times in succession on the same turn**, immediately move your token to **In Jail** upon the 3rd roll. Do not move the distance of the 3rd roll, and your turn ends immediately.

---

## 4. BOARD SPACES & SPACE ACTIONS

### 4.1. GO (Index 0)
- Whenever you land on or pass `GO` moving clockwise, collect **$200** from the Bank.

### 4.2. Chance & Community Chest
- Draw the top card from the respective deck, read it aloud, and **execute the instruction immediately**.
- Return the card to the bottom of the deck (except **Get Out of Jail Free** cards, which are kept until used or traded).

### 4.3. Taxes
- **Income Tax (Index 4):** Pay **$200** to the Bank.
- **Luxury Tax (Index 38):** Pay **$100** to the Bank.

### 4.4. Jail / Just Visiting (Index 10)
- If you land here by ordinary dice movement, place your token on the **Just Visiting** section. You incur no penalty and take normal turns.

### 4.5. Free Parking (Index 20)
- Official rules state this is a **free resting space**. No money is collected or paid, and no action occurs.

### 4.6. Go to Jail (Index 30)
- Move your token immediately to the **In Jail** space (Index 10).
- Do not pass `GO` and do not collect $200. Your turn ends immediately.

---

## 5. BUYING, AUCTIONS & PAYING RENT

### 5.1. Unowned Properties
When you land on an unowned Street, Railroad, or Utility:
1. **Buy at List Price:** Pay the price printed on the board to the Bank and receive the Title Deed card.
2. **Decline to Buy -> Mandatory Auction:**
   - If you decline to buy at the printed price, the Banker **must immediately auction** the property to the highest bidder.
   - **All players** (including the player who declined to buy at list price) may bid.
   - Bidding may start at any amount (e.g., $1 or $10).

### 5.2. Owned Properties (Paying Rent)
If you land on an unmortgaged property owned by another player, you must pay rent according to the Title Deed card:

#### A. Colored Street Properties
- **Unimproved Street:** Pay the base rent shown on the card.
  > [!IMPORTANT]
  > **Monopoly Bonus (Color Group Ownership):** If the owner owns **all properties of that color group** (and none are mortgaged), the rent for unimproved properties in that color group is **DOUBLED (x2)**.
- **Improved Street (Houses/Hotels):** Pay the increased rent shown for the respective number of Houses or Hotel.

#### B. Railroads (4 total)
Rent depends on the **total number of Railroads owned** by that player:
- 1 Railroad owned: **$25**
- 2 Railroads owned: **$50**
- 3 Railroads owned: **$100**
- 4 Railroads owned: **$200**

#### C. Utilities (Electric Company & Water Works)
Rent depends on the **dice roll** that landed the player on the Utility:
- 1 Utility owned: Rent = **Dice Roll x 4**
- 2 Utilities owned: Rent = **Dice Roll x 10**

> [!NOTE]
> The property owner **must ask for rent** before the next player rolls the dice. If the next player rolls before rent is demanded, the rent claim is forfeited for that turn.

---

## 6. BUILDING HOUSES & HOTELS

### 6.1. Prerequisites
- You must own **all properties of a color group (Monopoly)** before building Houses or Hotels on any property in that group.
- No property in that color group may be mortgaged.

### 6.2. Even Build Rule
- You must build **evenly** across all properties in a color group:
  - You cannot build a 2nd House on a property until every property in that color group has at least 1 House.
  - Similarly, selling Houses back to the Bank must be done evenly.

### 6.3. Hotels
- When a property has **4 Houses**, you can pay the Hotel cost to upgrade to **1 Hotel** (returning the 4 Houses to the Bank).
- Maximum of **1 Hotel** per property.

### 6.4. Housing Shortage
- The Bank holds a strict limit of **32 Houses** and **12 Hotels**.
- If the Bank has no Houses left, players must wait for another player to sell Houses or upgrade to Hotels.
- If multiple players want to buy the last remaining Houses, the Banker **must auction** them to the highest bidder.

---

## 7. JAIL & GETTING OUT OF JAIL

### 7.1. Rights While In Jail
> [!TIP]
> Being in Jail **does not strip your business rights**. While in Jail, you **CAN STILL**:
> - Collect rent from other players.
> - Trade or sell properties to other players.
> - Buy Houses/Hotels or mortgage/unmortgage properties.

### 7.2. Three Ways to Get Out of Jail

| Method | Details |
| :--- | :--- |
| **1. Pay $50 Fine** | Pay **$50** to the Bank at the start of your turn (before rolling). Then roll and move normally. |
| **2. Use "Get Out of Jail Free" Card** | Play a **Get Out of Jail Free** card (held or purchased from another player). Return it to the deck, then roll and move normally. |
| **3. Roll Doubles** | Roll the dice on your turn. If you roll **Doubles**, you immediately get out of Jail and move the number of spaces shown on the dice (*do not roll again*). |

> [!IMPORTANT]
> **3-Turn Maximum:** If you fail to roll doubles on your 3rd turn in Jail, you **must pay the $50 fine** immediately after the 3rd roll, then move out of Jail the number of spaces shown on that 3rd roll.

---

## 8. TRADING & PROPERTY EXCHANGES
- Players may trade unimproved properties, Railroads, Utilities, Get Out of Jail Free cards, and cash with each other at any time.
- **Improved Properties Cannot Be Traded:** All Houses/Hotels on a color group must be sold back to the Bank (at 50% list price) before any property in that color group can be traded or mortgaged.

---

## 9. MORTGAGES & UNMORTGAGING
- **Mortgage Value:** 50% of the property's purchase price (printed on the back of the card).
- **No Rent:** Mortgaged properties collect no rent. However, unmortgaged properties in the same color group still collect double rent on unimproved lots.
- **Unmortgage Cost:** Pay the mortgage value **+ 10% interest** to the Bank.
- **Transferring Mortgaged Properties:** If you receive a mortgaged property in a trade, you must immediately pay **10% interest** to the Bank. You may unmortgage it immediately by paying the principal; if you keep it mortgaged, you must pay another 10% interest later when unmortgaging.

---

## 10. BANKRUPTCY & WINNING THE GAME
- **Bankrupt to the Bank:** If you owe the Bank more than your total liquidatable assets (cash, selling houses at 50%, mortgaging properties), you turn over all assets to the Bank. The Bank immediately **auctions** each property to the remaining players.
- **Bankrupt to Another Player:** Turn over all remaining cash, properties, and Get Out of Jail Free cards to the creditor. The creditor must immediately pay 10% mortgage interest on any mortgaged properties received.
- **Winner:** The last remaining player with money and assets when all other players are bankrupt.
