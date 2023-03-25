# Braun
>Icons just in time!

## Introduction

Braun is a lightweight Webpack loader that makes it possible to serve icons statically on demand. It searches for icons names in modules source code and moves them to a static folder during the build time. All design credits goes to [Iconscout](https://github.com/iconscout/unicons).

## Advantages

- It doesn't reflect on bundle size
- You don't have to move all icons at once
- Direct referencing icons makes browser caching better
- Icons are inline SVGs, so you can modify them as you want
- Much less network usage than icon fonts

## Usage

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
      ]
    })
  ]
})
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
    <use :href="`/static/icons/${variant}/${name}.svg#root`"></use>
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

Please head to https://antonreshetov.github.io/vue-unicons/.

## Credits
This project was inspired by [Vue Unicons](https://github.com/antonreshetov/vue-unicons). The icons itself were designed by [Iconscout](https://github.com/iconscout/unicons).
