import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { C, F, catCol, typeCol, confCol } from "./theme.js";
import { S } from "./data/signals.js";
import { DR } from "./data/drivers.js";
import { SC } from "./data/scenarios.js";
import { BR } from "./data/brands.js";
import { MX } from "./data/matrix.js";
import { TL } from "./data/timeline.js";

// ═══════════════════════════════════════════════════════════
// D3 GLOBE — inline topojson decode + orthographic
// ═══════════════════════════════════════════════════════════
const WORLD_URL="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
function decArc(t,a){let x=0,y=0;return a.map(p=>{x+=p[0];y+=p[1];return[x,y]})}
function topoMesh(t,o){const{scale:s,translate:tr}=t.transform;const arcs=t.arcs.map(a=>decArc(t,a));const seen=new Set,coords=[];o.geometries.forEach(g=>{(g.type==="Polygon"?g.arcs:g.type==="MultiPolygon"?g.arcs.flat():[]).forEach(ring=>{ring.forEach(idx=>{const k=idx<0?~idx:idx;if(!seen.has(k)){seen.add(k);coords.push(arcs[k].map(([px,py])=>[px*s[0]+tr[0],py*s[1]+tr[1]]))}})})});return{type:"MultiLineString",coordinates:coords}}
function topoFeat(t,o){const{scale:s,translate:tr}=t.transform;const arcs=t.arcs.map(a=>decArc(t,a));function dr(indices){let pts=[];indices.forEach(idx=>{let arc=idx<0?arcs[~idx].slice().reverse():arcs[idx].slice();arc.forEach(([px,py],i)=>{if(i>0||!pts.length)pts.push([px*s[0]+tr[0],py*s[1]+tr[1]])})});return pts}return{type:"FeatureCollection",features:o.geometries.map(g=>{let co;if(g.type==="Polygon")co=g.arcs.map(dr);else if(g.type==="MultiPolygon")co=g.arcs.map(p=>p.map(dr));else co=[];return{type:"Feature",geometry:{type:g.type,coordinates:co},properties:g.properties||{}}})}}

