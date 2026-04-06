import api from '../api/axios';

const quizService = {
  // Get all quizzes for a specific course
  getQuizzesByCourse: async (courseId) => {
    const response = await api.get(`/quizzes/courses/${courseId}`);
    return response.data;
  },

  // Get a specific quiz's details
  getQuizById: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  // Submit a quiz attempt
  submitAttempt: async (quizId, attemptData) => {
    const response = await api.post(`/quizzes/${quizId}/attempts`, attemptData);
    return response.data;
  },
};

export default quizService;
