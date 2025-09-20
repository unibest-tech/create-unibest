/* eslint-disable style/brace-style */
/* eslint-disable style/operator-linebreak */
import type minimist from 'minimist'
import { color } from '../utils/color'
import { ProjectGenerator } from '../utils/generator'
import { PromptHandler } from '../utils/prompt'
import { TemplateHandler } from '../utils/template'

/**
 * 创建项目命令
 */
export async function createCommand(args: minimist.ParsedArgs): Promise<void> {
  const projectName = args._[1]

  if (!projectName) {
    console.log(color.red('请指定项目名称'))
    console.log(color.yellow('用法: unibest create <project-name>'))
    return
  }

  try {
    const promptHandler = new PromptHandler()
    const templateHandler = new TemplateHandler()

    // 获取支持的UI库列表
    const supportedUiLibraries = await templateHandler.getSupportedUiLibraries()

    // 如果没有预定义的参数，则询问用户
    const uiLibrary = args.ui || args['ui-library'] || (await promptHandler.askUiLibrary(supportedUiLibraries))

    // 优化：默认使用TypeScript，只有显式指定js参数时才使用JavaScript
    // 如果未指定js参数，则询问用户
    const useJs =
      args.js !== undefined || args.javascript !== undefined
        ? args.js || args.javascript
        : await promptHandler.askUseJs()

    const useI18n = args.i18n ?? (await promptHandler.askUseI18n())

    console.log('项目配置:')
    console.log(`  📦 项目名称: ${projectName}`)
    console.log(`  🎨 UI库: ${uiLibrary}`)
    console.log(`  🔧 js版本: ${useJs ? '是' : '否'}`)
    console.log(`  🌐 i18n: ${useI18n ? '是' : '否'}`)

    // 确认创建
    if (!(await promptHandler.confirm('确认创建项目吗?'))) {
      console.log(color.yellow('已取消创建'))
      return
    }

    // 生成项目
    const generator = new ProjectGenerator(projectName, {
      uiLibrary,
      useJs,
      useI18n,
    })

    await generator.generate()
  } catch (error) {
    console.error(color.red(`创建项目失败: ${error instanceof Error ? error.message : String(error)}`))
  }
}
