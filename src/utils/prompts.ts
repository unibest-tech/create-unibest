import prompts from 'prompts';
import { existsSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';
import type { PromptResult, Platform, UILibrary, RequestLibrary, } from '../types';

/**
 * 交互式询问用户项目配置
 * @param projectName - 命令行提供的项目名称（可选）
 * @param argv - 命令行参数
 * @returns 用户选择的项目配置
 */
export async function promptUser(
  projectName?: string,
  argv: Record<string, any> = {}
): Promise<PromptResult> {
  const questions: prompts.PromptObject[] = [];

  // 1. 项目名称（如果未通过命令行提供）
  if (!projectName) {
    questions.push({
      type: 'text',
      name: 'projectName',
      message: '请输入项目名称',
      initial: 'unibest-project',
      validate: (value) => {
        if (!value.trim()) return '项目名称不能为空';
        if (existsSync(join(process.cwd(), value))) {
          return '目录已存在，请选择其他名称';
        }
        return true;
      }
    });
  }

  // 2. 选择平台（多选）
  questions.push({
    type: 'multiselect',
    name: 'platforms',
    message: '请选择需要支持的平台',
    choices: [
      { title: 'H5', value: 'h5' },
      { title: '微信小程序', value: 'mp-weixin' },
      { title: 'APP', value: 'app' },
      { title: '支付宝小程序', value: 'mp-alipay' },
      { title: '抖音小程序', value: 'mp-toutiao' }
    ],
    min: 1,
    initial: 0,
    hint: '按空格键选择，按回车键确认'
  });

  // 3. 选择UI库（单选）
  questions.push({
    type: 'select',
    name: 'uiLibrary',
    message: '请选择UI库',
    choices: [
      { title: 'wot-ui', value: 'wot-ui' },
      { title: 'sard-uniapp', value: 'sard-uniapp' },
      { title: 'uv-ui', value: 'uv-ui' },
      { title: 'uview-plus', value: 'uview-plus' }
    ],
    initial: 0
  });

  // 4. 选择请求库（单选）
  questions.push({
    type: 'select',
    name: 'requestLibrary',
    message: '请选择请求库',
    choices: [
      { title: '内置useRequest', value: 'useRequest' },
      { title: 'alovajs', value: 'alovajs' },
      { title: 'vue-query', value: 'vue-query' }
    ],
    initial: 0
  });

  // 5. 是否启用多语言（确认）
  questions.push({
    type: 'confirm',
    name: 'i18n',
    message: '是否需要多语言支持？',
    initial: false
  });


  try {
    const answers = await prompts(questions, {
      onCancel: () => {
        logger.error('操作已取消');
        process.exit(1);
      }
    });

    return {
      projectName: projectName || answers.projectName,
      platforms: answers.platforms as Platform[],
      uiLibrary: answers.uiLibrary as UILibrary,
      requestLibrary: answers.requestLibrary as RequestLibrary,
      i18n: answers.i18n as boolean,
      root: process.cwd()
    };
  } catch (error) {
    logger.error(`询问过程出错: ${(error as Error).message}`);
    process.exit(1);
  }
}