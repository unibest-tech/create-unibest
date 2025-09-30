import { text, multiselect, select, confirm, cancel, isCancel } from '@clack/prompts';
import { existsSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';
import type { PromptResult, Platform, UILibrary, RequestLibrary } from '../types';

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
  try {
    // 1. 项目名称（如果未通过命令行提供）
    if (!projectName) {
      const inputProjectName = await text({
        message: '请输入项目名称',
        initialValue: 'unibest-project',
        validate: (value) => {
          if (!value.trim()) return '项目名称不能为空';
          if (existsSync(join(process.cwd(), value))) {
            return '目录已存在，请选择其他名称';
          }
          return;
        }
      });

      // 处理用户取消操作
      if (isCancel(inputProjectName)) {
        cancel('操作已取消');
        process.exit(0);
      }

      projectName = inputProjectName;
    }

    // 2. 选择平台（多选）
    const platforms = await multiselect({
      message: '请选择需要支持的平台（多选）',
      options: [
        { value: 'h5', label: 'H5' },
        { value: 'mp-weixin', label: '微信小程序' },
        { value: 'app', label: 'APP' },
        { value: 'mp-alipay', label: '支付宝小程序' },
        { value: 'mp-toutiao', label: '抖音小程序' }
      ],
      initialValues: ['h5'], // 默认选择 H5
      required: true,
    });

    // 处理用户取消操作
    if (isCancel(platforms)) {
      cancel('操作已取消');
      process.exit(0);
    }

    // 3. 选择UI库（单选）
    const uiLibrary = await select({
      message: '请选择UI库',
      options: [
        { value: 'wot-ui', label: 'wot-ui' },
        { value: 'sard-uniapp', label: 'sard-uniapp' },
        { value: 'uv-ui', label: 'uv-ui' },
        { value: 'uview-plus', label: 'uview-plus' }
      ],
      initialValue: 'wot-ui'
    });

    // 处理用户取消操作
    if (isCancel(uiLibrary)) {
      cancel('操作已取消');
      process.exit(0);
    }

    // 4. 选择请求库（单选）
    const requestLibrary = await select({
      message: '请选择请求库',
      options: [
        { value: 'useRequest', label: '内置useRequest' },
        { value: 'alovajs', label: 'alovajs' },
        { value: 'vue-query', label: 'vue-query' }
      ],
      initialValue: 'useRequest'
    });

    // 处理用户取消操作
    if (isCancel(requestLibrary)) {
      cancel('操作已取消');
      process.exit(0);
    }

    // 5. 是否启用多语言（确认）
    const i18n = await confirm({
      message: '是否需要多语言支持？',
      initialValue: false
    });

    // 处理用户取消操作
    if (isCancel(i18n)) {
      cancel('操作已取消');
      process.exit(0);
    }

    return {
      projectName,
      platforms: platforms as Platform[],
      uiLibrary: uiLibrary as UILibrary,
      requestLibrary: requestLibrary as RequestLibrary,
      i18n: i18n as boolean,
    };
  } catch (error) {
    logger.error(`询问过程出错: ${(error as Error).message}`);
    process.exit(1);
  }
}