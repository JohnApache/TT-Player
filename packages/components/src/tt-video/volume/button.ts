import SVGIcons from '@dking/ttplayer-svg-icons';
import {
    TTPlayerVolumeButton,
    TMediaType,
    TTPlayerMedia,
} from '@dking/ttplayer-core';

/* eslint-disable */
enum VOLUME_LEVEL {
    Lv0 = 0,
    Lv1 = 0.3,
    Lv2 = 0.7
}
/* eslint-enable */

class TTVideoVolumeButton extends TTPlayerVolumeButton<'Video'> {

    public icon: SVGIcons;
    public volumeLevel: VOLUME_LEVEL;
    constructor (media: TTPlayerMedia<TMediaType>) {
        super(media as TTPlayerMedia<'Video'>);
        this.volumeLevel = VOLUME_LEVEL.Lv0;
        this.icon = SVGIcons.createSvg('volume-lv0');
        this.icon.init();
        this.root.append(this.icon.getInstance());
    }

    onVolumeChange () {
        const {
            Lv0, Lv1, Lv2,
        } = VOLUME_LEVEL;
        if (this.volume <= Lv1 || this.muted) {
            if (this.volumeLevel === Lv0) return;
            this.volumeLevel = Lv0;
            this.icon.animatePathBySvgName('volume-lv0');
        } else if (this.volume > Lv1 && this.volume < Lv2) {
            if (this.volumeLevel === Lv1) return;
            this.volumeLevel = Lv1;
            this.icon.animatePathBySvgName('volume-lv1');
        } else {
            if (this.volumeLevel === Lv2) return;
            this.volumeLevel = Lv2;
            this.icon.animatePathBySvgName('volume-lv2');
        }
    }

    beforeRender () {
        super.beforeRender();
        this.root
            .addClass('volume--button icon--container');
    }

    render () {
        super.render();
    }

}

export default TTVideoVolumeButton;
