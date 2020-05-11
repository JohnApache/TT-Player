import {
    TTVideoControl,
    TTVideoLoading,
    TTVideoError,
    TTVideoPIPButton,
    TTVideoPlayButton,
} from '@dking/ttplayer-components';
import {
    FlvMSE,
    HlsMSE,
    DashMSE,
    WebTorrentMSE,
} from '@dking/ttplayer-mse';
import {
    TTPlayerCoreFactory,
    TTPlayerVideoFactory,
    TTPlayerVideo as Video,
    TTPlayerCore as Core,
} from '@dking/ttplayer-core';
import './index.less';

const TTPlayerVideo: typeof Video =
    TTPlayerVideoFactory()
        .use(TTVideoControl)
        .use(TTVideoLoading)
        .use(TTVideoError)
        .use(TTVideoPIPButton)
        .use(TTVideoPlayButton)
        .useMSE(FlvMSE)
        .useMSE(HlsMSE)
        .useMSE(DashMSE)
        .useMSE(WebTorrentMSE);

const TTPlayerCore: typeof Core =
    TTPlayerCoreFactory()
        .use(TTPlayerVideo);


export default TTPlayerCore;


