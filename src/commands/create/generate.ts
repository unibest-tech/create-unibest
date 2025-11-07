import { join, resolve } from 'path'
import process from 'node:process'
import fsExtra from 'fs-extra'
import ejs from 'ejs'
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
  const { projectName, platforms, uiLibrary, requestLibrary, i18n } = options

  try {
    // 2. 复制基础模板
    const baseTemplatePath = resolve(__dirname, '../../templates/base')
    await copyTemplate(baseTemplatePath, root, options)
    logger.info('复制基础模板完成')

    // 3. 复制平台特定模板
    for (const platform of platforms) {
      const platformTemplatePath = resolve(__dirname, `../../templates/platforms/${platform}`)
      if (await exists(platformTemplatePath)) {
        await copyTemplate(platformTemplatePath, root, options)
        logger.info(`复制${getPlatformName(platform)}模板完成`)
      }
    }

    // 4. 复制UI库特定模板
    const uiTemplatePath = resolve(__dirname, `../../templates/ui/${uiLibrary}`)
    if (await exists(uiTemplatePath)) {
      await copyTemplate(uiTemplatePath, root, options)
      logger.info(`复制${uiLibrary}模板完成`)
    }

    // 5. 复制请求库特定模板
    const requestTemplatePath = resolve(__dirname, `../../templates/request/${requestLibrary}`)
    if (await exists(requestTemplatePath)) {
      await copyTemplate(requestTemplatePath, root, options)
      logger.info(`复制${requestLibrary}模板完成`)
    }

    // 6. 如果启用多语言，复制多语言模板
    if (i18n) {
      const i18nTemplatePath = resolve(__dirname, '../../templates/i18n')
      if (await exists(i18nTemplatePath)) {
        await copyTemplate(i18nTemplatePath, root, options)
        logger.info('复制多语言模板完成')
      }
    }

    logger.success(`项目${projectName}创建成功！`)
    logger.info('下一步:')
    logger.info(`  cd ${projectName}`)
    logger.info('  pnpm install')
    logger.info('  pnpm dev')
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
