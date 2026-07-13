# MONOPOLY WEB CLIENT (FRONTEND)

This directory contains the **React + TypeScript + Vite + Tailwind CSS** frontend web application for the Monopoly board game.

## Architecture & Tech Stack
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + 11x11 CSS Grid layout
- **Animations:** Framer Motion (Token perimeter pathfinding & 3D Dice physics)
- **Audio:** Howler.js / Web Audio API
- **Real-Time Client:** Socket.io-client (for online multiplayer rooms)

## Directory Structure
```
client/
├── public/                 # Static media assets (tokens, board icons, audio SFX)
├── src/
│   ├── components/
│   │   ├── board/          # 11x11 Grid Board, Corner Spaces, Street Spaces
│   │   ├── center/         # Interior 9x9 Hub (Dice Tray, Log Feed, Cards)
│   │   ├── modals/         # Glassmorphism Modals (TitleDeed, Auction, Trade)
│   │   └── hud/            # Player stats bar, Header, Audio toggle
│   ├── core/               # Pure TypeScript Monopoly Engine (Shared rules & types)
│   │   ├── constants/      # Board spaces registry (40 spaces), $1500 starting cash
│   │   ├── types/          # Player, BoardSpace, GameAction, GameState interfaces
│   │   └── engine/         # Pure reducer reduceGameState(state, action)
│   ├── store/              # Zustand immutable store + LocalStorage auto-save
│   ├── net/                # Socket.io online multiplayer room client
│   └── styles/             # Design tokens & Tailwind utility imports
├── package.json
└── vite.config.ts
```

## Quick Start
```bash
cd client
npm install
npm run dev
```
