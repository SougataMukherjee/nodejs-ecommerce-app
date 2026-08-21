import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function createConfettiPiece() {
  const colors = ["#ff6600", "#ff3366", "#33ccff", "#66ff66", "#ffcc00", "#cc66ff", "#ff6699", "#00cccc"];
  return {
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 8,
    speedY: 0.5 + Math.random() * 1.5,
    speedX: -0.5 + Math.random() * 1,
    rotationSpeed: -2 + Math.random() * 4,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  };
}

function Confetti({ duration = 8000 }) {
  const [pieces, setPieces] = useState(() =>
    Array.from({ length: 200 }, createConfettiPiece)
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPieces((prev) =>
        prev.map((p) =>
          p.y > 110
            ? createConfettiPiece()
            : { ...p, y: p.y + p.speedY, x: p.x + p.speedX, rotation: p.rotation + p.rotationSpeed }
        )
      );
    }, 30);

    const timeout = setTimeout(() => {
      setVisible(false);
      clearInterval(interval);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9999 }}>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.shape === "rect" ? p.size * 0.6 : p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function OrderSuccess() {
  const navigate = useNavigate();

  const handleContinue = useCallback(() => {
    navigate("/products");
  }, [navigate]);

  return (
    <>
      <Confetti />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0d0d1a",
        padding: "20px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>
          <h1 style={{ color: "#66ff66", fontSize: "36px", marginBottom: "10px" }}>
            Order Successful!
          </h1>
          <p style={{ color: "#ccc", fontSize: "18px", marginBottom: "40px" }}>
            Thank you for your purchase. Your order has been placed.
          </p>
          <button
            onClick={handleContinue}
            style={{
              background: "#ff6600",
              color: "#fff",
              border: "none",
              padding: "14px 40px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderSuccess;
