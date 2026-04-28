import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, User, ArrowLeft, CheckCircle2 } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

const Login: React.FC = () => {
  const { login, signup, loginWithGoogle, resetPassword, error, loading, clearError, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [resetSent, setResetSent] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const confirmValid = password === confirmPassword;
  const nameValid = displayName.trim().length >= 2;

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setTouched({});
    setResetSent(false);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (mode === 'forgot') {
      setTouched({ email: true });
      if (!emailValid) return;
      try { await resetPassword(email); setResetSent(true); } catch { /* error set in context */ }
      return;
    }
    if (mode === 'signup') {
      setTouched({ email: true, password: true, confirmPassword: true, displayName: true });
      if (!emailValid || !passwordValid || !confirmValid || !nameValid) return;
      await signup(email, password, displayName);
    } else {
      setTouched({ email: true, password: true });
      if (!emailValid || !passwordValid) return;
      await login(email, password);
    }
  };

  const handleDemoLogin = async () => {
    clearError();
    setEmail('demo@healthcare.com');
    setPassword('demo123');
    await login('demo@healthcare.com', 'demo123');
  };

  const handleGoogleLogin = async () => { clearError(); await loginWithGoogle(); };

  const inputBase = 'w-full py-2.5 pr-3 pl-10 bg-white border-[1.5px] border-surface-200 rounded-xl text-surface-800 text-sm transition-all outline-none placeholder:text-surface-400 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/10';
  const inputError = 'border-red-400';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/[.02] rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[960px] min-h-[580px] bg-white rounded-2xl overflow-hidden shadow-xl shadow-surface-900/5 relative z-10 m-4 border border-surface-100">
        {/* Hero panel */}
        <div className="hidden md:flex items-center justify-center p-12 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="text-white relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Activity size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-[Poppins] m-0 leading-tight">MediCure</h1>
                <span className="text-sm text-white/80 font-medium">Analytics</span>
              </div>
            </div>
            <p className="text-white/90 text-base mb-8 leading-relaxed">Comprehensive healthcare management and analytics platform for modern clinics.</p>
            <div className="flex flex-col gap-3.5">
              {['Real-time patient monitoring', 'Advanced analytics & reporting', 'Secure & HIPAA compliant'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-white/95">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-10 md:px-10">
          <form className="w-full max-w-[360px]" onSubmit={handleSubmit} noValidate>
            {mode === 'forgot' && (
              <button type="button" className="inline-flex items-center gap-1.5 text-primary-500 text-sm mb-4 bg-transparent border-none cursor-pointer hover:text-primary-700 transition-colors" onClick={() => switchMode('login')}>
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            )}

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 md:hidden">
              <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                <Activity size={20} />
              </div>
              <span className="font-bold text-surface-800 font-[Poppins]">MediCure Analytics</span>
            </div>

            <h2 className="text-surface-900 text-2xl font-bold mb-1">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className="text-surface-500 text-sm mb-7">
              {mode === 'login' ? 'Sign in to your account' : mode === 'signup' ? 'Get started with MediCure Analytics' : "Enter your email and we'll send a reset link"}
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {resetSent && (
              <div className="flex items-center gap-2 bg-secondary-50 border border-secondary-200 text-secondary-700 px-4 py-3 rounded-xl text-sm mb-5">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Password reset email sent! Check your inbox.</span>
              </div>
            )}

            {/* Display Name */}
            {mode === 'signup' && (
              <div className="mb-4">
                <label htmlFor="displayName" className="block text-surface-700 text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-3 text-surface-400 pointer-events-none" />
                  <input id="displayName" type="text" placeholder="John Doe" value={displayName}
                    className={`${inputBase} ${touched.displayName && !nameValid ? inputError : ''}`}
                    onChange={(e) => { setDisplayName(e.target.value); clearError(); }}
                    onBlur={() => setTouched((t) => ({ ...t, displayName: true }))}
                    autoComplete="name" />
                </div>
                {touched.displayName && !nameValid && <span className="text-red-500 text-xs mt-1 block">Name must be at least 2 characters</span>}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-surface-700 text-sm font-medium mb-1.5">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3 text-surface-400 pointer-events-none" />
                <input id="email" type="email" placeholder="you@company.com" value={email}
                  className={`${inputBase} ${touched.email && !emailValid ? inputError : ''}`}
                  onChange={(e) => { setEmail(e.target.value); clearError(); setResetSent(false); }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  autoComplete="email" />
              </div>
              {touched.email && !emailValid && <span className="text-red-500 text-xs mt-1 block">Please enter a valid email address</span>}
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div className="mb-4">
                <label htmlFor="password" className="block text-surface-700 text-sm font-medium mb-1.5">Password</label>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-3 text-surface-400 pointer-events-none" />
                  <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                    className={`${inputBase} ${touched.password && !passwordValid ? inputError : ''}`}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
                  <button type="button" className="absolute right-2.5 bg-transparent border-none text-surface-400 cursor-pointer p-1 flex hover:text-surface-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {touched.password && !passwordValid && <span className="text-red-500 text-xs mt-1 block">Password must be at least 6 characters</span>}
              </div>
            )}

            {/* Confirm Password */}
            {mode === 'signup' && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-surface-700 text-sm font-medium mb-1.5">Confirm Password</label>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-3 text-surface-400 pointer-events-none" />
                  <input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Re-enter your password" value={confirmPassword}
                    className={`${inputBase} ${touched.confirmPassword && !confirmValid ? inputError : ''}`}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                    onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                    autoComplete="new-password" />
                </div>
                {touched.confirmPassword && !confirmValid && <span className="text-red-500 text-xs mt-1 block">Passwords do not match</span>}
              </div>
            )}

            {/* Forgot password link */}
            {mode === 'login' && (
              <div className="flex justify-end -mt-1 mb-4">
                <button type="button" className="bg-transparent border-none text-primary-500 text-xs cursor-pointer p-0 hover:text-primary-700 hover:underline transition-colors" onClick={() => switchMode('forgot')}>Forgot password?</button>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="w-full py-3 bg-primary-500 text-white border-none rounded-xl text-[0.95rem] font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none" disabled={loading}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>

            {/* Social / Demo */}
            {mode !== 'forgot' && (
              <>
                <div className="flex items-center gap-4 my-5">
                  <div className="flex-1 h-px bg-surface-200" />
                  <span className="text-surface-400 text-xs">or</span>
                  <div className="flex-1 h-px bg-surface-200" />
                </div>

                <button type="button" className="w-full py-2.5 bg-white border-[1.5px] border-surface-200 rounded-xl text-surface-700 text-sm font-medium cursor-pointer flex items-center justify-center gap-2.5 transition-all hover:bg-surface-50 hover:border-surface-300 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleGoogleLogin} disabled={loading}>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.97 23.97 0 000 24c0 3.77.9 7.35 2.56 10.53l7.97-5.94z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.94C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </button>

                <button type="button" className="w-full py-2.5 mt-2 bg-surface-50 border-[1.5px] border-surface-200 text-surface-600 rounded-xl text-sm font-medium cursor-pointer transition-all hover:bg-surface-100 hover:border-surface-300 disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleDemoLogin} disabled={loading}>
                  Try Demo Account
                </button>
              </>
            )}

            {/* Toggle mode */}
            <p className="text-surface-500 text-sm text-center mt-5">
              {mode === 'login' ? (
                <>Don't have an account?{' '}<button type="button" className="bg-transparent border-none text-primary-500 text-sm font-semibold cursor-pointer p-0 hover:text-primary-700 hover:underline transition-colors" onClick={() => switchMode('signup')}>Sign Up</button></>
              ) : mode === 'signup' ? (
                <>Already have an account?{' '}<button type="button" className="bg-transparent border-none text-primary-500 text-sm font-semibold cursor-pointer p-0 hover:text-primary-700 hover:underline transition-colors" onClick={() => switchMode('login')}>Sign In</button></>
              ) : null}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
