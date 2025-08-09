'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTheme } from '@/context/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';

const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number')
    .required('Phone number is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['buyer', 'broker', 'contractor'], 'Please select a valid role')
    .required('Role is required'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const roleOptions = [
  { value: 'buyer', label: 'Property Buyer', description: 'Looking to buy property' },
  { value: 'broker', label: 'Site Scout/Broker', description: 'Real estate professional' },
  { value: 'contractor', label: 'Contractor', description: 'Construction professional' },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Registration successful! Please sign in.');
        router.push('/auth/login');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 gradient-primary opacity-10" />
      
      <div className="relative w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Join BUILD-CONNECT
            </CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                {...register('name')}
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                leftIcon={<User className="w-5 h-5" />}
                error={errors.name?.message}
                disabled={isLoading}
              />

              <Input
                {...register('email')}
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                disabled={isLoading}
              />

              <Input
                {...register('phone')}
                type="tel"
                label="Phone Number"
                placeholder="Enter your 10-digit phone number"
                leftIcon={<Phone className="w-5 h-5" />}
                error={errors.phone?.message}
                disabled={isLoading}
              />

              <div>
                <label className="form-label">Account Type</label>
                <div className="space-y-3">
                  {roleOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedRole === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-light hover:border-primary/50'
                      }`}
                    >
                      <input
                        {...register('role')}
                        type="radio"
                        value={option.value}
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <UserCheck className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium text-text-primary">
                          {option.label}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="form-error">{errors.role.message}</p>
                )}
              </div>

              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Create a strong password"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                disabled={isLoading}
              />

              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.confirmPassword?.message}
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
