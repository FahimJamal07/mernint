import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || 'guest');

    const login = (userData) => {
        const mockRole = userData.email === 'admin@cms.edu' ? 'admin' : 'student';
        
        localStorage.setItem('user', userData.email);
        localStorage.setItem('role', mockRole);
        
        setUser(userData.email);
        setRole(mockRole);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setUser(null);
        setRole('guest');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};