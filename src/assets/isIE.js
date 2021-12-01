module.exports = function (mixin, size) {
    console.log('>>>>', size, mixin);
    return {
        '.is-ie &' : {
            '@mixin-content': {}
        }
    }
}

