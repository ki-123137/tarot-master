import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

/* ── STYLES ─────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #030008; color: #E8D5A3; font-family: 'EB Garamond', serif; min-height: 100vh; }
@keyframes tw { 0%,100%{opacity:.12;transform:scale(.7)} 50%{opacity:1;transform:scale(1.4)} }
@keyframes sh { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes gp { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,.3)} 50%{box-shadow:0 0 55px rgba(201,168,76,.65)} }
@keyframes sp { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes dl { from{opacity:0;transform:translateY(-16px) scale(.9)} to{opacity:1;transform:none} }
@keyframes sL { 0%,100%{transform:none} 50%{transform:translateX(-15px) rotate(-5deg)} }
@keyframes sR { 0%,100%{transform:none} 50%{transform:translateX(15px) rotate(5deg)} }
@keyframes fu { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
.fu { animation: fu .45s ease both; }
.gold { background: linear-gradient(135deg,#C9A84C,#F0D080,#C9A84C); background-size: 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: sh 3s linear infinite; }
.glass { background: rgba(14,3,32,.82); backdrop-filter: blur(14px);
  border: 1px solid rgba(201,168,76,.22); border-radius: 14px; }
.btn-g { background: linear-gradient(135deg,#7a5912,#C9A84C,#7a5912); background-size: 200%;
  color: #030008; border: none; border-radius: 8px; padding: 11px 24px;
  font-family: 'Cinzel',serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px;
  cursor: pointer; transition: all .3s; text-transform: uppercase; }
.btn-g:hover { animation: sh 1.5s linear infinite; transform: translateY(-2px); box-shadow: 0 8px 26px rgba(201,168,76,.4); }
.btn-g:disabled { opacity: .3; cursor: not-allowed; transform: none; animation: none; }
.btn-o { background: transparent; color: #E8D5A3; border: 1px solid rgba(201,168,76,.38);
  border-radius: 8px; padding: 10px 22px; font-family: 'Cinzel',serif; font-size: 11px;
  letter-spacing: 1.5px; cursor: pointer; transition: all .3s; text-transform: uppercase; }
.btn-o:hover { border-color: #C9A84C; background: rgba(201,168,76,.1); transform: translateY(-1px); }
.btn-sm { background: rgba(201,168,76,.13); color: #C9A84C; border: 1px solid rgba(201,168,76,.4);
  border-radius: 6px; padding: 7px 14px; font-family: 'Cinzel',serif; font-size: 10px;
  cursor: pointer; transition: all .2s; }
.btn-sm:hover { background: rgba(201,168,76,.26); }
.btn-rd { background: rgba(200,50,50,.1); color: #E87070; border: 1px solid rgba(200,50,50,.38);
  border-radius: 6px; padding: 7px 14px; font-family: 'Cinzel',serif; font-size: 10px; cursor: pointer; }
.deck-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(57px,1fr));
  gap: 6px; max-height: 330px; overflow-y: auto; padding: 12px;
  background: rgba(0,0,0,.25); border-radius: 10px; border: 1px solid rgba(201,168,76,.1); }
.deck-grid::-webkit-scrollbar { width: 4px; }
.deck-grid::-webkit-scrollbar-thumb { background: rgba(201,168,76,.3); border-radius: 2px; }
.dc { cursor: pointer; border-radius: 7px; border: 1.5px solid rgba(201,168,76,.2);
  background: linear-gradient(160deg,#0f0320,#180840); transition: all .2s;
  display: flex; flex-direction: column; align-items: center; justify-content: space-between;
  padding: 5px 3px; height: 84px; position: relative; }
.dc:hover:not(.dc-sel):not(.dc-dim) { border-color: rgba(201,168,76,.8); transform: translateY(-4px) scale(1.05); box-shadow: 0 10px 24px rgba(201,168,76,.22); }
.dc.dc-sel { border-color: #C9A84C; background: linear-gradient(160deg,#1a0528,#2c0a5a); box-shadow: 0 0 20px rgba(201,168,76,.42); }
.dc.dc-dim { opacity: .2; cursor: not-allowed; pointer-events: none; }
.num-inp { background: rgba(255,255,255,.05); border: 1px solid rgba(201,168,76,.35);
  border-radius: 7px; color: #E8D5A3; font-family: 'Cinzel',serif; font-size: 15px;
  padding: 9px 10px; width: 86px; text-align: center; outline: none; }
.num-inp:focus { border-color: #C9A84C; }
.chip { display: inline-flex; align-items: center; gap: 3px; background: rgba(201,168,76,.12);
  border: 1px solid rgba(201,168,76,.35); border-radius: 20px; padding: 3px 10px;
  font-family: 'Cinzel',serif; font-size: 10px; color: #C9A84C; margin: 2px; }
textarea.ta { background: rgba(255,255,255,.04); border: 1px solid rgba(201,168,76,.25);
  border-radius: 8px; color: #E8D5A3; font-family: 'EB Garamond',serif; font-size: 16px;
  padding: 13px; resize: none; width: 100%; outline: none; line-height: 1.65; }
textarea.ta:focus { border-color: rgba(201,168,76,.65); }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-thumb { background: rgba(201,168,76,.3); border-radius: 2px; }
`;

/* ── DATA ──────────────────────────────────────────────────────── */
const MJ = [
  {n:"바보",e:"The Fool",s:"◯",r:"0",k:"새 시작·순수·모험",suit:"major"},
  {n:"마법사",e:"The Magician",s:"∞",r:"Ⅰ",k:"의지·창조·기술",suit:"major"},
  {n:"고위여사제",e:"High Priestess",s:"☽",r:"Ⅱ",k:"직관·신비·내면",suit:"major"},
  {n:"여황제",e:"The Empress",s:"♀",r:"Ⅲ",k:"풍요·모성·창의",suit:"major"},
  {n:"황제",e:"The Emperor",s:"♦",r:"Ⅳ",k:"권위·안정·구조",suit:"major"},
  {n:"교황",e:"The Hierophant",s:"✦",r:"Ⅴ",k:"전통·믿음·교육",suit:"major"},
  {n:"연인",e:"The Lovers",s:"♡",r:"Ⅵ",k:"사랑·선택·조화",suit:"major"},
  {n:"전차",e:"The Chariot",s:"★",r:"Ⅶ",k:"승리·의지·자기통제",suit:"major"},
  {n:"힘",e:"Strength",s:"⊕",r:"Ⅷ",k:"용기·인내·내면의 힘",suit:"major"},
  {n:"은둔자",e:"The Hermit",s:"◈",r:"Ⅸ",k:"성찰·지혜·내면탐구",suit:"major"},
  {n:"운명의바퀴",e:"Wheel of Fortune",s:"⊗",r:"Ⅹ",k:"변화·순환·행운",suit:"major"},
  {n:"정의",e:"Justice",s:"⚖",r:"Ⅺ",k:"공정·균형·진실",suit:"major"},
  {n:"매달린사람",e:"The Hanged Man",s:"⊥",r:"Ⅻ",k:"기다림·관점전환",suit:"major"},
  {n:"죽음",e:"Death",s:"✸",r:"XIII",k:"전환·변환·해방",suit:"major"},
  {n:"절제",e:"Temperance",s:"△",r:"XIV",k:"균형·조화·치유",suit:"major"},
  {n:"악마",e:"The Devil",s:"▽",r:"XV",k:"집착·속박·각성",suit:"major"},
  {n:"탑",e:"The Tower",s:"⚡",r:"XVI",k:"각성·변화·진실",suit:"major"},
  {n:"별",e:"The Star",s:"✦",r:"XVII",k:"희망·치유·영감",suit:"major"},
  {n:"달",e:"The Moon",s:"☾",r:"XVIII",k:"직관·무의식·신비",suit:"major"},
  {n:"태양",e:"The Sun",s:"☀",r:"XIX",k:"성공·기쁨·활력",suit:"major"},
  {n:"심판",e:"Judgement",s:"◎",r:"XX",k:"재탄생·각성·용서",suit:"major"},
  {n:"세계",e:"The World",s:"◉",r:"XXI",k:"완성·통합·성취",suit:"major"},
];
const SUITS = [
  {t:"wands",k:"완드",s:"🔥",ks:["새 열정","계획","성장","안정","경쟁","전진","방어","가속","전략","과부하","소식","추진","창의","비전"]},
  {t:"cups",k:"컵",s:"💧",ks:["새 감정","연결","창의","안정","상실","기억","환상","성찰","소원","완성","메신저","감성","공감","성숙"]},
  {t:"swords",k:"소드",s:"⚔",ks:["진실","선택","고통","안정","패배","과도기","함정","제한","준비","상처","탐구","혼란","결단","권위"]},
  {t:"pentacles",k:"펜타클",s:"💎",ks:["씨앗","균형","기술","안정","결핍","나눔","평가","숙달","독립","풍요","소식","실용","양육","완성"]},
];
const CT = ["페이지","나이트","퀸","킹"];
const CTE = ["Page","Knight","Queen","King"];
const SE = {wands:"Wands",cups:"Cups",swords:"Swords",pentacles:"Pentacles"};

