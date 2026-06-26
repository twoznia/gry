// Generuje 42 pliki SVG dla zestawu medieval2.
// Uruchom: node mahjong/tools/generate_medieval2.mjs
import { writeFileSync, mkdirSync, readFileSync } from 'fs';

const BASE = 'mahjong/pic/medieval2';
const BG = '#b0b0b0';

function svg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" shape-rendering="crispEdges">
<rect width="100" height="120" fill="${BG}"/>
${inner.trim()}
</svg>`;
}

function save(rel, content) {
  const path = `${BASE}/${rel}`;
  const dir = path.substring(0, path.lastIndexOf('/'));
  mkdirSync(dir, { recursive: true });
  writeFileSync(path, content, 'utf8');
  console.log('✓', rel);
}

// Kształt tarczy kite (inny niż oryginalne heater shield)
const KITE = 'M50,8 L82,22 L86,68 L50,112 L14,68 L18,22 Z';
const KITE_IN = 'M50,11 L79,24 L83,68 L50,109 L17,68 L21,24 Z';

function season(bg, rim, inner) {
  return `<path d="${KITE}" fill="${rim}"/>
<path d="${KITE_IN}" fill="${bg}"/>
${inner}`;
}

function gem(main, mid, hi) {
  return `<polygon points="50,14 72,28 78,52 72,76 50,88 28,76 22,52 28,28" fill="#222"/>
<polygon points="50,16 70,29 76,52 70,75 50,86 30,75 24,52 30,29" fill="${main}"/>
<polygon points="50,16 70,29 50,52" fill="${mid}" opacity="0.6"/>
<polygon points="50,16 50,52 30,29" fill="${hi}" opacity="0.7"/>
<polygon points="50,86 30,75 50,52" fill="#000" opacity="0.15"/>
<polygon points="50,86 70,75 50,52" fill="#000" opacity="0.08"/>
<polygon points="42,22 50,18 58,22 50,30" fill="${hi}" opacity="0.8"/>
<polygon points="50,48 53,52 50,56 47,52" fill="${hi}" opacity="0.6"/>`;
}

function gate(door, accent) {
  const dk = '#606060';
  return `<rect x="8" y="30" width="20" height="80" fill="#909090"/>
<rect x="72" y="30" width="20" height="80" fill="#909090"/>
<rect x="8" y="36" width="20" height="2" fill="${dk}"/>
<rect x="8" y="46" width="20" height="2" fill="${dk}"/>
<rect x="8" y="56" width="20" height="2" fill="${dk}"/>
<rect x="8" y="66" width="20" height="2" fill="${dk}"/>
<rect x="8" y="76" width="20" height="2" fill="${dk}"/>
<rect x="8" y="86" width="20" height="2" fill="${dk}"/>
<rect x="72" y="36" width="20" height="2" fill="${dk}"/>
<rect x="72" y="46" width="20" height="2" fill="${dk}"/>
<rect x="72" y="56" width="20" height="2" fill="${dk}"/>
<rect x="72" y="66" width="20" height="2" fill="${dk}"/>
<rect x="72" y="76" width="20" height="2" fill="${dk}"/>
<rect x="72" y="86" width="20" height="2" fill="${dk}"/>
<path d="M8,46 Q8,6 50,6 Q92,6 92,46" fill="#909090"/>
<path d="M14,46 Q14,14 50,14 Q86,14 86,46" fill="#808080"/>
<rect x="28" y="46" width="44" height="64" fill="${door}" stroke="${accent}" stroke-width="2"/>
<rect x="31" y="50" width="18" height="22" fill="${accent}" opacity="0.25" rx="1"/>
<rect x="51" y="50" width="18" height="22" fill="${accent}" opacity="0.25" rx="1"/>
<rect x="31" y="76" width="38" height="22" fill="${accent}" opacity="0.25" rx="1"/>
<rect x="48" y="46" width="4" height="64" fill="${accent}" opacity="0.4"/>
<circle cx="47" cy="78" r="3" fill="${accent}"/>
<circle cx="53" cy="78" r="3" fill="${accent}"/>
<polygon points="50,8 56,18 44,18" fill="#555"/>
<ellipse cx="50" cy="32" rx="9" ry="7" fill="${door}" opacity="0.9"/>
<ellipse cx="50" cy="32" rx="6" ry="4" fill="${door}"/>`;
}

function compass(letter) {
  return `<circle cx="50" cy="62" r="46" fill="#2c1505" stroke="#c8970a" stroke-width="4"/>
<circle cx="50" cy="62" r="40" fill="#6b0d0d"/>
<circle cx="50" cy="62" r="34" fill="#7a1010"/>
<polygon points="50,18 54,28 46,28" fill="#f5c400"/>
<polygon points="50,106 54,96 46,96" fill="#f5c400"/>
<polygon points="6,62 16,58 16,66" fill="#f5c400"/>
<polygon points="94,62 84,58 84,66" fill="#f5c400"/>
<rect x="48" y="26" width="4" height="6" fill="#c8970a" opacity="0.6"/>
<rect x="48" y="90" width="4" height="6" fill="#c8970a" opacity="0.6"/>
<rect x="18" y="60" width="6" height="4" fill="#c8970a" opacity="0.6"/>
<rect x="76" y="60" width="6" height="4" fill="#c8970a" opacity="0.6"/>
<circle cx="50" cy="62" r="5" fill="#c8970a"/>
<text x="50" y="74" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="bold" fill="#f5d060">${letter}</text>`;
}

function chessBase(body) {
  return `<rect x="28" y="108" width="44" height="6" fill="#222" rx="2"/>
