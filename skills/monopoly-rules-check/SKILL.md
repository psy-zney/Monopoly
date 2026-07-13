---
name: monopoly-rules-check
description: Audits code implementations to ensure full compliance with Hasbro Classic Monopoly rules and deterministic engine architecture.
---

# Monopoly Rules Compliance Auditor

When validating any code change in `client/src/core/` or `server/src/engine/`:
1. Check that unowned properties triggering a decline to buy **immediately launch an open auction** (`maxPlayers` bidding).
2. Verify that unimproved color groups with full ownership double the base rent (`rent * 2`).
3. Ensure players In Jail retain full rights to collect rent, trade, build, and mortgage.
4. Verify Even Build rule prevents building House #2 on a property if any property in the group has 0 Houses.
