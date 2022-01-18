module.exports = async (api, opts, rootOptions) => {
  const { Options } = require('./option')

  const options = new Options(opts)
  options.injectDependcy()
  await options.setDependcyVersion()

  const { dependencies, devDependencies } = options.extendDependcy()

  api.extendPackage({ dependencies, devDependencies })

  const injectPartialTheme = () => api.injectImports(api.entryFile, '@fect-ui/themes;')

  // Babel 按需引入
  if (opts.partialImportType === 'babel') {
    injectPartialTheme()
    api.render({
      './babel.config.js': opts.useFectIcon ? './templates/babel-icon.js' : './templates/babel.config.js',
      './src/App.vue': './templates/App.vue',
    })
  } else {
    if (opts.importType === 'full') {
      if (opts.useFectIcon) {
        api.injectImports(api.entryFile, `import FectUI from '@fect-ui/vue';import FectIcon from '@fect-ui/vue-icons';`)
      } else {
        api.injectImports(api.entryFile, `import @fect-ui/vue/lib/main.css;`)
        api.injectImports(api.entryFile, `import FectUI from '@fect-ui/vue';`)
      }
    }

    if (opts.partialImportType === 'Manual' && !opts.useFectIcon) {
      api.injectImports(
        api.entryFile,
        `
        ${injectPartialTheme()}
        import { Button } from '@fect-ui/vue';
        import '@fect-ui/vue/es/button/style/index';`
      )
    }

    if (opts.partialImportType === 'Manual' && opts.useFectIcon) {
      api.injectImports(
        api.entryFile,
        `
        ${injectPartialTheme()}
        import { Button } from '@fect-ui/vue';
        import '@fect-ui/vue/es/button/style/index';
        import { Github } from '@fect-ui/vue-icons';`
      )
    }
    api.render({
      './src/App.vue': './templates/App.vue',
    })
  }

  api.afterInvoke(async () => {
    const { EOL } = require('os')
    const { default: parser } = require('parse-imports')

    const fs = require('fs')
    const contentMain = fs.readFileSync(api.resolve(api.entryFile), {
      encoding: 'utf-8',
    })
    const imports = [...(await parser(contentMain))]
    let ipt = []
    imports.forEach((_) => {
      if (!_.importClause.default) return
      if (_.importClause.default.includes('Fect')) ipt.push(_.importClause.default)
    })
    const lines = contentMain.split(/\r?\n/g)
    const renderIndex = lines.findIndex((line) => line.match(/createApp\(App\)(\.use\(\w*\))*\.mount\('#app'\)/))
    const renderContent = lines[renderIndex]
    const mount = renderContent.match(/\.mount(.+)/g)[0]

    lines[renderIndex] = renderContent
      .replace(/\.mount(.+)/g, (_) => ipt.map((_) => `.use(${_})`).join(''))
      .concat(mount)

    fs.writeFileSync(api.resolve(api.entryFile), lines.join(EOL), {
      encoding: 'utf-8',
    })
  })
}
