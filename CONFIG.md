# phpvm Configuration Guide

## Directory Structure

```
~/.phpvm/
├── versions/
│   ├── 8.1.0/
│   ├── 8.2.5/
│   ├── 8.3.0/
│   └── ...
├── current/          (symlink to active version)
├── cache/            (downloaded .zip files)
└── aliases/
    └── aliases.json
```

## Environment Variables

### PHPVM_DIR

**Default:** `~/.phpvm` (user home directory)

**Usage:**
```powershell
# Temporary
$env:PHPVM_DIR = "C:\my-php-versions"
phpvm install latest

# Permanent (System Environment Variable)
[Environment]::SetEnvironmentVariable("PHPVM_DIR", "C:\my-php-versions", "User")
```

**Benefits of custom directory:**
- Store on faster drive (SSD)
- Use network/shared location
- Organize across projects

## Configuration Files

### .phpvmrc

**Purpose:** Specify PHP version per project

**Location:** Project root directory

**Format:** Single version on first line
```
8.2.5
```

Or with comment:
```
# Project requires PHP 8.2+
8.2.5
```

**Usage:**
```powershell
cd my-project
phpvm use  # Reads .phpvmrc and switches
```

### aliases.json

**Location:** `~/.phpvm/aliases/aliases.json`

**Format:**
```json
{
  "latest": "8.3.0",
  "stable": "8.2.10",
  "legacy": "7.4.33",
  "myproject": "8.2.5"
}
```

**Create manually:**
```powershell
phpvm alias latest 8.3.0
phpvm alias myproject 8.2.5
phpvm use myproject  # Resolves to 8.2.5
```

## Windows PATH Integration

### Automatic (with symlink)

After `phpvm use`, `~/.phpvm/current` is in PATH. PHP is available globally:

```powershell
php --version
composer install
phpunit
```

### Manual PATH Setup

If you can't use symlinks, manually add to PATH:

1. **Temporary (current session):**
   ```powershell
   $phpPath = "C:\Users\You\.phpvm\versions\8.2.5"
   $env:PATH = "$phpPath;$env:PATH"
   ```

2. **Permanent (System Environment Variable):**
   - Win + X → System
   - Advanced system settings
   - Environment Variables
   - Add `C:\Users\You\.phpvm\versions\8.2.5` to PATH

3. **Via PowerShell Profile:**
   ```powershell
   # In $PROFILE
   $env:PATH = "C:\Users\You\.phpvm\versions\8.2.5;$env:PATH"
   ```

## Version Resolution

phpvm supports multiple version specification formats:

```powershell
phpvm install latest          # Latest available
phpvm install 8.2            # Latest 8.2.x
phpvm install 8.2.5          # Exact version
phpvm install latest-8.2      # Not supported, use alias instead
```

## Cache Management

Downloaded PHP archives are stored in `~/.phpvm/cache/`

### Clean Cache
```powershell
phpvm cleanup
```

### Manual Cache Management
```powershell
# View cache
dir "$env:USERPROFILE\.phpvm\cache\"

# Delete specific cached version
rm "$env:USERPROFILE\.phpvm\cache\8.2.5.zip"

# Delete all cache
rm "$env:USERPROFILE\.phpvm\cache\*"
```

## Multiple PHP Installations (Advanced)

### Scenario: Run PHP 8.1 API, 8.2 for web app

**Setup:**
```powershell
phpvm install 8.1
phpvm install 8.2
```

**In PowerShell scripts:**
```powershell
function Invoke-WithPhp {
    param([string]$Version, [scriptblock]$Script)
    
    $phpPath = "$env:USERPROFILE\.phpvm\versions\$Version"
    $oldPath = $env:PATH
    
    try {
        $env:PATH = "$phpPath;$env:PATH"
        & $Script
    } finally {
        $env:PATH = $oldPath
    }
}

# Usage:
Invoke-WithPhp "8.1" { php api-server.php }
Invoke-WithPhp "8.2" { composer install }
```

## Integration with IDEs

### VSCode

In `.vscode/settings.json`:
```json
{
  "php.validate.executablePath": "C:\\Users\\YourName\\.phpvm\\current\\php.exe",
  "php.validate.run": "onType"
}
```

### PhpStorm

1. File → Settings → Languages & Frameworks → PHP
2. CLI Interpreter → Add
3. Path: `C:\Users\YourName\.phpvm\current\php.exe`

### Docker Compatible

Use phpvm version in local development, Docker in production:
```dockerfile
FROM php:8.2-cli
# ... rest of Dockerfile
```

## Docker Integration

If using Docker, phpvm helps with:
- Local development matching production PHP version
- Testing multiple versions locally
- Windows development without WSL

Set up matching versions:
```powershell
# Check production PHP version
# Set locally
phpvm use 8.2

# Test with product PHP version
php tests/run.php

# Then use Docker for consistency in CI/CD
```

## Performance Tips

### Faster Version Switching

Keep commonly used versions installed:
```powershell
phpvm install 8.1
phpvm install 8.2
phpvm install 8.3

# Switching is instant (just symlink update)
phpvm use 8.2
phpvm use 8.3  # Very fast
```

### Faster Download

- Use wired network (not WiFi)
- Close other downloads
- Try alternative URL if stuck:
  ```powershell
  # phpvm will auto-try fallback mirrors
  phpvm install 8.2
  ```

### SSD Storage

Put `PHPVM_DIR` on SSD for faster extraction:
```powershell
$env:PHPVM_DIR = "D:\php-versions"  # Fast SSD
phpvm install latest
```

## Troubleshooting Configuration

### "No version selected" after install

Ensure `phpvm use` was successful:
```powershell
# Check if symlink exists
ls "$env:USERPROFILE\.phpvm\current"

# Check if directory has php.exe
ls "$env:USERPROFILE\.phpvm\versions\8.2.5\php.exe"
```

### phpvm commands not found

Reinstall globally:
```powershell
npm link
npm link phpvm
```

### Alias not resolving

Check aliases file:
```powershell
cat "$env:USERPROFILE\.phpvm\aliases\aliases.json"
```

Delete and recreate:
```powershell
rm "$env:USERPROFILE\.phpvm\aliases\aliases.json"
phpvm alias latest latest
```

## Advanced: Custom PHP Builds

If you need custom PHP build:

1. Build PHP locally
2. Place in `~/.phpvm/versions/custom-build/`
3. Use with phpvm:
   ```powershell
   phpvm use custom-build
   ```

phpvm will find and symlink it automatically.

---

For more help: `phpvm --help` or `phpvm <command> --help`
