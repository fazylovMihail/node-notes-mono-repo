export function createClassNames(className: string, modificators?: string[]) {
  if (modificators) {
    return `${className} ${
      modificators
        ? modificators
            .map((mod) => (mod.includes("__") ? mod : `${className}--${mod}`))
            .join(" ")
        : ""
    }`.trim();
  }

  return className;
}
