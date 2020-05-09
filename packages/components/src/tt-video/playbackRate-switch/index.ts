import { TTPlayerPlaybackRateSwitch, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoPlaybackRateSwitch extends TTPlayerPlaybackRateSwitch<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('ttplayer__playback-rate--container');
        this.playbackRateSwitch.addClass('ttplayer__playback-rate--switch');
        this.playbackRateListRoot.addClass('ttplayer__playback-rate--list');
        this.playbackRateListItems.forEach(dom => {
            dom.addClass('ttplayer__playback-rate--item');
        });
    }

    render () {
        super.render();
    }

}

export default TTVideoPlaybackRateSwitch;
