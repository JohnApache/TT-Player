import del from 'del';

const deletePaths = del.sync('packages/*/lib');

deletePaths.forEach(path => {
    console.log('[DELETED]:', path);
});
