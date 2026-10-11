import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { CanvasTexture, ExtrudeGeometry, Group, MathUtils, Mesh, MeshBasicMaterial, OrthographicCamera, PCFSoftShadowMap, Shape, SRGBColorSpace, Vector3 } from 'three';
import { BoardSpaceData, VIETNAMESE_BOARD_SPACES } from '../../../core/constants/vietnameseBoardData';
import { GameState, PlayerState, PropertyOwnershipState } from '../../../core/types/game';
import { getPlayerPreset } from '../../../core/types/playerTokens';
import { CharacterModel } from './CharacterModel';
import { GROUP_COLORS, HOP_SECONDS, TILE_TOP, tilePosition, tileRotation } from './sceneGeometry';
import { GardenDetails, SceneEffects } from './WorldDetails';

type Point = [number, number, number];
function Block({ at, size, color, rotation = [0, 0, 0] }: { at: Point; size: Point; color: string; rotation?: Point }) {
  return <mesh position={at} rotation={rotation} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.8}/></mesh>;
}

function Slab({ width, depth, height, y, color, radius = .2 }: { width: number; depth: number; height: number; y: number; color: string; radius?: number }) {
  const geometry = useMemo(() => {
    const x = -width / 2, z = -depth / 2, r = radius;
    const shape = new Shape();
    shape.moveTo(x + r, z); shape.lineTo(x + width - r, z); shape.quadraticCurveTo(x + width, z, x + width, z + r);
    shape.lineTo(x + width, z + depth - r); shape.quadraticCurveTo(x + width, z + depth, x + width - r, z + depth);
    shape.lineTo(x + r, z + depth); shape.quadraticCurveTo(x, z + depth, x, z + depth - r);
    shape.lineTo(x, z + r); shape.quadraticCurveTo(x, z, x + r, z);
    return new ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .05, bevelThickness: .04, curveSegments: 4 });
  }, [width, depth, height, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} rotation={[-Math.PI/2,0,0]} position={[0,y,0]} castShadow receiveShadow><meshStandardMaterial color={color} roughness={1}/></mesh>;
}

