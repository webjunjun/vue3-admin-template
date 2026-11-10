# vue3-admin-template

基于 Vue 3 + TypeScript + Vite 的后台管理模板，内置 Element Plus、权限路由、国际化、Mock 服务与常用业务组件。

## 技术栈

| 分类 | 选型 |
| --- | --- |
| 框架 | Vue 3、TypeScript |
| 构建 | Vite |
| UI | Element Plus、UnoCSS |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| 国际化 | Vue I18n |
| 请求 | Axios |
| 代码规范 | ESLint、Prettier、Stylelint、Commitlint、lint-staged |
| 其他 | Three.js、LogicFlow、VueUse |

## 环境要求

- Node.js >= 18.0.0
- **包管理器：pnpm（必须）**

> 本项目通过 `preinstall` 钩子中的 `only-allow pnpm` 强制限制包管理器，**使用 `npm`、`yarn` 或 `cnpm` 安装依赖会直接失败**。
> 请勿使用 `npm i` / `npm install`，请统一使用 `pnpm`。

## 安装依赖

### 1. 安装 pnpm

如果本机还没有 pnpm，任选一种方式全局安装：

```bash
# 方式一：使用 npm 全局安装 pnpm
npm i -g pnpm

# 方式二：使用 corepack（Node.js 16.13+ 自带）
corepack enable
corepack prepare pnpm@latest --activate
```

安装完成后确认版本：

```bash
pnpm -v
```

### 2. 安装项目依赖

```bash
pnpm install
```

首次安装时，pnpm 会提示 `@logicflow/core`、`@parcel/watcher` 存在构建脚本需要授权，项目已在 `pnpm-workspace.yaml` 中白名单放行，无需手动处理。

如需还原仓库中已锁定的版本（CI 或多人协作场景）：

```bash
pnpm install --frozen-lockfile
```

### 3. 启动

```bash
pnpm dev
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器（默认端口 3000，自动打开浏览器） |
| `pnpm build` | 类型检查并构建生产包 |
| `pnpm build-only` | 仅构建，跳过类型检查 |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm type-check` | 执行 `vue-tsc --noEmit` 类型检查 |
| `pnpm lint:eslint` | ESLint 检查并自动修复 `src` 目录 |
| `pnpm lint:prettier` | Prettier 格式化 |
| `pnpm lint:stylelint` | Stylelint 检查并修复样式 |
| `pnpm commit` | 使用 cz-git 交互式生成符合规范的提交信息 |

## 环境变量

环境变量配置文件位于项目根目录：

- `.env.development`：开发环境
- `.env.production`：生产环境

| 变量 | 说明 |
| --- | --- |
| `VITE_APP_PORT` | 开发服务器端口 |
| `VITE_APP_BASE_API` | 请求代理前缀，如 `/dev-api` |
| `VITE_APP_API_URL` | 后端接口地址（代理目标） |
| `VITE_MOCK_DEV_SERVER` | 是否启用 Mock 服务（`true` / `false`） |

## 目录结构

```text
├── mock/                  # Mock 接口
├── public/                # 静态资源
├── src/
│   ├── api/               # 接口定义
│   ├── assets/            # 静态资源与图标
│   ├── components/        # 公共组件
│   ├── directive/         # 自定义指令
│   ├── enums/             # 枚举常量
│   ├── hooks/             # 组合式函数
│   ├── lang/              # 国际化语言包
│   ├── layout/            # 布局组件
│   ├── plugins/           # 插件注册
│   ├── router/            # 路由与权限控制
│   ├── store/             # Pinia 状态管理
│   ├── styles/            # 全局样式与 SCSS 变量
│   ├── types/             # 全局类型声明
│   ├── utils/             # 工具函数
│   └── views/             # 页面
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── vite.config.ts         # Vite 配置
├── uno.config.ts          # UnoCSS 配置
└── tsconfig.json          # TypeScript 配置
```

## 提交规范

项目使用 Commitizen + cz-git，并通过 Husky 在 `pre-commit`、`commit-msg` 阶段执行 lint 与提交信息校验。

```bash
pnpm commit
```

## License

[MIT](./LICENSE)
