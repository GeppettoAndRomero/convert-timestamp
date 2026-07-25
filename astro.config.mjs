import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'static',
  // slug-first 名前空間: ツールを runlocally.app/convert-timestamp/ 配下に「物理配置」する
  // （src/pages/convert-timestamp/ + public/convert-timestamp/）。base は使わない（base は URL に
  // prefix を付けるが dist を入れ子化せず、ルート配信の Pages と不整合になるため）。
  // バンドルアセットも /convert-timestamp/_assets/ に隔離し hub/他ツールと無衝突にする。
  build: {
    inlineStylesheets: 'auto',
    assets: 'convert-timestamp/_assets',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    // No Web Worker, no WASM: parsing a timestamp / formatting a Date with
    // native `Date` and `Intl.RelativeTimeFormat` is fast, synchronous,
    // main-thread work (confirmed scope, issue #74) — there is no codec step
    // to offload here, unlike the image-conversion tools this was stamped from.
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['preact', 'preact/hooks']
          }
        }
      }
    }
  },
  compressHTML: true,
  scopedStyleStrategy: 'class'
});
