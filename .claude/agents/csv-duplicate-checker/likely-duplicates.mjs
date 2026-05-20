import {
  parseArgs,
  printJson,
  printTextReport,
  readCsv,
  resolveInputFile,
  summarizeGroups,
} from './csv-utils.mjs';

function normalize(value) {
  return (value ?? '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveTargetColumn(header, option) {
  if (!option) {
    return 0;
  }

  if (/^\d+$/.test(option)) {
    const index = Number(option);

    if (index < 0 || index >= header.length) {
      throw new Error(`Column index out of range: ${option}`);
    }

    return index;
  }

  const headerIndex = header.findIndex((name) => name.trim().toLowerCase() === option.toLowerCase());

  if (headerIndex === -1) {
    throw new Error(`Column not found in header: ${option}`);
  }

  return headerIndex;
}

function buildGroups(rows, columnIndex, header) {
  const map = new Map();

  for (const row of rows) {
    const sourceValue = row.values[columnIndex] ?? '';
    const normalizedValue = normalize(sourceValue);

    if (!normalizedValue) {
      continue;
    }

    const bucket = map.get(normalizedValue) ?? [];
    bucket.push({
      lineNumber: row.lineNumber,
      raw: row.raw,
      sourceValue,
    });
    map.set(normalizedValue, bucket);
  }

  return [...map.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([normalizedValue, occurrences]) => ({
      column: header[columnIndex],
      normalizedValue,
      examples: [...new Set(occurrences.map((row) => row.sourceValue))],
      occurrences: occurrences.length,
      lineNumbers: occurrences.map((row) => row.lineNumber),
      rows: occurrences.map((row) => row.raw),
    }));
}

try {
  const options = parseArgs(process.argv.slice(2));
  const filePath = resolveInputFile(options.file);
  const format = options.format === 'json' ? 'json' : 'text';
  const csv = readCsv(filePath);
  const columnIndex = resolveTargetColumn(csv.header, options.column);
  const groups = buildGroups(csv.rows, columnIndex, csv.header);
  const report = {
    type: 'likely-duplicates',
    file: csv.filePath,
    column: {
      index: columnIndex,
      name: csv.header[columnIndex],
    },
    summary: summarizeGroups(csv.rows, groups),
    groups,
  };

  if (format === 'json') {
    printJson(report);
    process.exit(0);
  }

  printTextReport('Likely duplicate report', report, (group) => {
    process.stdout.write(`Column: ${group.column}\n`);
    process.stdout.write(`Normalized value: ${group.normalizedValue}\n`);
    process.stdout.write(`Examples: ${group.examples.join(' | ')}\n`);
    process.stdout.write(`Occurrences: ${group.occurrences}\n`);
    process.stdout.write(`Rows: ${group.lineNumbers.join(', ')}\n`);
    process.stdout.write('Row content:\n');

    for (const row of group.rows) {
      process.stdout.write(`- ${row}\n`);
    }
  });
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}