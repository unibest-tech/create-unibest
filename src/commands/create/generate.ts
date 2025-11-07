import { join } from 'path'
import process from 'node:process'
import fsExtra from 'fs-extra'
import { logger } from '../../utils/logger'
import { renderTemplate } from '../../utils/ejs'
import type { PromptResult } from '../../types'
import { debug } from '../../utils/debug'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const { copy, ensureDir, readdir, stat, writeFile } = fsExtra
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
  } else if (!loginStrategy && i18n) {
    debug('拉取 base-i18n 分支')
  } else if (loginStrategy && !i18n) {
    debug('拉取 base-login 分支')
  } else if (loginStrategy && i18n) {
    debug('拉取 base-login-i18n 分支')
  }
  // 平台相关代码的处理（暂不处理）

  // ui库引入
  if (uiLibrary === 'none') {
    debug('不引入任何UI库')
  } else if (uiLibrary === 'wot-ui') {
    debug('引入 wot-ui 库')
  } else if (uiLibrary === 'sard-ui') {
    debug('引入 sard-ui 库')
  } else if (uiLibrary === 'uview-pro') {
    debug('引入 uview-pro 库')
  } else if (uiLibrary === 'uv-ui') {
    debug('引入 uv-ui 库')
  } else if (uiLibrary === 'uview-plus') {
    debug('引入 uview-plus 库')
  } else if (uiLibrary === 'skyiee-ui') {
    debug('引入 skyiee-ui 库')
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

/**
 * 复制并渲染模板文件
 * @param src - 模板源目录
 * @param dest - 目标目录
 * @param data - 模板渲染数据
 */
async function copyTemplate(src: string, dest: string, data: any) {
  const entries = await readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name.replace(/\.ejs$/, '')) // 移除.ejs扩展名

    if (entry.isDirectory()) {
      await ensureDir(destPath)
      await copyTemplate(srcPath, destPath, data)
    } else {
      if (entry.name.endsWith('.ejs')) {
        // 渲染EJS模板
        const content = await renderTemplate(srcPath, data)
        await writeFile(destPath, content)
      } else {
        // 直接复制文件
        await copy(srcPath, destPath)
      }
    }
  }
}

/**
 * 检查路径是否存在
 * @param path - 要检查的路径
 * @returns 是否存在
 */
async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

/**
 * 获取平台中文名称
 * @param platform - 平台标识
 * @returns 中文名称
 */
function getPlatformName(platform: string): string {
  const names: Record<string, string> = {
    'mp-weixin': '微信小程序',
    h5: 'H5',
    'app-plus': 'APP',
    'mp-alipay': '支付宝小程序',
    'mp-toutiao': '抖音小程序',
  }
  return names[platform] || platform
}
