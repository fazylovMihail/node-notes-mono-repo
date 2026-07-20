declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.woff" {
  const value: string;
  export default value;
}

declare module "*.woff2" {
  const value: string;
  export default value;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
