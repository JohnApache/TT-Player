import PlayButtonOptions from './options';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { TTPlayerPlayButton, TTPlayerVideo } from '@dking/ttplayer-core';

class VideoPlayButton extends TTPlayerPlayButton<'Video'> {

    public options: PlayButtonOptions;
    public icon: SVGIcons;

    constructor (media: TTPlayerVideo) {
        super(media);
        this.options = new PlayButtonOptions(media.options.videoPlayButton);
        this.icon = new SVGIcons({ svgName: 'play' });
        this.icon.init();
        this.root.append(this.icon.getInstance());
    }

    renderPlay () {
        this.icon.animatePathBySvgName('pause');
    }

    renderPause () {
        this.icon.animatePathBySvgName('play');
    }

    beforeRender () {
        super.beforeRender();
        this.root
            .addClass('ttplayer__video__play--button');
    }

    render () {
        super.render();
        const { size } = this.options;
        this.root
            .css({ width: `${ size }px`, height: `${ size }px` });
    }

}


export default VideoPlayButton;
