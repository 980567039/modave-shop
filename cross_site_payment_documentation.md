# 跨站支付流程文档 (Cross-Site Payment Flow Documentation)

## 1. 方案概述 (Overview)

本方案旨在实现 **A 站 (Site A)** 的订单通过 **B 站 (Site B)** 的 PayPal 账户进行支付。
核心设计是通过 **SKU 映射 (Mapped SKU)** 将 A 站产品与 B 站产品关联，利用 B 站作为支付网关，支付完成后将用户和支付状态重定向回 A 站。

### 核心概念
*   **Site A (订单发起方)**: 用户浏览商品、下单的站点。
*   **Site B (支付网关)**: 配置了 PayPal 账户，负责实际扣款的站点。
*   **Mapped SKU (绑定 SKU)**: A 站产品的一个新字段，存储对应的 B 站产品 SKU。
*   **Shadow Order (影子订单)**: 在 B 站创建的临时订单，用于向 PayPal 发起支付请求。

---

## 2. 业务流程详解 (Detailed Flow)

整个流程分为 6 个主要步骤：

### 第一步：A 站下单 (Site A Order Placement)
1.  用户在 A 站购物车点击 "Place Order"。
2.  前端调用 A 站接口 `POST /api/site/order/place`。
3.  **逻辑判断**: 后端检测到配置了 `NEXT_PUBLIC_PAYMENT_SITE_URL` (指向 B 站)，则不进行本地支付处理，而是进入跨站支付流程。
4.  **数据准备**:
    *   获取订单中每个商品的 `mappedSku` (即 B 站对应的 SKU)。
    *   生成一个包含订单金额、商品信息 (使用 mappedSku)、用户信息、回调地址 (`returnUrl`) 的 Payload。
    *   将 Payload 进行 Base64 编码。
5.  **生成跳转**: 返回一个指向 B 站支付页面的 URL，例如：`http://site-b.com/payment-gateway?data=BASE64_PAYLOAD`。
6.  **状态更新**: A 站订单状态被标记为 `awaitingPayment` (等待支付)。

### 第二步：跳转至 B 站 (Redirect to Site B)
1.  A 站前端接收到 `redirectUrl`，自动跳转到 B 站。
2.  用户浏览器加载 B 站页面 `/payment-gateway`。

### 第三步：B 站处理支付 (Site B Processing)
1.  B 站前端解析 URL 中的 `data` 参数，展示订单金额和商品列表。
2.  用户点击 "Pay with PayPal"。
3.  B 站前端调用 B 站接口 `POST /api/site/payment/cross-site/process`。
4.  **影子订单创建**:
    *   B 站后端根据传入的 `sku` (来自 A 站的 mappedSku) 查找本地产品。
    *   创建一个新的 [Order](file:///Users/ling/Desktop/nuvie-backup/app/api/site/order/place/generatePaypalPayment.js#14-31) (影子订单)，记录 A 站的原始订单号 (`customOrderId`) 和 A 站的回调地址 (`crossSiteReturnUrl`)。
    *   **金额校对**: 确保 B 站向 PayPal 请求的总金额与 A 站传入的金额完全一致。如果有差额 (如运费)，自动添加 "Shipping & Handling" 补差价。
5.  **请求 PayPal**: 调用 PayPal API 创建订单，设置 `return_url` 指向 B 站自己的回调接口 (`/api/site/payment/cross-site/callback`)。
6.  **返回链接**: 返回 PayPal 的支付批准链接 (`approvalUrl`) 给前端。

### 第四步：用户在 PayPal 支付 (PayPal Interaction)
1.  用户跳转到 PayPal 页面完成支付。
2.  支付成功后，PayPal 将用户重定向回 B 站的 `return_url`。

### 第三步：B 站回调处理 (Site B Callback)
1.  B 站接口 `GET /api/site/payment/cross-site/callback` 被触发。
2.  **捕获支付**: 使用 PayPal Token 捕获支付 (Capture Payment)。
3.  **更新状态**: B 站更新影子订单状态为 `confirmPayment`。
4.  **构建回跳**: 读取影子订单中存储的 `crossSiteReturnUrl` (即 A 站验证接口)，附带状态参数。
5.  **最终跳转**: 将用户重定向回 A 站，例如：`http://site-a.com/api/site/order/payment/cross-site/validate?status=success&orderId=ORD...`。

### 第六步：A 站验证与完成 (Site A Validation)
1.  A 站接口 `GET /api/site/order/payment/cross-site/validate` 被触发。
2.  **验证**: 检查 `status=success`。
3.  **更新状态**: 根据 `orderId` (支持 customOrderId 查找) 找到原始订单，将状态更新为 `confirmPayment`。
4.  **设置 Cookie**: 设置 `lastOrder` Cookie 以便在确认页显示信息。
5.  **展示结果**: 重定向用户到 A 站的 `/order-confirm` 页面。

---

## 3. 接口清单 (API Reference)

### Site A (订单发起方)

| 接口路径 | 方法 | 用途 | 修改/新增 |
| :--- | :--- | :--- | :--- |
| `/api/site/order/place` | POST | 下单主接口。修改了逻辑，支持检测跨站配置并调用生成器。 | **修改** |
| [/api/site/order/place/generateCrossSitePayment.js](file:///Users/ling/Desktop/nuvie-backup/app/api/site/order/place/generateCrossSitePayment.js) | Func | (内部函数) 生成跨站支付 Payload 和跳转链接。 | **新增** |
| `/api/site/order/payment/cross-site/validate` | GET | 接收 B 站支付结果的回调，更新 A 站订单状态。 | **新增** |

### Site B (支付网关)

| 接口路径 | 方法 | 用途 | 修改/新增 |
| :--- | :--- | :--- | :--- |
| `/payment-gateway` | Page | (前端页面) 接收 A 站跳转，展示订单信息，发起支付。 | **新增** |
| `/api/site/payment/cross-site/process` | POST | 处理支付请求，映射 SKU，创建影子订单，请求 PayPal。 | **新增** |
| `/api/site/payment/cross-site/callback` | GET | 接收 PayPal 支付成功回调，更新 B 站订单，跳回 A 站。 | **新增** |
| [/api/site/order/place/generatePaypalPayment.js](file:///Users/ling/Desktop/nuvie-backup/app/api/site/order/place/generatePaypalPayment.js) | Func | (内部函数) 修改为支持自定义 `returnUrl` 和 `cancelUrl`。 | **修改** |

---

## 4. 关键数据结构 (Key Data Structures)

### Product (Site A)
*   `mappedSku`: String - 对应 B 站产品的 SKU。

### Order (Site B - Shadow Order)
*   `customOrderId`: String - 存储 A 站的原始订单 ID (如 `ORD000037`)。
*   `crossSiteReturnUrl`: String - 存储 A 站的验证接口地址。

### Middleware (Site A & B)
*   需要将上述新增的 API 路径 (`/api/site/payment/cross-site/*` 和 `/api/site/order/payment/cross-site/*`) 添加到 [middleware.js](file:///Users/ling/Desktop/nuvie-backup/middleware.js) 的白名单中，防止被拦截。
