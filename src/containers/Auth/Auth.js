/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {useContext, useState, Fragment} from 'react';
import {AuthContext} from '../../hoc/AuthContextProvider';
import {Redirect} from 'react-router-dom';
import styles from './Auth.module.css';
import Spinner from './Spinner/Spinner';
import Notification from '../../components/Notification/Notification';
import validator from 'validator';

import config from '../../shared/config';
import apiCalls from '../../shared/apiCalls';

// blood groups from config
const bloodGroups = config.bloodGroups;

// intial default form states
const intialLoginForm = {name: '', password: '', error: {}};
const intialRegistrationForm = {
  name: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  email: '',
  bloodGroup: '',
  donar: true,
  setNotificationOn: true,
  setAddress: false,
  address: '',
  city: '',
  zipCode: '',
  error: {},
};

const Auth = (props) => {
  const {setAuthenticationValues, authState} = useContext(AuthContext);

  // component state initialization
  const [loginForm, setLoginForm]=useState({...intialLoginForm});
  const [notificationState,
    setNotificationState]=useState({show: false, message: ''});
  const [registerForm, setRegisterForm]=useState({...intialRegistrationForm});
  const [isLoading, setIsLoading]=useState(false);
  const [isRegister, setIsRegister]=useState(false);

  // Extracting form values to local variables
  const {name, password, error,
    confirmPassword,
    phoneNumber,
    email,
    bloodGroup,
    donar,
    setNotificationOn,
    setAddress,
    address,
    city,
    zipCode,
  } = isRegister?registerForm:loginForm;

  // Function to login into the application
  const login = async (e)=>{
    e.preventDefault();
    console.log('inside submit');
    if (validateForm()) {
      setIsLoading(true);
      const loginParams = {
        username: name,
        password,
      };
      const [response,
        status] = await apiCalls.postAPI('/users/login', loginParams);
      setIsLoading(false);
      if (status) {
        const {user, token, expiresIn} = response.successData;
        const payload = {
          token: token,
          username: user.username,
          userId: user._id,
          expiresIn,
          isAuthenticated: true,
        };
        setNotification('Login successfull !!');
        setAuthenticationValues(true, payload);
        props.history.push('/bloodBanks');
      } else {
        setNotification('Login unsuccessfull !!');
      }
    } else {
      setErrorMessages();
    }
  };

  // Function to register into the application
  const register = async (e)=>{
    e.preventDefault();
    console.log('inside submit');
    if (validateForm()) {
      console.log(registerForm);
      setIsLoading(true);
      let registerParams = {
        username: name,
        phoneNumber,
        bloodGroup,
        password,
        donar,
        notification: setNotificationOn,
      };
      (email)&&(registerParams.email=email);
      if (setAddress) {
        registerParams = {
          ...registerParams,
          address,
          city,
          zip: zipCode,
        };
      }
      const apiResponse = await apiCalls
          .postAPI('/users/register', registerParams);
      setIsLoading(false);
      if (apiResponse && apiResponse[1]) {
        setNotification('Registered successfully !!');
        setIsRegister(false);
      } else {
        console.log(apiResponse);
        if (apiResponse[0].mongoError) {
          setNotification('Phone number already taken !!');
        } else {
          setNotification('Register unsuccessfull !!');
        }
      }
    } else {
      setErrorMessages();
    }
  };

  // Setting errors for mandatory fields
  const setErrorMessages = () =>{
    if (!name) {
      error.name = 'Username is required';
    }
    if (!password) {
      error.password = 'Password is required';
    }
    if (isRegister) {
      if (!phoneNumber) {
        error.phoneNumber = 'Mobile number is required';
      }
      if (!bloodGroup) {
        error.bloodGroup = 'Blood group is required';
      }
    }
    isRegister?
    setRegisterForm({...registerForm, error}):
    setLoginForm({...loginForm, error});
  };

  // Function for handling form inputs
  const inputHandler =(inputName)=> (event)=>{
    // clearing already existing error
    const tempError = {...error};
    delete tempError[inputName];

    const updatedObject = {
      error: tempError,
      [inputName]: event.target.value,
    };

    // updating state value for boolean values
    if (inputName==='donar' ||
    inputName === 'setNotificationOn' || inputName === 'setAddress') {
      updatedObject[inputName]= event.target.checked;
    }

    // Restricting the phoneNumber field only to numbers
    if (inputName==='phoneNumber') {
      if (((event.nativeEvent.data!=null) &&
       !(/^[0-9]$/).test(event.nativeEvent.data)) ||
       event.target.value.length>10) {
        return false;
      }
    }

    // updating state with input value
      isRegister?
      setRegisterForm({...registerForm, ...updatedObject}):
      setLoginForm({...loginForm, ...updatedObject});
  };

  // Checking form filled with mandortory fields & no errors
  const isValid = () =>{
    const requiredStatus = isRegister?
    (name && password && phoneNumber && bloodGroup):(name && password);
    return (requiredStatus && (Object.keys(error).length===0));
  };

  // Function to validate the form & setting error state value
  const validateForm = () =>{
    console.log('inside validateForm');
    if (name && name.length<4) {
      error.name = 'username should be atleast 4 characters';
    }
    if (isRegister) {
      if ( password ) {
        if (!validator.isStrongPassword(password)) {
          error.password =
          // eslint-disable-next-line max-len
          'Password should be atleast 8 characters , one lowercase , one uppercase , one number , one special character';
        }
        if (confirmPassword && !validator.equals(password, confirmPassword)) {
          error.confirmPassword = 'Passwords you entered do not match';
        }
      }
      if (email && !validator.isEmail(email)) {
        error.email = 'Please enter valid email address';
      }
      if (setAddress) {
        if (!address) {
          error.address = 'Please enter address';
        }
        if (!city) {
          error.city = 'Please enter city';
        }
        if (!zipCode) {
          error.zipCode = 'Please enter zip code';
        }
      }
    }

    // Getting status of mandatory fields and errors for form
    const validStatus = isValid();
    isRegister?
    setRegisterForm({...registerForm, error}):
    setLoginForm({...loginForm, error});
    return validStatus;
  };

  // Funtion to switch forms through state
  const switchFormState = () =>(!isRegister)?
                         setIsRegister(true):setIsRegister(false);

  // Notification Element to display notifications
  const NotificationElement = (
    <Notification
      show={notificationState.show}
      message={notificationState.message}/>
  );

  // Funtion to display notification message for 2.5 secs
  const setNotification = (message) =>{
    let tempnotificationState = {...notificationState};
    tempnotificationState = {
      show: true,
      message: message,
    };
    setNotificationState(tempnotificationState);
    setTimeout(()=>{
      tempnotificationState.show = false;
      tempnotificationState = {...tempnotificationState};
      setNotificationState(tempnotificationState);
    }, 2500);
  };

  // Loading with address form if  set address is true
  const addressForm = setAddress?(
    <Fragment>
      <div className={styles.formElement}>
        <label className={styles.formLabel} >Address </label>
        <input className={styles.inputElement}
          type='text' onChange = {inputHandler('address')}
          value={registerForm.address}/>
        {registerForm.error.address &&
        <span className = {styles.Error} >{registerForm.error.address}</span>}
      </div>
      <div className={styles.formElement}>
        <div className = {styles.gridContainer}>
          <div className = {styles.gridItem} style={{paddingRight: '12px'}}>
            <label className={styles.formLabel} >City </label>
            <input className={styles.inputElement}
              type='text' onChange = {inputHandler('city')}
              value={registerForm.city}/>
            {registerForm.error.city &&
            <span className = {styles.Error} >{registerForm.error.city}</span>}
          </div>
          <div className = {styles.gridItem}>
            <label className={styles.formLabel} >Zip Code </label>
            <input className={styles.inputElement}
              type='text' onChange = {inputHandler('zipCode')}
              value={registerForm.zipCode}/>
            {registerForm.error.zipCode &&
             <span className = {styles.Error} >
               {registerForm.error.zipCode}</span>}
          </div>
        </div>

      </div>
    </Fragment>
  ):null;


  // Loading form based on register state
  const form = (!isRegister) ?
                      (
                        <Fragment>
                          <form onSubmit={login}>
                            <div className={styles.formElement}>
                              <label className={styles.formLabel} >
                                Username</label>
                              <input className={styles.inputElement}
                                type='text' onChange = {inputHandler('name')}
                                value={loginForm.name}/>
                              {loginForm.error.name &&
                               <span className = {styles.Error}>
                                 {loginForm.error.name}</span>}
                            </div>
                            <div className={styles.formElement}>
                              <label className={styles.formLabel} >
                                Password</label>
                              <input className={styles.inputElement}
                                type='password'
                                onChange = {inputHandler('password')}
                                value={loginForm.password}/>
                              {loginForm.error.password &&
                              <span className = {styles.Error} >
                                {loginForm.error.password}</span>}
                            </div>
                            <button className={styles.loginButton} >
                              Login</button>
                          </form>
                          <div style={{
                            padding: '2px', font: 'inherit', fontSize: '90%'}}>
                            <div style={{
                              paddingLeft: '13px', marginBottom: '4px'}}
                              {/** replace with forgot password function*/}
                            onClick={validateForm}>
                              <span style={
                                {color: '#5c8a8a', cursor: 'pointer'}}
                              >Forgot your password?</span>
                            </div>
                            <div style={{paddingLeft: '13px'}}
                              onClick={switchFormState}>
                              <span> Don't have an account? </span>
                              <span style=
                                {{color: '#5c8a8a', cursor: 'pointer'}}>
                                  Sign up</span>
                            </div>
                          </div>
                        </Fragment>
                      ):(
                        <form onSubmit={register}>
                          <div className={styles.formElement}>
                            <label className={styles.formLabel}>
                              Username </label>
                            <input className={styles.inputElement}
                              type='text' onChange = {inputHandler('name')}
                              value={registerForm.name}/>
                            {registerForm.error.name &&
                            <span className = {styles.Error} >
                              {registerForm.error.name}</span>}
                          </div>
                          <div className={styles.formElement}>
                            <label className={styles.formLabel}>
                              Password </label>
                            <input className={styles.inputElement}
                              type='password'
                              onChange = {inputHandler('password')}
                              value={registerForm.password}/>
                            {registerForm.error.password &&
                            <span className = {styles.Error} >
                              {registerForm.error.password}</span>}
                          </div>
                          <div className={styles.formElement}>
                            <label className={styles.formLabel}>
                              Confirm Password </label>
                            <input className={styles.inputElement}
                              type='password'
                              onChange = {inputHandler('confirmPassword')}
                              value={registerForm.confirmPassword}/>
                            {registerForm.error.confirmPassword &&
                            <span className = {styles.Error} >
                              {registerForm.error.confirmPassword}</span>}
                          </div>
                          <div className={styles.formElement}>
                            <label className={styles.formLabel} >Mobile </label>
                            <input className={styles.inputElement}
                              type='tel'
                              onChange = {inputHandler('phoneNumber')}
                              value={registerForm.phoneNumber}/>
                            {registerForm.error.phoneNumber &&
                            <span className =
                              {styles.Error} >
                              {registerForm.error.phoneNumber}</span>}
                          </div>
                          <div className={styles.formElement}>
                            <label className={styles.formLabel} >
                              Email <span className = {styles.Optional} >
                                 (optional) </span> </label>
                            <input className={styles.inputElement}
                              type='email'
                              onChange = {inputHandler('email')}
                              value={registerForm.email}/>
                            {registerForm.error.email &&
                            <span className = {styles.Error}
                            >{registerForm.error.email}</span>}
                          </div>
                          <div className={styles.formElement}>
                            <label className={styles.formLabel} >
                              Blood Group </label>
                            <select className={styles.inputElement}
                              onChange = {inputHandler('bloodGroup')}
                              placeholder="Select Blood group"
                              value={registerForm.bloodGroup}>
                              <option hidden value>
                                Select your blood group</option>
                              {bloodGroups
                                  .map((option) => <option
                                    value={option} key={option}>{option}
                                  </option>)}
                            </select>
                            {registerForm.error.bloodGroup &&
                            <span className = {styles.Error} >
                              {registerForm.error.bloodGroup}</span>}
                          </div>
                          <div className={styles.formElement}>
                            <div className = {styles.gridContainer1}>
                              <div className = {styles.gridItem}
                                style={{paddingRight: '12px'}}>
                                <label className={styles.formLabel}>
                                  Register as a donar </label>
                              </div>
                              <div className = {styles.gridItem}>
                                <div className={styles.switchWrapper}>
                                  <label className={styles.switch} >
                                    <input type="checkbox"
                                      onChange = {inputHandler('donar')}
                                      checked={donar} />
                                    <div
                                      className={
                                        [styles.slider, styles.round]
                                            .join(' ')} >
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.formElement}>
                            <div className = {styles.gridContainer1}>
                              <div className = {styles.gridItem}
                                style={{paddingRight: '12px'}}>
                                <label className={styles.formLabel}>
                                  Notifications for blood request </label>
                              </div>
                              <div className = {styles.gridItem}>
                                <div className={styles.switchWrapper}>
                                  <label className={styles.switch} >
                                    <input type="checkbox"
                                      onChange =
                                        {inputHandler('setNotificationOn')}
                                      checked={setNotificationOn} />
                                    <div className={
                                      [styles.slider, styles.round]
                                          .join(' ')} ></div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.formElement}>
                            <div className = {styles.gridContainer1}>
                              <div className = {styles.gridItem}
                                style={{paddingRight: '12px'}}>
                                <label className={styles.formLabel} >
                                  Set address </label>
                              </div>
                              <div className = {styles.gridItem}>
                                <div className={styles.switchWrapper}>
                                  <label className={styles.switch} >
                                    <input type="checkbox"
                                      onChange = {inputHandler('setAddress')}
                                      checked={setAddress} />
                                    <div className={
                                      [styles.slider, styles.round]
                                          .join(' ')} ></div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          {addressForm}
                          <button
                            className={styles.loginButton} >Register</button>
                        </form>
                      );

  // Redirect to bloodBanks if authenticated
  const redirect = authState.isAuthenticated ?
  <Redirect to="/bloodBanks" /> : null;

  return (
    <div className={styles.AuthContainer} onClick={validateForm}>
      {NotificationElement}
      <div className={styles.AuthContent}>
        {redirect}
        {!isLoading?form:
            <Spinner/>}
      </div>
    </div>
  );
};

export default Auth;
