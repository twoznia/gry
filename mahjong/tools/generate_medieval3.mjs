/**
 * Generuje tileset medieval3 dla gry Mahjong.
 * Styl bliski oryginałowi: heater shield, kolorowe bramy, wielkie litery na strony świata.
 */
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const BASE = join(ROOT, 'mahjong', 'pic', 'medieval3');
const BG = '#b0b0b0';

function svg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" shape-rendering="crispEdges">
<rect width="100" height="120" fill="${BG}"/>
${inner.trim()}
</svg>`;
}

function save(rel, content) {
  const p = join(BASE, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, 'utf8');
}

// Heater shield — jak oryginał: płaski góra, zaostrzony dół
const HS = 'M10,8 L90,8 L90,76 L50,110 L10,76 Z';
const HS_IN = 'M14,12 L86,12 L86,74 L50,106 L14,74 Z';

function shield(outer, fill, inner = '') {
  return `<path d="${HS}" fill="${outer}"/>
<path d="${HS_IN}" fill="${fill}"/>
${inner}`;
}

// ==================== PORY (1x each = 4 tiles) ====================

// Pory_jesien: bordowa tarcza, złote drzewo liściaste
save('1/pory/pory_jesien.svg', svg(
  shield('#4a0000', '#8b0000', `
<rect x="47" y="68" width="6" height="32" fill="#5c2a00"/>
<rect x="36" y="80" width="28" height="4" fill="#5c2a00"/>
<ellipse cx="50" cy="52" rx="22" ry="20" fill="#e07800"/>
<ellipse cx="34" cy="44" rx="13" ry="11" fill="#cc6000"/>
<ellipse cx="66" cy="44" rx="13" ry="11" fill="#cc6000"/>
<ellipse cx="42" cy="33" rx="11" ry="10" fill="#f09000"/>
<ellipse cx="58" cy="33" rx="11" ry="10" fill="#f09000"/>
<ellipse cx="50" cy="27" rx="10" ry="9" fill="#ffaa00"/>`)
));

// Pory_lato: ciemnoniebieski, żółte słońce promieniujące
save('1/pory/pory_lato.svg', svg(
  shield('#001a50', '#0a3080', `
<circle cx="50" cy="57" r="16" fill="#ffd700"/>
<circle cx="50" cy="57" r="10" fill="#ffee44"/>
<rect x="48" y="22" width="4" height="14" fill="#ffd700"/>
<rect x="48" y="78" width="4" height="14" fill="#ffd700"/>
<rect x="22" y="55" width="14" height="4" fill="#ffd700"/>
<rect x="64" y="55" width="14" height="4" fill="#ffd700"/>
<rect x="33" y="30" width="4" height="14" transform="rotate(45,35,37)" fill="#ffd700"/>
<rect x="63" y="30" width="4" height="14" transform="rotate(-45,65,37)" fill="#ffd700"/>
<rect x="33" y="73" width="4" height="14" transform="rotate(-45,35,80)" fill="#ffd700"/>
<rect x="63" y="73" width="4" height="14" transform="rotate(45,65,80)" fill="#ffd700"/>`)
));

// Pory_wiosna: ciemnozielona tarcza, biała lilia
save('1/pory/pory_wiosna.svg', svg(
  shield('#003300', '#005500', `
<rect x="48" y="72" width="4" height="26" fill="#006600"/>
<ellipse cx="50" cy="65" rx="5" ry="14" fill="#ffffff"/>
<ellipse cx="36" cy="52" rx="5" ry="13" transform="rotate(-30,36,52)" fill="#ffffff"/>
<ellipse cx="64" cy="52" rx="5" ry="13" transform="rotate(30,64,52)" fill="#ffffff"/>
<ellipse cx="40" cy="40" rx="4" ry="11" transform="rotate(-55,40,40)" fill="#ffeeee"/>
<ellipse cx="60" cy="40" rx="4" ry="11" transform="rotate(55,60,40)" fill="#ffeeee"/>
<circle cx="50" cy="60" r="7" fill="#ffd700"/>
<circle cx="50" cy="60" r="4" fill="#ffee22"/>`)
));

// Pory_zima: ciemnoszara tarcza, niebieski śnieżynka
save('1/pory/pory_zima.svg', svg(
  shield('#1a1a2e', '#2a2a4e', `
