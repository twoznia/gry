import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './csv-utils.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

const scenarioMap = {
  exact: 'exact-row-duplicates.mjs',
  columns: 'column-duplicates.mjs',
  likely: 'likely-duplicates.mjs',
};

function printUsage() {
  process.stdout.write('CSV duplicate checker dispatcher\n');
  process.stdout.write('Usage:\n');
  process.stdout.write('  node .claude/agents/csv-duplicate-checker/run-checker.mjs --scenario <exact|columns|likely> --file <csv-path> [--columns <name1,name2>] [--column <name>] [--format json]\n');
  process.stdout.write('If --scenario or --file are missing, the script will prompt for them.\n');
}

async function promptForMissing(options) {
  const rl = readline.createInterface({ input, output });

  try {
    if (!options.scenario) {
      const answer = await rl.question('Scenario (exact / columns / likely): ');
      options.scenario = answer.trim();
    }

    if (!options.file) {
      const answer = await rl.question('CSV file path: ');
      options.file = answer.trim();
    }

    if (options.scenario === 'columns' && !options.columns) {
      const answer = await rl.question('Columns (comma-separated names or indexes): ');
      options.columns = answer.trim();
    }

    if (options.scenario === 'likely' && !options.column) {
      const answer = await rl.question('Column for normalized comparison (press Enter for default first column): ');
      options.column = answer.trim();
    }

    return options;
  } finally {
    rl.close();
  }
}

function buildChildArgs(options) {
  const scriptName = scenarioMap[options.scenario];

  if (!scriptName) {
    throw new Error(`Unsupported --scenario value: ${options.scenario}`);
  }

  const childArgs = [path.resolve(scriptDirectory, scriptName), '--file', options.file];

  if (options.format) {
    childArgs.push('--format', options.format);
  }

  if (options.scenario === 'columns') {
    if (!options.columns) {
      throw new Error('The columns scenario requires --columns.');
    }

    childArgs.push('--columns', options.columns);
  }

  if (options.scenario === 'likely' && options.column) {
    childArgs.push('--column', options.column);
  }

  return childArgs;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printUsage();
    return;
  }

  await promptForMissing(options);
  const childArgs = buildChildArgs(options);
  const result = spawnSync(process.execPath, childArgs, { stdio: 'inherit' });

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 0);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});