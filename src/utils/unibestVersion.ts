import fetch from 'node-fetch'
import { promises as fs } from 'fs'
import { join } from 'path'
import os from 'os'

// 缓存过期时间（毫秒）- 1小时
const CACHE_EXPIRY_TIME = 60 * 60 * 1000

/**
 * Gitee API 返回的文件响应接口
 */
interface GiteeFileResponse {
  content: string
  encoding: string
}

/**
 * 版本缓存数据结构
 */
interface VersionCache {
  version: string | null
  timestamp: number
}

// 缓存文件路径
const getCacheFilePath = (): string => {
  const homeDir = os.homedir()
  const cacheDir = join(homeDir, '.unibest', 'cache')
  // ~/.unibest/cache/version.json
  return join(cacheDir, 'version.json')
}

/**
 * 从文件系统读取缓存
 * @returns 缓存数据或 null（如果缓存不存在或读取失败）
 */
async function readCacheFromFile(): Promise<VersionCache | null> {
  try {
    const cachePath = getCacheFilePath()
    const data = await fs.readFile(cachePath, 'utf8')
    return JSON.parse(data) as VersionCache
  } catch (error) {
    // 缓存文件不存在或读取失败，返回 null
    return null
  }
}

/**
 * 将缓存写入文件系统
 * @param cache 要保存的缓存数据
 */
async function writeCacheToFile(cache: VersionCache): Promise<void> {
  try {
    const cachePath = getCacheFilePath()
    const cacheDir = join(cachePath, '..')

    // 确保缓存目录存在
    try {
      await fs.mkdir(cacheDir, { recursive: true })
    } catch (mkdirError) {
      // 忽略目录已存在的错误
    }

    await fs.writeFile(cachePath, JSON.stringify(cache, null, 2))
  } catch (error) {
    // 忽略缓存写入错误，不会影响主功能
  }
}

/**
 * 获取 unibest 仓库的最新版本号（带持久化缓存机制）
 * - 优先尝试从文件缓存中读取（1小时内有效）
 * - 缓存不存在或过期时请求Gitee API获取最新版本
 * - 缓存会持久化到文件系统，在多次命令调用间保持
 * @returns 版本号字符串或 null（如果获取失败）
 */
async function getUnibestVersion(): Promise<string | null> {
  const now = Date.now()

  // 尝试从文件系统读取缓存
  const cachedData = await readCacheFromFile()
  if (cachedData && now - cachedData.timestamp < CACHE_EXPIRY_TIME) {
    return cachedData.version
  }

  try {
    const apiUrl = `https://gitee.com/api/v5/repos/feige996/unibest/contents/package.json?ref=main`
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = (await response.json()) as GiteeFileResponse
      const { content, encoding } = data

      if (encoding === 'base64') {
        // 使用 Node.js 内置的 Buffer 解码 base64 内容
        const decodedContent = Buffer.from(content, 'base64').toString('utf8')
        const packageJson = JSON.parse(decodedContent)
        const version = packageJson.version || null

        // 创建新的缓存数据
        const newCache: VersionCache = {
          version,
          timestamp: now,
        }

        // 异步写入缓存到文件系统（不阻塞主流程）
        void writeCacheToFile(newCache)

        return version
      } else {
        // console.error(`Unsupported encoding: ${encoding}`);
        return null
      }
    } else {
      // console.error(`Request failed with status: ${response.status}`);
      // 即使API请求失败，如果有缓存也可以返回过期的缓存作为降级方案
      return cachedData?.version || null
    }
  } catch (error) {
    // console.error(`An error occurred: ${error}`);
    // 异常情况下也可以返回过期的缓存作为降级方案
    return cachedData?.version || null
  }
}

/**
 * 清除版本缓存（用于测试或手动刷新）
 */
export async function clearVersionCache(): Promise<void> {
  try {
    const cachePath = getCacheFilePath()
    await fs.unlink(cachePath)
  } catch (error) {
    // 忽略文件不存在的错误
  }
}

export default getUnibestVersion
