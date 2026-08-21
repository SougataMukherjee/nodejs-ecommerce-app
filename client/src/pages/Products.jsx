import { useState, useEffect, useMemo } from 'react';
import useProducts from '../hooks/useProducts';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Search from '../components/Search';
import CategoryFilter from '../components/CategoryFilter';
import { getRandomIndices } from '../utils/getRandomIndices';
import CountdownTimer from '../components/CountdownTimer';
import ImageCarousel from '../components/ImageCarousel';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const carouselImages = [
	'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800',
	'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
	'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
	'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
	'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800',
	'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
];

function Products() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [category, setCategory] = useState('');
	const trendingIds = useMemo(() => getRandomIndices(1, 20, 3), []);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(search), 500);
		return () => clearTimeout(timer);
	}, [search]);

	const filters = {};
	if (debouncedSearch) filters.title = debouncedSearch;
	if (category) filters.category = category;

	const { data, isLoading } = useProducts(filters);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[80vh]">
				<Loader />
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<SEO title="Products - Shop the Best Deals" description="Browse our wide selection of products at great prices. Find trending items, electronics, clothing, and more." />
			<div className="flex flex-col md:flex-row gap-4 p-5">
				<div className="w-full md:flex-1">
					<Search value={search} onChange={setSearch} />
				</div>
				<div className="w-full md:w-64">
					<CategoryFilter value={category} onChange={setCategory} />
				</div>
			</div>
			<div className="px-5 pb-2">
				<CountdownTimer />
			</div>
			<ImageCarousel images={carouselImages} />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5 pb-5">
				{isLoading ? (
					<div className="col-span-3">
						<Loader />
					</div>
				) : data?.length === 0 ? (
					<p className="col-span-3 text-center text-gray-400 flex justify-center">
						<img
							src="/images/no-found.svg"
							alt="no-found"
							loading="lazy"
							className="w-96 h-96 object-fit rounded-lg"
						/>
					</p>
				) : (
					data?.map(product => (
						<ProductCard
							key={product.id}
							product={product}
							isTrending={trendingIds.includes(product.id)}
						/>
					))
				)}
			</div>
		</motion.div>
	);
}

export default Products;
