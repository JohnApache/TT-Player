import { TTPlayerProgress, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoProgress extends TTPlayerProgress<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('ttplayer__progress--container');
        this.durationProgress.addClass('ttplayer__progress--duration');
        this.cacheProgress.addClass('ttplayer__progress--cache');
        this.currentProgress.addClass('ttplayer__progress--current');
        this.thumb.addClass('ttplayer__progress--thumb');
    }

    updateProgress (rate: number) {
        super.updateProgress(rate);
    }

}

export default TTVideoProgress;
