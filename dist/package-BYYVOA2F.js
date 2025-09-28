// package.json
var name = "create-unibest";
var type = "module";
var version = "3.0.0";
var description = "\u5FEB\u901F\u521B\u5EFAunibest\u9879\u76EE\u7684\u811A\u624B\u67B6\u5DE5\u5177";
var author = "";
var license = "ISC";
var keywords = [];
var main = "index.js";
var bin = {
  best: "bin/index.js"
};
var scripts = {
  dev: "tsup --watch",
  build: "tsup",
  prepare: "npm run build"
};
var dependencies = {
  ejs: "^3.1.10",
  "fs-extra": "^11.3.0",
  kolorist: "^1.8.0",
  minimist: "^1.2.8",
  prompts: "^2.4.2"
};
var devDependencies = {
  "@types/fs-extra": "^11.0.4",
  "@types/minimist": "^1.2.5",
  "@types/node": "^24.5.0",
  "@types/prompts": "^2.4.9",
  tsup: "^8.5.0",
  typescript: "^5.9.0"
};
var package_default = {
  name,
  type,
  version,
  description,
  author,
  license,
  keywords,
  main,
  bin,
  scripts,
  dependencies,
  devDependencies
};
export {
  author,
  bin,
  package_default as default,
  dependencies,
  description,
  devDependencies,
  keywords,
  license,
  main,
  name,
  scripts,
  type,
  version
};
//# sourceMappingURL=package-BYYVOA2F.js.map