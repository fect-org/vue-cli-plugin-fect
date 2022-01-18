module.exports = async (api, opts, rootOptions) => {
  const { Options } = require('./option')

  const options = new Options(opts)
  options.injectDependcy()
  await options.setDependcyVersion()

  const { dependencies, devDependencies } = options.extendDependcy()

  api.extendPackage({ dependencies, devDependencies })

  // Babel 按需引入
  const renders = { './src/App.vue': './templates/App.vue', './src/main.js': './templates/entry.js' }

  if (opts.partialImportType === 'babel') {
    renders['./babel.config.js'] = opts.useFectIcon ? './templates/babel-icon.js' : './templates/babel.config.js'
  }
  api.render(renders)

  api.afterInvoke(async () => {
    const { EOL } = require('os')
    const { default: parser } = require('parse-imports')

    const fs = require('fs')
    const contentMain = fs.readFileSync(api.resolve(api.entryFile), {
      encoding: 'utf-8',
    })
    const imports = [...(await parser(contentMain))]
    let ipt = []
    if (opts.partialImportType === 'manual') {
      imports.forEach((_) => {
        if (_.moduleSpecifier.code.includes('fect') && _.importClause.named.length) {
          ipt.push(_.importClause.named[0].specifier)
        }
      })
    } else {
      imports.forEach((_) => {
        if (!_.importClause.default) return
        if (_.importClause.default.includes('Fect')) ipt.push(_.importClause.default)
      })
    }

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
