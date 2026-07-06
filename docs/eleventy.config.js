// eleventy.config.js
import litPlugin from '@lit-labs/eleventy-plugin-lit';
import * as fs from 'node:fs';
import * as path from "node:path"

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const root = path.resolve(__dirname, '..')
const webawesomeDir = path.join(root, 'node_modules/@awesome.me/webawesome');
const webawesomeComponentsDir = path.join(webawesomeDir, 'dist', 'components');
const webawesomeComponents = fs.readdirSync(webawesomeComponentsDir).map(componentName => {
  return path.join(webawesomeComponentsDir, componentName, componentName + '.js');
});

const flowStateDirectories = [
  'exports',
  'internal'
]

export default async function (eleventyConfig) {
  // eleventyConfig.addPlugin(litPlugin, {
  //   mode: 'worker',
  //   componentModules: webawesomeComponents,
  // });
  eleventyConfig.addPassthroughCopy({
    [webawesomeDir]: 'webawesome',
  });

  flowStateDirectories.forEach((dir) => {
    const resolvedDir = path.join(root, dir)
    eleventyConfig.addPassthroughCopy({
      [resolvedDir]: path.join('downflow', dir),
    })

    eleventyConfig.addWatchTarget(resolvedDir)
  })
}

export const config = {
  markdownTemplateEngine: 'njk',
  dir: {
    input: 'docs/pages',
    includes: '_includes',
    layouts: '_layouts',
  },
  templateFormats: ['njk', 'md', 'html'],
};
