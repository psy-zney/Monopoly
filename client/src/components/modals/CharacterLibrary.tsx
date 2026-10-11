import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { Group, OrthographicCamera } from 'three';
import { X } from 'lucide-react';
import { CharacterModel } from '../board/island/CharacterModel';
import { CharacterPortrait } from '../board/island/CharacterPortrait';
import { SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';
import { SceneBoundary } from '../board/island/SceneBoundary';

const DESCRIPTIONS = ['Nhỏ nhắn, mê vàng và luôn sẵn sàng cho một vòng phiêu lưu.', 'Chiếc mũ thủy thủ, một chút ngơ ngác và rất nhiều may mắn.', 'Đeo kính râm. Đi thật chậm. Thu tiền thuê thật nhanh.', 'Đôi tai dài và những bước nhảy qua cả thành phố.', 'Bộ đồ không gian cho những chuyến đi quanh bàn cờ.', 'Một người bạn hiền lành với giấc mơ sở hữu khách sạn.'];

function Showcase({ id, reducedMotion }: { id: number; reducedMotion: boolean }) {
  const root = useRef<Group>(null);
  const { camera, size } = useThree();
  useEffect(() => { const cam=camera as OrthographicCamera; cam.zoom=Math.min(size.width/2.8,size.height/2.3);cam.lookAt(0,.82,0);cam.updateProjectionMatrix(); },[camera,size]);
  useFrame(({clock})=>{if(root.current)root.current.rotation.y=reducedMotion ? .18: .18+Math.sin(clock.elapsedTime*.5)*.35;});
  return <>
    <ambientLight intensity={.45}/><hemisphereLight args={['#e6f6ff','#9eb5ad',.7]}/><directionalLight position={[-3,5,4]} intensity={2} color="#fff0d7" castShadow shadow-mapSize={[1024,1024]} shadow-normalBias={.015}/><directionalLight position={[3,2,-2]} intensity={.7} color="#bfe8ff"/>
    <mesh position={[0,-.055,0]} receiveShadow><cylinderGeometry args={[.68,.74,.14,40]}/><meshStandardMaterial color="#f9edd3" roughness={.6}/></mesh>
    <mesh position={[0,.012,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.52,.545,48]}/><meshStandardMaterial color="#82c6b8"/></mesh>
    <group ref={root}><CharacterModel characterId={id} reducedMotion={reducedMotion}/></group>
  </>;
}

export default function CharacterLibrary({ initialId = 1, onClose, onSelect }: { initialId?: number; onClose: () => void; onSelect?: (id: number) => void }) {
  const [selected, setSelected] = useState(initialId);
  const reducedMotion = Boolean(useReducedMotion());
  const preset = SIX_PLAYER_PRESETS.find(p=>p.id===selected)!;
  const dialog = useRef<HTMLElement>(null);
  useEffect(()=>{
    const previous = document.activeElement as HTMLElement;
    dialog.current?.focus();
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape')onClose();
      if(event.key==='Tab'){
        const items=dialog.current?.querySelectorAll<HTMLButtonElement>('button');
        if(!items?.length)return;
        const first=items[0],last=items[items.length-1];
        if(event.shiftKey && (document.activeElement===first || document.activeElement===dialog.current)){event.preventDefault();last.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    window.addEventListener('keydown',key);
    return()=>{window.removeEventListener('keydown',key);previous?.focus();};
  },[onClose]);
  return <div className="detail-backdrop character-library-backdrop" onClick={onClose}>
    <section ref={dialog} tabIndex={-1} className="character-library" role="dialog" aria-modal="true" aria-label="Kho nhân vật" onClick={event=>event.stopPropagation()}>
      <header><div><small>ĐỘI BẠN TRONG MÂY</small><h2>Kho nhân vật</h2></div><button type="button" className="icon-button" aria-label="Đóng kho nhân vật" onClick={onClose}><X size={20}/></button></header>
      <div className="character-gallery-body"><div><div className="character-showcase"><SceneBoundary fallback={<CharacterPortrait characterId={selected}/>}><Canvas orthographic shadows camera={{position:[1.2,1.65,4],zoom:90}} dpr={[1,1.5]}><Showcase id={selected} reducedMotion={reducedMotion}/></Canvas></SceneBoundary></div><div className="character-showcase-info"><strong>{preset.name}</strong><p>{DESCRIPTIONS[selected-1]}</p></div></div>
        <div><div className="character-gallery-list">{SIX_PLAYER_PRESETS.map(p=><button type="button" key={p.id} aria-label={`Xem ${p.name}`} aria-pressed={selected===p.id} className={selected===p.id?'is-selected':''} onClick={()=>setSelected(p.id)}><CharacterPortrait characterId={p.id}/><span>{p.name}</span></button>)}</div>{onSelect ? <button type="button" className="primary-button" style={{marginTop:16}} onClick={()=>{onSelect(selected);onClose();}}>Chọn {preset.name}</button> : <p className="character-library-note">Chọn nhân vật tại sảnh trước khi bắt đầu ván mới.</p>}</div>
      </div>
    </section>
  </div>;
}
