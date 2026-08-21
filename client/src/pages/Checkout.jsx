import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCart, clearCart } from "../api/cartApi";
import { createOrder } from "../api/orderApi";

function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", city: "", pin: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartResponse, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    refetchOnMount: "always",
  });

  const cartItems = cartResponse?.data || [];

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await createOrder({
        customerName: form.name,
        address: form.address,
        city: form.city,
        pin: form.pin,
        items: cartItems.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
        })),
        total: totalPrice,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      });
      await clearCart();
      navigate("/ordersuccess");
    } catch (err) {
      console.error("Error processing order:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = form.name && form.address && form.city && form.pin;

  if (isLoading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5 text-danger">Error: {error.message}</div>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0d0d1a", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <h2 style={{ color: "#ff6600", marginBottom: "30px", textAlign: "center" }}>Checkout</h2>

        <form onSubmit={handlePayNow}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "25px" }}>
            <input
              type="text"
              name="pin"
              placeholder="Pin Code"
              value={form.pin}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <h4 style={{ color: "#ff6600" }}>
              Total to Pay: ₹{totalPrice.toFixed(2)}
            </h4>
          </div>

          <div style={{ textAlign: "right" }}>
            <button
              type="submit"
              disabled={!isFormValid || isProcessing}
              style={{
                background: "#ff6600",
                color: "#fff",
                border: "none",
                padding: "12px 35px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: isFormValid && !isProcessing ? "pointer" : "not-allowed",
                opacity: isFormValid && !isProcessing ? 1 : 0.6,
              }}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  fontSize: "16px",
  border: "1px solid #2a2a3e",
  borderRadius: "8px",
  background: "#1a1a2e",
  color: "#fff",
  outline: "none",
};

export default Checkout;