function useCanvasTexture(draw: (context: CanvasRenderingContext2D) => void, deps: React.DependencyList, width = 512, height = 768) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    draw(canvas.getContext('2d')!);
    const result = new CanvasTexture(canvas); result.colorSpace = SRGBColorSpace; result.anisotropy = 4;
    return result;
  }, deps);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Tile({ space, ownership, active, selected, onClick, onHover }: { space: BoardSpaceData; ownership?: PropertyOwnershipState; active: boolean; selected: boolean; onClick: () => void; onHover: (index: number | null) => void }) {
  const corner = space.type === 'CORNER';
  const [x,z] = tilePosition(space.index);
  const color = GROUP_COLORS[space.colorGroup ?? ''];
  const ownerColor = ownership?.ownerId != null ? getPlayerPreset(ownership.ownerId).colorHex : undefined;
  const texture = useCanvasTexture(ctx => {
    const h = corner ? 512 : 768;
    ctx.fillStyle = space.type === 'CHANCE' ? '#fff0da' : space.type === 'COMMUNITY_CHEST' ? '#e7f3fe' : space.type === 'TAX' ? '#ffe8e4' : corner ? '#e2f4d3' : '#fffaf0';
    ctx.fillRect(0,0,512,h);
    ctx.strokeStyle = '#d1d6c9'; ctx.lineWidth = 6; ctx.strokeRect(4,4,504,h-8);
    if (color) { ctx.fillStyle = color; ctx.fillRect(8,8,496,116); ctx.fillStyle = '#fff'; ctx.globalAlpha = .22; ctx.fillRect(8,8,496,15); ctx.globalAlpha = 1; }
    ctx.textAlign = 'center'; ctx.fillStyle = '#344b4c';
    if (!color) {
      const symbol = corner ? ({0:'➜',10:'▥',20:'P',30:'!'}[space.index] ?? '') : space.type === 'CHANCE' ? '?' : space.type === 'COMMUNITY_CHEST' ? '✦' : space.type === 'RAILROAD' ? '↔' : space.type === 'UTILITY' ? (space.index===12 ? 'ϟ':'≈') : '₫';
      ctx.fillStyle = space.type === 'CHANCE' ? '#cb8251' : space.type === 'COMMUNITY_CHEST' ? '#6e8fab' : '#729272';
      ctx.font = `900 ${corner ? 100 : 142}px sans-serif`; ctx.fillText(symbol,256,corner ? 174 : 300);
    }
    ctx.fillStyle = '#244750'; ctx.font = `800 ${corner ? 46 : 46}px sans-serif`;
    const lines = space.shortName.split('\n');
    lines.forEach((line,index) => ctx.fillText(line,256,(corner ? 300 : color ? 393 : 451) + index*58,470));
    if (space.price) { ctx.fillStyle = '#33596a'; ctx.font = '900 64px sans-serif'; ctx.fillText(String(space.price),256,662); }
    if (corner) { ctx.font = '700 29px sans-serif'; ctx.fillStyle = '#6d856d'; ctx.fillText(space.index===0 ? '+200 / VÒNG' : space.index===10 ? 'NGHỈ CHÂN' : space.index===20 ? 'CÔNG VIÊN' : 'ĐẾN Ô THĂM TÙ',256,390,480); }
    if (ownerColor) { ctx.fillStyle=ownerColor; ctx.fillRect(10,h-38,492,28); }
  }, [space, ownerColor], 512, corner ? 512 : 768);
  return <group position={[x,0,z]} rotation={[0,tileRotation(space.index),0]} onClick={event=>{event.stopPropagation();onClick();}} onPointerOver={event=>{event.stopPropagation();onHover(space.index);document.body.style.cursor='pointer';}} onPointerOut={()=>{onHover(null);document.body.style.cursor='';}}>
    <mesh position={[0,TILE_TOP-.1,0]} castShadow receiveShadow><boxGeometry args={[corner?1.57:.97,.2,1.57]}/><meshStandardMaterial color={active ? '#e9bd4d' : selected ? '#84c9b8' : '#c7bba9'} roughness={.8}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,TILE_TOP+.002,0]} receiveShadow><planeGeometry args={[corner?1.55:.95,1.55]}/><meshStandardMaterial map={texture} roughness={1} color={ownership?.isMortgaged ? '#9c9c9c' : '#fff'}/></mesh>
    {(active || selected) && <group position={[0,TILE_TOP+.025,0]}>{[-1,1].map(side=><React.Fragment key={side}><Block at={[side*(corner ? .79 : .49),0,0]} size={[.045,.04,1.61]} color={active?'#ffd961':'#98e0c9'}/><Block at={[0,0,side*.79]} size={[corner?1.61:1.01,.04,.045]} color={active?'#ffd961':'#98e0c9'}/></React.Fragment>)}</group>}
    {ownership?.ownerId != null && <group position={[0,TILE_TOP,-.49]} scale={corner? .8:.64}><Building key={`${ownership.ownerId}-${ownership.houses}`} color={ownerColor!} level={ownership.houses} mortgaged={ownership.isMortgaged}/></group>}
    {space.type==='RAILROAD' && <group position={[0,TILE_TOP,-.5]} scale={.55}><Block at={[0,.16,0]} size={[.75,.3,.38]} color="#557d87"/><Block at={[0,.37,0]} size={[.83,.13,.48]} color="#eed097"/>{[-.2,.2].map(v=><Block key={v} at={[v,.18,.2]} size={[.13,.11,.025]} color="#d6f2ed"/>)}</group>}
    {space.type==='UTILITY' && <mesh position={[0,TILE_TOP+.18,-.48]} castShadow><cylinderGeometry args={[.17,.2,.35,10]}/><meshStandardMaterial color={space.index===12?'#dfb654':'#70bccc'}/></mesh>}
  </group>;
}

