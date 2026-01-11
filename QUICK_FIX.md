# Quick Fix for iOS Build Issues

## Current Status
Your project has a path with spaces which causes React Native build scripts to fail.

## Immediate Steps to Fix

### 1. Close Xcode
```bash
# Kill any running Xcode processes
killall Xcode 2>/dev/null || true
```

### 2. Clean Build Artifacts
```bash
cd /Volumes/data/Work/BalanceScore/Code
export LANG=en_US.UTF-8

# Clean iOS build
rm -rf ios/Pods ios/Podfile.lock ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/Code-*

# Clean Expo cache
rm -rf .expo
```

### 3. Rebuild from Symlink Path
```bash
# Ensure you're in the symlink path (no spaces)
cd /Volumes/data/Work/BalanceScore/Code
export LANG=en_US.UTF-8

# Prebuild
npx expo prebuild --platform ios --clean

# Build
npx expo run:ios
```

## Using npm Scripts

```bash
# From the original directory (it will use the build script)
cd "/Volumes/data/Work/Balance Score/Code"
npm run ios
```

## If Still Failing

The ReactCodegen script may need to be patched. Check the error message - if it shows:
```
/bin/sh: /Volumes/data/Work/Balance: No such file or directory
```

This means the path is still not being quoted. You may need to:
1. Manually edit the Xcode project to quote paths
2. Or move the project to a path without spaces (recommended long-term solution)

## Recommended Long-term Solution

Consider moving your project to a path without spaces:
```bash
mv "/Volumes/data/Work/Balance Score" "/Volumes/data/Work/BalanceScore"
```
