import React , { useState ,createContext , useEffect , useCallback } from 'react';
let initialAuthState = {
    token : '',
    username : '',
    userId : '',
    isAuthenticated : false
}
export const AuthContext = createContext({});
const AuthContextProvider = (props)=>{
    const [authState , setAuthState ] = useState(initialAuthState)
    const autoTryLogin = useCallback(() =>{
        const token = localStorage.getItem('token')
        if(token){
            setAuthState({
                token ,
                username : localStorage.getItem('username'),
                userId : localStorage.getItem('userId'),
                isAuthenticated : true
            });
        }else{
            setAuthenticationValues(false);
        }
    },[])
    const setAuthenticationValues = (authStatus, authSatePayload)=>{
        let tempAuthState ;
        if(authStatus){
             tempAuthState = {
                token : authSatePayload.token,
                username : authSatePayload.username,
                userId : authSatePayload.userId,
                isAuthenticated : true
            }
            localStorage.setItem('token',tempAuthState.token)
            localStorage.setItem('username',tempAuthState.username)
            localStorage.setItem('userId',tempAuthState.userId)
        }else{
            tempAuthState = initialAuthState;
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('userId')
        }
        setAuthState(tempAuthState)
    }

    let contextValue = {
        authState,
        setAuthenticationValues
    }

    useEffect(()=>{
        autoTryLogin();
    },[autoTryLogin])

    return (
        <AuthContext.Provider value ={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )

}

export default AuthContextProvider;