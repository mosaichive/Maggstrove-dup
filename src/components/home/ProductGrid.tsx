import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductGridProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const ProductGrid = ({ title, products, viewAllLink }: ProductGridProps) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title mb-0">{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className="text-sm font-medium underline underline-offset-4 hover:no-underline">
              View All
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