<rect x="48" y="22" width="4" height="72" fill="#aaddff"/>
<rect x="22" y="55" width="56" height="4" fill="#aaddff"/>
<rect x="31" y="31" width="4" height="52" transform="rotate(45,33,57)" fill="#aaddff"/>
<rect x="31" y="31" width="4" height="52" transform="rotate(-45,67,57)" fill="#aaddff"/>
<circle cx="50" cy="57" r="7" fill="#ddeeff"/>
<circle cx="50" cy="24" r="4" fill="#aaddff"/>
<circle cx="50" cy="90" r="4" fill="#aaddff"/>
<circle cx="24" cy="57" r="4" fill="#aaddff"/>
<circle cx="76" cy="57" r="4" fill="#aaddff"/>
<circle cx="31" cy="30" r="3" fill="#aaddff"/>
<circle cx="69" cy="30" r="3" fill="#aaddff"/>
<circle cx="31" cy="84" r="3" fill="#aaddff"/>
<circle cx="69" cy="84" r="3" fill="#aaddff"/>`)
));

// ==================== SKARB (1x each = 4 tiles) ====================

function gem(frameColor, gemColor, gemLight) {
  return svg(`
<rect x="6" y="6" width="88" height="108" fill="${frameColor}"/>
<rect x="10" y="10" width="80" height="100" fill="${BG}"/>
<rect x="6" y="6" width="14" height="14" fill="${BG}"/>
<rect x="80" y="6" width="14" height="14" fill="${BG}"/>
<rect x="6" y="100" width="14" height="14" fill="${BG}"/>
<rect x="80" y="100" width="14" height="14" fill="${BG}"/>
<polygon points="10,10 24,10 10,24" fill="${frameColor}"/>
<polygon points="90,10 76,10 90,24" fill="${frameColor}"/>
<polygon points="10,110 24,110 10,96" fill="${frameColor}"/>
<polygon points="90,110 76,110 90,96" fill="${frameColor}"/>
<rect x="16" y="22" width="68" height="76" fill="${frameColor}" rx="2"/>
<rect x="22" y="28" width="56" height="64" fill="${BG}" rx="2"/>
<polygon points="50,32 62,40 68,56 62,72 50,80 38,72 32,56 38,40" fill="${gemColor}"/>
<polygon points="50,32 62,40 50,38" fill="${gemLight}"/>
<polygon points="50,32 38,40 50,38" fill="${gemLight}"/>
<polygon points="32,56 38,40 36,52" fill="${gemColor}" opacity="0.6"/>
<polygon points="68,56 62,40 64,52" fill="${gemColor}" opacity="0.8"/>
`);
}

save('1/skarb/skarb_czerwony.svg', gem('#660077', '#dd0000', '#ff6666'));
save('1/skarb/skart_bialy.svg', gem('#334455', '#ccddee', '#ffffff'));
save('1/skarb/skart_niebieski.svg', gem('#660077', '#0044cc', '#4488ff'));
save('1/skarb/skart_zielony.svg', gem('#660077', '#009900', '#44dd44'));

// ==================== BRAMY (4x each = 9 tiles) ====================
// Kolorowe gotyckie okno zajmujące prawie cały kafelek

function gate(mainFill, archDark, tracery) {
  return svg(`
