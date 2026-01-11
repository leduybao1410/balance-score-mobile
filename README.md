# React Native 0.79 with TypeScript & Expo Router

This project is set up with:
- **React Native**: 0.79.7
- **TypeScript**: ~5.9.2
- **Expo Router**: ^6.0.21
- **Expo SDK**: ~54.0.31

## Important: Path with Spaces

⚠️ **This project is located in a path with spaces** (`/Volumes/data/Work/Balance Score/Code`), which can cause build issues with React Native and CocoaPods.

### Solution

A symlink has been created at `/Volumes/data/Work/BalanceScore/Code` (without spaces) to work around this issue.

### Building for iOS

**Option 1: Use the build script (Recommended)**
```bash
npm run ios:symlink
```

**Option 2: Build from symlink path manually**
```bash
export LANG=en_US.UTF-8
cd /Volumes/data/Work/BalanceScore/Code
npx expo run:ios
```

**Option 3: Use npm script with encoding**
```bash
npm run ios
```

### Development

Start the development server:
```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator  
- `w` for web

### Project Structure

```
app/
├── _layout.tsx    # Root layout with Stack navigator
└── index.tsx      # Home screen

```

### Adding Routes

Create new files in the `app/` directory:
- `app/about.tsx` → `/about` route
- `app/profile/index.tsx` → `/profile` route

### Troubleshooting

If you encounter build errors related to paths:
1. Ensure you're using the symlink path: `/Volumes/data/Work/BalanceScore/Code`
2. Set encoding: `export LANG=en_US.UTF-8`
3. Clean and rebuild:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock build
   pod install
   ```
# balance-score-mobile
