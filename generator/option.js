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
    for (const [prop] of this.dependencies) {
      this.dependencies.set(prop, await resolvePkgVersion(prop))
    }
    for (const [prop] of this.devDependencies) {
      this.devDependencies.set(prop, await resolvePkgVersion(prop))
    }
  }

  extendDependcy() {
    const devDependencies = {}
    const dependencies = {}
    Object.assign(devDependencies, Object.fromEntries(this.devDependencies))
    Object.assign(dependencies, Object.fromEntries(this.dependencies))
    return {
      devDependencies,
      dependencies,
    }
  }
}

module.exports = {
  Options,
}
