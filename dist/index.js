#!/usr/bin/env node

// src/index.ts
import process2 from "process";
import minimist from "minimist";

// src/utils/color.ts
import { blue, green, magenta, red, yellow } from "kolorist";
var color = {
  blue,
  green,
  magenta,
  red,
  yellow
};

// src/utils/generator.ts
import path2 from "path";
import process from "process";
import { fileURLToPath as fileURLToPath2 } from "url";
import fs2 from "fs-extra";

// src/utils/template.ts
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import fs from "fs-extra";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var TemplateHandler = class {
  templateRoot;
  constructor() {
    this.templateRoot = path.resolve(__dirname, "../../templates");
  }
  /**
   * 获取基础模板路径
   */
  getBaseTemplatePath() {
    return path.join(this.templateRoot, "base");
  }
  /**
   * 获取UI库模板路径
   */
  getUiTemplatePath(uiLibrary) {
    return path.join(this.templateRoot, "ui-templates", uiLibrary);
  }
  /**
   * 获取i18n模板路径
   */
  getI18nTemplatePath() {
    return path.join(this.templateRoot, "i18n");
  }
  /**
   * 渲染EJS模板
   */
  async renderTemplate(templatePath, data) {
    const templateContent = await fs.readFile(templatePath, "utf-8");
    return ejs.render(templateContent, data, {});
  }
  /**
   * 复制模板文件到目标路径
   */
  async copyTemplate(sourceDir, targetDir, data) {
    await fs.ensureDir(targetDir);
    const files = await fs.readdir(sourceDir);
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      const stats = await fs.stat(sourcePath);
      if (stats.isDirectory()) {
        await this.copyTemplate(sourcePath, targetPath, data);
      } else if (file.endsWith(".ejs")) {
        const renderedContent = await this.renderTemplate(sourcePath, data || {});
        const actualTargetPath = targetPath.replace(".ejs", "");
        await fs.writeFile(actualTargetPath, renderedContent, "utf-8");
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  }
  /**
   * 获取所有支持的UI库列表
   */
  async getSupportedUiLibraries() {
    const uiTemplatesDir = path.join(this.templateRoot, "ui-templates");
    const exists = await fs.pathExists(uiTemplatesDir);
    if (!exists) return [];
    const dirs = await fs.readdir(uiTemplatesDir);
    return dirs.filter(async (dir) => {
      const dirPath = path.join(uiTemplatesDir, dir);
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    });
  }
};

// src/utils/generator.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var ProjectGenerator = class {
  templateHandler;
  projectName;
  projectPath;
  uiLibrary;
  useJs;
  useI18n;
  constructor(projectName, options) {
    this.templateHandler = new TemplateHandler();
    this.projectName = projectName;
    this.projectPath = path2.resolve(process.cwd(), projectName);
    this.uiLibrary = options.uiLibrary;
    this.useJs = options.useJs;
    this.useI18n = options.useI18n;
  }
  /**
   * 生成项目
   */
  async generate() {
    if (await fs2.pathExists(this.projectPath)) {
      throw new Error(`\u9879\u76EE\u76EE\u5F55 ${this.projectName} \u5DF2\u5B58\u5728`);
    }
    try {
      await this.copyBaseTemplate();
      await this.copyUiTemplate();
      if (this.useI18n) {
        await this.copyI18nTemplate();
      }
      await this.generateConfigFiles();
      console.log(`\u2705 \u9879\u76EE ${this.projectName} \u521B\u5EFA\u6210\u529F\uFF01`);
      console.log(`\u{1F4C1} \u76EE\u5F55: ${this.projectPath}`);
      console.log(`\u{1F4A1} \u4E0B\u4E00\u6B65: cd ${this.projectName} && pnpm install`);
    } catch (error) {
      if (await fs2.pathExists(this.projectPath)) {
        await fs2.remove(this.projectPath);
      }
      throw error;
    }
  }
  /**
   * 复制基础模板
   */
  async copyBaseTemplate() {
    const baseTemplatePath = this.templateHandler.getBaseTemplatePath();
    await this.templateHandler.copyTemplate(baseTemplatePath, this.projectPath, {
      projectName: this.projectName,
      useJs: this.useJs,
      useI18n: this.useI18n,
      uiLibrary: this.uiLibrary
    });
  }
  /**
   * 复制UI库特定模板
   */
  async copyUiTemplate() {
    const uiTemplatePath = this.templateHandler.getUiTemplatePath(this.uiLibrary);
    if (!await fs2.pathExists(uiTemplatePath)) {
      throw new Error(`\u4E0D\u652F\u6301\u7684UI\u5E93: ${this.uiLibrary}`);
    }
    const languageDir = this.useJs ? "js" : "ts";
    const specificUiTemplatePath = path2.join(uiTemplatePath, languageDir);
    if (await fs2.pathExists(specificUiTemplatePath)) {
      await this.templateHandler.copyTemplate(specificUiTemplatePath, this.projectPath, {
        projectName: this.projectName,
        useJs: this.useJs,
        useI18n: this.useI18n,
        uiLibrary: this.uiLibrary
      });
    }
  }
  /**
   * 复制i18n模板
   */
  async copyI18nTemplate() {
    const i18nTemplatePath = this.templateHandler.getI18nTemplatePath();
    await this.templateHandler.copyTemplate(i18nTemplatePath, this.projectPath, {
      projectName: this.projectName,
      useJs: this.useJs,
      useI18n: this.useI18n,
      uiLibrary: this.uiLibrary
    });
  }
  /**
   * 生成项目配置文件
   */
  async generateConfigFiles() {
  }
};

