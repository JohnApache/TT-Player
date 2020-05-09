import { TTPlayerError, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoError extends TTPlayerError<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    renderError () {
        this.root
            .html('视频加载失败')
            .show();
    }

    hideError () {
        this.root.hide();
    }

    beforeRender () {
        this.root.addClass('error--text');
    }

}

export default TTVideoError;
