# iOS Build Fix for Paths with Spaces

## Problem
The project path contains spaces (`/Volumes/data/Work/Balance Score/Code`), which causes React Native's codegen build scripts to fail because paths are not properly quoted in shell scripts.

## Solution Applied

### 1. Symlink Created
A symlink has been created at `/Volumes/data/Work/BalanceScore/Code` (without spaces).

### 2. Xcode Environment Configuration
Updated `ios/.xcode.env.local` to use the symlink path:
```bash
export REACT_NATIVE_PATH="/Volumes/data/Work/BalanceScore/Code/node_modules/react-native"
export LANG=en_US.UTF-8
```

### 3. Build Script
Use the provided build script:
```bash
npm run ios
```

Or manually:
```bash
cd /Volumes/data/Work/BalanceScore/Code
export LANG=en_US.UTF-8
npx expo run:ios
```

## If Build Still Fails

The ReactCodegen script may still reference the original path. To fix:

1. **Clean and rebuild from symlink:**
   ```bash
   cd /Volumes/data/Work/BalanceScore/Code
   export LANG=en_US.UTF-8
   rm -rf ios/Pods ios/Podfile.lock ios/build
   npx expo prebuild --platform ios --clean
   npx expo run:ios
   ```

2. **Check Xcode project settings:**
   - Open `ios/Code.xcworkspace` in Xcode
   - Go to Build Settings
   - Search for `REACT_NATIVE_PATH`
   - Ensure it uses the symlink path (or is properly quoted)

3. **Alternative: Patch React Native scripts**
   If the above doesn't work, you may need to patch the React Native codegen scripts to properly quote paths. This can be done with `patch-package`.

## Important Notes

- **Always build from the symlink path**: `/Volumes/data/Work/BalanceScore/Code`
- **Set encoding**: `export LANG=en_US.UTF-8` before building
- **Use the build script**: `npm run ios` which handles this automatically
