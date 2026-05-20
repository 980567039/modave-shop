# 项目概述

这是一个基于 Next.js App Router 的电商/站点前端项目，当前处于“旧站 + 多模板前端迁移 + 后台主题配置”并存阶段。

项目里已经有一套可编辑的站点主题系统，后台可以配置首页轮播、导航、最新上架、分类区块、趋势区块、店铺位置和页脚；前台会从接口读取这些数据并渲染。

## 现在的状态

- 前台主站在 `app/(shop)/` 下
- 旧站副本已归档到 `archive/siteCopy/`
- 多模板素材和模板组件主要在 `app/newSite-components/` 和 `app/newSite-data/`
- 后台主题编辑页在 `app/admin/theme/`
- 主题数据通过 `StoreTheme` 落库，并由前台接口读取

## 主要流程

1. 后台在 `/admin/theme` 配置主题块
2. 数据保存到 `StoreTheme`
3. 前台通过 `/api/site/home`、`/api/site/header` 等接口读取
4. 页面组件在 `app/(shop)/` 中组合渲染

## 目录速览

- `app/(shop)/`：当前前台站点
- `archive/siteCopy/`：旧站归档副本，仅作迁移参考和回退对照，不参与生产路由构建
- `app/admin/`：后台管理与主题配置
- `app/api/`：站点、后台、支付、媒体等接口
- `templates/`：前台模板逻辑层，当前启用 `templates/modave/`
- `shared/`：多模板共享 API 与数据适配
- `app/newSite-components/`：迁移进来的多模板组件
- `app/newSite-data/`：模板静态数据
- `models/`：MongoDB 模型
- `lib/`：公共工具、请求封装、认证配置
- `public/`：图片、字体、样式资源

## 运行方式

```bash
pnpm install
pnpm dev:modave
```

开发端口是 `5100`。
如需显式指定模板，可用 `TEMPLATE_ID=modave pnpm dev`。

常用脚本：

```bash
pnpm dev:modave      # 本地开发，启用 modave 模板
pnpm build:modave    # 生产构建，启用 modave 模板
pnpm start:modave    # 启动已构建的生产服务
pnpm lint            # 代码检查
```

切换首页变体示例：

```bash
NEXT_PUBLIC_MODAVE_HOME_VARIANT=fashion-main pnpm dev:modave
NEXT_PUBLIC_MODAVE_HOME_VARIANT=electronic pnpm dev:modave
NEXT_PUBLIC_MODAVE_HOME_VARIANT=home-baby pnpm dev:modave
```

## 环境变量

