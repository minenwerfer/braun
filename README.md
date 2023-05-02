# Braun
>On-demand inline SVG icons!

## Introduction

Braun is a Vite/Webpack plugin that makes it possible to serve icons statically on demand. It searches for icons names in modules source code and compiles them into a single SVG file during the build time. All design credits goes to [Iconscout](https://github.com/iconscout/unicons).

## Advantages

- It doesn't reflect on JavaScript bundle size
- A big project with a lot of icons will generate a SVG file as small as some few kilobytes

## Usage

### Configuration

```typescript
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
   * (in webpack you must use a custom module.rules property to emulate this prop).
   */
  libraries?: Array<string>
  /**
   * Lets user execute custom logic before emitting output.
   * A common use case is to search for icons outside conventional files.
   * (currently unsupported in Webpack).
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
```

### Vite

```typescript
import defineConfig from 'vite'
import braun from 'braun/vite'

export default defineConfig({
  plugins: [
    braun({
      // ...
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
          // ...
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
    <use :href="`/assets/icons.svg#${variant}:${name}`"></use>
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
