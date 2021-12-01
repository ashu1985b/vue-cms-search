const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const postcss = require('postcss');
const path = require('path');
module.exports = {
  syntax: 'postcss',
  plugins: [
    require('postcss-import'),
    // tailwindcss,
    require('postcss-each'),
    require('postcss-mixins')({
      // mixinsDir: path.join(__dirname, './src/assets/mixins'),
      mixins: {
        loopMap: function (mixin, map, prop) {
          const arr = map.replace(/[\s()]/g,'').split(',');
          const obj = {}
          arr.forEach(function(i) {
            let p = i.split(':');
            if (i && p.length === 2 ) {
              obj['&'+ p[0]] = {[prop]: p[1]};
            }
          });
          return obj
        }
      }
    }),
    require('postcss-simple-vars'),
    require('postcss-color-function'),
    require('postcss-calc'),
    require('postcss-nested'),
    autoprefixer,
  ],
};