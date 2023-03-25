import type { Plugin } from 'vite'
import { mkdir, readFile, writeFile, copyFile } from 'fs/promises'
import { Options, scrapper, icons, preloadScript } from './common'

export default (options: Options = {}): Plugin => ({
  name: 'braun',
  configureServer(server) {
    server.middlewares.use('/static/icons/', async (req, res, next) => {
      try {
        const content = await readFile(`${__dirname}/../icons${req.url}`)
        res.setHeader('content-type', 'image/svg+xml').end(content)

      } catch( e: any ) {
        next(e)
      }
    })
  },
  transform(source) {
    const scrap = scrapper(
      options,
      () => null,
      (error) => this.warn(error)
    )

    scrap(source)
    return {
      code: source
    }
  },
  async generateBundle() {
    icons.forEach(async (iconName) => {
      const [style, filename] = iconName.includes(':')
        ? iconName.split(':')
        : ['line', iconName]

      await mkdir(`dist/static/icons/${style}`, {
        recursive: true
      })

      try {
        await copyFile(
          `${__dirname}/../icons/${style}/${filename}.svg`,
          `dist/static/icons/${style}/${filename}.svg`
        )
      } catch( error: any ) {
        this.warn(error)
      }
    })

    const iconNames = [ ...icons ]
    if( iconNames.length === 0 ) {
      return
    }

    await writeFile('dist/preload-script.js', preloadScript(iconNames))
  }
})
