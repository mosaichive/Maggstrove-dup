import { Link } from "react-router-dom";

interface StylePost {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
}

interface StyleFeedProps {
  posts: StylePost[];
}

const StyleFeed = ({ posts }: StyleFeedProps) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Style Feed</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
          Get inspired by the latest trends and outfit ideas curated just for you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              to={post.link}
              className={`group relative overflow-hidden ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${
                  index === 0 ? "aspect-[4/3] md:aspect-square" : "aspect-[4/3]"
                }`}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-primary-foreground mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/80 line-clamp-2">
                    {post.description}
                  </p>
                  <span className="inline-block mt-4 text-sm text-primary-foreground font-medium underline underline-offset-4 group-hover:no-underline">
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleFeed;
