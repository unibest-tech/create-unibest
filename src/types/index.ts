/**
 * 项目配置选项
 */
export interface ProjectOptions {
  /** 项目名称 */
  projectName: string;
  /** 选择的平台 */
  platforms: Platform[];
  /** 选择的UI库 */
  uiLibrary: UILibrary;
  /** 选择的请求库 */
  requestLibrary: RequestLibrary;
  /** 是否启用多语言 */
  i18n: boolean;
}

/** 支持的平台类型 */
export type Platform = 'mp-weixin' | 'h5' | 'app' | 'mp-alipay' | 'mp-toutiao';

/** 支持的UI库类型 */
export type UILibrary = 'wot-ui' | 'sard-uniapp' | 'uv-ui' | 'uview-plus';

/** 支持的请求库类型 */
export type RequestLibrary = 'useRequest' | 'alovajs' | 'vue-query';

/** 交互式询问结果 */
export interface PromptResult {
  projectName: string;
  platforms: Platform[];
  uiLibrary: UILibrary;
  requestLibrary: RequestLibrary;
  i18n: boolean;
}