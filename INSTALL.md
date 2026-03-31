# phpvm Installation & Setup Guide

## Step 1: Install Node.js

phpvm requires Node.js 20 or later.

- Download from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version`

## Step 2: Install phpvm

### From Source

```powershell
# Clone or download the repository
cd phpvm

# Install dependencies
npm install

# Register as global command
npm link
```

### Verify Installation

```powershell
phpvm --version
phpvm --help
```

## Step 3: Run Setup (Optional but Recommended)

```powershell
npm run setup
```

This will:
- ✓ Create `~/.phpvm` directory
- ✓ Set up default aliases
- ✓ Create example `.phpvmrc`

## Step 4: Install a PHP Version

```powershell
# Install latest PHP
phpvm install latest

# Or specific version
phpvm install 8.2.5
```

The first installation may take a few minutes.

## Step 5: Switch to the Version

```powershell
# Use globally
phpvm use latest

# Check current version
phpvm current
```

## Step 6: Configure PowerShell Profile (Optional)

For automatic PATH updates and `.phpvmrc` support:

1. Find your PowerShell profile:
   ```powershell
   $PROFILE
   ```

2. Open it in an editor:
   ```powershell
   code $PROFILE
   ```

3. Add these lines:
   ```powershell
   # phpvm configuration
   $env:PHPVM_DIR = "$env:USERPROFILE\.phpvm"
   
   function Update-PhpPath {
       $currentLink = "$env:PHPVM_DIR\current"
       if (Test-Path $currentLink -PathType Container) {
           $phpPath = (Resolve-Path $currentLink).Path
           $paths = $env:PATH -split [IO.Path]::PathSeparator
           $paths = $paths | Where-Object { -not $_.StartsWith($env:PHPVM_DIR) }
           $env:PATH = "$phpPath;$($paths -join [IO.Path]::PathSeparator)"
       }
   }
   
   Update-PhpPath
   ```

4. Reload profile:
   ```powershell
   . $PROFILE
   ```

## Step 7: Verify Work

```powershell
# Check PHP version
php --version

# Check current phpvm version
phpvm current

# List installed versions
phpvm list

# List available versions
phpvm list-remote
```

## Common Tasks

### Use PHP 8.1 (different from current)
```powershell
phpvm use 8.1
```

### Create a project-specific version file
```powershell
# In your project directory
echo "8.2.5" > .phpvmrc
phpvm use  # Auto-switches to version in .phpvmrc
```

### Find PHP executable path
```powershell
phpvm which
```

### Run PHP code directly
```powershell
phpvm exec -r "echo phpversion();"
```

### Uninstall a version
```powershell
phpvm uninstall 8.1.0
```

### Clean up downloads
```powershell
phpvm cleanup
```

## Environment Variables

### `PHPVM_DIR`

Override the default installation directory:

```powershell
# For current session
$env:PHPVM_DIR = "C:\php-versions"

# Or set permanently in System Settings > Environment Variables
```

## Troubleshooting

### "Run as admin for symlink"

phpvm needs admin privileges to create symlinks. Solutions:

**Option 1: Run as Administrator**
```powershell
# Right-click PowerShell and select "Run as Administrator"
phpvm use <version>
```

**Option 2: Manual PATH (without admin)**

Skip the symlink and manually add to PATH:
```powershell
$env:PATH = "C:\Users\YourName\.phpvm\versions\8.2.5;$env:PATH"
```

**Option 3: Enable Developer Mode (Windows 10+)**
- Settings → Update & Security → For developers
- Enable "Developer mode"
- Run `phpvm use <version>` (admin not required)

### "Version not found"

1. Check available versions:
   ```powershell
   phpvm list-remote
   ```

2. Try a different version format:
   ```powershell
   phpvm install 8.2     # Instead of 8.2.5
   phpvm install latest  # Use latest
   ```

3. Check your internet connection

### PHP command not found

1. Verify phpvm switched correctly:
   ```powershell
   phpvm current
   ```

2. Check PATH:
   ```powershell
   $env:PATH
   ```

3. Manually add to PATH:
   ```powershell
   $phpPath = "$(phpvm which)" | Split-Path
   $env:PATH = "$phpPath;$env:PATH"
   ```

### Installation fails

1. Check internet connection
2. Try a different PHP version
3. Clear cache: `phpvm cleanup`
4. Try manual download from [windows.php.net](https://windows.php.net/downloads/releases/)

## Advanced Usage

### Create Version Aliases

```powershell
phpvm alias latest 8.2.10
phpvm alias stable 8.1.0
phpvm alias dev 8.3.0-rc1

# Then use them
phpvm use latest
phpvm use stable
```

### Batch Install Versions

```powershell
@("8.1", "8.2", "8.3") | ForEach-Object { phpvm install $_ }
```

### List All Available Versions

```powershell
phpvm list-remote --all
```

## Getting Help

```powershell
phpvm --help
phpvm <command> --help
```

## Support

For issues, feature requests, or questions:
- Check the [README.md](README.md)
- Review existing issues
- Create a new issue with details

---

Happy PHP version switching! 🚀