function Building({ color, level, mortgaged = false }: { color: string; level: number; mortgaged?: boolean }) {
  const root = useRef<Group>(null);
  const born = useRef<number | null>(null);
  const reducedMotion = Boolean(useReducedMotion());
  useFrame(({clock})=>{
    if (!root.current || reducedMotion) return;
    if (born.current===null) born.current=clock.elapsedTime;
    const p=Math.min(1,(clock.elapsedTime-born.current)/.55);
    root.current.scale.y=p<1 ? Math.max(.05,1-Math.cos(p*Math.PI*3)*Math.exp(-p*5)) : 1;
  });
  const floors=level===5?4:Math.max(1,level);
  const h=.26+floors*.18;
  const tint=mortgaged?'#999c91':color;
  if (level===0) return <group ref={root}><Block at={[0,.04,0]} size={[.55,.08,.46]} color="#efe6cd"/><mesh position={[0,.35,0]} castShadow><cylinderGeometry args={[.027,.027,.6,6]}/><meshStandardMaterial color="#8d7961"/></mesh><Block at={[.17,.52,0]} size={[.34,.21,.045]} color={tint}/><Block at={[.18,.52,.027]} size={[.16,.025,.009]} color="#fff0d0"/></group>;
  return <group ref={root}>
    <Block at={[0,.045,0]} size={[.79,.09,.65]} color="#eee6d1"/>
    <Block at={[0,h/2+.09,0]} size={[.6,h,.48]} color={level===5?'#f6e9d4':'#fff2d9'}/>
    {level===5 ? <Block at={[0,h+.13,0]} size={[.72,.15,.58]} color={tint}/> : <mesh position={[0,h+.18,0]} rotation={[0,Math.PI/4,0]} castShadow><coneGeometry args={[.5,.28,4]}/><meshStandardMaterial color={tint}/></mesh>}
    {Array.from({length:floors},(_,floor)=>[-.17,.17].map(x=><Block key={`${floor}-${x}`} at={[x,.22+floor*.17,.247]} size={[.1,.09,.015]} color="#76b3bd"/>))}
    <Block at={[0,.2,.252]} size={[.1,.2,.022]} color={tint}/>
    <Block at={[0,.11,.34]} size={[.23,.04,.18]} color="#d8cfb2"/>
    <Block at={[0,.37,.33]} size={[.47,.045,.2]} color={tint}/>
    {[-.17,.17].map(x=><Block key={x} at={[x,.22,.267]} size={[.13,.018,.045]} color="#fff7df"/>)}
    <Block at={[.23,h+.17,-.1]} size={[.1,.29,.1]} color="#edbd9c"/>
    {Array.from({length:floors},(_,floor)=><Block key={floor} at={[.306,.22+floor*.17,.02]} size={[.015,.095,.18]} color="#90d0dd"/>)}
    <Block at={[-.312,h/2+.1,0]} size={[.025,h,.5]} color={tint}/>
    <mesh position={[.27,h+.29,.06]} castShadow><cylinderGeometry args={[.017,.017,.32,6]}/><meshStandardMaterial color="#8d7662"/></mesh>
    <Block at={[.36,h+.38,.06]} size={[.17,.1,.024]} color={tint}/>
  </group>;
}

