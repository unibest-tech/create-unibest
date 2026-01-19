import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PromptResult } from '../types'
import { version as cliVersion } from '../../package.json'
import dayjs from 'dayjs'

function replaceContent(
  filePath: string,
  projectName: string,
  version: string,
  options: PromptResult,
) {
  const fileContent = JSON.parse(readFileSync(filePath, 'utf8'))

  // 提取旧字段值
  const unibestVersion = fileContent['unibest-version']
  const unibestUpdateTime = fileContent['unibest-update-time']

  // 删除旧字段
  delete fileContent['unibest-version']
  delete fileContent['unibest-update-time']
  delete fileContent.metadata
  delete fileContent.name
  delete fileContent.version

  // 排除 options 中的 projectName
  const { projectName: _, ...restOptions } = options

  // 构建新对象，确保顺序
  const newContent = {
    name: projectName,
    type: fileContent.type, // 保持 type 在前（如果存在）
    version: version,
    unibest: {
      ...restOptions,
      cliVersion,
      unibestVersion,
      unibestUpdateTime,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
    ...fileContent, // 剩余字段
  }

  // 如果原文件没有 type 字段，newContent.type 为 undefined，JSON.stringify 会自动忽略，所以这里不需要特殊处理

  writeFileSync(filePath, JSON.stringify(newContent, null, 2))
}

export function replacePackageJson(
  root: string,
  name: string,
  version: string,
  options: PromptResult,
) {
  const projectName = name.toLocaleLowerCase().replace(/\s/g, '-')
  const pkgPath = join(root, 'package.json')

  replaceContent(pkgPath, projectName, version, options)
}
