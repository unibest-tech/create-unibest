#!/usr/bin/env node
import process from 'node:process'
import minimist from 'minimist'
import { createCommand } from './commands/create'
import { printHelp } from './utils/help'
import { color } from './utils/color'
import { debug } from './utils/debug' // 导入我们的debug工具函数

/**
 * unibest-cli 主入口函数
 */
function main() {
  const args = minimist(process.argv.slice(2))
  const command = args._[0]
  debug('command:', command)
  debug('args:', args)

  // 首先检查版本相关的选项
  if (args.v || args.version) {
    printVersion()
    return
  }

  // 根据命令执行不同的功能
  switch (command) {
    case 'create':
      createCommand(args)
      break
    case 'help':
    case '-h':
    case '--help':
      printHelp()
      break
    case 'version':
      printVersion()
      break
    default:
      if (command) {
        console.log(color.red(`未知命令: ${command}`))
      }
      printHelp()
      break
  }
}

/**
 * 打印版本信息
 */
async function printVersion() {
  try {
    const pkg = await import('../package.json')
    console.log(color.green(pkg.default.version))
  } catch (error) {
    console.log(color.red('1.0.0'))
  }
}

// 执行主函数
main()
