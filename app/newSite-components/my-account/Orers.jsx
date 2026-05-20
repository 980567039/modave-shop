"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Orers() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/site/account/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    } else {
        // optionally handle no session case if not redirected by middleware
        setLoading(false); 
    }
  }, [session]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="my-account-content">
      <div className="account-orders">
        <div className="wrap-account-order">
          <table>
            <thead>
              <tr>
                <th className="fw-6">Order</th>
                <th className="fw-6">Date</th>
                <th className="fw-6">Status</th>
                <th className="fw-6">Total</th>
                <th className="fw-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="tf-order-item">
                    <td>#{order.customOrderId || order._id}</td>
                    <td>{new Date(order.date || order.createdAt).toLocaleDateString()}</td>
                    <td>{order.status}</td>
                    <td>
                      ${order.totalOrderAmount?.toFixed(2)}{" "}
                      for {order.items?.length || 0} items
                    </td>
                    <td>
                      <Link
                        href={`/my-account-orders-details?id=${order._id}`}
                        className="tf-btn btn-fill radius-4"
                      >
                        <span className="text">View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
