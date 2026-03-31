#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import unzipper from 'unzipper';
import ora from 'ora';
import cliProgress from 'cli-progress';
import { execSync } from 'child_process';
import os from 'os';

const program = new Command();

// --- Configuration & Settings (nvm-windows architecture) ---
const CONFIG_DIR = process.env.PHPVM_DIR || path.join(os.homedir(), '.phpvm');
const SETTINGS_FILE = path.join(CONFIG_DIR, 'settings.txt');

// Ensure base config dir exists
fs.ensureDirSync(CONFIG_DIR);

function loadSettings() {
    let root = path.join(CONFIG_DIR);
    let symlinkPath = path.join(CONFIG_DIR, 'current');
    let proxy = 'none';

    if (fs.existsSync(SETTINGS_FILE)) {
        const lines = fs.readFileSync(SETTINGS_FILE, 'utf-8').split('\n');
        for (const line of lines) {
            const match = line.match(/^([^:]+):\s*(.+)$/);
            if (match) {
                const key = match[1].trim().toLowerCase();
                const value = match[2].trim();
                if (key === 'root') root = value;
                if (key === 'path') symlinkPath = value;
                if (key === 'proxy') proxy = value;
            }
        }
    } else {
        // Create default settings.txt
        saveSettings({ root, path: symlinkPath, proxy });
    }

    return { root, path: symlinkPath, proxy };
}

function saveSettings(settings) {
    const data = `root: ${settings.root}\npath: ${settings.path}\nproxy: ${settings.proxy}\n`;
    fs.writeFileSync(SETTINGS_FILE, data, 'utf-8');
}

const settings = loadSettings();
const VERSIONS = path.join(settings.root, 'versions');
const CACHE = path.join(settings.root, 'cache');
const ALIASES_DIR = path.join(settings.root, 'aliases');
const RC_FILE = '.phpvmrc';

fs.ensureDirSync(VERSIONS);
fs.ensureDirSync(CACHE);
fs.ensureDirSync(ALIASES_DIR);

// 🔹 Setup global Windows Environment variables accurately (like nvm-windows)
function applyGlobalEnvironmentVars() {
    try {
        const psCommand = `
            $phpvmHome = '${settings.root}';
            $phpvmSymlink = '${settings.path}';
            
            # Set NVM-like variables
            [Environment]::SetEnvironmentVariable('PHPVM_HOME', $phpvmHome, 'User');
            [Environment]::SetEnvironmentVariable('PHPVM_SYMLINK', $phpvmSymlink, 'User');
            
            $userPath = [Environment]::GetEnvironmentVariable('Path', 'User');
            $modified = $false;
            
            # Add PHPVM_HOME to PATH if missing (for the phpvm CLI itself, though likely managed by npm)
            if ($userPath -notmatch [regex]::Escape($phpvmHome)) { 
                $userPath = $phpvmHome + ';' + $userPath; 
                $modified = $true;
            }
            # Add PHPVM_SYMLINK to PATH if missing (this routes the actual 'php' commands securely)
            if ($userPath -notmatch [regex]::Escape($phpvmSymlink)) { 
                $userPath = $phpvmSymlink + ';' + $userPath; 
                $modified = $true;
            }
            
            if ($modified) {
                [Environment]::SetEnvironmentVariable('Path', $userPath, 'User');
            }
        `;
        execSync(`powershell -NoProfile -Command "${psCommand.replace(/\n/g, ' ')}"`);
    } catch (err) {
        console.log(chalk.yellow('⚠ Failed to update global Windows Registry variables natively. You may need to update PATH manually.'));
    }
}


// 🔹 Commands: Root & Path
function setRoot(newPath) {
    if (!newPath) {
        console.log(`Current Root: ${settings.root}`);
        return;
    }
    const resolvedPath = path.resolve(newPath);
    settings.root = resolvedPath;
    saveSettings(settings);
    fs.ensureDirSync(path.join(resolvedPath, 'versions'));
    fs.ensureDirSync(path.join(resolvedPath, 'cache'));
    console.log(chalk.green(`✓ PHPVM Root set to ${resolvedPath}`));
    applyGlobalEnvironmentVars();
}

function setPath(newPath) {
    if (!newPath) {
        console.log(`Current Symlink Path: ${settings.path}`);
        return;
    }
    const resolvedPath = path.resolve(newPath);
    settings.path = resolvedPath;
    saveSettings(settings);
    console.log(chalk.green(`✓ PHPVM Symlink Path set to ${resolvedPath}`));
    applyGlobalEnvironmentVars();
}

// 🔹 Alias management
function readAliases() {
    try {
        const content = fs.readFileSync(path.join(ALIASES_DIR, 'aliases.json'), 'utf-8');
        return JSON.parse(content);
    } catch {
        return {};
    }
}

function writeAliases(aliases) {
    fs.writeFileSync(path.join(ALIASES_DIR, 'aliases.json'), JSON.stringify(aliases, null, 2));
}

function setAlias(alias, version) {
    const aliases = readAliases();
    aliases[alias] = version;
    writeAliases(aliases);
    console.log(chalk.green(`Alias '${alias}' set to ${version}`));
}

