import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,
    onAuthStateChanged, signOut, updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Firebase configuration details
const firebaseConfig = {
    apiKey: "AIzaSyA31h_KyFq8MbwzJt5NKZWZMTkFcqrI6nQ",
    authDomain: "dermaviosion-ai.firebaseapp.com",
    projectId: "dermaviosion-ai",
    storageBucket: "dermaviosion-ai.appspot.com",
    messagingSenderId: "537710907865",
    appId: "1:537710907865:android:a3fb336ef1826ecdd789c8",
    measurementId: "G-XXXXXXX"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                setRole(userDoc.exists() ? userDoc.data().role : null);
            }
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Error message helper function
    const getErrorMessage = (code) => {
        switch (code) {
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/user-not-found':
                return 'No user found with this email.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    };

    // Function to set user role to admin
    const setAdminRole = async (email) => {
        try {
            const usersRef = db.collection('users');
            const querySnapshot = await usersRef.where('email', '==', email).get();

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    // Update the user's role to 'admin'
                    await doc.ref.update({ role: 'admin' });
                    console.log(`${email} has been set as admin.`);
                });
            } else {
                console.error('No user found with this email.');
            }
        } catch (error) {
            console.error('Error setting admin role:', error);
        }
    };

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            await SecureStore.setItemAsync('userToken', token);

            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            setRole(userDoc.exists() ? userDoc.data().role : null);

            if (email === 'herbertyeboah123@gmail.com') {
                await setAdminRole(email);
            }
        } catch (error) {
            Alert.alert('Login Error', getErrorMessage(error.code));
            throw error;
        }
    };

    const signup = async (email, password, name, role) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            await setDoc(doc(db, 'users', user.uid), {
                email,
                role,
                name,
                createdAt: new Date(),
                verificationStatus: role === 'doctor' ? 'pending' : 'approved'
            });

            setRole(role);
        } catch (error) {
            Alert.alert('Signup Error', getErrorMessage(error.code));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setRole(null);
            await SecureStore.deleteItemAsync('userToken');
        } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert('Logout Error', 'An error occurred while logging out. Please try again.');
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            setRole(userDoc.exists() ? userDoc.data().role : null);

            if (auth.currentUser.email === 'herbertyeboah123@gmail.com') {
                await setAdminRole(auth.currentUser.email);
            }
        } catch (error) {
            Alert.alert('Google Login Error', getErrorMessage(error.code));
            throw error;
        }
    };

    const loginWithFacebook = async () => {
        try {
            const provider = new FacebookAuthProvider();
            // Add your Facebook App ID
            provider.addScope('538566685170693'); 
            await signInWithPopup(auth, provider);
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            setRole(userDoc.exists() ? userDoc.data().role : null);

            // Set admin role if the email matches
            if (auth.currentUser.email === 'herbertyeboah123@gmail.com') {
                await setAdminRole(auth.currentUser.email);
            }
        } catch (error) {
            Alert.alert('Facebook Login Error', getErrorMessage(error.code));
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, role, login, signup, logout, loginWithGoogle, loginWithFacebook }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};