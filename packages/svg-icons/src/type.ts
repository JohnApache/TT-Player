export interface SVGOptionsAttributes {
    viewBox: number[];
    width: number | string;
    height: number | string;
    path: string;
    svgName: string;
    transition: boolean;
}

export interface SVGOptionsType extends Partial<SVGOptionsAttributes>{
    [key: string]: any;
}

export interface LocalSvgsMap {
    [key: string]: string;
}