function Tree({ at, scale = 1, variant = 0 }: { at: Point; scale?: number; variant?: number }) {
  return <group position={at} scale={scale}>
    <mesh position={[0,.35,0]} castShadow><cylinderGeometry args={[.06,.1,.7,6]}/><meshStandardMaterial color="#ad8258"/></mesh>
    {variant%3===0 ? <>{[.65,.95,1.2].map((y,index)=><mesh key={y} position={[0,y,0]} castShadow><coneGeometry args={[.48-index*.1,.55,9]}/><meshStandardMaterial color={['#3a9f65','#5cba72','#8bd17b'][index]}/></mesh>)}</> : <>{[[0,.98,0,.44],[-.23,.82,.05,.3],[.19,.9,.13,.33]].map(([x,y,z,r],index)=><mesh key={index} position={[x,y,z]} castShadow><icosahedronGeometry args={[r,2]}/><meshStandardMaterial color={variant%3===1?['#62bc74','#99d97d','#48a972'][index]:['#f09fb7','#ffc1c3','#e38bac'][index]} flatShading/></mesh>)}</>}
  </group>;
}

function Fountain({ reducedMotion }: { reducedMotion: boolean }) {
  const water = useRef<Group>(null);
  const ripples=useRef<Group>(null);
  useFrame(({clock})=>{if(water.current && !reducedMotion) water.current.rotation.y=clock.elapsedTime*.3;});
  useFrame(({clock})=>{if(ripples.current&&!reducedMotion)ripples.current.children.forEach((mesh,index)=>{const t=(clock.elapsedTime*.45+index/3)%1;mesh.scale.setScalar(.3+t*.85);( (mesh as Mesh).material as MeshBasicMaterial).opacity=(1-t)*.5;});});
  return <group position={[0,.35,-.8]}>
    <mesh position={[0,.04,0]} receiveShadow><cylinderGeometry args={[1.22,1.3,.17,32]}/><meshStandardMaterial color="#e7d8bb"/></mesh>
    <mesh position={[0,.15,0]}><cylinderGeometry args={[1.1,1.1,.08,40]}/><meshStandardMaterial color="#4ac9db" roughness={.18} metalness={.12}/></mesh>
    <group ref={ripples} position={[0,.195,0]}>{[0,1,2].map(i=><mesh key={i} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.82,.838,40]}/><meshBasicMaterial color="#d9ffff" transparent opacity={.35} depthWrite={false}/></mesh>)}</group>
    <mesh position={[0,.31,0]} castShadow><cylinderGeometry args={[.16,.21,.4,12]}/><meshStandardMaterial color="#dfc9a8"/></mesh>
    <mesh position={[0,.52,0]} castShadow><cylinderGeometry args={[.58,.33,.12,24]}/><meshStandardMaterial color="#f4e5ca"/></mesh>
    <mesh position={[0,.72,0]} castShadow><sphereGeometry args={[.16,12,10]}/><meshStandardMaterial color="#f2c85d" metalness={.3} roughness={.5}/></mesh>
    <group ref={water}>{Array.from({length:8},(_,index)=>{const a=index*Math.PI/4;return<mesh key={index} position={[Math.cos(a)*.38,.52,Math.sin(a)*.38]} rotation={[Math.sin(a)*.5,0,-Math.cos(a)*.5]}><capsuleGeometry args={[.025,.5,3,6]}/><meshStandardMaterial color="#c9f0ef" transparent opacity={.7}/></mesh>;})}</group>
  </group>;
}

