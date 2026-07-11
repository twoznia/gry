// Scala pliki pytania/dane/kategorie/*.csv w jeden plik pytania/dane/pytania.csv.
// Uruchamiaj po dopisaniu/edycji pytań w plikach per-kategoria.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const kategorieDir = join(__dirname, '..', 'dane', 'kategorie');
const outputFile = join(__dirname, '..', 'dane', 'pytania.csv');
const kategorieTxt = join(__dirname, 'kategorie.txt');

const HEADER = 'category;subcategory;level;question;correct;wrong1;wrong2;wrong3';

// Kolejność kategorii wg kategorie.txt, reszta (jeśli jakaś nie jest tam wymieniona) alfabetycznie na końcu.
const order = [];
try {
    const txt = readFileSync(kategorieTxt, 'utf8');
    for (const line of txt.split('\n')) {
        const m = line.match(/^(\S.*):\s*$/);
        if (m) order.push(m[1].trim());
    }
} catch {
    // brak kategorie.txt — użyjemy czystej kolejności alfabetycznej
}

const files = readdirSync(kategorieDir).filter((f) => f.endsWith('.csv'));
const nameToFile = new Map(files.map((f) => [basename(f, '.csv'), f]));

const orderedNames = [
    ...order.filter((name) => nameToFile.has(name)),
    ...[...nameToFile.keys()].filter((name) => !order.includes(name)).sort(),
];

const rows = [];
for (const name of orderedNames) {
    const content = readFileSync(join(kategorieDir, nameToFile.get(name)), 'utf8');
    for (const line of content.split(/\r\n|\n/)) {
        if (line.trim()) rows.push(line.trim());
    }
}

const BOM = '﻿';
const out = BOM + HEADER + '\r\n' + rows.map((r) => r + '\r\n').join('');
writeFileSync(outputFile, out, 'utf8');

console.log(`Scalono ${orderedNames.length} plików kategorii -> ${rows.length} pytań w pytania.csv`);
