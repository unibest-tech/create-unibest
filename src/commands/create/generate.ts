import process from 'node:process'
import { logger } from '../../utils/logger'
import type { PromptResult } from '../../types'
import { cloneRepoByBranch } from '../../utils/cloneRepo'
import { applyUILibraryConfig } from '../../utils/uiLibrary'
import { debug } from '../../utils/debug'
import path from 'node:path'

const root = process.cwd()
/**
 * 生成项目主函数
 * @param options - 项目配置选项
 */
export async function generateProject(options: PromptResult) {
  debug('generateProject options', options)
  const { projectName, platforms, uiLibrary, loginStrategy, i18n } = options

  if (!loginStrategy && !i18n) {
    debug('拉取 base 分支')
    await cloneRepoByBranch(root, projectName, 'base')
  } else if (!loginStrategy && i18n) {
    debug('拉取 base-i18n 分支')
    await cloneRepoByBranch(root, projectName, 'base-i18n')
  } else if (loginStrategy && !i18n) {
    debug('拉取 base-login 分支')
    await cloneRepoByBranch(root, projectName, 'base-login')
  } else if (loginStrategy && i18n) {
    debug('拉取 base-login-i18n 分支')
    await cloneRepoByBranch(root, projectName, 'base-login-i18n')
  }
  // 平台相关代码的处理（暂不处理）

  // UI 库配置
  const projectPath = path.join(root, projectName)
  if (uiLibrary === 'none') {
    debug('不引入任何UI库')
  } else {
    debug(`配置 UI 库: ${uiLibrary}`)
    try {
      await applyUILibraryConfig(projectPath, uiLibrary)
      logger.success(`UI 库 ${uiLibrary} 配置完成`)
    } catch (error) {
      logger.warn(`UI 库 ${uiLibrary} 配置失败: ${(error as Error).message}`)
      logger.info('您可以在项目创建后手动配置 UI 库')
    }
  }

  try {
    logger.success(`项目${projectName}创建成功！`)
    logger.info('下一步:')
    logger.info(`  cd ${projectName}`)
    logger.info('  pnpm install')
    logger.info('  pnpm dev')
    logger.info('  运行完以上命令后，即可在对应平台上运行项目')
    logger.info('  如：pnpm dev:mp, pnpm dev:app 等')
  } catch (error) {
    logger.error(`生成项目失败: ${(error as Error).message}`)
    throw error
  }
}
