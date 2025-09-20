/* eslint-disable style/brace-style */
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import { TemplateHandler } from './template'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 文件生成器类
 */
export class ProjectGenerator {
  private templateHandler: TemplateHandler
  private projectName: string
  private projectPath: string
  private uiLibrary: string
  private useJs: boolean
  private useI18n: boolean

  constructor(
    projectName: string,
    options: {
      uiLibrary: string
      useJs: boolean
      useI18n: boolean
    },
  ) {
    this.templateHandler = new TemplateHandler()
    this.projectName = projectName
    this.projectPath = path.resolve(process.cwd(), projectName)
    this.uiLibrary = options.uiLibrary
    this.useJs = options.useJs
    this.useI18n = options.useI18n
  }

  /**
   * 生成项目
   */
  public async generate(): Promise<void> {
    // 检查项目目录是否已存在
    if (await fs.pathExists(this.projectPath)) {
      throw new Error(`项目目录 ${this.projectName} 已存在`)
    }

    try {
      // 1. 复制基础模板
      await this.copyBaseTemplate()

      // 2. 复制UI库特定模板
      await this.copyUiTemplate()

      // 3. 如果需要i18n，复制i18n模板
      if (this.useI18n) {
        await this.copyI18nTemplate()
      }

      // 4. 生成项目配置文件
      await this.generateConfigFiles()

      console.log(`✅ 项目 ${this.projectName} 创建成功！`)
      console.log(`📁 目录: ${this.projectPath}`)
      console.log(`💡 下一步: cd ${this.projectName} && pnpm install`)
    } catch (error) {
      // 出错时清理已创建的目录
      if (await fs.pathExists(this.projectPath)) {
        await fs.remove(this.projectPath)
      }
      throw error
    }
  }

  /**
   * 复制基础模板
   */
  private async copyBaseTemplate(): Promise<void> {
    const baseTemplatePath = this.templateHandler.getBaseTemplatePath()
    await this.templateHandler.copyTemplate(baseTemplatePath, this.projectPath, {
      projectName: this.projectName,
      useJs: this.useJs,
      useI18n: this.useI18n,
      uiLibrary: this.uiLibrary,
    })
  }

  /**
   * 复制UI库特定模板
   */
  private async copyUiTemplate(): Promise<void> {
    const uiTemplatePath = this.templateHandler.getUiTemplatePath(this.uiLibrary)

    // 检查UI库模板是否存在
    if (!(await fs.pathExists(uiTemplatePath))) {
      throw new Error(`不支持的UI库: ${this.uiLibrary}`)
    }

    // 复制TS或JS模板
    const languageDir = this.useJs ? 'js' : 'ts'
    const specificUiTemplatePath = path.join(uiTemplatePath, languageDir)

    if (await fs.pathExists(specificUiTemplatePath)) {
      await this.templateHandler.copyTemplate(specificUiTemplatePath, this.projectPath, {
        projectName: this.projectName,
        useJs: this.useJs,
        useI18n: this.useI18n,
        uiLibrary: this.uiLibrary,
      })
    }
  }

  /**
   * 复制i18n模板
   */
  private async copyI18nTemplate(): Promise<void> {
    const i18nTemplatePath = this.templateHandler.getI18nTemplatePath()
    await this.templateHandler.copyTemplate(i18nTemplatePath, this.projectPath, {
      projectName: this.projectName,
      useJs: this.useJs,
      useI18n: this.useI18n,
      uiLibrary: this.uiLibrary,
    })
  }

  /**
   * 生成项目配置文件
   */
  private async generateConfigFiles(): Promise<void> {
    // 这里可以根据需要生成或修改项目配置文件
    // 例如 package.json, tsconfig.json, vite.config.ts 等
    // 这个方法可以根据项目需求进行扩展
  }
}
