module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: '@fect-ui/vue',
        libraryDirectory: 'lib',
        style: (name) => `${name}/style/index`,
      },
    ],
  ],
};
