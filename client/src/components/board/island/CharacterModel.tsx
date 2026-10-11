import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { getPlayerPreset } from '../../../core/types/playerTokens';

type Point = [number, number, number];
function Ball({ at, scale = [1, 1, 1], color, radius = .2, glossy = false }: { at: Point; scale?: Point; color: string; radius?: number; glossy?: boolean }) {
  return <mesh position={at} scale={scale} castShadow><sphereGeometry args={[radius, 24, 16]}/><meshStandardMaterial color={color} roughness={glossy ? .18 : .6} metalness={glossy ? .08 : 0}/></mesh>;
}
function Pill({ at, color, radius = .06, length = .2, rotation = [0, 0, 0] }: { at: Point; color: string; radius?: number; length?: number; rotation?: Point }) {
  return <mesh position={at} rotation={rotation} castShadow><capsuleGeometry args={[radius,length,5,12]}/><meshStandardMaterial color={color} roughness={.6}/></mesh>;
}
function Ring({ at, color, radius, tube = .035, rotation = [Math.PI / 2, 0, 0] }: { at: Point; color: string; radius: number; tube?: number; rotation?: Point }) {
  return <mesh position={at} rotation={rotation} castShadow><torusGeometry args={[radius,tube,8,32]}/><meshStandardMaterial color={color} roughness={.45}/></mesh>;
}

