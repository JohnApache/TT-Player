const presets = [[ '@babel/env' ]];

const plugins = [
    [
        '@babel/plugin-transform-runtime',
        { corejs: 3 },
    ],
];

const ignore = [
    'node_modules/**',
    'packages/*/node_modules/**',
];


module.exports = {
    presets,
    plugins,
    ignore,
};