<rect x="4" y="0" width="92" height="120" fill="#888"/>
<rect x="0" y="0" width="4" height="120" fill="#999"/>
<rect x="96" y="0" width="4" height="120" fill="#999"/>
<rect x="8" y="4" width="84" height="112" fill="${archDark}"/>
<path d="M14,116 L14,44 Q14,8 50,8 Q86,8 86,44 L86,116 Z" fill="${mainFill}"/>
<circle cx="50" cy="40" r="18" fill="${archDark}"/>
<circle cx="50" cy="40" r="12" fill="${mainFill}"/>
<rect x="48" y="28" width="4" height="24" fill="${archDark}"/>
<rect x="38" y="38" width="24" height="4" fill="${archDark}"/>
<circle cx="50" cy="40" r="5" fill="${tracery}"/>
<rect x="46" y="60" width="8" height="56" fill="${archDark}"/>
<rect x="14" y="88" width="72" height="8" fill="${archDark}"/>
<rect x="46" y="60" width="4" height="56" fill="${mainFill}" opacity="0.4"/>
<rect x="14" y="88" width="72" height="4" fill="${mainFill}" opacity="0.4"/>
<rect x="4" y="0" width="10" height="12" fill="#777"/>
<rect x="86" y="0" width="10" height="12" fill="#777"/>
`);
}

save('4/bramy/b_biała.svg', gate('#ddeeff', '#8899aa', '#ffffff'));
save('4/bramy/b_czerwona.svg', gate('#cc0000', '#6b0000', '#ff6666'));
save('4/bramy/b_jasnazielen.svg', gate('#44cc44', '#226622', '#aaffaa'));
save('4/bramy/b_niebieska.svg', gate('#0055cc', '#002266', '#6699ff'));
save('4/bramy/b_pomaranczowa.svg', gate('#ee7700', '#7a3a00', '#ffcc66'));
save('4/bramy/b_rozowa.svg', gate('#dd44aa', '#770055', '#ffaadd'));
save('4/bramy/b_szara.svg', gate('#778899', '#334455', '#aabbcc'));
save('4/bramy/b_zielona.svg', gate('#007744', '#003322', '#44cc88'));
save('4/bramy/b_zolta.svg', gate('#ddcc00', '#887700', '#ffee44'));

// ==================== BRON (4x each = 9 tiles) ====================

// bron_halabardy: dwie skrzyżowane halabardy
save('4/bron/bron_halabardy.svg', svg(`
<rect x="48" y="10" width="4" height="100" fill="#888" transform="rotate(35,50,60)"/>
<rect x="48" y="10" width="4" height="100" fill="#888" transform="rotate(-35,50,60)"/>
<polygon points="72,16 82,12 78,24 68,24" fill="#cccccc" transform="rotate(35,50,60)"/>
<polygon points="72,16 82,12 78,24 68,24" fill="#cccccc" transform="rotate(-35,50,60)"/>
<rect x="46" y="24" width="8" height="8" fill="#8b6914" transform="rotate(35,50,60)"/>
<rect x="46" y="24" width="8" height="8" fill="#8b6914" transform="rotate(-35,50,60)"/>
`));

// bron_kusza: kusza z napiętą cięciwą
save('4/bron/bron_kusza.svg', svg(`
<rect x="46" y="10" width="8" height="90" fill="#5c3a00"/>
<rect x="44" y="14" width="12" height="6" fill="#8b6914"/>
<rect x="20" y="42" width="60" height="6" fill="#5c3a00"/>
<rect x="18" y="42" width="8" height="6" fill="#8b6914"/>
<rect x="74" y="42" width="8" height="6" fill="#8b6914"/>
<line x1="22" y1="45" x2="50" y2="55" stroke="#ccaa44" stroke-width="2"/>
<line x1="78" y1="45" x2="50" y2="55" stroke="#ccaa44" stroke-width="2"/>
<polygon points="48,55 52,55 50,68" fill="#aaaaaa"/>
<polygon points="48,12 52,12 50,6 46,8 54,8" fill="#aaaaaa"/>
<rect x="30" y="40" width="6" height="6" fill="#cc6600"/>
<rect x="64" y="40" width="6" height="6" fill="#cc6600"/>
`));

// bron_luk: łuk z dwiema strzałami
save('4/bron/bron_luk.svg', svg(`
<path d="M24,16 Q16,60 24,104" stroke="#5c3a00" stroke-width="8" fill="none"/>
<line x1="24" y1="16" x2="24" y2="104" stroke="#ccaa44" stroke-width="2"/>
<rect x="26" y="56" width="60" height="4" fill="#aaaaaa"/>
<polygon points="86,55 86,63 94,58" fill="#888"/>
<rect x="26" y="36" width="50" height="4" fill="#aaaaaa"/>
<polygon points="76,35 76,43 84,39" fill="#888"/>
<rect x="26" y="56" width="8" height="4" fill="#cc6600"/>
<rect x="26" y="36" width="8" height="4" fill="#cc6600"/>
`));

// bron_miecze: dwa skrzyżowane miecze
save('4/bron/bron_miecze.svg', svg(`
<rect x="48" y="8" width="6" height="88" fill="#bbbbcc" transform="rotate(25,50,60)"/>
<rect x="48" y="8" width="6" height="88" fill="#bbbbcc" transform="rotate(-25,50,60)"/>
<rect x="38" y="54" width="24" height="6" fill="#cc9900" transform="rotate(25,50,60)"/>
<rect x="38" y="54" width="24" height="6" fill="#cc9900" transform="rotate(-25,50,60)"/>
<rect x="48" y="86" width="6" height="18" fill="#8b6914" transform="rotate(25,50,60)"/>
<rect x="48" y="86" width="6" height="18" fill="#8b6914" transform="rotate(-25,50,60)"/>
<polygon points="47,8 53,8 50,2" fill="#ddddee" transform="rotate(25,50,60)"/>
<polygon points="47,8 53,8 50,2" fill="#ddddee" transform="rotate(-25,50,60)"/>
`));

// bron_palka: dwie skrzyżowane buławy
save('4/bron/bron_palka.svg', svg(`
<rect x="48" y="36" width="6" height="76" fill="#5c3a00" transform="rotate(20,50,72)"/>
<rect x="48" y="36" width="6" height="76" fill="#5c3a00" transform="rotate(-20,50,72)"/>
<circle cx="50" cy="28" r="16" fill="#444" transform="rotate(20,50,72)"/>
<circle cx="50" cy="28" r="16" fill="#444" transform="rotate(-20,50,72)"/>
<circle cx="50" cy="16" r="6" fill="#666" transform="rotate(20,50,72)"/>
<circle cx="62" cy="26" r="6" fill="#666" transform="rotate(20,50,72)"/>
<circle cx="60" cy="40" r="6" fill="#666" transform="rotate(20,50,72)"/>
<circle cx="38" cy="40" r="6" fill="#666" transform="rotate(20,50,72)"/>
<circle cx="38" cy="26" r="6" fill="#666" transform="rotate(20,50,72)"/>
`));

// bron_pochodnie: trzy pochodnie
save('4/bron/bron_pochodnie.svg', svg(`
<rect x="22" y="40" width="8" height="64" fill="#5c3a00"/>
<rect x="46" y="24" width="8" height="80" fill="#5c3a00"/>
<rect x="70" y="40" width="8" height="64" fill="#5c3a00"/>
<ellipse cx="26" cy="34" rx="8" ry="14" fill="#ff6600"/>
<ellipse cx="50" cy="18" rx="8" ry="14" fill="#ff6600"/>
<ellipse cx="74" cy="34" rx="8" ry="14" fill="#ff6600"/>
<ellipse cx="26" cy="30" rx="5" ry="9" fill="#ffcc00"/>
<ellipse cx="50" cy="14" rx="5" ry="9" fill="#ffcc00"/>
<ellipse cx="74" cy="30" rx="5" ry="9" fill="#ffcc00"/>
<ellipse cx="26" cy="28" rx="2" ry="5" fill="#ffff88"/>
<ellipse cx="50" cy="12" rx="2" ry="5" fill="#ffff88"/>
<ellipse cx="74" cy="28" rx="2" ry="5" fill="#ffff88"/>
`));

// bron_rycerz: włócznia rycerska
save('4/bron/bron_rycerz.svg', svg(`
<rect x="48" y="8" width="5" height="96" fill="#8b6914"/>
<rect x="47" y="8" width="1" height="96" fill="#aa8820"/>
<polygon points="44,8 56,8 52,24 48,24" fill="#cccccc"/>
<polygon points="44,8 48,8 48,16" fill="#888888"/>
<rect x="36" y="52" width="28" height="8" fill="#cc0000"/>
<rect x="36" y="52" width="28" height="3" fill="#aa0000"/>
<circle cx="50" cy="56" r="5" fill="#ffd700"/>
<rect x="40" y="88" width="20" height="16" fill="#336699"/>
<rect x="44" y="92" width="12" height="8" fill="#4477aa"/>
`));

// bron_szpady: trzy szpady wachlarzem
save('4/bron/bron_szpady.svg', svg(`
<rect x="48" y="8" width="4" height="80" fill="#bbbbcc"/>
<rect x="48" y="8" width="4" height="80" fill="#bbbbcc" transform="rotate(20,50,88)"/>
<rect x="48" y="8" width="4" height="80" fill="#bbbbcc" transform="rotate(-20,50,88)"/>
<rect x="42" y="78" width="16" height="4" fill="#cc9900"/>
<rect x="42" y="78" width="16" height="4" fill="#cc9900" transform="rotate(20,50,88)"/>
<rect x="42" y="78" width="16" height="4" fill="#cc9900" transform="rotate(-20,50,88)"/>
<rect x="46" y="88" width="8" height="24" fill="#8b6914"/>
<polygon points="48,8 52,8 50,2" fill="#ddddee"/>
<polygon points="48,8 52,8 50,2" fill="#ddddee" transform="rotate(20,50,88)"/>
<polygon points="48,8 52,8 50,2" fill="#ddddee" transform="rotate(-20,50,88)"/>
`));

// bron_x: dwa skrzyżowane topory
save('4/bron/bron_x.svg', svg(`
<rect x="48" y="10" width="5" height="100" fill="#5c3a00" transform="rotate(35,50,60)"/>
<rect x="48" y="10" width="5" height="100" fill="#5c3a00" transform="rotate(-35,50,60)"/>
<path d="M60,16 L74,10 L76,26 L62,30 Z" fill="#aaaaaa" transform="rotate(35,50,60)"/>
<path d="M60,16 L74,10 L76,26 L62,30 Z" fill="#aaaaaa" transform="rotate(-35,50,60)"/>
<path d="M36,16 L22,10 L20,26 L34,30 Z" fill="#888888" transform="rotate(35,50,60)"/>
<path d="M36,16 L22,10 L20,26 L34,30 Z" fill="#888888" transform="rotate(-35,50,60)"/>
`));

// ==================== STRONY ŚWIATA (4x each = 4 tiles) ====================
// Wielka litera, bez medaliona, prosto na szarym tle

function direction(letter) {
  return svg(`
