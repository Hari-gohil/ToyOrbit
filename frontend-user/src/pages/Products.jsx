import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { FiFilter } from 'react-icons/fi';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products whenever page or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts(currentPage, 12, activeCategory);
        setProducts(data.products || []);
        // Assuming backend returns pages and page data
        setTotalPages(data.pages || 1);
        setCurrentPage(data.page || 1);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    
    // Update URL if category changes
    if (activeCategory) {
      setSearchParams({ category: activeCategory });
    } else {
      setSearchParams({});
    }
  }, [currentPage, activeCategory, setSearchParams]);

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset to page 1 on new filter
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters (Categories) */}
        <div className="md:w-1/4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiFilter /> Filter by Category
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === '' 
                      ? 'bg-[var(--color-primary-600)] text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Toys
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => handleCategorySelect(cat._id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === cat._id 
                        ? 'bg-[var(--color-primary-600)] text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="md:w-3/4">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {activeCategory 
                ? categories.find(c => c._id === activeCategory)?.name || 'Filtered Toys'
                : 'All Toys'}
            </h2>
            <p className="text-gray-500 mt-1">Showing awesome toys for everyone</p>
          </div>

          {loading ? (
            <div className="py-20">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">No toys found</h3>
              <p className="text-gray-500 mt-2">Try selecting a different category.</p>
              <button 
                onClick={() => handleCategorySelect('')}
                className="mt-6 bg-[var(--color-primary-100)] text-[var(--color-primary-600)] px-6 py-2 rounded-lg font-bold"
              >
                View All Toys
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(page) => setCurrentPage(page)} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
