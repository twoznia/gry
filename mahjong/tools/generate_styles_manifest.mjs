import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mahjongRoot = path.resolve(__dirname, '..');
const picRoot = path.join(mahjongRoot, 'pic');
const outputPath = path.join(mahjongRoot, 'styles-manifest.js');
const VALID_USAGE_VALUES = new Set([1, 4]);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const LAYOUT_TILE_COUNT = 144;

function prettifyLabel(rawName) {
    return rawName
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function prettifyStyleName(styleId) {
    const label = prettifyLabel(styleId);
    return label.charAt(0).toUpperCase() + label.slice(1);
}

async function getDirectories(dirPath) {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort((a, b) => a.localeCompare(b, 'pl'));
}

async function getImageFiles(dirPath) {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries
        .filter(entry => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
        .map(entry => entry.name)
        .sort((a, b) => a.localeCompare(b, 'pl'));
}

async function buildManifest() {
    const styles = [];
    const styleDirs = await getDirectories(picRoot);

    for (const styleId of styleDirs) {
        const stylePath = path.join(picRoot, styleId);
        const usageDirs = await getDirectories(stylePath);
        const items = [];
        const validationErrors = [];

        for (const usageDir of usageDirs) {
            const usageCount = Number.parseInt(usageDir, 10);
            if (!VALID_USAGE_VALUES.has(usageCount)) {
                validationErrors.push(`Nieobsługiwany folder użycia: ${usageDir}`);
                continue;
            }

            const usagePath = path.join(stylePath, usageDir);
            const typeDirs = await getDirectories(usagePath);

            for (const typeId of typeDirs) {
                const typePath = path.join(usagePath, typeId);
                const imageFiles = await getImageFiles(typePath);

                for (const fileName of imageFiles) {
                    const baseName = path.parse(fileName).name;
                    items.push({
                        styleId,
                        usageCount,
                        type: typeId,
                        name: baseName,
                        label: prettifyLabel(baseName),
                        src: path.posix.join('pic', styleId, usageDir, typeId, fileName),
                        matchKey: usageCount === 1
                            ? `${styleId}::${usageCount}::${typeId}`
                            : `${styleId}::${usageCount}::${typeId}::${baseName}`
                    });
                }
            }
        }

        const tileCount = items.reduce((sum, item) => sum + item.usageCount, 0);
        if (tileCount !== LAYOUT_TILE_COUNT) {
            validationErrors.push(`Styl ${styleId} ma ${tileCount} tiles zamiast ${LAYOUT_TILE_COUNT}.`);
        }

        styles.push({
            id: styleId,
            name: prettifyStyleName(styleId),
            tileCount,
            layoutCompatible: validationErrors.length === 0,
            validationErrors,
            items
        });
    }

    return {
        generatedAt: new Date().toISOString(),
        layoutTileCount: LAYOUT_TILE_COUNT,
        styles
    };
}

const manifest = await buildManifest();
const output = `window.MAHJONG_STYLE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`;

await writeFile(outputPath, output, 'utf8');
console.log(`Wygenerowano ${outputPath}`);
for (const style of manifest.styles) {
    console.log(`- ${style.id}: ${style.tileCount} tiles${style.layoutCompatible ? '' : ' [NIEZGODNY]'}`);
}