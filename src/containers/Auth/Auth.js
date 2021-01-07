import React , {useContext ,Fragment , useState} from 'react';
import {AuthContext} from '../../hoc/AuthContextProvider';

const Auth = (props) => {
  const {setAuthenticationValues}  = useContext(AuthContext);
  const [name,setName]=useState('hello');
  const login = ()=>{
   let payload = {
      token : 'token',
      username : name,
      userId : 1,
      isAuthenticated : true
  }
  setAuthenticationValues(true,payload)
  props.history.push('/bloodBanks');
  }
//   const logout = ()=>{
//     setAuthenticationValues(false)
//   }
  const inputHandler = (event)=>{
    setName(event.target.value);
  }
  return (
          <Fragment>
          <input type='text' onChange = {inputHandler} value={name}/>
          <button onClick={login} >Login</button>
          </Fragment>
        );
}

export default Auth;
