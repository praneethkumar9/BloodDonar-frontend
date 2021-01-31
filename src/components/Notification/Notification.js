/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from './Notification.module.css';

const Notification = (props) => {
  const classList = [styles.Notification];
  (props.show && classList.push(styles.Pop));
  return (
    <div className = {classList.join(' ')} >
      {props.message}</div>
  );
};

export default React.memo(Notification);
