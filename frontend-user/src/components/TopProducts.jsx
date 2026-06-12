import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FiTrendingUp } from 'react-icons/fi';
import ProductCard from './ProductCard';
import productService from '../services/productService';
import Loader from './Loader';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const data = await productService.getAllProducts(1, 10, '', 'top_selling');
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch top products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  if (loading) return <div className="py-10"><Loader /></div>;
  if (!products.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-8">
        <div className="bg-orange-100 p-2 rounded-lg mr-3">
          <FiTrendingUp className="text-orange-500" size={24} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Top Selling Toys</h2>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className="h-auto">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
