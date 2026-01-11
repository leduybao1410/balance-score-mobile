#!/bin/bash
# Build script that handles paths with spaces
export LANG=en_US.UTF-8

# Use symlink path to avoid space issues
SYMLINK_PATH="/Volumes/data/Work/BalanceScore/Code"
ORIGINAL_PATH="/Volumes/data/Work/Balance Score/Code"

# Check if symlink exists, if not create it
if [ ! -e "$SYMLINK_PATH" ] && [ -d "$ORIGINAL_PATH" ]; then
    echo "Creating symlink at $SYMLINK_PATH"
    ln -sf "$ORIGINAL_PATH" "$SYMLINK_PATH"
fi

# Change to symlink path and run build
cd "$SYMLINK_PATH" || exit 1

echo "Building from symlink path: $(pwd)"

# Ensure pods are installed from symlink path
if [ -d "ios" ]; then
    cd ios
    export LANG=en_US.UTF-8
    pod install
    cd ..
fi

# Run the iOS build
npx expo run:ios "$@"
