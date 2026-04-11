import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const CommentSection = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // ID of comment being deleted

  // Mocking user per instructions — replace with auth context later
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
        createdByUserId: MOCK_USER_ID,
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

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    setDeletingId(commentId);
    try {
      await api.delete(`/tickets/${ticketId}/comments/${commentId}`, {
        params: { requestingUserId: MOCK_USER_ID },
      });
      // Optimistic removal from UI
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete comment.';
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-800">Discussion Thread</h3>
        <span className="ml-auto text-xs text-gray-400 font-medium">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500 text-sm">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl text-sm">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((comment) => {
            const isOwn = comment.createdByUserId === MOCK_USER_ID;
            return (
              <div key={comment.id} className="flex space-x-3 group">
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center
                    ${isOwn ? 'bg-blue-100 border-blue-200' : 'bg-gray-100 border-gray-200'}`}>
                    <User className={`w-4 h-4 ${isOwn ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                </div>

                {/* Bubble */}
                <div className="flex-1 min-w-0">
                  <div className={`rounded-2xl rounded-tl-none px-4 py-3 border
                    ${isOwn ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-1 gap-2">
                      <span className="font-semibold text-gray-800 text-sm truncate">
                        {comment.authorName}
                        {isOwn && (
                          <span className="ml-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                        {/* Delete button — only visible on hover for own comments */}
                        {isOwn && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={deletingId === comment.id}
                            title="Delete comment"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-rose-100 text-rose-400 hover:text-rose-600 disabled:opacity-40"
                          >
                            {deletingId === comment.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </div>
            );
          })
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
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-sm"
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