function Park({ reducedMotion }: { reducedMotion: boolean }) {
  const logo=useCanvasTexture(ctx=>{
    ctx.clearRect(0,0,1024,512); ctx.textAlign='center'; ctx.fillStyle='#446e57';
    ctx.font='900 92px sans-serif'; ctx.fillText('CỜ TỶ PHÚ',512,190);
    ctx.font='700 27px sans-serif'; ctx.fillText('S À I  G Ò N   ·   G A R D E N   C I T Y',512,248);
  },[],1024,512);
  return <>
    <Slab width={8.93} depth={8.93} height={.08} y={.25} color="#7ac963"/>
    {Array.from({length:36},(_,index)=>{const row=Math.floor(index/6),col=index%6;return<mesh key={index} position={[-3.7+col*1.48,.38,-3.7+row*1.48]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[1.48,1.48]}/><meshStandardMaterial color={(col+row)%2?'#79bd59':'#8dcc69'}/></mesh>;})}
    <Block at={[0,.397,-.8]} size={[7.2,.025,.65]} color="#f0dfb8"/>
    <Block at={[0,.398,-.8]} size={[.65,.025,6.2]} color="#f0dfb8"/>
    <Fountain reducedMotion={reducedMotion}/>
    <group position={[-2.6,.35,-2.7]}><Building color="#e7aa86" level={1}/></group>
    <group position={[-1.55,.35,-3.1]}><Building color="#98c0cc" level={2}/></group>
    <group position={[2.45,.35,-2.8]}><Building color="#cf95a9" level={2}/></group>
    <group position={[1.45,.35,-3.1]}><Building color="#e5c768" level={1}/></group>
    {[[-3.45,-3.25],[-3.4,.6],[3.4,-3.3],[3.4,.7],[-2.65,-1.75],[2.65,-1.7]].map(([x,z],index)=><Tree key={index} at={[x,.35,z]} scale={.8} variant={index}/>)}
    {[-2.3,2.3].map(x=><group key={x} position={[x,.35,.1]}><Block at={[0,.2,0]} size={[.9,.07,.28]} color="#c5976e"/><Block at={[0,.41,-.12]} size={[.9,.25,.05]} color="#c5976e"/>{[-.3,.3].map(leg=><Block key={leg} at={[leg,.1,0]} size={[.05,.2,.25]} color="#72867a"/>)}</group>)}
    <mesh position={[0,.405,2.4]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[6.5,3.25]}/><meshBasicMaterial map={logo} transparent depthWrite={false}/></mesh>
    {Array.from({length:20},(_,index)=>{const a=index*2.399;const r=3.1+(index%3)*.25;return<mesh key={index} position={[Math.cos(a)*r,.39,Math.sin(a)*r]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.04,5]}/><meshStandardMaterial color={index%2?'#f4eec6':'#e4a591'}/></mesh>;})}
  </>;
}

function IslandEnvironment({ reducedMotion }: { reducedMotion: boolean }) {
  return <>
    <Slab width={13.65} depth={13.65} height={1.02} y={-1.14} color="#a97b58" radius={.5}/>
    <Slab width={13.73} depth={13.73} height={.12} y={-.69} color="#a88860" radius={.5}/>
    <Slab width={13.9} depth={13.9} height={.15} y={-.14} color="#4b9d67" radius={.55}/>
    <Slab width={14.04} depth={14.04} height={.14} y={.05} color="#b1db7c" radius={.55}/>
    {Array.from({length:14},(_,index)=>{const side=index%4;const distance=-5.7+Math.floor(index/4)*3.6;return<Tree key={index} at={side===0?[distance,.24,-6.57]:side===1?[6.57,.24,distance]:side===2?[distance,.24,6.57]:[-6.57,.24,distance]} scale={.48+(index%3)*.12} variant={index}/>;})}
    {[-1,1].map(side=><React.Fragment key={side}><Block at={[side*4,-.55,6.85]} size={[1.4,.13,.1]} color="#b89673"/><Block at={[6.85,-.49,side*3]} size={[.1,.15,1.7]} color="#b89673"/></React.Fragment>)}
    <Park reducedMotion={reducedMotion}/>
    <GardenDetails reducedMotion={reducedMotion}/>
  </>;
}

