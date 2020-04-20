export const isString = (data: any): data is string => typeof data === 'string';
export const isNumber = (data: any): data is number => typeof data === 'number';
export const isUndefined = (data: any): data is undefined => typeof data === 'undefined';
export const isBoolean = (data: any): data is boolean => typeof data === 'boolean';

export const PascalCase = (str: string) => {
    const regex = /-(\w)/g;
    const newStr = str.replace(regex, (_, group1) => group1.toUpperCase());
    return newStr.charAt(0).toUpperCase() + newStr.slice(1);
};

export const floatToPercent = (num: number): string => {
    const MAX_PERCENT = 100;
    let percent = num * MAX_PERCENT;
    if (percent < 0) percent = 0;
    if (percent > MAX_PERCENT) percent = MAX_PERCENT;
    return `${ percent }%`;
};
