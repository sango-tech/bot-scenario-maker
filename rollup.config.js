import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');

const banner = `/*! ${pkg.name} v${pkg.version} - ${pkg.author} | ${
  pkg.license
} License */`;

export default {
  input: 'src/index.ts',
  output: {
    name: 'Sango',
    file: './cdn/public/js/sango.bot-flows-maker.js',
    format: 'umd',
    banner,
  },
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      objectHashIgnoreUnknownHack: true,
      sourceMap: false,
    }),
    postcss({
      plugins: []
    }),
    commonjs({
      include: 'node_modules/**',
      dynamicRequireTargets: [
        'node_modules/plain-draggable/plain-draggable.min.js'
      ]
    }),
    resolve({}),
  ],
};
