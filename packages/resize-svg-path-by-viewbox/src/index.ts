import utils from '@dking/ttplayer-utils';

const START_LOGGER = true;

const UpperCaseActions = [
    'M',
    'L',
    'H',
    'V',
    'Z',
    'C',
    'S',
    'Q',
    'T',
];

const LowerCaseActions = UpperCaseActions.map(v => v.toLowerCase());

type ViewBoxType = [number, number, number, number];

const Risizal = (sourceViewBox: ViewBoxType, targetViewBox: ViewBoxType) => {
    const svw = sourceViewBox[2];
    const svh = sourceViewBox[3];
    const tvw = targetViewBox[2];
    const tvh = targetViewBox[3];

    let offsetX = 0; // 最适比缩放后，在目标容器居中位置水平偏移量
    let offsetY = 0; //最适比缩放后，在目标容器居中位置垂直偏移量

    let scale = 1; // 水平坐标缩放比

    if (svw < svh) {
        if (tvh / tvw > svh / svw) {
            scale = tvw / svw;
            offsetY = (tvh - (scale * svh)) / 2;
        } else {
            scale = tvh / svh;
            offsetX = (tvw - (scale * svw)) / 2;
        }
    } else if (tvw / tvh > svw / svh) {
        scale = tvh / svh;
        offsetX = (tvw - (scale * svw)) / 2;
    } else {
        scale = tvw / svw;
        offsetY = (tvh - (scale * svh)) / 2;
    }

    START_LOGGER && console.log(
        '[offsetX]:', offsetX,
        '[offsetY]:', offsetY,
        '[scale]:', scale,
    );

    return {
        resizeX (x: number): number {
            const resizeX = Number((scale * x).toFixed(3));
            START_LOGGER && console.log('[resizeX]:', x, resizeX);
            return resizeX;
        },
        resizeY (y: number): number {
            const resizeY = Number((scale * y).toFixed(3));
            START_LOGGER && console.log('[resizeY]:', y, resizeY);
            return resizeY;
        },
        scale,
        offsetX,
        offsetY,
    };
};


const ResizeSvgPathByViewbox = (
    path: string,
    sourceViewBox: ViewBoxType | string,
    targetViewBox: ViewBoxType | string,
) => {
    const reg1 = /([a-zA-Z][\d,\-,.,\s]*)/g; // 匹配所有动作和具体位置
    const reg2 = /-?\d+(\.\d+)?/g; // 匹配动作锚点位置数字

    let svb: ViewBoxType;
    let tvb: ViewBoxType;
    if (utils.isString(sourceViewBox)) {
        svb = sourceViewBox.split(' ').map(v => Number(v)) as ViewBoxType;
    } else {
        svb = sourceViewBox;
    }

    if (utils.isString(targetViewBox)) {
        tvb = targetViewBox.split(' ').map(v => Number(v)) as ViewBoxType;
    } else {
        tvb = targetViewBox;
    }

    if (!svb || svb.length < 4) {
        throw new Error('invalid source viewbox');
    }

    if (!tvb || tvb.length < 4) {
        throw new Error('invalid source viewbox');
    }

    const {
        resizeX, resizeY, offsetX, offsetY,
    } = Risizal(svb, tvb);

    const actions = path.match(reg1) || [];
    let result = '';
    actions.forEach(item => {
        const actChar = item[0]; // 动作字母
        result += actChar; // 拼接具体动作

        const posStr = item.slice(1);
        const posArr = posStr.match(reg2);
        if (posStr.trim().length <= 0 || !posArr) {
            START_LOGGER && console.log('[ActChar]:', actChar, '[SourceAction]:', item);
            return; // 没有具体数字位置 直接返回
        }
        let resizePosArr: number[] = []; // resize 后的path 锚点位置
        // 大写字母动作，绝对位置需要计算偏移量
        if (UpperCaseActions.indexOf(actChar) !== -1) {
            resizePosArr = posArr.map((pos, i) => {
                if (actChar === 'H') {
                    return resizeX(Number(pos)) + offsetX;
                }
                if (actChar === 'V') {
                    return resizeY(Number(pos)) + offsetY;
                }
                if (i % 2 === 0) {
                    return resizeX(Number(pos)) + offsetX;
                }
                return resizeY(Number(pos)) + offsetY;
            });
        }

        // 小写字母相对位置不需要计算偏移量
        if (LowerCaseActions.indexOf(actChar) !== -1) {
            resizePosArr = posArr.map((pos, i) => {
                if (actChar === 'h') {
                    return resizeX(Number(pos));
                }
                if (actChar === 'v') {
                    return resizeY(Number(pos));
                }
                if (i % 2 === 0) {
                    return resizeX(Number(pos));
                }
                return resizeY(Number(pos));
            });
        }

        START_LOGGER && console.log(
            '[ActChar]:', actChar,
            '[SourceAction]:', item,
            '[SourcePaths]:', posArr,
            '[ResizePaths]:', resizePosArr,
        );

        result += resizePosArr.join(' ');// 拼接resize 后的锚点坐标
    });

    return result;
};


export default ResizeSvgPathByViewbox;
