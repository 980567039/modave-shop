# Modave Template

这是当前项目正在使用的前台模板逻辑层。

它暂时复用 `app/newSite-components/` 中的迁移组件，但路由入口已经从模板渲染中拆开：

`app/(shop)` 的正式路由现在通过 `templates/pages.js` 取得当前启用模板的页面组件。当前默认模板仍是 `modave`，但模板选择已经可以通过 `TEMPLATE_ID` 控制。

## 模板配置

- 模板 ID：`modave`
- 模板状态：当前生产启用
- 选择方式：构建期或部署期选择
- 配置文件：`templates/modave/template.config.js`
- 页面注册：`templates/pages.js`
- 模板注册：`templates/registry.js`
- 主题配置来源：`StoreTheme`

`template.config.js` 现在记录了四类信息：

- `routes`：当前模板支持的访问路径
- `pages`：路径对应的模板页面组件
- `dataSources`：主要页面依赖的 API
- `homeVariants`：当前模板支持的首页变体
- `themeBlocks`：模板依赖的后台主题配置块

## 首页变体

当前 `modave` 是一套完整前台模板，首页可以在同一模板内选择不同变体。默认变体是 `home-1`，仍然使用当前真实接口数据。

已接入的首页变体：

- `home-1`：默认生产首页，使用 `/api/site/home` 和 `/api/site/categories`
- `fashion-main`：服装首页变体，来自归档 demo，当前主要使用静态迁移数据
- `electronic`：电子产品首页变体，来自归档 demo，当前主要使用静态迁移数据
- `home-baby`：母婴首页变体，来自归档 demo，部分产品区块可复用首页接口数据

本地启动指定首页变体：

```bash
NEXT_PUBLIC_MODAVE_HOME_VARIANT=fashion-main pnpm dev:modave
NEXT_PUBLIC_MODAVE_HOME_VARIANT=electronic pnpm dev:modave
NEXT_PUBLIC_MODAVE_HOME_VARIANT=home-baby pnpm dev:modave
```

生产构建指定首页变体：

```bash
NEXT_PUBLIC_MODAVE_HOME_VARIANT=fashion-main pnpm build:modave
```

如果未配置或配置了不存在的变体，会自动回退到 `home-1`。

## 路由与组件关系

| 访问路径 | App Router 入口 | 模板页面 | 主要业务组件 / 数据 |
| --- | --- | --- | --- |
| `/` | `app/(shop)/page.jsx` | `HomePage.jsx` | `shared/api/site.js`、首页主题数据、分类数据 |
| `/shop-default-grid` | `app/(shop)/(products)/shop-default-grid/page.jsx` | `ShopPage.jsx` | `Products1.jsx` 请求 `/api/site/product` |
| `/product-detail/[id]` | `app/(shop)/(productDetails)/product-detail/[id]/page.jsx` | `ProductDetailPage.jsx` | `shared/api/products.js`、商品详情和关联商品 |
| `/shopping-cart` | `app/(shop)/(products)/shopping-cart/page.jsx` | `CartPage.jsx` | `ShopCart.jsx`、`newSite-context` |
| `/checkout` | `app/(shop)/(products)/checkout/page.jsx` | `CheckoutPage.jsx` | `Checkout.jsx`、订单创建、当前站点支付 |
| `/search-result` | `app/(shop)/(products)/search-result/page.jsx` | `SearchPage.jsx` | `SearchProducts.jsx` |
| `/order-confirm` | `app/(shop)/(orders)/order-confirm/page.jsx` | `OrderConfirmPage.jsx` | `paymentConfirm.js`、`/api/site/order` |
| `/order-failed` | `app/(shop)/(orders)/order-failed/page.jsx` | `OrderFailedPage.jsx` | `components/OrderFailedContent.jsx` |
| `/about-us` | `app/(shop)/(other-pages)/about-us/page.jsx` | `AboutPage.jsx` | `otherPages/About.jsx` 等 |
| `/FAQs` | `app/(shop)/(other-pages)/FAQs/page.jsx` | `FaqPage.jsx` | FAQ 静态内容 |
| `/contact` | `app/(shop)/(other-pages)/contact/page.jsx` | `ContactPage.jsx` | 联系页面组件 |
| `/login` | `app/(shop)/(other-pages)/login/page.jsx` | `LoginPage.jsx` | 登录组件 |
| `/register` | `app/(shop)/(other-pages)/register/page.jsx` | `RegisterPage.jsx` | 注册组件 |
| `/forget-password` | `app/(shop)/(other-pages)/forget-password/page.jsx` | `ForgotPasswordPage.jsx` | 找回密码组件 |
| `/reset-password` | `app/(shop)/(other-pages)/reset-password/page.jsx` | `ResetPasswordPage.jsx` | 重置密码组件 |
| `/order-tracking` | `app/(shop)/(other-pages)/order-tracking/page.jsx` | `OrderTrackingPage.jsx` | 订单查询组件 |
| `/term-of-use` | `app/(shop)/(other-pages)/term-of-use/page.jsx` | `TermsPage.jsx` | 条款页面 |
| `/customer-feedback` | `app/(shop)/(other-pages)/customer-feedback/page.jsx` | `CustomerFeedbackPage.jsx` | 反馈页面 |
| `/store-list` | `app/(shop)/(other-pages)/store-list/page.jsx` | `StoreListPage.jsx` | 门店列表 |
| `/compare-products` | `app/(shop)/(other-pages)/compare-products/page.jsx` | `CompareProductsPage.jsx` | 商品对比 |
| `/my-account` | `app/(shop)/(my-account)/my-account/page.jsx` | `MyAccountPage.jsx` | `MyAccountShell.jsx`、账号组件 |
| `/my-account-address` | `app/(shop)/(my-account)/my-account-address/page.jsx` | `MyAccountAddressPage.jsx` | 地址组件 |
| `/my-account-orders` | `app/(shop)/(my-account)/my-account-orders/page.jsx` | `MyAccountOrdersPage.jsx` | 订单列表组件 |
| `/my-account-orders-details` | `app/(shop)/(my-account)/my-account-orders-details/page.jsx` | `MyAccountOrderDetailsPage.jsx` | 订单详情组件 |

