import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import {
  CatMood,
  createMillionaireCatModel,
  disposeMillionaireCatModel,
  MillionaireCatRig,
} from '../../three/models/millionaire-cat/createMillionaireCatModel';

interface AnimatedCatProps {
  accentColor: string;
  mood: CatMood;
  seatIndex: number;
  reduceMotion: boolean;
}

const AnimatedCat: React.FC<AnimatedCatProps> = ({ accentColor, mood, seatIndex, reduceMotion }) => {
  const rig = useMemo<MillionaireCatRig>(() => createMillionaireCatModel(accentColor), [accentColor]);
  const rootRef = useRef<THREE.Group>(rig.root);

  useEffect(() => () => disposeMillionaireCatModel(rig.root), [rig]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime() + seatIndex * 0.43;
    const root = rootRef.current;
    const smoothing = Math.min(1, delta * 7);
    const seatLean = seatIndex < 3 ? -0.12 : 0.12;

    const positiveBounce = mood === 'positive' && !reduceMotion ? Math.abs(Math.sin(t * 8)) * 0.12 : 0;
    const idleBob = mood === 'idle' && !reduceMotion ? Math.sin(t * 2.2) * 0.025 : 0;
    const sadDrop = mood === 'negative' ? -0.08 : 0;
    root.position.y = THREE.MathUtils.lerp(root.position.y, positiveBounce + idleBob + sadDrop, smoothing);
    root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, seatLean, smoothing);
    root.rotation.z = THREE.MathUtils.lerp(
      root.rotation.z,
      mood === 'positive' && !reduceMotion ? Math.sin(t * 10) * 0.045 : 0,
      smoothing,
    );

    rig.headPivot.rotation.x = THREE.MathUtils.lerp(
      rig.headPivot.rotation.x,
      mood === 'negative' ? 0.22 : mood === 'positive' ? -0.08 : 0,
      smoothing,
    );
    rig.coinArmPivot.rotation.z = THREE.MathUtils.lerp(
      rig.coinArmPivot.rotation.z,
      mood === 'positive' && !reduceMotion ? -0.64 + Math.sin(t * 9) * 0.18 : mood === 'negative' ? -0.4 : -0.64,
      smoothing,
    );
    rig.tailPivot.rotation.y = reduceMotion ? 0 : Math.sin(t * (mood === 'positive' ? 5 : 2.4)) * 0.16;
    const earDroop = mood === 'negative' ? 0.28 : 0;
    rig.leftEarPivot.rotation.z = THREE.MathUtils.lerp(rig.leftEarPivot.rotation.z, earDroop, smoothing);
    rig.rightEarPivot.rotation.z = THREE.MathUtils.lerp(rig.rightEarPivot.rotation.z, -earDroop, smoothing);
  });

  return <primitive ref={rootRef} object={rig.root} scale={0.72} position={[0, 0.15, 0]} />;
};

export interface PlayerCatAvatar3DProps {
  accentColor: string;
  mood?: CatMood;
  seatIndex: number;
}

export const PlayerCatAvatar3D: React.FC<PlayerCatAvatar3DProps> = ({
  accentColor,
  mood = 'idle',
  seatIndex,
}) => {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <div className="h-[88px] w-[92px]" aria-hidden="true">
      <Canvas
        orthographic
        dpr={[1, 1.25]}
        camera={{ position: [3.3, 2.5, 6], zoom: 50, near: 0.1, far: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={1.35} />
        <directionalLight position={[3, 5, 6]} intensity={2.6} color="#fff3da" />
        <directionalLight position={[-4, 2, 2]} intensity={1.2} color="#bfe6ff" />
        <Suspense fallback={null}>
          <AnimatedCat
            accentColor={accentColor}
            mood={mood}
            seatIndex={seatIndex}
            reduceMotion={reduceMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
