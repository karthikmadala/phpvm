# Quick Start Guide

Get up and running with phpvm in 5 minutes.

## 1️⃣ Install phpvm

```powershell
npm install -g phpvm
```

Or from source:
```powershell
git clone <repo>
cd phpvm
npm install
npm link
```

## 2️⃣ Verify Installation

```powershell
phpvm --version
# Should show: 2.0.0
```

## 3️⃣ Install PHP

```powershell
phpvm install latest
# or specific version
phpvm install 8.2
```

Wait for download and extraction (first time takes a few minutes).

## 4️⃣ Switch to It

```powershell
phpvm use latest
phpvm current
# Should show: 8.3.0 (or whatever latest is)
```

## 5️⃣ Test It Works

```powershell
php --version
```

## Done! 🎉

Now you can:

| Command | What it does |
|---------|-------------|
| `phpvm list` | See installed versions |
| `phpvm list-remote` | See available versions |
| `phpvm use 8.2` | Switch versions instantly |
| `phpvm install 8.1` | Install another version |
| `phpvm which` | Show PHP path |

## Project-Specific Versions

Create `.phpvmrc` in your project:
```
8.2
```

Then:
```powershell
cd my-project
phpvm use  # Auto-switches to version in .phpvmrc
```

## Next Steps

- Read [INSTALL.md](INSTALL.md) for detailed setup
- Read [CONFIG.md](CONFIG.md) for advanced configuration
- Read [README.md](README.md) for full documentation

## Need Help?

```powershell
phpvm --help
phpvm use --help
```

---

**That's it!** Enjoy seamless PHP version switching! 🚀
