import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud, FiSave } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catData, prodData] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getProductById(id)
        ]);
        
        setCategories(catData.categories || []);
        
        const product = prodData.product;
        // Pre-fill the form
        reset({
          name: product.name,
          description: product.description,
          brand: product.brand,
          sku: product.sku,
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          category: product.category?._id || product.category,
          ageGroup: product.ageGroup,
          material: product.material,
          featured: product.featured
        });

        // Set existing images
        if (product.images && product.images.length > 0) {
          const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');
          const formattedUrls = product.images.map(img => img.startsWith('/uploads') ? backendUrl + img : img);
          setPreviewUrls(formattedUrls);
        }
      } catch (error) {
        toast.error("Failed to load product data");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }
    
    // If this is the first new file, clear the old server previews
    if (imageFiles.length === 0 && previewUrls.length > 0) {
      setPreviewUrls([]);
    }

    setImageFiles(prev => [...prev, ...files]);
    
    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => imageFiles.length === 0 ? newPreviews : [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // If it's a new file
    if (imageFiles.length > 0) {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => {
        const newUrls = prev.filter((_, i) => i !== index);
        URL.revokeObjectURL(prev[index]);
        return newUrls;
      });
    } else {
      // If it's an existing file from server, we can't easily remove just one via the current API
      // So we just clear them all and force the user to upload new ones if they want to change images
      toast("Uploading new images will replace all existing ones.", { icon: 'ℹ️' });
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      
      // Append files only if there are new ones
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      await productService.updateProduct(id, formData);
      toast.success("Product updated successfully!");
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center font-bold text-gray-500 animate-pulse">Loading Product...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center mb-2">
        <Link to="/products" className="text-gray-400 hover:text-blue-600 transition-colors mr-3">
          <FiArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Update Product</h1>
          <p className="text-gray-500 text-sm mt-1">Modify the information below to update this toy.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
              <input {...register('name')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. LEGO Star Wars Millennium Falcon" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea {...register('description')} required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the toy..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
              <input {...register('brand')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. LEGO, Mattel" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
              <input {...register('sku')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="Stock Keeping Unit" />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Regular Price (₹)</label>
              <input {...register('price')} type="number" step="0.01" required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Price (₹)</label>
              <input {...register('discountPrice')} type="number" step="0.01" defaultValue="0" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
              <input {...register('stock')} type="number" required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="100" />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select {...register('category')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="">Select Category...</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Age Group</label>
              <select {...register('ageGroup')} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="0-2 Years">0-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="6-8 Years">6-8 Years</option>
                <option value="9-12 Years">9-12 Years</option>
                <option value="13+ Years">13+ Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Material</label>
              <input {...register('material')} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Plastic, Wood" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <input {...register('featured')} type="checkbox" id="featured" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">Feature this product on homepage</label>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Product Images (Up to 5)</h2>
          <p className="text-xs text-gray-500 mb-4">Note: Uploading new images will replace all existing images for this product.</p>
          <div className="flex flex-wrap gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-32 h-32 rounded-xl border border-gray-200 overflow-hidden group">
                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            
            {imageFiles.length < 5 && (
              <label className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50/50">
                <FiUploadCloud size={32} className="mb-2" />
                <span className="text-xs font-semibold">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-sm transition-colors text-lg"
          >
            {saving ? 'Updating...' : <><FiSave className="mr-2" /> Update Product</>}
          </button>
        </div>
      </form>
    </div>
  );
}
