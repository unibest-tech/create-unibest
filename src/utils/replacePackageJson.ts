import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PromptResult } from '../types'
import { version as cliVersion } from '../../package.json'
import dayjs from 'dayjs'

function replaceContent(
  filePath: string,
  projectName: string,
  version: string,
  unibestVersion: string,
  options: PromptResult,
) {
  const fileContent = JSON.parse(readFileSync(filePath, 'utf8'))
  fileContent.name = projectName
  fileContent.version = version

  // 写入 unibest 配置信息
  fileContent.metadata = {
    ...options,
    cliVersion,
    unibestVersion,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }

  writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
}

export function replacePackageJson(
  root: string,
  name: string,
  version: string,
  unibestVersion: string,
  options: PromptResult,
) {
  const projectName = name.toLocaleLowerCase().replace(/\s/g, '-')
  const pkgPath = join(root, 'package.json')

  replaceContent(pkgPath, projectName, version, unibestVersion, options)
}
