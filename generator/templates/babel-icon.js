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
    ['import', { libraryName: '@fect-ui/vue-icons', libraryDirectory: 'es' }, '@fect-ui/vue-icons'],
  ],
}
