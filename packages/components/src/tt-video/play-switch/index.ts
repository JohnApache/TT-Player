import { TTPlayerPlaySwitch, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoPlaySwitch extends TTPlayerPlaySwitch<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('ttplayer__play--container');
        this.playSwitch.addClass('ttplayer__play--switch');
        this.playListRoot.addClass('ttplayer__play--list');
        this.playListItems.forEach(dom => {
            dom.addClass('ttplayer__play--item');
        });
    }

    render () {
        super.render();
    }

}

export default TTVideoPlaySwitch;
