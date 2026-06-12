import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FiStar, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import reviewService from '../services/reviewService';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAllReviews();
      setReviews(data.reviews || []);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await reviewService.deleteReview(id);
        toast.success("Review deleted successfully");
        fetchReviews();
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
            size={14} 
          />
        ))}
      </div>
    );
  };

  const columns = [
    {
      name: 'User Info',
      selector: row => row.user?.name,
      sortable: true,
      cell: row => (
        <div className="flex items-center gap-3 py-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex flex-shrink-0 items-center justify-center font-bold text-xs border border-blue-200">
            {row.user?.name ? row.user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm leading-tight">{row.user?.name || 'Unknown User'}</div>
            <div className="text-xs text-gray-500">{row.user?.email || 'No email'}</div>
          </div>
        </div>
      ),
      minWidth: '200px',
      wrap: true
    },
    {
      name: 'Product Details',
      selector: row => row.product?.name,
      sortable: true,
      cell: row => (
        <div className="flex items-center gap-3 py-3 w-full">
          {row.product?.images?.[0] ? (
            <img 
              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${row.product.images[0]}`} 
              alt={row.product.name} 
              className="w-10 h-10 rounded object-cover border border-gray-100 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex-shrink-0"></div>
          )}
          <div>
            <div className="font-semibold text-gray-800 text-sm line-clamp-1">{row.product?.name || 'Deleted Product'}</div>
            {row.product?.category && <div className="text-xs text-blue-500 font-medium">{row.product.category}</div>}
          </div>
        </div>
      ),
      minWidth: '240px',
      wrap: true
    },
    {
      name: 'Review',
      selector: row => row.rating,
      sortable: true,
      cell: row => (
        <div className="py-3 flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            {renderStars(row.rating)}
            <span className="text-[10px] text-gray-400 font-medium">
              {new Date(row.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="text-xs text-gray-600 italic border-l-2 border-gray-200 pl-2 my-1">
            "{row.comment}"
          </div>
        </div>
      ),
      minWidth: '300px',
      wrap: true
    },
    {
      name: 'Actions',
      cell: row => (
        <button 
          onClick={() => handleDelete(row._id)}
          className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Delete Review"
        >
          <FiTrash2 size={18} />
        </button>
      ),
      minWidth: '80px',
      center: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
            <FiMessageSquare className="mr-2 text-blue-600" /> Customer Reviews
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitor what customers are saying about your products.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center">
            <FiStar className="text-yellow-400 fill-yellow-400 mr-2" />
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Total Reviews</div>
              <div className="font-black text-gray-900">{reviews.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={reviews}
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
                minHeight: '80px',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
