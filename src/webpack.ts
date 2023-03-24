import webpack from 'webpack'
import { Options, scrapper, preloadScript } from './common'

export function loader(this: webpack.LoaderContext<Options>, source: string) {
  const loaderContext = this
  const scrap = scrapper(
    loaderContext.getOptions(),
    loaderContext.emitFile,
    loaderContext.emitError
  )

  scrap(source)
  loaderContext.callback(null, source)
}

export class Plugin {
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
