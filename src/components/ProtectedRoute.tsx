import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            navigate('/login', { state: { from: location }, replace: true });
        } else {

        }
    }, [navigate, location, dispatch]);

    return <>{children}</>;
};

export default ProtectedRoute;
