import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function DiscountProductsSection({ products = [], onAddToCart }) {
  // Filter only products with a discount > 0
  // Show only top 6 discounted products
  const discounted = products.filter((prod) => prod.discount > 0).slice(0, 6);

  return (
    <section className="my-10 w-full px-2 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-pink-50 via-white to-yellow-50 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-pink-700 text-center tracking-tight drop-shadow">Discounted Products</h2>
        {discounted.length === 0 ? (
          <div className="text-center text-gray-400">No discounted products available.</div>
        ) : (
          <Swiper
            modules={[Navigation, A11y, Mousewheel]}
            navigation
            mousewheel
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="w-full"
            style={{ paddingBottom: 40 }}
          >
            {discounted.map((prod) => (
              <SwiperSlide key={prod._id}>
                <div
                  className="bg-white rounded-xl shadow p-4 flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-xl h-full"
                  style={{
                    minHeight: '320px',
                    maxHeight: '370px',
                    height: '100%',
                    minWidth: '220px',
                    maxWidth: '320px',
                    width: '100%',
                    boxSizing: 'border-box',
                    margin: '0 auto',
                    display: 'flex',
                  }}
                >
                  <div className="w-full flex justify-center mb-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-24 w-24 object-contain rounded"
                      style={{ maxWidth: '100%', maxHeight: '96px', minHeight: '96px', minWidth: '96px' }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-center mb-1 line-clamp-2" style={{ minHeight: '2.5rem' }}>{prod.name}</h3>
                  <span className="text-xs text-gray-500 text-center mb-2 line-clamp-1" style={{ minHeight: '1rem' }}>{prod.brand}</span>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="font-bold text-pink-700 text-lg">
                      ${(prod.price * (1 - prod.discount / 100)).toFixed(2)}
                    </span>
                    <span className="line-through text-gray-400">${prod.price.toFixed(2)}</span>
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full ml-1">{prod.discount}% OFF</span>
                  </div>
                  <button className="btn btn-primary btn-sm w-full mt-auto" onClick={() => onAddToCart && onAddToCart(prod)}>
                    Add to Cart
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}