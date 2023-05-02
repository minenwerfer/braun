import { readFile } from 'fs/promises'

export type Options = {
  /**
   * HTML tag to be searched for.
   */
  tag?: string
  /**
   * Ensure certain icons are always collected.
   * Useful when icons can't be found with assets search.
   */
  ensureList?: Array<string>
  /**
   * Will scrap DOM files in the specified libraries case set.
   */
  libraries?: Array<string>
  /**
   * Lets user execute custom logic before emitting output.
   * A common use case is to search for icons outside conventional files.
   */
  preEmit?: () => Promise<void>
  /**
   * Case set to true, compiles all collected icons to a single SVG.
   * Otherwise will output each icon in a separated SVG file.
   * (currently unsupported in Webpack).
   * @default true
   */
  pack?: boolean
}

export const defaultOptions: Partial<Options> = {
  tag: 'icon',
  pack: true
}

export type IconStyle =
  'line'
  | 'monochrome'
  | 'solid'
  | 'thinline'

const makeExpressions = (options: Options) => {
  const regexes = [
    new RegExp(`<${options.tag}[^>]*[^:]name="([^"]+)"`, 'mg'),
    /<[^>]*[^:]icon="([^"]+)"/mg,
    /icon: ?['"]([^'"]+)['"]/mg
  ]

  return regexes
}

/**
 * A global property meant to be shared across modules.
 * Set() will ensure uniqueness.
 */
export const icons = global.braun__gatheredIcons = new Set<string>()

/**
 * Outputs a small script to preload images.
 * Only appliable when options.pack is set to "false".
 */
export const preloadScript = (iconNames: Array<string>) => {
  return `"${iconNames.join(' ')}".split(' ').forEach((iconName) => {
    const img = new Image()
    const [style, filename] = iconName.includes(':')
      ? iconName.split(':')
      : ['line', iconName]

    img.src = '/assets/icons/' + style + '/' + filename + '.svg'
  })
  `
}

/**
 * Perform static search in DOM files to collect icons.
 * emitFn() is a function to emit the output as soon as it is collected (used in webpack).
 * errorCallback() handles exceptions.
 */
export const scrapper = (
  options: Options,
  emitFn: (newPath: string, content: string|Buffer) => void,
  errorCallback: (e: any) => void
) => (source: string) => {
  const shouldAdd = new Set<string>()
  const regexes = makeExpressions(options)

  if( options.ensureList && !icons.size ) {
    options.ensureList.forEach((iconName: string) => {
      shouldAdd.add(iconName)
    })
  }

  for( const regex of regexes ) {
    let match: Array<string>|null
    while( match = regex.exec(source) ) {
      const iconName = match[1]
      if( !icons.has(iconName) ) {
        shouldAdd.add(iconName)
      }
    }
  }

  shouldAdd.forEach(async (iconName) => {
    icons.add(iconName)
    const [style, filename] = iconName.includes(':')
      ? iconName.split(':')
      : ['line', iconName]

    try {
      const content = await readFile(`${__dirname}/../icons/${style}/${filename}.svg`)
      const newPath = `${__dirname}/../icons/${style}/${filename}.svg`
      emitFn(newPath, content)

    } catch( e: any ) {
      errorCallback(e)
    }
  })
}

/**
 * Compiles several icons into a single SVG.
 * Each one can later be requested with inline SVG tag specifying the symbol in the hashbang.
 */
export const packTogether = async (icons: Array<string>) => {
  const symbols = []
  for( const iconName of icons ) {
    const [style, filename] = iconName.includes(':')
      ? iconName.split(':')
      : ['line', iconName]

    const content = await readFile(`${__dirname}/../icons/${style}/${filename}.svg`)
    const icon = content.toString()
      .replace('<svg xmlns="http://www.w3.org/2000/svg"><symbol id="root">', '')
      .replace('</symbol></svg>', '')

    symbols.push(
      `<symbol id="${style}:${filename}">${icon}</symbol>`
    )
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>`
  return svg
}
