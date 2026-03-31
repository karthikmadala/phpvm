# Changelog

## [2.0.0] - Complete NVM-Like Setup

### Added
- **Enhanced command set:**
  - `phpvm uninstall` - Remove PHP versions
  - `phpvm alias <name> <version>` - Create version aliases
  - `phpvm which` - Show PHP executable path
  - `phpvm exec <cmd> [args]` - Execute commands with current PHP
  - `phpvm cleanup` - Clean downloaded files

- **Better version resolution:**
  - Wildcard support (e.g., `phpvm use 8.2` matches 8.2.x)
  - Alias support for custom shortcuts
  - Better error messages

- **Improved directory structure:**
  - Default to `~/.phpvm` instead of hardcoded `C:\phpvm`
  - Respects `PHPVM_DIR` environment variable
  - Proper aliases directory with JSON storage

- **Documentation:**
  - Comprehensive `README.md`
  - `INSTALL.md` - Installation & setup guide
  - `CONFIG.md` - Configuration & advanced usage
  - `QUICKSTART.md` - Get started in 5 minutes

- **PowerShell integration:**
  - `phpvm.profile.ps1` - Shell integration script
  - Helper scripts for PATH management
  - Auto-switching support for `.phpvmrc`

- **Setup automation:**
  - `setup.js` script - Initialize phpvm directories
  - `npm run setup` command
  - Default aliases creation

### Improved
- **Better error handling:**
  - Clear error messages for missing versions
  - Network timeout handling
  - Admin privilege detection for symlinks

- **User experience:**
  - Progress indicators with spinners
  - Better formatted output with colors
  - Current version marker in `phpvm list`
  - Help text for all commands

- **Robustness:**
  - Fallback download URLs
  - Better version parsing from PHP site
  - Cache management

### Changed
- Project structure is now more complete and professional
- Symlinks use `junction` for better Windows compatibility
- Version info cached less (fetched fresh each time for accuracy)
- Default location is user home directory, not system drive

### Fixed
- Proper `.phpvmrc` file handling
- Better symlink creation on Windows
- Improved version resolution logic
- Cache directory always created

### Technical
- Updated to Node.js module standards
- Better ESM module handling
- Proper path resolution across platforms
- Enhanced CLI with commander.js features

## [1.0.0] - Initial Release

### Features
- Basic version installation
- Version switching with symlinks
- List installed and available versions
- Show current version
- `.phpvmrc` support

### Known Limitations
- Hardcoded to `C:\phpvm`
- Limited commands
- Basic error handling
- Minimal documentation

---

**Upgrade Notes:**

When upgrading from 1.0.0 to 2.0.0:

1. Your existing installed versions in `C:\phpvm\versions` will still work
2. To use new features, set or migrate to `~/.phpvm`:
   ```powershell
   robocopy C:\phpvm\versions $env:USERPROFILE\.phpvm\versions /COPYALL
   ```
3. Run `npm run setup` to initialize new features
4. Recreate aliases with new `phpvm alias` command
5. Update PowerShell profile with new integration if desired

All existing functionality is backward compatible.
