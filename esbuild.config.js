import * as path from "path";
import esbuild from "esbuild";
import { globby } from "globby";
const watchMode = process.argv.includes("--watch");

const cdndir = path.join(process.cwd(), "cdn", "exports");
const bundleDir = path.join(process.cwd(), "bundles");

(async () => {
  const entryPoints = await globby("./exports/**/*.js");

  /**
   * @type {import("esbuild").BuildOptions}
   */
  const coreConfig = {
    format: "esm",
    target: "es2017",
    chunkNames: "chunks/[name].[hash]",
    define: {
      // Floating UI requires this to be set
      "process.env.NODE_ENV": '"production"',
    },
    external: [],
    bundle: true,
  };

  /**
   * @type {import("esbuild").BuildOptions}
   */
  const cdnConfig = {
    ...coreConfig,
    entryPoints,
    splitting: true,
    treeShaking: true,
    outdir: cdndir,
  };

  /**
   * @type {import("esbuild").BuildOptions}
   */
  const allConfig = {
    ...coreConfig,
    entryPoints: ["./exports/index.js"],
    outfile: path.join(bundleDir, "all.js"),
  };

  const configs = [cdnConfig, allConfig];

  if (watchMode) {
    // Use the context API to allow incremental dev builds
    const contexts = await Promise.all(
      configs.map((config) => esbuild.context(config)),
    );
    await Promise.all(contexts.map((context) => context.rebuild()));
    return contexts;
  } else {
    // Use the standard API for production builds
    return await Promise.all(configs.map((config) => esbuild.build(config)));
  }
})();
