import React from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OAuthLoginButton = () => {
  const { loginWithOAuth } = useAuth();

  const handleGoogleLogin = async () => {
    await loginWithOAuth({
      id: Date.now(),
      name: 'Google Student',
      email: `student${Date.now()}@gmail.com`,
      providerToken: `dev_google_token_${Date.now()}`,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-10 py-5 rounded-3xl border border-white/20 bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all"
    >
      <LogIn className="w-4 h-4" />
      Sign In With Google
    </button>
  );
};

export default OAuthLoginButton;
