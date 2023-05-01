import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from '../../axios';

export const AddPost = () => {
  const isAuth = useSelector(selectIsAuth);

  const [fields, setFields] = React.useState({
    value: '',
    title: '',
    tags: '',
    imageUrl: '',
  });

  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setFields({ ...fields, imageUrl: data.url });
    } catch (error) {
      console.warn(error);
      alert('An error has been occurred when uploading image');
    }
  };

  const onClickRemoveImage = async (event) => {};

  const onChange = React.useCallback(
    (value) => {
      setFields({ ...fields, value });
    },
    [fields],
  );

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter a text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  console.log(fields);

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Load preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {fields.imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>

          <img
            className={styles.image}
            src={`http://localhost:4444${fields.imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Article title..."
        value={fields.title}
        onChange={(e) => setFields({ ...fields, title: e.target.value })}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={fields.tags}
        onChange={(e) => setFields({ ...fields, tags: e.target.value })}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={fields.value}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button size="large" variant="contained">
          Publish
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
