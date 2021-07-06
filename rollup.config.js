import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'index.ts',
    plugins: [typescript(), resolve()],
    treeshake: false,
    output: [
      {
        format: 'esm',
        // dir: 'build',
        // inlineDynamicImports: true,
        // file: 'build/three-js-wrap.module.js',
        dir: 'build',
        exports: 'named'
      }
    ]
  }
];
