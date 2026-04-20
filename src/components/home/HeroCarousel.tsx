import { Link } from "react-router-dom";

import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import hero6 from "@/assets/hero-6.jpg";
import hero7 from "@/assets/hero-7.jpg";
import hero8 from "@/assets/hero-8.jpg";
import hero9 from "@/assets/hero-9.jpg";
import hero10 from "@/assets/hero-10.jpg";

const images = [hero2, hero3, hero4, hero5, hero6, hero7, hero8, hero9];
const images2 = [hero10, hero5, hero9, hero3, hero7, hero2, hero4, hero6];
const images3 = [hero6, hero8, hero2, hero10, hero4, hero7, hero3, hero5];

const HeroCarousel = () => {
  return (
    <section className="relative h-screen bg-foreground overflow-hidden">
      {/* Scrolling Image Grid */}
      <div className="absolute inset-0">
        <div className="flex h-full gap-3 p-3 animate-hero-scroll">
          {/* Column 1 - scrolls up */}
          <div className="flex flex-col gap-3 min-w-[180px] md:min-w-[220px] animate-scroll-up">
            {[...images, ...images].map((img, i) => (
              <div
                key={`col1-${i}`}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden shadow-lg flex-shrink-0"
              >
                <img
                  src={img}
                  alt={`Collection ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Column 2 - scrolls down */}
          <div className="flex flex-col gap-3 min-w-[180px] md:min-w-[220px] animate-scroll-down">
            {[...images2, ...images2].map((img, i) => (
              <div
                key={`col2-${i}`}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden shadow-lg flex-shrink-0"
              >
                <img
                  src={img}
                  alt={`Collection ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Column 3 - scrolls up */}
          <div className="flex flex-col gap-3 min-w-[180px] md:min-w-[220px] animate-scroll-up-slow">
            {[...images3, ...images3].map((img, i) => (
              <div
                key={`col3-${i}`}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden shadow-lg flex-shrink-0"
              >
                <img
                  src={img}
                  alt={`Collection ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Column 4 - scrolls down */}
          <div className="flex flex-col gap-3 min-w-[180px] md:min-w-[220px] animate-scroll-down-slow">
            {[...images, ...images].map((img, i) => (
              <div
                key={`col4-${i}`}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden shadow-lg flex-shrink-0"
              >
                <img
                  src={img}
                  alt={`Collection ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Column 5 - scrolls up (hidden on small screens) */}
          <div className="hidden md:flex flex-col gap-3 min-w-[220px] animate-scroll-up">
            {[...images2, ...images2].map((img, i) => (
              <div
                key={`col5-${i}`}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden shadow-lg flex-shrink-0"
              >
                <img
                  src={img}
                  alt={`Collection ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Column 6 - scrolls down (hidden on small screens) */}
          <div className="hidden lg:flex flex-col gap-3 min-w-[220px] animate-scroll-down">
            {[...images3, ...images3].map((img, i) => (
              <div
                key={`col6-${i}`}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden shadow-lg flex-shrink-0"
              >
                <img
                  src={img}
                  alt={`Collection ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Column 7 */}
          <div className="hidden xl:flex flex-col gap-3 min-w-[220px] animate-scroll-up-slow">
            {[...images, ...images].map((img, i) => (
              <div
                key={`col7-${i}`}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden shadow-lg flex-shrink-0"
              >
                <img
                  src={img}
                  alt={`Collection ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Centered Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="animate-slide-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 tracking-tight uppercase">
            Maggs Collection
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-lg mx-auto">
            Fresh styles for new confidence. Discover the latest trends.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/new-in"
              className="btn-primary inline-block"
            >
              Shop Now
            </Link>
            <Link
              to="/women"
              className="inline-block px-8 py-3 border border-primary-foreground/60 text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary-foreground/10 transition-colors"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