<rect x="5" y="5" width="90" height="110" fill="none" stroke="#6b0000" stroke-width="4"/>
<rect x="5" y="5" width="12" height="12" fill="#6b0000"/>
<rect x="83" y="5" width="12" height="12" fill="#6b0000"/>
<rect x="5" y="103" width="12" height="12" fill="#6b0000"/>
<rect x="83" y="103" width="12" height="12" fill="#6b0000"/>
<text x="50" y="86" text-anchor="middle" dominant-baseline="auto"
  font-family="Georgia, 'Times New Roman', serif"
  font-size="82" font-weight="bold" fill="#8b0000">${letter}</text>
`);
}

save('4/strony/strony_e.svg', direction('E'));
save('4/strony/strony_n.svg', direction('N'));
save('4/strony/strony_s.svg', direction('S'));
save('4/strony/strony_w.svg', direction('W'));

// ==================== SZACHY (4x each = 3 tiles) ====================
// Niebieskie kontury pionków na szarym — jak oryginał

const CHESS_BG = '#1a1a8c';
const CHESS_FILL = '#2244aa';
const CHESS_LIGHT = '#6688dd';

// szachy_bishop: goniec z mitrzą
save('4/szachy/szachy_bishop.svg', svg(`
<rect x="28" y="102" width="44" height="10" fill="${CHESS_BG}" rx="3"/>
<rect x="32" y="94" width="36" height="10" fill="${CHESS_FILL}" rx="2"/>
<rect x="36" y="70" width="28" height="26" fill="${CHESS_FILL}" rx="4"/>
<rect x="38" y="72" width="24" height="22" fill="${CHESS_LIGHT}" rx="3"/>
<path d="M44,70 Q50,10 56,70" fill="${CHESS_BG}"/>
<path d="M46,70 Q50,18 54,70" fill="${CHESS_FILL}"/>
<circle cx="50" cy="52" r="5" fill="${CHESS_BG}"/>
<circle cx="50" cy="52" r="3" fill="${CHESS_LIGHT}"/>
<rect x="46" y="64" width="8" height="8" fill="${CHESS_BG}"/>
<rect x="47" y="65" width="6" height="6" fill="${CHESS_LIGHT}"/>
`));

// szachy_kon: skoczek (koń) — pionek o innym kształcie niż oryginał
save('4/szachy/szachy_kon.svg', svg(`
<rect x="26" y="102" width="48" height="10" fill="${CHESS_BG}" rx="3"/>
<rect x="30" y="92" width="40" height="12" fill="${CHESS_FILL}" rx="2"/>
<rect x="34" y="76" width="32" height="18" fill="${CHESS_FILL}" rx="3"/>
<path d="M38,76 L38,52 Q38,28 50,22 Q62,16 66,36 Q70,48 62,56 L62,76 Z" fill="${CHESS_BG}"/>
<path d="M40,76 L40,54 Q40,32 50,26 Q60,20 64,38 Q67,48 60,55 L60,76 Z" fill="${CHESS_FILL}"/>
<circle cx="56" cy="34" r="5" fill="${CHESS_LIGHT}"/>
<rect x="38" y="60" width="4" height="6" fill="${CHESS_LIGHT}"/>
<rect x="44" y="48" width="6" height="4" fill="${CHESS_LIGHT}"/>
<rect x="58" y="56" width="4" height="8" fill="${CHESS_LIGHT}"/>
`));

// szachy_wieza: wieża — rook
save('4/szachy/szachy_wieza.svg', svg(`
<rect x="26" y="102" width="48" height="10" fill="${CHESS_BG}" rx="3"/>
<rect x="30" y="92" width="40" height="12" fill="${CHESS_FILL}" rx="2"/>
<rect x="30" y="54" width="40" height="40" fill="${CHESS_BG}"/>
<rect x="33" y="56" width="34" height="36" fill="${CHESS_FILL}"/>
<rect x="26" y="44" width="14" height="14" fill="${CHESS_BG}"/>
<rect x="43" y="44" width="14" height="14" fill="${CHESS_BG}"/>
<rect x="60" y="44" width="14" height="14" fill="${CHESS_BG}"/>
<rect x="28" y="46" width="10" height="10" fill="${CHESS_FILL}"/>
<rect x="45" y="46" width="10" height="10" fill="${CHESS_FILL}"/>
<rect x="62" y="46" width="10" height="10" fill="${CHESS_FILL}"/>
<rect x="26" y="54" width="48" height="6" fill="${CHESS_BG}"/>
<rect x="28" y="55" width="44" height="4" fill="${CHESS_LIGHT}" opacity="0.4"/>
<rect x="36" y="68" width="4" height="20" fill="${CHESS_LIGHT}" opacity="0.3"/>
<rect x="46" y="68" width="4" height="20" fill="${CHESS_LIGHT}" opacity="0.3"/>
<rect x="56" y="68" width="4" height="20" fill="${CHESS_LIGHT}" opacity="0.3"/>
`));

// ==================== TARCZE (4x each = 9 tiles) ====================
// Heater shield jak oryginał, ale inne wzory heraldyczne

// t_krzyz: złota tarcza, czarny krzyż łaciński (odwrócone kolory vs oryg.)
save('4/tarcze/t_krzyz.svg', svg(
  shield('#4a3800', '#cc9900', `
