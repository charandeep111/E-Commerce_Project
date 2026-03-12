import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthGate from './AuthGate';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Show a loading spinner while the auth state is being determined
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-primary-100 animate-pulse"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-primary-600 animate-spin"></div>
                </div>
                <p className="text-gray-400 font-medium animate-pulse">Verifying credentials...</p>
            </div>
        );
    }

    // If not authenticated, show the Auth Gate
    if (!user) {
        return <AuthGate />;
    }

    // If authenticated, render the children (the protected content)
    return children;
};

export default ProtectedRoute;
