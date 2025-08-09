import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { User, UserRole } from '@/types';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      phone?: string;
      role: UserRole;
      isVerified: boolean;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      location?: string[];
      isAvailable?: boolean;
      partnershipRequest: 'NONE' | 'Broker' | 'Contractor';
      accessToken: string;
      sessionId: string;
      avatar?: string;
      createdAt?: string;
      updatedAt?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: UserRole;
    isVerified: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    location?: string[];
    isAvailable?: boolean;
    partnershipRequest: 'NONE' | 'Broker' | 'Contractor';
    accessToken: string;
    sessionId: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    isVerified: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    phone?: string;
    location?: string[];
    isAvailable?: boolean;
    partnershipRequest: 'NONE' | 'Broker' | 'Contractor';
    accessToken: string;
    sessionId: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call the backend API to authenticate user
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.error('Login failed:', response.status, response.statusText);
            return null;
          }

          const data = await response.json();

          // Check if login was successful and we have an access token
          if (data && data.accessToken) {

            try {
              // Fetch user profile data from the backend
              const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/user/profile`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${data.accessToken}`,
                  'Session': data.sessionId,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'omit',
              });

              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                const userData = profileData.user || profileData;

                return {
                  id: userData.id || userData._id,
                  email: userData.email || credentials.email,
                  name: userData.name || credentials.email.split('@')[0],
                  phone: userData.phone,
                  role: userData.role || 'user' as UserRole,
                  isVerified: userData.isEmailVerified || false,
                  isEmailVerified: userData.isEmailVerified || false,
                  isPhoneVerified: userData.isPhoneVerified || false,
                  location: userData.location || [],
                  isAvailable: userData.isAvailable !== undefined ? userData.isAvailable : true,
                  partnershipRequest: userData.partnershipRequest || 'NONE',
                  accessToken: data.accessToken,
                  sessionId: data.sessionId,
                  avatar: userData.avatar,
                  createdAt: userData.createdAt,
                  updatedAt: userData.updatedAt,
                };
              } else {
                console.error('Profile fetch failed:', profileResponse.status);
                // Try the root endpoint as fallback
                const rootResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${data.accessToken}`,
                    'Session': data.sessionId,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  mode: 'cors',
                  credentials: 'omit',
                });

                if (rootResponse.ok) {
                  const rootData = await rootResponse.json();

                  return {
                    id: rootData.id || rootData._id,
                    email: rootData.email || credentials.email,
                    name: rootData.name || credentials.email.split('@')[0],
                    phone: rootData.phone,
                    role: rootData.role || 'user' as UserRole,
                    isVerified: rootData.isEmailVerified || false,
                    isEmailVerified: rootData.isEmailVerified || false,
                    isPhoneVerified: rootData.isPhoneVerified || false,
                    location: rootData.location || [],
                    isAvailable: rootData.isAvailable !== undefined ? rootData.isAvailable : true,
                    partnershipRequest: rootData.partnershipRequest || 'NONE',
                    accessToken: data.accessToken,
                    sessionId: data.sessionId,
                    avatar: rootData.avatar,
                    createdAt: rootData.createdAt,
                    updatedAt: rootData.updatedAt,
                  };
                }
              }
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
            }

            // Fallback: create basic user object if profile fetch fails
            return {
              id: 'temp-id',
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: 'user' as UserRole,
              isVerified: false,
              isEmailVerified: false,
              isPhoneVerified: false,
              location: [],
              isAvailable: true,
              partnershipRequest: 'NONE',
              accessToken: data.accessToken,
              sessionId: data.sessionId,
            };
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.isEmailVerified = user.isEmailVerified;
        token.isPhoneVerified = user.isPhoneVerified;
        token.phone = user.phone;
        token.location = user.location;
        token.isAvailable = user.isAvailable;
        token.partnershipRequest = user.partnershipRequest;
        token.accessToken = user.accessToken;
        token.sessionId = user.sessionId;
        token.avatar = user.avatar;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.isPhoneVerified = token.isPhoneVerified;
        session.user.phone = token.phone;
        session.user.location = token.location;
        session.user.isAvailable = token.isAvailable;
        session.user.partnershipRequest = token.partnershipRequest;
        session.user.accessToken = token.accessToken;
        session.user.sessionId = token.sessionId;
        session.user.avatar = token.avatar;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle role-based redirects after login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper functions for role-based access control
export const hasRole = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};

export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'admin';
};

export const isBroker = (userRole: UserRole): boolean => {
  return userRole === 'broker';
};

export const isContractor = (userRole: UserRole): boolean => {
  return userRole === 'contractor';
};

export const isBuyer = (userRole: UserRole): boolean => {
  return userRole === 'user';
};
