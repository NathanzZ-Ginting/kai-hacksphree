import { useState, useEffect } from "react";

import banner1 from "/assets/images/banners/banner1.jpg";
import banner2 from "/assets/images/banners/banner2.jpg";
import banner3 from "/assets/images/banners/banner3.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    {
      id: 1,
      image: banner1,
    },
    {
      id: 2,
      image: banner2,
    },
    {
      id: 3,
      image: banner3,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <section className="relative lg:h-screen overflow-hidden h-[200px]">
      {/* Background Slides */}
      <div className="relative h-full w-full">
        {bannerImages.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner.image}
              alt={`Banner ${banner.id}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute lg:bottom-8 bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`lg:w-3 lg:h-3 w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
