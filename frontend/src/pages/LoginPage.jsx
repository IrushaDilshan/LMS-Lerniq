import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, Loader2, Cpu, Globe, Zap } from 'lucide-react';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const result = await login(credentials.username, credentials.password);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
            
            <div className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative z-10">
                
                {/* Left Side: Branding & Info */}
                <div className="p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-blue-600/20 to-transparent border-r border-white/5">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                                <Shield className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter uppercase">UniOps <span className="text-blue-500">Core</span></span>
                        </div>
                        
                        <h1 className="text-5xl font-black text-white leading-tight mb-6">
                            Secure Access <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Command Center</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
                            Welcome to the unified operations gateway. Authenticate to access your dedicated mission logs and control systems.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-12">
                        <div className="flex flex-col gap-2">
                            <Cpu className="text-blue-500 w-5 h-5" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Link</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Globe className="text-emerald-500 w-5 h-5" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Grid</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Zap className="text-amber-500 w-5 h-5" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Real-time</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-2xl font-black text-white mb-2">Personnel Login</h2>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Enter Credentials to proceed</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 animate-shake">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-xs font-black uppercase tracking-wider">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Username / Intel ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Identification handle"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Access Protocol</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="password"
                                        required
                                        placeholder="••••••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0" />
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-gray-300 transition-colors">Remember Session</span>
                                </label>
                                <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">Lost Protocol?</button>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/40 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        ESTABLISH UPLINK
                                        <Zap className="w-4 h-4 group-hover:animate-pulse" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                Unauthorized access is strictly logged and monitored.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
