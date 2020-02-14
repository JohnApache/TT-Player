import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import common from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';


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
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module : 'ES2015',
                        target : 'ES2015',
                        outDir : path.resolve(__dirname, `packages/${ packageName }/lib`),
                        rootDir: path.resolve(__dirname, `packages/${ packageName }/src`),
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
    prev.push(GenRollupConfig(umdTask));
    return prev;
}, []);


export default BuildTasks;
