import type { Plugin } from 'rollup'
import { Options, scrapper, preloadScript } from './common'

export default (options: Options = {}): Plugin => ({
  name: 'braun',
  transform(source) {
    const scrap = scrapper(options, (path, content) => {
      console.log(path)
      this.emitFile({
        type: 'asset',
        fileName: path,
        source: content
      })
    }, console.trace)

    scrap(source)
    return {
      code: source
    }
  },
})
