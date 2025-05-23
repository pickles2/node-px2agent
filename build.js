import { rollup } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import { rimraf } from 'rimraf';
import fs from 'fs';
import path from 'path';

async function build() {
  // 古いビルドを削除
  await rimraf('./dist');
  
  // TypeScriptビルドでd.tsファイルを生成
  // 最初のビルドで型定義ファイルを生成
  const typeBundle = await rollup({
    input: './src/px2agent.ts',
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
          }
        }
      })
    ],
    external: ['child_process', 'path', 'fs']
  });

  await typeBundle.write({
    file: './dist/px2agent.mjs',
    format: 'es',
    sourcemap: true
  });

  // ESM向けビルド
  const esmBundle = await rollup({
    input: './src/px2agent.ts',
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          }
        }
      })
    ],
    external: ['child_process', 'path', 'fs']
  });

  await esmBundle.write({
    file: './dist/px2agent.mjs',
    format: 'es',
    sourcemap: true
  });

  // CommonJS向けビルド
  const cjsBundle = await rollup({
    input: './src/px2agent.ts',
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          }
        }
      })
    ],
    external: ['child_process', 'path', 'fs']
  });

  await cjsBundle.write({
    file: './dist/px2agent.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'auto'
  });

  console.log('** Build completed successfully!' + "\n\n");
}

build().catch(e => {
  console.error(e);
  process.exit(1);
});