<rect x="24" y="104" width="52" height="5" fill="#333" rx="2"/>
${body}`;
}

function tarcza(bg, rim, design) {
  return `<path d="${KITE}" fill="${rim}"/>
<path d="${KITE_IN}" fill="${bg}"/>
${design}`;
}

// ══════════════════════════════════════════════════════════════
// PORY (pory roku — tarcza kite z motywem sezonowym)
// ══════════════════════════════════════════════════════════════

save('1/pory/pory_jesien.svg', svg(season('#6b3a00', '#3d1f00', `
<ellipse cx="50" cy="55" rx="22" ry="26" fill="#d44000"/>
<ellipse cx="32" cy="44" rx="12" ry="10" fill="#c03a00"/>
<ellipse cx="68" cy="44" rx="12" ry="10" fill="#c03a00"/>
<ellipse cx="38" cy="32" rx="10" ry="9" fill="#e06600"/>
<ellipse cx="62" cy="32" rx="10" ry="9" fill="#e06600"/>
<ellipse cx="50" cy="26" rx="10" ry="9" fill="#f08000"/>
<rect x="47" y="68" width="6" height="18" fill="#5c2a00"/>
<rect x="49" y="30" width="2" height="40" fill="#a03000" opacity="0.5"/>
`)));

save('1/pory/pory_lato.svg', svg(season('#6b0000', '#3a0000', `
<circle cx="50" cy="55" r="18" fill="#ffd700"/>
<circle cx="50" cy="55" r="12" fill="#ffaa00"/>
<polygon points="50,26 53,36 47,36" fill="#ffd700"/>
<polygon points="50,84 53,74 47,74" fill="#ffd700"/>
<polygon points="21,55 31,52 31,58" fill="#ffd700"/>
<polygon points="79,55 69,52 69,58" fill="#ffd700"/>
<polygon points="28,34 35,41 30,46" fill="#ffd700"/>
<polygon points="72,34 65,41 70,46" fill="#ffd700"/>
<polygon points="28,76 35,69 30,64" fill="#ffd700"/>
<polygon points="72,76 65,69 70,64" fill="#ffd700"/>
`)));

save('1/pory/pory_wiosna.svg', svg(season('#001a5e', '#00103a', `
<rect x="48" y="56" width="4" height="30" fill="#4a8000"/>
<ellipse cx="38" cy="68" rx="10" ry="5" fill="#3a7000" transform="rotate(-20,38,68)"/>
<ellipse cx="62" cy="68" rx="10" ry="5" fill="#3a7000" transform="rotate(20,62,68)"/>
<ellipse cx="50" cy="33" rx="7" ry="12" fill="#ff8db4"/>
<ellipse cx="50" cy="33" rx="7" ry="12" fill="#ff8db4" transform="rotate(72,50,50)"/>
<ellipse cx="50" cy="33" rx="7" ry="12" fill="#ff8db4" transform="rotate(144,50,50)"/>
<ellipse cx="50" cy="33" rx="7" ry="12" fill="#ff8db4" transform="rotate(216,50,50)"/>
<ellipse cx="50" cy="33" rx="7" ry="12" fill="#ff8db4" transform="rotate(288,50,50)"/>
<circle cx="50" cy="50" r="8" fill="#ffec00"/>
<circle cx="50" cy="50" r="5" fill="#ff8800"/>
`)));

save('1/pory/pory_zima.svg', svg(season('#0a2d0a', '#051805', `
<rect x="47" y="20" width="6" height="70" fill="#d0eeff"/>
<rect x="15" y="51" width="70" height="6" fill="#d0eeff"/>
<line x1="22" y1="22" x2="78" y2="88" stroke="#d0eeff" stroke-width="6"/>
<line x1="78" y1="22" x2="22" y2="88" stroke="#d0eeff" stroke-width="6"/>
<line x1="50" y1="20" x2="44" y2="26" stroke="#a8d8ff" stroke-width="2"/>
<line x1="50" y1="20" x2="56" y2="26" stroke="#a8d8ff" stroke-width="2"/>
<line x1="50" y1="90" x2="44" y2="84" stroke="#a8d8ff" stroke-width="2"/>
<line x1="50" y1="90" x2="56" y2="84" stroke="#a8d8ff" stroke-width="2"/>
<line x1="15" y1="54" x2="21" y2="48" stroke="#a8d8ff" stroke-width="2"/>
<line x1="15" y1="54" x2="21" y2="60" stroke="#a8d8ff" stroke-width="2"/>
<line x1="85" y1="54" x2="79" y2="48" stroke="#a8d8ff" stroke-width="2"/>
<line x1="85" y1="54" x2="79" y2="60" stroke="#a8d8ff" stroke-width="2"/>
<circle cx="50" cy="55" r="10" fill="#a0ccff"/>
<circle cx="50" cy="55" r="6" fill="#d0eeff"/>
`)));

// ══════════════════════════════════════════════════════════════
// SKARB (szlify — sześciokąt, inne niż oryginał w ramce)
// ══════════════════════════════════════════════════════════════

save('1/skarb/skarb_czerwony.svg',  svg(gem('#cc1111','#ff5555','#ffaaaa')));
save('1/skarb/skart_bialy.svg',     svg(gem('#cccccc','#eeeeee','#ffffff')));
save('1/skarb/skart_niebieski.svg', svg(gem('#1133cc','#4466ff','#88aaff')));
save('1/skarb/skart_zielony.svg',   svg(gem('#116622','#22aa44','#66dd88')));

// ══════════════════════════════════════════════════════════════
// BRAMY (łuk kamienny — inne niż oryginalne witraże)
// ══════════════════════════════════════════════════════════════

save('4/bramy/b_biała.svg',       svg(gate('#f0f0f0','#aaaaaa')));
save('4/bramy/b_czerwona.svg',    svg(gate('#cc2222','#880000')));
save('4/bramy/b_jasnazielen.svg', svg(gate('#80ee80','#40aa40')));
save('4/bramy/b_niebieska.svg',   svg(gate('#4169e1','#1a3a8a')));
save('4/bramy/b_pomaranczowa.svg',svg(gate('#ff8c00','#cc5500')));
save('4/bramy/b_rozowa.svg',      svg(gate('#ff69b4','#cc2280')));
save('4/bramy/b_szara.svg',       svg(gate('#666666','#333333')));
save('4/bramy/b_zielona.svg',     svg(gate('#228b22','#145214')));
save('4/bramy/b_zolta.svg',       svg(gate('#ffd700','#cc9900')));

// ══════════════════════════════════════════════════════════════
// BRON (inne kształty i orientacja niż oryginały)
// ══════════════════════════════════════════════════════════════

// halabardy: pojedyncza halabarda (oryginał ma parę)
save('4/bron/bron_halabardy.svg', svg(`
<rect x="47" y="8" width="6" height="100" fill="#8b6914" stroke="#5a4200" stroke-width="1"/>
<polygon points="35,16 53,8 53,48 35,16" fill="#8899aa" stroke="#556677" stroke-width="1"/>
<polygon points="65,16 47,8 47,48 65,16" fill="#aabbcc" stroke="#778899" stroke-width="1"/>
<polygon points="44,6 50,8 56,6 50,1" fill="#ccddee"/>
<rect x="30" y="46" width="40" height="6" fill="#8b6914" stroke="#5a4200" stroke-width="1"/>
<ellipse cx="30" cy="49" rx="4" ry="6" fill="#8b6914"/>
<ellipse cx="70" cy="49" rx="4" ry="6" fill="#8b6914"/>
<rect x="44" y="106" width="12" height="8" fill="#888" rx="2"/>
`));

// kusza: kusznica (zamiast pary łuków)
save('4/bron/bron_kusza.svg', svg(`
<rect x="10" y="54" width="80" height="10" fill="#5c3a00" stroke="#3a2000" stroke-width="1" rx="2"/>
<rect x="42" y="54" width="16" height="16" fill="#4a2e00" stroke="#2c1a00" stroke-width="1"/>
<rect x="47" y="70" width="6" height="12" fill="#4a2e00"/>
<rect x="48" y="16" width="4" height="44" fill="#3a2000" rx="1"/>
<path d="M10,56 Q10,22 52,18" stroke="#6b4400" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M90,56 Q90,22 52,18" stroke="#6b4400" stroke-width="6" fill="none" stroke-linecap="round"/>
<line x1="10" y1="57" x2="50" y2="17" stroke="#ddd" stroke-width="2"/>
<line x1="90" y1="57" x2="50" y2="17" stroke="#ddd" stroke-width="2"/>
<rect x="20" y="57" width="60" height="2" fill="#8b6914"/>
<polygon points="80,58 90,54 90,62" fill="#cc9900"/>
<rect x="49" y="14" width="2" height="6" fill="#222"/>
`));

// luk: łuk pionowy ze strzałą
save('4/bron/bron_luk.svg', svg(`
<path d="M35,10 Q20,60 35,110" stroke="#5c3a00" stroke-width="8" fill="none" stroke-linecap="round"/>
<line x1="35" y1="10" x2="35" y2="110" stroke="#ddd" stroke-width="2"/>
<rect x="38" y="16" width="3" height="80" fill="#8b6914" transform="rotate(-8,50,60)"/>
<polygon points="60,18 64,28 56,26" fill="#cc9900" transform="rotate(-8,50,60)"/>
<polygon points="37,90 43,84 37,88" fill="#cc4444" transform="rotate(-8,50,60)"/>
<polygon points="37,90 31,84 37,88" fill="#cc4444" transform="rotate(-8,50,60)"/>
<circle cx="35" cy="10" r="4" fill="#3a2000"/>
<circle cx="35" cy="110" r="4" fill="#3a2000"/>
`));

// miecze: jeden duży miecz (oryginał ma dwa)
save('4/bron/bron_miecze.svg', svg(`
<polygon points="44,16 56,16 52,88 48,88" fill="#aabbcc" stroke="#667788" stroke-width="1"/>
<rect x="49" y="22" width="2" height="60" fill="#889aaa" opacity="0.6"/>
<rect x="22" y="80" width="56" height="10" fill="#c8a400" stroke="#9a7a00" stroke-width="1" rx="1"/>
<ellipse cx="22" cy="85" rx="5" ry="7" fill="#c8a400"/>
<ellipse cx="78" cy="85" rx="5" ry="7" fill="#c8a400"/>
<rect x="46" y="90" width="8" height="18" fill="#5c3a00" stroke="#3a2000" stroke-width="1"/>
<rect x="46" y="93" width="8" height="2" fill="#3a2000"/>
<rect x="46" y="98" width="8" height="2" fill="#3a2000"/>
<rect x="46" y="103" width="8" height="2" fill="#3a2000"/>
<ellipse cx="50" cy="111" rx="8" ry="5" fill="#c8a400" stroke="#9a7a00" stroke-width="1"/>
<polygon points="44,84 56,84 50,10" fill="#aabbcc"/>
`));

// palka: gwiazda poranna (zamiast prostej pałki)
save('4/bron/bron_palka.svg', svg(`
<rect x="46" y="60" width="8" height="52" fill="#5c3a00" stroke="#3a2000" stroke-width="1" rx="2"/>
<rect x="44" y="70" width="12" height="3" fill="#888"/>
<rect x="44" y="82" width="12" height="3" fill="#888"/>
<rect x="44" y="94" width="12" height="3" fill="#888"/>
<ellipse cx="50" cy="56" rx="4" ry="5" fill="#aaa" stroke="#666" stroke-width="1"/>
<ellipse cx="50" cy="48" rx="3" ry="4" fill="#aaa" stroke="#666" stroke-width="1"/>
<circle cx="50" cy="34" r="18" fill="#888" stroke="#555" stroke-width="2"/>
<circle cx="50" cy="34" r="14" fill="#9a9a9a"/>
<polygon points="50,12 47,20 53,20" fill="#ccc"/>
<polygon points="50,56 47,48 53,48" fill="#ccc"/>
<polygon points="28,34 36,31 36,37" fill="#ccc"/>
<polygon points="72,34 64,31 64,37" fill="#ccc"/>
<polygon points="32,16 38,22 32,28" fill="#ccc"/>
<polygon points="68,16 62,22 68,28" fill="#ccc"/>
<polygon points="32,52 38,46 32,40" fill="#ccc"/>
<polygon points="68,52 62,46 68,40" fill="#ccc"/>
`));

// pochodnia: pojedyncza pochodnia (oryginał ma parę)
save('4/bron/bron_pochodnie.svg', svg(`
<rect x="45" y="70" width="10" height="44" fill="#5c3a00" stroke="#3a2000" stroke-width="1" rx="2"/>
<rect x="44" y="75" width="12" height="3" fill="#8b6914"/>
<rect x="44" y="83" width="12" height="3" fill="#8b6914"/>
<rect x="44" y="91" width="12" height="3" fill="#8b6914"/>
<rect x="38" y="52" width="24" height="22" fill="#8b6914" rx="4"/>
<rect x="36" y="56" width="28" height="4" fill="#6b4a00"/>
<ellipse cx="50" cy="36" rx="12" ry="20" fill="#ff4400"/>
<ellipse cx="50" cy="36" rx="9" ry="16" fill="#ff8800"/>
<ellipse cx="50" cy="40" rx="6" ry="10" fill="#ffcc00"/>
<ellipse cx="48" cy="30" rx="4" ry="9" fill="#ff6600" opacity="0.7"/>
<ellipse cx="53" cy="28" rx="3" ry="8" fill="#ffee00" opacity="0.8"/>
`));

// rycerz: hełm rycerski (oryginał ma pełną sylwetkę rycerza)
save('4/bron/bron_rycerz.svg', svg(`
<rect x="22" y="24" width="56" height="66" fill="#667788" rx="4" stroke="#445566" stroke-width="2"/>
<rect x="18" y="18" width="64" height="14" fill="#778899" rx="3" stroke="#556677" stroke-width="2"/>
<rect x="26" y="44" width="20" height="6" fill="#111" rx="1"/>
<rect x="54" y="44" width="20" height="6" fill="#111" rx="1"/>
<rect x="30" y="56" width="6" height="4" fill="#222" rx="1"/>
<rect x="40" y="60" width="6" height="4" fill="#222" rx="1"/>
<rect x="50" y="56" width="6" height="4" fill="#222" rx="1"/>
<rect x="60" y="60" width="6" height="4" fill="#222" rx="1"/>
<path d="M50,8 Q58,14 52,24 Q60,16 56,28 Q64,18 60,32" stroke="#cc2222" stroke-width="4" fill="none" stroke-linecap="round"/>
<rect x="28" y="88" width="44" height="12" fill="#556677" rx="2"/>
<rect x="18" y="18" width="64" height="3" fill="#99aabb" rx="2" opacity="0.5"/>
`));

// szpady: dwie skrzyżowane szpady
save('4/bron/bron_szpady.svg', svg(`
<line x1="20" y1="8" x2="82" y2="108" stroke="#aabbcc" stroke-width="5" stroke-linecap="round"/>
<line x1="80" y1="8" x2="18" y2="108" stroke="#aabbcc" stroke-width="5" stroke-linecap="round"/>
<line x1="21" y1="10" x2="80" y2="106" stroke="#ddeeff" stroke-width="1" opacity="0.6"/>
<line x1="79" y1="10" x2="20" y2="106" stroke="#ddeeff" stroke-width="1" opacity="0.6"/>
<rect x="14" y="30" width="24" height="6" fill="#c8a400" rx="1" transform="rotate(57,26,33)"/>
<rect x="62" y="30" width="24" height="6" fill="#c8a400" rx="1" transform="rotate(-57,74,33)"/>
<ellipse cx="20" cy="8" rx="6" ry="5" fill="#c8a400"/>
<ellipse cx="80" cy="8" rx="6" ry="5" fill="#c8a400"/>
<polygon points="82,106 80,112 84,112" fill="#aabbcc"/>
<polygon points="18,106 16,112 20,112" fill="#aabbcc"/>
`));

// bron_x: siekiera bojowa (zamiast skrzyżowanych broni)
save('4/bron/bron_x.svg', svg(`
<rect x="46" y="22" width="8" height="84" fill="#5c3a00" stroke="#3a2000" stroke-width="1" rx="2"/>
<rect x="44" y="70" width="12" height="3" fill="#8b6914"/>
<rect x="44" y="82" width="12" height="3" fill="#8b6914"/>
<rect x="44" y="94" width="12" height="3" fill="#8b6914"/>
<path d="M52,18 Q88,20 86,62 Q84,74 52,68 Z" fill="#8899aa" stroke="#556677" stroke-width="2"/>
<path d="M52,42 Q88,68 78,86 L52,68 Z" fill="#8899aa" stroke="#556677" stroke-width="1"/>
<path d="M80,24 Q84,42 82,58" stroke="#ddeeff" stroke-width="2" fill="none" opacity="0.7"/>
<polygon points="52,30 32,26 52,38" fill="#667788"/>
<rect x="44" y="104" width="12" height="8" fill="#888" rx="2"/>
`));

// ══════════════════════════════════════════════════════════════
// STRONY (medalion kompasu — inne niż oryginalne kaligraficzne litery)
// ══════════════════════════════════════════════════════════════

save('4/strony/strony_e.svg', svg(compass('E')));
save('4/strony/strony_n.svg', svg(compass('N')));
save('4/strony/strony_s.svg', svg(compass('S')));
save('4/strony/strony_w.svg', svg(compass('W')));

// ══════════════════════════════════════════════════════════════
// SZACHY (sylwetki bierek — inne proporcje niż oryginał)
// ══════════════════════════════════════════════════════════════

// szachy_bishop: goniec/skoczek (sylwetka)
save('4/szachy/szachy_bishop.svg', svg(chessBase(`
<rect x="38" y="82" width="24" height="8" fill="#222" rx="2"/>
<polygon points="34,90 66,90 62,76 38,76" fill="#333"/>
<rect x="40" y="68" width="20" height="10" fill="#222" rx="2"/>
<ellipse cx="50" cy="58" rx="14" ry="12" fill="#333"/>
<polygon points="50,14 38,46 62,46" fill="#222"/>
<polygon points="50,18 40,44 60,44" fill="#444"/>
<rect x="48" y="22" width="4" height="18" fill="#555"/>
<rect x="46" y="30" width="8" height="2" fill="#888"/>
<rect x="49" y="27" width="2" height="8" fill="#888"/>
<circle cx="50" cy="14" r="4" fill="#555"/>
`)));

// szachy_kon: koń (profil głowy)
save('4/szachy/szachy_kon.svg', svg(chessBase(`
<polygon points="38,104 62,104 64,72 36,72" fill="#333"/>
<ellipse cx="56" cy="54" rx="20" ry="24" fill="#333"/>
<polygon points="60,64 80,72 78,82 56,74" fill="#333"/>
<ellipse cx="72" cy="76" rx="8" ry="5" fill="#333"/>
<ellipse cx="74" cy="78" rx="3" ry="2" fill="#555"/>
<circle cx="58" cy="46" r="5" fill="#111"/>
<circle cx="59" cy="45" r="2" fill="#555"/>
<polygon points="50,28 44,14 58,22" fill="#333"/>
<polygon points="50,28 46,18 56,24" fill="#555"/>
<path d="M40,42 Q36,52 34,68 Q30,58 32,46 Q34,34 38,26" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M38,40 Q34,50 32,66" stroke="#444" stroke-width="3" fill="none" stroke-linecap="round"/>
<rect x="34" y="72" width="32" height="8" fill="#222" rx="2"/>
`)));

// szachy_wieza: wieża (inny styl niż oryginał)
save('4/szachy/szachy_wieza.svg', svg(chessBase(`
<rect x="28" y="92" width="44" height="12" fill="#333" rx="2"/>
<rect x="32" y="56" width="36" height="38" fill="#444"/>
<rect x="30" y="54" width="40" height="4" fill="#333"/>
<rect x="28" y="34" width="12" height="22" fill="#333"/>
<rect x="44" y="34" width="12" height="22" fill="#333"/>
<rect x="60" y="34" width="12" height="22" fill="#333"/>
<rect x="40" y="34" width="4" height="22" fill="${BG}"/>
<rect x="56" y="34" width="4" height="22" fill="${BG}"/>
<rect x="38" y="66" width="8" height="14" fill="#111" rx="1"/>
<rect x="54" y="66" width="8" height="14" fill="#111" rx="1"/>
<rect x="32" y="62" width="36" height="2" fill="#333" opacity="0.6"/>
<rect x="32" y="72" width="36" height="2" fill="#333" opacity="0.6"/>
<rect x="32" y="82" width="36" height="2" fill="#333" opacity="0.6"/>
`)));

// ══════════════════════════════════════════════════════════════
// TARCZE (tarcza kite zamiast heater — inne wzory)
// ══════════════════════════════════════════════════════════════

// t_3krzyze: 3 krzyże na ciemnoniebieskim
save('4/tarcze/t_3krzyze.svg', svg(tarcza('#1a1aaa','#0a0a6a',`
<rect x="46" y="22" width="8" height="20" fill="white"/>
<rect x="40" y="28" width="20" height="8" fill="white"/>
<rect x="24" y="60" width="8" height="20" fill="white"/>
<rect x="18" y="66" width="20" height="8" fill="white"/>
<rect x="68" y="60" width="8" height="20" fill="white"/>
<rect x="62" y="66" width="20" height="8" fill="white"/>
`)));

// t_brazowa: brązowy romb i złote obramowanie
save('4/tarcze/t_brazowa.svg', svg(tarcza('#8b4513','#4a2400',`
<path d="${KITE_IN}" fill="none" stroke="#c8a400" stroke-width="4"/>
<polygon points="50,28 66,55 50,82 34,55" fill="#c8a400" stroke="#9a7a00" stroke-width="1"/>
<polygon points="50,36 60,55 50,74 40,55" fill="#8b4513"/>
<circle cx="50" cy="20" r="4" fill="#c8a400"/>
<circle cx="28" cy="55" r="4" fill="#c8a400"/>
<circle cx="72" cy="55" r="4" fill="#c8a400"/>
<circle cx="50" cy="90" r="4" fill="#c8a400"/>
`)));

// t_gryf: złoty orzeł na czarnym
save('4/tarcze/t_gryf.svg', svg(tarcza('#000000','#222222',`
<ellipse cx="50" cy="64" rx="14" ry="18" fill="#c8a400"/>
<circle cx="50" cy="40" r="10" fill="#c8a400"/>
<polygon points="50,46 58,50 50,56" fill="#aa8800"/>
<circle cx="47" cy="38" r="2" fill="#111"/>
<polygon points="36,56 14,38 22,64 36,70" fill="#c8a400"/>
<polygon points="64,56 86,38 78,64 64,70" fill="#c8a400"/>
<polygon points="44,80 40,98 50,86" fill="#c8a400"/>
<polygon points="56,80 60,98 50,86" fill="#c8a400"/>
<line x1="44" y1="82" x2="40" y2="94" stroke="#c8a400" stroke-width="3"/>
<line x1="56" y1="82" x2="60" y2="94" stroke="#c8a400" stroke-width="3"/>
`)));

// t_krzyz: czerwony krzyż na białej tarczy (oryginał = niebieski/biały)
save('4/tarcze/t_krzyz.svg', svg(tarcza('#ffffff','#dddddd',`
<rect x="20" y="46" width="60" height="16" fill="#cc0000"/>
<rect x="42" y="18" width="16" height="72" fill="#cc0000"/>
<rect x="20" y="46" width="60" height="2" fill="#aa0000"/>
<rect x="42" y="18" width="2" height="72" fill="#aa0000"/>
`)));

// t_malta: czarna tarcza z białą gwiazdą maltańską
save('4/tarcze/t_malta.svg', svg(tarcza('#111111','#000000',`
<polygon points="50,16 54,40 46,40" fill="white"/>
<polygon points="50,96 54,72 46,72" fill="white"/>
<polygon points="20,56 40,52 40,60" fill="white"/>
<polygon points="80,56 60,52 60,60" fill="white"/>
<polygon points="26,24 40,42 34,46" fill="white"/>
<polygon points="74,24 60,42 66,46" fill="white"/>
<polygon points="26,88 40,70 34,66" fill="white"/>
<polygon points="74,88 60,70 66,66" fill="white"/>
<circle cx="50" cy="56" r="8" fill="white"/>
<circle cx="50" cy="56" r="5" fill="#111"/>
`)));

// t_sierzant: czerwona tarcza z białym pasem skośnym
save('4/tarcze/t_sierzant.svg', svg(tarcza('#cc1111','#880000',`
<polygon points="18,32 42,18 82,80 58,104 18,32" fill="white"/>
<polygon points="26,32 38,22 74,80 62,90 26,32" fill="#cc1111"/>
`)));

// t_szachy: szachownica czarno-złota
save('4/tarcze/t_szachy.svg', svg(tarcza('#000000','#333333',`
<rect x="26" y="22" width="12" height="14" fill="#c8a400"/>
<rect x="38" y="22" width="12" height="14" fill="#000"/>
<rect x="50" y="22" width="12" height="14" fill="#c8a400"/>
<rect x="62" y="22" width="12" height="14" fill="#000"/>
<rect x="22" y="36" width="14" height="14" fill="#000"/>
<rect x="36" y="36" width="14" height="14" fill="#c8a400"/>
<rect x="50" y="36" width="14" height="14" fill="#000"/>
<rect x="64" y="36" width="14" height="14" fill="#c8a400"/>
<rect x="20" y="50" width="14" height="14" fill="#c8a400"/>
<rect x="34" y="50" width="14" height="14" fill="#000"/>
<rect x="48" y="50" width="14" height="14" fill="#c8a400"/>
<rect x="62" y="50" width="14" height="14" fill="#000"/>
<rect x="22" y="64" width="14" height="14" fill="#000"/>
<rect x="36" y="64" width="14" height="14" fill="#c8a400"/>
<rect x="50" y="64" width="14" height="14" fill="#000"/>
<rect x="64" y="64" width="14" height="14" fill="#c8a400"/>
<rect x="28" y="78" width="12" height="12" fill="#c8a400"/>
<rect x="40" y="78" width="12" height="12" fill="#000"/>
<rect x="52" y="78" width="12" height="12" fill="#c8a400"/>
`)));

// t_x: purpurowa tarcza z białym saltire
save('4/tarcze/t_x.svg', svg(tarcza('#6600aa','#440077',`
<line x1="20" y1="26" x2="80" y2="92" stroke="white" stroke-width="14"/>
<line x1="80" y1="26" x2="20" y2="92" stroke="white" stroke-width="14"/>
<line x1="20" y1="26" x2="80" y2="92" stroke="#cc88ff" stroke-width="2"/>
<line x1="80" y1="26" x2="20" y2="92" stroke="#cc88ff" stroke-width="2"/>
`)));

// t_y: zielona tarcza z żółtym pall (Y)
save('4/tarcze/t_y.svg', svg(tarcza('#116622','#0a3d16',`
<line x1="18" y1="26" x2="50" y2="56" stroke="#ffd700" stroke-width="14"/>
<line x1="82" y1="26" x2="50" y2="56" stroke="#ffd700" stroke-width="14"/>
<rect x="43" y="54" width="14" height="50" fill="#ffd700"/>
<line x1="18" y1="26" x2="50" y2="56" stroke="#cc9900" stroke-width="2"/>
<line x1="82" y1="26" x2="50" y2="56" stroke="#cc9900" stroke-width="2"/>
<rect x="43" y="54" width="2" height="50" fill="#cc9900"/>
`)));

// ══════════════════════════════════════════════════════════════
// Aktualizuj styles-manifest.js
// ══════════════════════════════════════════════════════════════

const MANIFEST_PATH = 'mahjong/styles-manifest.js';
const manifestSrc = readFileSync(MANIFEST_PATH, 'utf8');

const medieval2Section = {
  id: 'medieval2',
  name: 'Medieval 2',
  tileCount: 144,
  layoutCompatible: true,
  validationErrors: [],
  items: [
    // pory (1x each)
    { styleId:'medieval2', usageCount:1, type:'pory', name:'pory_jesien',   label:'pory jesien',   src:'pic/medieval2/1/pory/pory_jesien.svg',   matchKey:'medieval2::1::pory' },
    { styleId:'medieval2', usageCount:1, type:'pory', name:'pory_lato',     label:'pory lato',     src:'pic/medieval2/1/pory/pory_lato.svg',     matchKey:'medieval2::1::pory' },
    { styleId:'medieval2', usageCount:1, type:'pory', name:'pory_wiosna',   label:'pory wiosna',   src:'pic/medieval2/1/pory/pory_wiosna.svg',   matchKey:'medieval2::1::pory' },
    { styleId:'medieval2', usageCount:1, type:'pory', name:'pory_zima',     label:'pory zima',     src:'pic/medieval2/1/pory/pory_zima.svg',     matchKey:'medieval2::1::pory' },
    // skarb (1x each)
    { styleId:'medieval2', usageCount:1, type:'skarb', name:'skarb_czerwony',   label:'skarb czerwony',   src:'pic/medieval2/1/skarb/skarb_czerwony.svg',   matchKey:'medieval2::1::skarb' },
    { styleId:'medieval2', usageCount:1, type:'skarb', name:'skart_bialy',      label:'skart bialy',      src:'pic/medieval2/1/skarb/skart_bialy.svg',      matchKey:'medieval2::1::skarb' },
    { styleId:'medieval2', usageCount:1, type:'skarb', name:'skart_niebieski',  label:'skart niebieski',  src:'pic/medieval2/1/skarb/skart_niebieski.svg',  matchKey:'medieval2::1::skarb' },
    { styleId:'medieval2', usageCount:1, type:'skarb', name:'skart_zielony',    label:'skart zielony',    src:'pic/medieval2/1/skarb/skart_zielony.svg',    matchKey:'medieval2::1::skarb' },
    // bramy (4x each)
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_biała',        label:'b biała',        src:'pic/medieval2/4/bramy/b_biała.svg',        matchKey:'medieval2::4::bramy::b_biała' },
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_czerwona',     label:'b czerwona',     src:'pic/medieval2/4/bramy/b_czerwona.svg',     matchKey:'medieval2::4::bramy::b_czerwona' },
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_jasnazielen',  label:'b jasnazielen',  src:'pic/medieval2/4/bramy/b_jasnazielen.svg',  matchKey:'medieval2::4::bramy::b_jasnazielen' },
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_niebieska',    label:'b niebieska',    src:'pic/medieval2/4/bramy/b_niebieska.svg',    matchKey:'medieval2::4::bramy::b_niebieska' },
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_pomaranczowa', label:'b pomaranczowa', src:'pic/medieval2/4/bramy/b_pomaranczowa.svg', matchKey:'medieval2::4::bramy::b_pomaranczowa' },
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_rozowa',       label:'b rozowa',       src:'pic/medieval2/4/bramy/b_rozowa.svg',       matchKey:'medieval2::4::bramy::b_rozowa' },
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_szara',        label:'b szara',        src:'pic/medieval2/4/bramy/b_szara.svg',        matchKey:'medieval2::4::bramy::b_szara' },
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_zielona',      label:'b zielona',      src:'pic/medieval2/4/bramy/b_zielona.svg',      matchKey:'medieval2::4::bramy::b_zielona' },
    { styleId:'medieval2', usageCount:4, type:'bramy', name:'b_zolta',        label:'b zolta',        src:'pic/medieval2/4/bramy/b_zolta.svg',        matchKey:'medieval2::4::bramy::b_zolta' },
    // bron (4x each)
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_halabardy', label:'bron halabardy', src:'pic/medieval2/4/bron/bron_halabardy.svg', matchKey:'medieval2::4::bron::bron_halabardy' },
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_kusza',     label:'bron kusza',     src:'pic/medieval2/4/bron/bron_kusza.svg',     matchKey:'medieval2::4::bron::bron_kusza' },
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_luk',       label:'bron luk',       src:'pic/medieval2/4/bron/bron_luk.svg',       matchKey:'medieval2::4::bron::bron_luk' },
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_miecze',    label:'bron miecze',    src:'pic/medieval2/4/bron/bron_miecze.svg',    matchKey:'medieval2::4::bron::bron_miecze' },
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_palka',     label:'bron palka',     src:'pic/medieval2/4/bron/bron_palka.svg',     matchKey:'medieval2::4::bron::bron_palka' },
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_pochodnie', label:'bron pochodnie', src:'pic/medieval2/4/bron/bron_pochodnie.svg', matchKey:'medieval2::4::bron::bron_pochodnie' },
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_rycerz',    label:'bron rycerz',    src:'pic/medieval2/4/bron/bron_rycerz.svg',    matchKey:'medieval2::4::bron::bron_rycerz' },
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_szpady',    label:'bron szpady',    src:'pic/medieval2/4/bron/bron_szpady.svg',    matchKey:'medieval2::4::bron::bron_szpady' },
    { styleId:'medieval2', usageCount:4, type:'bron', name:'bron_x',         label:'bron x',         src:'pic/medieval2/4/bron/bron_x.svg',         matchKey:'medieval2::4::bron::bron_x' },
    // strony (4x each)
    { styleId:'medieval2', usageCount:4, type:'strony', name:'strony_e', label:'strony e', src:'pic/medieval2/4/strony/strony_e.svg', matchKey:'medieval2::4::strony::strony_e' },
    { styleId:'medieval2', usageCount:4, type:'strony', name:'strony_n', label:'strony n', src:'pic/medieval2/4/strony/strony_n.svg', matchKey:'medieval2::4::strony::strony_n' },
    { styleId:'medieval2', usageCount:4, type:'strony', name:'strony_s', label:'strony s', src:'pic/medieval2/4/strony/strony_s.svg', matchKey:'medieval2::4::strony::strony_s' },
    { styleId:'medieval2', usageCount:4, type:'strony', name:'strony_w', label:'strony w', src:'pic/medieval2/4/strony/strony_w.svg', matchKey:'medieval2::4::strony::strony_w' },
    // szachy (4x each)
    { styleId:'medieval2', usageCount:4, type:'szachy', name:'szachy_bishop', label:'szachy bishop', src:'pic/medieval2/4/szachy/szachy_bishop.svg', matchKey:'medieval2::4::szachy::szachy_bishop' },
    { styleId:'medieval2', usageCount:4, type:'szachy', name:'szachy_kon',    label:'szachy kon',    src:'pic/medieval2/4/szachy/szachy_kon.svg',    matchKey:'medieval2::4::szachy::szachy_kon' },
    { styleId:'medieval2', usageCount:4, type:'szachy', name:'szachy_wieza',  label:'szachy wieza',  src:'pic/medieval2/4/szachy/szachy_wieza.svg',  matchKey:'medieval2::4::szachy::szachy_wieza' },
    // tarcze (4x each)
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_3krzyze',  label:'t 3krzyze',  src:'pic/medieval2/4/tarcze/t_3krzyze.svg',  matchKey:'medieval2::4::tarcze::t_3krzyze' },
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_brazowa',  label:'t brazowa',  src:'pic/medieval2/4/tarcze/t_brazowa.svg',  matchKey:'medieval2::4::tarcze::t_brazowa' },
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_gryf',     label:'t gryf',     src:'pic/medieval2/4/tarcze/t_gryf.svg',     matchKey:'medieval2::4::tarcze::t_gryf' },
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_krzyz',    label:'t krzyz',    src:'pic/medieval2/4/tarcze/t_krzyz.svg',    matchKey:'medieval2::4::tarcze::t_krzyz' },
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_malta',    label:'t malta',    src:'pic/medieval2/4/tarcze/t_malta.svg',    matchKey:'medieval2::4::tarcze::t_malta' },
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_sierzant', label:'t sierzant', src:'pic/medieval2/4/tarcze/t_sierzant.svg', matchKey:'medieval2::4::tarcze::t_sierzant' },
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_szachy',   label:'t szachy',   src:'pic/medieval2/4/tarcze/t_szachy.svg',   matchKey:'medieval2::4::tarcze::t_szachy' },
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_x',        label:'t x',        src:'pic/medieval2/4/tarcze/t_x.svg',        matchKey:'medieval2::4::tarcze::t_x' },
    { styleId:'medieval2', usageCount:4, type:'tarcze', name:'t_y',        label:'t y',        src:'pic/medieval2/4/tarcze/t_y.svg',        matchKey:'medieval2::4::tarcze::t_y' },
  ]
};

// Sprawdź liczność
const count = medieval2Section.items.reduce((s, i) => s + i.usageCount, 0);
console.log(`\nTileCount check: ${count} (expected 144)`);

// Wstaw medieval2 do manifestu (przed zamykającym `}`)
if (manifestSrc.includes('"medieval2"')) {
  console.log('ℹ️  medieval2 already in manifest — skip');
} else {
  const insertBefore = '\n  ]\n};';
  const newSection = `,\n    ${JSON.stringify(medieval2Section, null, 4).replace(/\n/g, '\n    ')}`;
  const updated = manifestSrc.replace(
    /(\s*\]\s*\}\s*;?\s*)$/,
    `${newSection}\n  ]\n};\n`
  );
  writeFileSync(MANIFEST_PATH, updated, 'utf8');
  console.log('✓ styles-manifest.js updated');
}

console.log('\n✅ Gotowe! Wszystkie kafelki medieval2 wygenerowane.');
