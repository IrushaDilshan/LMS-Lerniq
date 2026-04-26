import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../../api/adminUserApi";
import "./AdminRoleManagementPage.css";

const AdminRoleManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      setMessage("Failed to load users.");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      setMessage("User role updated successfully.");
      loadUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
      setMessage("Failed to update user role.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="role-page-container">
      <h2>Role Management</h2>
      <p className="role-subtitle">
        Admin can manage USER, ADMIN and TECHNICIAN roles.
      </p>

      {message && <p className="role-message">{message}</p>}

      <table className="role-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name / Email</th>
            <th>Current Role</th>
            <th>Update Role</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name || user.fullName || user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role || "USER"}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="TECHNICIAN">TECHNICIAN</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRoleManagementPage;