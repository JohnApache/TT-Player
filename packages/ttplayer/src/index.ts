import TTPlayerCore from '@dking/ttplayer-core';
import TTPlayerVideo from '@dking/ttplayer-video';
import TTPlayerVideoPlayButton from '@dking/ttplayer-video-play-button';
import TTPlayerVideoControl from '@dking/ttplayer-video-control';
import './index.less';

TTPlayerCore
    .use(TTPlayerVideo)
    .use(TTPlayerVideoPlayButton)
    .use(TTPlayerVideoControl);

export default TTPlayerCore;


