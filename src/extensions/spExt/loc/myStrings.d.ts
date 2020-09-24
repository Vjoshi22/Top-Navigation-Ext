declare interface ISpExtApplicationCustomizerStrings {
  Title: string;
}

declare module 'SpExtApplicationCustomizerStrings' {
  const strings: ISpExtApplicationCustomizerStrings;
  export = strings;
}
declare module '*.scss' {
  const content: {[className: string]: string};
  export default content;
}
declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}
declare module "*.png" {
  const value: any;
  export = value;
}
declare module "*.gif" {
  const value: any;
  export = value;
}