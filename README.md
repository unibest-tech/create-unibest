<h1 align="center">✨create unibest✨</h1>

<p align="center">
    <a href="https://www.npmjs.com/package/create-unibest"><img src="https://img.shields.io/npm/dm/create-unibest?colorA=363a4f&colorB=f5a97f&style=for-the-badge"></a>
    <a href="https://www.npmjs.com/package/create-unibest"><img src="https://img.shields.io/npm/v/create-unibest?colorA=363a4f&colorB=a6da95&style=for-the-badge"></a>
</p>

<h2 align="center">
<sub>>_ Easy to use create unibest</sub>
</h2>

## 📖 介绍

`create-unibest` 是一个用于快速创建 `unibest` 项目的轻量脚手架工具，它可以帮助你快速创建一个基于 `vite` + `vue3` + `TS` 的 `uni-app` 项目，同时提供了一些模板供你选择。

## 🚤 快速使用

```shell
pnpm create unibest <command> [options]              # 基本命令格式
pnpm create unibest my-project                       # 创建新的unibest项目
pnpm create unibest -v                               # 查看版本信息
pnpm create unibest -h                               # 查看帮助信息
```

### 命令行参数

支持通过命令行参数跳过交互式询问，实现静默/快捷创建。

| 参数         | 简写 | 说明         | 可选值 / 示例                                                                                          |
| :----------- | :--- | :----------- | :----------------------------------------------------------------------------------------------------- |
| `--platform` | `-p` | 指定平台     | `h5`, `mp-weixin`, `app`, `mp-alipay`, `mp-toutiao`<br>示例: `-p h5,mp-weixin` 或 `-p h5 -p mp-weixin` |
| `--ui`       | `-u` | 指定 UI 库   | `wot-ui`, `uview-pro`, `sard-uniapp`, `uv-ui`, `uview-plus`, `none`                                    |
| `--login`    | `-l` | 启用登录策略 | 无值，存在即开启                                                                                       |
| `--i18n`     | `-i` | 启用多语言   | 无值，存在即开启                                                                                       |

#### 示例

```bash
# 1. 基础用法：指定 UI 库和平台（H5 + 微信小程序）
pnpm create unibest my-project -u wot-ui -p h5,mp-weixin

# 2. 进阶用法：指定 UI 库，并开启登录策略和多语言
pnpm create unibest my-project -u uview-plus -l -i

# 3. 极简用法：不使用 UI 库，但支持多端（H5 + App + 微信小程序）
pnpm create unibest my-project -u none -p h5,app,mp-weixin
```

### 全局安装（可选）

```shell
npm i -g create-unibest           # 全局安装，得到 best 命令
npm update -g create-unibest      # 更新 create-unibest 包
```

安装后可使用的命令：

```shell
best <command> [options]          # 基本命令格式
best my-project                   # 创建新的unibest项目
best -v                           # 查看版本信息
best -h                           # 查看帮助信息
```
