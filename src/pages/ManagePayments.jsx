import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

const CREDITS_PACK = [
  { price: 1, credits: 10 },
  { price: 4, credits: 50 },
  { price: 7, credits: 100 },
];

function ManagePayments() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);


  // Fetch Profile (Source of Truth)

  const refreshProfile = useCallback(async () => {
    try {
      const response = await axios.get(
        `${serverEndpoint}/profile/get-user-info`,
        { withCredentials: true }
      );

      setUserProfile(response.data.user);
    } catch (error) {
      console.error(error);
      setErrors({ message: "Unable to fetch user profile" });
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // -----------------------------
  // Payment Verify Handler
  // -----------------------------
  const paymentResponseHandler = async (credits, payment) => {
    try {
      setActionLoading(true);
      setErrors({});
      setSuccessMessage("");

      const response = await axios.post(
        `${serverEndpoint}/payments/verify-order`,
        {
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
          credits: credits,
        },
        { withCredentials: true }
      );

      // Backend is source of truth
      setUserProfile(response.data.user);

      setSuccessMessage(
        `Payment successful. ${credits} credits have been added to your account.`
      );

    } catch (error) {
      console.error(error);
      setErrors({
        message:
          "Unable to process payment request, contact customer service",
      });
    } finally {
      setActionLoading(false);
    }
  };

  
  // Create Order + Open Razorpay

  const handlePayment = async (credits) => {
    try {
      setActionLoading(true);
      setErrors({});
      setSuccessMessage("");

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

    } catch (error) {
      console.error(error);
      setErrors({ message: "Unable to process the payment request" });
      setActionLoading(false);
    }
  };

  // -----------------------------
  // Initial Loading
  // -----------------------------
  if (profileLoading) {
    return (
      <div className="container p-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-5">

      {errors.message && (
        <div className="alert alert-danger" role="alert">
          {errors.message}
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

      {CREDITS_PACK.map((credit, index) => (
        <div key={index} className="col-auto border m-2 p-3 rounded">
          <h4>{credit.credits} Credits</h4>
          <p>
            Buy {credit.credits} Credits for INR {credit.price}
          </p>

          <button
            className="btn btn-outline-primary"
            disabled={actionLoading}
            onClick={() => handlePayment(credit.credits)}
          >
            {actionLoading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManagePayments;
