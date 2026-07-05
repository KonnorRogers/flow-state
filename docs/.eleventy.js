// eleventy.config.js
const webawesomeDir = '../node_modules/@awesome.me/webawesome';
const flowStateDirectories = [
  'exports',
  'internal'
]

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    [webawesomeDir]: 'webawesome',
  });

  flowStateDirectories.forEach((dir) => {
    eleventyConfig.addPassthroughCopy({
      [path.join('../', dir)]: path.join('flow-state', dir),
    })
  })
}

export const config = {
  markdownTemplateEngine: 'njk',
  dir: {
    input: 'pages',
    includes: '_includes',
    layouts: '_layouts',
  },
  templateFormats: ['njk', 'md'],
};
