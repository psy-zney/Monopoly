import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, Group, Mesh, MeshBasicMaterial, SRGBColorSpace } from 'three';
import { GameState } from '../../../core/types/game';
import { TILE_TOP, tilePosition } from './sceneGeometry';

type Point = [number,number,number];
function Box({at,size,color}:{at:Point;size:Point;color:string}) {
  return <mesh position={at} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.7}/></mesh>;
}
function Orb({at,r,color,scale=[1,1,1]}:{at:Point;r:number;color:string;scale?:Point}) {
  return <mesh position={at} scale={scale} castShadow><sphereGeometry args={[r,16,12]}/><meshStandardMaterial color={color} roughness={.6}/></mesh>;
}
function Sign({text,color,at,width=1}:{text:string;color:string;at:Point;width?:number}) {
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;
    const context=canvas.getContext('2d')!;context.fillStyle=color;context.fillRect(0,0,512,160);
    context.strokeStyle='#ffffff77';context.lineWidth=5;context.strokeRect(9,9,494,142);
    context.textAlign='center';context.fillStyle='#fff';context.font='900 64px sans-serif';context.fillText(text,256,104,460);
    const result=new CanvasTexture(canvas);result.colorSpace=SRGBColorSpace;return result;
  },[text,color]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <><Box at={at} size={[width,.32,.08]} color={color}/><mesh position={[at[0],at[1],at[2]+.044]}><planeGeometry args={[width,.31]}/><meshBasicMaterial map={texture}/></mesh></>;
}
function Lamp({at}:{at:Point}) {
  return <group position={at}>
    <mesh position={[0,.44,0]} castShadow><cylinderGeometry args={[.035,.045,.88,8]}/><meshStandardMaterial color="#50837b"/></mesh>
    <Box at={[0,.05,0]} size={[.16,.1,.16]} color="#ece2c5"/>
    <mesh position={[0,.95,0]}><sphereGeometry args={[.105,16,10]}/><meshStandardMaterial color="#fff5bc" emissive="#ffce72" emissiveIntensity={.4} roughness={.3}/></mesh>
    <mesh position={[0,1.09,0]} castShadow><coneGeometry args={[.17,.15,8]}/><meshStandardMaterial color="#458e82"/></mesh>
  </group>;
}
function FlowerBed({at,index}:{at:Point;index:number}) {
  return <group position={at}>
    <mesh receiveShadow><cylinderGeometry args={[.37,.42,.13,12]}/><meshStandardMaterial color="#e7b58c"/></mesh>
    <Orb at={[0,.15,0]} r={.34} scale={[1,.52,1]} color="#58ad70"/>
    {Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return<group key={i} position={[Math.cos(a)*.22,.29,Math.sin(a)*.22]}>
      <Orb at={[0,0,0]} r={.057} color={['#fff0a0','#fc98b3','#b0a5ed'][index%3]}/><Orb at={[0,.03,.03]} r={.025} color="#ffe086"/>
    </group>;})}
  </group>;
}
function Cloud({at,index,reducedMotion}:{at:Point;index:number;reducedMotion:boolean}) {
  const root=useRef<Group>(null);
  useFrame(({clock})=>{if(root.current&&!reducedMotion){root.current.position.x=at[0]+Math.sin(clock.elapsedTime*.07+index)*.6;root.current.position.y=at[1]+Math.sin(clock.elapsedTime*.2+index)*.12;}});
  return <group ref={root} position={at} scale={index%2 ? .8 : 1}>
    {[[0,0,0,1],[-.85,-.12,0,.7],[.85,-.16,.1,.75],[.25,.23,-.15,.75]].map(([x,y,z,r],i)=><mesh key={i} position={[x,y,z]} scale={[1,.45,.9]}><sphereGeometry args={[r,16,12]}/><meshBasicMaterial color="#fff" transparent opacity={.72} depthWrite={false}/></mesh>)}
  </group>;
}

