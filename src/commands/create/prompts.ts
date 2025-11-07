import { text, multiselect, select, confirm, cancel, isCancel } from '@clack/prompts'
import { logger } from '../../utils/logger'
import type { PromptResult, Platform, UILibrary, RequestLibrary, FormatPlugin, TokenStrategy } from '../../types'
import { checkProjectNameExistAndValidate } from '../../utils/validate'
import { green } from 'kolorist'

/**
 * 交互式询问用户项目配置
 * @param projectName - 命令行提供的项目名称（可选）
 * @param argv - 命令行参数
 * @returns 用户选择的项目配置
 */
export async function promptUser(projectName?: string, argv: Record<string, any> = {}): Promise<PromptResult> {
  try {
    // 1. 项目名称（如果未通过命令行提供）
    if (!projectName) {
      const inputProjectName = await text({
        message: `请输入项目名称${green('[项目名称只能包含字母、数字、下划线和短横线，千万别写中文]')}`,
        initialValue: '',
        validate: value => {
          if (!value.trim()) return '项目名称不能为空'
          const errorMessage = checkProjectNameExistAndValidate(value)
          if (errorMessage) return errorMessage
          return
        },
      })

      // 处理用户取消操作
      if (isCancel(inputProjectName)) {
        cancel('操作已取消')
        process.exit(0)
      }

      projectName = inputProjectName
    }

    // 2. 选择平台（多选）
    const platforms = await multiselect({
      message: `请选择需要支持的平台（多选）${green('[脚手架将根据所选平台生成对应的平台代码，请根据实际情况选择]')}`,
      options: [
        { value: 'h5', label: 'H5' },
        { value: 'mp-weixin', label: '微信小程序' },
        { value: 'app', label: 'APP' },
        { value: 'mp-alipay', label: '支付宝小程序（包含钉钉）' },
        { value: 'mp-toutiao', label: '抖音小程序' },
      ],
      initialValues: ['h5'], // 默认选择 H5
      required: true,
    })

    // 处理用户取消操作
    if (isCancel(platforms)) {
      cancel('操作已取消')
      process.exit(0)
    }

    // 3. 选择UI库（单选）
    const uiLibrary = await select({
      message: '请选择UI库',
      options: [
        { value: 'none', label: '无UI库' },
        { value: 'wot-ui', label: 'wot-ui' },
        { value: 'uview-pro', label: 'uview-pro' },
        { value: 'sard-uniapp', label: 'sard-uniapp' },
        { value: 'uv-ui', label: 'uv-ui' },
        { value: 'uview-plus', label: 'uview-plus' },
        { value: 'skiyee-ui', label: 'skiyee-ui' },
      ],
      initialValue: 'wot-ui',
    })

    // 处理用户取消操作
    if (isCancel(uiLibrary)) {
      cancel('操作已取消')
      process.exit(0)
    }

    // 4. 是否需要”登录策略“
    const loginStrategy = await confirm({
      message: `是否需要登录策略（黑白名单、登录拦截等）？${green('[暂不知道的，选No即可，项目生成后也可以加该策略]')}`,
      initialValue: false,
    })

    // 处理用户取消操作
    if (isCancel(loginStrategy)) {
      cancel('操作已取消')
      process.exit(0)
    }

    // 5. 是否启用多语言（确认）
    const i18n = await confirm({
      message: '是否需要多语言i18n？',
      initialValue: false,
    })

    // 处理用户取消操作
    if (isCancel(i18n)) {
      cancel('操作已取消')
      process.exit(0)
    }

    // 6. 选择请求库（单选）
    // const requestLibrary = await select({
    //   message: `请选择请求库${green('[菲鸽封装的基本就够用了，除非您想用或会用 alovajs]')}`,
    //   options: [
    //     { value: 'request', label: '菲鸽封装' },
    //     { value: 'alovajs', label: 'alovajs' },
    //     // { value: 'vue-query', label: 'vue-query' },
    //   ],
    //   initialValue: 'request',
    // })

    // // 处理用户取消操作
    // if (isCancel(requestLibrary)) {
    //   cancel('操作已取消')
    //   process.exit(0)
    // }

    // // 7. 请选择”token策略“
    // const tokenStrategy = await select({
    //   message: `请选择token策略${green('[无论选择哪种，都需要后端配合使用]')}`,
    //   options: [
    //     { value: 'double-token', label: '双token策略（推荐）' },
    //     { value: 'single-token', label: '单token策略' },
    //   ],
    //   initialValue: 'double-token',
    // })
    // // 处理用户取消操作
    // if (isCancel(tokenStrategy)) {
    //   cancel('操作已取消')
    //   process.exit(0)
    // }

    // // 8. 格式化插件选择
    // const formatPlugin = await select({
    //   message: '格式化插件选择',
    //   options: [
    //     { value: 'eslint', label: 'ESLint（antfu+uni-helper配置）' },
    //     { value: 'oxclint', label: 'Oxclint + Prettier + Stylelint' },
    //   ],
    //   initialValue: 'oxclint',
    // })

    // // 处理用户取消操作
    // if (isCancel(formatPlugin)) {
    //   cancel('操作已取消')
    //   process.exit(0)
    // }

    return {
      projectName,
      platforms: platforms as Platform[],
      uiLibrary: uiLibrary as UILibrary,
      loginStrategy,
      i18n,
      // requestLibrary: requestLibrary as RequestLibrary,
      // tokenStrategy: tokenStrategy as TokenStrategy,
      // formatPlugin: formatPlugin as FormatPlugin,
    }
  } catch (error) {
    logger.error(`询问过程出错: ${(error as Error).message}`)
    process.exit(1)
  }
}
