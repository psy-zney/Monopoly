/**
 * Board geometry utility for standard 11x11 Monopoly grid.
 * Clockwise: Space 0 (Bottom-Right) -> 10 (Bottom-Left) -> 20 (Top-Left) -> 30 (Top-Right) -> 0.
 * Corner spaces: 1.6fr. Middle spaces: 1.0fr. Total: 12.2fr.
 */
export function getSpaceCoordinates(spaceIndex: number): { x: number; y: number } {
  const index = ((spaceIndex % 40) + 40) % 40;
  const TOTAL_FR = 12.2;
  const CORNER_FR = 1.6;
  const CORNER_HALF = CORNER_FR / 2;

  const toPct = (fr: number) => Math.round((fr / TOTAL_FR) * 10000) / 100;

  // Space 0: Bottom-Right Corner (BẮT ĐẦU)
  if (index === 0) {
    return { x: toPct(TOTAL_FR - CORNER_HALF), y: toPct(TOTAL_FR - CORNER_HALF) };
  }
  // Space 10: Bottom-Left Corner (THĂM TÙ)
  if (index === 10) {
    return { x: toPct(CORNER_HALF), y: toPct(TOTAL_FR - CORNER_HALF) };
  }
  // Space 20: Top-Left Corner (ĐẬU XE MIỄN PHÍ)
  if (index === 20) {
    return { x: toPct(CORNER_HALF), y: toPct(CORNER_HALF) };
  }
  // Space 30: Top-Right Corner (VÀO TÙ)
  if (index === 30) {
    return { x: toPct(TOTAL_FR - CORNER_HALF), y: toPct(CORNER_HALF) };
  }

  // Bottom Row: 1 to 9 (going Right to Left)
  if (index >= 1 && index <= 9) {
    const xFr = TOTAL_FR - CORNER_FR - (index - 0.5) * 1.0;
    return { x: toPct(xFr), y: toPct(TOTAL_FR - CORNER_HALF) };
  }

  // Left Column: 11 to 19 (going Bottom to Top)
  if (index >= 11 && index <= 19) {
    const yFr = TOTAL_FR - CORNER_FR - (index - 10 - 0.5) * 1.0;
    return { x: toPct(CORNER_HALF), y: toPct(yFr) };
  }

  // Top Row: 21 to 29 (going Left to Right)
  if (index >= 21 && index <= 29) {
    const xFr = CORNER_FR + (index - 20 - 0.5) * 1.0;
    return { x: toPct(xFr), y: toPct(CORNER_HALF) };
  }

  // Right Column: 31 to 39 (going Top to Bottom)
  const yFr = CORNER_FR + (index - 30 - 0.5) * 1.0;
  return { x: toPct(TOTAL_FR - CORNER_HALF), y: toPct(yFr) };
}
