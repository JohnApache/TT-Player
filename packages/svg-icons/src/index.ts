import pasition from 'pasition';
import SVGOptions from './options';
import { SVGOptionsType } from './type';
import SVGLocalIcons, { SVGName } from './icons';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

const DEFAULT_PASITION_TIME = 100;

class SVGIcons {

    public options: SVGOptions;
    public icon: DOMUtils<HTMLDivElement>;
    public svgDom: HTMLElement;
    public pathDom: HTMLElement;

    constructor (options: SVGOptionsType) {
        this.options = new SVGOptions(options);
        this.icon = DOMUtils.createUtilDom('div');
        this.icon
            .html(`
                <svg 
                    class='icon--svg'
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 100 100"
                >
                    <path class='icon__svg--path'> 
                    </path>
                </svg>
            `);

        this.svgDom = this.icon.findDom('svg.icon--svg') as HTMLElement;
        this.pathDom = this.icon.findDom('path.icon__svg--path') as HTMLElement;
    }

    init () {
        this.renderIcon()
            .renderPath();
        return this;
    }

    getInstance () {
        return this.icon.getInstance();
    }

    private renderIcon () {
        this.icon
            .addClass('icon__svg--wrapper');

        return this;
    }

    private renderPath () {
        const {
            svgName, path, viewBox,
        } = this.options;
        let renderPath: string = path;
        if (svgName) {
            renderPath = SVGLocalIcons[svgName] || path;
            this.svgDom.setAttribute('viewBox', viewBox.join(' '));
        }
        this.pathDom.setAttribute('d', renderPath);
        return this;
    }

    public updatePathTo (path: string) {
        const renderPath: string = SVGLocalIcons[path] || path;
        return this.setPath(renderPath);
    }

    public animatePathTo (path: string) {
        const renderPath: string = SVGLocalIcons[path] || path;
        const currentPath = this.pathDom.getAttribute('d') || '';
        return this.pasitionSvg(currentPath, renderPath);
    }

    public updatePathBySvgName (svgName: SVGName) {
        const renderPath: string = SVGLocalIcons[svgName];
        if (!renderPath) return this;
        return this.setPath(renderPath);
    }

    public animatePathBySvgName (svgName: SVGName) {
        const renderPath: string = SVGLocalIcons[svgName];
        if (!renderPath) return this;
        return this.animatePathTo(renderPath);
    }

    public setPath (path: string) {
        this.pathDom.setAttribute('d', path);
        return this;
    }

    private pasitionSvg (from: string, to: string) {
        pasition.animate({
            from,
            to,
            time    : DEFAULT_PASITION_TIME,
            progress: shapes => {
                this.pathDom.setAttribute('d', this.toSVGString(shapes));
            },
        });
        return this;
    }

    private toSVGString (shapes: (number | string)[][][]): string {
        /*克隆一下实时数据*/
        //var shapes = JSON.parse(JSON.stringify(shapes||[]));
        /*对数据中的每个点数组做处理
        * */
        return shapes.map(function(shape) {
            shape.forEach(function(point, idx) {
                if (!idx) {
                    /*
                    * 若是第一个点数组，那么对该点数组的处理是前面加M,然后前两个点后面加C
                    * */
                    point.splice(2, 0, 'C');
                    point.unshift('M');
                } else {
                    /*
                    * 除了第一个点数据外,所有的点数组的前两个点删除掉
                    * */
                    point.splice(0, 2, 'C');
                }
            });
            return shape.map(function(point) {
                return point.join(' ');
            }).join('');
        }).join('');
    }

    static createSvg (svgName: SVGName, options?: SVGOptionsType): SVGIcons {
        return new SVGIcons({ ...options, svgName });
    }

}

export default SVGIcons;
