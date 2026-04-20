import { Link } from "react-router-dom";

interface PromoBannerProps {
  leftImage: string;
  leftTitle: string;
  leftCta: string;
  leftLink: string;
  rightImage: string;
  rightTitle: string;
  rightCta: string;
  rightLink: string;
}

const PromoBanner = ({
  leftImage,
  leftTitle,
  leftCta,
  leftLink,
  rightImage,
  rightTitle,
  rightCta,
  rightLink,
}: PromoBannerProps) => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left Panel */}
          <Link
            to={leftLink}
            className="group relative bg-secondary overflow-hidden flex items-end justify-center aspect-[3/4] md:aspect-[4/5]"
          >
            <img
              src={leftImage}
              alt={leftTitle}
              className="absolute inset-0 w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {/* Text overlay — positioned mid-right */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none z-10">
              <span className="text-lg md:text-2xl font-bold tracking-[0.15em] uppercase text-foreground">
                {leftTitle}
              </span>
              <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">
                {leftCta}
              </span>
            </div>
          </Link>

          {/* Right Panel */}
          <Link
            to={rightLink}
            className="group relative bg-secondary overflow-hidden flex items-end justify-center aspect-[3/4] md:aspect-[4/5]"
          >
            <img
              src={rightImage}
              alt={rightTitle}
              className="absolute inset-0 w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none z-10">
              <span className="text-lg md:text-2xl font-bold tracking-[0.15em] uppercase text-foreground">
                {rightTitle}
              </span>
              <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">
                {rightCta}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
