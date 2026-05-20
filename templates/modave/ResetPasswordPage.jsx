
"use client";
import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.error || "Failed to reset password.");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
             <>
                <Topbar6 bgColor="bg-main" />
                <Header1 />
                <div className="container mt-5 mb-5 text-center">
                    <h3>Invalid or missing token.</h3>
                </div>
                <Footer1 />
            </>
        );
    }

    return (
        <>
            <Topbar6 bgColor="bg-main" />
            <Header1 />
            <div
                className="page-title"
                style={{ backgroundImage: "url(/newSite-images/section/page-title.jpg)" }}
            >
                <div className="container-full">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="heading text-center">Reset Password</h3>
                        </div>
                    </div>
                </div>
            </div>

            <section className="flat-spacing">
                <div className="container">
                    <div className="login-wrap">
                        <div className="left">
                            <div className="heading">
                                <h4 className="mb_8">Enter new password</h4>
                            </div>
                            <form onSubmit={handleSubmit} className="form-login">
                                <div className="wrap">
                                    <fieldset className="mb_15">
                                        <input
                                            className=""
                                            type="password"
                                            placeholder="New Password*"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </fieldset>
                                    <fieldset className="">
                                        <input
                                            className=""
                                            type="password"
                                            placeholder="Confirm Password*"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </fieldset>
                                </div>
                                {message && <p className="text-success mt-3">{message}</p>}
                                {error && <p className="text-danger mt-3">{error}</p>}
                                <div className="button-submit">
                                    <button className={`tf-btn btn-fill ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
                                        <span className="text text-button">{loading ? "Resetting..." : "Reset Password"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer1 />
        </>
    );
}
