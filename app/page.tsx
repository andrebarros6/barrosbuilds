import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Context from "@/components/Context";
import ProductTracker from "@/components/ProductTracker";
import FeaturedProducts from "@/components/FeaturedProducts";
import FollowTheBuild from "@/components/FollowTheBuild";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Context />
      <ProductTracker />
      <FeaturedProducts />
      <FollowTheBuild />
      <Footer />
    </main>
  );
}
