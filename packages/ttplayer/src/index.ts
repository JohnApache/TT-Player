import {
    TTPlayerCoreFactory, TTPlayerLoading, TTPlayerError, TTPlayerMedia, TTPlayerPIP,
} from '@dking/ttplayer-core';
import { TTPlayerVideoFactory } from '@dking/ttplayer-video';
import TTPlayerVideoPlayButton from '@dking/ttplayer-video-play-button';
import TTPlayerVideoControl from '@dking/ttplayer-video-control';
import './index.less';


class LoadingComponent extends TTPlayerLoading<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('loading--text');
    }

    renderLoading () {
        this.root
            .html('加载中')
            .hide();
    }

    hideLoading () {
        this.root.hide();
    }

}

class ErrorComponent extends TTPlayerError<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        this.root.addClass('error--text');
    }

    renderError () {
        this.root
            .html('视频加载失败')
            .show();
    }

    hideError () {
        this.root.hide();
    }

}

class PIPComponent extends TTPlayerPIP {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('pip--button');
    }

    renderPIP () {
        this.root
            .html('画中画');
    }

    hidePIP () {
        this.root
            .html('取消画中画');
    }

}

const TTPlayerVideo =
    TTPlayerVideoFactory()
        .use(TTPlayerVideoPlayButton)
        .use(TTPlayerVideoControl)
        .use(LoadingComponent)
        .use(ErrorComponent)
        .use(PIPComponent);

const TTPlayerCore =
    TTPlayerCoreFactory()
        .use(TTPlayerVideo);

export default TTPlayerCore;


