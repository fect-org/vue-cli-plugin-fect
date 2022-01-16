module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: '@fect-ui/vue',
        libraryDirectory: 'es',
        style: (name) => `${name}/style/index`,
      },
      '@fect-ui/vue',
    ],
  ],
}
