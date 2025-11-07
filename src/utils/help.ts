import { color } from './color'

/**
 * 打印帮助信息
 */
export function printHelp(): void {
  console.log(color.green('\ncreate-unibest - 跨平台开发框架脚手架'))
  console.log('')
  console.log(color.blue('全局安装:'))
  console.log(color.green('  npm i -g create-unibest                    全局安装，得到 best 命令'))
  console.log(color.green('  npm update -g create-unibest               更新 create-unibest 包'))
  console.log('')
  console.log(color.green('  best <command> [options]'))
  console.log(color.green('  best new my-project                        创建新的unibest项目'))
  console.log(color.green('  best -v                                    查看版本信息'))
  console.log(color.green('  best -h                                    查看帮助信息'))
  console.log('')
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
  console.log(color.blue('临时使用:'))
  console.log(color.green('  pnpm create unibest <command> [options]'))
  console.log(color.green('  pnpm create unibest new my-project         创建新的unibest项目'))
  console.log(color.green('  pnpm create unibest -v                     查看版本信息'))
  console.log(color.green('  pnpm create unibest -h                     查看帮助信息'))
  console.log('')
}
