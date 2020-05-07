import TTPlayerVideoControl from '../../index';
import { TTPlayerPlaybackRateSwitch } from '@dking/ttplayer-core';

class ControlPlaybackRateSwitch extends TTPlayerPlaybackRateSwitch<'Video'> {

    constructor (control: TTPlayerVideoControl) {
        super(control.media);
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

export default ControlPlaybackRateSwitch;
