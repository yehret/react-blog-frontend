import React from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

export const Index = () => {
  const userData = useSelector((state) => state.auth.data);

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={userData.avatarUrl} />
        <div className={styles.form}>
          <TextField label="Write a comment" variant="outlined" maxRows={10} multiline fullWidth />
          <Button variant="contained">Send</Button>
        </div>
      </div>
    </>
  );
};
