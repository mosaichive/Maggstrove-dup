import { Link } from "react-router-dom";

interface Category {
  name: string;
  image: string;
  link: string;
}

interface CategoryGridProps {
  title?: string;
  categories: Category[];
}

const CategoryGrid = ({ title, categories }: CategoryGridProps) => {
  return (
    <section className="py-12 md:py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.link}
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm md:text-base font-semibold text-primary-foreground uppercase tracking-wider">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
