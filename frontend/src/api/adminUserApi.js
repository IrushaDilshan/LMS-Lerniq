import axios from "./axios";

export const getAllUsers = async () => {
  const response = await axios.get("/admin/users");
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await axios.put(`/admin/users/${userId}/role`, {
    role,
  });
  return response.data;
};