<rect x="18" y="50" width="64" height="14" fill="#111111"/>
<rect x="44" y="18" width="14" height="74" fill="#111111"/>`)
));

// t_3krzyze: granatowa tarcza, trzy złote krzyżyki po skosie
save('4/tarcze/t_3krzyze.svg', svg(
  shield('#001155', '#0a2080', `
<rect x="24" y="26" width="10" height="4" fill="#ffd700"/>
<rect x="27" y="23" width="4" height="10" fill="#ffd700"/>
<rect x="45" y="46" width="10" height="4" fill="#ffd700"/>
<rect x="48" y="43" width="4" height="10" fill="#ffd700"/>
<rect x="66" y="64" width="10" height="4" fill="#ffd700"/>
<rect x="69" y="61" width="4" height="10" fill="#ffd700"/>`)
));

// t_brazowa: srebrna/szara tarcza z czerwoną gwiazdą sześcioramienną
save('4/tarcze/t_brazowa.svg', svg(
  shield('#444444', '#aaaaaa', `
<polygon points="50,22 56,38 72,38 60,48 64,64 50,55 36,64 40,48 28,38 44,38" fill="#cc0000"/>`)
));

// t_gryf: czerwona tarcza, czarny lew rampantowy
save('4/tarcze/t_gryf.svg', svg(
  shield('#660000', '#cc0000', `
