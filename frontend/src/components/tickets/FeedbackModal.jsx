import React, { useState } from 'react';
import { Star, X, MessageSquare, Send } from 'lucide-react';
import api from '../../api/axios';

const FeedbackModal = ({ ticket, isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.post(`/tickets/${ticket.id}/feedback`, {
        rating,
        feedbackComment: comment
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-[#061224] p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Give Feedback</h3>
            <p className="text-blue-200 text-xs mt-1">Ticket #{ticket.id.substring(ticket.id.length - 8)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm border border-rose-100 animate-shake">
              {error}
            </div>
          )}

          {/* Star Rating Section */}
          <div className="text-center space-y-4">
            <label className="block text-sm font-semibold text-gray-700">How would you rate the service?</label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 ${
                      (hover || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : rating === 1 ? 'Poor' : 'Select Rating'}
            </p>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
              Additional Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or how we can improve..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-6 py-3 bg-[#061224] text-white font-semibold rounded-2xl hover:bg-[#1a365d] disabled:opacity-70 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/20"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit Feedback</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
