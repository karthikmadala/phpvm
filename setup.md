# Setting Up phpvm (Post-Clone)

Welcome to the **phpvm** project! If you've just cloned this repository, follow the steps below to set up your local development environment and get the project running.

## Prerequisites

Before you begin, ensure you have the following installed on your Windows machine:
- **Node.js**: Version 20 or later. (Download from [nodejs.org](https://nodejs.org/)).
- **Git**: To clone the repository (which you've likely already done).

## Step-by-Step Setup Guide

### 1. Install Dependencies
Navigate into the cloned repository directory and install the required npm packages. This will install dependencies like `axios`, `commander` and `chalk`.

```powershell
cd phpvm
npm install
```

### 2. Initialize the Project
The project includes a convenient start command that registers the CLI globally for development and runs the initialization script. Run it using:

```powershell
npm start
```

**What this command does:**
- Runs `npm link` so you can use the `phpvm` command anywhere in your terminal, routing directly to your cloned codebase.
- Runs `node setup.js` which:
  - Creates the base directory `~/.phpvm` (or the path defined in `$env:PHPVM_DIR`).
  - Sets up the `versions/` and `cache/` subdirectories.
  - Creates the default `aliases.json` file.
  - Generates an example `.phpvmrc` file in the current directory.

To verify that it linked successfully, run:
```powershell
phpvm --version
```

## 🚀 Testing Your Setup

Now that the project is set up, you can try out some core commands:

```powershell
# See all available commands
phpvm --help

# Install the latest PHP version
phpvm install latest

# Set that version as to be used
phpvm use latest

# Verify the current active version
phpvm current
```

## Contributing / Development

When working on the codebase (specifically `/bin/phpvm.js` or other utilities):
- Since you ran `npm link`, any changes you make to the source files will immediately reflect when you run `phpvm` in the terminal.
- Test your changes regularly. 

> [!NOTE] 
> Creating junction symlinks on Windows (which `phpvm use` utilizes) generally works with Developer Mode enabled. Check `INSTALL.md` or `README.md` for troubleshooting detailed administrative privileges or PowerShell Profile configurations.
