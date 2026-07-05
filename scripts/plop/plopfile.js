import { readdirSync, readFileSync } from "fs";
import { fdir } from "fdir"
import * as process from "process";
import * as path from "path";


import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);


const rootDir = path.join(__dirname, "..", "..")

function renamePackage (plop) {
  const actions = []

  const files = new fdir({
    includeDirs: false,
    exclude (dirName, dirPath) {
      const excludedDirs = [
        "node_modules/",
        ".git/",
        "docs/src/shoelace-assets/assets/icons/",
        // "./",
        // "../"
      ]
      if (excludedDirs.some((str) => dirPath.includes(str))) {
        return true
      }

      if (excludedDirs.some((str) => dirName.includes(str))) {
        return true
      }


      return false
    }
  })
  .withBasePath()
  .crawl(rootDir)
  .sync()

  files.forEach((filePath) => {
    const excludedExtensions = /\.(png|jpeg|jpg|svg|ico|gif|woff|woff2|ttf|otf|doc|docx|hbs|yaml|yml)$/

    if (filePath.match(excludedExtensions)) {
      return
    }

    if (filePath.endsWith("plopfile.js")) {
      return
    }

    actions.push({
      type: "modify",
      path: filePath,
      transform(fileContents, data) {
        return plop.renderString(fileContents, data)

        // return fileContents
      }
    })
  })

  return {
    description: "Change the package name",
    prompts: [
      {
        type: "input",
        name: "packageName",
        message: `Choose a package name (ex. do-the-roar). WARNING: this is a one time process and is not repeatable.`,
      }
    ],
    actions
  }
}

export default function (plop) {
  const componentPrefix = "";

  function tagWithoutPrefix(tag) {
    return tag.replace(new RegExp(`^${componentPrefix}`), "");
  }

  function tagToTitle(tag) {
    const withoutPrefix = plop.getHelper("tagWithoutPrefix");
    const titleCase = plop.getHelper("titleCase");
    return titleCase(withoutPrefix(tag).replace(/-/g, " "));
  }

  plop.setHelper("tagWithoutPrefix", tagWithoutPrefix);
  plop.setHelper("tagToTitle", tagToTitle);

  plop.setGenerator("component", {
    description: "Generate a new component",
    prompts: [
      {
        type: "input",
        name: "tag",
        message: `Tag name? (e.g. ${componentPrefix}button)`,
        validate: (value) => {
          // Start with light- and include only a-z + dashes
          const regex = new RegExp(`^${componentPrefix}[a-z-+]+`);

          if (!regex.test(value)) {
            console.error(`Tag must start with ${componentPrefix}`);
            return false;
          }

          // No double dashes or ending dash
          if (value.includes("--") || value.endsWith("-")) {
            return false;
          }

          return true;
        },
      },
    ],
    actions: function (data) {
      data.packageName = JSON.parse(readFileSync(path.join(rootDir, "package.json")))["name"]
      return [
        {
          type: "add",
          path: "../../exports/components/{{ tag }}/{{ tag }}-register.js",
          templateFile: "templates/component-register.hbs",
        },
        {
          type: "add",
          path: "../../exports/components/{{ tag }}/{{ tag }}-globals.ts",
          templateFile: "templates/component-globals.hbs",
        },
        {
          type: "add",
          path: "../../exports/components/{{ tag }}/{{ tag }}.js",
          templateFile: "templates/component.hbs",
        },
        {
          type: "add",
          path: "../../exports/components/{{ tag }}/{{ tag }}.styles.js",
          templateFile: "templates/component-styles.hbs",
        },
        {
          type: "add",
          path: "../../tests/{{ tag }}.test.js",
          templateFile: "templates/component-tests.hbs",
        },
        {
          type: "add",
          path: "../../docs/src/_documentation/components/{{ tag }}.md",
          templateFile: "templates/component-docs.hbs",
        },
        {
          type: "modify",
          path: "../../exports/index.js",
          transform(fileContents, data) {
            const properCase = plop.getHelper("properCase");
            const directories = getDirectories(
              path.resolve(process.cwd(), "exports", "components"),
            );
            const contents = directories.sort().map((directoryName) => {
              // const componentPath = tagWithoutPrefix(directoryName)
              const componentPath = directoryName;
              return `export { default as ${properCase(directoryName)} } from "./components/${componentPath}/${componentPath}-register.js"`;
            });
            return contents.join("\n");
          },
        }
      ]
    }
  });


  plop.setGenerator("rename-package", renamePackage(plop))
}