const MINOR = SUITS.flatMap(({t,k,s,ks}) =>
  Array.from({length:14}, (_,i) => {
    const n = i+1, ic = n > 10;
    return {
      n: ic ? `${k} ${CT[n-11]}` : `${k} ${n===1?"에이스":n}`,
      e: ic ? `${CTE[n-11]} of ${SE[t]}` : `${n===1?"Ace":n} of ${SE[t]}`,
      s, r: ic ? CT[n-11][0] : n===1?"A":String(n),
      k: ks[i] ?? ks[13], suit: t,
    };
  })
);

const DECK = [
  ...MJ.map((c,i) => ({...c, num:i+1, id:`M${i}`})),
  ...MINOR.map((c,i) => ({...c, num:MJ.length+i+1, id:`mn${i}`})),
];

const SC = {major:"#C9A84C",wands:"#E74C3C",cups:"#4A90D9",swords:"#9B59B6",pentacles:"#27AE60"};

const SP = {
  one:    {name:"원 카드",    ic:"✦",   count:1,
           pos:["현재의 메시지"],
           tab:["메시지"]},
  three:  {name:"쓰리 카드",  ic:"☽○☾", count:3,
           pos:["과거의 영향","현재의 에너지","미래의 가능성"],
           tab:["과거","현재","미래"]},
  five:   {name:"파이브 크로스",ic:"◉",count:5,
           pos:["핵심 상황","위의 에너지","왼쪽 과거","오른쪽 미래","아래의 기반"],
           tab:["핵심","위","왼과거","오른미래","아래"]},
  celtic: {name:"켈틱 크로스",ic:"⊗",  count:10,
           pos:["현재 상황","교차 과제","의식적 목표","무의식 기반","최근 과거","가까운 미래","자신의 인식","외부 영향","희망/두려움","최종 결과"],
           tab:["현재","교차","목표","기반","최근과거","가까운미래","자신인식","외부영향","희망","최종"]},
};

const STARS = Array.from({length:60}, (_,i) => ({
  id:i, x:Math.random()*100, y:Math.random()*100,
  sz:Math.random()*2+.5, dur:2+Math.random()*3, del:Math.random()*4,
}));

/* ── PROMPTS ────────────────────────────────────────────────────── */
const SYS_PROMPT = [
  "당신은 세계 최고 수준 타로 마스터입니다. 30년 임상 경력, 융 분석심리학 박사.",
  "",
  "【상위 1% 해석 철학】",
  "① 카드 간 대화 분석: 카드들이 서로 나누는 이야기를 파악. 같은 수트 반복→원소 에너지 집중 지적. 메이저 다수→운명적 국면 명시.",
  "② 융 심리학 실제 적용: 역방향=그림자(Shadow) 억압. 코트카드=내담자 내면 인격. 메이저=집단무의식 원형 에너지.",
  "③ 각 카드 3단계 해석: 1)이 카드가 이 자리에 나온 이유 2)카드 상징과 질문의 연결 3)실생활 활용법.",
  "④ 언어: 확신 있게 전달. 부정 카드도 성장 프레임으로. '~일 수 있습니다' 남발 금지.",
  "⑤ 종합: 지배 패턴/테마 명시. 즉시 실행 가능한 행동 1가지. 1개월 내 에너지 변화 언급.",
  "",
  "형식 규칙:",
  "카드 본문에 ** 절대 금지(헤더 제외). 헤더: **[위치] · [카드명]** 형식만. 이모지+제목으로 섹션 구분.",
  "",
  "분량: 1장 7문장 / 3장 카드당 5문장 / 5장 카드당 4문장 / 10장 카드당 3문장(전부 빠짐없이).",
  "",
  "반드시 이 형식:",
  "[질문의 핵심 감정을 짚는 공감 도입 2문장]",
  "",
  "📖 카드가 전하는 이야기",
  "",
  "**[위치] · [카드명]**",
  "[3단계 해석. ** 절대 금지.]",
  "",
  "(카드마다 반복)",
  "",
  "✨ 종합 메시지",
  "[패턴+테마+즉시 행동+에너지 전망]",
  "",
  "💫 오늘의 한 마디",
  "[핵심 통찰 1문장]",
].join("\n");

/* ── API ────────────────────────────────────────────────────────── */
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function callAPI(system, userMsg, model, maxTk, attempt = 0) {
  // /api/tarot 로 라우팅 → 서버에서 Anthropic 호출 → CORS 없음
  if (attempt > 0) await sleep(attempt * 8000);
  try {
    const res = await fetch("/api/tarot", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        model,
        max_tokens: maxTk,
        system,
        messages: [{role:"user", content:userMsg}]
      }),
    });
    if (res.status === 429 && attempt < 3) return callAPI(system, userMsg, model, maxTk, attempt+1);
    if (!res.ok) throw new Error("API_" + res.status);
    const d = await res.json();
    return d.content?.[0]?.text || "";
  } catch(e) {
    if (e.message.startsWith("API_")) throw e;
    throw new Error("NETWORK");
  }
}

