import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

export default function BannerSlider({ banners = [] }) {
  if (!banners.length) return null;
  return (
    <section className="mt-4 lg:pl-10 lg:pr-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="h-60 sm:h-72 md:h-80 w-full rounded-none overflow-hidden shadow-lg"
      >
        {banners.map((b, idx) => (
          <SwiperSlide key={b._id || idx} className="w-full">
            <div className="flex flex-col md:flex-row h-full items-center bg-base-200 w-full px-2 sm:px-4 md:px-16 py-4 gap-4 md:gap-0">
              <img
                src={b.image}
                alt={b.title}
                className="h-32 sm:h-40 w-auto object-contain rounded-lg md:mr-8 mb-4 md:mb-0"
              />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm sm:text-base">{b.description}</p>
                {b.seller && (
                  <span className="badge badge-info mt-3">Seller: {typeof b.seller === 'object' ? b.seller.username : b.seller}</span>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
