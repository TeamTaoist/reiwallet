const fs = require("fs");
const manifest = require("../public/manifest.json");

/**
 * readFile uses a Regex to filter, match, and return the static file based on
 * the `prefix` and `extension` in the directory based on the `path`.
 *
 * @param {string} path File path relative to the build directory - `'static/js'`
 * @param {string} prefix File prefix for the file name - `'main'`
 * @param {string} extension File extension - 'js'
 * @returns {string} File name - `'main.66848e72.js'`
 */
function readFile(path, prefix, extension) {
  const file = new RegExp(`^${prefix}\.[a-z0-9]+\.${extension}$`);
  return fs
    .readdirSync(`./build/${path}`)
    .filter((filename) => file.test(filename))
    .map((filename) => `${path}/${filename}`)[0];
}

const js = readFile("static/js", "twitter", "js");
const backgoundJs = readFile("static/js", "background", "js");
// const css = readFile('static/css', 'main', 'css');
// const logo = readFile('static/media', 'logo', 'svg');

// regenerate manifest.json for publishing
const newManifest = {
  ...manifest,
  background: {
    service_worker: backgoundJs,
    type: "module",
  },
  content_scripts: [
    {
      ...manifest.content_scripts[0],
      js: ["/content_script/content.js", "/content_script/inject.js"],
      // css: [css],
    },
  ],
};

fs.writeFileSync("./build/manifest.json", JSON.stringify(newManifest, null, 2));

// regenerate inject.js for publishing
const filePath = "./build/content_script/inject.js";
const searchString = "#VERSION#";
const vesrionStr = manifest.version.toString();
const updatedData = fs
  .readFileSync(filePath, "utf8")
  .replace(new RegExp(searchString, "g"), vesrionStr);
fs.writeFileSync(filePath, updatedData, "utf8");
