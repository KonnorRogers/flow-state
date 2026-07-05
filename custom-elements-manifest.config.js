// @ts-check

const globs = [
  "exports/**/*.{d.ts,js}",
  "internal/**/*.{d.ts,js}",
  "types/**/*.d.ts",
  "node_modules/web-component-define/**/*.js",
];

export default {
  /** Globs to analyze */
  globs,
  /** Globs to exclude */
  exclude: ["docs"],
  /** Directory to output CEM to */
  outdir: ".",
  /** Run in dev mode, provides extra logging */
  dev: process.argv.includes("--verbose"),
  /** Run in watch mode, runs on file changes */
  watch: process.argv.includes("--watch"),
  /** Include third party custom elements manifests */
  dependencies: true,
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: true,
  /** Enable special handling for litelement */
  litelement: true,
  /** Enable special handling for catalyst */
  catalyst: false,
  /** Enable special handling for fast */
  fast: false,
  /** Enable special handling for stencil */
  stencil: false,
  /** Overrides default module creation: */
  // overrideModuleCreation: ({ts, globs}) => {
  //   const program = ts.createProgram(globs, {
  //     module: ts.ModuleKind.NodeNext,
  //     moduleResolution: ts.ModuleResolutionKind.NodeNext,
  //     "skipDefaultLibCheck": true,
  //     "strict": true,
  //     "target": ts.ScriptTarget.ESNext,
  //     "allowSyntheticDefaultImports": true,
  //     "useDefineForClassFields": false,
  //     "noImplicitAny": true,
  //     "lib": ["ESNext", "DOM", "DOM.Iterable"],
  //     "declaration": true,
  //     "emitDeclarationOnly": true,
  //     "allowJs": true,
  //     "checkJs": true,
  //     "verbatimModuleSyntax": true,
  //     "noImplicitOverride": true
  //   })

  //   const typeChecker = program.getTypeChecker();

  //   return program.getSourceFiles().filter(sf => globs.find(glob => sf.fileName.includes(glob)));
  // },
};
