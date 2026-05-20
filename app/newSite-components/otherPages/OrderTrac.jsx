"use client";
import React from "react";
import Link from "next/link";
export default function OrderTrac() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="login-wrap tracking-wrap">
          <div className="left">
            <div className="heading">
              <h4 className="mb_8">Order Tracking</h4>
              <p>
                To track your order please enter your Order ID in the box below
                and press the "Track" button. This was given to you on your
                receipt and in the confirmation email you should have received.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="form-login">
              <div className="wrap">
                <fieldset>
                  <input type="text" placeholder="Username or email address*" />
                </fieldset>
                <fieldset>
                  <input type="text" placeholder="Billing Email*" />
                </fieldset>
              </div>
              <div className="button-submit">
                <button className="tf-btn btn-fill" type="submit">
                  <span className="text">Tracking Orders</span>
                </button>
              </div>
            </form>
          </div>
          <div className="right">
            <h4 className="mb_8">Already have an account?</h4>
            <p className="text-secondary">
              Welcome back. Sign in to access your personalized experience,
              saved preferences, and more. We're thrilled to have you with us
              again!
            </p>
            <Link href={`/login`} className="tf-btn btn-fill">
              <span className="text">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
