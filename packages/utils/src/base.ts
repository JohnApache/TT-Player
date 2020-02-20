export const isString = (data: any): data is string => typeof data === 'string';
export const isUndefined = (data: any): data is undefined => typeof data === 'undefined';

export const PascalCase = (str: string) => {
    const regex = /-(\w)/g;
    const newStr = str.replace(regex, (_, group1) => group1.toUpperCase());
    return newStr.charAt(0).toUpperCase() + newStr.slice(1);
};

