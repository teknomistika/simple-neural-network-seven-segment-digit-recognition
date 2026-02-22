import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs/promises'

import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import { compileTemplate } from 'vue/compiler-sfc'

/**
 * From https://github.com/jpkleemans/vite-svg-loader/blob/main/index.js
 */
const svgLoader: Plugin = {
  name: 'svg-loader',
  enforce: 'pre',
  async load(id: string) {
    if (!id.match(/\.svg$/)) {
      return
    }
    let svg = await fs.readFile(id, 'utf-8')
    svg = svg
      .replace(/<\?xml[^>]+>/, '')
      .replaceAll(/<!--.+-->/g, '').trimStart()
    // console.log(svg.split("\n").slice(0, 6))
    const { code } = compileTemplate({
      id: JSON.stringify(id),
      source: svg,
      filename: id,
      transformAssetUrls: false
    })
    return `${code}\nexport default { render: render }`
  }
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    // vueDevTools(),
    ViteFonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
    svgLoader,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
