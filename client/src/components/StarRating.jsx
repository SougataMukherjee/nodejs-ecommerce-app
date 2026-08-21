export function generateFakeRating(id) {
  const seed = id?.split("").reduce((a, c) => a + c.charCodeAt(0), 0) || 42;
  const rating = 3.5 + (seed % 15) / 10;
  const count = 50 + (seed % 200);
  return { rating: Math.min(rating, 5), count };
}

export function StarRating({ rating, count }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`f${i}`} className="text-orange-400 text-lg">★</span>
        ))}
        {halfStar && <span className="text-orange-400 text-lg">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`e${i}`} className="text-gray-400 text-lg">★</span>
        ))}
      </div>
      <span className="text-gray-400 text-sm ml-1">({count})</span>
    </div>
  );
}
