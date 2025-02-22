import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUserType }) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (allowedUserType && userType !== allowedUserType) {
        return <Navigate to={`/${userType}dashboard`} />;
    }

    return children;
};

export default ProtectedRoute;