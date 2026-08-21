import { useRef, useEffect, useCallback } from 'react';

function ImageCarousel({ images = [], interval = 2000 }) {
  const carouselRef = useRef(null);
  const timerRef = useRef(null);

  const scrollRight = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, []);

  const scrollLeftFn = () => {
    if (!carouselRef.current) return;
    const { scrollLeft } = carouselRef.current;
    if (scrollLeft <= 10) {
      carouselRef.current.scrollTo({ left: carouselRef.current.scrollWidth, behavior: 'smooth' });
    } else {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(scrollRight, interval);
    return () => clearInterval(timerRef.current);
  }, [scrollRight, interval]);

  if (!images.length) return null;

  return (
    <div className="relative w-full px-5 py-4">
      <button
        onClick={scrollLeftFn}
        className="btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-none shadow-lg hover:scale-110 hover:shadow-orange-500/40 transition-all duration-300"
      >
        ❮
      </button>

      <div
        ref={carouselRef}
        className="flex flex-row flex-nowrap gap-4 w-full overflow-x-auto scroll-smooth rounded-box py-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map((src, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="rounded-xl h-48 md:h-64 w-72 md:w-96 object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-none shadow-lg hover:scale-110 hover:shadow-orange-500/40 transition-all duration-300"
      >
        ❯
      </button>
    </div>
  );
}

export default ImageCarousel;
