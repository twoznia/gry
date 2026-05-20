import {
  parseArgs,
  printJson,
  printTextReport,
  readCsv,
  resolveInputFile,
  summarizeGroups,
} from './csv-utils.mjs';

function buildGroups(rows) {
  const map = new Map();

  for (const row of rows) {
    const bucket = map.get(row.raw) ?? [];
    bucket.push(row);
    map.set(row.raw, bucket);
  }

  return [...map.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([raw, occurrences]) => ({
      raw,
      occurrences: occurrences.length,
      lineNumbers: occurrences.map((row) => row.lineNumber),
    }));
}

try {
  const options = parseArgs(process.argv.slice(2));
  const filePath = resolveInputFile(options.file);
  const format = options.format === 'json' ? 'json' : 'text';
  const csv = readCsv(filePath);
  const groups = buildGroups(csv.rows);
  const report = {
    type: 'exact-row-duplicates',
    file: csv.filePath,
    summary: summarizeGroups(csv.rows, groups),
    groups,
  };

  if (format === 'json') {
    printJson(report);
    process.exit(0);
  }

  printTextReport('Exact row duplicate report', report, (group) => {
    process.stdout.write(`Occurrences: ${group.occurrences}\n`);
    process.stdout.write(`Rows: ${group.lineNumbers.join(', ')}\n`);
    process.stdout.write(`Row content: ${group.raw}\n`);
  });
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}