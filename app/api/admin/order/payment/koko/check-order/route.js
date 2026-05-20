// 检查 Koko 支付订单状态
import { NextResponse } from "next/server";
import crypto from 'crypto';
import Order from "@/models/Order";
import Product from "@/models/product/Product";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import moment from "moment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";

// Function to generate the signature
const generateSignature = (dataString) => {
    try {
        const privateKey = process.env.KOKO_PRIVATE_KEY.replace(/\\n/g, '\n');
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(dataString);
        signer.end();
        return signer.sign(privateKey, 'base64');
    } catch (error) {
        console.error('Error generating signature:', error.message);
        throw error;
    }
};

// Function to verify KOKO's response signature
const verifySignature = (dataString, signature) => {
    try {
        const publicKey = process.env.KOKO_PUBLIC_KEY.replace(/\\n/g, '\n');
        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(dataString);
        return verifier.verify(publicKey, signature, 'base64');
    } catch (error) {
        console.error('Error verifying signature:', error.message);
        throw error;
    }
};

async function handlePost(req) {
    try {
        // Authentication check
        const session = await getServerSession(authOptions);
        const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];


        if (!session || !acceptRoles.some((d) => d === session?.user?.role)) {
            return NextResponse.json(
                { message: "Unauthorized access" },
                { status: 403 }
            );
        }

        await connectDB();

        const reqData = await req?.json();
        const mId = process.env.KOKO_MERCHANT_ID;
        const apiKey = process.env.KOKO_API_KEY;
        const pluginName = "customapi";
        const pluginVersion = "1";

        // Generate signature data string
        const dataString = `${mId}${pluginName}${pluginVersion}${reqData?.customOrderId}${apiKey}`;
        const signature = generateSignature(dataString);

        const requestBody = new URLSearchParams({
            _mId: mId,
            api_key: apiKey,
            _orderId: reqData?.customOrderId,
            _pluginName: pluginName,
            _pluginVersion: pluginVersion,
            signature: signature,
        });

        // Make request to KOKO API
        const response = await fetch('https://prodapi.paykoko.com/api/merchants/orderView', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody.toString(),
        });

        if (!response.ok) {
            throw new Error(`KOKO API error: ${response.status}`);
        }

        const kokoResponse = await response.json();

        

        return  NextResponse.json({
                status: kokoResponse,
                transactionId: kokoResponse.trnId,
                message: 'Payment status updated successfully'
            }, { status: 200 });
        

        // // Verify KOKO's response signature
        // const responseDataString = `400702${kokoResponse.trnId}${kokoResponse.status}`;
        // const isValidSignature = verifySignature(responseDataString, kokoResponse.signature);

        // if (!isValidSignature) {
        //     throw new Error('Invalid response signature');
        // }

        // // Update order status in database
        // if (kokoResponse.orderId === reqData._id) {
        //     await Order.findByIdAndUpdate(reqData._id, {
        //         paymentStatus: kokoResponse.status,
        //         kokoTransactionId: kokoResponse.trnId,
        //         updatedAt: moment().toDate()
        //     });
        // }

        // return NextResponse.json({
        //     status: kokoResponse.status,
        //     transactionId: kokoResponse.trnId,
        //     message: 'Payment status updated successfully'
        // }, { status: 200 });

    } catch (error) {
        console.error('Error processing payment status:', error);
        return NextResponse.json(
            { message: 'Error processing payment status', error: error.message },
            { status: 500 }
        );
    }
}

export { handlePost as POST };