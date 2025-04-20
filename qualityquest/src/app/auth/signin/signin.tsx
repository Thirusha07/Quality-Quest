"use client";
import { useState, FormEvent, JSX } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import styles from './signin.module.css';

export default function SignIn(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      router.push('project\dasboard');
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: 'project\dasboard' });
  };

  return (
    <div className={styles.signinContainer}>
      <div className={styles.signinBox}>
        <h2 className={styles.signinTitle}>Sign in to your account</h2>
        <p className={styles.signinSubtitle}>
          Or <Link href="/auth/signup" className={styles.signinLink}>create a new account</Link>
        </p>

        {error && (
          <div className={styles.signinError}>{error}</div>
        )}

        <form className={styles.signinForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}><Mail size={18} /></div>
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}><Lock size={18} /></div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePassword}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className={styles.formOptions}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className={styles.forgotLink}>Forgot password?</a>
          </div>

          <button type="submit" disabled={loading} className={styles.signinButton}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className={styles.divider}>
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <button type="button" onClick={handleGoogleSignIn} className={styles.googleButton}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
            </svg>
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
