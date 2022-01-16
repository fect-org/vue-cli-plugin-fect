module.exports = async (api, opts, rootOptions) => {
  const { Options } = require('./option')

  const options = new Options(opts)
  options.injectDependcy()
  await options.setDependcyVersion()

  const { dependencies, devDependencies } = options.extendDependcy()

  api.extendPackage({ dependencies, devDependencies })

  // Babel 按需引入
  if (opts.partialImportType === 'babel') {
    if (options.useFectIcon) {
      api.render({
        './babel.config.js': './templates/babel-icon.js',
        './src/App.vue': './templates/App.vue',
      })
      return
    }
    api.render({
      './babel.config.js': './templates/babel.config.js',
      './src/App.vue': './templates/App.vue',
    })
    return
  }

  // to do for icon plugin.
  // const inejctImportIcon = opts.useFectIcon ? `import FectIcon from '@fect-ui/vue-icons'` : ''

  // api.injectImports(api.entryFile, `import createFect from './plugins/fect'`)

  api.render({
    './src/plugins/fect.js': './templates/plugins/fect.js',
    './src/App.vue': './templates/App.vue',
  })

  api.afterInvoke(() => {
    const { EOL } = require('os')
    const fs = require('fs')
    const contentMain = fs.readFileSync(api.resolve(api.entryFile), {
      encoding: 'utf-8',
    })
    const lines = contentMain.split(/\r?\n/g)

    const renderIndex = lines.findIndex((line) => line.match(/createApp\(App\)(\.use\(\w*\))*\.mount\('#app'\)/))
    const renderContent = lines[renderIndex]
    lines[renderIndex] = `const app = createApp(App)`
    lines[renderIndex + 1] = `createFect(app)`
    lines[renderIndex + 2] = renderContent.replace('createApp(App)', 'app')

    fs.writeFileSync(api.resolve(api.entryFile), lines.join(EOL), {
      encoding: 'utf-8',
    })
  })
}
