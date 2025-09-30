/* eslint-disable style/brace-style */
/* eslint-disable style/operator-linebreak */
import type minimist from 'minimist'
import { generateProject } from './generator/index';
import { logger } from '../utils/logger'
import { promptUser, } from '../utils/prompts'
import { version } from '../../package.json'
import { intro, } from '@clack/prompts';
import { bold, yellow, green } from 'kolorist';
import getUnibestVersion from '../utils/unibestVersion';
import { checkProjectNameExistAndValidate } from '../utils/validate';

/**
 * 创建项目命令
 */
export async function createCommand(args: minimist.ParsedArgs): Promise<void> {
  const projectName = args._[1]

  const versionUnibest = await getUnibestVersion() || '3.18.3'

  intro(bold(green(`create-unibest@v${version} 快速创建 ${yellow(`unibest@v${versionUnibest}`)} 项目`)));


  // 验证项目名称
  if (projectName) {
    const errorMessage = checkProjectNameExistAndValidate(projectName);
    if (errorMessage) {
      logger.error(errorMessage);
      process.exit(1);
    }
  }

  try {
    // 获取项目配置（通过命令行参数或交互式询问）
    const projectOptions = await promptUser(projectName, args);

    // 生成项目
    await generateProject(projectOptions);

    logger.success('项目创建成功！');
  } catch (error) {
    logger.error(`创建项目失败: ${(error as Error).message}`);
    process.exit(1);
  }
}
