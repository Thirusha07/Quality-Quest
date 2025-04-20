// lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthResult {
  isAuthenticated: boolean;
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return { isAuthenticated: false };
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    return {
      isAuthenticated: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { isAuthenticated: false };
  }
}