const Globe=({sigs,cat})=>{const cvs=useRef();const rotR=useRef([0,-20,0]);const autoR=useRef(true);const [ld,setLd]=useState(false);const meshR=useRef();const featR=useRef();
useEffect(()=>{fetch(WORLD_URL).then(r=>r.json()).then(t=>{meshR.current=topoMesh(t,t.objects.countries);featR.current=topoFeat(t,t.objects.countries);setLd(true)}).catch(()=>setLd(true))},[]);
const draw=useCallback(()=>{const cv=cvs.current;if(!cv)return;const ctx=cv.getContext("2d");const w=cv.width/2,h=cv.height/2;const proj=d3.geoOrthographic().scale(Math.min(w,h)*0.38).translate([w/2,h/2]).rotate(rotR.current).clipAngle(90);const path=d3.geoPath(proj,ctx);ctx.clearRect(0,0,w,h);
ctx.beginPath();path({type:"Sphere"});const gr=ctx.createRadialGradient(w/2-60,h/2-60,0,w/2,h/2,Math.min(w,h)*0.4);gr.addColorStop(0,C.abyssMid);gr.addColorStop(1,C.abyss);ctx.fillStyle=gr;ctx.fill();ctx.strokeStyle="rgba(255,107,53,0.15)";ctx.lineWidth=1;ctx.stroke();
ctx.beginPath();path(d3.geoGraticule10());ctx.strokeStyle="rgba(255,107,53,0.06)";ctx.lineWidth=0.5;ctx.stroke();
if(featR.current)featR.current.features.forEach(f=>{ctx.beginPath();path(f);ctx.fillStyle="rgba(127,176,105,0.06)";ctx.fill()});
if(meshR.current){ctx.beginPath();path(meshR.current);ctx.strokeStyle="rgba(127,176,105,0.22)";ctx.lineWidth=0.6;ctx.stroke()}
const fl=cat==="All"?sigs:sigs.filter(s=>s.c===cat);
fl.forEach(s=>{const pos=proj([s.lo,s.la]);if(!pos)return;const dd=d3.geoDistance([s.lo,s.la],[-rotR.current[0],-rotR.current[1]]);if(dd>Math.PI/2)return;const col=catCol[s.c]||C.gold;ctx.beginPath();ctx.arc(pos[0],pos[1],6,0,Math.PI*2);ctx.fillStyle=col+"22";ctx.fill();ctx.beginPath();ctx.arc(pos[0],pos[1],2.5,0,Math.PI*2);ctx.fillStyle=col;ctx.fill()})
},[sigs,cat]);
useEffect(()=>{const cv=cvs.current;if(!cv)return;const p=cv.parentElement;const w=p.clientWidth,h=520;cv.width=w*2;cv.height=h*2;cv.style.width=w+"px";cv.style.height=h+"px";cv.getContext("2d").scale(2,2);let fr;const ani=()=>{if(autoR.current)rotR.current=[rotR.current[0]+0.15,rotR.current[1],0];draw();fr=requestAnimationFrame(ani)};ani();
let dr=false,sr,sp;const dn=e=>{dr=true;autoR.current=false;const r=cv.getBoundingClientRect();sp=[e.clientX-r.left,e.clientY-r.top];sr=[...rotR.current]};const mv=e=>{if(!dr)return;const r=cv.getBoundingClientRect();const dx=(e.clientX-r.left)-sp[0],dy=(e.clientY-r.top)-sp[1];rotR.current=[sr[0]+dx*0.4,Math.max(-80,Math.min(80,sr[1]-dy*0.4)),0]};const up=()=>{dr=false;setTimeout(()=>{autoR.current=true},3000)};
cv.addEventListener("mousedown",dn);cv.addEventListener("mousemove",mv);window.addEventListener("mouseup",up);cv.addEventListener("touchstart",e=>{e.preventDefault();dn(e.touches[0])},{passive:false});cv.addEventListener("touchmove",e=>{e.preventDefault();mv(e.touches[0])},{passive:false});cv.addEventListener("touchend",up);
return()=>{cancelAnimationFrame(fr);cv.removeEventListener("mousedown",dn);cv.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up)}},[ld,draw]);
useEffect(()=>{draw()},[cat,draw]);
return <div style={{position:"relative",borderRadius:12,overflow:"hidden",background:C.abyss}}><canvas ref={cvs} style={{display:"block",cursor:"grab"}}/><div style={{position:"absolute",bottom:12,left:16,display:"flex",gap:12,flexWrap:"wrap"}}>{["Social","Technology","Economic","Environmental","Policy"].map(c=> <span key={c} style={{display:"flex",alignItems:"center",gap:4,fontFamily:F.mono,fontSize:10,color:catCol[c]}}><span style={{width:6,height:6,borderRadius:3,background:catCol[c],display:"inline-block"}}/>{c}</span>)}</div><div style={{position:"absolute",bottom:12,right:16,fontFamily:F.mono,fontSize:10,color:C.whiteFaint}}>DRAG TO ROTATE</div></div>};

// ═══════════════════════════════════════════════════════════
// UI
// ═══════════════════════════════════════════════════════════
function Gr() {
  return <div style={{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,opacity:0.4}}/>;
}
const Cd=({children,style,glow,onClick})=> <div onClick={onClick} style={{background:"rgba(22,29,36,0.6)",backdropFilter:"blur(20px)",border:`1px solid ${glow?'rgba(255,107,53,0.3)':'rgba(232,241,242,0.06)'}`,borderRadius:12,padding:"20px 24px",cursor:onClick?"pointer":"default",transition:"all 0.3s ease",...style}}>{children}</div>;
const Bg=({children,color})=> <span style={{display:"inline-block",padding:"3px 10px",borderRadius:4,fontSize:11,fontFamily:F.mono,fontWeight:500,letterSpacing:"0.05em",textTransform:"uppercase",color:color||C.gold,border:`1px solid ${color||C.gold}`,opacity:0.85}}>{children}</span>;
const DB=({l,v,color})=> <div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:F.mono,fontSize:11,color:C.whiteDim,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</span><span style={{fontFamily:F.mono,fontSize:11,color:color||C.gold}}>{v}</span></div><div style={{width:"100%",height:4,background:"rgba(232,241,242,0.06)",borderRadius:2}}><div style={{width:`${v}%`,height:"100%",background:color||C.gold,borderRadius:2,transition:"width 0.8s ease"}}/></div></div>;
const IC=({d})=>{const cl={Threat:C.red,Opportunity:C.green,Monitor:C.amber};const bg={Threat:"rgba(232,84,84,0.08)",Opportunity:"rgba(127,176,105,0.08)",Monitor:"rgba(244,162,97,0.08)"};return <div style={{padding:"6px 8px",borderRadius:4,background:bg[d.r],border:`1px solid ${cl[d.r]}22`,textAlign:"center",minWidth:64}}><div style={{fontSize:10,fontFamily:F.mono,color:cl[d.r],textTransform:"uppercase",letterSpacing:"0.05em"}}>{d.r}</div><div style={{fontSize:14,fontFamily:F.mono,color:cl[d.r],fontWeight:700}}>{"●".repeat(d.i)}</div></div>};
const Empty=({label,hint})=> <Cd style={{textAlign:"center",padding:"64px 28px"}}><div style={{fontFamily:F.mono,fontSize:11,color:C.gold,letterSpacing:"0.25em",marginBottom:14}}>{label}</div><p style={{fontFamily:F.body,fontSize:14,color:C.whiteDim,lineHeight:1.7,maxWidth:560,margin:"0 auto"}}>{hint}</p></Cd>;

