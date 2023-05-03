import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  const [fields, setFields] = React.useState({
    text: '',
    title: '',
    tags: '',
    imageUrl: '',
    isLoading: false,
  });

  const isEditing = Boolean(id);

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

  const onClickRemoveImage = () => {
    if (window.confirm('Are you sure you want to remove image?')) {
      setFields({ ...fields, imageUrl: '' });
    }
  };

  const onChange = React.useCallback(
    (value) => {
      setFields({ ...fields, text: value });
    },
    [fields],
  );

  const onSubmit = async () => {
    try {
      setFields({ ...fields, isLoading: true });

      const splittedTags = fields.tags.split(', ');
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, { ...fields, tags: splittedTags })
        : await axios.post('/posts', { ...fields, tags: splittedTags });

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert('An error has been occurred when creating post');
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then((res) => {
          setFields({
            text: res.data.text,
            title: res.data.title,
            tags: res.data.tags.join(', '),
            imageUrl: res.data.imageUrl,
          });
        })
        .catch((err) => {
          console.warn(err);
          alert('Error: ' + err.message);
        });
      console.log(fields);
    }
  }, [id]);

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
        placeholder="Tags,     please write it like:   'tag1, tag2, ...'"
        value={fields.tags}
        onChange={(e) => setFields({ ...fields, tags: e.target.value })}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={fields.text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Publish'}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
