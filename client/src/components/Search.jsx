import { useState, useEffect } from 'react';

const placeholders = ['Search by title...', 'Buy your product'];

function Search({ value, onChange }) {
	const [index, setIndex] = useState(0);
	const [animating, setAnimating] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimating(true);
			setTimeout(() => {
				setIndex((prev) => (prev + 1) % placeholders.length);
				setAnimating(false);
			}, 400);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<label className="input w-full rounded-lg border-2 px-3 py-2 relative" style={{ background: '#1a1a2e', borderColor: '#2a2a3e', color: '#fff' }}>
			<svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<g
					strokeLinejoin="round"
					strokeLinecap="round"
					strokeWidth="2.5"
					fill="none"
					stroke="currentColor">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.3-4.3"></path>
				</g>
			</svg>
			<div className="grow relative overflow-hidden">
				<input
					type="search"
					className="grow w-full bg-transparent outline-none"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
				{!value && (
					<span
						className="absolute left-0 top-1/2 pointer-events-none text-gray-400 whitespace-nowrap"
						style={{
							transition: 'transform 0.4s ease, opacity 0.4s ease',
							transform: animating ? 'translateY(-120%)' : 'translateY(-50%)',
							opacity: animating ? 0 : 1,
						}}
					>
						{placeholders[index]}
					</span>
				)}
			</div>
		</label>
	);
}
export default Search;
