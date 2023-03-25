const vue = require('@vitejs/plugin-vue')
const braun = require('../dist/vite').default

module.exports = {
  plugins: [
    vue(),
    braun({
      tag: 'icon'
    })
  ]
}
