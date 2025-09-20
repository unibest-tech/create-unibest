import type minimist from 'minimist'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import { color } from '../utils/color'
import { TemplateHandler } from '../utils/template'

/**
 * 切换UI库命令
 */
export async function switchUiCommand(args: minimist.ParsedArgs): Promise<void> {
  const targetUi = args._[1]

  if (!targetUi) {
    console.log(color.red('请指定目标UI库'))
    console.log(color.yellow('用法: unibest switch-ui <ui-library>'))
    return
  }

  try {
    const currentDir = process.cwd()
    const templateHandler = new TemplateHandler()

    // 1. 检查目标UI库是否受支持
    const supportedUiLibraries = await templateHandler.getSupportedUiLibraries()
    if (!supportedUiLibraries.includes(targetUi)) {
      console.log(color.red(`不支持的UI库: ${targetUi}`))
      console.log(color.yellow(`支持的UI库: ${supportedUiLibraries.join(', ')}`))
      return
    }

    // 2. 检查当前目录是否是unibest项目
    if (!(await fs.pathExists(path.join(currentDir, 'package.json')))) {
      console.log(color.red('当前目录不是unibest项目'))
      return
    }

    // 3. 读取项目配置信息
    const packageJson = await fs.readJSON(path.join(currentDir, 'package.json'))

    // 判断项目是JS还是TS版本
    const useJs = !(await fs.pathExists(path.join(currentDir, 'tsconfig.json')))

    console.log(`正在从当前UI库切换到: ${targetUi}`)

    // 4. 备份package.json，以防切换失败
    const backupPackageJson = path.join(currentDir, 'package.json.backup')
    await fs.writeJSON(backupPackageJson, packageJson, { spaces: 2 })

    try {
      // 5. 移除可能存在的旧UI库文件
      const uiDirsToRemove = supportedUiLibraries.map(ui =>
        path.join(currentDir, 'src', 'components', `ui-${ui}`),
      )

      for (const dir of uiDirsToRemove) {
        if (await fs.pathExists(dir)) {
          await fs.remove(dir)
        }
      }

      // 6. 复制新UI库的模板文件
      const uiTemplatePath = templateHandler.getUiTemplatePath(targetUi)
      const languageDir = useJs ? 'js' : 'ts'
      const specificUiTemplatePath = path.join(uiTemplatePath, languageDir)

      if (await fs.pathExists(specificUiTemplatePath)) {
        await templateHandler.copyTemplate(specificUiTemplatePath, currentDir, {
          useJs,
          uiLibrary: targetUi,
        })
      }

      // 7. 更新package.json中的UI库依赖
      // 这里需要根据具体UI库添加相应的依赖
      updatePackageJsonForUi(packageJson, targetUi)
      await fs.writeJSON(path.join(currentDir, 'package.json'), packageJson, { spaces: 2 })

      // 8. 清理备份文件
      await fs.remove(backupPackageJson)

      console.log(color.green(`✅ UI库已成功切换到: ${targetUi}`))
      console.log(color.yellow('💡 建议运行 pnpm install 来安装新的依赖'))
    }
    catch (error) {
      // 出错时恢复package.json
      if (await fs.pathExists(backupPackageJson)) {
        await fs.copyFile(backupPackageJson, path.join(currentDir, 'package.json'))
        await fs.remove(backupPackageJson)
      }
      throw error
    }
  }
  catch (error) {
    console.error(color.red(`切换UI库失败: ${error instanceof Error ? error.message : String(error)}`))
  }
}

/**
 * 根据UI库更新package.json
 */
function updatePackageJsonForUi(packageJson: any, uiLibrary: string): void {
  // 确保dependencies对象存在
  if (!packageJson.dependencies) {
    packageJson.dependencies = {}
  }

  // 这里是示例实现，需要根据实际支持的UI库进行扩展
  switch (uiLibrary) {
    case 'uv-ui':
      // 添加uv-ui依赖，移除其他UI库依赖
      packageJson.dependencies['uv-ui'] = '^1.0.0'
      delete packageJson.dependencies['wot-design-uni']
      delete packageJson.dependencies['uview-plus']
      break
    case 'wot-design-uni':
      // 添加wot-design-uni依赖，移除其他UI库依赖
      packageJson.dependencies['wot-design-uni'] = '^1.0.0'
      delete packageJson.dependencies['uv-ui']
      delete packageJson.dependencies['uview-plus']
      break
    case 'uview-plus':
      // 添加uview-plus依赖，移除其他UI库依赖
      packageJson.dependencies['uview-plus'] = '^1.0.0'
      delete packageJson.dependencies['uv-ui']
      delete packageJson.dependencies['wot-design-uni']
      break
    // 可以根据实际支持的UI库添加更多case
  }
}
