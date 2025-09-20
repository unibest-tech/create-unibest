import { color } from './color'

/**
 * 打印帮助信息
 */
export function printHelp(): void {
  console.log(color.green('unibest - 跨平台开发框架脚手架'))
  console.log('')
  console.log(color.blue('用法:'))
  console.log('  unibest <command> [options]')
  console.log('')
  console.log(color.blue('命令:'))
  console.log('  create <project-name>  创建新的unibest项目')
  console.log('  switch-ui <ui-library>  切换项目的UI库')
  console.log('  add-i18n               为项目添加i18n支持')
  console.log('  help                   显示帮助信息')
  console.log('  version                显示版本信息')
  console.log('')
  console.log(color.blue('选项:'))
  console.log('  --ui, --ui-library     指定UI库')
  console.log('  --ts, --typescript     使用TypeScript（默认）')
  console.log('  --js, --javascript     使用JavaScript')
  console.log('  --i18n                 启用i18n')
  console.log('')
  console.log(color.blue('示例:'))
  console.log('  unibest create my-project')
  console.log('  unibest create my-project --ui uv-ui --ts --i18n')
  console.log('  unibest create my-project --ui wot-design-uni --js')
}