async function fetchInterp(q, cards, spKey) {
  const sp = SP[spKey];
  const cl = cards.map((c,i) =>
    `${i+1}번 "${sp.pos[i]}": ${c.n} (${c.e}) [${c.rev?"역방향":"정방향"}] 에너지:${c.k}`
  ).join("\n");
  const maj  = cards.filter(c => c.suit==="major").length;
  const rev  = cards.filter(c => c.rev).length;
  const dist = `완드:${cards.filter(c=>c.suit==="wands").length} 컵:${cards.filter(c=>c.suit==="cups").length} 소드:${cards.filter(c=>c.suit==="swords").length} 펜타클:${cards.filter(c=>c.suit==="pentacles").length}`;
  const model = cards.length >= 6 ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001";
  const maxTk = cards.length >= 6 ? 6000 : Math.min(3000, 800 + cards.length * 280);
  const msg = [
    `질문: "${q}"`,
    `스프레드: ${sp.name}(${sp.count}장)`,
    "",
    "카드:",
    cl,
    "",
    `패턴 — 메이저:${maj}장 역방향:${rev}장 수트분포:${dist}`,
    "",
    "상위 1% 타로 마스터로서 위 패턴 분석을 반영해 완전한 리딩을 해주세요.",
  ].join("\n");
  return callAPI(SYS_PROMPT, msg, model, maxTk);
}

async function fetchFollowUps(q, cards, spKey) {
  const sp = SP[spKey];
  const names = cards.map((c,i) => `${sp.pos[i]}: ${c.n}`).join(", ");
  const sys = "전문 타로 상담사입니다. 내담자가 더 탐색할 꼬리질문 3개를 JSON 배열로만 출력하세요. Q1:감정/관계 심화. Q2:실질적 행동. Q3:1~3개월 전망. 각 20자 이내. 형식: [\"질문1\",\"질문2\",\"질문3\"]";
  try {
    const t = await callAPI(sys, `질문:"${q}" 카드:${names}`, "claude-haiku-4-5-20251001", 300);
    const m = t.match(/\[.*?\]/s);
    return m ? JSON.parse(m[0]) : null;
  } catch { return null; }
}

/* ── CARD COMPONENTS ───────────────────────────────────────────── */
function CardBack({w, h, num}) {
  return (
    <div style={{width:w,height:h,background:"linear-gradient(135deg,#0d0520,#1a0a35,#0d0520)",border:"1.5px solid rgba(201,168,76,.42)",borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:4,border:".5px solid rgba(201,168,76,.18)",borderRadius:5}} />
      {num != null && <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"rgba(201,168,76,.48)",marginBottom:2,position:"relative"}}>{num}</div>}
      <div style={{fontSize:w>80?18:14,opacity:.5,position:"relative"}}>✦</div>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:6,color:"rgba(201,168,76,.38)",letterSpacing:1,marginTop:2,position:"relative"}}>TAROT</div>
    </div>
  );
}

