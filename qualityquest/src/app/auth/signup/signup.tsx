// signup.tsx
"use client";
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, User, Lock, Briefcase ,Building2} from 'lucide-react';
import styles from './signup.module.css';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  userType: string;
  organizationId: string;
  newOrganizationName?: string;
}
interface Organization {
  organizationId: string;
  name: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'developer',
    userType: 'individual',
    organizationId: '',
    newOrganizationName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);


  // Fetch organizations
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const res = await fetch('/api/organizations/getOrganizations');
        const data = await res.json();
        if (res.ok) setOrganizations(data);
      } catch (err) {
        console.error('Failed to fetch organizations', err);
      }
    }
    fetchOrganizations();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      userType,
      organizationId,
      newOrganizationName,
    } = formData;
  
    if (password !== confirmPassword) {
      setLoading(false);
      return setError('Passwords do not match');
    }
    console.log("userType",userType)
  
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          userType,
          organizationId,
          newOrganizationName,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setLoading(false);
        return setError(data.message || 'Something went wrong');
      }
  
      router.push('project\dasboard');
    } catch (err) {
      console.error(err);
      setError('Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach((input) => input.removeAttribute('fdprocessedid'));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create your account</h2>
        <p className={styles.subtitle}>
          Or <Link href="/auth/signin" className={styles.link}>sign in to existing account</Link>
        </p>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <User className={styles.icon} />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <Mail className={styles.icon} />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <Lock className={styles.icon} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
              />
             
            </div>
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>

            <div className={styles.inputWrapper}>
              <Lock className={styles.icon} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputWrapper}>
              <Briefcase className={styles.icon} />
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="admin">Admin</option>
                <option value="product manager">Product Manager</option>
                <option value="developer">Developer</option>
                <option value="tester">Tester</option>
              </select>
            </div>
            </div>
 {/* User Type dropdown */}
 <div className={styles.inputWrapper}>
            <Building2 className={styles.icon} />
            <select
            id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>
          </div>

          {/* New organization name if product manager */}
          {formData.role === 'product manager' && (
            <div className={styles.inputWrapper}>
              <Building2 className={styles.icon} />
              <input
                type="text"
                name="newOrganizationName"
                placeholder="New Organization Name"
                value={formData.newOrganizationName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          )}

          {/* Existing organization dropdown if not product manager */}
          {formData.role !== 'product manager' && formData.userType === 'organization' && (
            <div className={styles.inputWrapper}>
              <Building2 className={styles.icon} />
              <select
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                className={styles.input}
                required
              >
                <option value="">Select organization</option>
                {organizations.map((org) => (
                  <option key={org.organizationId} value={org.organizationId}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          )}

        

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}


