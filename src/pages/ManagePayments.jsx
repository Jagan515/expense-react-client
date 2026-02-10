import { useEffect, useState } from "react";
import axios from "axios";

import { serverEndpoint } from "../config/appConfig";
import Loading from "../components/Loading";

const CREDITS_PACK = [
    { price: 1, credits: 10 },
    { price: 4, credits: 50 },
    { price: 7, credits: 100 },
];

function ManagePayments() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const getUserProfile = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/profile/get-user-info`,
                { withCredentials: true }
            );

            setUserProfile(response.data.user);
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setError("Unable to fetch user profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    useEffect(() => {
        if (!successMessage && !error) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
            setError("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage, error]);

    const paymentResponseHandler = async (credits, payment) => {
        try {
            const response = await axios.post(
                `${serverEndpoint}/payments/verify-order`,
                {
                    razorpay_order_id: payment.razorpay_order_id,
                    razorpay_payment_id: payment.razorpay_payment_id,
                    razorpay_signature: payment.razorpay_signature,
                    credits,
                },
                { withCredentials: true }
            );

            setUserProfile(response.data.user);
            setSuccessMessage(`${credits} credits added successfully`);
            setError("");
        } catch (err) {
            console.error("Payment verification failed:", err);
            setError(
                "Unable to process payment request, contact customer service"
            );
        }
    };

    const handlePayment = async (credits) => {
        try {
            setLoading(true);

            const orderResponse = await axios.post(
                `${serverEndpoint}/payments/create-order`,
                { credits },
                { withCredentials: true }
            );

            const order = orderResponse.data.order;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "MergeMoney",
                description: `Order for purchasing ${credits} credits`,
                order_id: order.id,
                theme: { color: "#3399cc" },
                handler: (response) =>
                    paymentResponseHandler(credits, response),
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Payment initiation failed:", err);
            setError("Unable to process the payment request");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading text="Loading payment details..." />;
    }

    return (
        <div className="container p-5">
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}

            <h2>Manage Payments</h2>

            <p>
                <strong>Current Credit Balance:</strong>{" "}
                {userProfile?.credits || 0}
            </p>

            <div className="row">
                {CREDITS_PACK.map((credit) => (
                    <div
                        key={credit.credits}
                        className="col-auto border m-2 p-3 rounded"
                    >
                        <h4>{credit.credits} Credits</h4>
                        <p>
                            Buy {credit.credits} Credits for INR{" "}
                            {credit.price}
                        </p>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                                handlePayment(credit.credits)
                            }
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManagePayments;
