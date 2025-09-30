#!/usr/bin/env node
/* eslint-disable style/brace-style */
import process from 'node:process'
import minimist from 'minimist'
import { createCommand } from './commands/create'
import { printHelp } from './utils/help'
const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * unibest-cli 主入口函数
 */
function main() {
  const args = minimist(process.argv.slice(2))
  const command = args._[0]
  IS_DEV && console.log('command:', command)
  IS_DEV && console.log('args:', args)

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
        console.log(`未知命令: ${command}`)
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
    console.log(pkg.default.version)
  } catch (error) {
    console.log('1.0.0')
  }
}

// 执行主函数
main()
