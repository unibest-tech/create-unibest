import { color } from './color'

/**
 * 打印帮助信息
 */
export function printHelp(): void {
  console.log(color.green('\ncreate-unibest - 跨平台开发框架脚手架'))
  console.log('')
  console.log(color.blue('全局安装:'))
  console.log('  pnpm install -g create-unibest')
  console.log('  best new my-project')
  console.log('  best create my-project (new 同 create)')
  console.log('')
  console.log(color.blue('临时使用:'))
  console.log('  pnpm create unibest@latest new my-project')
  // console.log('  best <command> [options]')
  // console.log('  create-unibest <command> [options]')
  // console.log('')
  // console.log(color.blue('命令:'))
  // console.log('  new <project-name>     创建新的unibest项目')
  // console.log('  create <project-name>  创建新的unibest项目（兼容模式）')
  // console.log('  help                   显示帮助信息')
  // console.log('  version                显示版本信息')
  // console.log('')
  // console.log(color.blue('选项:'))
  // console.log('  --ui, --ui-library     指定UI库')
  // console.log('  --ts, --typescript     使用TypeScript（默认）')
  // console.log('  --js, --javascript     使用JavaScript')
  // console.log('  --i18n                 启用i18n')
  // console.log('')
  // console.log(color.blue('示例:'))
  // console.log('  best new my-project')
  // console.log('  best new my-project --ui uv-ui --ts --i18n')
  // console.log('  create-unibest new my-project --ui wot-ui --js')
  console.log('')
}
