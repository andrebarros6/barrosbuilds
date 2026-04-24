import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProductTracker from "@/components/ProductTracker";
import FeaturedProducts from "@/components/FeaturedProducts";
import Context from "@/components/Context";
import Signal from "@/components/Signal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProductTracker />
      <FeaturedProducts />
      <Context />
      <Signal />
      <Footer />
    </main>
  );
}
