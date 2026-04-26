import api from './axios';

export const signup = async (fullName, email, password, role) => {
  try {
    const response = await api.post('/auth/signup', {
      fullName,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Signup failed');
  }
};

export const login = async (email, password, role) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Login failed');
  }
};

export const requestStudentSignupOtp = async (fullName, email, password, role) => {
  try {
    const response = await api.post('/auth/student/request-otp', {
      fullName,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to send OTP');
  }
};

export const verifyStudentSignupOtp = async (email, otp) => {
  try {
    const response = await api.post('/auth/student/verify-otp', {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'OTP verification failed');
  }
};