export function GardenDetails({reducedMotion}:{reducedMotion:boolean}) {
  const balloon=useRef<Group>(null);
  useFrame(({clock})=>{if(balloon.current&&!reducedMotion){balloon.current.position.y=.55+Math.sin(clock.elapsedTime*.9)*.09;balloon.current.rotation.z=Math.sin(clock.elapsedTime*.7)*.035;}});
  return <>
    {[[-8.3,-.7,1.8],[8.4,-1.3,-2.6],[-3.8,-1.8,8.6],[1.2,-1.8,-8.8]].map((at,i)=><Cloud key={i} at={at as Point} index={i} reducedMotion={reducedMotion}/>)}
    {[[-3.55,.45],[-3.55,-2.05],[3.55,.45],[3.55,-2.05]].map(([x,z],i)=><FlowerBed key={i} at={[x,.48,z]} index={i}/>)}
    {[-3,3].flatMap(x=>[-1.45,1.1].map(z=><Lamp key={`${x}-${z}`} at={[x,.4,z]}/>))}
    {[-1,1].map(side=><group key={side} position={[side*6.7,.22,0]}>
      {[-2.7,-1.8,1.8,2.7].map(z=><React.Fragment key={z}><Box at={[0,.2,z]} size={[.07,.4,.07]} color="#faf0d3"/><Orb at={[0,.44,z]} r={.055} color="#f6d881"/></React.Fragment>)}
      {[-2.25,2.25].map(z=><Box key={z} at={[0,.3,z]} size={[.045,.07,.95]} color="#fff2d4"/>)}
    </group>)}
    <group position={[5.3,TILE_TOP,5.87]}>
      {[-.65,.65].map(x=><Box key={x} at={[x,.51,0]} size={[.1,1.02,.1]} color="#f0b853"/>)}
      <Sign text="XUẤT PHÁT" color="#43b394" at={[0,1.08,0]} width={1.46}/>
      {[-.65,.65].map(x=><Orb key={x} at={[x,1.27,0]} r={.1} color="#ffd268"/>)}
    </group>
    <group position={[-5.92,TILE_TOP,5.25]} rotation={[0,Math.PI/2,0]}>
      <Box at={[0,.28,0]} size={[.7,.56,.45]} color="#93b6cb"/><Box at={[0,.57,0]} size={[.81,.1,.55]} color="#517e99"/>
      <Box at={[0,.28,.235]} size={[.42,.3,.02]} color="#335b75"/>
      {[-.14,0,.14].map(x=><Box key={x} at={[x,.28,.25]} size={[.025,.31,.025]} color="#d3e6ee"/>)}
      <Sign text="THĂM TÙ" color="#517e99" at={[0,.7,0]} width={.8}/>
    </group>
    <group position={[-5.7,TILE_TOP,-5.83]}>
      <mesh position={[0,.025,0]} receiveShadow><cylinderGeometry args={[.59,.65,.06,24]}/><meshStandardMaterial color="#f6debd"/></mesh>
      <FlowerBed at={[0,.13,0]} index={1}/>
      <Box at={[.4,.37,0]} size={[.05,.74,.05]} color="#73a49b"/><Sign text="P" color="#66b9a7" at={[.4,.75,0]} width={.3}/>
    </group>
    <group ref={balloon} position={[6.2,.55,-6.1]}>
      <Orb at={[0,1.33,0]} r={.46} scale={[1,1.22,1]} color="#f6ae73"/>
      <Orb at={[0,1.33,.012]} r={.47} scale={[.45,1.22,1]} color="#ffde78"/>
      {[-1,1].map(side=><Box key={side} at={[side*.18,.64,0]} size={[.022,.55,.025]} color="#e6c79d"/>)}
      <Box at={[0,.37,0]} size={[.45,.28,.34]} color="#cfa078"/>
      <Sign text="ĐI TÙ" color="#ee977a" at={[0,.19,.2]} width={.64}/>
    </group>
    {Array.from({length:12},(_,i)=>{const a=i*2.4;return<group key={i} position={[Math.cos(a)*6.78,.21,Math.sin(a)*6.78]} rotation={[0,a,0]}>
      <Orb at={[0,.1,0]} r={.2} scale={[1,.6,.85]} color={i%2?'#5aaf74':'#9cd274'}/>
      <Orb at={[.11,.2,.06]} r={.045} color={i%3?'#fff3ac':'#f9aeb4'}/>
    </group>;})}
  </>;
}

