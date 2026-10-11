import React, { useMemo } from 'react';
import IslandScene from './IslandScene';
import { useReducedMotion } from 'framer-motion';
import { createInitialGameState } from '../../../core/engine/reducer';
import { SceneBoundary } from './SceneBoundary';
import { TownIllustration } from '../../ui/TownIllustration';

export default function IslandPreview({ characterId }: { characterId: number }) {
  const gameState = useMemo(()=>createInitialGameState(2,characterId),[characterId]);
  const reducedMotion = Boolean(useReducedMotion());
  const positions = Object.fromEntries(gameState.players.map(player => [player.id, player.position]));
  return <SceneBoundary fallback={<TownIllustration/>}><IslandScene gameState={gameState} positions={positions} visiblePlayerIds={[characterId]} moving={false} zoom={1} view={0} following={false} reducedMotion={reducedMotion} dicePhase="idle" onSpaceClick={()=>{}} onHover={()=>{}}/></SceneBoundary>;
}
