import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getProduct } from "../api/productApi";
import { addToCart, getCart, updateCartItem } from "../api/cartApi";
import SEO from "../components/SEO";
import { generateFakeRating ,StarRating} from "../components/StarRating";

const MAX_STOCK = 3;

function ProductDetails() {
  const { id } = useParams();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-5">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-400">Error loading product: {error.message}</div>;
  }

  if (!product) {
    return <div className="p-5">Product not found</div>;
  }

  const { rating, count } = generateFakeRating(id);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const cartResponse = await getCart();
      const cartItems = cartResponse?.data || [];
      const existingItem = cartItems.find((item) => item.productId === product.data.id);
      const currentQty = existingItem?.quantity || 0;

      if (currentQty >= MAX_STOCK) {
        toast.error(`"${product.data.title}" is out of stock (max ${MAX_STOCK} allowed)`);
        return;
      }

      if (existingItem) {
        await updateCartItem(existingItem.id, { quantity: currentQty + 1 });
      } else {
        await addToCart({
          productId: product.data.id,
          title: product.data.title,
          price: product.data.price,
          image: product.data.image,
          description: product.data.description,
          quantity: 1,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <SEO title={`${product.data.title} - Buy Now`} description={product.data.description || `Buy ${product.data.title} at the best price. Fast shipping and great deals.`} />
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Product Image */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <img 
            src={product.data.image} 
            alt={product.data.title} 
            loading="lazy"
            className="w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain rounded-lg bg-white p-4"
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
            {product.data.title}
          </h1>

          <StarRating rating={rating} count={count} />

          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
            ${product.data.price}
          </p>

          {product.data.description && (
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-2">
              {product.data.description}
            </p>
          )}

          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="mt-4 w-full sm:w-auto px-10 py-3 text-base font-semibold uppercase tracking-wide rounded cursor-pointer transition-opacity"
            style={{ opacity: isAddingToCart ? 0.6 : 1, background: '#1a1a2e', color: '#fff', border: '2px solid #fff' }}
          >
            {isAddingToCart ? "Adding..." : "ADD TO CART"}
          </button>

          <hr className="border-gray-600 my-4" />

          <div className="flex flex-col gap-2 text-gray-300 text-sm">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;