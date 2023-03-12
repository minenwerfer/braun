import webpack from 'webpack'

const preloadScript = (iconNames: Array<string>) =>
`"${iconNames.join(' ')}".split(' ').forEach((iconName) => {
  const img = new Image()
  const [style, filename] = iconName.includes(':')
    ? iconName.split(':')
    : ['line', iconName]

  img.src = '/static/icons/' + style + '/' + filename + '.svg'
})
`

export default class {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('Braun', (compilation) => {
      compilation.hooks.finishModules.tap('Braun', () => {
        const iconNames = [ ...global.braun__gatheredIcons ]
        if( iconNames.length === 0 ) {
          return
        }

        compilation.emitAsset(
          'preload-script.js',
          new webpack.sources.RawSource(preloadScript(iconNames))
        )
      })
    })
  }
}
