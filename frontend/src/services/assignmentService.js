import api from '../api/axios';

const assignmentService = {
  // Get all assignments for a specific course
  getAssignmentsByCourse: async (courseId) => {
    const response = await api.get(`/assignments/courses/${courseId}`);
    return response.data;
  },

  // Get a specific assignment's details
  getAssignmentById: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  // Submit an assignment (requires multipart form data)
  submitAssignment: async (assignmentId, userId, file) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file);

    const response = await api.post(`/assignments/${assignmentId}/submissions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default assignmentService;
