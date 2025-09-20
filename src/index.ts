#!/usr/bin/env node
import process from 'node:process'
import minimist from 'minimist'
import { addI18nCommand } from './commands/add-i18n'
import { createCommand } from './commands/create'
import { switchUiCommand } from './commands/switch-ui'
import { printHelp } from './utils/help'

/**
 * unibest-cli 主入口函数
 */
function main() {
  const args = minimist(process.argv.slice(2))
  const command = args._[0]

  // 根据命令执行不同的功能
  switch (command) {
    case 'create':
      createCommand(args)
      break
    case 'switch-ui':
      switchUiCommand(args)
      break
    case 'add-i18n':
      addI18nCommand(args)
      break
    case 'help':
    case '-h':
    case '--help':
      printHelp()
      break
    case 'version':
    case '-v':
    case '--version':
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
  }
  catch (error) {
    console.log('1.0.0')
  }
}

// 执行主函数
main()