function useDieFace(value: number, color: string) {
  return useCanvasTexture(ctx=>{
    ctx.fillStyle=color;ctx.fillRect(0,0,256,256);ctx.fillStyle='#fffef7';
    const dots:Record<number,[number,number][]>= {1:[[128,128]],2:[[64,64],[192,192]],3:[[64,64],[128,128],[192,192]],4:[[64,64],[192,64],[64,192],[192,192]],5:[[64,64],[192,64],[128,128],[64,192],[192,192]],6:[[64,56],[192,56],[64,128],[192,128],[64,200],[192,200]]};
    for(const [x,y] of dots[value]){ctx.beginPath();ctx.arc(x,y,value===1?23:18,0,Math.PI*2);ctx.fill();}
  },[value,color],256,256);
}
function WorldDie({ value, at, phase, reducedMotion }: { value: number; at: Point; phase: string; reducedMotion: boolean }) {
  const root=useRef<Group>(null), glow=useRef<Mesh>(null);
  const color=at[0]<0?'#ed7790':'#65bbd3';
  const adjacent=[1,2,3,4,5,6].filter(number=>number!==value&&number!==7-value);
  const top=useDieFace(value,color), front=useDieFace(adjacent[0],color), right=useDieFace(adjacent[1],color);
  useFrame(({clock},delta)=>{
    if(!root.current)return;
    if(phase==='opening' || phase==='shaking'){
      if(!reducedMotion){root.current.rotation.x+=delta*15;root.current.rotation.z+=delta*12;root.current.position.y=at[1]+Math.abs(Math.sin(clock.elapsedTime*12))*.65;}
    }else {root.current.rotation.x=MathUtils.damp(Math.atan2(Math.sin(root.current.rotation.x),Math.cos(root.current.rotation.x)),0,14,delta);root.current.rotation.z=MathUtils.damp(Math.atan2(Math.sin(root.current.rotation.z),Math.cos(root.current.rotation.z)),0,14,delta);root.current.position.y=MathUtils.damp(root.current.position.y,at[1],14,delta);}
    if(glow.current){glow.current.visible=phase==='opening'||phase==='shaking';glow.current.scale.setScalar(reducedMotion?1:1+Math.sin(clock.elapsedTime*9)*.15);}
  });
  return <group ref={root} position={at} rotation={[0,.15,0]}>
    <Slab width={.75} depth={.75} height={.72} y={-.36} color={color} radius={.1}/>
    <mesh position={[0,.405,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.65,.65]}/><meshStandardMaterial map={top} roughness={.35}/></mesh>
    <mesh position={[0,0,.405]}><planeGeometry args={[.65,.65]}/><meshStandardMaterial map={front} roughness={.35}/></mesh>
    <mesh position={[.405,0,0]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[.65,.65]}/><meshStandardMaterial map={right} roughness={.35}/></mesh>
    <mesh ref={glow} rotation={[-Math.PI/2,0,0]} position={[0,-.4,0]}><ringGeometry args={[.51,.55,40]}/><meshBasicMaterial color="#fff4b5" transparent opacity={.6} depthWrite={false}/></mesh>
  </group>;
}

