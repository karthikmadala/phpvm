# Fix phpvm errors and Env Var setup
This plan outlines the fixes and improvements to make `phpvm` work correctly like `nvm` and automatically manage environment variables.

## User Review Required
Please review the changes, especially the approach to environment variables. Because a Node.js script cannot modify the `PATH` of its parent terminal process currently executing it, there are two standard ways to achieve automatic environment variable setup:
1. **Global/Permanent Environment Update**: I will modify `phpvm.js` so that when you run `phpvm use`, it automatically adds the `~/.phpvm/current` directory to your Windows User `PATH` permanently (via Registry). This allows any *new* terminals to have the correct PHP version automatically.
2. **Current Terminal Update**: To update the *current* terminal without restarting it, I will fix `phpvm.profile.ps1` to override the `phpvm` command. When you type `phpvm use`, the PowerShell profile will intercept it, run the script, and immediately update your current PowerShell session's `$env:PATH`.

Does this approach sound correct for your requirements?

## Proposed Changes

### Core Logic & Error Fixes
#### [MODIFY] `phpvm.js`
- **Fix Version Regex:** PHP 8.4+ uses `vs17` (e.g. `Win32-vs17-x64.zip`), but the script is hardcoded to `vs16`. I'll update the regex and `resolveUrl` to correctly detect and use both `vs16` and `vs17`.
- **Global Path Setup:** In the `use()` command, I'll add logic that uses `setx` (or equivalent registry edits via powershell) to ensure `~/.phpvm/current` is added to the Windows User `Path` automatically, similar to `nvm-windows`.
- **Remove Unnecessary Re-declarations:** Fix `ExecSync` unused variable and cleanup any minor lint issues.

#### [MODIFY] `phpvm.profile.ps1`
- **Command Overriding:** Instead of creating an un-intuitive alias `phpvm-use`, I'll create a `function phpvm` wrapper. This exactly mimics `nvm`. So when you type `phpvm use <version>`, it runs the actual Node.js tool AND instantly updates the PowerShell `$env:PATH`.

## Open Questions
- Do you want `phpvm use` to *only* manage Thread-Safe (TS) versions of PHP, or should it also support Non-Thread Safe (NTS) versions (currently it only seems to target standard TS)? I'll continue focusing on standard TS versions unless you specify otherwise.

## Verification Plan
### Automated & Manual Verification
- Install the updated `phpvm.js` logic.
- Run `phpvm list-remote` and verify PHP 8.4 and 8.5 appear.
- Run `phpvm install 8.4` and verify it discovers and downloads the `vs17` zip.
- Reload PowerShell profile, run `phpvm use 8.4`, and observe both the global `PATH` and the session `$env:PATH` being updated.
- Verify `php -v` immediately reflects the change.
