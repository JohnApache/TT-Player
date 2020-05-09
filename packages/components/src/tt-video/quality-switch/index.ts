import { TTPlayerQualitySwitch, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoQualitySwitch extends TTPlayerQualitySwitch<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('ttplayer__quality--container');
        this.qualitySwitch.addClass('ttplayer__quality--switch');
        this.qualityListRoot.addClass('ttplayer__quality--list');
        this.qualityListItems.forEach(dom => {
            dom.addClass('ttplayer__quality--item');
        });
    }

    render () {
        super.render();
    }

}

export default TTVideoQualitySwitch;
