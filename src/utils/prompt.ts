import prompts from 'prompts'
import { color } from './color'

/**
 * 用户交互提示工具类
 */
export class PromptHandler {
  /**
   * 询问用户选择UI库
   */
  public async askUiLibrary(choices: string[]): Promise<string> {
    const response = await prompts({
      type: 'select',
      name: 'uiLibrary',
      message: color.green('请选择UI库:'),
      choices: choices.map(ui => ({
        title: ui,
        value: ui,
      })),
      initial: 0,
    })
    return response.uiLibrary
  }

  /**
   * 询问用户是否使用 js
   */
  public async askUseJs(): Promise<boolean> {
    const response = await prompts({
      type: 'confirm',
      name: 'useJs',
      message: color.green('是否使用js版本(默认使用ts)?'),
      initial: false,
    })
    return response.useJs
  }

  /**
   * 询问用户是否使用i18n
   */
  public async askUseI18n(): Promise<boolean> {
    const response = await prompts({
      type: 'confirm',
      name: 'useI18n',
      message: color.green('是否启用国际化(i18n)?'),
      initial: false,
    })
    return response.useI18n
  }

  /**
   * 显示确认提示
   */
  public async confirm(message: string): Promise<boolean> {
    const response = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: color.yellow(message),
      initial: false,
    })
    return response.confirm
  }
}
