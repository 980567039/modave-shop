// 跨站支付处理
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();

        // ... existing validation ...

        // ... existing user creation ...

        // ... existing item calculation ...

        // ... existing shadow order creation ...

        // 4. Process Payment based on type
        if (data.paymentType === 'stripe') {
            const lineItems = dbItems.map(item => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                            images: item.image ? [item.image] : [],
                        },
                        unit_amount: Math.round((Number(item.salePrice) || item.price) * 100),
                    },
                    quantity: item.quantity,
                };
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${process.env.NEXTAUTH_URL}/api/site/payment/cross-site/callback?session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}`,
                cancel_url: data.cancelUrl || `${process.env.NEXTAUTH_URL}/order-failed?orderId=${order._id}`,
                metadata: {
                    orderId: order._id.toString(),
                    customOrderId: data.orderId // Store Site A's order ID in metadata for easy access
                },
            });

            return NextResponse.json({
                url: session.url,
                orderId: order._id
            });

        } else {
            // Default to PayPal
            const siteBCallbackUrl = `${process.env.NEXTAUTH_URL}/api/site/payment/cross-site/callback?orderId=${order._id}`;
            const cancelUrl = data.cancelUrl;

            const paymentResponse = await generatePaypalPayment(order, data.amount, siteBCallbackUrl, cancelUrl);

            return NextResponse.json({
                approvalUrl: paymentResponse.redirectUrl,
                orderId: order._id
            });
        }

    } catch (error) {
        console.error('Error processing cross-site payment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
