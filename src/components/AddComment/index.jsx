import React from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import axios from '../../axios';
import { useParams } from 'react-router-dom';

export const Index = ({ setData, setLoading }) => {
  const userData = useSelector((state) => state.auth.data);
  const [value, setValue] = React.useState('');
  const { id } = useParams();

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = async () => {
    try {
      await axios.post(`/posts/comment/${id}`, { text: value });
      axios
        .get(`/posts/${id}`)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.warn(err);
          alert('Error when getting post');
        });
      setValue('');
    } catch (error) {
      console.warn(error);
      alert('Failed to create comment');
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={userData ? userData.avatarUrl : null} />
        <div className={styles.form}>
          <TextField
            onChange={onChange}
            value={value}
            label="Write a comment"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained">
            Send
          </Button>
        </div>
      </div>
    </>
  );
};
