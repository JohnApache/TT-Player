import { TTPlayerLoading, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoLoading extends TTPlayerLoading<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    renderLoading () {
        this.root
            .html('加载中')
            .show();
    }

    hideLoading () {
        this.root.hide();
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('loading--text');
    }

}
export default TTVideoLoading;