// TABS
const SignalsTab=()=>{const[cat,setCat]=useState("All");const[sel,setSel]=useState(null);const cats=["All","Social","Technology","Economic","Environmental","Policy"];const fl=cat==="All"?S:S.filter(s=>s.c===cat);
return <div><Cd style={{marginBottom:24,padding:0,overflow:"hidden"}}><Globe sigs={S} cat={cat}/><div style={{padding:"12px 20px",fontFamily:F.mono,fontSize:11,color:C.whiteDim}}>{S.length} SIGNALS · MANUFACTURING / CONSUMER / REGULATORY / CULTURAL NODES · PUMA × COLUMBIA PORTFOLIO</div></Cd>
{S.length===0 ? <Empty label="AWAITING SCAN" hint="No signals yet. Open /src/sport/data/signals.js for the scan framework: source taxonomy, signal schema, scoring rubric, geographic weighting, and time-horizon distribution. Target ~130–180 signals before clustering drivers."/> : <>
<div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>{cats.map(c=> <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?C.goldDim:"transparent",border:`1px solid ${cat===c?C.gold:'rgba(232,241,242,0.1)'}`,color:cat===c?C.gold:C.whiteDim,padding:"6px 14px",borderRadius:4,cursor:"pointer",fontFamily:F.mono,fontSize:11,letterSpacing:"0.05em"}}>{c.toUpperCase()}{c!=="All"&&` (${S.filter(s=>s.c===c).length})`}</button>)}</div>
<div style={{display:"grid",gap:10}}>{fl.map(s=> <Cd key={s.id} onClick={()=>setSel(sel===s.id?null:s.id)} glow={sel===s.id} style={{cursor:"pointer"}}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}><span style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint}}>#{String(s.id).padStart(3,"0")}</span><Bg color={catCol[s.c]}>{s.c}</Bg><Bg color={typeCol[s.ty]}>{s.ty}</Bg><Bg color={confCol[s.co]}>{s.co}</Bg></div><h4 style={{fontFamily:F.body,fontSize:15,fontWeight:500,color:C.white,margin:"0 0 6px",lineHeight:1.4}}>{s.t}</h4><div style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint}}>{s.g} · SURPRISE {"★".repeat(s.su)}{"☆".repeat(3-s.su)} · {s.d.map(d=>DR[d-1]?.n).filter(Boolean).join(", ")}</div>{sel===s.id&&<div style={{marginTop:16,paddingTop:16,borderTop:"1px solid rgba(232,241,242,0.06)"}}><p style={{fontFamily:F.body,fontSize:13,color:C.whiteDim,lineHeight:1.7,margin:"0 0 12px"}}>{s.de}</p><p style={{fontFamily:F.head,fontSize:15,color:C.gold,fontStyle:"italic",margin:0,lineHeight:1.5}}>So What? {s.sw}</p></div>}</Cd>)}</div></>}</div>};

