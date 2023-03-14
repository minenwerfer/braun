import webpack from 'webpack'
import { readFile } from 'fs/promises'

export type LoaderOptions = {
  tag?: string
  ensureList?: Array<string>
}

const icons = global.braun__gatheredIcons = new Set<string>()

const emitFile = async (loaderContext: webpack.LoaderContext<LoaderOptions>, iconName: string) => {
  const [style, filename] = iconName.includes(':')
    ? iconName.split(':')
    : ['line', iconName]

  try {
    const content = await readFile(`${__dirname}/../icons/${style}/${filename}.svg`)
    return loaderContext.emitFile(`static/icons/${style}/${filename}.svg`, content)
  } catch( e ) {
    loaderContext.emitError(new Error(`icon ${iconName} not found`))
  }
}

export default function iconLoader(this: webpack.LoaderContext<LoaderOptions>, source: string) {
  const loaderContext = this

  const options = loaderContext.getOptions()
  const regexes = [
    new RegExp(`<${options.tag}[^>]*[^:]name="([^"]+)"`, 'mg'),
    /<[^>]*[^:]icon="([^"]+)"/mg,
    /icon: ?['"]([^'"]+)['"]/mg
  ]

  if( options.ensureList && !icons.size ) {
    options.ensureList.forEach((iconName: string) => {
      icons.add(iconName)
      emitFile(loaderContext, iconName)
    })
  }

  for( const regex of regexes ) {
    let match: Array<string>|null
    while( match = regex.exec(source) ) {
      const iconName = match[1]
      if( !icons.has(iconName) ) {
        icons.add(iconName)
        emitFile(loaderContext, iconName)
      }
    }
  }
  
  this.callback(null, source)
}
