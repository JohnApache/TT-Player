import {
    TTVideoControl,
    TTVideoLoading,
    TTVideoError,
    TTVideoPIPButton,
    TTVideoPlayButton,
} from '@dking/ttplayer-components';
import {
    TTPlayerCoreFactory, TTPlayerVideo as Video, TTPlayerCore as Core,
} from '@dking/ttplayer-core';
import { TTPlayerVideoFactory } from '@dking/ttplayer-video';
import './index.less';

const TTPlayerVideo: typeof Video =
    TTPlayerVideoFactory()
        .use(TTVideoControl)
        .use(TTVideoLoading)
        .use(TTVideoError)
        .use(TTVideoPIPButton)
        .use(TTVideoPlayButton);

const TTPlayerCore: typeof Core =
    TTPlayerCoreFactory()
        .use(TTPlayerVideo);


export default TTPlayerCore;


