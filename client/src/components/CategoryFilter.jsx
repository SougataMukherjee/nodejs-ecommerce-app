const categories = [
	"men's clothing",
	"women's clothing",
	"jewelery",
	"electronics",
];

function CategoryFilter({ value, onChange }) {
	return (
		<select
			className="select select-bordered w-full rounded-lg border-2 px-3 py-2"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			style={{ background: '#1a1a2e', borderColor: '#2a2a3e', color: '#fff' }}
		>
			<option value="">All Categories</option>
			{categories.map((cat) => (
				<option key={cat} value={cat}>
					{cat.charAt(0).toUpperCase() + cat.slice(1)}
				</option>
			))}
		</select>
	);
}

export default CategoryFilter;