本项目依赖较多环境变量，常见的有：

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_STORE_ID`
- `NEXT_PUBLIC_ACTIVE_TEMPLATE`
- `NEXT_PUBLIC_MODAVE_HOME_VARIANT`：Modave 首页变体。默认 `home-1`，当前已接入 `fashion-main`、`electronic`、`home-baby`。
- `NEXT_PUBLIC_FONT_PROVIDER`：字体来源。默认使用本地字体；设为 `google` 时运行时加载 Google Fonts。
- `NEXT_PUBLIC_ENABLE_CROSS_SITE_PAYMENT`：跨站支付开关。默认不启用；设为 `true` 且配置 `NEXT_PUBLIC_PAYMENT_SITE_URL` 时才走跨站支付。
- `INTERNAL_REQUEST_SECRET`
- 支付、邮件、S3、Cloudinary、Google 相关配置

具体值以 `.env.local` 和 `.env.production` 为准。

## 部署方式

当前项目推荐按“部署时选择一套模板”的方式部署，默认模板是 `modave`。部署前请确认生产环境变量中的站点地址、数据库、认证、支付和存储配置都已经改成目标环境。

### 1. 本地生产验证

在部署到服务器或 Vercel 前，先在本机跑一次生产构建：

```bash
pnpm install
pnpm build:modave
pnpm start:modave
```

默认端口是 `5100`。访问：

```text
http://localhost:5100
```

如果需要指定端口：

```bash
PORT=5100 pnpm start:modave
```

### 2. Vercel 部署

Vercel 项目建议这样配置：

- Framework Preset：`Next.js`
- Install Command：`pnpm install`
- Build Command：`pnpm build:modave`
- Output Directory：保持默认

需要在 Vercel 环境变量中配置：

```text
TEMPLATE_ID=modave
NEXT_PUBLIC_ACTIVE_TEMPLATE=modave
NEXTAUTH_URL=https://你的正式域名
NEXT_PUBLIC_SITE_URL=https://你的正式域名
NEXT_PUBLIC_API_URL=https://你的正式域名/api
NEXT_STORE_ID=你的店铺ID
MONGODB_URI=你的生产数据库连接
NEXTAUTH_SECRET=你的生产密钥
INTERNAL_REQUEST_SECRET=你的内部请求密钥
```

支付相关按实际启用方式配置：

```text
STRIPE_SECRET_KEY=...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
PAYPAL_API_URL=https://api-m.paypal.com
NEXT_PUBLIC_ENABLE_CROSS_SITE_PAYMENT=false
```

如果仍使用 PayPal 沙盒测试，`PAYPAL_API_URL` 保持：

```text
https://api-m.sandbox.paypal.com
```

### 3. 普通服务器部署

服务器需要 Node.js、pnpm、MongoDB 访问权限和反向代理，例如 Nginx。

基础流程：

```bash
git pull
pnpm install
pnpm build:modave
PORT=5100 pnpm start:modave
```

长期运行建议使用 `pm2`：

```bash
pm2 start "pnpm start:modave" --name marge-frontend
pm2 save
```

Nginx 反向代理示例：

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:5100;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### 4. 部署检查清单

- `pnpm build:modave` 能成功完成
- `NEXTAUTH_URL` 与实际访问域名一致
- `NEXT_PUBLIC_API_URL` 指向当前站点的 `/api`
- `MONGODB_URI` 指向正确数据库环境
- `NEXT_STORE_ID` 是当前站点使用的店铺 ID
- 支付回调域名与 PayPal / Stripe 后台配置一致
- 默认不启用跨站支付；只有明确需要时才设置 `NEXT_PUBLIC_ENABLE_CROSS_SITE_PAYMENT=true`
- 生产环境不要依赖 Google Fonts；默认使用本地字体即可

## 开源发布

当前计划发布到：

```text
https://github.com/980567039/modave-shop.git
```

开源版定位为单模板 `modave` 商城前端，默认模板和启动脚本都固定走 `modave`。真实环境变量不要提交到仓库；请复制 `.env.example` 为 `.env.local` 后再填写本地或生产配置。

建议使用干净历史推送公开仓库，避免把旧提交里的真实 `.env.local`、`.env.production` 或历史密钥带到公开仓库。当前私有工作仓库可以保留完整迁移历史，公开仓库只发布整理后的单模板快照。

公开仓库推荐推送流程：

```bash
git remote add modave-shop https://github.com/980567039/modave-shop.git
git push modave-shop main
```

如果公开仓库要求完全干净历史，应从当前代码快照创建 orphan 分支后推送，而不是直接推送旧历史。

## 当前状态

这套系统已经不只是一个单一电站站点了，更像是“可配置主题的多模板商城前端”。当前状态按完成度拆分如下。

### 已完成

- 模板选择已调整为构建期或部署期选择，不做后台运行时模板切换器
- 可以通过 `TEMPLATE_ID` 控制启动模板，默认模板是 `modave`
- `pnpm dev:modave`、`pnpm build:modave`、`pnpm start:modave` 已作为当前推荐命令
- 正式主链路已覆盖首页、商品详情、商品列表、购物车、结账、订单确认、订单失败、搜索、页头、页脚和分类入口
- 常规页面和账号中心已接入 `templates/modave/` 模板层
- 支付默认改为当前站点支付，跨站支付只有显式打开 `NEXT_PUBLIC_ENABLE_CROSS_SITE_PAYMENT=true` 时才启用
- `/order-confirm` 和 `/order-failed` 已有正式路由，并已接入站点上下文
- `StoreTheme` 已补兼容型 schema，主要主题块已有默认结构
- `templates/modave/template.config.js` 已补页面、数据源和主题块配置
- `modave` 已支持首页变体，默认 `home-1`，已接入 `fashion-main`、`electronic`、`home-baby`
- `templates/modave/README.md` 已补当前模板的路由和组件关系图
- 订单失败页内容已从旧站副本收口到 `templates/modave/components/`
- `app/siteCopy/` 已整体移入 `archive/siteCopy/`，不再参与生产路由构建
- demo 页面和未启用的首页模板组件已统一归档到 `archive/modave-demos/`
- 首页、商品详情、商品列表、产品样式、博客和常规页面 demo 已归档到 `archive/modave-demos/templates/modave/examples/`
- 未启用的首页模板组件已归档到 `archive/modave-demos/app/newSite-components/homes/`，当前生产首页只保留 `app/newSite-components/homes/home-1/`
- README 已补充本地生产验证、Vercel 部署、普通服务器部署和部署检查清单

### 待处理

- 按真实后台表单继续细化 `StoreTheme` 业务必填校验
- 继续把剩余业务组件收口到模板层或共享层，重点是 `otherPages`、`my-account` 和部分商品详情辅助区块
- 逐步把少量仍依赖静态数据的模板页面改为 API 或模板配置数据
- 后续如确认旧站完全无参考价值，可以再清理 `archive/siteCopy/`

## 参考文档

- [项目结构与说明.md](./项目结构与说明.md)
- [导航菜单配置文档.md](./导航菜单配置文档.md)
- [cross_site_payment_documentation.md](./cross_site_payment_documentation.md)
- [implementation_plan.md](./implementation_plan.md)