## 组件收口状态

已收口到模板层：

- 页面级模板组件已经集中在 `templates/modave/`
- 账号中心公共外壳已经集中在 `templates/modave/MyAccountShell.jsx`
- 订单失败页内容已经从旧站副本收口到 `templates/modave/components/OrderFailedContent.jsx`
- `fashion-main`、`electronic`、`home-baby` 已从归档首页 demo 转为 `templates/modave/home-variants/` 下的首页变体
- 当前启用模板的路由映射已经由 `templates/pages.js` 统一出口

仍在复用迁移组件：

- `app/newSite-components/otherPages/`：登录、注册、结账、FAQ、门店、反馈等页面内部 UI
- `app/newSite-components/my-account/`：账号信息、地址、订单和订单详情
- `app/newSite-components/products/`：商品列表、搜索和部分商品详情辅助模块
- `app/newSite-components/common/`、`headers/`、`footers/`：当前模板公共 UI

后续迁移原则：先保持功能稳定，再把稳定的页面内部组件从 `app/newSite-components/` 移到 `templates/modave/components/` 或 `shared/components/`。

- 路由入口：`app/(shop)/page.jsx`
- 数据读取：`shared/api/site.js`
- 模板渲染：`templates/pages.js` -> `templates/modave/HomePage.jsx`

商品详情也已经开始拆分：

- 路由入口：`app/(shop)/(productDetails)/product-detail/[id]/page.jsx`
- 数据读取：`shared/api/products.js`
- 模板渲染：`templates/pages.js` -> `templates/modave/ProductDetailPage.jsx`

商品列表页也已经拆分：

- 路由入口：`app/(shop)/(products)/shop-default-grid/page.jsx`
- 模板渲染：`templates/pages.js` -> `templates/modave/ShopPage.jsx`
- 商品筛选与分页：暂时仍由 `app/newSite-components/products/Products1.jsx` 客户端组件负责

购物车页也已经拆分：

- 路由入口：`app/(shop)/(products)/shopping-cart/page.jsx`
- 模板渲染：`templates/pages.js` -> `templates/modave/CartPage.jsx`
- 购物车状态：暂时仍由 `app/newSite-context/Context.jsx` 和 `ShopCart` 客户端组件负责

结账页也已经拆分：

- 路由入口：`app/(shop)/(products)/checkout/page.jsx`
- 模板渲染：`templates/pages.js` -> `templates/modave/CheckoutPage.jsx`
- 结账业务：暂时仍由 `app/newSite-components/otherPages/Checkout.jsx` 客户端组件负责

搜索页也已经拆分：

- 路由入口：`app/(shop)/(products)/search-result/page.jsx`
- 模板渲染：`templates/pages.js` -> `templates/modave/SearchPage.jsx`
- 搜索业务：暂时仍由 `app/newSite-components/products/SearchProducts.jsx` 客户端组件负责

常规页面也已经拆分：

- 路由入口：`app/(shop)/(other-pages)/*/page.jsx`
- 模板渲染：`templates/pages.js` -> `templates/modave/AboutPage.jsx`、`FaqPage.jsx`、`ContactPage.jsx`、`LoginPage.jsx` 等
- 账号、登录、重置密码、门店、条款、反馈等业务组件暂时仍复用 `app/newSite-components/otherPages/`

账号中心页面也已经拆分：

- 路由入口：`app/(shop)/(my-account)/*/page.jsx`
- 模板渲染：`templates/pages.js` -> `templates/modave/MyAccountPage.jsx`、`MyAccountAddressPage.jsx`、`MyAccountOrdersPage.jsx`、`MyAccountOrderDetailsPage.jsx`
- 共同外壳：`templates/modave/MyAccountShell.jsx`
- 账号业务组件：暂时仍由 `app/newSite-components/my-account/` 负责

示例页面归档：

- `archive/modave-demos/templates/modave/examples/homes/`：保留迁移进来的首页 demo，不作为生产路由构建
- `archive/modave-demos/templates/modave/examples/productDetails/`：保留迁移进来的商品详情 demo，不作为生产路由构建
- `archive/modave-demos/templates/modave/examples/productListings/`：保留迁移进来的商品列表和商品样式 demo，不作为生产路由构建
- `archive/modave-demos/templates/modave/examples/blogs/`：保留迁移进来的博客 demo，不作为生产路由构建
- `archive/modave-demos/templates/modave/examples/otherPages/`：保留常规页面里的示例变体，不作为生产路由构建
- `archive/modave-demos/app/newSite-components/homes/`：保留未启用的首页模板组件；当前生产首页只保留 `app/newSite-components/homes/home-1/`
