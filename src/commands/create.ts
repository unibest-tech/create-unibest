/* eslint-disable style/brace-style */
/* eslint-disable style/operator-linebreak */
import type minimist from 'minimist'
import { generateProject } from './generator/index';
import { validateProjectName } from '../utils/validate'
import { logger } from '../utils/logger'
import { promptUser } from '../utils/prompts'

/**
 * 创建项目命令
 */
export async function createCommand(args: minimist.ParsedArgs): Promise<void> {
  const projectName = args._[1]

  // 验证项目名称
  if (projectName && !validateProjectName(projectName)) {
    logger.error('项目名称不符合规范，请使用字母、数字、连字符或下划线');
    process.exit(1);
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
