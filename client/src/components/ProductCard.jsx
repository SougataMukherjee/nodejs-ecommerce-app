import { Link } from "react-router-dom";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

function ProductCard({ product, isTrending }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(255,102,0,0.50), transparent 80%)`;
  const boxShadow = useMotionTemplate`0 0 30px 2px rgba(255,102,0,0.08), inset 0 0 60px 4px rgba(255,102,0,0.04)`;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <motion.div
        className="group card shadow p-4 shine-card relative overflow-hidden"
        style={{ cursor: "pointer", background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#fff" }}
        onMouseMove={handleMouseMove}
        whileHover={{ translateY: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background, boxShadow }}
        />
        {isTrending && (
          <span className="absolute top-3 right-[-35px] rotate-45 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-10 py-1 shadow-lg z-10">
            Trending
          </span>
        )}
        <img 
          src={product.image} 
          alt={product.title} 
          loading="lazy"
          className="aspect-square md:aspect-auto relative z-[1]"
          style={{ width: "100%", objectFit: "cover", height: '250px', borderRadius: "8px", marginBottom: "12px" }}
        />
        <h2 className="relative z-[1]" style={{ marginBottom: "8px" }}>{product.title}</h2>
        <p className="relative z-[1]" style={{ fontSize: "18px", fontWeight: "bold", color: "#ff6600" }}>${product.price}</p>
      </motion.div>
    </Link>
  );
}

export default ProductCard;