const postcss = require('postcss');

module.exports = function (mixin) {
    let rule = postcss.rule({ selector: '&:hover, &.hover' });
    rule.append(mixin.nodes);
    mixin.replaceWith(rule);
}