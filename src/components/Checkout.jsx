import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { auth } from "../firebase";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ total, onSuccess, cartItems }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      if (pmError) {
        setError(pmError.message);
        setLoading(false);
        return;
      }
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      // Create payment intent on backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "usd"
        }),
      });
      const result = await res.json();
      if (!result.clientSecret) {
        setError("Failed to initiate payment.");
        setLoading(false);
        return;
      }
      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        // Store payment in backend
        const paymentRes = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              product: item._id,
              quantity: item.quantity,
              price: item.price,
            })),
            amount: Math.round(total * 100),
            status: "paid",
            paymentIntentId: paymentIntent.id,
            method: "card",
          }),
        });
        if (!paymentRes.ok) {
          let backendError = "";
          try {
            const err = await paymentRes.json();
            backendError = err?.error || err?.message || JSON.stringify(err);
          } catch {}
          setError(`Failed to store payment. ${backendError ? "Server: " + backendError : "Please contact support."}`);
          setLoading(false);
          return;
        }
        const paymentData = await paymentRes.json();
        if (!paymentData._id) {
          setError("Payment record missing ID. Please contact support.");
          setLoading(false);
          return;
        }
        // Create invoice in backend
        const invoiceRes = await fetch(`${import.meta.env.VITE_API_URL}/invoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentId: paymentData._id }),
        });
        if (!invoiceRes.ok) {
          let backendError = "";
          try {
            const err = await invoiceRes.json();
            backendError = err?.error || err?.message || JSON.stringify(err);
          } catch {}
          setError(`Failed to create invoice. ${backendError ? "Server: " + backendError : "Please contact support."}`);
          setLoading(false);
          return;
        }
        const invoiceData = await invoiceRes.json();
        if (!invoiceData._id) {
          setError("Invoice record missing ID. Please contact support.");
          setLoading(false);
          return;
        }
        setPaid(true);
        setLoading(false);
        if (onSuccess) onSuccess();
        navigate(`/invoice/${invoiceData._id}`);
      } else {
        setError("Payment failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const handleDownloadInvoicePDF = () => {
    const element = document.getElementById("checkout-invoice-pdf");
    if (element) {
      html2pdf().from(element).save("invoice.pdf");
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-10 bg-base-100 shadow-lg rounded-xl max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center">Checkout</h2>
      <div className="mb-6 flex flex-col items-center">
        <span className="font-semibold text-lg">Grand Total:</span>
        <span className="text-4xl font-bold text-primary">${total.toFixed(2)}</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="label">
          <span className="label-text">Card Details</span>
        </label>
        <CardElement options={{ style: { base: { fontSize: "16px" } }, hidePostalCode: true }} onChange={() => setError("")} />
        {error && <div className="alert alert-error mb-2">{error}</div>}
        <button className="btn btn-primary w-full" disabled={loading || !stripe || total <= 0} type="submit">
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Pay"}
        </button>
      </form>
      {/* Hidden/printable invoice for PDF export */}
      <div id="checkout-invoice-pdf" style={{ display: "none" }}>
        <h2>Invoice</h2>
        <p>Total: ${total.toFixed(2)}</p>
        <p>Date: {new Date().toLocaleString()}</p>
      </div>
      {paid && (
        <div className="flex justify-end mt-4">
          <button type="button" className="btn btn-outline btn-sm" onClick={handleDownloadInvoicePDF}>
            Download Invoice PDF
          </button>
        </div>
      )}
    </div>
  );
}

function Checkout({ cartItems, onSuccess }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-full min-h-screen bg-base-200 flex items-center justify-center py-10">
      <Elements stripe={stripePromise}>
        <CheckoutForm total={total} onSuccess={onSuccess} cartItems={cartItems} />
      </Elements>
    </div>
  );
}

export default Checkout;
