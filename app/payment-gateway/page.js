"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PaymentGateway() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            try {
                // Decode base64 to binary string
                const binaryString = atob(data);
                // Convert binary string to Uint8Array
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                // Decode Uint8Array as UTF-8
                const decodedString = new TextDecoder().decode(bytes);
                const parsedData = JSON.parse(decodedString);
                setOrderData(parsedData);
            } catch (e) {
                console.error("Decoding error:", e);
                setError('Invalid payment data');
            }
        } else {
            setError('No payment data found');
        }
    }, [searchParams]);

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/site/payment/cross-site/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Payment initialization failed');
            }

            if (result.approvalUrl) {
                window.location.href = result.approvalUrl;
            } else if (result.url) {
                // Stripe redirect
                window.location.href = result.url;
            } else {
                throw new Error('No approval URL returned');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Complete Your Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Order ID</span>
                            <span>{orderData.orderId}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Total Amount</span>
                            <span>${Number(orderData.amount).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-2">Items</h3>
                        <div className="space-y-2">
                            {orderData.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="truncate flex-1 mr-4">{item.name}</span>
                                    <span className="text-gray-500">x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            orderData.paymentType === 'stripe' ? 'Pay with Stripe' : 'Pay with PayPal'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
