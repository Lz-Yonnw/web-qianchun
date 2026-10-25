# 技术架构

## 1. 项目概览

web-qianchun 是一个基于 Next.js App Router 的数据看板前端。页面通过 URL 中的 `aavid` 识别当前千川账号，并在首页、全域投放和个人中心之间保持账号、店铺信息及数据口径联动。

当前版本：**1.0.0**  
发布日期：**2026-10-25**

## 2. 技术版本

| 分类 | 技术 | 版本/要求 |
| --- | --- | --- |
| 运行时 | Node.js | 24.x |
| Web 框架 | Next.js | 16.3.5 |
| UI 框架 | React / React DOM | 19.2.4 |
| 开发语言 | TypeScript | 5.x，strict |
| 样式 | Tailwind CSS | 4.x |
| UI 基础组件 | Base UI / shadcn/ui | Base UI 1.3+ / shadcn 4.1+ |
| 图标 | Lucide React | 1.6+ |
| 包管理 | npm | lockfile v3 |

## 3. 分层结构

```text
src/
├── app/
│   ├── login/                         # 登录页
│   ├── (platform)/                    # 登录后的平台页面组
│   │   ├── home/                      # 首页数据概览
│   │   ├── data/full-domain/          # 全域投放数据页
│   │   └── account-center/account-info/ # 个人中心
│   ├── globals.css                    # 全局样式与设计令牌
│   └── layout.tsx                     # 根布局
├── components/
│   ├── sites/qianchuan/               # 千川业务组件与局部样式
│   └── ui/                            # 通用 UI 组件
└── lib/
    ├── demo-accounts.ts               # 账号与店铺基础数据
    ├── account-delivery.ts            # 投放类型、比例及联动计算
    └── utils.ts                       # 通用工具
```

静态图片存放在 `public/sites/qianchuan/`。页面专属组件采用 CSS Modules，全局基础样式使用 `src/app/globals.css`。

## 4. 路由与账号上下文

| 路由 | 功能 | 关键参数 |
| --- | --- | --- |
| `/login` | 登录入口 | 登录后生成/携带 `aavid` |
| `/home` | 首页、数据诊断、数据概览 | `aavid` |
| `/data/full-domain` | 全域投放、多维度数据看板 | `aavid` |
| `/account-center/account-info` | 账号资料、店铺与授权信息 | `aavid` |

账号切换或页面跳转时保留 `aavid`，业务组件根据该参数读取同一账号配置。账号的展示类型决定首页数据概览展示标准投放或全域投放数据；账户整体消耗始终保留。

## 5. 数据流

```text
URL aavid
   ↓
账号解析（demo-accounts）
   ↓
投放规则与比例（account-delivery）
   ↓
首页概览 / 全域投放 / 个人中心
   ↓
日期、维度、平台筛选驱动面板与明细同步更新
```

- 基础账号信息、余额、账户类型、店铺和抖音号在账号数据模块统一维护。
- 首页指标由账号基础数据和投放比例计算，不在组件中重复写死。
- 全域投放页的抖音号、直播间、素材、调控维度复用当前账号上下文。
- 日期范围、数据维度和筛选条件由客户端交互状态控制，汇总卡片、曲线和表格保持一致口径。

## 6. 渲染与交互

- App Router 负责路由和页面级布局。
- 需要读取查询参数、切换账号、筛选日期或更新图表的模块使用客户端组件。
- 页面数据目前来自项目内的结构化账号数据和计算函数，不依赖外部接口。
- 图表由 React/SVG 绘制，避免额外图表运行时依赖。

## 7. 构建与部署

`next.config.ts` 启用了 `output: "standalone"`。构建流程为：

```text
TypeScript / React 源码
        ↓
next build
        ↓
.next/standalone
        ↓
prepare-standalone.mjs 补齐 public 与 .next/static
        ↓
Linux Node.js 进程（127.0.0.1:3000）
        ↓
Nginx 反向代理 / HTTPS
```

详细命令和 Nginx 配置见 [BUILD_AND_RUN.md](BUILD_AND_RUN.md)。

## 8. 质量控制

提交或发布前执行：

```bash
npm run check
```

该命令依次运行 ESLint、TypeScript 类型检查和 Next.js 生产构建。版本号遵循语义化版本：

- MAJOR：不兼容的重大变更
- MINOR：向后兼容的新功能
- PATCH：向后兼容的问题修复
