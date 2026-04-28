import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User,
  AuthError,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  demoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_SESSION_KEY = 'demo_user';
const DEMO_NAME_KEY = 'demo_display_name';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/cancelled-popup-request': 'Only one sign-in popup is allowed at a time.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
};

/** Codes that indicate Firebase is not configured (demo mode fallback). */
const DEMO_FALLBACK_CODES = new Set([
  'auth/invalid-api-key',
  'auth/network-request-failed',
  'auth/configuration-not-found',
  'auth/unauthorized-domain',
  'auth/operation-not-allowed',
]);

/** Check if a Firebase error means the backend isn't set up (→ demo mode). */
function isDemoFallback(code: string): boolean {
  if (!code) return true; // No error code at all → Firebase not configured
  if (DEMO_FALLBACK_CODES.has(code)) return true;
  // Firebase v10+ sometimes returns verbose codes like
  // "auth/api-key-not-valid.-please-pass-a-valid-api-key."
  if (code.includes('api-key') || code.includes('not-valid') || code.includes('configuration') || code.includes('internal-error')) return true;
  return false;
}

function mapFirebaseError(code: string): string {
  return ERROR_MESSAGES[code] || 'Something went wrong. Please try again.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Restore demo session on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem(DEMO_SESSION_KEY);
    if (storedEmail) {
      const name = sessionStorage.getItem(DEMO_NAME_KEY) || 'Demo User';
      setDemoMode(true);
      setUser({ email: storedEmail, displayName: name, uid: 'demo-uid' } as unknown as User);
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setDemoMode(false);
        // Clear any leftover demo session
        sessionStorage.removeItem(DEMO_SESSION_KEY);
        sessionStorage.removeItem(DEMO_NAME_KEY);
      } else if (!sessionStorage.getItem(DEMO_SESSION_KEY)) {
        setUser(null);
      }
      setLoading(false);
    });

    // If we're in demo mode, stop the loading spinner immediately
    if (storedEmail) setLoading(false);

    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ─── Helper: enter demo mode ───────────────────────────────────
  const enterDemoMode = (email: string, displayName: string) => {
    sessionStorage.setItem(DEMO_SESSION_KEY, email);
    sessionStorage.setItem(DEMO_NAME_KEY, displayName);
    setUser({ email, displayName, uid: 'demo-uid' } as unknown as User);
    setDemoMode(true);
  };

  // ─── Login with email & password ───────────────────────────────
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setUser(credential.user);
      setDemoMode(false);
    } catch (err) {
      const authErr = err as AuthError;
      if (isDemoFallback(authErr.code)) {
        if (email && password.length >= 6) {
          enterDemoMode(email, email.split('@')[0]);
        } else {
          setError('Enter a valid email and password (min 6 characters).');
        }
      } else {
        setError(mapFirebaseError(authErr.code));
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign up with email, password & display name ───────────────
  const signup = async (email: string, password: string, displayName: string) => {
    setError(null);
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // Set the user's display name right after creation
      await updateProfile(credential.user, { displayName });
      setUser({ ...credential.user, displayName } as User);
      setDemoMode(false);
    } catch (err) {
      const authErr = err as AuthError;
      if (isDemoFallback(authErr.code)) {
        if (email && password.length >= 6) {
          enterDemoMode(email, displayName || email.split('@')[0]);
        } else {
          setError('Enter a valid email and password (min 6 characters).');
        }
      } else {
        setError(mapFirebaseError(authErr.code));
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Google sign-in ────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setDemoMode(false);
    } catch (err) {
      const authErr = err as AuthError;
      if (isDemoFallback(authErr.code)) {
        enterDemoMode('google-user@demo.com', 'Google Demo User');
      } else {
        setError(mapFirebaseError(authErr.code));
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Password reset email ─────────────────────────────────────
  const resetPassword = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const authErr = err as AuthError;
      if (!isDemoFallback(authErr.code)) {
        setError(mapFirebaseError(authErr.code));
        setLoading(false);
        throw err; // re-throw so the caller knows it failed
      }
      // In demo mode we silently succeed
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      if (demoMode) {
        sessionStorage.removeItem(DEMO_SESSION_KEY);
        sessionStorage.removeItem(DEMO_NAME_KEY);
        setDemoMode(false);
        setUser(null);
      } else {
        await signOut(auth);
      }
    } catch {
      setError('Failed to log out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, demoMode, login, signup, loginWithGoogle, logout, resetPassword, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
