import Products from './Products';
import TopProducts from '../components/TopProducts';

export default function Home() {
  return (
    <div className="w-full bg-gray-50/30">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-[var(--color-text-main)] sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Welcome to </span>
            <span className="block text-[var(--color-primary-600)] xl:inline">ToyLand</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-[var(--color-text-muted)] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover the most amazing, educational, and fun toys for kids of all ages.
          </p>
        </div>
      </div>

      {/* Top Selling Toys Slider */}
      <TopProducts />

      {/* Products Section
      <div id="shop" className="w-full bg-white border-t border-gray-100">
        <Products />
      </div> */}
    </div>
  );
}
