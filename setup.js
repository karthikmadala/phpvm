#!/usr/bin/env node

/**
 * phpvm Setup Script
 * Initializes phpvm and helps with environment configuration
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const BASE = process.env.PHPVM_DIR || path.join(os.homedir(), '.phpvm');
const VERSIONS = path.join(BASE, 'versions');
const CACHE = path.join(BASE, 'cache');
const ALIASES_FILE = path.join(BASE, 'aliases');

console.log(chalk.bold.blue('\n🚀 phpvm Setup\n'));

// Create directories
console.log('Creating directories...');
fs.ensureDirSync(VERSIONS);
fs.ensureDirSync(CACHE);
fs.ensureDirSync(ALIASES_FILE);
console.log(chalk.green('✓ Directories created'));

// Create default aliases
console.log('\nSetting up default aliases...');
const aliasesFile = path.join(ALIASES_FILE, 'aliases.json');

if (!fs.existsSync(aliasesFile)) {
    fs.writeFileSync(aliasesFile, JSON.stringify({
        'latest': 'latest',
        'stable': 'latest'
    }, null, 2));
    console.log(chalk.green('✓ Default aliases created'));
} else {
    console.log(chalk.gray('  (aliases already exist, skipping)'));
}

// Create example .phpvmrc
if (!fs.existsSync('.phpvmrc')) {
    fs.writeFileSync('.phpvmrc', '8.2\n');
    console.log(chalk.green('✓ Example .phpvmrc created'));
} else {
    console.log(chalk.gray('  (.phpvmrc already exists, skipping)'));
}

// Print next steps
console.log(chalk.bold.blue('\n📝 Next Steps:\n'));
console.log(`1. Install a PHP version:`);
console.log(chalk.gray(`   phpvm install latest\n`));

console.log(`2. Switch to the installed version:`);
console.log(chalk.gray(`   phpvm use latest\n`));

console.log(`3. Verify installation:`);
console.log(chalk.gray(`   phpvm current\n`));

console.log(`4. Add to PATH (OPTIONAL):`);
console.log(chalk.gray(`   Add "${path.join(BASE, 'current')}" to your system PATH\n`));

console.log(chalk.bold.blue('💡 Tip:'));
console.log(`Create a .phpvmrc file in your project with the version number to`);
console.log(`automatically switch versions when you run "phpvm use"\n`);

console.log(chalk.bold.green('\n✓ Setup complete!\n'));
