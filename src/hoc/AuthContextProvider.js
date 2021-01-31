import React , { useState ,createContext , useEffect , useCallback } from 'react';
let initialAuthState = {
    token : '',
    username : '',
    userId : '',
    isAuthenticated : false
}
export const AuthContext = createContext({});
const AuthContextProvider = (props)=>{
    const [authState , setAuthState ] = useState(initialAuthState);

    
    const setAuthenticationValues = useCallback((authStatus, authSatePayload)=>{
        let tempAuthState ;
        if(authStatus){
             tempAuthState = {
                token : authSatePayload.token,
                username : authSatePayload.username,
                userId : authSatePayload.userId,
                isAuthenticated : true
            }
            const expirationDate = new Date(new Date().getTime()+authSatePayload.expiresIn);
            localStorage.setItem('token',tempAuthState.token)
            localStorage.setItem('username',tempAuthState.username)
            localStorage.setItem('userId',tempAuthState.userId)
            localStorage.setItem('expirationDate',expirationDate);
            autoLogout(authSatePayload.expiresIn);
        }else{
            tempAuthState = initialAuthState;
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('userId')
            localStorage.removeItem('expirationDate')
        }
        setAuthState(tempAuthState)
        // eslint-disable-next-line
    },[])
    
    const autoLogout = useCallback((millisecs)=>{
        //clearTimeout(logoutTimeout);
        setTimeout(()=>{
            setAuthenticationValues(false)
        },millisecs)
    },[setAuthenticationValues]);

    const autoTryLogin = useCallback(() =>{
        const token = localStorage.getItem('token');
        if(token){
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            const currentDate = new Date();
            if(expirationDate<=currentDate){
                setAuthenticationValues(false);
            }else{
                setAuthState({
                    token ,
                    username : localStorage.getItem('username'),
                    userId : localStorage.getItem('userId'),
                    isAuthenticated : true
                });
                autoLogout((expirationDate.getTime()-currentDate.getTime()));
            }
        }else{
            setAuthenticationValues(false);
        }
    },[autoLogout,setAuthenticationValues]);
   

    

   
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