<path d="M44,80 L42,66 L36,58 L30,46 L36,36 L44,30 L50,24 L58,28 L64,38 L60,50 L68,54 L70,62 L64,70 L58,76 L56,82 Z" fill="#111111"/>
<circle cx="54" cy="28" r="7" fill="#111111"/>
<path d="M58,20 L62,14 L64,20" fill="#111111"/>
<rect x="52" y="72" width="6" height="16" fill="#111111"/>
<rect x="44" y="78" width="8" height="6" fill="#111111"/>`)
));

// t_malta: biała tarcza, czerwony krzyż maltański
save('4/tarcze/t_malta.svg', svg(
  shield('#555500', '#ddddaa', `
<polygon points="50,20 56,34 70,28 64,42 78,48 64,54 70,68 56,62 50,76 44,62 30,68 36,54 22,48 36,42 30,28 44,34" fill="#cc0000"/>
<circle cx="50" cy="48" r="8" fill="#ddddaa"/>`)
));

// t_sierzant: zielona tarcza, złoty ukośny pas (bend)
save('4/tarcze/t_sierzant.svg', svg(
  shield('#003300', '#005500', `
<path d="M14,12 L86,12 L86,46 L14,80 Z" fill="#ffd700" clip-path="url(#hs)"/>
<clipPath id="hs"><path d="${HS_IN}"/></clipPath>
<path d="M14,42 L86,12 L86,46 L14,76 Z" fill="#ffd700"/>`)
));

// t_szachy: żółto-niebieskie 4 pola w kwadrant (jak oryg. ale inne kolory)
save('4/tarcze/t_szachy.svg', svg(
  shield('#111111', '#222222', `
