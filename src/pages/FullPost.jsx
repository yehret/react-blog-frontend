import React from 'react';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from '../axios';

export const FullPost = () => {
  const { id } = useParams();
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);

  console.log(data);

  React.useEffect(() => {
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
  }, [id]);

  if (isLoading) {
    return <Post isFullPost isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.comments ? data.comments.length : 0}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={data.comments} isLoading={false}>
        <Index setData={setData} setLoading={setLoading} />
      </CommentsBlock>
    </>
  );
};
