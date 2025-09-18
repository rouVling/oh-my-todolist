import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    // build: {
    //   rollupOptions: {
    //     external: ['node:sqlite'], // Add node:sqlite to external dependencies
    //   }
    // }
    build: {
      rollupOptions: {
        external: ['sqlite3', 'fastmcp'], // 在这里添加 sqlite3
        output: {
          // format: 'es'
        }
      },
    },
  },
  preload: {
    build: {
      lib: {
        entry: [
          resolve(__dirname, 'src/preload/index.ts'),
          resolve(__dirname, 'src/preload/float.ts')
        ],
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/index.html'),
          gantt: resolve(__dirname, 'src/renderer/gantt.html'),
        }
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
