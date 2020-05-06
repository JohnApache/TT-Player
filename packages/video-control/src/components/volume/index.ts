import TTPlayerVideoControl from '../../index';
import SVGIcons from '@dking/ttplayer-svg-icons';
import {
    TTPlayerComponentsGroup,
    TTPlayerVolumeButton,
    TTPlayerHorizontalVolumeBar,
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

class ControlVolumeButton extends TTPlayerVolumeButton<'Video'> {

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

class ControlVolumeBar extends TTPlayerHorizontalVolumeBar<'Video'> {

    constructor (media: TTPlayerMedia<TMediaType>) {
        super(media as TTPlayerMedia<'Video'>);
    }

    beforeRender () {
        super.beforeRender();
        this.thumb
            .addClass('volume--thumb');
        this.inner
            .addClass('volume__bar--inner');
        this.outter
            .addClass('volume__bar--outter');
        this.root
            .addClass('volume__bar--wrapper');
    }

    render () {
        super.render();
        this.muted ?
            this.outter.addClass('muted') :
            this.outter.removeClass('muted');
    }

}

class ControlVolume extends TTPlayerComponentsGroup<'Video'> {

    static groupComponentsCtor = [];

    constructor (control: TTPlayerVideoControl) {
        super(control.media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('control__volume--container');
    }

}

ControlVolume
    .use(ControlVolumeButton)
    .use(ControlVolumeBar);

export default ControlVolume;
