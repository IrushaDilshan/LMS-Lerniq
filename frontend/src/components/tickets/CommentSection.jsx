import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import api from '../../api/axios';

const CommentSection = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mocking user per instructions
  const MOCK_USER_ID = 1;

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/tickets/${ticketId}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsPosting(true);
    try {
      const response = await api.post(`/tickets/${ticketId}/comments`, {
        content: newComment,
        createdByUserId: MOCK_USER_ID
      });
      if (response.status === 201) {
        setComments([...comments, response.data]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-800">Discussion Thread</h3>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6 mb-6 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none px-5 py-4 border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800 text-sm">{comment.authorName}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Input Box */}
      <form onSubmit={handlePostComment} className="flex space-x-3 items-end">
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment or update..."
            rows="2"
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isPosting || !newComment.trim()}
          className="bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all rounded-xl p-3 h-12 w-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
        >
          {isPosting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-5 h-5 ml-1" />
          )}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
