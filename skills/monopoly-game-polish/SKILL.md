---
name: monopoly-game-polish
description: Coordinates Monopoly-specific game UI, background music, sound effects, gameplay feedback, and rule-safe polish for the React/Vite Monopoly web game.
---

# Monopoly Game Polish

Use this skill when improving the Monopoly web game experience in this repo, especially for UI, HUD/menu flow, background music, sound effects, turn feedback, animation, and gameplay feel.

## Project Context

- Client: React + Vite + TypeScript.
- UI/animation: Tailwind CSS, Framer Motion, Lucide React.
- Audio runtime: Howler is already installed; Web Audio API can also be used for procedural SFX if appropriate.
- Realtime: Socket.IO client/server.
- Rule validation: pair gameplay changes with `monopoly-rules-check`.

## Related Skills To Combine

- `game-ui-ux`: responsive HUD, menus, safe areas, keyboard/gamepad focus, event-driven HUD updates.
- `game-ui-design`: visual hierarchy, readability, game menu/HUD design, accessibility and controller/touch considerations.
- `audio-design`: bus/mixer architecture, dB gain staging, ducking, SFX variation, adaptive music, beat sync.
- `game-audio`: browser-game BGM/SFX implementation patterns, especially Web Audio API procedural sounds.
- `game-feel`: punchy feedback, easing, hit-stop equivalents, screen shake, animation timing, layered feedback.
- `game-developer`: gameplay architecture, state machines, performance, multiplayer game-system implementation.
- `game-engine`: web game loop, rendering/input/audio concepts, browser performance constraints.
- `level-design`: pacing, player flow, board-state readability, turn tension/rest moments.

## Monopoly-Specific Priorities

1. Preserve official Monopoly rules. Do not add polish that changes rule outcomes unless explicitly requested.
2. Keep the board readable before adding effects. Property ownership, rent, mortgages, houses/hotels, current player, dice, cash, and pending action must be clear.
3. Treat audio as feedback, not noise:
   - Dice roll: short tactile roll + landing accent.
   - Property purchase/auction: confirm/attention cue.
   - Rent payment: coin transfer cue with amount-scaled variation.
   - Jail/tax/bankruptcy: distinct negative cue.
   - Turn start: subtle player-identifying cue.
4. Use motion to explain state transitions:
   - Dice result leads to token movement.
   - Token landing leads to property/action panel.
   - Money transfer leads to balance update.
   - Auction bid updates are immediate and visually ordered.
5. Respect browser autoplay rules. Initialize or resume audio only after user interaction.
6. Provide mute/music/SFX controls and persist preferences locally.

## Implementation Checklist

Before changing code:

1. Inspect current client structure and state flow.
2. Identify source of truth for game state; avoid duplicating derived state in UI.
3. Map each audio/visual effect to a real game event.
4. Confirm whether assets should be file-based via Howler or procedural via Web Audio.

When implementing:

1. Add small, isolated components/services first: audio manager, SFX map, music controller, animation helpers.
2. Wire effects through game events/state transitions rather than polling.
3. Keep fallback behavior silent and non-blocking if audio fails.
4. Use reduced-motion/accessibility preferences where applicable.
5. Run build/tests after implementation.

When reviewing:

1. Verify no rule behavior changed accidentally.
2. Verify audio does not start before interaction.
3. Verify mute works for both BGM and SFX.
4. Verify UI remains usable on small screens.
5. Verify repeated events do not stack runaway sounds or animations.
