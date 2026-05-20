import {
  parseArgs,
  printJson,
  printTextReport,
  readCsv,
  resolveInputFile,
  summarizeGroups,
} from './csv-utils.mjs';

function parseColumns(value) {
  if (!value || typeof value !== 'string') {
    throw new Error('Missing required --columns argument. Use comma-separated column names or zero-based indexes.');
  }

  return value
    .split(',')
    .map((column) => column.trim())
    .filter(Boolean);
}

function resolveColumnIndexes(header, requestedColumns) {
  return requestedColumns.map((column) => {
    if (/^\d+$/.test(column)) {
      const index = Number(column);

      if (index < 0 || index >= header.length) {
        throw new Error(`Column index out of range: ${column}`);
      }

      return index;
    }

    const headerIndex = header.findIndex((name) => name.trim().toLowerCase() === column.toLowerCase());

    if (headerIndex === -1) {
      throw new Error(`Column not found in header: ${column}`);
    }

    return headerIndex;
  });
}

function buildGroups(rows, indexes, header) {
  const map = new Map();

  for (const row of rows) {
    const keyValues = indexes.map((index) => row.values[index] ?? '');
    const key = JSON.stringify(keyValues);
    const bucket = map.get(key) ?? [];

    bucket.push({
      lineNumber: row.lineNumber,
      keyValues,
      raw: row.raw,
    });

    map.set(key, bucket);
  }

  return [...map.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([, occurrences]) => ({
      columns: indexes.map((index) => header[index]),
      keyValues: occurrences[0].keyValues,
      occurrences: occurrences.length,
      lineNumbers: occurrences.map((row) => row.lineNumber),
      rows: occurrences.map((row) => row.raw),
    }));
}

try {
  const options = parseArgs(process.argv.slice(2));
  const filePath = resolveInputFile(options.file);
  const requestedColumns = parseColumns(options.columns);
  const format = options.format === 'json' ? 'json' : 'text';
  const csv = readCsv(filePath);
  const columnIndexes = resolveColumnIndexes(csv.header, requestedColumns);
  const groups = buildGroups(csv.rows, columnIndexes, csv.header);
  const report = {
    type: 'column-duplicates',
    file: csv.filePath,
    columns: columnIndexes.map((index) => ({
      index,
      name: csv.header[index],
    })),
    summary: summarizeGroups(csv.rows, groups),
    groups,
  };

  if (format === 'json') {
    printJson(report);
    process.exit(0);
  }

  printTextReport('Column duplicate report', report, (group) => {
    process.stdout.write(`Columns: ${group.columns.join(', ')}\n`);
    process.stdout.write(`Key values: ${group.keyValues.join(' | ')}\n`);
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