// src/utils/prompt.ts
import prompts from "prompts";
var PromptHandler = class {
  /**
   * 询问用户选择UI库
   */
  async askUiLibrary(choices) {
    const response = await prompts({
      type: "select",
      name: "uiLibrary",
      message: color.green("\u8BF7\u9009\u62E9UI\u5E93:"),
      choices: choices.map((ui) => ({
        title: ui,
        value: ui
      })),
      initial: 0
    });
    return response.uiLibrary;
  }
  /**
   * 询问用户是否使用 js
   */
  async askUseJs() {
    const response = await prompts({
      type: "confirm",
      name: "useJs",
      message: color.green("\u662F\u5426\u4F7F\u7528js\u7248\u672C(\u9ED8\u8BA4\u4F7F\u7528ts)?"),
      initial: false
    });
    return response.useJs;
  }
  /**
   * 询问用户是否使用i18n
   */
  async askUseI18n() {
    const response = await prompts({
      type: "confirm",
      name: "useI18n",
      message: color.green("\u662F\u5426\u542F\u7528\u56FD\u9645\u5316(i18n)?"),
      initial: false
    });
    return response.useI18n;
  }
  /**
   * 显示确认提示
   */
  async confirm(message) {
    const response = await prompts({
      type: "confirm",
      name: "confirm",
      message: color.yellow(message),
      initial: false
    });
    return response.confirm;
  }
};

// src/commands/create.ts
async function createCommand(args) {
  const projectName = args._[1];
  if (!projectName) {
    console.log(color.red("\u8BF7\u6307\u5B9A\u9879\u76EE\u540D\u79F0"));
    console.log(color.yellow("\u7528\u6CD5: unibest create <project-name>"));
    return;
  }
  try {
    const promptHandler = new PromptHandler();
    const templateHandler = new TemplateHandler();
    const supportedUiLibraries = await templateHandler.getSupportedUiLibraries();
    const uiLibrary = args.ui || args["ui-library"] || await promptHandler.askUiLibrary(supportedUiLibraries);
    const useJs = args.js !== void 0 || args.javascript !== void 0 ? args.js || args.javascript : await promptHandler.askUseJs();
    const useI18n = args.i18n ?? await promptHandler.askUseI18n();
    console.log("\u9879\u76EE\u914D\u7F6E:");
    console.log(`  \u{1F4E6} \u9879\u76EE\u540D\u79F0: ${projectName}`);
    console.log(`  \u{1F3A8} UI\u5E93: ${uiLibrary}`);
    console.log(`  \u{1F527} js\u7248\u672C: ${useJs ? "\u662F" : "\u5426"}`);
    console.log(`  \u{1F310} i18n: ${useI18n ? "\u662F" : "\u5426"}`);
    if (!await promptHandler.confirm("\u786E\u8BA4\u521B\u5EFA\u9879\u76EE\u5417?")) {
      console.log(color.yellow("\u5DF2\u53D6\u6D88\u521B\u5EFA"));
      return;
    }
    const generator = new ProjectGenerator(projectName, {
      uiLibrary,
      useJs,
      useI18n
    });
    await generator.generate();
  } catch (error) {
    console.error(color.red(`\u521B\u5EFA\u9879\u76EE\u5931\u8D25: ${error instanceof Error ? error.message : String(error)}`));
  }
}

// src/utils/help.ts
function printHelp() {
  console.log(color.green("unibest - \u8DE8\u5E73\u53F0\u5F00\u53D1\u6846\u67B6\u811A\u624B\u67B6"));
  console.log("");
  console.log(color.blue("\u7528\u6CD5:"));
  console.log("  unibest <command> [options]");
  console.log("");
  console.log(color.blue("\u547D\u4EE4:"));
  console.log("  create <project-name>  \u521B\u5EFA\u65B0\u7684unibest\u9879\u76EE");
  console.log("  help                   \u663E\u793A\u5E2E\u52A9\u4FE1\u606F");
  console.log("  version                \u663E\u793A\u7248\u672C\u4FE1\u606F");
  console.log("");
  console.log(color.blue("\u9009\u9879:"));
  console.log("  --ui, --ui-library     \u6307\u5B9AUI\u5E93");
  console.log("  --ts, --typescript     \u4F7F\u7528TypeScript\uFF08\u9ED8\u8BA4\uFF09");
  console.log("  --js, --javascript     \u4F7F\u7528JavaScript");
  console.log("  --i18n                 \u542F\u7528i18n");
  console.log("");
  console.log(color.blue("\u793A\u4F8B:"));
  console.log("  unibest create my-project");
  console.log("  unibest create my-project --ui uv-ui --ts --i18n");
  console.log("  unibest create my-project --ui wot-ui --js");
}

// src/index.ts
function main() {
  const args = minimist(process2.argv.slice(2));
  const command = args._[0];
  console.log("command:", command);
  console.log("args:", args);
  if (args.v || args.version) {
    printVersion();
    return;
  }
  switch (command) {
    case "create":
      createCommand(args);
      break;
    case "help":
    case "-h":
    case "--help":
      printHelp();
      break;
    case "version":
      printVersion();
      break;
    default:
      if (command) {
        console.log(`\u672A\u77E5\u547D\u4EE4: ${command}`);
      }
      printHelp();
      break;
  }
}
async function printVersion() {
  try {
    const pkg = await import("./package-BYYVOA2F.js");
    console.log(pkg.default.version);
  } catch (error) {
    console.log("1.0.0");
  }
}
main();
//# sourceMappingURL=index.js.map