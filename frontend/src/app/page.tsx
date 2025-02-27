'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Authentication Demo
        </h1>
        
        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className="flex justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex justify-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-300 hover:bg-gray-50"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
