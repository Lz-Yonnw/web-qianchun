# web-qianchun

巨量千川数据平台前端项目，当前发布版本为 **v1.0.0**。

项目包含登录页、首页数据概览、全域投放数据面板和个人中心，并根据当前账号及 URL 中的 `aavid` 参数联动展示对应数据。

## 技术栈

- Next.js 16.3.5（App Router、standalone 输出）
- React 19.2.4
- TypeScript 5（strict 模式）
- Tailwind CSS 4
- Base UI、shadcn/ui、Lucide React
- Node.js 24+

## 快速开始

```bash
npm ci
npm run dev
```

浏览器访问 `http://localhost:3000`。

生产环境构建：

```bash
npm ci
npm run build:standalone
HOSTNAME=0.0.0.0 PORT=3000 npm run start:standalone
```

## 主要页面

- `/login`：登录页
- `/home?aavid=<千川账号ID>`：首页与数据概览
- `/data/full-domain?aavid=<千川账号ID>`：全域投放数据
- `/account-center/account-info?aavid=<千川账号ID>`：个人中心

## 文档

- [编译、启动与 Linux + Nginx 部署](docs/BUILD_AND_RUN.md)
- [技术架构](docs/ARCHITECTURE.md)
- [版本记录](CHANGELOG.md)

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发服务 |
| `npm run lint` | ESLint 检查 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run build` | Next.js 生产构建 |
| `npm run build:standalone` | 构建并整理独立部署目录 |
| `npm run start` | 启动普通生产服务 |
| `npm run start:standalone` | 启动 standalone 服务 |
| `npm run check` | 依次执行 lint、类型检查和构建 |

## 版本

当前版本：`1.0.0`  
发布日期：`2026-10-25`