type BurstData={id:number;at:Point;color:string;large:boolean};
function Burst({at,color,large,onComplete,reducedMotion}:{at:Point;color:string;large:boolean;onComplete:()=>void;reducedMotion:boolean}) {
  const root=useRef<Group>(null), age=useRef(0), complete=useRef(false), ripple=useRef<Mesh>(null);
  const completeRef=useRef(onComplete);completeRef.current=onComplete;
  useFrame((_,delta)=>{
    age.current+=delta;const t=age.current/(large?1.5:.7);
    if(root.current)root.current.children.forEach((particle,i)=>{
      const a=i*2.399, radius=(large ? .38 : .18)+(large?1.1:.5)*t;
      particle.position.set(Math.cos(a)*radius,Math.max(.02,Math.sin(Math.min(t,1)*Math.PI)*(large?1.45:.35)),Math.sin(a)*radius);
      particle.scale.setScalar(Math.max(0,1-t));particle.rotation.z+=delta*(i%2?3:-3);
    });
    if(ripple.current){ripple.current.scale.setScalar(.6+t*2.1);(ripple.current.material as MeshBasicMaterial).opacity=Math.max(0,.65*(1-t));}
    if(t>=1&&!complete.current){complete.current=true;completeRef.current();}
  });
  if(reducedMotion)return null;
  return <group position={at}>
    <group ref={root}>{Array.from({length:large?20:8},(_,i)=><mesh key={i}>{large?(i%2?<octahedronGeometry args={[.13,0]}/>:<cylinderGeometry args={[.1,.1,.035,12]}/>):<sphereGeometry args={[.065,8,6]}/>}<meshBasicMaterial color={i%3===0?'#fff7d9':color}/></mesh>)}</group>
    <mesh ref={ripple} rotation={[-Math.PI/2,0,0]} position={[0,.015,0]}><ringGeometry args={[.4,.435,40]}/><meshBasicMaterial color={color} transparent opacity={.6} depthWrite={false}/></mesh>
  </group>;
}

export function SceneEffects({gameState,positions,moving,dicePhase,reducedMotion}:{gameState:GameState;positions:Record<number,number>;moving:boolean;dicePhase:string;reducedMotion:boolean}) {
  const previous=useRef(gameState), wasMoving=useRef(moving), phase=useRef(dicePhase), id=useRef(0);
  const [bursts,setBursts]=useState<BurstData[]>([]);
  const add=(at:Point,color:string,large:boolean)=>setBursts(values=>[...values.slice(-4),{id:++id.current,at,color,large}]);
  useEffect(()=>{
    const before=previous.current;previous.current=gameState;
    if(reducedMotion||before.roomCode!==gameState.roomCode)return;
    Object.values(gameState.properties).forEach(property=>{
      const old=before.properties[property.spaceIndex];
      if(old && (property.houses>old.houses || property.ownerId!=null&&old.ownerId==null)){
        const [x,z]=tilePosition(property.spaceIndex);add([x,TILE_TOP+.12,z],property.houses>old.houses?'#42bfa6':'#ffb446',true);
      }
    });
  },[gameState,reducedMotion]);
  useEffect(()=>{
    if(wasMoving.current&&!moving&&!reducedMotion){const active=gameState.players[gameState.activePlayerIndex];const [x,z]=tilePosition(positions[active.id]??active.position);add([x,TILE_TOP+.02,z],'#fff0a8',false);}
    wasMoving.current=moving;
  },[moving,reducedMotion]);
  useEffect(()=>{
    if(phase.current==='opening'&&dicePhase==='result'&&!reducedMotion)add([0,.43,.75],'#fff5cc',false);
    phase.current=dicePhase;
  },[dicePhase,reducedMotion]);
  return <>{bursts.map(burst=><Burst key={burst.id} {...burst} reducedMotion={reducedMotion} onComplete={()=>setBursts(values=>values.filter(value=>value.id!==burst.id))}/>)}</>;
}
