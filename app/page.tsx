import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Pillars from "@/components/Pillars";
import ProductTracker from "@/components/ProductTracker";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Pillars />
      <FeaturedProducts />
      <ProductTracker />
      <Footer />
    </main>
  );
}
