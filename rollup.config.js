import pkg from "./package.json";
const babel = require("rollup-plugin-babel");

export default {
  input: "index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [
    babel({ exclude: /node_modules|dist|rollup.config.js/, sourceMaps: true }),
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
  ],
};
