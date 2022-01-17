const latestVersion = require('latest-version')

const PACKAGES = {
  FECT_VUE: '@fect-ui/vue',
  FECT_VUE_ICON: '@fect-ui/vue-icons',
  BABEL_PLUGIN_IMPORT: 'babel-plugin-import',
}

const resolvePkgVersion = async (pkg) => {
  const lastest = await latestVersion(pkg)
  return `^${lastest}`
}

class Options {
  constructor(opts) {
    this.options = opts
    this.devDependencies = new Map()
    this.dependencies = new Map()
  }

  injectDependcy() {
    this.dependencies.set(PACKAGES.FECT_VUE)
    if (this.options.useFectIcon) {
      this.dependencies.set(PACKAGES.FECT_VUE_ICON)
    }
    if (this.options.importType === 'partial' && this.options.partialImportType === 'babel') {
      this.devDependencies.set(PACKAGES.BABEL_PLUGIN_IMPORT)
    }
  }

  async setDependcyVersion() {
    const reSetter = (meta) => {
      for (const [prop] of meta) {
        meta.set(prop, resolvePkgVersion(prop))
      }
    }
    await Promise.all([reSetter(this.dependencies), reSetter(this.devDependencies)])
  }

  extendDependcy() {
    const reAssign = (draft) => Object.assign({}, Object.fromEntries(draft))

    return {
      devDependencies: reAssign(this.devDependencies),
      dependencies: reAssign(this.dependencies),
    }
  }
}

module.exports = {
  Options,
}