export function CharacterModel({ characterId, moving = false, reducedMotion = false }: { characterId: number; moving?: boolean; reducedMotion?: boolean }) {
  const id = ((characterId - 1) % 6) + 1;
  const color = getPlayerPreset(id).colorHex;
  const duck = id === 2 || id === 3;
  const panda = id === 6;
  const face = id === 4 ? '#eee4ff' : '#fff3d6';
  const body = useRef<Group>(null);
  const feet = useRef<Group>(null);
  const arms = useRef<Group>(null);
  const eyes = useRef<Group>(null), ears = useRef<Group>(null), tail = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const time = clock.elapsedTime;
    if (body.current) { body.current.position.y = moving ? 0 : Math.sin(time * 2.4 + id) * .017; body.current.rotation.z = moving ? Math.sin(time * 18) * .06 : Math.sin(time * 1.8 + id) * .016; }
    if (feet.current) feet.current.children.forEach((foot, index) => { foot.rotation.x = moving ? Math.sin(time * 19 + index * Math.PI) * .6 : 0; });
    arms.current?.children.forEach((arm, index) => { arm.rotation.x = moving ? Math.sin(time*19+index*Math.PI+Math.PI)*.45 : Math.sin(time*1.9+index)*.07; });
    if (eyes.current) { const blink=(time+id*.71)%4.8; eyes.current.scale.y=blink>4.58 ? Math.max(.08,Math.abs(blink-4.69)/.11) : 1; }
    if (ears.current) ears.current.rotation.z=Math.sin(time*(moving?14:1.7)+id)*(moving ? .07 : .025);
    if (tail.current) tail.current.rotation.y=Math.sin(time*(moving?9:2)+id)*.22;
  });
  return <group>
    <group ref={feet}>
      {[-.14, .14].map((x, index) => <group key={index} position={[x, .16, 0]}><Pill at={[0,.015,0]} radius={.08} length={.1} color={color}/><Ball at={[0, -.06, .09]} scale={[1, .55, 1.4]} radius={.15} color={duck ? '#ffb347' : panda ? '#263e59' : '#fffdf2'}/>{!duck && <Ball at={[0,-.076,.12]} radius={.15} scale={[1,.13,1.35]} color={color}/>}</group>)}
    </group>
    <group ref={body}>
      <Ball at={[0, .43, 0]} scale={[1, 1.25, .85]} radius={.3} color={color}/>
      <Ball at={[0, .45, .235]} scale={[.85, 1, .25]} radius={.2} color={id === 1 ? '#fff09e' : '#fff9ea'}/>
      <group ref={arms}>
        {[-1, 1].map(side => <group key={side} position={[side*.29,.6,0]} rotation={[0,0,side*.14]}><Pill at={[side*.02,-.07,0]} radius={.095} length={.14} color={panda?'#263e59':color}/><Ring at={[side*.02,-.17,0]} radius={.09} tube={.02} color="#fff8df"/><Ball at={[side*.025,-.23,.02]} radius={.11} scale={[.87,1,.88]} color={panda?'#263e59':face}/></group>)}
      </group>
      <Ball at={[0, .94, 0]} scale={[1, .91, .86]} radius={.42} color={face}/>
      <Ball at={[0,.84,.23]} radius={.255} scale={[1,.7,.48]} color="#fff9ec"/>
      <group ref={ears}>{id === 4 ? [-1,1].map(side=><group key={side} position={[side*.2,1.3,0]} rotation={[0,0,side*-.16]}><Ball at={[0,.15,0]} radius={.12} scale={[1,2.9,.75]} color={face}/><Ball at={[0,.17,.075]} radius={.073} scale={[1,3.3,.3]} color="#f5b5d5"/></group>) : panda ? [-1,1].map(side=><Ball key={side} at={[side*.29,1.25,0]} radius={.15} scale={[1,1,.65]} color="#263e59"/>) : !duck && [-1,1].map(side=><group key={side} position={[side*.28,1.24,0]} rotation={[0,0,side*-.25]}><mesh castShadow><coneGeometry args={[.17,.3,3]}/><meshStandardMaterial color={face}/></mesh><mesh position={[0,.01,.09]} scale={.58}><coneGeometry args={[.16,.27,3]}/><meshStandardMaterial color="#f5b5ac"/></mesh></group>)}</group>
      {panda && [-1,1].map(side=><Ball key={side} at={[side*.15,.94,.29]} radius={.115} scale={[.8,1,.35]} color="#34445a"/>)}
      <group ref={eyes} position={[0,.994,.341]}>{[-1,1].map(side=><group key={side} position={[side*.148,0,0]}><Ball at={[0,0,0]} scale={[.85,1.12,.44]} radius={.07} color="#263e59" glossy/><Ball at={[-.02,.023,.026]} radius={.021} color="#fff"/><Ball at={[.018,-.021,.029]} radius={.009} color="#96d4f4"/></group>)}</group>
      {[-1,1].map(side=><Ball key={side} at={[side*.255,.87,.3]} radius={.063} scale={[1,.52,.18]} color="#f4b0aa"/>)}
      {duck ? <><Ball at={[0,.855,.377]} radius={.14} scale={[1.3,.42,1]} color="#ffbd4b" glossy/><Ball at={[0,.837,.415]} radius={.13} scale={[1.25,.03,.8]} color="#d99836"/></> : <>{[-1,1].map(side=><Ball key={side} at={[side*.067,.855,.349]} radius={.08} scale={[1,.65,.4]} color="#fffdf5"/>)}<Ball at={[0,.889,.373]} radius={.04} scale={[1,.65,.5]} color={panda?'#263e59':'#df939e'} glossy/><mesh position={[0,.806,.36]} rotation={[0,0,Math.PI]}><torusGeometry args={[.036,.008,6,16,Math.PI]}/><meshStandardMaterial color="#644953"/></mesh>{!panda && [-1,1].map(side=>[0,1].map(line=><Pill key={`${side}-${line}`} at={[side*.235,.845-line*.045,.323]} radius={.006} length={.065} rotation={[0,0,side*(1.4+line*.2)]} color="#bd9387"/>))}</>}
      {id === 1 && [-1,1].map(side=><mesh key={side} position={[side*.34,.55,-.08]} rotation={[0,0,side*-.45]} castShadow><capsuleGeometry args={[.08,.5,4,8]}/><meshStandardMaterial color="#ffe172"/></mesh>)}
      {id === 2 && <><mesh position={[0,1.29,0]} castShadow><cylinderGeometry args={[.27,.33,.15,32]}/><meshStandardMaterial color="#fff9ef"/></mesh><Ring at={[0,1.22,0]} radius={.33} tube={.025} color="#263e59"/><Ball at={[0,1.375,0]} radius={.06} color="#ffd467"/><Ball at={[0,1.29,.29]} radius={.05} scale={[1,1,.25]} color={color}/><Pill at={[0,.57,.27]} radius={.03} length={.16} color="#f3c14f"/>{[-1,1].map(side=><Pill key={side} at={[side*.07,.62,.26]} radius={.025} length={.12} rotation={[0,0,side*.6]} color="#fffdf3"/>)}</>}
      {id === 3 && <>{[-1,1].map(side=><group key={side} position={[side*.155,1.005,.372]}><Ball at={[0,0,0]} radius={.105} scale={[1,.73,.22]} color="#294559" glossy/><Ring at={[0,0,.015]} radius={.085} tube={.014} rotation={[0,0,0]} color="#ffd361"/><Pill at={[-.03,.019,.025]} radius={.006} length={.065} rotation={[0,0,-.5]} color="#8ed6e5"/></group>)}<Pill at={[0,1.01,.39]} radius={.011} length={.12} rotation={[0,0,Math.PI/2]} color="#ffd361"/><Pill at={[0,.46,.284]} radius={.009} length={.2} color="#294559"/>{[-1,1].map(side=><Ball key={side} at={[side*.15,.46,.236]} radius={.07} scale={[1,.65,.15]} color="#e7815e"/>)}</>}
      {id === 4 && <><Pill at={[.12,.54,.264]} radius={.05} length={.2} rotation={[0,0,.2]} color="#63d6b3"/><Ball at={[0,.46,-.28]} radius={.21} scale={[.95,1.1,.5]} color="#ffae77"/><Pill at={[.02,.64,-.37]} radius={.022} length={.12} rotation={[0,0,.5]} color="#6ebd75"/><Ball at={[0,.47,.281]} radius={.05} scale={[1,1,.2]} color="#ffd366" glossy/></>}
      {id === 5 && <><mesh position={[0,.96,0]}><sphereGeometry args={[.467,32,24]}/><meshStandardMaterial color="#9de6ff" transparent opacity={.17} roughness={.13} metalness={.12} depthWrite={false}/></mesh><Ring at={[0,.96,0]} radius={.459} tube={.017} rotation={[Math.PI/2,.2,0]} color="#c3e6f7"/><Ball at={[-.21,1.15,.352]} radius={.085} scale={[.6,1.3,.1]} color="#ecffff"/><Ball at={[0,.45,-.27]} radius={.24} scale={[.9,1,.6]} color="#d8e9fa"/>{[-1,1].map(side=><Pill key={side} at={[side*.16,.42,-.37]} radius={.075} length={.22} color="#779cd1"/>)}<Ball at={[0,.5,.281]} radius={.088} scale={[1,1,.25]} color="#497bad"/><Ball at={[0,.51,.307]} radius={.039} scale={[1,1,.25]} color="#92ead8" glossy/></>}
      {panda && <><Pill at={[-.1,.55,.267]} radius={.05} length={.19} rotation={[0,0,-.2]} color="#ed8eaa"/><Ball at={[.2,.33,-.15]} radius={.14} scale={[1,1.05,.65]} color="#f3c57e"/><Pill at={[.26,.65,-.19]} radius={.025} length={.34} rotation={[0,0,-.14]} color="#7cba83"/><Ball at={[.29,.8,-.16]} radius={.085} scale={[.5,1.2,.24]} color="#92cd81"/></>}
      <Ring at={[0,.65,.02]} radius={.23} tube={.055} color={id===4 ? '#63d6b3' : panda ? '#ed8eaa' : id===2 ? '#263e59' : '#fff0b8'}/>
      {[.4,.52].map(y=><Ball key={y} at={[.095,y,.258]} radius={.022} color="#ffc05e" glossy/>)}
      <group ref={tail}>{id===4 ? <Ball at={[0,.32,-.32]} radius={.12} color="#fffdf8"/> : panda ? <Ball at={[0,.32,-.3]} radius={.09} color="#263e59"/> : duck ? <Ball at={[0,.34,-.28]} radius={.14} scale={[.8,.6,1.5]} color={face}/> : <><Pill at={[.15,.36,-.34]} radius={.067} length={.27} rotation={[-.6,0,-.7]} color={face}/><Ball at={[.29,.5,-.39]} radius={.077} color={face}/></>}</group>
    </group>
  </group>;
}
