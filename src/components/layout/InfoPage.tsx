import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface InfoPageProps {
  title: string;
  children: React.ReactNode;
}

const InfoPage = ({ title, children }: InfoPageProps) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-neutral dark:prose-invert">
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

export default InfoPage;
