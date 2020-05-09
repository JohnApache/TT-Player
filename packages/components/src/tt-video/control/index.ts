import TTVideoSmallPlayButton from '../small-play-button';
import TTVideoVolume from '../volume';
import TTVideoDurationText from '../duration-text';
import TTVideoFullScreenButton from '../fullscreen-button';
import TTVideoScreenshotButton from '../screenshot-button';
import TTVideoQualitySwitch from '../quality-switch';
import TTVideoPlaySwitch from '../play-switch';
import TTVideoRotateButton from '../rotate-button';
import TTVideoPlaybackRateSwitch from '../playbackRate-switch';
import TTVideoProgress from '../progress';
import { TTPlayerControl, TTPlayerVideo } from '@dking/ttplayer-core';


class TTPlayerVideoControl extends TTPlayerControl.VideoFactory() {

    constructor (media: TTPlayerVideo) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.leftControl
            .addClass('left--container');
        this.rightControl
            .addClass('right--container');
        this.root
            .addClass('video--control');
    }

    render () {
        super.render();
        const { height } = this.options;
        this.root.height(height);
        this.logger.debug('TTPlayerVideoControl render');
    }

}

TTPlayerVideoControl
    .useInLeft(TTVideoSmallPlayButton)
    .useInLeft(TTVideoVolume)
    .useInLeft(TTVideoDurationText)
    .useInRight(TTVideoFullScreenButton)
    .useInRight(TTVideoScreenshotButton)
    .useInRight(TTVideoQualitySwitch)
    .useInRight(TTVideoPlaySwitch)
    .useInRight(TTVideoRotateButton)
    .useInRight(TTVideoPlaybackRateSwitch)
    .use(TTVideoProgress);


export default TTPlayerVideoControl;
