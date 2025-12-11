# 开发者文档

## 调试

```sh
- npm run dev
- pnpm start -v
- pnpm start new my-project
```

## 设计

```sh
- npm i -g create-unibest
- best -v
- best my-project // 不用 new 也可以直接创建项目
- best new my-project
- best new my-project -q (快速创建，等价于 best new my-project --quick)
- best new my-project --platform [h5,app,mp-weixin,mp-alipay] --double-token-strategy
```

## 发布

```sh
- npm run build
- npm login  # 注意切换 npm 原
- npm publish
```
