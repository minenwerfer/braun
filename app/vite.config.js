const vue = require('@vitejs/plugin-vue')
const braun = require('../dist/vite').default
const catalog = require('./catalog.json')

const ensureList = catalog.map((icon) => `${icon.style}:${icon.name}`)

module.exports = {
  plugins: [
    vue(),
    braun({
      tag: 'icon',
      ensureList
    })
  ]
}
