/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {useState, createContext, useEffect, useCallback} from 'react';

// Intial auth state values
const initialAuthState = {
  token: '',
  username: '',
  userId: '',
  isAuthenticated: false,
};

// Context creation
export const AuthContext = createContext({});

const AuthContextProvider = (props)=>{
  const [authState, setAuthState] = useState(initialAuthState);

  // Function to set auth state based on authentication result  & logout
  const setAuthenticationValues = useCallback((authStatus, authSatePayload)=>{
    let tempAuthState;
    // Auth success scenerio
    if (authStatus) {
      tempAuthState = {
        token: authSatePayload.token,
        username: authSatePayload.username,
        userId: authSatePayload.userId,
        isAuthenticated: true,
      };
      // create a expiration date with token expireIn seconds
      const expirationDate = new Date(
          new Date().getTime()+authSatePayload.expiresIn);
      localStorage.setItem('token', tempAuthState.token);
      localStorage.setItem('username', tempAuthState.username);
      localStorage.setItem('userId', tempAuthState.userId);
      localStorage.setItem('expirationDate', expirationDate);
      autoLogout(authSatePayload.expiresIn);
    } else {
      // Auth logout scenerio
      tempAuthState = initialAuthState;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('expirationDate');
    }
    setAuthState(tempAuthState);
    // eslint-disable-next-line
    },[])

  // Function to logout from the application
  const autoLogout = useCallback((millisecs)=>{
    // clearTimeout(logoutTimeout);
    setTimeout(()=>{
      setAuthenticationValues(false);
    }, millisecs);
  }, [setAuthenticationValues]);

  /* Function to login automatically
  if non-expired token available in local storage */
  const autoTryLogin = useCallback(() =>{
    const token = localStorage.getItem('token');
    // First check for the token availability
    if (token) {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      const currentDate = new Date();
      // Checking token expiry status
      if (expirationDate<=currentDate) {
        setAuthenticationValues(false);
      } else {
        setAuthState({
          token,
          username: localStorage.getItem('username'),
          userId: localStorage.getItem('userId'),
          isAuthenticated: true,
        });
        autoLogout((expirationDate.getTime()-currentDate.getTime()));
      }
    } else {
      setAuthenticationValues(false);
    }
  }, [autoLogout, setAuthenticationValues]);

  // Context value to pass down to the components
  const contextValue = {
    authState,
    setAuthenticationValues,
  };

  /* React hook function to execute after mounting to the dom
   : ComponentDidMount */
  useEffect(()=>{
    autoTryLogin();
  }, [autoTryLogin]);

  return (
    <AuthContext.Provider value ={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