const DriversTab=()=> DR.length===0
  ? <Empty label="CLUSTER PENDING" hint="Drivers are forces derived from clustering ≥100 signals. Populate /src/sport/data/signals.js first; let the cluster shape determine driver count — don't force it to 10."/>
  : <div style={{display:"grid",gap:20}}>{DR.map(d=> <Cd key={d.id} glow><div style={{display:"flex",gap:16,alignItems:"flex-start"}}><div style={{fontSize:32}}>{d.ic}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><h3 style={{fontFamily:F.head,fontSize:22,color:C.white,margin:0}}>{d.n}</h3><span style={{fontFamily:F.mono,fontSize:11,color:d.cl}}>{d.ct} SIGNALS</span></div><p style={{fontFamily:F.body,fontSize:14,color:C.whiteDim,lineHeight:1.7,margin:0}}>{d.ds}</p></div></div></Cd>)}</div>;

const ScenariosTab=()=>{const[sel,setSel]=useState(null);const tc={Probable:C.gold,Deep:C.blue,Cassandra:C.red};return SC.length===0
  ? <Empty label="SCENARIOS PENDING" hint="Scenarios combine driver states into internally consistent 2036 narratives. Identify the highest-impact / highest-uncertainty drivers (critical uncertainties) first, then build narratives around them."/>
  : <div style={{display:"grid",gap:20}}>{SC.map(sc=> <Cd key={sc.id} glow={sel===sc.id} onClick={()=>setSel(sel===sc.id?null:sc.id)} style={{cursor:"pointer"}}><div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}><Bg color={tc[sc.ti]}>{sc.ti}</Bg><span style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint}}>{sc.dv.map(d=>DR[d-1]?.n).filter(Boolean).join(" × ")}</span></div><h3 style={{fontFamily:F.head,fontSize:26,color:C.white,margin:"0 0 8px"}}>{sc.tt}</h3><p style={{fontFamily:F.head,fontSize:15,color:C.gold,fontStyle:"italic",margin:0,lineHeight:1.5}}>"{sc.tl}"</p>{sel===sc.id&&<div style={{marginTop:24}}><h4 style={{fontFamily:F.mono,fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:12}}>THE DISPATCH</h4><div style={{fontFamily:F.body,fontSize:14,color:C.whiteDim,lineHeight:1.85,whiteSpace:"pre-line",borderLeft:`2px solid ${C.goldDim}`,paddingLeft:20,marginBottom:24}}>{sc.dp}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}><div><h4 style={{fontFamily:F.mono,fontSize:11,color:C.red,letterSpacing:"0.1em",marginBottom:8}}>SHADOW SIDE</h4><p style={{fontFamily:F.body,fontSize:13,color:C.whiteDim,lineHeight:1.6,margin:0}}>{sc.ss}</p></div><div><h4 style={{fontFamily:F.mono,fontSize:11,color:C.amber,letterSpacing:"0.1em",marginBottom:8}}>KILLER ASSUMPTION</h4><p style={{fontFamily:F.body,fontSize:13,color:C.whiteDim,lineHeight:1.6,margin:0}}>{sc.ka}</p></div></div><h4 style={{fontFamily:F.mono,fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:12}}>FOUR DIMENSIONS</h4><div style={{maxWidth:400}}><DB l="Discoverability" v={sc.dm.d} color={C.blue}/><DB l="Appeal" v={sc.dm.a} color={C.green}/><DB l="Relevance" v={sc.dm.r} color={C.red}/><DB l="Availability" v={sc.dm.v} color={C.amber}/></div></div>}</Cd>)}</div>};

const MatrixTab=()=> (MX.length===0||SC.length===0)
  ? <Empty label="MATRIX PENDING" hint="The impact matrix stress-tests Puma + Columbia (and sub-brands) against scenarios. Requires scenarios.js and brands.js stable, then map each scenario-brand cell as Threat / Opportunity / Monitor with intensity 1–4."/>
  : <div style={{overflowX:"auto"}}><table style={{borderCollapse:"separate",borderSpacing:4,width:"100%",minWidth:900}}><thead><tr><th style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint,textAlign:"left",padding:8,width:180}}>SCENARIO</th>{BR.map(b=> <th key={b} style={{fontFamily:F.mono,fontSize:10,color:C.whiteDim,textAlign:"center",padding:8,whiteSpace:"nowrap"}}>{b.toUpperCase()}</th>)}</tr></thead><tbody>{SC.map((sc,i)=> <tr key={sc.id}><td style={{fontFamily:F.body,fontSize:12,color:C.white,padding:8}}><span style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint,marginRight:6}}>{sc.ti.toUpperCase()}</span>{sc.tt}</td>{(MX[i]||[]).map((cell,j)=> <td key={j} style={{padding:2}}><IC d={cell}/></td>)}</tr>)}</tbody></table></div>;

