module.exports = function (api) {
  api.cache(true);
  let plugins = [
    [
      'module-resolver',
      {
        root: ['./'], // base folder
        alias: {
          '@': './',
          '@/component': './component',
          '@/constant': './constant',
          '@/utils': './utils',
          '@/libs': './libs',
        },
      },
    ],
    'react-native-reanimated/plugin', // Must be listed last
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