function Pawn({ player, position, offset, active, moving, crowded, reducedMotion, focus }: { player: PlayerState; position: number; offset: [number,number]; active: boolean; moving: boolean; crowded: boolean; reducedMotion: boolean; focus: React.MutableRefObject<Vector3> }) {
  const [x,z]=tilePosition(position);
  const root=useRef<Group>(null), model=useRef<Group>(null), arrow=useRef<Mesh>(null);
  const destination=useRef(new Vector3(x+offset[0],TILE_TOP+.07,z+offset[1]));
  const start=useRef(destination.current.clone());
  const progress=useRef(1);
  const heading=useRef(Math.PI/4), ground=useRef<Group>(null), dust=useRef<Group>(null), dustAge=useRef(1);
  const color=getPlayerPreset(player.id).colorHex;
  const pawnScale=crowded ? .58 : active ? .94 : .83;
  const arrowHeight=player.id===4 ? pawnScale*1.9+.25 : pawnScale*1.42+.25;
  useEffect(()=>{
    if(!root.current)return;
    start.current.copy(root.current.position);destination.current.set(x+offset[0],TILE_TOP+.07,z+offset[1]);progress.current=0;
    const dx=destination.current.x-start.current.x,dz=destination.current.z-start.current.z;
    if(Math.abs(dx)+Math.abs(dz)>.05)heading.current=Math.atan2(dx,dz);
  },[x,z,offset[0],offset[1]]);
  useFrame(({clock},delta)=>{
    if(!root.current)return;
    const previous=progress.current;
    progress.current=Math.min(1,progress.current+delta/(reducedMotion ? .01 : HOP_SECONDS));
    const t=progress.current;
    root.current.position.lerpVectors(start.current,destination.current,t*t*(3-2*t));
    const hop=reducedMotion?0:Math.sin(t*Math.PI)*.24;
    root.current.position.y+=hop;
    if(active)focus.current.copy(root.current.position);
    if(ground.current){ground.current.position.y=-hop;ground.current.scale.setScalar(1-hop*.35);}
    if(model.current){const s=reducedMotion?1:1-Math.sin(t*Math.PI*2)*.05;model.current.scale.set(pawnScale/s,pawnScale*s,pawnScale/s);const target=moving?heading.current:Math.PI/4;const turn=Math.atan2(Math.sin(target-model.current.rotation.y),Math.cos(target-model.current.rotation.y));model.current.rotation.y=reducedMotion?target:MathUtils.damp(model.current.rotation.y,model.current.rotation.y+turn,16,delta);}
    if(previous<1&&t===1)dustAge.current=0;
    dustAge.current=Math.min(1,dustAge.current+delta*3.2);
    if(dust.current){dust.current.visible=!reducedMotion&&dustAge.current<1;dust.current.children.forEach((particle,index)=>{const a=index*Math.PI/2,r=.2+dustAge.current*.26;particle.position.set(Math.cos(a)*r,.015,Math.sin(a)*r);particle.scale.setScalar(1-dustAge.current);});}
    if(arrow.current)arrow.current.position.y=arrowHeight+(reducedMotion?0:Math.sin(clock.elapsedTime*3.5)*.07);
  });
  return <group ref={root} position={[x+offset[0],TILE_TOP+.07,z+offset[1]]}>
    <group ref={ground}><mesh rotation={[-Math.PI/2,0,0]} position={[0,.012,0]}><circleGeometry args={[active ? .36 : .29,32]}/><meshBasicMaterial color={color} transparent opacity={.32} depthWrite={false}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.015,0]}><ringGeometry args={[.27,.31,32]}/><meshBasicMaterial color={active?'#fff5c0':color}/></mesh></group>
    <group ref={dust}>{[0,1,2,3].map(i=><mesh key={i}><sphereGeometry args={[.07,8,6]}/><meshBasicMaterial color="#fff6d4" transparent opacity={.6}/></mesh>)}</group>
    <group ref={model} scale={pawnScale} rotation={[0,Math.PI/4,0]}><CharacterModel characterId={player.id} moving={moving} reducedMotion={reducedMotion}/></group>
    {active && <mesh ref={arrow} position={[0,arrowHeight,0]} rotation={[0,0,Math.PI]}><coneGeometry args={[.13,.22,4]}/><meshBasicMaterial color="#ffd870"/></mesh>}
  </group>;
}

function CameraRig({ zoom, view, pan, focus, following, reducedMotion }: { zoom: number; view: number; pan: [number,number]; focus: React.MutableRefObject<Vector3>; following: boolean; reducedMotion: boolean }) {
  const {camera,size}=useThree();
  const target=useRef(new Vector3()), current=useRef(new Vector3());
  const angleRef=useRef(Math.PI/4);
  useFrame((_,delta)=>{
    const cam=camera as OrthographicCamera;
    // Keep the whole island visible at 100%; only pan when deliberately zoomed in.
    const amount=following ? Math.max(0,zoom-1)/zoom : 0;
    target.current.set(pan[0]+focus.current.x*amount,.1,pan[1]+focus.current.z*amount);
    current.current.lerp(target.current,reducedMotion?1:1-Math.exp(-delta*7));
    const desiredAngle=Math.PI/4+view*Math.PI/2;
    const turn=Math.atan2(Math.sin(desiredAngle-angleRef.current),Math.cos(desiredAngle-angleRef.current));
    angleRef.current=reducedMotion ? desiredAngle : MathUtils.damp(angleRef.current,angleRef.current+turn,6,delta);
    const angle=angleRef.current;
    cam.position.set(current.current.x+Math.sin(angle)*19,23,current.current.z+Math.cos(angle)*19);
    cam.lookAt(current.current.x,.1,current.current.z);
    const desired=Math.min(size.width/21,size.height/16.5)*zoom;
    cam.zoom=reducedMotion?desired:MathUtils.damp(cam.zoom,desired,10,delta);
    cam.updateProjectionMatrix();
  });
  return null;
}