<path d="${HS_IN}" fill="#0033aa" clip-path="url(#chs)"/>
<clipPath id="chs"><path d="${HS_IN}"/></clipPath>
<rect x="14" y="12" width="36" height="32" fill="#0033aa"/>
<rect x="50" y="12" width="36" height="32" fill="#ffcc00"/>
<rect x="14" y="44" width="36" height="30" fill="#ffcc00"/>
<rect x="50" y="44" width="36" height="30" fill="#0033aa"/>
<path d="M14,74 L50,108 L86,74 L86,44 L50,74 L14,44 Z" fill="#0033aa"/>
<path d="M14,74 L50,108 L86,74 L86,44 L50,74 L14,44 Z" fill="#ffcc00" clip-path="url(#chs2)"/>
<clipPath id="chs2"><polygon points="50,12 86,12 86,74 50,108"/></clipPath>`)
));

// t_x: czarna tarcza, złoty skos ukośny (saltire)
save('4/tarcze/t_x.svg', svg(
  shield('#111111', '#222222', `
<path d="M14,12 L86,76 M86,12 L14,76" stroke="#ffd700" stroke-width="14"/>
<path d="M14,12 L28,12 L50,44 L72,12 L86,12 L86,24 L62,58 L86,76 L86,76 L72,76 L50,60 L28,76 L14,76 L14,64 L38,58 L14,24 Z" fill="#ffd700"/>`)
));

// t_y: purpurowa tarcza, złoty trójnóg/Y
save('4/tarcze/t_y.svg', svg(
  shield('#330044', '#660088', `
