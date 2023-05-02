# Braun
>Icons just in time!

## Introduction

Braun is a Vite/Webpack plugin that makes it possible to serve icons statically on demand. It searches for icons names in modules source code and compiles them into a single SVG file during the build time. All design credits goes to [Iconscout](https://github.com/iconscout/unicons).

## Advantages

- It doesn't reflect on JavaScript bundle size
- A big project with a lot of icons will generate a SVG file as small as some few kilobytes
- As icons are referenced directly through svg tag you have the freedom to stylize paths

## Usage

### Vite

```typescript
import defineConfig from 'vite'
import braun from 'braun/vite'

export default defineConfig({
  plugins: [
    braun({
      tag: 'icon',
      ensureList: [
        'user',
        'settings'
      ],
      libraries: [
        'library-that-uses-braun-icons'
      ]
    })
  ]
})
```

### Webpack

First you need to make some additions in your webpack config file:

```typescript
const webpackConfig = {
  resolveLoader: {
    alias: {
      // make sure you have this alias set
      'icon-loader': 'braun/webpack-loader'
    }
  },
  module: {
    // then set up the loader after vue/babel/whatever else loader
    // (the order matters)
    rules: [
      {
        test: /(\.vue|router\.(t|j)s)$/,
        loader: 'icon-loader',
        options: {
          // what should we look for in the source files?
          // in this example we would be using something like <c-icon name="user" /> in our source files
          tag: 'icon',
          // those are always moved
          // this is useful when icon names arent present as literals in files
          ensureList: [
            'user',
            'settings'
          ]
        }
      },
    ]
  },
  plugins: [
    // not required
    // use this to emit a preload script
    new require('braun/webpack').Plugin()
  ]
}
```

### The component

Next, all you have to do is create your icon component according to your application needs. We gonna be using Vue in this example but it really doesn't matter, you could be using React or anything else, including pure HTML5.

```vue
<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <use :href="`/assets/icons.svg#${variant}/${name}`"></use>
  </svg>
</template>

<script setup>
defineProps({
  variant: String,
  name: String
})
</script>
```

### Preloading

This loader emits a preloading script that you can include in your root HTML to ensure a smoother user experience.
```html
<script type="text/javascript" src="/preload-icons.js"></script>
```

## Available icons

Please head to [https://ringeringeraja.github.io/braun/](https://ringeringeraja.github.io/braun/).

## Credits
This project was inspired by [Vue Unicons](https://github.com/antonreshetov/vue-unicons). The icons itself were designed by [Iconscout](https://github.com/iconscout/unicons).
