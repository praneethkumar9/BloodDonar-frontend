/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {Fragment} from 'react';
const Layout = (props)=>{
  const style = {
    backgroundColor: '#535351',
    borderTop: '1px solid #E7E7E7',
    textAlign: 'center',
    padding: '20px',
    position: 'relative',
    left: '0',
    bottom: '0',
    height: '20px',
    width: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Fragment>
      <header>
        <span>Blood Banks </span>
        <span>Login</span>
      </header>
      <main>
        {props.children}
      </main>
      <div style={style}>
        <center>A blood donar organization</center>
      </div>
    </Fragment>
  );
};

export default Layout;
