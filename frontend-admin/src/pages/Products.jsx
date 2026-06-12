import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FiPlus, FiEdit2, FiTrash2, FiBox } from 'react-icons/fi';
import productService from '../services/productService';
import { toast } from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data.products || []);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/50';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const columns = [
    {
      name: 'Image',
      cell: row => (
        <div className="p-2">
          <img 
            src={getImageUrl(row.images?.[0])} 
            alt={row.name} 
            className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-gray-50"
          />
        </div>
      ),
      width: '100px'
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      cell: row => <div className="font-bold text-gray-900">{row.name}</div>
    },
    {
      name: 'Category',
      selector: row => row.category?.name || 'Uncategorized',
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => row.price,
      sortable: true,
      cell: row => <div className="font-bold text-blue-600">₹{row.price.toFixed(2)}</div>
    },
    {
      name: 'Stock',
      selector: row => row.stock,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.stock > 10 ? 'bg-green-100 text-green-700' : row.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
          {row.stock > 0 ? `${row.stock} in stock` : 'Out of Stock'}
        </span>
      )
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-3">
          <Link to={`/products/edit/${row._id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
            <FiEdit2 size={18} />
          </Link>
          <button 
            onClick={() => handleDelete(row._id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
      width: '120px'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
            <FiBox className="mr-2 text-blue-600" /> Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your toy inventory and catalog.</p>
        </div>
        <Link 
          to="/products/create"
          className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-sm transition-colors text-sm"
        >
          <FiPlus className="mr-2" size={18} /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={products}
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
                minHeight: '72px',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
