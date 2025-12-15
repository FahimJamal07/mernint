import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            setUser(userInfo);
        } catch (error) {
            console.error("Error parsing user info:", error);
            localStorage.removeItem('userInfo');
        }
        setLoading(false);
    };

    const loginUser = async (userInfo) => {
        setLoading(true);
        try {
            const response = await fetch('https://cms-backend-podj.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Server Error' };
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (userInfo) => {
        setLoading(true);
        try {
            const response = await fetch('https://cms-backend-podj.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });

            const data = await response.json();

            if (response.ok) {
                // Auto-login after registration
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Server Error' };
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => { return useContext(AuthContext) };

export default AuthContext;