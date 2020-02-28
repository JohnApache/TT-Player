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
                extract : true,
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

                        rootDir: path.resolve(__dirname, `packages/${ packageName }/src`),

                        // rootDirs: [ path.resolve(__dirname, `packages/*/src`) ],

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
    // 'utils',
    // 'core',
    // 'svg-icons',
    // 'video',
    // 'video-play-button',
    // 'video-control',
    {
        name   : 'ttplayer',
        libName: 'TTPlayer',
        umd    : true,
        esm    : false,
    },

    // 'resize-svg-path-by-viewbox',
];

const PascalCase = str => {
    const regex = /-(\w)/g;
    const newStr = str.replace(regex, (match, group1) => group1.toUpperCase());
    return newStr.charAt(0).toUpperCase() + newStr.slice(1);
};

const GenTask = pkgInfo => {
    const {
        packageName, isEsm, libName,
    } = pkgInfo;

    const LibraryName = libName && libName.length > 0 ? PascalCase(libName) : `TTPlayer${ PascalCase(packageName) }`;

    return {
        packageName: packageName,
        input      : path.resolve(__dirname, `./packages/${ packageName }/src/index.ts`),
        output     : path.resolve(__dirname, `./packages/${ packageName }/lib/index${ isEsm ? '.esm' : '' }.js`),
        name       : LibraryName,
        format     : isEsm ? 'es' : 'umd',
        useBabel   : USE_BABEL && !isEsm,
    };
};

const BuildTasks = Packages.reduce((prev, cur) => {

    let packageName = '';
    let libName = ''; // umd格式库名
    let BuildESMTask = true; // 是否开启监视 输出 esm 模式任务
    let BuildUMDTask = false; // 是否开启监视 输出 umd 模式任务

    if (typeof cur === 'string') {
        packageName = cur.trim();
    } else {
        packageName = cur.name.trim();
        libName = cur.libName.trim();
        BuildESMTask = typeof cur.esm === 'undefined' ? true : !!cur.esm;
        BuildUMDTask = typeof cur.umd === 'undefined' ? false : !!cur.umd;
    }

    const pkgOption = {
        packageName: packageName,
        libName    : libName,
    };

    if (BuildESMTask) {
        const esmTask = GenTask({ ...pkgOption, isEsm: true });
        prev.push(GenRollupConfig(esmTask));
    }

    if (BuildUMDTask) {
        const umdTask = GenTask({ ...pkgOption, isEsm: false });
        prev.push(GenRollupConfig(umdTask));
    }

    return prev;
}, []);


export default BuildTasks;
