import React from 'react';
import { getPlayerPreset } from '../../../core/types/playerTokens';

export function CharacterPortrait({ characterId }: { characterId: number }) {
  const id = ((characterId - 1) % 6) + 1;
  const color = getPlayerPreset(id).colorHex;
  const duck = id === 2 || id === 3;
  const panda = id === 6;
  const face = id === 4 ? '#e7d7f4' : '#fff5db';
  return <svg viewBox="0 0 100 100" className="character-portrait" aria-hidden="true">
    <circle cx="50" cy="50" r="49" fill={color} />
    <circle cx="35" cy="28" r="38" fill="#fff" opacity=".12" />
    <ellipse cx="50" cy="97" rx="30" ry="29" fill={id === 1 ? '#f4c743' : color} stroke="#183b4e" strokeOpacity=".16" strokeWidth="2" />
    {id === 1 && <><path d="M27 79Q11 62 20 41Q21 65 42 73Z" fill="#ffe379"/><path d="M73 79Q89 62 80 41Q79 65 58 73Z" fill="#ffe379"/></>}
    {id === 4 ? <><rect x="27" y="7" width="15" height="38" rx="8" fill={face} transform="rotate(-12 34 26)"/><rect x="58" y="7" width="15" height="38" rx="8" fill={face} transform="rotate(12 65 26)"/><path d="M32 15L36 32M64 15L64 32" stroke="#eda9c7" strokeWidth="6" strokeLinecap="round"/></> : panda ? <><circle cx="27" cy="29" r="11" fill="#263e59"/><circle cx="73" cy="29" r="11" fill="#263e59"/></> : !duck && <><path d="M23 45L22 19L44 35" fill={face}/><path d="M56 35L78 19L77 45" fill={face}/><path d="M27 31L28 23L36 34" fill="#ecb4a3"/><path d="M64 34L72 23L73 31" fill="#ecb4a3"/></>}
    <ellipse cx="50" cy="53" rx="30" ry="27" fill={face}/>
    <ellipse cx="38" cy="39" rx="16" ry="8" fill="white" opacity=".45"/>
    {panda && <><ellipse cx="37" cy="51" rx="10" ry="12" fill="#33435b" transform="rotate(18 37 51)"/><ellipse cx="63" cy="51" rx="10" ry="12" fill="#33435b" transform="rotate(-18 63 51)"/></>}
    {id === 3 ? <><path d="M25 45H47V56Q37 64 27 55ZM53 45H75L73 55Q63 64 53 56Z" fill="#263b4b"/><path d="M46 48H54" stroke="#263b4b" strokeWidth="4"/><path d="M30 48H38M58 48H65" stroke="#b6e6e6" strokeWidth="2"/></> : <>{[37,63].map(x=><g key={x}><ellipse cx={x} cy="51" rx="3.8" ry="5.5" fill="#283b4b"/><circle cx={x-1} cy="49" r="1.4" fill="#fff"/></g>)}</>}
    {duck ? <><ellipse cx="50" cy="64" rx="12" ry="6" fill="#f3ac4f"/><path d="M41 64H59" stroke="#b97936" strokeWidth="1.5"/></> : <><path d="M46 62Q50 59 54 62L50 66Z" fill="#c98885"/><path d="M42 68Q46 72 50 67Q54 72 58 68" fill="none" stroke="#6e6062" strokeWidth="1.6" strokeLinecap="round"/></>}
    <ellipse cx="28" cy="62" rx="5" ry="3" fill="#f2b1a5" opacity=".6"/><ellipse cx="72" cy="62" rx="5" ry="3" fill="#f2b1a5" opacity=".6"/>
    {id === 2 && <><path d="M24 31Q27 18 50 18Q72 18 77 31Z" fill="#fff9ef"/><rect x="23" y="29" width="55" height="6" rx="3" fill="#263e59"/><path d="M44 22H56" stroke="#6ebfd0" strokeWidth="3"/></>}
    {id === 5 && <><circle cx="50" cy="51" r="35" fill="none" stroke="#dfeefa" strokeWidth="5"/><path d="M23 46Q24 28 39 22" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round"/></>}
    <path d="M37 80Q50 87 63 80" fill="none" stroke={id === 4 ? '#63d6b3' : panda ? '#ed8eaa' : id===2 ? '#263e59' : '#fff0c1'} strokeWidth="7"/>
    {id === 6 && <path d="M39 87H61L63 99H37Z" fill="#ccaac5"/>}
  </svg>;
}