export interface IslandSceneProps {
  gameState: GameState;
  positions: Record<number,number>;
  visiblePlayerIds: number[];
  moving: boolean;
  zoom: number;
  view: number;
  pan?: [number,number];
  following: boolean;
  reducedMotion: boolean;
  dicePhase: string;
  onSpaceClick: (index:number)=>void;
  onHover: (index:number|null)=>void;
}

export default function IslandScene(props:IslandSceneProps) {
  const active=props.gameState.players[props.gameState.activePlayerIndex];
  const focus=useRef(new Vector3());
  const visible=props.gameState.players.filter(player=>!player.isBankrupt && props.visiblePlayerIds.includes(player.id));
  return <Canvas orthographic shadows dpr={[1,1.6]} camera={{position:[19,23,19],zoom:35,near:.1,far:120}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.shadowMap.type=PCFSoftShadowMap;gl.toneMappingExposure=1.03;}} aria-label="Bàn cờ đảo nổi 3D" onPointerMissed={()=>props.onHover(null)}>
    <ambientLight intensity={.45}/>
    <hemisphereLight args={['#e7f7ff','#77a77a',.75]}/>
    <directionalLight position={[-7,16,9]} intensity={1.9} color="#fff0d0" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-.0006} shadow-normalBias={.025} shadow-radius={3}/>
    <directionalLight position={[8,6,-7]} intensity={.6} color="#c6eaff"/>
    <CameraRig zoom={props.zoom} view={props.view} pan={props.pan??[0,0]} focus={focus} following={props.following} reducedMotion={props.reducedMotion}/>
    <IslandEnvironment reducedMotion={props.reducedMotion}/>
    {VIETNAMESE_BOARD_SPACES.map(space=><Tile key={space.index} space={space} ownership={props.gameState.properties[space.index]} active={space.index===(props.positions[active?.id]??0)} selected={space.index===props.gameState.selectedSpaceIndex} onClick={()=>props.onSpaceClick(space.index)} onHover={props.onHover}/>)}
    <WorldDie value={props.gameState.dice[0]} at={[-.58,.88,.65]} phase={props.dicePhase} reducedMotion={props.reducedMotion}/>
    <WorldDie value={props.gameState.dice[1]} at={[.58,.88,.85]} phase={props.dicePhase} reducedMotion={props.reducedMotion}/>
    {visible.map(player=>{
      const pos=props.positions[player.id]??player.position;
      const occupants=visible.filter(other=>(props.positions[other.id]??other.position)===pos);
      const slot=occupants.findIndex(other=>other.id===player.id);
      const offset:[number,number]=occupants.length>1 ? [(slot%3-((Math.min(3,occupants.length)-1)/2))*.43,Math.floor(slot/3)*.44-.18] : [0,.05];
      return <Pawn key={player.id} player={player} position={pos} offset={offset} crowded={occupants.length>2} active={active?.id===player.id} moving={props.moving && active?.id===player.id} reducedMotion={props.reducedMotion} focus={focus}/>;
    })}
    <SceneEffects gameState={props.gameState} positions={props.positions} moving={props.moving} dicePhase={props.dicePhase} reducedMotion={props.reducedMotion}/>
  </Canvas>;
}