function getAlias(alias) {
    const aliases = readAliases();
    return aliases[alias];
}

// 🔹 Fetch versions
async function fetchVersions(showSpinner = true) {
    const spinner = showSpinner ? ora('Fetching available versions...').start() : null;
    try {
        const axiosConfig = { timeout: 5000 };
        if (settings.proxy && settings.proxy !== 'none') {
            const url = new URL(settings.proxy);
            axiosConfig.proxy = { protocol: url.protocol, host: url.hostname, port: url.port };
        }

        const res = await axios.get('https://windows.php.net/downloads/releases/', axiosConfig);
        const matches = [...res.data.matchAll(/php-(\d+\.\d+\.\d+)-Win32-vs\d+-x64\.zip/g)];
        const versions = [...new Set(matches.map(m => m[1]))]
            .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
        if (spinner) spinner.succeed(`Found ${versions.length} versions`);
        return versions;
    } catch (e) {
        if (spinner) spinner.fail('Failed to fetch versions');
        throw e;
    }
}

// 🔹 Resolve version with alias support
async function resolveVersion(input) {
    const aliasValue = getAlias(input);
    if (aliasValue) input = aliasValue;

    const versions = await fetchVersions(false);

    if (input === 'latest') return versions[0];
    if (versions.includes(input)) return input;

    const match = versions.find(v => v.startsWith(input + '.'));
    if (match) return match;

    if (input.includes('.')) {
        const matchPartial = versions.find(v => v.startsWith(input));
        if (matchPartial) return matchPartial;
    }

    throw new Error(`Version '${input}' not found. Use 'phpvm list-remote' to see available versions.`);
}

// 🔹 Resolve download URL (fallback mechanism ensures dynamic VS capture)
async function resolveUrl(version) {
    const regex = new RegExp(`php-${version}-Win32-vs\\d+-x64\\.zip`);
    const axiosConfig = { timeout: 5000 };
    if (settings.proxy && settings.proxy !== 'none') {
        const url = new URL(settings.proxy);
        axiosConfig.proxy = { protocol: url.protocol, host: url.hostname, port: url.port };
    }

    try {
        const res = await axios.get('https://windows.php.net/downloads/releases/', axiosConfig);
        const match = res.data.match(regex);
        if (match) return `https://windows.php.net/downloads/releases/${match[0]}`;
    } catch (e) { }

    try {
        const resArchive = await axios.get('https://windows.php.net/downloads/releases/archives/', axiosConfig);
        const matchArchive = resArchive.data.match(regex);
        if (matchArchive) return `https://windows.php.net/downloads/releases/archives/${matchArchive[0]}`;
    } catch (e) { }

    throw new Error('Download not found for ' + version);
}

// 🔹 Install PHP
async function install(input) {
    const spinner = ora(`Resolving ${input}...`).start();

    try {
        const version = await resolveVersion(input);
        spinner.text = `Downloading PHP ${version}`;

        const url = await resolveUrl(version);

        const zip = path.join(CACHE, `${version}.zip`);
        const dest = path.join(VERSIONS, version);

        if (fs.existsSync(dest)) {
            spinner.warn(`PHP ${version} already installed in ${dest}`);
            return;
        }

        const axiosConfig = { url, method: 'GET', responseType: 'stream' };
        if (settings.proxy && settings.proxy !== 'none') {
            const parsedUrl = new URL(settings.proxy);
            axiosConfig.proxy = { protocol: parsedUrl.protocol, host: parsedUrl.hostname, port: parsedUrl.port };
        }

        const res = await axios(axiosConfig);

        const total = +res.headers['content-length'];
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar.start(total, 0);

        const writer = fs.createWriteStream(zip);
        res.data.on('data', chunk => bar.increment(chunk.length));
        res.data.pipe(writer);

        await new Promise((r, j) => {
            writer.on('finish', r);
            writer.on('error', j);
        });
        bar.stop();

        spinner.text = 'Extracting...';
        await fs.createReadStream(zip).pipe(unzipper.Extract({ path: dest })).promise();
        fs.removeSync(zip);

        spinner.succeed(`✓ Installed PHP ${version} at ${dest}`);
    } catch (e) {
        spinner.fail(e.message);
    }
}

// 🔹 Uninstall PHP
function uninstall(version) {
    const target = path.join(VERSIONS, version);
    if (!fs.existsSync(target)) {
        console.log(chalk.red(`✗ PHP ${version} not installed`));
        return;
    }
    try {
        fs.removeSync(target);
        console.log(chalk.green(`✓ Uninstalled PHP ${version}`));
    } catch (e) {
        console.log(chalk.red(`✗ Failed to uninstall: ${e.message}`));
    }
}

