import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import common from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import async from 'async';
import { watch } from 'rollup';

const USE_BABEL = true; // 是否使用babel

const GenRollupConfig = task => {
    const {
        input,
        output,
        format,
        name,
        packageName,
        useBabel,
        watchInclude = [],
        watchExclude = [],
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
                        outDir: path.resolve(__dirname, `../packages/${ packageName }/lib`),

                        rootDir: path.resolve(__dirname, `../packages/${ packageName }/src`),

                        // rootDirs: [ path.resolve(__dirname, `../packages/*/src`) ],

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
        watch    : {
            chokidar   : false,
            clearScreen: false,
            exclude    : watchExclude,
            include    : watchInclude,
        },
    };
};


const WatchPackages = [
    'utils',
    'core',
    'svg-icons',
    'video',
    'video-play-button',
    'video-control',
    {
        name   : 'ttplayer',
        libName: 'TTPlayer',
        esm    : false,
        umd    : true,
    },
];

const PascalCase = str => {
    const regex = /-(\w)/g;
    const newStr = str.replace(regex, (match, group1) => group1.toUpperCase());
    return newStr.charAt(0).toUpperCase() + newStr.slice(1);
};

const GenWatchTask = pkg => {

    const {
        packageName, isEsm, libName,
    } = pkg;

    const watchInclude = [ path.resolve(__dirname, `../packages/${ packageName }/src/**`) ];

    const watchExclude = [ path.resolve(__dirname, `../packages/${ packageName }/node_modules/**`) ];

    const LibraryName = libName && libName.length > 0 ? PascalCase(libName) : `TTPlayer${ PascalCase(packageName) }`;

    return {
        packageName : packageName,
        input       : path.resolve(__dirname, `../packages/${ packageName }/src/index.ts`),
        output      : path.resolve(__dirname, `../packages/${ packageName }/lib/index${ isEsm ? '.esm' : '' }.js`),
        name        : LibraryName,
        format      : isEsm ? 'es' : 'umd',
        useBabel    : USE_BABEL && !isEsm,
        watchInclude: watchInclude,
        watchExclude: watchExclude,
    };
};

async.eachSeries(WatchPackages, (pkg, callback) => {

    let packageName = '';
    let WatchESMTask = true; // 是否开启监视 输出 esm 模式任务
    let WatchUMDTask = false; // 是否开启监视 输出 umd 模式任务
    let libName = ''; // umd格式库名
    let flag = true; // 限制阀

    if (typeof pkg === 'string') {
        packageName = pkg.trim();
    } else {
        packageName = pkg.name.trim();
        libName = pkg.libName.trim();
        WatchESMTask = typeof pkg.esm === 'undefined' ? true : !!pkg.esm;
        WatchUMDTask = typeof pkg.umd === 'undefined' ? false : !!pkg.umd;
    }

    let esmTaskDone = !WatchESMTask;
    let umdTaskDone = !WatchUMDTask;

    if (!WatchESMTask && !WatchUMDTask) return callback();

    const pkgOption = {
        packageName: packageName,
        libName    : libName,
    };

    if (WatchESMTask) {
        const esmWatchTask = GenWatchTask({ ...pkgOption, isEsm: true });
        const esmWatcher = watch(GenRollupConfig(esmWatchTask));
        esmWatcher.on('event', event => {
            console.log(`[WATCH_LOG]: @dking/ttplayer-${ packageName } format: [ESM] EventCode: ${ event.code }`);

            if (flag && event.code === 'END') {
                esmTaskDone = true;
                if (esmTaskDone && umdTaskDone) {
                    flag = false;
                    callback();
                }
            }
            if (event.code === 'ERROR') {
                console.error(event.error);
            }
        });
    }

    if (WatchUMDTask) {
        const umdWatchTask = GenWatchTask({ ...pkgOption, isEsm: false });
        const umdWatcher = watch(GenRollupConfig(umdWatchTask));
        umdWatcher.on('event', event => {
            console.log(`[WATCH_LOG]: @dking/ttplayer-${ packageName } format: [UMD] EventCode: ${ event.code }`);

            if (flag && event.code === 'END') {
                umdTaskDone = true;
                if (esmTaskDone && umdTaskDone) {
                    flag = false;
                    callback();
                }
            }

            if (event.code === 'ERROR') {
                console.error(event.error);
            }
        });
    }

});


