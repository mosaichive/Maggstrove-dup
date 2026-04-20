import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import founderImg from "@/assets/founder.jpg";

const AboutPage = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      {/* Hero Title */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">About Us</h1>
        </div>
      </section>

      {/* Brand Story */}
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-4xl text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
          Welcome to <strong className="text-foreground">Maggs Trove</strong> — your curated destination for bold, fashion-forward pieces that celebrate confidence and individuality. Founded with a passion for making luxury accessible, we hand-select every item in our collection to ensure quality craftsmanship, on-trend design, and timeless appeal.
        </p>
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg mt-4">
          Our mission is simple: to help you look and feel your absolute best — every single day.
        </p>
      </section>

      {/* Founder Section */}
      <section className="bg-secondary/50">
        <div className="container mx-auto px-4 py-14 md:py-20 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Founder Image */}
            <div className="w-full aspect-[3/4] overflow-hidden">
              <img
                src={founderImg}
                alt="Maame Nyarkoah Margrette — Founder of Maggs Trove"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Founder Bio */}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Meet the Founder</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Maame Nyarkoah Margrette</h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Maame Nyarkoah Margrette founded Maggs Trove with a singular vision — to create a fashion destination where style, quality, and accessibility converge. With an eye for detail and a deep love for contemporary design, she curates every piece to empower women to express their individuality with confidence.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg mt-4">
                What started as a personal passion for discovering unique, well-crafted garments quickly grew into a brand that resonates with fashion-forward women everywhere. For Maame, Maggs Trove is more than a store — it's a celebration of boldness, beauty, and self-expression.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default AboutPage;
