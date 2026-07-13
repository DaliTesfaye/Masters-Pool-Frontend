import Navbar from "./components/navbar";
import AboutSection from "./sections/about";
import Footer from "./sections/footer";
import HomePage from "./sections/hero";
import ProductsShowcaseSection from "./sections/products-showcase";

export default function Home() {
  return (
    <>
      <HomePage />
      <AboutSection />
      <ProductsShowcaseSection />
      <Footer />
    </>
  );
}
