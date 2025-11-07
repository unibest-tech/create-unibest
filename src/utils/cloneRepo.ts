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

async function cloneRepo(root: string, branch: string): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      const execStr = `git clone --depth=1 -b ${branch} ${REPO_URL} "${root}"`

      exec(execStr, async error => {
        if (error) {
          console.error(`${red('exec error:')} ${error}`)
          reject(error)
          return
        }

        try {
          await removeGitFolder(root)
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
    await cloneRepo(root, branch)
  } catch (error) {
    console.error(`${red(`模板类型${branch}下载失败！`)} ${error}`)
    process.exit(1)
  }

  // 替换package.json中的项目名称和version
  replacePackageJson(root, name, '1.0.0')
}
