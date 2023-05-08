import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);

  const [sortValue, setValue] = React.useState(0);

  const allComments = posts.items.flatMap((post) => {
    if (post.comments && Array.isArray(post.comments)) {
      return post.comments;
    } else {
      return [];
    }
  });

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    sortValue ? dispatch(fetchPosts('?sort=views')) : dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch, sortValue]);

  const handleChange = (_e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={sortValue}
        onChange={handleChange}
        style={{ marginBottom: 15 }}
        aria-label="basic tabs example"
      >
        <Tab label="New" index={0} />
        <Tab label="Popular" index={1} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={format(obj.createdAt)}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments ? obj.comments.length : 0}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />

          <CommentsBlock items={allComments ? allComments : [...Array(5)]} isLoading={false} />
        </Grid>
      </Grid>
    </>
  );
};
