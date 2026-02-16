import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
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
  const [profileLoading, setProfileLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // -----------------------------
  // Fetch Profile (SOURCE OF TRUTH)
  // -----------------------------
  const refreshProfile = useCallback(async () => {
    try {
      const response = await axios.get(
        `${serverEndpoint}/profile/get-user-info`,
        { withCredentials: true }
      );

      setUserProfile(response.data.user);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setErrors("Unable to fetch subscription data");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // -----------------------------
  // REAL POLLING (NO HEURISTICS)
  // -----------------------------
  const waitForSubscriptionStatus = async (
    expectedStatuses,
    timeout = 15000
  ) => {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const response = await axios.get(
        `${serverEndpoint}/profile/get-user-info`,
        { withCredentials: true }
      );

      const status = response.data.user?.subscription?.status;

      if (expectedStatuses.includes(status)) {
        setUserProfile(response.data.user);
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return false;
  };

  // -----------------------------
  // Derived State (Pure)
  // -----------------------------
  const subscriptionStatus = userProfile?.subscription?.status;

  const { showPlans, isActive, isPendingCancel } = useMemo(() => {
    return {
      showPlans:
        !subscriptionStatus ||
        subscriptionStatus === "cancelled" ||
        subscriptionStatus === "completed",

      isActive: subscriptionStatus === "active",

      isPendingCancel: subscriptionStatus === "pending_cancel",
    };
  }, [subscriptionStatus]);

  // -----------------------------
  // CREATE SUBSCRIPTION
  // -----------------------------
  const handleSubscribe = async (planName) => {
    try {
      setActionLoading(true);

      const { data } = await axios.post(
        `${serverEndpoint}/payments/create-subscription`,
        { plan_name: planName },
        { withCredentials: true }
      );

      const subscription = data.subscription;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: PLAN_IDS[planName].planName,
        description: `Pay INR ${PLAN_IDS[planName].price} ${PLAN_IDS[planName].frequency}`,
        subscription_id: subscription.id,

        handler: async (response) => {
          await axios.post(
            `${serverEndpoint}/payments/capture-subscription`,
            { subscriptionId: response.razorpay_subscription_id },
            { withCredentials: true }
          );

          // WAIT until webhook updates DB to active
          const success = await waitForSubscriptionStatus(["active"]);

          if (!success) {
            setErrors("Subscription activation delayed. Please refresh.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error.response?.data || error.message);
      setErrors(error.response?.data?.message || "Subscription failed");
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------
  // CANCEL SUBSCRIPTION
  // -----------------------------
  const handleCancelSubscription = async () => {
    try {
      setActionLoading(true);

      await axios.post(
        `${serverEndpoint}/payments/cancel-subscription`,
        {},
        { withCredentials: true }
      );

      setShowModal(false);

      // WAIT until webhook updates DB
      const success = await waitForSubscriptionStatus([
        "cancelled",
        "pending_cancel",
      ]);

      if (!success) {
        setErrors("Cancellation processing delayed. Please refresh.");
      }

    } catch (error) {
      console.log(error.response?.data || error.message);
      setErrors(error.response?.data?.message || "Cancellation failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (profileLoading) {
    return <Loading text="Loading subscription details..." />;
  }

  return (
    <div className="container p-5">

      {errors && (
        <div className="alert alert-danger">{errors}</div>
      )}

      {/* SHOW PLANS */}
      {showPlans && (
        <div className="row">
          {Object.keys(PLAN_IDS).map((key) => (
            <div className="col-auto border m-2 p-3 rounded" key={key}>
              <h4>{PLAN_IDS[key].planName}</h4>
              <p>
                Pay INR {PLAN_IDS[key].price} {PLAN_IDS[key].frequency}
              </p>

              <button
                className="btn btn-outline-primary"
                disabled={actionLoading}
                onClick={() => handleSubscribe(key)}
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE / PENDING UI */}
      {(isActive || isPendingCancel) && (
        <div className="col-auto border m-2 p-3 rounded bg-light">
          <strong>Plan ID:</strong> {userProfile.subscription.planId} <br />
          <strong>Status:</strong> {subscriptionStatus} <br />

          {isPendingCancel && (
            <div className="alert alert-warning mt-3">
              Your subscription will end at the end of the billing cycle.
            </div>
          )}

          {isActive && (
            <button
              className="btn btn-danger mt-3"
              disabled={actionLoading}
              onClick={() => setShowModal(true)}
            >
              Cancel Subscription
            </button>
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Cancellation</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to cancel?
                You will retain access until billing cycle ends.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-danger"
                  disabled={actionLoading}
                  onClick={handleCancelSubscription}
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageSubscription;
