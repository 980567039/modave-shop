# Templates

这里放前台模板的逻辑层。每个模板应该尽量只关心页面展示，不直接访问数据库。

推荐每个模板保持类似结构：

```text
templates/<template-id>/
├── HomePage.jsx
├── ShopPage.jsx
├── ProductPage.jsx
├── CartPage.jsx
├── CheckoutPage.jsx
├── template.config.js
└── README.md
```

## 模板配置字段

每个模板都需要提供 `template.config.js`，用于描述模板元信息、路由、页面组件和数据来源。当前推荐字段如下：

- `id`：模板唯一标识，例如 `modave`
- `name`：后台或文档中展示的模板名称
- `description`：模板说明
- `status`：模板状态，当前可用模板使用 `active`
- `selectionMode`：模板选择方式；当前项目使用 `build-time`
- `routes`：模板支持的前台访问路径
- `pages`：模板页面组件名称，对应 `templates/<template-id>/*.jsx`
- `dataSources`：页面依赖的接口清单
- `homeVariants`：模板内可选的首页变体；适合只更换首页风格、不复制整站业务页面的场景
- `themeBlocks`：模板依赖的 `StoreTheme` 配置块

新增模板时，最少需要完成：

1. 新建 `templates/<template-id>/template.config.js`
2. 新建该模板需要的页面组件，例如 `HomePage.jsx`、`ShopPage.jsx`、`CheckoutPage.jsx`
3. 在 `templates/registry.js` 注册模板配置
4. 在 `templates/pages.js` 注册该模板的页面组件
5. 增加对应启动脚本，例如 `pnpm dev:<template-id>`、`pnpm build:<template-id>`
6. 用 `TEMPLATE_ID=<template-id> pnpm build` 验证生产构建

如果只是新增首页风格，不建议新建完整模板。优先放到当前模板的首页变体目录，例如：

```text
templates/modave/home-variants/<variant-id>/
├── HomeVariant.jsx
└── components/
```

然后在 `templates/modave/home-variants/registry.js` 注册，并通过 `NEXT_PUBLIC_MODAVE_HOME_VARIANT=<variant-id>` 验证。

当前启用模板：

- `modave`

模板选择入口：

- `templates/registry.js`
- 默认读取 `TEMPLATE_ID`，其次是 `NEXT_PUBLIC_ACTIVE_TEMPLATE`，没有配置时使用 `modave`
- 路由页通过 `templates/pages.js` 取当前启用模板的页面组件
- 启动命令可用 `TEMPLATE_ID=modave pnpm dev`

现阶段先做逻辑拆分，正式模板仍然可以复用 `app/newSite-components/`，等页面边界稳定后再逐步迁移组件。

示例和 demo 页面不再放在正式模板目录下，统一归档到 `archive/modave-demos/`，不要继续留在 `app/` 目录下作为生产路由。

当前 `modave` demo 已归档：

- `archive/modave-demos/templates/modave/examples/homes/`
- `archive/modave-demos/templates/modave/examples/productDetails/`
- `archive/modave-demos/templates/modave/examples/productListings/`
- `archive/modave-demos/templates/modave/examples/blogs/`
- `archive/modave-demos/templates/modave/examples/otherPages/`
- `archive/modave-demos/app/newSite-components/homes/`
