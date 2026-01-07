import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiUser } from 'react-icons/fi';

const ReviewSection = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/reviews/${productId}`);
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await api.post('/reviews', { productId, rating, comment });
            setComment('');
            setRating(5);
            fetchReviews(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-16 border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Review Form */}
                {user && user.role === 'customer' ? (
                    <div className="bg-gray-50 p-6 rounded-xl h-fit">
                        <h3 className="text-lg font-bold mb-4">Write a Review</h3>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-2xl focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Share your thoughts about this product..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary-600 text-white rounded-lg py-2 font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                ) : (
                    !user && (
                        <div className="bg-gray-50 p-8 rounded-xl text-center h-fit">
                            <p className="text-gray-600 mb-4">Please login to write a review.</p>
                            <a href="/login" className="text-primary-600 font-medium hover:underline">Login here</a>
                        </div>
                    )
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                            <FiUser className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-gray-900">{review.customerId?.name || 'Anonymous'}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
