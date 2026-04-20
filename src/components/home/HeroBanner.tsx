import { Link } from "react-router-dom";

interface HeroBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  align?: "left" | "center" | "right";
  overlay?: boolean;
}

const HeroBanner = ({
  image,
  title,
  subtitle,
  ctaText,
  ctaLink,
  align = "center",
  overlay = true,
}: HeroBannerProps) => {
  const alignmentClasses = {
    left: "items-start text-left pl-8 md:pl-16",
    center: "items-center text-center",
    right: "items-end text-right pr-8 md:pr-16",
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      )}
      <div
        className={`relative z-10 h-full flex flex-col justify-center ${alignmentClasses[align]} px-4`}
      >
        <div className="max-w-2xl animate-slide-up">
          <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              {subtitle}
            </p>
          )}
          <Link to={ctaLink} className="btn-primary inline-block">
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
