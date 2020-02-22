import TTPlayerCore from '@dking/ttplayer-core';
import TTPlayerVideo from '@dking/ttplayer-video';
import TTPlayerVideoPlayButton from '@dking/ttplayer-video-play-button';
import './index.less';


TTPlayerCore
    .use(TTPlayerVideo)
    .use(TTPlayerVideoPlayButton);

export default TTPlayerCore;


