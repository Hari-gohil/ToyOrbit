import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FiGrid, FiTrash2, FiUploadCloud, FiSave, FiImage } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import categoryService from '../services/categoryService';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (imageFile) formData.append('image', imageFile);

      await categoryService.createCategory(formData);
      toast.success("Category created successfully");
      
      // Reset form
      reset();
      removeImage();
      
      // Refresh list
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category? Products in this category may be affected.")) {
      try {
        await categoryService.deleteCategory(id);
        toast.success("Category deleted");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const columns = [
    {
      name: 'Image',
      selector: row => row.image,
      cell: row => (
        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 p-1 flex items-center justify-center my-2">
          {row.image ? (
            <img 
              src={getImageUrl(row.image)} 
              alt={row.name} 
              className="max-w-full max-h-full object-contain rounded"
            />
          ) : (
            <FiImage className="text-gray-300" size={20} />
          )}
        </div>
      ),
      width: '80px'
    },
    {
      name: 'Name & Details',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <div className="py-3">
          <div className="font-bold text-gray-900 leading-tight">{row.name}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{row.description || 'No description'}</div>
          <div className="text-xs text-blue-500 mt-1 font-mono">{row.slug}</div>
        </div>
      ),
      minWidth: '200px'
    },
    {
      name: 'Status',
      selector: row => row.isActive,
      sortable: true,
      cell: row => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '120px'
    },
    {
      name: 'Actions',
      cell: row => (
        <button 
          onClick={() => handleDelete(row._id)}
          className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Delete Category"
        >
          <FiTrash2 size={18} />
        </button>
      ),
      width: '100px'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
          <FiGrid className="mr-2 text-blue-600" /> Categories Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">Create and manage product categories for your store.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-900">Add New Category</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name *</label>
                <input 
                  {...register('name')} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="e.g. Action Figures" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  {...register('description')} 
                  rows="3" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Short description..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Image</label>
                {previewUrl ? (
                  <div className="relative w-full h-40 rounded-xl border border-gray-200 overflow-hidden group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50/50">
                    <FiUploadCloud size={32} className="mb-2" />
                    <span className="text-sm font-semibold">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full flex justify-center items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-sm transition-colors"
              >
                {saving ? 'Creating...' : <><FiSave className="mr-2" /> Create Category</>}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <DataTable
              columns={columns}
              data={categories}
              progressPending={loading}
              pagination
              responsive
              highlightOnHover
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#f8fafc',
                    borderBottomColor: '#f1f5f9',
                    fontWeight: 'bold',
                    color: '#475569',
                  },
                },
                rows: {
                  style: {
                    minHeight: '70px',
                  },
                },
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
