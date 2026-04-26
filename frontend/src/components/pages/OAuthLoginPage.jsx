import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./OAuthLoginPage.css";

const OAuthLoginPage = () => {
  const navigate = useNavigate();
  const { mockLoginAs } = useAuth();

  const handleMockLogin = (role) => {
    mockLoginAs(role);
    navigate("/", { replace: true });
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8089/oauth2/authorization/google";
  };

  return (
    <div className="oauth-container">
      <div className="oauth-card">
        <h2>Login to UniOps</h2>
        <p>Select a role to test the system.</p>

        <button
          onClick={() => handleMockLogin("USER")}
          className="google-login-btn"
        >
          Continue as User
        </button>

        <button
          onClick={() => handleMockLogin("ADMIN")}
          className="google-login-btn admin-btn"
        >
          Continue as Admin
        </button>

        <button
          onClick={() => handleMockLogin("TECHNICIAN")}
          className="google-login-btn tech-btn"
        >
          Continue as Technician
        </button>

        <hr />

        <button onClick={handleGoogleLogin} className="google-login-btn">
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default OAuthLoginPage;