# MONOPOLY REAL-TIME WEBSOCKET SERVER (BACKEND)

This directory contains the authoritative **Node.js + Express + Socket.io + TypeScript** server for Online Multiplayer rooms (supporting 2–8 players across different networks).

## Architecture & Features
- **Authoritative Engine:** Imports and executes the deterministic `reduceGameState` reducer to prevent client-side cheating.
- **Room Management:** Generates 6-character room codes (`MONO-89`), manages player join/ready states, and broadcasts synchronized state updates.
- **Graceful Reconnection:** Stores session tokens allowing dropped players a 60-second window to reconnect without forfeiting their turn.
- **Cloud Ready:** Optimized for free/scalable deployment on **Render.com**, **Railway.app**, or **Fly.io** (`wss://` automatic SSL support).

## Directory Structure
```
server/
├── src/
│   ├── engine/          # Authoritative Pure TypeScript Reducer & Validator
│   ├── rooms/           # Room manager & Lobby session store
│   ├── sockets/         # Socket.io event listeners & broadcasters
│   └── index.ts         # Express HTTP + Socket.io server entry point
├── package.json
└── tsconfig.json
```

## Quick Start
```bash
cd server
npm install
npm run dev
```
