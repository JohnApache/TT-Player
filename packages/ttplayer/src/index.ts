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

class PIPComponent extends TTPlayerPIP {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    renderPIP () {
        this.root
            .addClass('pip--button')
            .html('画中画');
    }

    onEnterPIP () {}
    onLeavePIP () {
        setTimeout(() => {
            this.media.play();
        }, 0);
    }

    onResizePIPWindows () {}

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


