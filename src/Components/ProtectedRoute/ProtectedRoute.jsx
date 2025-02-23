import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUserType }) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const location = useLocation();

    if (!token) {
        // Prevent infinite loop by not redirecting if already on login page
        if (location.pathname === '/login') {
            return null;
        }
        return <Navigate to="/login" />;
    }

    if (allowedUserType && userType !== allowedUserType) {
        // Prevent infinite loop by checking current path
        const targetPath = `/${userType}dashboard`;
        if (location.pathname === targetPath) {
            return null;
        }
        return <Navigate to={targetPath} />;
    }

    return children;
};

export default ProtectedRoute;