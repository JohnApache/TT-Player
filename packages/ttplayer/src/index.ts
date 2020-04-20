import {
    TTPlayerCore, TTPlayerLoading, TTPlayerError, TTPlayerMedia,
} from '@dking/ttplayer-core';
import { TTPlayerVideo } from '@dking/ttplayer-video';
import TTPlayerVideoPlayButton from '@dking/ttplayer-video-play-button';
import TTPlayerVideoControl from '@dking/ttplayer-video-control';
import './index.less';


class LoadingComponent extends TTPlayerLoading<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    renderLoading () {
        this.root
            .addClass('loading--text')
            .html('加载中')
            .hide();
    }

    showLoading () {
        this.root.show();
    }

    hideLoading () {
        this.root.hide();
    }

}

class ErrorComponent extends TTPlayerError<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    renderError () {
        this.root
            .addClass('error--text')
            .html('视频加载失败')
            .hide();
    }

    showError () {
        this.root.show();
    }

    hideError () {
        this.root.hide();
    }

}

TTPlayerVideo
    .use(TTPlayerVideoPlayButton)
    .use(TTPlayerVideoControl)
    .use(LoadingComponent)
    .use(ErrorComponent);

TTPlayerCore
    .use(TTPlayerVideo);



export default TTPlayerCore;


