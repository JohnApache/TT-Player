import path from 'path';
import os from 'os';
import resolve from '@rollup/plugin-node-resolve';
import common from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';


const cpuNums = os.cpus().length;

const DEV_BUILD_CONFIG = {
    input  : path.resolve(__dirname, './src/index.ts'),
    plugins: [
        typescript({ tsconfigOverride: { compilerOptions: { module: 'ES2015' }}}),
        resolve({
            mainFields: [
                'module',
                'main',
            ],
            browser: false, // 适配需要加载browser 模块的包
        }),
        json(),
        common({
            include   : 'node_modules/**', // 包括
            exclude   : [],  // 排除
            extensions: [
                '.js',
                '.ts',
            ],
        }),
        replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    ],
    output: {
        // dir           : path.resolve(__dirname, 'lib'),
        format: 'umd',
        name  : 'TTPlayerVideo',
        file  : path.resolve(__dirname, 'lib/index.js'),

        // entryFileNames: '[name]-[format].js',
        // chunkFileNames: '[name]-[format].js',
        compact  : false,
        banner   : '/* Created By @dking/hasaki-cli */',
        footer   : '/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */',
        extend   : false,
        sourcemap: false,
    },
    treeshake: { moduleSideEffects: true },
};

const PROD_BUILD_TASK = {
    input  : path.resolve(__dirname, './src/index.ts'),
    plugins: [
        typescript({ tsconfigOverride: { compilerOptions: { module: 'ES2015' }}}),
        resolve({
            mainFields: [
                'module',
                'main',
            ],
            browser: false, // 适配需要加载browser 模块的包
        }),
        json(),
        common({
            include   : 'node_modules/**', // 包括
            exclude   : [],  // 排除
            extensions: [
                '.js',
                '.ts',
            ],
        }),
        replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
        terser({
            output    : { comments: false },
            include   : [ /^.+\.js$/ ],
            exclude   : [ 'node_moudles/**' ],
            numWorkers: cpuNums,
            sourcemap : false,
        }),
    ],
    output: {
        // dir           : path.resolve(__dirname, 'lib'),
        file  : path.resolve(__dirname, 'lib/index.min.js'),
        format: 'umd',
        name  : 'TTPlayerVideo',

        // entryFileNames: '[name]-[format].min.js',
        // chunkFileNames: '[name]-[format].min.js',
        compact  : false,
        banner   : '/* Created By @dking/hasaki-cli */',
        footer   : '/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */',
        extend   : false,
        sourcemap: false,
    },
    treeshake: { moduleSideEffects: true },
};

export default [
    DEV_BUILD_CONFIG,
    PROD_BUILD_TASK,
];
