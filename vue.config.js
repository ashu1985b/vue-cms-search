/* vue.config.js */
const path = require('path')
const svgIconsDirPath = './src/assets/images/svg-icons';

module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('postcss').oneOf(type)));
    configSVGIcon(config);
  },
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/_partials.css'),
      ]
    })
}

function configSVGIcon(config) {
  // Exclude SVG sprite directory from default svg rule 
  config.module
    .rule('svg')
    .exclude.add(path.resolve(__dirname, svgIconsDirPath))
    .end();
  
  // Options used by svgo-loader to optimize SVG files
  // https://github.com/svg/svgo#what-it-can-do
  const options = {
      "plugins": [
        { "cleanupAttrs": true },
        { "cleanupEnableBackground": true },
        { "cleanupIDs": true },
        { "cleanupListOfValues": true },
        { "cleanupNumericValues": true },
        { "collapseGroups": true },
        { "convertColors": true },
        { "convertPathData": true },
        { "convertShapeToPath": true },
        { "convertStyleToAttrs": true },
        { "convertTransform": true },
        { "mergePaths": true },
        { "removeComments": true },
        { "removeDesc": true },
        { "removeDimensions": true },
        { "removeDoctype": true },
        { "removeEditorsNSData": true },
        { "removeEmptyAttrs": true },
        { "removeEmptyContainers": true },
        { "removeEmptyText": true },
        { "removeHiddenElems": true },
        { "removeMetadata": true },
        { "removeNonInheritableGroupAttrs": true },
        { "removeRasterImages": true },
        { "removeTitle": true },
        { "removeUnknownsAndDefaults": true },
        { "removeUselessDefs": true },
        { "removeUnusedNS": true },
        { "removeUselessStrokeAndFill": true },
        {
          "removeAttrs": { "attrs": "fill"}
        },
        { "removeXMLProcInst": true },
        { "removeStyleElement": true },
        { "removeUnknownsAndDefaults": true},
        { "sortAttrs": true }
      ]
    };
  
  // Include only SVG sprite directory for new svg-icon rule
  // Use svg-sprite-loader to build SVG sprite
  // Use svgo-loader to optimize SVG files
  config.module
    .rule('svg-icon')
    .test(/\.svg$/)
    .include.add(path.resolve(__dirname, svgIconsDirPath))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]',
    })
    .end()
    .use('svgo-loader')
    .loader('svgo-loader')
    .options(options)
    .end();
}
