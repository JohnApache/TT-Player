import { TTPlayerRotateButton, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoRotateButton extends TTPlayerRotateButton {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('ttplayer__rotate--button');
    }

    render () {
        super.render();
    }

}

export default TTVideoRotateButton;
