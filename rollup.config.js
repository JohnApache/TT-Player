import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import common from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';


const GenRollupConfig = task => {
    const {
        input,
        output,
        format,
        name,
        packageName,
        useBabel,
    } = task;
    return {
        input  : input,
        plugins: [
            postcss({
                extract : false,
                modules : false,
                minimize: false,
                plugins : [
                    autoprefixer({
                        env                 : 'production',
                        grid                : 'autoplace',
                        overrideBrowserslist: [ 'last 2 version' ],
                    }),
                ],
            }),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: 'ES2015',
                        target: 'ES2015',
                        outDir: path.resolve(__dirname, `packages/${ packageName }/lib`),

                        // rootDir: path.resolve(__dirname, `packages/${ packageName }/src`),
                        rootDirs: [ path.resolve(__dirname, `packages/*/src`) ],

                        paths: null,
                    },
                    include: [ `packages/${ packageName }/src/*.ts` ],
                },
            }),
            resolve({
                mainFields: [
                    'browser',
                    'module',
                    'main',
                ],

                // customResolveOptions: { moduleDirectory: 'node_modules' },
                browser: true, // 适配需要加载browser 模块的包
            }),
            json(),
            useBabel && babel({
                runtimeHelpers: true,
                extensions    : [
                    '.js',
                    '.ts',
                ],
            }),
            common({
                include: [
                    './node_modules/**',
                    `./packages/${ packageName }/node_modules/**`,
                ], // 包括
                exclude   : [],  // 排除
                extensions: [
                    '.js',
                    '.ts',
                ],
            }),
            replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
        ],
        output: {
            file     : output,
            format   : format,
            name     : name,
            compact  : false,
            banner   : '/* Created By @dking/hasaki-cli */',
            footer   : '/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */',
            extend   : false,
            sourcemap: false,
        },
        treeshake: { moduleSideEffects: true },
    };
};

const USE_BABEL = true;

const Packages = [
    'utils',
    'core',
    'video',
    'video-play-button',
    'ttplayer',
];

const PascalCase = str => {
    const regex = /-(\w)/g;
    const newStr = str.replace(regex, (match, group1) => group1.toUpperCase());
    return newStr.charAt(0).toUpperCase() + newStr.slice(1);
};

const GenTask = (packageName, isEsm) => ({
    packageName: packageName,
    input      : path.resolve(__dirname, `packages/${ packageName }/src/index.ts`),
    output     : path.resolve(__dirname, `packages/${ packageName }/lib/index${ isEsm ? '.esm' : '' }.js`),
    name       : `TTPlayer${ PascalCase(packageName) }`,
    format     : isEsm ? 'es' : 'umd',
    useBabel   : USE_BABEL && !isEsm,
});

const BuildTasks = Packages.reduce((prev, cur) => {
    const esmTask = GenTask(cur, true);
    const umdTask = GenTask(cur, false);

    prev.push(GenRollupConfig(esmTask));
    if (cur === 'ttplayer') {
        prev.push(GenRollupConfig(umdTask));
    }

    // prev.push(GenRollupConfig(umdTask));
    return prev;
}, []);


export default BuildTasks;