// 🔹 Use version (symlink to settings.path)
async function use(version) {
    if (!version && fs.existsSync(RC_FILE)) {
        version = fs.readFileSync(RC_FILE, 'utf-8').trim();
    }
    if (!version) {
        console.log(chalk.red('No version specified. Usage: phpvm use <version>'));
        return;
    }

    const spinner = ora(`Resolving ${version}...`).start();
    try {
        version = await resolveVersion(version);
        spinner.stop();
    } catch (e) {
        spinner.fail(e.message);
        return;
    }

    const target = path.join(VERSIONS, version);
    if (!fs.existsSync(target)) {
        console.log(chalk.red(`✗ PHP ${version} not installed. Run: phpvm install ${version}`));
        return;
    }

    const symlinkTarget = settings.path;

    try {
        if (fs.existsSync(symlinkTarget)) fs.removeSync(symlinkTarget);
        
        fs.symlinkSync(target, symlinkTarget, 'junction');
        
        // Setup NVM_HOME and NVM_SYMLINK natively for Windows.
        applyGlobalEnvironmentVars();

        console.log(chalk.green(`✓ Now using PHP ${version}`));
        console.log(chalk.gray(`  Symlink pointing from ${symlinkTarget} -> ${target}`));
    } catch (e) {
        if (e.message.includes('EPERM') || e.code === 'EPERM') {
            console.log(chalk.red(`✗ Execution blocked. Try running terminal as Administrator to create symlink at '${symlinkTarget}'`));
        } else {
            console.log(chalk.red(`✗ Error switching versions: ${e.message}`));
        }
    }
}

// 🔹 List installed
function list() {
    const installed = fs.readdirSync(VERSIONS).sort((a, b) => 
        b.localeCompare(a, undefined, { numeric: true })
    );

    if (installed.length === 0) {
        console.log(chalk.yellow('No versions installed. Run: phpvm install latest'));
        return;
    }

    const current = getCurrent();
    console.log(chalk.blue('\nInstalled versions:\n'));
    
    installed.forEach(v => {
        const marker = v === current ? chalk.green('→') : ' ';
        console.log(`  ${marker} ${v}`);
    });
    console.log();
}

function listRemote(all = false) {
    fetchVersions().then(versions => {
        const display = all ? versions : versions.slice(0, 20);
        console.log(chalk.blue(`\nAvailable PHP versions${!all ? ' (showing latest 20)' : ''}:\n`));
        display.forEach(v => console.log(`  ${v}`));
        if (!all && versions.length > 20) {
            console.log(`  ${chalk.gray('...')} and ${versions.length - 20} more\n`);
            console.log(chalk.gray('Run "phpvm list-remote --all" to see all versions'));
        }
        console.log();
    });
}

function getCurrent() {
    if (fs.existsSync(settings.path)) {
        try {
            return path.basename(fs.readlinkSync(settings.path));
        } catch {}
    }
    return null;
}

function current() {
    const version = getCurrent();
    if (!version) {
        console.log(chalk.yellow('No version selected. Run: phpvm use <version>'));
        return;
    }
    console.log(version);
}

function which() {
    const version = getCurrent();
    if (!version) {
        console.log(chalk.red('No version selected'));
        return;
    }
    console.log(path.join(settings.path, 'php.exe'));
}

async function exec(command, args) {
    const version = getCurrent();
    if (!version) {
        console.log(chalk.red('No version selected'));
        return;
    }
    const phpPath = path.join(settings.path, 'php.exe');
    if (!fs.existsSync(phpPath)) {
        console.log(chalk.red('PHP executable not found'));
        return;
    }
    try {
        const cmd = `"${phpPath}" ${command} ${args ? args.join(' ') : ''}`;
        execSync(cmd, { stdio: 'inherit', shell: true });
    } catch (e) {
        process.exit(1);
    }
}

function cleanup() {
    const files = fs.readdirSync(CACHE);
    if (files.length === 0) {
        console.log(chalk.green('Cache is clean'));
        return;
    }
    let totalSize = 0;
    files.forEach(f => {
        const filePath = path.join(CACHE, f);
        totalSize += fs.statSync(filePath).size;
        fs.removeSync(filePath);
    });
    console.log(chalk.green(`✓ Removed ${files.length} files (${(totalSize / 1024 / 1024).toFixed(2)} MB)`));
}


// --- CLI Bindings ---
program.name('phpvm').description('PHP Version Manager (nvm-windows style architecture)').version('2.0.0');

program.command('install <version>').description('Install a PHP version').action(install);
program.command('uninstall <version>').description('Uninstall a PHP version').action(uninstall);
program.command('use [version]').description('Switch to a specific PHP version').action(use);
program.command('list').alias('ls').description('List installed PHP versions').action(list);
program.command('list-remote').description('List available PHP versions').option('--all').action((opts) => listRemote(opts.all));
program.command('current').description('Show selected version').action(current);
program.command('which').description('Show path to active PHP').action(which);
program.command('exec <command> [args...]').description('Execute with active PHP').action(exec);
program.command('alias <alias> <version>').description('Create version alias').action(setAlias);
program.command('cleanup').description('Clean up cache').action(cleanup);

// Configuration commands
program.command('root [path]').description('Get or set the directory where PHPVM stores versions').action(setRoot);
program.command('path [path]').description('Get or set the global symlink path used for active PHP').action(setPath);

program.showHelpAfterError(true).parse(process.argv);