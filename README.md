# Braun
>Serve icons over network for your frontend project

## Introduction

Braun is a lightweight Webpack loader that makes it possible to serve icons statically on demand. It searches for icons names in modules source code and moves them to a static folder during the build time. All design credits goes to [Iconscout](https://github.com/iconscout/unicons).

## Advantages

- It doesn't reflect on bundle size
- You don't have to move all icons at once
- Direct referencing icons makes browser caching better
- Icons are inline SVGs, so you can modify them as you want

## Basic usage
```typescript
const webpackConfig = {
  resolveLoader: {
    alias: {
      // make sure you have this alias set
      'icon-loader': 'braun/dist/loader'
    }
  },
  module: {
    // then set up the loader after vue-loader
    // (the order matters)
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              reactivityTransform: true
            }
          },
          {
            loader: 'icon-loader',
            options: {
              // what should we look for in the source files?
              // in this example we would be using something like <sv-icon name="user" />
              tag: 'sv-icon',
              // those are always moved
              // this is useful when icon names arent present as literals in files
              ensureList: [
                'user',
                'settings'
              ]
            }
          }
        ]
      },
    }
}
```

## Available icons

Please head to https://antonreshetov.github.io/vue-unicons/.

## Credits
This project was inspired by [Vue Unicons](https://github.com/antonreshetov/vue-unicons). The icons itself were designed by [Iconscout](https://github.com/iconscout/unicons).
