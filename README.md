# phpvm - PHP Version Manager

A simple and fast Node.js-based PHP version manager for Windows, inspired by nvm.

## Installation

1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npm link` to make `phpvm` available globally

## Usage

### Installation
```bash
# Install latest PHP
phpvm install latest

# Install a specific version
phpvm install 8.2.5

# Install matching wildcard (installs latest 8.2.x)
phpvm install 8.2
```

### Version Management
```bash
# List installed versions
phpvm list

# List available versions (latest 20)
phpvm list-remote

# Show all available versions
phpvm list-remote --all

# Switch to a specific version
phpvm use 8.2.5

# Show current version
phpvm current

# Get path to current PHP executable
phpvm which
```

### Execute Commands
```bash
# Run PHP with current version
phpvm exec script.php

# Run Composer with current PHP
phpvm exec ../composer.phar install
```

### Manage Versions
```bash
# Uninstall a version
phpvm uninstall 8.1.0

# Create an alias for quick switching
phpvm alias myapp 8.2.5

# Then use it
phpvm use myapp
```

### Maintenance
```bash
# Clean up cached downloads
phpvm cleanup
```

## Project-Specific Versions

Create a `.phpvmrc` file in your project root with just the version number:

```
8.2.5
```

Then run `phpvm use` without arguments to automatically switch to that version:

```bash
phpvm use
```

## Configuration

### Custom Installation Directory

By default, phpvm stores versions in `~/.phpvm`. Override with an environment variable:

```powershell
# Windows PowerShell
$env:PHPVM_DIR = "C:\php-versions"
phpvm install latest

# Or permanently in System Environment Variables
```

## How It Works

- **Downloads** PHP from windows.php.net
- **Extracts** to `~/.phpvm/versions/<version>/`
- **Symlinks** current version to `~/.phpvm/current`
- **Manages** aliases in `~/.phpvm/aliases/aliases.json`

## Commands Reference

| Command | Description |
|---------|-------------|
| `install <version>` | Install a PHP version |
| `uninstall <version>` | Remove a PHP version |
| `use [version]` | Switch to a version |
| `list` / `ls` | Show installed versions |
| `list-remote [--all]` | Show available versions |
| `current` | Show active version |
| `which` | Show PHP binary path |
| `exec <cmd> [args]` | Run command with current PHP |
| `alias <name> <version>` | Create version alias |
| `cleanup` | Remove cached downloads |

## Features

✅ Version management  
✅ Automatic version resolution (latest, major.minor wildcards)  
✅ Symlink-based switching  
✅ .phpvmrc support  
✅ Version aliases  
✅ Direct command execution  
✅ Cache management  
✅ Windows-optimized  

## Requirements

- Node.js 16+
- Administrator privileges (for symlink creation)
- Windows OS

## Troubleshooting

### "Run as admin for symlink"
You need administrator privileges to create symlinks. Either:
- Run PowerShell as Administrator
- Or manually set PATH to `<phpvm-dir>\versions\<version>`

### Version not found
- Check `phpvm list-remote` for available versions
- Ensure internet connection for version fetching
- Try older versions if recent ones have issues

## License

ISC
