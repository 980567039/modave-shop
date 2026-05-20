import moment from "moment";

export const generateEmailTemplate = (orderData, type, host) => {

  const emailContent = () => {
    const orderPickupDate = () => {
      if(orderData.fulfillmentType === "pickup"){
        return moment(orderData?.pickupDate).format('YYYY-MM-DD');
      }
    }

    switch (type) {
      case "statusChange":
        return `<table
          width="100%"
          border="0"
          cellpadding="0"
          cellspacing="0"
          style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;"
        >
          <tr>
            <td style="padding: 10px 0;">
              <p style="color: #333333; font-size: 14px;">
                Hi <strong>${orderData?.shippingAddress?.firstName}</strong>,
              </p>
              <p style="color: #333333; font-size: 14px;">
                Thank you for shopping with us at <strong>Nuvie Clothing</strong>! We wanted to inform you that the
                status of your order <strong>#${orderData?.orderNumber}</strong> has been updated. Below is the latest information:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 5px;">
                <tr>
                  <td style="padding: 10px; font-size: 14px; color: #555555;">
                    <strong>Current Status:</strong> ${orderData?.orderStatus}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-size: 14px; color: #555555;">
                    <strong>Order Date:</strong> ${orderData?.orderDate}
                  </td>
                </tr>               
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0;">
              <p style="color: #333333; font-size: 14px;">
                You can check your order status anytime by visiting our tracking page.
              </p>
              <p style="color: #333333; font-size: 14px;">
                If you have any questions or need further assistance, feel free to contact us at
                <a href="mailto:online@uptownsrilanka.com" style="color: #1a73e8; text-decoration: none;">
                  online@nuvei.com
                </a>
              </p>
              <p style="color: #333333; font-size: 14px;">
                Thank you again for choosing <strong>Nuvie Clothing</strong>. We\'re here to help ensure your experience
                with us is a pleasant one.
              </p>
            </td>
          </tr>
        </table>`
      default:
        return `<table class="order-info">
              <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 40px">
                  <strong>SUMMARY:</strong><br>
                  Order #: ${orderData.orderNumber}<br>
                  Order Date: ${orderData.orderDate}<br>
                  Order Total: LKR ${orderData.orderTotal}<br>
                  ${orderData.savings ? `<span class="discount">You saved $${orderData.savings}!</span>` : ''}
                </td>
                <td style="width: 50%; vertical-align: top;">
                  <strong>SHIPPING ADDRESS:</strong><br>
                  ${orderData.fulfillmentType === "pickup" ? 'Store Pickup' : orderData?.shippingAddress.street}<br>
                  ${orderData.fulfillmentType === "pickup" ? `Pickup Date : ${orderPickupDate()}` : ''}<br>

                  ${orderData.fulfillmentType === "pickup" ? orderData?.pickUpLocation : orderData?.shippingAddress.addressLine2}<br>
                  ${orderData.fulfillmentType !== "pickup" ? orderData?.shippingAddress.city : ''}<br>
                  ${orderData.fulfillmentType !== "pickup" ?  orderData?.shippingAddress.zip : ''}<br>
                </td>
              </tr>
            </table>
  
            <div class="products">
              ${orderData.items.map(item => `
                <div class="product">
                  <table>
                    <tr>
                      <td style="width: 80px;">
                        <img src="https://uptownsrilanka.com${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;">
                      </td>
                      <td>
                        <strong>${item.name}</strong><br>
                        ${item.size || item.color ? `<p style="margin: 0px">Size: ${item.size || '---'}, Color: ${item.color || '---'}</p>` : ''}
                        Quantity: ${item.quantity}
                      </td>
                      <td style="text-align: right;">
                        <span class="price">LKR: ${item.price}</span>
                        ${item.discountedPrice ? `<br><span class="discount">LKR ${item.discountedPrice}</span>` : ''}
                      </td>
                    </tr>
                  </table>
                </div>
              `).join('')}
            </div>
  
            <div class="summary">
              <table>
                <tr>
                  <td>Subtotal (${orderData.items.length} items):</td>
                  <td style="text-align: right;">LKR ${orderData.subtotal}</td>
                </tr>
                <tr>
                  <td>Shipping:</td>
                  <td style="text-align: right;">${orderData.shipping === 0 ? 'FREE' : `LKR ${orderData.shipping}`}</td>
                </tr>
                ${orderData.discounts ? `
                  <tr>
                    <td>Discounts:</td>
                    <td style="text-align: right;" class="discount">- ${orderData.discounts}</td>
                  </tr>
                ` : ''}
                ${orderData.enabledOffers ? `
                  <tr>
                    <td>Offers Applied:</td>
                    <td style="text-align: right;" class="discount">${orderData.typeOfOffer?.parentage}%</td>
                  </tr>
                ` : ''}
                <tr>
                  <td>Estimated Tax:</td>
                  <td style="text-align: right;">LKR ${orderData.tax}</td>
                </tr>
                <tr style="font-weight: bold; font-size: 18px;">
                  <td>Order Total:</td>
                  <td style="text-align: right;">LKR ${orderData.orderTotal}</td>
                </tr>
              </table>
            </div>`;
    }
  }

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            /* Reset CSS */
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #000 }
            table { border-collapse: collapse; width: 100%; }
            img { border: 0; }
            
            /* Custom Styles */
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff }
            .header { text-align: center; padding: 20px; background-color: #000; color: #fff   }
            .mainLogo { width: 150px; margin: 0 auto }
            .logo { font-size: 24px; font-weight: bold; }
            .order-info { background: #f9f9f9; padding: 20px; margin: 20px 0; display:block }
            .product { padding: 10px 0; border-bottom: 1px solid #eee; }
            .summary { margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;  background-color: #000; color: #fff }
            .shipping-badge { display: inline-block; margin: 10px; text-align: center; }
            .price { color: #e41e31; font-weight: bold; }
            .discount { color: #00a650; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="mainLogo">
                <img src="${host}/images/main-logo.png" alt="" style="width: 100px"/>
              </div>
              <div class="logo">${orderData?.mainTitle || 'Your Order Is Updated'}.</div>
              <p>${orderData?.subTitle}</p>
            </div>

            ${emailContent()}

            <div class="footer">
              <div class="shipping-badge">
                <div style="border: 1px solid #ddd; border-radius: 50%; width: 40px; height: 40px; line-height: 40px; margin: 0 auto;">24/7</div>
                <p>CUSTOMER<br>SERVICE</p>
              </div>
              <div class="shipping-badge">
                <div style="border: 1px solid #ddd; border-radius: 50%; width: 40px; height: 40px; line-height: 40px; margin: 0 auto;">🚚</div>
                <p>FREE SHIPPING<br>ORDERS Rs: 15,000+</p>
              </div>
              <div class="shipping-badge">
                <div style="border: 1px solid #ddd; border-radius: 50%; width: 40px; height: 40px; line-height: 40px; margin: 0 auto;">✓</div>
                <p>SATISFACTION<br>GUARANTEED</p>
              </div>
              <div class="shipping-badge">
                <div style="border: 1px solid #ddd; border-radius: 50%; width: 40px; height: 40px; line-height: 40px; margin: 0 auto;">↩</div>
                <p>HASSLE-FREE<br>RETURNS</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
};