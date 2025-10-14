import fetch from 'node-fetch'

/**
 * Gitee API 返回的文件响应接口
 */
interface GiteeFileResponse {
  content: string
  encoding: string
}

/**
 * 获取 unibest 仓库的最新版本号
 * @returns 版本号字符串或 null（如果获取失败）
 */
async function getUnibestVersion(): Promise<string | null> {
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
        return packageJson.version || null
      } else {
        // console.error(`Unsupported encoding: ${encoding}`);
        return null
      }
    } else {
      // console.error(`Request failed with status: ${response.status}`);
      return null
    }
  } catch (error) {
    // console.error(`An error occurred: ${error}`);
    return null
  }
}

export default getUnibestVersion
