const latestVersion = require("latest-version");

const FECT_VUE = "@fect-ui/vue";

const BABEL_PLUGIN_IMPORT = "babel-plugin-import";

const resolvePkgVersion = async (pkg) => {
  const lastest = await latestVersion(pkg);
  return {
    [pkg]: lastest,
  };
};

module.exports = async (api, opts, rootOptions) => {
  api.extendPackage({
    dependencies: await resolvePkgVersion(FECT_VUE),
  });

  // Babel 按需引入
  if (opts.importType === "partial" && opts.partialImportType === "babel") {
    api.extendPackage({
      devDependencies: await resolvePkgVersion(BABEL_PLUGIN_IMPORT),
    });

    api.render({
      "./babel.config.js": "./templates/babel.config.js",
      "./src/App.vue": "./templates/App.vue",
    });
  } else {
    api.injectImports(api.entryFile, `import createFect from './plugins/fect'`);

    api.render({
      "./src/plugins/fect.js": "./templates/plugins/fect.js",
      "./src/App.vue": "./templates/App.vue",
    });

    api.afterInvoke(() => {
      const { EOL } = require("os");
      const fs = require("fs");
      const contentMain = fs.readFileSync(api.resolve(api.entryFile), {
        encoding: "utf-8",
      });
      const lines = contentMain.split(/\r?\n/g);

      const renderIndex = lines.findIndex((line) =>
        line.match(/createApp\(App\)(\.use\(\w*\))*\.mount\('#app'\)/)
      );
      const renderContent = lines[renderIndex];
      lines[renderIndex] = `const app = createApp(App)`;
      lines[renderIndex + 1] = `createFect(app)`;
      lines[renderIndex + 2] = renderContent.replace("createApp(App)", "app");

      fs.writeFileSync(api.resolve(api.entryFile), lines.join(EOL), {
        encoding: "utf-8",
      });
    });
  }
};
