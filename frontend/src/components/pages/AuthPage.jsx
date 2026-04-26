import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle, LogIn, ArrowRight, User, Loader, 
  CheckCircle, RotateCcw, ArrowLeft 
} from 'lucide-react';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, requestStudentSignupOtp, verifyStudentSignupOtp } = useAuth();

  const roleParam = searchParams.get('role') || 'USER';
  const validRoles = ['USER', 'ADMIN', 'TECHNICIAN'];
  
  if (!validRoles.includes(roleParam)) {
    navigate('/');
    return null;
  }

  const roleDisplay = {
    USER: '👨‍🎓 Student Portal',
    ADMIN: '👨‍💼 Campus Admin',
    TECHNICIAN: '🔧 Technician Log',
  };

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // OTP verification state
  const [otpStep, setOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!loginEmail || !loginPassword) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      await login(loginEmail, loginPassword, roleParam);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!signupFullName || !signupEmail || !signupPassword || !signupConfirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (signupFullName.length < 3) {
        setError('Full name must be at least 3 characters');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signupEmail)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (signupPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupPassword)) {
        setError('Password must contain uppercase, lowercase, and numbers');
        setLoading(false);
        return;
      }

      if (signupPassword !== signupConfirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // For STUDENT (USER role), require SLIIT email and send OTP
      if (roleParam === 'USER') {
        if (!signupEmail.endsWith('@my.sliit.lk')) {
          setError('Please use your SLIIT student email ending with @my.sliit.lk');
          setLoading(false);
          return;
        }

        // Request OTP
        try {
          await requestStudentSignupOtp(signupFullName, signupEmail, signupPassword, roleParam);
          setOtpEmail(signupEmail);
          setOtpStep(true);
          setError('');
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        // For ADMIN and TECHNICIAN, use regular signup
        await signup(signupFullName, signupEmail, signupPassword, roleParam);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);

    try {
      if (!otpCode) {
        setOtpError('Please enter the OTP');
        setOtpLoading(false);
        return;
      }

      if (otpCode.length !== 6) {
        setOtpError('OTP must be 6 digits');
        setOtpLoading(false);
        return;
      }

      await verifyStudentSignupOtp(otpEmail, otpCode);
      setOtpSuccess(true);
      setOtpLoading(false);
      
      // Redirect after showing success
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setOtpError(err.message);
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError('');
    setOtpLoading(true);

    try {
      await requestStudentSignupOtp(signupFullName, otpEmail, signupPassword, roleParam);
      setOtpError('');
      setOtpCode('');
      setOtpLoading(false);
    } catch (err) {
      setOtpError(err.message);
      setOtpLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setOtpStep(false);
    setOtpCode('');
    setOtpError('');
    setOtpEmail('');
  };

  // OTP Verification Screen
  if (otpStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f1729] to-[#020617] text-white flex items-center justify-center p-4 overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        {/* OTP Container */}
        <div className="relative z-10 w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                {otpSuccess ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <Mail className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">UniOps</h1>
            <p className="text-gray-400 text-sm font-medium">Student Email Verification</p>
          </div>

          {/* OTP Form Card */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {otpSuccess ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Email Verified!</h2>
                <p className="text-gray-400">Your account has been created successfully. Redirecting to dashboard...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white">Verify Your Email</h2>
                  <p className="text-gray-400 text-sm font-medium mt-1">
                    We sent a 6-digit code to<br />
                    <span className="text-blue-300">{otpEmail}</span>
                  </p>
                </div>

                {/* Error Alert */}
                {otpError && (
                  <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-rose-300 text-sm font-medium">{otpError}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength="6"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 text-center text-2xl font-bold letter-spacing tracking-widest focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none disabled:opacity-50"
                      disabled={otpLoading}
                    />
                    <p className="text-gray-500 text-xs mt-2">OTP expires in 5 minutes</p>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black rounded-xl transition-all duration-200 shadow-lg shadow-green-500/30 disabled:shadow-none flex items-center justify-center gap-2 mt-6"
                  >
                    {otpLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Verify OTP
                      </>
                    )}
                  </button>
                </form>

                {/* Resend OTP */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/5 text-gray-500 font-medium">or</span>
                  </div>
                </div>

                <button
                  onClick={handleResendOtp}
                  disabled={otpLoading}
                  className="w-full py-3 border border-white/20 hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Resend OTP
                </button>

                {/* Back Button */}
                <button
                  onClick={handleBackToSignup}
                  disabled={otpLoading}
                  className="w-full mt-3 py-3 border border-white/20 hover:border-gray-500/50 hover:bg-gray-500/10 text-gray-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Signup
                </button>
              </>
            )}
          </div>

          {/* Back to landing */}
          {!otpSuccess && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors"
              >
                ← Back to Landing
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular Login/Signup Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f1729] to-[#020617] text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">UniOps</h1>
          <p className="text-gray-400 text-sm font-medium">{roleDisplay[roleParam]}</p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white">
              {isSignup ? 'Create Account' : 'Sign In'}
            </h2>
            {isSignup && roleParam === 'USER' ? (
              <p className="text-gray-400 text-sm font-medium mt-1">
                Sign up with your SLIIT student email
              </p>
            ) : (
              <p className="text-gray-400 text-sm font-medium mt-1">
                {isSignup ? 'Join UniOps as a ' : 'Access your '} {roleDisplay[roleParam].split(' ')[1]}
              </p>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-rose-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {!isSignup && (
            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none disabled:opacity-50"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:shadow-none flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {isSignup && (
            <form onSubmit={handleSignup} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder={roleParam === 'USER' ? 'it123456@my.sliit.lk' : 'you@example.com'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
                {roleParam === 'USER' && (
                  <p className="text-gray-500 text-xs mt-1">Use your SLIIT student email (@my.sliit.lk)</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none disabled:opacity-50"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Min 6 chars, uppercase, lowercase, number</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none disabled:opacity-50"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:shadow-none flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {roleParam === 'USER' ? 'Sending OTP...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {roleParam === 'USER' ? 'Continue with OTP' : 'Create Account'}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between login/signup */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/5 text-gray-500 font-medium">
                {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setLoginEmail('');
              setLoginPassword('');
              setSignupFullName('');
              setSignupEmail('');
              setSignupPassword('');
              setSignupConfirmPassword('');
            }}
            className="w-full py-3 border border-white/20 hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isSignup ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Back to landing */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors"
          >
            ← Back to Landing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
