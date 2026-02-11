import axios from "axios";
import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import Loading from "../components/Loading";

const PLAN_IDS = {
  UNLIMITED_MONTHLY: {
    planName: "Unlimited Monthly",
    price: 5,
    frequency: "monthly",
  },
  UNLIMITED_YEARLY: {
    planName: "Unlimited Yearly",
    price: 50,
    frequency: "yearly",
  },
};

function ManageSubscription() {
  const [userProfile, setUserProfile] = useState(null);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${serverEndpoint}/profile/get-user-info`,
        { withCredentials: true }
      );
      setUserProfile(response.data.user);
    } catch (error) {
      console.log(error);
      setErrors("Unable to fetch subscription data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  /*
    Capture subscription after Razorpay success
  */
  const rzpResponseHandler = async (response) => {
    try {
      setLoading(true);

      const captureSubsResponse = await axios.post(
        `${serverEndpoint}/payments/capture-subscription`,
        { subscriptionId: response.razorpay_subscription_id },
        { withCredentials: true }
      );

      setUserProfile(captureSubsResponse.data.user);

    } catch (error) {
      console.log(error);
      setErrors(
        "Unable to capture subscription details, contact customer service"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    Create subscription & open Razorpay
  */
  const handleSubscribe = async (planName) => {
    try {
      setLoading(true);

      const createSubscriptionResponse = await axios.post(
        `${serverEndpoint}/payments/create-subscription`,
        { plan_name: planName },
        { withCredentials: true }
      );

      const subscription = createSubscriptionResponse.data.subscription;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: PLAN_IDS[planName].planName,
        description: `Pay INR ${PLAN_IDS[planName].price} ${PLAN_IDS[planName].frequency}`,
        subscription_id: subscription.id,
        theme: { color: "#3399cc" },

        handler: (response) => {
          rzpResponseHandler(response);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      setErrors("Unable to process subscription request");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading subscription details..." />;
  }

  /*
    Show plans if:
    - undefined
    - completed
    - cancelled
  */
  const notSubscribedStatus = [undefined, "completed", "cancelled"];

  const showSubscription =
    notSubscribedStatus.includes(userProfile?.subscription?.status);

  return (
    <div className="container p-5">

      {errors && (
        <div className="alert alert-danger" role="alert">
          {errors}
        </div>
      )}

      {/* Show Plans */}
      {showSubscription && (
        <>
          <div className="row">
            {Object.keys(PLAN_IDS).map((key) => (
              <div
                className="col-auto border m-2 p-3 rounded"
                key={key}
              >
                <h4>{PLAN_IDS[key].planName}</h4>
                <p>
                  Pay INR {PLAN_IDS[key].price}{" "}
                  {PLAN_IDS[key].frequency}
                </p>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleSubscribe(key)}
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Show Current Subscription */}
      {!showSubscription && (
        <>
          <div className="col-auto border m-2 p-3 rounded bg-light">
            <strong>Plan ID:</strong> {userProfile.subscription.planId} <br />
            <strong>Subscription ID:</strong>{" "}
            {userProfile.subscription.subscriptionId} <br />
            <strong>Status:</strong>{" "}
            {userProfile.subscription.status}
          </div>
        </>
      )}

    </div>
  );
}

export default ManageSubscription;
