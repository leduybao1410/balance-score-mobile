const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);
// Add resolver configuration to support TypeScript path mapping
config.resolver.alias = {
    '@': path.resolve(__dirname),
    app: path.resolve(__dirname, 'app'),
    '@/component': path.resolve(__dirname, 'component'),
    '@/constant': path.resolve(__dirname, 'constant'),
    '@/utils': path.resolve(__dirname, 'utils'),
};

// Add font file extensions
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');

config.transformer = {
    ...config.transformer,
};

module.exports = withNativeWind(config, { input: './global.css' });
