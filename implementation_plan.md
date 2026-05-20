# 数据迁移计划：使用真实模型数据替换假数据

## 目标

将 `app/newSite-data/` 中所有硬编码的数据导入替换为从 API 获取的真实数据，确保用户体验的动态性和实时性。

## 需要用户审查

> [!IMPORTANT] > **API 端点**：我们假设存在标准的 API 端点（例如 `/api/products`，`/api/categories`）。如果不同，请提供正确的端点。
> **数据结构**：预期的真实数据结构应与 `Context.jsx` 中的 `cartProducts` 逻辑一致（例如 `_id` vs `id`，`titleSlug` vs `slug`）。

## 建议的变更

### 第一阶段：核心组件重构（自下而上）

重构可复用的 UI 组件，使其通过 `props` 接收数据，而不是直接导入。这使它们成为“哑”组件，只负责显示传递给它们的数据。

#### [修改] 产品卡片和网格

- `app/newSite-components/productCards/ProductCard*.jsx`
- `app/newSite-components/productDetails/grids/Grid*.jsx`
- `app/newSite-components/productDetails/sliders/Slider*.jsx`
- **操作**：删除 `import { products } from "@/app/newSite-data/products"` 并将 `products`（或 `data`）添加到组件 props 中。

#### [修改] 共享组件

- `app/newSite-components/headers/*.jsx` (菜单)
- `app/newSite-components/common/*.jsx` (推荐, 品牌等)
- **操作**：与上述类似，通过 props 接收配置/数据。

### 第二阶段：页面级数据获取

在顶层页面组件中实现数据获取，并将数据向下传递给重构后的子组件。

#### [修改] 产品详情页

- `app/newSite/(productDetails)/**/page.jsx`
- **操作**：
  1.  使用 `apiReq` 或新的服务函数按 ID/Slug 获取产品详情。
  2.  将获取的产品数据传递给 `ProductDetails` 组件。
  3.  处理“加载中”和“未找到”状态。

#### [修改] 商店和主页

- `app/newSite/page.jsx` (主页)
- `app/newSite/shop-*/page.jsx`
- **操作**：获取产品/分类列表并将其传递给 `Grid` 或 `Slider` 组件。

### 第三阶段：导航和全局数据

- **操作**：更新 `Context.jsx` 或新的 `Layout` 组件，一次性获取菜单和分类等全局数据，并将其提供给应用程序。

### 第四阶段：清理

- **操作**：一旦删除了所有引用，删除 `app/newSite-data/` 目录。

## 验证计划

### 自动化测试

- 运行构建以确保没有丢失的导入。
- `grep` 搜索 `newSite-data` 应返回 0 个结果（除了本计划本身）。

### 手动验证

- **主页**：验证滑块和网格显示真实产品。
- **产品页**：点击产品，验证详情页加载正确信息。
- **购物车**：添加到购物车，验证 `Context` 状态更新正确。
