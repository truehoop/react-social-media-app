import { Box } from '@mui/system';
import React from 'react';

import { useAppSelector } from '@base/store';
import PostCard from '@components/feed/Post';
import Share from '@components/feed/Share';
import { selectRandomPosts } from '@helpers/selectors/APIRequestSelector';
import { RandomPost } from '@helpers/types/api';

export default function Feed() {
  const posts = useAppSelector(selectRandomPosts);

  return posts ? (
    <Box
      display="flex"
      flexDirection="column"
      p={3}
      className="w-full"
    >
      <Share />

      {posts.map((post: RandomPost, index: number) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
        />
      ))}
    </Box>
  ) : null;
}