function CardFront({c, w, h}) {
  const col = SC[c.suit] || "#C9A84C";
  return (
    <div style={{width:w,height:h,background:"linear-gradient(160deg,#070015,#12063a)",border:`1.5px solid ${col}80`,borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"7px 4px",position:"relative",overflow:"hidden",transform:c.rev?"rotate(180deg)":"none"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 30% 30%,${col}18,transparent 60%)`}} />
      <div style={{fontFamily:"'Cinzel',serif",fontSize:w>85?10:8,color:`${col}CC`,position:"relative"}}>{c.r}</div>
      <div style={{textAlign:"center",position:"relative"}}>
        <div style={{fontSize:w>85?26:18,lineHeight:1,marginBottom:3}}>{c.s}</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:w>85?9:7,color:col,lineHeight:1.3}}>{c.n}</div>
      </div>
      <div style={{fontSize:6,color:`${col}55`,fontFamily:"'EB Garamond',serif",textAlign:"center",position:"relative"}}>{c.e}</div>
    </div>
  );
}

function FlipCard({c, flipped, w, h, posLabel, onClick}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <div style={{perspective:900,cursor:"pointer",width:w,height:h}} onClick={onClick}>
        <div style={{position:"relative",width:w,height:h,transformStyle:"preserve-3d",transition:"transform .65s cubic-bezier(.4,0,.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0deg)"}}>
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",borderRadius:8,overflow:"hidden"}}>
            <CardBack w={w} h={h} num={c.num} />
          </div>
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",borderRadius:8,overflow:"hidden",transform:"rotateY(180deg)"}}>
            <CardFront c={c} w={w} h={h} />
          </div>
        </div>
      </div>
      {flipped && posLabel && <div style={{fontSize:10,color:"rgba(232,213,163,.6)",textAlign:"center",maxWidth:w+10,lineHeight:1.3}}>{posLabel}</div>}
      {flipped && c.rev && <div style={{fontFamily:"'Cinzel',serif",fontSize:7,color:"rgba(201,168,76,.5)"}}>역방향</div>}
    </div>
  );
}

/* ── TEXT RENDERER ─────────────────────────────────────────────── */
const POS_KW = ["과거","현재","미래","교차","목표","기반","외부","희망","결과","에너지","상황","인식","영향","왼쪽","오른쪽","위의","아래","자신","가까운","최근","두려움","메시지"];

function isCardHdr(t) {
  if (!t.startsWith("**") || t.length < 5) return false;
  if (t.includes("[") && t.includes("]")) return true;
  if (t.includes("·") && POS_KW.some(k => t.includes(k))) return true;
  return false;
}

function TextLine({line, idx}) {
  const t = (line || "").trim();
  if (!t) return <div key={idx} style={{height:6}} />;
  if (t === "---") return <hr key={idx} style={{border:"none",borderTop:"1px solid rgba(201,168,76,.18)",margin:"12px 0"}} />;
  if (t.includes("📖") || t.includes("✨") || t.includes("💫")) {
    return <div key={idx} style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#C9A84C",fontWeight:600,margin:"16px 0 8px"}}>{t}</div>;
  }
  if (isCardHdr(t)) {
    return <div key={idx} style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#C9A84C",fontWeight:600,borderLeft:"3px solid rgba(201,168,76,.5)",paddingLeft:12,margin:"14px 0 7px"}}>{t.replace(/\*\*/g,"")}</div>;
  }
  const html = t.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#C9A84C">$1</strong>');
  return <p key={idx} dangerouslySetInnerHTML={{__html:html}} style={{fontSize:15,color:"rgba(232,213,163,.88)",lineHeight:1.88,marginBottom:9,wordBreak:"break-word",overflowWrap:"break-word"}} />;
}

function FullText({text}) {
  const lines = (text || "").split("\n");
  return (
    <div style={{overflow:"visible"}}>
      {lines.map((line, i) => <TextLine key={i} line={line} idx={i} />)}
    </div>
  );
}

/* ── EXTRACT HELPERS ───────────────────────────────────────────── */
function extractCard(txt, idx) {
  const lines = (txt || "").split("\n");
  let ci = -1, collecting = false, res = [];
  for (const ln of lines) {
    const t = ln.trim();
    if (isCardHdr(t)) {
      ci++;
      if (collecting) break;
      if (ci === idx) { collecting = true; continue; }
    } else if (collecting) {
      if (t.includes("✨") || t.includes("💫")) break;
      res.push(ln);
    }
  }
  return res;
}

function extractSection(txt, wantSummary) {
  const lines = (txt || "").split("\n");
  const isSumLine  = l => l.includes("✨") || (l.trim().length <= 12 && l.includes("종합"));
  const isHiLine   = l => l.includes("💫") || (l.trim().length <= 12 && (l.includes("한 마디") || l.includes("한마디")));
  const isStart = wantSummary ? isSumLine : isHiLine;
  const isStop  = wantSummary ? isHiLine  : () => false;
  let collecting = false, res = [];
  for (const ln of lines) {
    if (!collecting && isStart(ln)) { collecting = true; res.push(ln); continue; }
    if (collecting) {
      if (isStop(ln)) break;
      res.push(ln);
    }
  }
  return res;
}

/* ── INTERP TABS ───────────────────────────────────────────────── */
function InterpTabs({interp, cards, spKey}) {
  const sp = SP[spKey];
  const [tab, setTab] = useState("all");

  const tabs = [
    {k:"all", lb:"전체보기"},
    ...cards.map((_,i) => ({k:`c${i}`, lb:sp.tab?.[i] || sp.pos[i]})),
    {k:"sum", lb:"종합"},
    {k:"hi",  lb:"✦ 한마디"},
  ];

  const Fallback = () => (
    <div style={{padding:"12px 0"}}>
      <p style={{color:"rgba(232,213,163,.45)",fontSize:13,lineHeight:1.7,marginBottom:10}}>이 섹션을 파싱하지 못했습니다.</p>
      <button className="btn-sm" onClick={() => setTab("all")}>↗ 전체보기 탭으로</button>
    </div>
  );

  const renderBody = () => {
    if (tab === "all") return <FullText text={interp} />;

    if (tab === "sum") {
      const ls = extractSection(interp, true);
      return ls.length > 0 ? <FullText text={ls.join("\n")} /> : <Fallback />;
    }

    if (tab === "hi") {
      const ls = extractSection(interp, false);
      if (!ls.length) return <Fallback />;
      const body = ls.filter(l => l.trim() && l.trim().length > 15);
      const show = body.length > 0 ? body : ls.slice(-2);
      return (
        <div style={{textAlign:"center",padding:"22px 0"}}>
          <div style={{fontSize:34,marginBottom:14}}>💫</div>
          {show.map((l,i) => (
            <div key={i} style={{fontFamily:"'Cinzel',serif",fontSize:17,color:"#C9A84C",lineHeight:1.85,fontWeight:600,marginBottom:5,wordBreak:"break-word"}}>
              {l.trim().replace(/\*\*/g,"").replace(/💫/g,"").trim()}
            </div>
          ))}
        </div>
      );
    }

    const idx  = parseInt(tab.slice(1));
    const card = cards[idx];
    const ls   = extractCard(interp, idx);
    const col  = SC[card?.suit] || "#C9A84C";
    return (
      <div>
        {card && (
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,padding:"11px 13px",background:"rgba(255,255,255,.03)",borderRadius:9,border:`1px solid ${col}35`}}>
            <div style={{fontSize:24}}>{card.s}</div>
            <div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:col,fontWeight:600,marginBottom:2}}>
                {sp.pos[idx]} · {card.n}{card.rev?" (역방향)":""}
              </div>
              <div style={{fontSize:12,color:"rgba(232,213,163,.5)"}}>에너지: {card.k}</div>
            </div>
          </div>
        )}
        {ls.length > 0 ? <FullText text={ls.join("\n")} /> : <Fallback />}
      </div>
    );
  };

  return (
    <div style={{overflow:"visible"}}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14,borderBottom:"1px solid rgba(201,168,76,.14)",paddingBottom:9}}>
        {tabs.map(t => {
          const active = tab === t.k;
          return (
            <button key={t.k} onClick={() => setTab(t.k)} style={{background:active?"rgba(201,168,76,.18)":"transparent",border:`1px solid ${active?"rgba(201,168,76,.7)":"rgba(201,168,76,.2)"}`,borderRadius:20,padding:"6px 12px",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:.5,color:active?"#C9A84C":"rgba(232,213,163,.45)",cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>
              {t.lb}
            </button>
          );
        })}
      </div>
      <div style={{overflow:"visible",overflowWrap:"break-word"}}>
        {renderBody()}
      </div>
    </div>
  );
}

/* ── SAVE PANEL ─────────────────────────────────────────────────── */
function buildTxt(q, cards, spKey, interp) {
  const sp  = SP[spKey];
  const now = new Date().toLocaleString("ko-KR");
  const cl  = cards.map((c,i) => `  ${sp.pos[i]}: #${c.num} ${c.n}${c.rev?" (역방향)":""} — ${c.k}`).join("\n");
  return `✦ 타로 마스터 리딩 기록\n${"=".repeat(38)}\n날짜: ${now}\n스프레드: ${sp.name}\n\n질문: "${q}"\n\n카드:\n${cl}\n\n${"=".repeat(38)}\n\n${(interp||"").replace(/\*\*/g,"")}`;
}

function SavePanel({q, cards, spKey, interp}) {
  const [show, setShow] = useState(false);
  const [cop,  setCop]  = useState(false);
  const [msg,  setMsg]  = useState("");
  const txt = buildTxt(q, cards, spKey, interp);

  const copy = async (s) => {
    try { await navigator.clipboard.writeText(s); }
    catch { const ta=document.createElement("textarea");ta.value=s;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta); }
    setCop(true);
    setTimeout(() => setCop(false), 2500);
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({title:"타로 리딩 결과", text:txt.slice(0,600)}); setMsg("공유 완료!"); }
      catch(e) { if(e.name!=="AbortError"){await copy(txt);setMsg("복사됨 — 카톡/문자에 붙여넣기!");} }
    } else { await copy(txt); setMsg("복사됨 — 카톡/문자에 붙여넣기!"); }
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <>
      {show && (
        <div onClick={() => setShow(false)} style={{position:"fixed",inset:0,background:"rgba(3,0,8,.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,backdropFilter:"blur(8px)"}}>
          <div onClick={e => e.stopPropagation()} style={{background:"rgba(14,3,32,.97)",border:"1px solid rgba(201,168,76,.3)",borderRadius:14,padding:20,maxWidth:540,width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#C9A84C",letterSpacing:2,marginBottom:10,textAlign:"center"}}>✦ 전체 선택 후 복사하세요</div>
            <textarea readOnly value={txt} onFocus={e => e.target.select()} className="ta" style={{flex:1,minHeight:260,fontFamily:"monospace",fontSize:12,overflowY:"auto"}} />
            <div style={{display:"flex",gap:8,marginTop:10,justifyContent:"center"}}>
              <button className="btn-sm" onClick={() => copy(txt)}>📋 전체 복사</button>
              <button className="btn-o" onClick={() => setShow(false)} style={{padding:"8px 18px",fontSize:11}}>닫기</button>
            </div>
          </div>
        </div>
      )}
      <div style={{background:"rgba(14,3,32,.88)",border:"1px solid rgba(201,168,76,.32)",borderRadius:14,padding:"16px 13px",marginBottom:14}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"rgba(201,168,76,.8)",marginBottom:12,textAlign:"center"}}>✦ 리딩 결과 저장 &amp; 공유</div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
          {[
            {onClick:()=>setShow(true),  col:"201,168,76", em:"📄", lb:"TXT 보기",  sb:"전체복사"},
            {onClick:()=>copy(txt),      col:cop?"39,174,96":"155,89,182", em:cop?"✅":"📋", lb:cop?"복사됨!":"텍스트 복사", sb:"붙여넣기용"},
            {onClick:share,              col:"231,76,60",   em:"📤", lb:"공유하기",  sb:"카톡·문자"},
          ].map(({onClick,col,em,lb,sb}, i) => (
            <button key={i} onClick={onClick} style={{background:`rgba(${col},.1)`,border:`1px solid rgba(${col},.5)`,borderRadius:9,padding:"11px 8px",cursor:"pointer",textAlign:"center",flex:"1 1 66px",minWidth:66,transition:"all .2s"}}>
              <div style={{fontSize:19,marginBottom:3}}>{em}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:.5,marginBottom:1}}>{lb}</div>
              <div style={{fontSize:9,color:"rgba(232,213,163,.4)"}}>{sb}</div>
            </button>
          ))}
        </div>
        {msg && <div style={{marginTop:10,textAlign:"center",fontSize:13,color:"#27AE60",background:"rgba(39,174,96,.1)",border:"1px solid rgba(39,174,96,.3)",borderRadius:7,padding:"6px 12px"}}>{msg}</div>}
      </div>
    </>
  );
}

