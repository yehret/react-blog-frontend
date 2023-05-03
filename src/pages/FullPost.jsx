import React from 'react';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from '../axios';
import { useSelector } from 'react-redux';

export const FullPost = () => {
  const { id } = useParams();
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);

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
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.comments ? data.comments.length : 0}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        // items={[
        //   {
        //     user: {
        //       fullName: 'Вася Пупкин',
        //       avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
        //     },
        //     text: 'Это тестовый комментарий 555555',
        //   },
        //   {
        //     user: {
        //       fullName: 'Иван Иванов',
        //       avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
        //     },
        //     text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
        //   },
        // ]}

        items={data.comments}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