const TimelineTab=()=> {const groups=[{k:"NOW",l:"NOW — Act Immediately",cl:C.red,s:"Evidence strong. Deadlines real."},{k:"MON",l:"MONITOR — Set Triggers",cl:C.amber,s:"Track thresholds. When triggered → NOW."},{k:"PREP",l:"PREPARE FOR — Build Optionality",cl:C.blue,s:"Partnerships. Pilots. Strategic options."}];const total=TL.NOW.length+TL.MON.length+TL.PREP.length;return total===0
  ? <Empty label="NO ACTIONS LOGGED" hint="Once scenarios are stable, derive NOW / MONITOR / PREP actions. NOW = immediate decisions, MON = triggers to watch, PREP = optionality to build."/>
  : <div style={{display:"grid",gap:24}}>{groups.map(({k,l,cl,s:sub})=> <div key={k}><h3 style={{fontFamily:F.head,fontSize:22,color:cl,margin:"0 0 4px"}}>{l}</h3><p style={{fontFamily:F.mono,fontSize:11,color:C.whiteFaint,margin:"0 0 12px"}}>{sub}</p><div style={{display:"grid",gap:8}}>{TL[k].map((item,i)=> <Cd key={i}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}><p style={{fontFamily:F.body,fontSize:14,color:C.white,margin:0,flex:1,lineHeight:1.5}}>{item.a}</p><div style={{textAlign:"right",flexShrink:0}}><div style={{fontFamily:F.mono,fontSize:10,color:cl}}>{item.w}</div><div style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint,marginTop:4}}>→ {SC[item.s-1]?.tt}</div></div></div></Cd>)}</div></div>)}</div>};

