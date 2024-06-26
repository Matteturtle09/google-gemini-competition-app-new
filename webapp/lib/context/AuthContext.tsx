"use client";
import React, { Children } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import firebaseApp from '../firebase/config';

const auth = getAuth(firebaseApp);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children
}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        })

        return () =>
            unsubscribe

    }, [])
    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}