# Building phpvm as an .exe File

Your phpvm project is now configured to build as a standalone Windows executable using **pkg** (Package).

## 🚀 Quick Start

### Step 1: Install Build Dependencies

```powershell
npm install
```

This installs the `pkg` tool needed to create the .exe file.

### Step 2: Build the Executable

```powershell
npm run build
```

This creates `phpvm.exe` in the `dist/` directory.

### Step 3: Use the Executable

```powershell
# Option A: Run directly
./dist/phpvm.exe --version
./dist/phpvm.exe install latest

# Option B: Add to PATH and use globally
# Copy phpvm.exe to a folder in your PATH, or add the dist folder to PATH
$env:PATH += ";D:\phpvm\dist"
phpvm.exe install latest
```

## 📋 Build Details

The build is configured to:
- **Target:** Windows x64 (`win-x64`)
- **Output:** `dist/phpvm.exe`
- **Compression:** Brotli (smaller file size)
- **Includes:** All dependencies

### Build Scripts Configuration

```json
{
  "scripts": [
    "./bin/phpvm.js",
    "./setup.js"
  ],
  "assets": [
    "node_modules/"
  ],
  "targets": [
    "win-x64"
  ],
  "outputPath": "dist"
}
```

## 📦 What Gets Included

- ✅ Main phpvm CLI application
- ✅ Setup script
- ✅ All npm dependencies (axios, chalk, commander, etc.)
- ✅ Node.js runtime (self-contained)

**Result:** Single `.exe` file that runs without needing Node.js installed!

## 🎯 Distribution

Once built, you can:
1. **Share the .exe** - Users don't need Node.js, just Windows
2. **Add to PATH** - Make it globally accessible
3. **Create installer** - Package with NSIS or similar

## 🔧 Customization

### Build for Different Windows Versions

Edit `package.json` to target:

```json
"targets": [
  "win-x64",      // 64-bit
  "win-ia32"      // 32-bit (legacy)
]
```

Then rebuild:
```powershell
npm run build
```

### Build Without Compression

```powershell
npx pkg . --output phpvm.exe
```

### Custom Output Name

```powershell
npx pkg . --output my-phpvm.exe
```

## 📊 Example Output

```
Build complete!

✓ phpvm.exe created in dist/ folder
✓ File size: ~50-60 MB (includes Node.js runtime + dependencies)
✓ Ready to distribute or add to PATH
```

## 🚨 Troubleshooting

### Error: "pkg not found"

Make sure you ran `npm install`:
```powershell
npm install
npm run build
```

### Build Fails with Module Errors

Ensure all dependencies are installed:
```powershell
npm install --save
npm run build
```

### .exe file too large

This is normal - it includes the entire Node.js runtime. File size is typically 50-60 MB.

To reduce: Remove non-essential dependencies or use different compression.

## 📝 Next Steps

1. **Build it:**
   ```powershell
   npm run build
   ```

2. **Test it:**
   ```powershell
   ./dist/phpvm.exe --version
   ./dist/phpvm.exe list
   ```

3. **Add to PATH (optional):**
   ```powershell
   [Environment]::SetEnvironmentVariable("PATH", "$env:PATH;D:\phpvm\dist", "User")
   ```

4. **Use it globally:**
   ```powershell
   phpvm.exe install latest
   phpvm.exe use latest
   ```

## 🔐 Notes

- The .exe is fully standalone - doesn't require Node.js installation
- All npm modules are bundled inside
- Same functionality as `npm link` version
- Portable - can be shared or moved to any Windows machine

---

**Ready to build?** Run `npm run build` now! ✨
