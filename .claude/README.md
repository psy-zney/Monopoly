# AI AGENT & ASSISTANT CONFIGURATION (.claude)

This directory defines instructions, behavior guidelines, and project awareness settings for AI assistants (Claude Code, Gemini, Antigravity) working inside this repository.

## Rules & Guidelines for Agents
1. **Always Read Specifications First:** Before generating or modifying code, check `Rule/README.md`, `Rule/OFFICIAL_RULES.md`, and `Rule/TECHNICAL_SPEC.md`.
2. **Pure Deterministic Engine Separation:** Do not mix React state hooks or DOM APIs into `client/src/core/engine/`. Keep core engine functions 100% pure TypeScript.
3. **No Placeholders:** Always implement complete, working logic for board spaces, rent calculations, and UI modals.
