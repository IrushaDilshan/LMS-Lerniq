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

  // --- Instructor Endpoints ---

  // Create a new assignment
  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  // Update an existing assignment
  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await api.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  // Delete an assignment
  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/assignments/${assignmentId}`);
    return response.data;
  },

  // --- Grading Endpoints ---

  // Get all submissions for an assignment
  getSubmissionsForAssignment: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  // Grade a submission
  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.post(`/assignments/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },

  // Download URL constructor
  getDownloadUrl: (submissionId) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8088/api/v1';
    return `${baseURL}/assignments/submissions/${submissionId}/download`;
  }
};

export default assignmentService;
