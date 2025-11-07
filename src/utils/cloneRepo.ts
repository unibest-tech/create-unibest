import { exec } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { bold, red } from 'kolorist'
import { replacePackageJson } from './replacePackageJson'

async function removeGitFolder(localPath: string): Promise<void> {
  const gitFolderPath = join(localPath, '.git')
  await fs.rm(gitFolderPath, { recursive: true, force: true })
}

const REPO_URL = 'https://gitee.com/feige996/unibest.git'

async function cloneRepo(projectName: string, branch: string): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      const execStr = `git clone --depth=1 -b ${branch} ${REPO_URL} "${projectName}"`

      exec(execStr, async error => {
        if (error) {
          console.error(`${red('exec error:')} ${error}`)
          reject(error)
          return
        }

        try {
          await removeGitFolder(projectName)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    })
    return
  } catch (error) {
    console.error(`${red('cloneRepo error:')} ${error}`)
    throw new Error('cloneRepo error')
  }
}

export async function cloneRepoByBranch(root: string, name: string, branch: string) {
  try {
    await cloneRepo(name, branch)
  } catch (error) {
    console.error(`${red(`模板类型${branch}下载失败！`)} ${error}`)
    process.exit(1)
  }

  // 替换package.json中的项目名称和version
  // 注意：package.json位于克隆的项目目录中，因此需要拼接正确的路径
  const projectPath = join(root, name)
  replacePackageJson(projectPath, name, '1.0.0')
}
