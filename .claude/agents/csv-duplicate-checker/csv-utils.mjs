import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const nextToken = argv[index + 1];

    if (!nextToken || nextToken.startsWith('--')) {
      options[key] = true;
      continue;
    }

    options[key] = nextToken;
    index += 1;
  }

  return options;
}

function resolveInputFile(fileArgument) {
  if (!fileArgument || typeof fileArgument !== 'string') {
    throw new Error('Missing required --file argument.');
  }

  return path.resolve(process.cwd(), fileArgument);
}

function detectDelimiter(headerLine) {
  const candidates = [';', ',', '\t'];
  let bestDelimiter = ';';
  let bestCount = -1;

  for (const candidate of candidates) {
    const count = headerLine.split(candidate).length;

    if (count > bestCount) {
      bestDelimiter = candidate;
      bestCount = count;
    }
  }

  return bestDelimiter;
}

function parseCsvLine(line, delimiter) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (character === delimiter && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += character;
  }

  values.push(current);
  return values;
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file does not exist: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const rawLines = content.split(/\r?\n/);
  const nonEmptyLines = rawLines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length === 0) {
    throw new Error(`CSV file is empty: ${filePath}`);
  }

  const delimiter = detectDelimiter(nonEmptyLines[0]);
  const header = parseCsvLine(nonEmptyLines[0], delimiter);
  const rows = nonEmptyLines.slice(1).map((line, index) => ({
    lineNumber: index + 2,
    raw: line,
    values: parseCsvLine(line, delimiter),
  }));

  return {
    filePath,
    delimiter,
    header,
    rows,
  };
}

function summarizeGroups(rows, groups) {
  const groupedOccurrences = groups.reduce((sum, group) => sum + group.occurrences, 0);

  return {
    dataRows: rows.length,
    uniqueRows: rows.length - (groupedOccurrences - groups.length),
    duplicateGroups: groups.length,
    duplicateOccurrences: groupedOccurrences,
  };
}

function printJson(report) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

function printTextReport(title, report, renderGroup) {
  process.stdout.write(`${title}\n`);
  process.stdout.write(`File: ${report.file}\n`);
  process.stdout.write(`Data rows: ${report.summary.dataRows}\n`);
  process.stdout.write(`Unique rows: ${report.summary.uniqueRows}\n`);
  process.stdout.write(`Duplicate groups: ${report.summary.duplicateGroups}\n`);
  process.stdout.write(`Duplicate occurrences: ${report.summary.duplicateOccurrences}\n`);

  if (report.groups.length === 0) {
    process.stdout.write('Duplicates found: no\n');
    return;
  }

  process.stdout.write('Duplicates found: yes\n\n');

  for (const [index, group] of report.groups.entries()) {
    process.stdout.write(`Group ${index + 1}\n`);
    renderGroup(group);
    process.stdout.write('\n');
  }
}

export {
  parseArgs,
  printJson,
  printTextReport,
  readCsv,
  resolveInputFile,
  summarizeGroups,
};