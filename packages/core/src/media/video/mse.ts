import TTPlayerVideo from '.';

interface IMSECtor {
    new (video: TTPlayerVideo): MSE;
}

class MSE {

    public video: TTPlayerVideo;
    constructor (video: TTPlayerVideo) {
        this.video = video;
    }

    checkType (url: string, type: string): boolean {
        console.log(url, type);
        return false;
    }

    initMSE (url: string, options?: any) {
        console.log(url, options);
    }

    clearMSE () {}

}

export { IMSECtor };

export default MSE;
