import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss'

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
      sourceMap: false,
    }),
    postcss({
      plugins: []
    })
  ],
};
