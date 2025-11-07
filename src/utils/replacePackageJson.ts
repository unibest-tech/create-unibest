import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function replaceContent(filePath: string, projectName: string, version: string) {
  const fileContent = JSON.parse(readFileSync(filePath, 'utf8'))
  fileContent.name = projectName
  fileContent.version = version
  writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
}

export function replacePackageJson(root: string, name: string, version: string) {
  const projectName = name.toLocaleLowerCase().replace(/\s/g, '-')
  const pkgPath = join(root, 'package.json')

  replaceContent(pkgPath, projectName, version)
}
