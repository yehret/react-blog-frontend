import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';
import { fetchAuth } from '../../redux/slices/auth';

export const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (values) => {
    dispatch(fetchAuth(values));
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          type="email"
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          type="password"
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Enter your password' })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Sign in
        </Button>
      </form>
    </Paper>
  );
};