const VersusTab=()=>{
  const[idxA,setIdxA]=useState(0);
  const[idxB,setIdxB]=useState(()=>{const i=BR.findIndex(b=>/adidas/i.test(b));return i>=0?i:Math.min(9,BR.length-1)});
  const rCol={Threat:C.red,Opportunity:C.green,Monitor:C.amber};
  const rBg={Threat:"rgba(232,84,84,0.08)",Opportunity:"rgba(127,176,105,0.08)",Monitor:"rgba(244,162,97,0.08)"};
  const res=(idx)=>SC.reduce((a,sc,si)=>{const c=MX[si]?.[idx];if(c)a[c.r]=(a[c.r]||0)+1;return a},{Threat:0,Opportunity:0,Monitor:0});
  const sigsFor=(idx)=>{const nm=BR[idx].replace(/\s*\(ref\)/i,"").trim();const re=new RegExp("\\b"+nm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\s+/g,"\\s+")+"\\b","i");return S.filter(s=>re.test(s.t+" "+s.de+" "+s.sw))};
  const selSt={width:"100%",background:C.abyssMid,border:"1px solid rgba(255,107,53,0.2)",borderRadius:4,padding:"8px 12px",fontFamily:F.body,fontSize:14,color:C.white,marginBottom:16,cursor:"pointer",outline:"none",appearance:"none"};
  const sA=sigsFor(idxA),sB=sigsFor(idxB);
  if(MX.length===0||SC.length===0)return <Empty label="MATRIX REQUIRED" hint="The Versus tab needs scenarios.js and matrix.js populated before it can render a comparison."/>;
  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
      {[[idxA,setIdxA,"BRAND A",C.gold],[idxB,setIdxB,"BRAND B",C.blue]].map(([idx,set,lbl,ac],ki)=>{
        const r=res(idx);
        return <Cd key={ki} glow><div style={{fontFamily:F.mono,fontSize:10,color:ac,letterSpacing:"0.15em",marginBottom:8}}>{lbl}</div>
          <select value={idx} onChange={e=>set(Number(e.target.value))} style={selSt}>{BR.map((b,i)=><option key={i} value={i}>{b}</option>)}</select>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["Opportunity","Monitor","Threat"].map(rt=><span key={rt} style={{fontFamily:F.mono,fontSize:10,color:rCol[rt],background:rBg[rt],border:`1px solid ${rCol[rt]}33`,padding:"3px 10px",borderRadius:4}}>{rt} {r[rt]||0}/{SC.length}</span>)}</div>
        </Cd>;
      })}
    </div>
    <div style={{fontFamily:F.mono,fontSize:11,color:C.gold,letterSpacing:"0.15em",marginBottom:12}}>SCENARIO EXPOSURE</div>
    <div style={{overflowX:"auto",marginBottom:32}}><table style={{borderCollapse:"separate",borderSpacing:4,width:"100%"}}>
      <thead><tr>
        <th style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint,textAlign:"left",padding:"8px 12px",minWidth:240}}>SCENARIO</th>
        <th style={{fontFamily:F.mono,fontSize:10,color:C.gold,textAlign:"center",padding:8,whiteSpace:"nowrap"}}>{BR[idxA].toUpperCase()}</th>
        <th style={{fontFamily:F.mono,fontSize:10,color:C.blue,textAlign:"center",padding:8,whiteSpace:"nowrap"}}>{BR[idxB].toUpperCase()}</th>
      </tr></thead>
      <tbody>{SC.map((sc,si)=>{const cA=MX[si]?.[idxA],cB=MX[si]?.[idxB];return <tr key={sc.id}>
        <td style={{padding:"8px 12px"}}><span style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint,marginRight:8}}>{sc.ti.toUpperCase()}</span><span style={{fontFamily:F.body,fontSize:14,color:C.white}}>{sc.tt}</span></td>
        <td style={{padding:4,textAlign:"center"}}>{cA?<IC d={cA}/>:<span style={{color:C.whiteFaint}}>—</span>}</td>
        <td style={{padding:4,textAlign:"center"}}>{cB?<IC d={cB}/>:<span style={{color:C.whiteFaint}}>—</span>}</td>
      </tr>})}</tbody>
    </table></div>
    <div style={{fontFamily:F.mono,fontSize:11,color:C.gold,letterSpacing:"0.15em",marginBottom:12}}>SIGNAL EVIDENCE FROM THE SCAN</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      {[[idxA,sA,C.gold],[idxB,sB,C.blue]].map(([idx,ss,ac])=><div key={idx}>
        <div style={{fontFamily:F.mono,fontSize:10,color:ac,marginBottom:10,letterSpacing:"0.1em"}}>{BR[idx].replace(/\s*\(ref\)/i,"").toUpperCase()} — {ss.length} SIGNAL{ss.length!==1?"S":""}</div>
        {ss.length===0?<p style={{fontFamily:F.body,fontSize:13,color:C.whiteFaint,margin:0}}>No direct mentions in this scan.</p>:
        <div style={{display:"grid",gap:6}}>{ss.map(s=><div key={s.id} style={{background:"rgba(22,29,36,0.6)",border:"1px solid rgba(232,241,242,0.06)",borderRadius:6,padding:"10px 14px"}}>
          <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}><Bg color={catCol[s.c]}>{s.c}</Bg><Bg color={typeCol[s.ty]}>{s.ty}</Bg></div>
          <div style={{fontFamily:F.body,fontSize:13,color:C.white,lineHeight:1.4,marginBottom:4}}>{s.t}</div>
          <div style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint}}>{s.g} · SURPRISE {"★".repeat(s.su)}{"☆".repeat(3-s.su)}</div>
        </div>)}</div>}
      </div>)}
    </div>
  </div>;
};

