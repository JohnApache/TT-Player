declare module 'pasition' {

    interface Option {
        end: ()=> any;
        progress: (v: any)=> any;
        from: string;
        to: string;
        begin: ()=> any;
        easing: (v: any)=> any;
        time: number;
    }

    interface PasitionType {
        lerpCurve: (pathA: number[], pathB: number[], t: number)=> number[];
        lerpPoints: (x1: number, y1: number, x2: number, y2: number, t: number)=> number[];
        q2b: (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number)=> number[];
        path2shapes: (path: string)=> number[][];
        lerp: (pathA: number[], pathB: number[], t: number)=> number[][];
        animate: (option: Partial<Option>)=> void;
    }

    const pasition: PasitionType;

    export default pasition;
}
