import { TTPlayerCore } from '@dking/ttplayer-core';
import { TTPlayerVideo } from '@dking/ttplayer-video';
import TTPlayerVideoPlayButton from '@dking/ttplayer-video-play-button';
import TTPlayerVideoControl from '@dking/ttplayer-video-control';
import './index.less';

TTPlayerVideo
    .use(TTPlayerVideoPlayButton)
    .use(TTPlayerVideoControl);

TTPlayerCore
    .use(TTPlayerVideo);

export default TTPlayerCore;


