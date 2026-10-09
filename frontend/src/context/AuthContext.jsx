import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "../config/firebase";

import axios from "axios";

const AuthContext = createContext(null);


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5009";


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


export const AuthProvider = ({ children, }) => {
  const [ user, setUser, ] = useState(null);
  const [ loading, setLoading, ] = useState(true);


   
const syncUserWithBackend = async (firebaseUser) => {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await api.post("/api/auth/google", {
      idToken,
    });

    // Ignore responses from an account that has since signed out
    // or switched to a different Google account.
    if (auth.currentUser?.uid !== firebaseUser.uid) {
      return null;
    }

    if (response.data?.success) {
      setUser(response.data.user);
      return response.data.user;
    }

    return null;
  } catch (error) {
    if (auth.currentUser?.uid === firebaseUser.uid) {
      setUser(null);
    }

    console.error(
      "Failed to sync user with backend:",
      error.response?.data || error.message
    );

    throw error;
  }
};


  const fetchCurrentUser =  async () => {
      try {
        const response =
          await api.get(
            "/api/auth/me"
          );

        if (
          response.data?.success
        ) {
          setUser(
            response.data.user
          );

          return response.data.user;
        }

        setUser(null);
        return null;
      } catch (error) {
        setUser(null);
        return null;
      }
    };


  useEffect(() => { let isMounted = true;
    const initializeAuth =
      async () => {
        try {
          const currentUser =
            auth.currentUser;


          if (currentUser) {
            await fetchCurrentUser();
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };


    initializeAuth();


    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          if (!isMounted) {
            return;
          }


          try {
            if (firebaseUser) {
              await syncUserWithBackend(
                firebaseUser
              );
            } else {
              setUser(null);
            }
          } catch (error) {
            setUser(null);
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        }
      );


    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);


  

const logout = async () => {
  // Immediately clear the frontend's authenticated state.
  setUser(null);

  try {
    // Sign out of Firebase first.
    await signOut(auth);
  } finally {
    // Then clear the backend session cookie.
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error(
        "Backend logout failed:",
        error.response?.data || error.message
      );
    }
  }
};


const value = {
  user,
  loading,
  logout,
  fetchCurrentUser,
  syncUserWithBackend,
};


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }


  return context;
};


export default AuthContext;