import { getFullDomain } from '@/lib/common';
import React from 'react';

const Invoice = ({ invoiceData }) => {
   console.log("invoiceData===", invoiceData);

  return (
    <div className="font-sans text-gray-800 mx-auto p-6">
      <div className="text-center mb-6">
        <div className="inline-block px-4 py-3 mb-2">
          <img src={"/images/main-logo.jpeg"} alt="uptown-logo" className='w-[150px]' />
        </div>
        <p className="text-xs">#2nd Floor, Liberty Plaza, NO 14, R. A. De Mel Mawatha, Colombo 03</p>
        <div className="text-xs mt-1">
          T : +94 71 899 5566 | E : online@nuvie-shop.com
        </div>
      </div>

      <div className="mb-4 text-xs">
        <strong>发票编号: </strong> {invoiceData.invoiceNo}<br />
        <strong>订单编号: </strong> {invoiceData.orderNo}<br />
        <strong>订单日期: </strong> {invoiceData.orderDate}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div className="border p-3 ">
          <h3 className="font-bold mb-1">发件人（寄件方）</h3>
          <p>{invoiceData.shipper.name}<br />
            {invoiceData.shipper.address}<br />
            {invoiceData.shipper.country}<br />
            联系方式 : {invoiceData.shipper.contact}</p>
        </div>
        <div className="border p-3 ">
          <h3 className="font-bold mb-1">收件人（接收方）</h3>
          <p>{invoiceData.shippingAddress.firstName + ' ' + invoiceData.shippingAddress.lastName}<br />
            {invoiceData.shippingAddress.street}<br />
            {invoiceData.shippingAddress.addressLine2}<br />
            {invoiceData.shippingAddress.city}<br />
            {invoiceData.shippingAddress.state}<br />
            邮政编码: {invoiceData.shippingAddress.zip}<br />
            手机 : {invoiceData.shippingAddress.phone}</p>
        </div>
      </div>

      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">支付方式</th>
            {/* <th className="border p-2 text-left">TRACKING NUMBER</th> */}
            <th className="border p-2 text-left">配送方式</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{invoiceData.paymentMethod}</td>
            {/* <td className="border p-2">{invoiceData.trackingNumber}</td> */}
            <td className="border p-2">
              {invoiceData.shippingMethod}<br />
              {invoiceData.pickupLocation && <>自提地点: <b>{invoiceData.pickupLocation}</b><br /></>}
              {invoiceData.pickupDate && <b>{invoiceData.pickupDate}<br /></b>}
              (总运费 : {invoiceData.shippingCharges})
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">产品详情</th>
            <th className="border p-2 text-left">SKU编码</th>
            <th className="border p-2 text-left">价格 (LKR)</th>
            <th className="border p-2 text-left">数量</th>
            <th className="border p-2 text-left">总计</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index}>

              <td className="border p-2">
                <div className='flex items-center gap-2'>
                  <img src={item.image} alt="" className='w-[50px] rounded-md' />
                  <div className='flex flex-col gap-1'>
                    {item.description}
                    <div className='flex items-center gap-1'>
                      {item?.size && <p>尺寸: {item?.size}</p>}
                      {item?.color && <p>颜色: {item?.color}</p>}
                    </div>
                  </div>
                </div>
              </td>
              <td className="border p-2">{item.sku}</td>
              <td className="border p-2">{item.price}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-xs mb-4">
        <p className="mb-1"><strong>小计:</strong> {invoiceData.subTotal}</p>
        {invoiceData?.fulfillmentType === "delivery" && <p className="mb-1"><strong>运费:</strong> {invoiceData.shippingCharges}</p>}
        {invoiceData.couponCode && <p className="mb-1"><strong>优惠券折扣 ({invoiceData.couponCode}):</strong> {invoiceData.discount}</p>}
        {invoiceData.kokoOffer && <p className="mb-1"><strong>KOKO优惠:</strong> - {invoiceData.reduceKokoValue}</p>}
        {invoiceData.siteWideOffer && <p className="mb-1"><strong>全站优惠:</strong> -{invoiceData.siteWideOfferReduceAmount}</p>}
        <p className="mb-1"><strong>净额:</strong> {invoiceData.netAmount}</p>
      </div>

      {invoiceData?.customerNote !== "" && <div className="border border-dashed p-2 text-center text-xs mb-4">
        <b>订单备注</b>: {invoiceData?.customerNote}
      </div>}

      <div className="border border-dashed p-2 text-center text-xs mb-4 flex flex-col gap-2">
        仅在购买后20天内出示相关标签和账单可进行换货。
        <div>（正式礼服/派对礼服 - 仅限尺寸更换）</div>
        <div>（特价商品/包袋不可更换）</div>
      </div>

      <p className="text-center text-xs">
        这是计算机生成的发票，无需签名或盖章
      </p>
    </div>
  );
};

export default Invoice;