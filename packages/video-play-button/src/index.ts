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
        this.init();
    }

    init () {
        this.render();
    }

    onPlay () {
        this.icon.animatePathBySvgName('pause');
    }

    onPause () {
        this.icon.animatePathBySvgName('play');
    }

    private render () {
        const { size } = this.options;
        this.root
            .addClass('ttplayer__video__play--button')
            .css({ width: `${ size }px`, height: `${ size }px` })
            .append(this.icon.getInstance());

        return this;
    }

}


export default VideoPlayButton;
