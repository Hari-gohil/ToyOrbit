import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiAlertTriangle, FiUploadCloud, FiPackage, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import orderService from '../services/orderService';
import Loader from '../components/Loader';

export default function ReturnProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEligible, setIsEligible] = useState(true);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const imageFile = watch('faultImage');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        const fetchedOrder = data.order;
        setOrder(fetchedOrder);
        
        // Eligibility checks
        if (fetchedOrder.orderStatus !== 'Delivered') {
          setIsEligible(false);
          toast.error("Only delivered orders can be returned.");
          return;
        }

        if (fetchedOrder.returnRequest?.isRequested) {
          setIsEligible(false);
          toast.error("Return request already submitted for this order.");
          return;
        }

        const deliveryDate = fetchedOrder.deliveredAt ? new Date(fetchedOrder.deliveredAt) : new Date(fetchedOrder.createdAt);
        const diffDays = Math.ceil(Math.abs(new Date() - deliveryDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 5) {
          setIsEligible(false);
          toast.error("Return period has expired. Returns are only accepted within 5 days of delivery.");
        }
      } catch (error) {
        toast.error("Failed to load order details");
        setIsEligible(false);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const onSubmit = async (data) => {
    if (!imageFile || imageFile.length === 0) {
      toast.error("Please upload an image showing the fault");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('reason', data.reason);
      formData.append('faultImage', imageFile[0]);

      await orderService.requestReturn(id, formData);
      toast.success("Return request submitted successfully");
      navigate(`/order/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit return request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20"><Loader /></div>;
  if (!order) return <div className="py-20 text-center">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to={`/order/${id}`} className="flex items-center text-gray-500 hover:text-[var(--color-primary-600)] mb-8 transition-colors font-medium">
        <FiArrowLeft className="mr-2" /> Back to Order Details
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
          <FiPackage className="mr-3 text-[var(--color-primary-600)]" /> Request a Return
        </h1>
        <p className="text-gray-500 mt-2">Order ID: <span className="font-bold text-gray-900">{order._id}</span></p>
      </div>

      {/* Return Policy Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8 flex items-start">
        <FiAlertTriangle className="text-orange-500 mt-1 flex-shrink-0" size={24} />
        <div className="ml-4">
          <h3 className="text-lg font-bold text-orange-900">Return Policy</h3>
          <p className="text-sm text-orange-800 mt-1">
            We accept returns for faulty or damaged products within <strong>5 days</strong> of order delivery. 
            You must provide a clear description and an image showing the fault. Requests made after the 5-day window will not be accepted.
          </p>
        </div>
      </div>

      {!isEligible ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-red-900 mb-2">Not Eligible for Return</h2>
          <p className="text-red-700">This order does not meet our return policy requirements or a return has already been requested.</p>
          <Link to={`/order/${id}`} className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
            Go Back
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Why are you returning this order?</label>
            <p className="text-xs text-gray-500 mb-4">Please provide a detailed description of the fault or damage.</p>
            <textarea 
              {...register('reason', { required: "Reason is required", minLength: { value: 10, message: "Please provide more detail" } })}
              rows="4"
              placeholder="e.g. The toy arrived with a broken wheel..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-all text-sm"
            ></textarea>
            {errors.reason && <p className="text-red-500 text-xs mt-1 font-medium">{errors.reason.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Upload Image of the Fault</label>
            <p className="text-xs text-gray-500 mb-4">A clear photo of the damage helps us process your return faster.</p>
            
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full h-full p-4 flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                      <p className="text-white font-bold flex items-center"><FiUploadCloud className="mr-2" /> Change Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                )}
                <input 
                  id="dropzone-file" 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  {...register('faultImage', { required: "An image is required" })} 
                />
              </label>
            </div>
            {errors.faultImage && <p className="text-red-500 text-xs mt-1 font-medium">{errors.faultImage.message}</p>}
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={submitting}
              className="flex items-center px-8 py-3 bg-[var(--color-primary-600)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-500)] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>Processing...</>
              ) : (
                <><FiCheckCircle className="mr-2" /> Submit Return Request</>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
