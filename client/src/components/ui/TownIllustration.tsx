import React from 'react';
export const TownIllustration: React.FC<{className?: string}> = ({className = ''}) => <svg className={`town-illustration ${className}`} viewBox="0 0 400 260" fill="none" aria-hidden="true">
  <path d="m28 164 170-90 177 96-171 87Z" fill="#e8dfcd"/>
  <path d="m28 164 176 93v-14L28 150Z" fill="#a4b7b6"/><path d="m204 257 171-87v-14l-171 87Z" fill="#708f96"/>
  <path d="m60 159 136-73 147 80-140 72Z" stroke="#f9f5eb" strokeWidth="22"/><path d="m60 159 136-73 147 80-140 72Z" stroke="#a4b7b6" strokeWidth="1.5" strokeDasharray="6 6"/>
  {[[115,142,52,48,'#e7977a'],[205,162,55,56,'#d0b979'],[242,107,39,77,'#95b9b2'],[162,92,41,64,'#9ab1bf']].map(([x,y,w,h,color],i)=><g key={i} transform={`translate(${x} ${y})`}>
    <path d={`M0 0 ${Number(w)/2} 14 ${Number(w)} 0 ${Number(w)} -${h} ${Number(w)/2} -${Number(h)+14} 0 -${h}Z`} fill={String(color)}/><path d={`M${Number(w)/2} 14 ${w} 0 ${w} -${h} ${Number(w)/2} -${Number(h)-14}Z`} fill="#172b37" fillOpacity=".15"/><path d={`m0 -${h} ${Number(w)/2} -14 ${Number(w)/2} 14 -${Number(w)/2} 14Z`} fill="#f9f5eb"/>
    {[0,1].map(n=><path key={n} d={`M9 -${Number(h)-22-n*16}v8m10 -3v-8m17 -2v8`} stroke="#fff6e9" strokeWidth="5"/>)}
  </g>)}
  <g fill="#477e72"><ellipse cx="84" cy="185" rx="12" ry="8"/><ellipse cx="292" cy="195" rx="12" ry="8"/><ellipse cx="306" cy="133" rx="12" ry="8"/></g><g stroke="#477e72" strokeWidth="7" strokeLinecap="round"><path d="M84 185v-24m208 34v-24m14-38v-24"/></g><g fill="#7fb19a"><circle cx="84" cy="156" r="15"/><circle cx="292" cy="166" r="15"/><circle cx="306" cy="105" r="15"/></g>
  <rect x="133" y="185" width="26" height="26" rx="6" transform="rotate(12 133 185)" fill="#fffaf1" stroke="#172b37" strokeWidth="2"/><g fill="#ed886d"><circle cx="142" cy="194" r="2.5"/><circle cx="151" cy="207" r="2.5"/></g>
</svg>;
