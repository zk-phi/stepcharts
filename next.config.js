const withOptimizedClassnames = require("next-optimized-classnames");

module.exports = withOptimizedClassnames({
  pageExtensions: ["tsx"],
  basePath: "/stepcharts",
  trailingSlash: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
    ROOT_DOMAIN: "ddr.stepcharts.com",
  },
});