// PASSWORD
const PW=({ok})=>{const[pw,setPw]=useState("");const[sh,setSh]=useState(false);const[er,setEr]=useState(false);const ck=()=>{if(pw==="scan2036")ok();else{setSh(true);setEr(true);setTimeout(()=>{setSh(false);setEr(false);setPw("")},600)}};return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:C.abyss,fontFamily:F.body}}><Gr/><div style={{textAlign:"center",animation:sh?"shake 0.4s ease":"none"}}><div style={{fontFamily:F.mono,fontSize:11,color:C.gold,letterSpacing:"0.3em",marginBottom:8}}>HORIZON</div><div style={{fontFamily:F.head,fontSize:42,color:C.white,marginBottom:4,lineHeight:1.1}}>Sport &amp; Fitness Apparel</div><div style={{fontFamily:F.head,fontSize:22,color:C.whiteDim,fontStyle:"italic",marginBottom:16}}>Puma &middot; Columbia &mdash; Competitive Futures Intelligence</div><div style={{fontFamily:F.mono,fontSize:10,color:C.whiteFaint,letterSpacing:"0.12em",marginBottom:32}}>100 SIGNALS &nbsp;&middot;&nbsp; 11 DRIVERS &nbsp;&middot;&nbsp; 5 SCENARIOS &nbsp;&middot;&nbsp; BRAND VERSUS</div><div style={{fontFamily:F.mono,fontSize:10,color:C.goldDim,letterSpacing:"0.15em",marginBottom:24}}>HORIZON · SPORT &amp; FITNESS APPAREL</div><div style={{display:"flex",gap:8,justifyContent:"center"}}><input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")ck()}} placeholder="ACCESS CODE" autoFocus style={{background:"rgba(232,241,242,0.04)",border:`1px solid ${er?C.red:'rgba(255,107,53,0.2)'}`,borderRadius:4,padding:"10px 16px",fontFamily:F.mono,fontSize:13,color:C.white,letterSpacing:"0.15em",textAlign:"center",outline:"none",width:200}}/><button onClick={ck} style={{background:C.goldDim,border:`1px solid ${C.gold}`,borderRadius:4,padding:"10px 20px",fontFamily:F.mono,fontSize:11,color:C.gold,cursor:"pointer",letterSpacing:"0.1em"}}>ENTER</button></div><style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}50%{transform:translateX(8px)}75%{transform:translateX(-4px)}}`}</style></div></div>};

// MAIN
export default function App(){const[au,setAu]=useState(false);const[tab,setTab]=useState("signals");if(!au)return <PW ok={()=>setAu(true)}/>;const tabs=[{id:"signals",l:"Signals",n:S.length||null},{id:"drivers",l:"Drivers",n:DR.length||null},{id:"scenarios",l:"Scenarios",n:SC.length||null},{id:"matrix",l:"Impact Matrix"},{id:"timeline",l:"Timeline"},{id:"versus",l:"Versus"}];
return <div style={{minHeight:"100vh",background:C.abyss,fontFamily:F.body,color:C.white}}><Gr/><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=DM+Sans:wght@300;400;500;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/><style>{`*{box-sizing:border-box}body{margin:0;background:${C.abyss}}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,107,53,0.2);border-radius:3px}`}</style>
<header style={{position:"sticky",top:0,zIndex:100,background:"rgba(11,16,20,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,107,53,0.1)",padding:"16px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"baseline",gap:12}}><span style={{fontFamily:F.mono,fontSize:12,color:C.gold,letterSpacing:"0.2em",fontWeight:500}}>HORIZON</span><span style={{fontFamily:F.body,fontSize:13,color:C.whiteFaint}}>·</span><span style={{fontFamily:F.body,fontSize:13,color:C.whiteDim}}>Sport &amp; Fitness Apparel · Puma &times; Columbia</span></div><span style={{fontFamily:F.mono,fontSize:10,color:C.goldDim,border:`1px solid ${C.goldDim}`,padding:"3px 8px",borderRadius:3}}>SCAN BUILD</span></header>
<nav style={{position:"sticky",top:56,zIndex:99,background:"rgba(11,16,20,0.9)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(232,241,242,0.04)",padding:"0 32px",display:"flex",overflowX:"auto"}}>{tabs.map(t=> <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",padding:"14px 20px",whiteSpace:"nowrap",fontFamily:F.mono,fontSize:11,letterSpacing:"0.08em",color:tab===t.id?C.gold:C.whiteFaint,cursor:"pointer",borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent"}}>{t.l.toUpperCase()}{t.n?` (${t.n})`:""}</button>)}</nav>
<main style={{maxWidth:1200,margin:"0 auto",padding:"32px 32px 80px"}}>{tab==="signals"&&<SignalsTab/>}{tab==="drivers"&&<DriversTab/>}{tab==="scenarios"&&<ScenariosTab/>}{tab==="matrix"&&<MatrixTab/>}{tab==="timeline"&&<TimelineTab/>}{tab==="versus"&&<VersusTab/>}</main></div>}
