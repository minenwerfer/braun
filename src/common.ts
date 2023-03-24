import { readFile } from 'fs/promises'

export type Options = {
  tag?: string
  ensureList?: Array<string>
}

const icons = global.braun__gatheredIcons = new Set<string>()

export const preloadScript = (iconNames: Array<string>) =>
`"${iconNames.join(' ')}".split(' ').forEach((iconName) => {
  const img = new Image()
  const [style, filename] = iconName.includes(':')
    ? iconName.split(':')
    : ['line', iconName]

  img.src = '/static/icons/' + style + '/' + filename + '.svg'
})
`

export const scrapper = (
  options: Options,
  emitFn: (newPath: string, content: string|Buffer) => void,
  errorCallback: (e: any) => void
) => (source: string) => {
  const regexes = [
    new RegExp(`<${options.tag}[^>]*[^:]name="([^"]+)"`, 'mg'),
    /<[^>]*[^:]icon="([^"]+)"/mg,
    /icon: ?['"]([^'"]+)['"]/mg
  ]

  const shouldAdd = new Set<string>()

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
