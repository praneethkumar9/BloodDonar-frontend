import React , {useContext} from 'react';
import styles from './BloodBanks.module.css'
import {AuthContext} from '../../hoc/AuthContextProvider';

const BloodBanks = (props) => {
  const {authState ,setAuthenticationValues}  = useContext(AuthContext);
  const { username } = authState;
  const logout = ()=>{
    setAuthenticationValues(false);
    props.history.push('/');
  }
  return (
          <div className="App">
       <span className={styles.red}>name : {username}</span>
       <button onClick={logout} >Logout</button>
        </div>
  );
}

export default BloodBanks;
