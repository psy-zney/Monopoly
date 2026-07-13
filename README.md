# MONOPOLY WEB APPLICATION & MULTIPLAYER PLATFORM

A modern, highly responsive, deterministic **Web-based Monopoly Board Game** featuring full Hasbro Classic Monopoly rules, a rich `11x11` CSS Grid interactive board, Framer Motion token animations, and Server-Authoritative Online Multiplayer support for 2–8 players across different networks.

---

## 🌳 PROJECT DIRECTORY TREE

```
Monopoly/
├── .claude/                             # AI Assistant & Agent awareness configurations
│   └── README.md                        # Guidelines for AI coding agents
│
├── skills/                              # Reusable Agent Skills & validation tools
│   ├── README.md
│   └── monopoly-rules-check/            # Classic Monopoly rule auditor skill
│       └── SKILL.md
│
├── Rule/                                # 📐 SINGLE SOURCE OF TRUTH (Specifications & Rules)
│   ├── README.md                        # Core constants ($1500, Limits) & 40-space Index Map
│   ├── OFFICIAL_RULES.md                # Full English Hasbro Classic Monopoly Rulebook
│   ├── TECHNICAL_SPEC.md                # 11x11 Grid Layout, TypeScript Data Models & UI Specs
│   ├── ARCHITECTURE_WORKFLOW.md         # 4-Tier Clean Architecture, Stack & Flow Diagrams
│   └── ONLINE_MULTIPLAYER_DEPLOYMENT.md # Real-Time WebSocket Topology & Deployment Guide
│
├── client/                              # 🖥️ FRONTEND WEB APP (React 18 + TS + Vite + Tailwind)
│   ├── package.json                     # Frontend dependencies (Framer Motion, Howler, Zustand)
│   ├── README.md                        # Client architecture & component hierarchy guide
│   └── src/                             # UI components, modals, 11x11 board, & pure TS engine
│
├── server/                              # 🌐 REAL-TIME WEBSOCKET SERVER (Node.js + Socket.io + TS)
│   ├── package.json                     # Server dependencies (Express, Socket.io, CORS)
│   ├── README.md                        # Authoritative room server architecture guide
│   └── src/                             # Room management, WebSocket event broadcasters
│
├── MONOPOLY_RULES.md                    # Comprehensive rules overview (Vietnamese summary)
└── README.md                            # Root project documentation & Quick Start (This file)
```

---

## 🚀 QUICK START & DEVELOPMENT

### 1. Standalone Client Play (No Backend Needed)
Run the React frontend locally to play 2–8 players Pass-and-Play or vs. AI Bots:
```bash
cd client
npm install
npm run dev
```

### 2. Real-Time Online Multiplayer (2–8 Players Across Internet)
Start the WebSocket Server alongside the Frontend:
```bash
# Terminal 1: Start Real-Time WebSocket Server (Port 3001)
cd server
npm install
npm run dev

# Terminal 2: Start Frontend Web Client (Port 5173)
cd client
npm install
npm run dev
```

---

## 📖 DOCUMENTATION INDEX
- For **Game Rules & Mechanics**, read **[Rule/OFFICIAL_RULES.md](file:///c:/Users/admin/MyProject/Monopoly/Rule/OFFICIAL_RULES.md)**.
- For **Technical Specifications & Board Layout**, read **[Rule/TECHNICAL_SPEC.md](file:///c:/Users/admin/MyProject/Monopoly/Rule/TECHNICAL_SPEC.md)**.
- For **System Architecture & Workflow**, read **[Rule/ARCHITECTURE_WORKFLOW.md](file:///c:/Users/admin/MyProject/Monopoly/Rule/ARCHITECTURE_WORKFLOW.md)**.
- For **Online Multiplayer Deployment (Vercel + Render)**, read **[Rule/ONLINE_MULTIPLAYER_DEPLOYMENT.md](file:///c:/Users/admin/MyProject/Monopoly/Rule/ONLINE_MULTIPLAYER_DEPLOYMENT.md)**.
