import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartItem } from '../api/cartApi';
import { PAGE_STYLES } from '../constants/styles';
import { motion } from "framer-motion";
import SEO from '../components/SEO';
const MAX_STOCK = 3;

function Cart() {
	const navigate = useNavigate();
	const [isRemoving, setIsRemoving] = useState(null);
	const [quantities, setQuantities] = useState({});
	const { cart:cartStyle } = PAGE_STYLES;
	const { data: cartResponse, isLoading, error, refetch } = useQuery({
		queryKey: ['cart'],
		queryFn: () => getCart(),
		refetchOnMount: 'always',
	});

	const cartItems = cartResponse?.data || [];

	// seed local quantities once items arrive, without overwriting user-adjusted counts
	useEffect(() => {
		setQuantities(prev => {
			const next = { ...prev };
			cartItems.forEach(item => {
				if (next[item.id] === undefined) {
					next[item.id] = item.quantity || 1;
				}
			});
			return next;
		});
	}, [cartItems]);

	const getStock = item => item.stock ?? MAX_STOCK;
	const getQuantity = item => quantities[item.id] ?? item.quantity ?? 1;
	const isOutOfStock = item => getQuantity(item) >= getStock(item);

	const handleIncreaseCount = item => {
		const current = quantities[item.id] ?? item.quantity ?? 1;
		const stock = getStock(item);
		const newQty = Math.min(current + 1, stock);
		setQuantities(prev => ({ ...prev, [item.id]: newQty }));
		updateCartItem(item.id, { quantity: newQty }).catch(console.error);
	};

	const handleDecreaseCount = item => {
		const current = quantities[item.id] ?? item.quantity ?? 1;
		const newQty = Math.max(current - 1, 1);
		setQuantities(prev => ({ ...prev, [item.id]: newQty }));
		updateCartItem(item.id, { quantity: newQty }).catch(console.error);
	};

	const handleRemoveFromCart = async id => {
		try {
			setIsRemoving(id);
			await removeFromCart(id);
			refetch();
		} catch (err) {
			console.error('Error removing from cart:', err);
		} finally {
			setIsRemoving(null);
		}
	};

	const totalPrice = cartItems.reduce(
		(sum, item) => sum + (item.price || 0) * getQuantity(item),
		0
	);

	if (isLoading) {
		return <div className="p-5">Loading cart...</div>;
	}

	if (error) {
		return <div className="p-5 text-red-400">Error loading cart: {error.message}</div>;
	}

	if (cartItems.length === 0) {
		return (
			<div className="p-5 flex flex-col items-center gap-4">
				<h1 className="font-bold text-2xl">Shopping Cart</h1>
				<img
					src="/images/no-found.svg"
					alt="no-found"
					loading="lazy"
					className="w-96 h-96 object-fit rounded-lg"
				/>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			className={cartStyle.container}>
			<SEO title="Shopping Cart - Review Your Items" description="Review and manage items in your shopping cart. Proceed to checkout for fast delivery." />
			<h1 className={cartStyle.heading}>Shopping Cart</h1>

			{/* Mobile card layout */}
			<div className={cartStyle.mobileCardLayout}>
				{cartItems.map(item => {
					const quantity = getQuantity(item);
					const outOfStock = isOutOfStock(item);
					return (
						<div
							key={item.id}
							className={cartStyle.mobileCard}
							style={{
								background: '#1a1a2e',
								border: '1px solid #2a2a3e',
								opacity: outOfStock ? 0.5 : 1
							}}>
							<div className="flex gap-3 items-center">
								{item.image && (
									<img
										src={item.image}
										alt={item.title}
										loading="lazy"
										className="w-16 h-16 object-cover rounded"
									/>
								)}
								<div className="flex-1 min-w-0">
									<h6 className="text-sm font-semibold truncate">{item.title}</h6>
									<p className="text-lg font-bold text-orange-500">
										${(item.price * quantity).toFixed(2)}
									</p>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className={cartStyle.mobileQuantityControls}>
									<button
										onClick={() => handleDecreaseCount(item)}
										disabled={quantity <= 1}
										className={cartStyle.mobileQuantityDecrementButton}>
										-
									</button>
									<span>{quantity}</span>
									<button
										onClick={() => handleIncreaseCount(item)}
										disabled={outOfStock}
										className={cartStyle.mobileQuantityIncrementButton}>
										+
									</button>
								</div>
								<button
									onClick={() => handleRemoveFromCart(item.id)}
									disabled={isRemoving === item.id}
									className="btn btn-danger btn-sm"
									style={{ opacity: isRemoving === item.id ? 0.6 : 1 }}>
									{isRemoving === item.id ? '...' : 'Remove'}
								</button>
							</div>
							{outOfStock && <p className="text-xs text-red-500 m-0">Out of stock</p>}
						</div>
					);
				})}
			</div>

			{/* Desktop table layout */}
			<div className={cartStyle.desktopTableLayout}>
				<table className={cartStyle.desktopTable} style={{ background: '#1a1a2e', color: '#fff' }}>
					<thead>
						<tr>
							<th>Product</th>
							<th>Count</th>
							<th>Price</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{cartItems.map(item => {
							const quantity = getQuantity(item);
							const outOfStock = isOutOfStock(item);
							return (
								<tr key={item.id} style={{ opacity: outOfStock ? 0.5 : 1 }}>
									<td>
										<div
											className="m-2"
											style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
											{item.image && (
												<img
													src={item.image}
													alt={item.title}
													loading="lazy"
													style={{
														width: '60px',
														height: '60px',
														objectFit: 'cover',
														borderRadius: '4px'
													}}
												/>
											)}
											<div>
												<h6>{item.title}</h6>
												{item.description && (
													<p style={{ fontSize: '12px', color: '#999', marginBottom: 0 }}>
														{item.description.substring(0, 50)}...
													</p>
												)}
											</div>
										</div>
									</td>
									<td>
										<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
											<button
												onClick={() => handleDecreaseCount(item)}
												disabled={quantity <= 1}
												className={cartStyle.mobileQuantityDecrementButton}>
												-
											</button>
											<span>{quantity}</span>
											<button
												onClick={() => handleIncreaseCount(item)}
												disabled={outOfStock}
												className={cartStyle.mobileQuantityIncrementButton}>
												+
											</button>
										</div>
										{outOfStock && (
											<p
												style={{
													fontSize: '12px',
													color: '#dc3545',
													marginBottom: 0,
													marginTop: '4px'
												}}>
												Out of stock
											</p>
										)}
									</td>
									<td>${(item.price * quantity).toFixed(2)}</td>
									<td>
										<button
											onClick={() => handleRemoveFromCart(item.id)}
											disabled={isRemoving === item.id}
											className="btn btn-danger btn-sm"
											style={{ opacity: isRemoving === item.id ? 0.6 : 1 }}>
											{isRemoving === item.id ? 'Removing...' : 'Remove'}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className={cartStyle.cartItemTotal}>
				<h5>
					Total: <strong>${totalPrice.toFixed(2)}</strong>
				</h5>
				<button
					className="btn mt-3"
					style={{
						fontSize: '16px',
						padding: '10px 30px',
						background: '#ff6600',
						color: '#fff',
						border: 'none'
					}}
					onClick={() => navigate('/checkout')}>
					Checkout
				</button>
			</div>
		</motion.div>
	);
}

export default Cart;
