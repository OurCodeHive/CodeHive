declare module '*.png';
declare module '*.gif';
// declare module '*.css';
declare module "*.css" {
    const content1: { [className: string]: string };
    export = content1;
  }