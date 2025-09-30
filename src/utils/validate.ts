import { logger } from './logger';

/**
 * 验证项目名称是否符合规范
 * npm包命名规则：只能包含小写字母、数字、连字符和下划线，且不能以连字符开头或结尾
 * @param name - 项目名称
 * @returns 是否有效
 */
export function validateProjectName(name: string): boolean {
  const reg = /^[a-z0-9_-]+$/;
  if (!reg.test(name)) {
    return false;
  }
  if (name.startsWith('-') || name.endsWith('-')) {
    return false;
  }
  return true;
}

/**
 * 验证项目配置是否完整
 * @param options - 项目配置选项
 * @returns 是否有效
 */
export function validateProjectOptions(options: Record<string, any>): boolean {
  const requiredFields = ['projectName', 'platforms', 'uiLibrary', 'requestLibrary'];
  const missingFields = requiredFields.filter(field => !options[field]);

  if (missingFields.length > 0) {
    logger.error(`项目配置不完整，缺少以下字段: ${missingFields.join(', ')}`);
    return false;
  }

  if (!Array.isArray(options.platforms) || options.platforms.length === 0) {
    logger.error('至少需要选择一个平台');
    return false;
  }

  return true;
}