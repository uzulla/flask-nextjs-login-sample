'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { protectedAPI } from '@/services/api';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [protectedData, setProtectedData] = useState<{ msg: string; user_id: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const data = await protectedAPI.getProtectedData();
        setProtectedData(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to fetch protected data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProtectedData();
  }, []);
  
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>You need to be logged in to view this page.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => logout().catch(err => console.error('Logout error:', err))}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-2">User Information</h2>
        <div className="space-y-2">
          <div className="flex">
            <span className="font-medium w-24">Username:</span>
            <span>{user.username}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">User ID:</span>
            <span>{user.id}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium mb-2">Protected Data</h2>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : protectedData ? (
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium w-24">Message:</span>
                <span>{protectedData.msg}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">User ID:</span>
                <span>{protectedData.user_id}</span>
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