/* ── SCREENS ─────────────────────────────────────────────────────── */
function Welcome({onMode}) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"36px 20px",textAlign:"center"}}>
      <div style={{width:118,height:118,borderRadius:"50%",background:"radial-gradient(circle,rgba(123,47,190,.4),rgba(201,168,76,.1) 60%,transparent)",border:"1px solid rgba(201,168,76,.28)",display:"flex",alignItems:"center",justifyContent:"center",animation:"gp 3s ease-in-out infinite",margin:"0 auto 28px"}}>
        <div style={{fontSize:44,filter:"drop-shadow(0 0 14px #C9A84C)"}}>✦</div>
      </div>
      <div className="gold fu" style={{fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:700,marginBottom:7,animationDelay:".08s"}}>타로 마스터 리딩 ✦</div>
      <div className="fu" style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:4,color:"rgba(232,213,163,.45)",marginBottom:8,animationDelay:".13s"}}>PROFESSIONAL TAROT CONSULTATION</div>
      <div className="fu" style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:8,animationDelay:".17s"}}>
        <span style={{background:"linear-gradient(135deg,#7a5912,#C9A84C)",borderRadius:20,padding:"4px 14px",fontFamily:"'Cinzel',serif",fontSize:10,color:"#030008",fontWeight:700,letterSpacing:1}}>✦ TOP 1% MODULE</span>
        <span style={{background:"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.38)",borderRadius:20,padding:"4px 12px",fontFamily:"'Cinzel',serif",fontSize:9,color:"rgba(201,168,76,.8)"}}>융 심리학 · 3단계 해석 · 패턴 분석</span>
      </div>
      <div className="fu" style={{fontSize:13,color:"rgba(232,213,163,.55)",marginBottom:36,animationDelay:".21s",lineHeight:1.7}}>
        78장 전체 덱 · 번호 입력 선택 · 상위 1% AI 해석 · 꼬리질문
      </div>
      <div className="fu" style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center",animationDelay:".25s"}}>
        {[
          {m:"client",     em:"🌙", t:"내담자 직접 뽑기", d:"78장 전체 덱에서\n직접 카드 선택", bc:"rgba(201,168,76,.28)", hc:"rgba(201,168,76,.8)",  tc:"#C9A84C"},
          {m:"consultant", em:"☀",  t:"상담사 리딩",       d:"번호 입력 또는\n자동 선택 가능",  bc:"rgba(123,47,190,.36)", hc:"rgba(123,47,190,.9)", tc:"#9B59B6"},
        ].map(({m,em,t,d,bc,hc,tc}) => {
          const [hov, setHov] = useState(false);
          return (
            <div key={m} onClick={() => onMode(m)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
              style={{padding:"22px 18px",width:190,cursor:"pointer",transition:"all .3s",textAlign:"center",background:"rgba(14,3,32,.82)",backdropFilter:"blur(14px)",border:`1px solid ${hov?hc:bc}`,borderRadius:14,transform:hov?"translateY(-5px)":"none"}}>
              <div style={{fontSize:28,marginBottom:10}}>{em}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:12,fontWeight:600,color:tc,letterSpacing:1,marginBottom:5}}>{t}</div>
              <div style={{fontSize:13,color:"rgba(232,213,163,.58)",lineHeight:1.6,whiteSpace:"pre-line"}}>{d}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Setup({mode, onBack, onStart}) {
  const [q,   setQ]   = useState("");
  const [spK, setSpK] = useState("three");
  const mc = mode === "client" ? "#C9A84C" : "#9B59B6";
  return (
    <div style={{maxWidth:630,margin:"0 auto",padding:"28px 16px",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <div className="fu" style={{textAlign:"center",marginBottom:26}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:3,color:mc,marginBottom:4}}>
          {mode==="client"?"내담자 직접 뽑기":"상담사 리딩"} · STEP 1/3
        </div>
        <div className="gold" style={{fontFamily:"'Cinzel',serif",fontSize:21,fontWeight:600}}>질문과 스프레드 설정</div>
      </div>
      <div className="glass fu" style={{padding:18,marginBottom:12,animationDelay:".07s"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"rgba(201,168,76,.7)",marginBottom:8}}>✦ 질문 또는 탐색 주제</div>
        <textarea className="ta" rows={3} value={q} onChange={e => setQ(e.target.value)} placeholder="예: 현재 이 관계에서 내가 알아야 할 에너지는? / 이 직업 결정에 대한 카드의 메시지는?" />
      </div>
      <div className="glass fu" style={{padding:18,marginBottom:22,animationDelay:".13s"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"rgba(201,168,76,.7)",marginBottom:11}}>✦ 스프레드 선택</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {Object.entries(SP).map(([k,sp]) => {
            const active = spK === k;
            return (
              <div key={k} onClick={() => setSpK(k)} style={{padding:"11px 13px",borderRadius:9,border:`1.5px solid ${active?"rgba(201,168,76,.8)":"rgba(201,168,76,.18)"}`,background:active?"rgba(201,168,76,.08)":"rgba(255,255,255,.02)",cursor:"pointer",transition:"all .22s"}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:active?"#C9A84C":"rgba(232,213,163,.38)",marginBottom:2}}>{sp.ic} · {sp.count}장</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:active?"#E8D5A3":"rgba(232,213,163,.6)",fontWeight:600}}>{sp.name}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="fu" style={{display:"flex",gap:10,justifyContent:"center",animationDelay:".18s"}}>
        <button className="btn-o" onClick={onBack}>← 뒤로</button>
        <button className="btn-g" disabled={!q.trim()} onClick={() => onStart(q.trim(), spK)}>카드 뽑기 시작 →</button>
      </div>
    </div>
  );
}

function Draw({mode, spKey, q, onBack, onDone}) {
  const sp = SP[spKey];
  const [shuffling, setShuffling] = useState(true);
  const [sel, setSel]   = useState([]);
  const [numV, setNumV] = useState("");
  const gridRef = useRef(null);
  const mc = mode === "client" ? "#C9A84C" : "#9B59B6";

  useEffect(() => {
    const t = setTimeout(() => setShuffling(false), 1900);
    return () => clearTimeout(t);
  }, []);

  const toggle = useCallback(i => {
    setSel(prev => prev.includes(i) ? prev.filter(x=>x!==i) : prev.length < sp.count ? [...prev,i] : prev);
  }, [sp.count]);

  const addNum = () => {
    const n = parseInt(numV);
    if (!n || n < 1 || n > 78) { alert("1~78 사이의 번호를 입력하세요."); return; }
    const idx = n - 1;
    if (sel.includes(idx)) { alert(`#${n} ${DECK[idx].n}은 이미 선택됨`); return; }
    if (sel.length >= sp.count) { alert(`이미 ${sp.count}장 선택됨`); return; }
    setSel(prev => [...prev, idx]);
    setNumV("");
    setTimeout(() => {
      const dg = gridRef.current;
      if (dg) { const it = dg.querySelectorAll(".dc"); if(it[idx]) it[idx].scrollIntoView({behavior:"smooth",block:"center"}); }
    }, 120);
  };

  const autoSel = () => {
    const arr = Array.from({length:78},(_,i)=>i);
    for(let i=arr.length-1;i>0;i--){const j=0|Math.random()*(i+1);[arr[i],arr[j]]=[arr[j],arr[i]];}
    setSel(arr.slice(0, sp.count));
  };

  if (shuffling) {
    return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:40}}>
        <div className="gold" style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:600,marginBottom:9}}>카드를 섞고 있습니다...</div>
        <div style={{fontSize:14,color:"rgba(232,213,163,.5)",marginBottom:32}}>우주의 에너지가 카드와 공명합니다</div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:140}}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{marginLeft:i?-26:0,animation:`${i%2?"sR":"sL"} ${.8+i*.15}s ${i*.08}s ease-in-out infinite`}}>
              <CardBack w={78} h={128} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"26px 14px"}}>
      <div className="fu" style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:3,color:mc,marginBottom:4}}>STEP 2/3</div>
        <div className="gold" style={{fontFamily:"'Cinzel',serif",fontSize:19,fontWeight:600,marginBottom:4}}>{sp.count}장을 선택하세요</div>
        <div style={{fontSize:13,color:"rgba(232,213,163,.5)"}}>{mode==="client"?"카드 클릭 또는 번호 입력":"번호 입력 · 클릭 · 자동 선택 모두 가능"}</div>
      </div>
      <div className="glass fu" style={{padding:"8px 13px",marginBottom:11,animationDelay:".05s"}}>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"rgba(201,168,76,.5)",marginRight:6}}>질문</span>
        <span style={{fontSize:14,color:"rgba(232,213,163,.8)"}}>"{q}"</span>
      </div>
      <div className="glass fu" style={{padding:"14px 16px",marginBottom:11,animationDelay:".09s"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"rgba(201,168,76,.65)",marginBottom:8}}>
          ✦ 번호 입력 <span style={{color:"rgba(232,213,163,.35)",fontFamily:"'EB Garamond',serif",fontSize:12}}>
            (1~22메이저 · 23~36완드 · 37~50컵 · 51~64소드 · 65~78펜타클)
          </span>
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap",marginBottom:10}}>
          <input type="number" className="num-inp" value={numV} min={1} max={78} placeholder="1–78"
            onChange={e => setNumV(e.target.value)} onKeyDown={e => e.key==="Enter" && addNum()} />
          <button className="btn-sm" onClick={addNum}>＋ 추가</button>
          <button className="btn-rd" onClick={() => setSel([])}>전체 취소</button>
          {mode === "consultant" && (
            <button className="btn-sm" style={{background:"rgba(123,47,190,.18)",borderColor:"rgba(123,47,190,.5)",color:"#B070E0"}} onClick={autoSel}>✦ 자동</button>
          )}
        </div>
        <div style={{minHeight:24}}>
          {sel.length === 0
            ? <span style={{fontSize:12,color:"rgba(232,213,163,.3)"}}>아직 선택 없음</span>
            : sel.map(i => {
                const c = DECK[i];
                return (
                  <span key={i} className="chip">
                    <span style={{color:SC[c.suit],marginRight:2}}>#{c.num}</span>
                    {c.n}
                    <span style={{cursor:"pointer",fontSize:12,marginLeft:2,opacity:.65}} onClick={() => setSel(p=>p.filter(x=>x!==i))}>×</span>
                  </span>
                );
              })}
        </div>
      </div>
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:mc,letterSpacing:2,marginBottom:5}}>{sel.length} / {sp.count} 선택됨</div>
        <div style={{height:3,background:"rgba(255,255,255,.1)",borderRadius:2,maxWidth:220,margin:"0 auto"}}>
          <div style={{height:"100%",background:`linear-gradient(90deg,${mc},rgba(201,168,76,.8))`,borderRadius:2,width:`${(sel.length/sp.count)*100}%`,transition:"width .28s"}} />
        </div>
      </div>
      <div className="glass fu" style={{padding:11,marginBottom:16,animationDelay:".12s"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"rgba(201,168,76,.6)",textAlign:"center",marginBottom:7}}>✦ 78장 전체 덱 — 클릭하여 선택</div>
        <div className="deck-grid" ref={gridRef}>
          {DECK.map((c, i) => {
            const isSel = sel.includes(i), isDim = sel.length >= sp.count && !isSel;
            return (
              <div key={i} className={`dc${isSel?" dc-sel":""}${isDim?" dc-dim":""}`}
                style={{animationDelay:`${i*.006}s`,animation:`dl .28s ${i*.006}s ease both`}}
                onClick={() => toggle(i)} title={`#${c.num} ${c.n} | ${c.k}`}>
                {isSel && (
                  <div style={{position:"absolute",top:3,right:3,width:13,height:13,borderRadius:"50%",background:"#C9A84C",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#030008",fontWeight:700,fontFamily:"'Cinzel',serif"}}>
                    {sel.indexOf(i)+1}
                  </div>
                )}
                <div style={{fontFamily:"'Cinzel',serif",fontSize:8,color:isSel?"#C9A84C":(SC[c.suit]||"#C9A84C")+"90"}}>{c.num}</div>
                <div style={{fontSize:13}}>{c.s}</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:6,color:isSel?"#C9A84C":"rgba(232,213,163,.5)",textAlign:"center",lineHeight:1.2}}>
                  {c.n.length>5?c.n.slice(0,5)+"…":c.n}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="fu" style={{display:"flex",gap:10,justifyContent:"center",paddingBottom:26,animationDelay:".16s"}}>
        <button className="btn-o" onClick={onBack}>← 뒤로</button>
        <button className="btn-g" disabled={sel.length < sp.count} onClick={() => {
          const picked = sel.map(i => ({...DECK[i], rev:Math.random()>.65}));
          onDone(picked);
        }}>리딩 시작 →</button>
      </div>
    </div>
  );
}

function Reading({cards, spKey, q, mode, onRestart}) {
  const sp = SP[spKey];
  const mc = mode === "client" ? "#C9A84C" : "#9B59B6";
  const [rev,     setRev]     = useState([]);
  const [interp,  setInterp]  = useState("");
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState(null);
  const [detail,  setDetail]  = useState(null);
  const [fus,     setFus]     = useState(null);
  const [fuLoad,  setFuLoad]  = useState(false);
  const [selFu,   setSelFu]   = useState(null);
  const [fuItp,   setFuItp]   = useState("");
  const [fuLoad2, setFuLoad2] = useState(false);
  const started = useRef(false);
  const allRev = rev.length === cards.length;

  const revealCard = i => {
    if (rev.includes(i)) return;
    setRev(prev => {
      const next = [...prev, i];
      if (next.length === cards.length) doInterp();
      return next;
    });
  };
  const revealAll = () => { setRev(cards.map((_,i)=>i)); doInterp(); };

  const doInterp = (force=false) => {
    if (started.current && !force) return;
    started.current = true;
    setLoading(true); setErr(null); setInterp(""); setFus(null); setFuItp(""); setSelFu(null);
    fetchInterp(q, cards, spKey)
      .then(t => {
        setInterp(t);
        setLoading(false);
        setFuLoad(true);
        fetchFollowUps(q, cards, spKey)
          .then(qs => { setFus(qs); setFuLoad(false); })
          .catch(() => setFuLoad(false));
      })
      .catch(e => { setErr(e.message); setLoading(false); started.current = false; });
  };

  const pickFu = (fq, idx) => {
    setSelFu(idx); setFuItp(""); setFuLoad2(true);
    fetchInterp(fq, cards, spKey)
      .then(t => { setFuItp(t); setFuLoad2(false); })
      .catch(() => { setFuItp("추가 해석 오류. 잠시 후 다시 시도해주세요."); setFuLoad2(false); });
  };

  useEffect(() => { if (allRev) doInterp(); }, [allRev]);

  const makeFlip = (c, i, w, h, lbl) => (
    <FlipCard key={i} c={c} flipped={rev.includes(i)} w={w} h={h} posLabel={lbl}
      onClick={rev.includes(i) ? () => setDetail(i) : () => revealCard(i)} />
  );

  const spreadLayout = () => {
    if (spKey==="one")    return <div style={{display:"flex",justifyContent:"center",padding:"10px 0"}}>{makeFlip(cards[0],0,100,162,sp.pos[0])}</div>;
    if (spKey==="three")  return <div style={{display:"flex",justifyContent:"center",gap:13,padding:"10px 0",flexWrap:"wrap"}}>{cards.map((c,i)=>makeFlip(c,i,84,136,sp.pos[i]))}</div>;
    if (spKey==="five")   return (
      <div style={{display:"grid",gridTemplateAreas:'". top ." "left center right" ". bottom ."',gridTemplateColumns:"1fr 1fr 1fr",gap:8,justifyItems:"center",alignItems:"center",padding:7}}>
        {[["center",0],["top",1],["left",2],["right",3],["bottom",4]].map(([ga,i]) => (
          <div key={i} style={{gridArea:ga}}>{makeFlip(cards[i],i,70,113,sp.pos[i])}</div>
        ))}
      </div>
    );
    return (
      <div>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>{cards.slice(0,5).map((c,i)=>makeFlip(c,i,60,97,sp.pos[i]))}</div>
        <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap"}}>{cards.slice(5).map((c,i)=>makeFlip(c,i+5,60,97,sp.pos[i+5]))}</div>
      </div>
    );
  };

  const detCard = detail != null ? cards[detail] : null;
  const detCol  = detCard ? (SC[detCard.suit] || "#C9A84C") : "#C9A84C";

  return (
    <div style={{maxWidth:750,margin:"0 auto",padding:"24px 14px 60px"}}>
      {detail != null && (
        <div onClick={() => setDetail(null)} style={{position:"fixed",inset:0,background:"rgba(3,0,8,.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:18,backdropFilter:"blur(10px)"}}>
          <div onClick={e => e.stopPropagation()} style={{background:"rgba(14,3,32,.96)",border:"1px solid rgba(201,168,76,.28)",borderRadius:14,padding:22,maxWidth:350,width:"100%",textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><CardFront c={detCard} w={88} h={143} /></div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:detCol,fontWeight:600,marginBottom:3}}>{detCard.n}{detCard.rev?" (역방향)":""}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"rgba(232,213,163,.45)",marginBottom:8}}>카드 #{detCard.num} · {detCard.e} · {sp.pos[detail]}</div>
            <div style={{fontSize:13,color:"rgba(232,213,163,.7)",lineHeight:1.6}}>핵심 에너지: <span style={{color:detCol}}>{detCard.k}</span></div>
            <button className="btn-o" onClick={() => setDetail(null)} style={{marginTop:12,padding:"9px 20px",fontSize:11}}>닫기</button>
          </div>
        </div>
      )}

      <div className="fu" style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:3,color:mc,marginBottom:4}}>{sp.name} · STEP 3/3</div>
        <div className="gold" style={{fontFamily:"'Cinzel',serif",fontSize:19,fontWeight:600}}>타로 마스터 리딩</div>
      </div>

      <div className="glass fu" style={{padding:"8px 13px",marginBottom:12,animationDelay:".05s"}}>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"rgba(201,168,76,.5)",marginRight:6}}>질문</span>
        <span style={{fontSize:14,color:"rgba(232,213,163,.8)"}}>"{q}"</span>
      </div>

      <div className="glass fu" style={{padding:13,marginBottom:12,animationDelay:".08s"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"rgba(201,168,76,.55)",textAlign:"center",marginBottom:10}}>
          ✦ {sp.name} · {allRev?"카드 클릭 → 상세":"카드 클릭 또는 버튼으로 공개"}
        </div>
        {spreadLayout()}
        {!allRev && (
          <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10}}>
            {rev.length < cards.length && <button className="btn-o" onClick={() => revealCard(rev.length)}>다음 카드 →</button>}
            <button className="btn-o" onClick={revealAll}>전체 공개 →</button>
          </div>
        )}
      </div>

      {allRev && (
        <div style={{background:"rgba(14,3,32,.82)",border:"1px solid rgba(201,168,76,.22)",borderRadius:14,padding:"18px 16px",marginBottom:12,overflow:"visible"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:2,color:"#C9A84C",marginBottom:13,textAlign:"center"}}>✦ 상위 1% 타로 마스터 해석</div>
          {loading ? (
            <div style={{textAlign:"center",padding:"26px 0"}}>
              <div style={{width:40,height:40,borderRadius:"50%",border:"2px solid rgba(201,168,76,.18)",borderTop:"2px solid #C9A84C",animation:"sp 1s linear infinite",margin:"0 auto 11px"}} />
              <div style={{fontSize:14,color:"rgba(232,213,163,.48)",marginBottom:5}}>카드의 에너지를 읽는 중입니다...</div>
              <div style={{fontSize:12,color:"rgba(232,213,163,.3)"}}>{cards.length>=6?"켈틱 크로스는 30~60초 소요됩니다":"잠시만 기다려주세요 (20~30초)"}</div>
            </div>
          ) : err ? (
            <div style={{textAlign:"center",padding:"18px 0"}}>
              <div style={{fontSize:20,marginBottom:9}}>{err==="RATE_LIMIT"?"⏳":"⚠"}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#C9A84C",marginBottom:7}}>{err==="RATE_LIMIT"?"분당 요청 한도 초과":"해석 오류"}</div>
              <div style={{fontSize:14,color:"rgba(232,213,163,.6)",lineHeight:1.7,marginBottom:14}}>{err==="RATE_LIMIT"?"1~2분 후 다시 시도해주세요.":"잠시 후 다시 시도해주세요."}</div>
              <button className="btn-sm" onClick={() => doInterp(true)}>↺ 다시 해석하기</button>
            </div>
          ) : interp ? (
            <InterpTabs interp={interp} cards={cards} spKey={spKey} />
          ) : null}
        </div>
      )}

      {allRev && !loading && interp && (
        <div style={{marginBottom:12}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"rgba(201,168,76,.45)",marginBottom:8,textAlign:"center"}}>✦ 카드 요약 (클릭 → 상세)</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(98px,1fr))",gap:7}}>
            {cards.map((c,i) => {
              const cl = SC[c.suit];
              return (
                <div key={i} onClick={() => setDetail(i)} style={{background:"rgba(14,3,32,.82)",border:"1px solid rgba(201,168,76,.14)",borderRadius:9,padding:8,cursor:"pointer",transition:"all .2s",textAlign:"center"}}
                  onMouseEnter={e => e.currentTarget.style.borderColor=cl+"55"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="rgba(201,168,76,.14)"}>
                  <div style={{fontSize:8,color:"rgba(201,168,76,.45)",marginBottom:1,fontFamily:"'Cinzel',serif"}}>#{c.num}</div>
                  <div style={{fontSize:15,marginBottom:2}}>{c.s}</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:8,color:cl,marginBottom:1}}>{sp.pos[i]}</div>
                  <div style={{fontSize:11,color:"#E8D5A3",marginBottom:c.rev?2:0}}>{c.n}</div>
                  {c.rev && <div style={{fontFamily:"'Cinzel',serif",fontSize:7,color:"rgba(201,168,76,.45)"}}>역방향</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {allRev && !loading && interp && (
        <div style={{background:"rgba(14,3,32,.88)",border:"1px solid rgba(201,168,76,.28)",borderRadius:14,padding:"16px 14px",marginBottom:12}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"rgba(201,168,76,.75)",marginBottom:4,textAlign:"center"}}>✦ 이 리딩에서 더 탐색해볼 질문</div>
          <div style={{fontSize:12,color:"rgba(232,213,163,.42)",textAlign:"center",marginBottom:12}}>클릭하면 같은 카드 배열로 추가 해석을 드립니다</div>
          {fuLoad ? (
            <div style={{textAlign:"center",padding:"10px 0"}}>
              <div style={{width:26,height:26,borderRadius:"50%",border:"2px solid rgba(201,168,76,.2)",borderTop:"2px solid #C9A84C",animation:"sp 1s linear infinite",margin:"0 auto 7px"}} />
              <div style={{fontSize:12,color:"rgba(232,213,163,.38)"}}>꼬리질문 생성 중...</div>
            </div>
          ) : (fus || []).map((fq, i) => (
            <div key={i}>
              <button onClick={() => pickFu(fq, i)} style={{width:"100%",marginBottom:7,padding:"12px 15px",background:selFu===i?"rgba(201,168,76,.14)":"rgba(255,255,255,.03)",border:`1px solid ${selFu===i?"rgba(201,168,76,.65)":"rgba(201,168,76,.2)"}`,borderRadius:9,cursor:"pointer",textAlign:"left",transition:"all .2s"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#C9A84C",flexShrink:0,marginTop:1}}>Q{i+1}</span>
                  <span style={{fontSize:15,color:"rgba(232,213,163,.88)",lineHeight:1.55,wordBreak:"break-word"}}>{fq}</span>
                </div>
              </button>
              {selFu === i && (
                <div style={{background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.2)",borderRadius:9,padding:14,marginBottom:9}}>
                  {fuLoad2 ? (
                    <div style={{textAlign:"center",padding:"10px 0"}}>
                      <div style={{width:26,height:26,borderRadius:"50%",border:"2px solid rgba(201,168,76,.18)",borderTop:"2px solid #C9A84C",animation:"sp 1s linear infinite",margin:"0 auto 7px"}} />
                      <div style={{fontSize:12,color:"rgba(232,213,163,.4)"}}>추가 해석 중...</div>
                    </div>
                  ) : fuItp ? (
                    <div style={{overflow:"visible"}}>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#C9A84C",letterSpacing:1,marginBottom:11}}>✦ 추가 해석 — {fq}</div>
                      <FullText text={fuItp} />
                      <div style={{marginTop:13,paddingTop:10,borderTop:"1px solid rgba(201,168,76,.14)",fontSize:12,color:"rgba(232,213,163,.42)",textAlign:"right",fontFamily:"'Cinzel',serif"}}>
                        더 궁금하신 점이 있으시면 새 리딩을 시작해보세요.
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {allRev && !loading && interp && (
        <SavePanel q={q} cards={cards} spKey={spKey} interp={interp} />
      )}

      <div style={{display:"flex",gap:10,justifyContent:"center",paddingTop:4}}>
        <button className="btn-o" onClick={onRestart}>새로운 리딩 시작</button>
      </div>
    </div>
  );
}

/* ── MAIN APP ────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [mode,   setMode]   = useState(null);
  const [q,      setQ]      = useState("");
  const [spKey,  setSpKey]  = useState("three");
  const [cards,  setCards]  = useState([]);

  const reset = () => { setScreen("welcome"); setMode(null); setQ(""); setSpKey("three"); setCards([]); };

  return (
    <>
      <Head>
        <title>타로 마스터 리딩 ✦ TOP 1%</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="상위 1% 타로 마스터 AI 해석 · 78장 전체 덱 · 켈틱 크로스" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>" />
      </Head>
      <div style={{background:"#030008",minHeight:"100vh",color:"#E8D5A3",fontFamily:"'EB Garamond',serif",position:"relative",overflow:"hidden"}}>
        <style dangerouslySetInnerHTML={{__html:CSS}} />
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        {STARS.map(s => (
          <div key={s.id} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.sz,height:s.sz,background:"#C9A84C",borderRadius:"50%",animation:`tw ${s.dur}s ${s.del}s ease-in-out infinite`}} />
        ))}
      </div>
      <div style={{position:"relative",zIndex:1}}>
        {screen==="welcome"  && <Welcome onMode={m => { setMode(m); setScreen("setup"); }} />}
        {screen==="setup"    && <Setup mode={mode} onBack={() => setScreen("welcome")} onStart={(q2,sp2) => { setQ(q2); setSpKey(sp2); setScreen("draw"); }} />}
        {screen==="draw"     && <Draw mode={mode} spKey={spKey} q={q} onBack={() => setScreen("setup")} onDone={cs => { setCards(cs); setScreen("reading"); }} />}
        {screen==="reading"  && <Reading cards={cards} spKey={spKey} q={q} mode={mode} onRestart={reset} />}
      </div>
      </div>
    </>
  );
}
