import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import favicon from 'vite-plugin-favicon2'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    favicon({
      logo: './public/logo.svg',
      inject: true,
      favicons: {
        appName: 'Dashboard',
        appShortName: 'Dash',
        appDescription: 'Dashboard built with Preact',
        theme_color: '#0f172a',
        icons: {
          coast: false,
          yandex: false,
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

})
