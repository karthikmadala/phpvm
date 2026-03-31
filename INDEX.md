# phpvm Documentation Index

Welcome to phpvm - a complete PHP Version Manager for Windows!

## 📚 Quick Navigation

### 🚀 Getting Started
- **[QUICKSTART.md](QUICKSTART.md)** - Install and use phpvm in 5 minutes
- **[INSTALL.md](INSTALL.md)** - Detailed step-by-step installation guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was implemented

### 📖 Documentation
- **[README.md](README.md)** - Feature overview and usage guide
- **[CONFIG.md](CONFIG.md)** - Advanced configuration and customization
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and upgrade notes

### 🔧 Reference

**Installation & Setup**
```powershell
npm install -g phpvm        # Install globally
npm run setup               # Initialize phpvm directories
phpvm --version             # Verify installation
```

**Common Commands**
```powershell
phpvm install latest        # Install latest PHP
phpvm use 8.2              # Switch versions
phpvm list                 # Show installed
phpvm list-remote          # Show available
phpvm current              # Show active version
```

**Advanced Features**
```powershell
phpvm alias myapp 8.2.5    # Create shortcut
phpvm which                # Show PHP path
phpvm exec -r "phpinfo()"  # Run with current PHP
phpvm cleanup              # Remove cache
```

## 📋 File Guide

```
phpvm/
│
├── 📖 Documentation Files
│   ├── README.md                    # Main documentation
│   ├── QUICKSTART.md                # 5-minute guide
│   ├── INSTALL.md                   # Installation guide
│   ├── CONFIG.md                    # Configuration guide
│   ├── CHANGELOG.md                 # Version history
│   ├── IMPLEMENTATION_SUMMARY.md    # What's new in v2
│   └── INDEX.md                     # This file
│
├── 🔧 Application Files
│   ├── bin/phpvm.js                 # Main application
│   ├── setup.js                     # Setup automation
│   ├── package.json                 # Dependencies
│   └── phpvm.profile.ps1            # PowerShell integration
│
├── 📁 Runtime Directories
│   ├── versions/                    # Installed PHP versions
│   └── (new) ~/.phpvm/              # User config (created at runtime)
│       ├── versions/                # Downloaded PHP
│       ├── cache/                   # Temp files
│       ├── current/                 # Symlink to active
│       └── aliases/                 # Named shortcuts
│
└── ⚙️ Configuration
    ├── .gitignore                   # Git exclusions
    └── .phpvmrc.example             # Example config
```

## 🎯 Use Cases

### I want to...

**Install phpvm**
- → Read [QUICKSTART.md](QUICKSTART.md)

**Get started quickly**
- → Read [QUICKSTART.md](QUICKSTART.md)

**Install PHP versions**
- → `phpvm install latest`
- → See [README.md](README.md#installation)

**Switch between versions**
- → `phpvm use 8.2`
- → See [README.md](README.md#version-management)

**Setup project-specific versions**
- → Create `.phpvmrc` in project
- → `phpvm use`
- → See [CONFIG.md](CONFIG.md#phpvmrc)

**Integrate with PowerShell**
- → Add `phpvm.profile.ps1` to `$PROFILE`
- → See [INSTALL.md](INSTALL.md#step-6-configure-powershell-profile-optional)

**Use with Docker/CI**
- → See [CONFIG.md](CONFIG.md#docker-integration)

**Configure custom location**
- → Set `PHPVM_DIR` environment variable
- → See [CONFIG.md](CONFIG.md#environment-variables)

**Troubleshoot issues**
- → See [INSTALL.md](INSTALL.md#troubleshooting)

**Learn all features**
- → Read [README.md](README.md)

## 📊 Version Information

- **Current Version:** 2.0.0
- **Status:** ✅ Production-Ready
- **Node.js Required:** 16.0.0+
- **OS:** Windows 10+ (Linux/Mac support planned)
- **License:** ISC

## 🆘 Getting Help

### Quick Help
```powershell
phpvm --help                # General help
phpvm <command> --help      # Command-specific help
phpvm use --help            # Example: help for 'use' command
```

### Common Issues
- See [INSTALL.md - Troubleshooting](INSTALL.md#troubleshooting)

### Detailed Setup
- See [INSTALL.md](INSTALL.md)

### Advanced Configuration
- See [CONFIG.md](CONFIG.md)

## 🔄 Workflow Examples

### Example 1: Local Development

```powershell
# Install multiple versions
phpvm install 8.1
phpvm install 8.2
phpvm install 8.3

# Switch by project
cd ~/project-old && phpvm use 8.1  # Uses 8.1.0
cd ~/project-new && phpvm use 8.2  # Uses 8.2.x
```

### Example 2: CI/CD Testing

```powershell
# Test against multiple versions
foreach ($version in @("8.1", "8.2", "8.3")) {
    phpvm use $version
    php tests/run.php
}
```

### Example 3: Production Matching

```powershell
# Match production environment
phpvm use 8.2.5

# Development with PHP 8.2
composer install
php artisan serve

# CI still uses Docker (reproducible)
docker run php:8.2-cli phpunit
```

## 📝 Tips & Tricks

### Create Shortcuts for FPGA Projects
```powershell
phpvm alias fpga-api 8.1.0
phpvm alias fpga-web 8.2.5
phpvm use fpga-api   # Quick switch
```

### List Everything
```powershell
phpvm list           # Installed
phpvm list-remote    # Available
phpvm list-remote --all  # All available
```

### Clean Up Old Versions
```powershell
phpvm uninstall 7.4.0
phpvm cleanup        # Remove cache
```

### Verify Current Setup
```powershell
phpvm current       # Which version?
phpvm which         # Where is it?
php --version       # Double check
```

## 🚀 Next Steps

1. **First Time?** → [QUICKSTART.md](QUICKSTART.md)
2. **Detailed Setup?** → [INSTALL.md](INSTALL.md)
3. **Advanced Usage?** → [CONFIG.md](CONFIG.md)
4. **Full Reference?** → [README.md](README.md)
5. **What's New?** → [CHANGELOG.md](CHANGELOG.md)

---

**Happy version switching!** 🎉

For the latest updates and support, check the documentation files above.