<rect x="47" y="54" width="6" height="48" fill="#ffd700"/>
<rect x="47" y="42" width="6" height="16" fill="#ffd700" transform="rotate(-30,50,58)"/>
<rect x="47" y="42" width="6" height="16" fill="#ffd700" transform="rotate(30,50,58)"/>
<circle cx="50" cy="58" r="6" fill="#ffd700"/>
<polygon points="47,54 53,54 50,44" fill="#ffd700"/>`)
));

// ==================== Aktualizacja styles-manifest.js ====================

const MANIFEST_PATH = join(ROOT, 'mahjong', 'styles-manifest.js');
const manifest = readFileSync(MANIFEST_PATH, 'utf8');

const med3Section = `    {
      id: 'medieval3',
      name: 'Medieval III',
      tiles: [
        { matchKey: 'medieval3::pory_jesien',   src: 'pic/medieval3/1/pory/pory_jesien.svg',   count: 1 },
        { matchKey: 'medieval3::pory_lato',      src: 'pic/medieval3/1/pory/pory_lato.svg',      count: 1 },
        { matchKey: 'medieval3::pory_wiosna',    src: 'pic/medieval3/1/pory/pory_wiosna.svg',    count: 1 },
        { matchKey: 'medieval3::pory_zima',      src: 'pic/medieval3/1/pory/pory_zima.svg',      count: 1 },
        { matchKey: 'medieval3::skarb_czerwony', src: 'pic/medieval3/1/skarb/skarb_czerwony.svg', count: 1 },
        { matchKey: 'medieval3::skart_bialy',    src: 'pic/medieval3/1/skarb/skart_bialy.svg',   count: 1 },
        { matchKey: 'medieval3::skart_niebieski',src: 'pic/medieval3/1/skarb/skart_niebieski.svg',count: 1 },
        { matchKey: 'medieval3::skart_zielony',  src: 'pic/medieval3/1/skarb/skart_zielony.svg', count: 1 },
        { matchKey: 'medieval3::b_biala',        src: 'pic/medieval3/4/bramy/b_biała.svg',       count: 4 },
        { matchKey: 'medieval3::b_czerwona',     src: 'pic/medieval3/4/bramy/b_czerwona.svg',    count: 4 },
        { matchKey: 'medieval3::b_jasnazielen',  src: 'pic/medieval3/4/bramy/b_jasnazielen.svg', count: 4 },
        { matchKey: 'medieval3::b_niebieska',    src: 'pic/medieval3/4/bramy/b_niebieska.svg',   count: 4 },
        { matchKey: 'medieval3::b_pomaranczowa', src: 'pic/medieval3/4/bramy/b_pomaranczowa.svg',count: 4 },
        { matchKey: 'medieval3::b_rozowa',       src: 'pic/medieval3/4/bramy/b_rozowa.svg',      count: 4 },
        { matchKey: 'medieval3::b_szara',        src: 'pic/medieval3/4/bramy/b_szara.svg',       count: 4 },
        { matchKey: 'medieval3::b_zielona',      src: 'pic/medieval3/4/bramy/b_zielona.svg',     count: 4 },
        { matchKey: 'medieval3::b_zolta',        src: 'pic/medieval3/4/bramy/b_zolta.svg',       count: 4 },
        { matchKey: 'medieval3::bron_halabardy', src: 'pic/medieval3/4/bron/bron_halabardy.svg', count: 4 },
        { matchKey: 'medieval3::bron_kusza',     src: 'pic/medieval3/4/bron/bron_kusza.svg',     count: 4 },
        { matchKey: 'medieval3::bron_luk',       src: 'pic/medieval3/4/bron/bron_luk.svg',       count: 4 },
        { matchKey: 'medieval3::bron_miecze',    src: 'pic/medieval3/4/bron/bron_miecze.svg',    count: 4 },
        { matchKey: 'medieval3::bron_palka',     src: 'pic/medieval3/4/bron/bron_palka.svg',     count: 4 },
        { matchKey: 'medieval3::bron_pochodnie', src: 'pic/medieval3/4/bron/bron_pochodnie.svg', count: 4 },
        { matchKey: 'medieval3::bron_rycerz',    src: 'pic/medieval3/4/bron/bron_rycerz.svg',    count: 4 },
        { matchKey: 'medieval3::bron_szpady',    src: 'pic/medieval3/4/bron/bron_szpady.svg',    count: 4 },
        { matchKey: 'medieval3::bron_x',         src: 'pic/medieval3/4/bron/bron_x.svg',         count: 4 },
        { matchKey: 'medieval3::strony_e',       src: 'pic/medieval3/4/strony/strony_e.svg',     count: 4 },
        { matchKey: 'medieval3::strony_n',       src: 'pic/medieval3/4/strony/strony_n.svg',     count: 4 },
        { matchKey: 'medieval3::strony_s',       src: 'pic/medieval3/4/strony/strony_s.svg',     count: 4 },
        { matchKey: 'medieval3::strony_w',       src: 'pic/medieval3/4/strony/strony_w.svg',     count: 4 },
        { matchKey: 'medieval3::szachy_bishop',  src: 'pic/medieval3/4/szachy/szachy_bishop.svg',count: 4 },
        { matchKey: 'medieval3::szachy_kon',     src: 'pic/medieval3/4/szachy/szachy_kon.svg',   count: 4 },
        { matchKey: 'medieval3::szachy_wieza',   src: 'pic/medieval3/4/szachy/szachy_wieza.svg', count: 4 },
        { matchKey: 'medieval3::t_3krzyze',      src: 'pic/medieval3/4/tarcze/t_3krzyze.svg',    count: 4 },
        { matchKey: 'medieval3::t_brazowa',      src: 'pic/medieval3/4/tarcze/t_brazowa.svg',    count: 4 },
        { matchKey: 'medieval3::t_gryf',         src: 'pic/medieval3/4/tarcze/t_gryf.svg',       count: 4 },
        { matchKey: 'medieval3::t_krzyz',        src: 'pic/medieval3/4/tarcze/t_krzyz.svg',      count: 4 },
        { matchKey: 'medieval3::t_malta',        src: 'pic/medieval3/4/tarcze/t_malta.svg',      count: 4 },
        { matchKey: 'medieval3::t_sierzant',     src: 'pic/medieval3/4/tarcze/t_sierzant.svg',   count: 4 },
        { matchKey: 'medieval3::t_szachy',       src: 'pic/medieval3/4/tarcze/t_szachy.svg',     count: 4 },
        { matchKey: 'medieval3::t_x',            src: 'pic/medieval3/4/tarcze/t_x.svg',          count: 4 },
        { matchKey: 'medieval3::t_y',            src: 'pic/medieval3/4/tarcze/t_y.svg',          count: 4 },
      ]
    }`;

if (manifest.includes('medieval3')) {
  console.log('medieval3 already in manifest — skipping manifest update.');
} else {
  const updated = manifest.replace(/(\s*\]\s*\};\s*)$/, `,\n${med3Section}\n$1`);
  writeFileSync(MANIFEST_PATH, updated, 'utf8');
  console.log('Updated styles-manifest.js');
}

console.log('Done — medieval3 tiles generated.');
