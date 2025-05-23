import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface ProfileBookCardProps {
  title: string;
  image: string;
  author: string;
  date: string;
  id?: string;
}

export default function ProfileBookCard({ title, image, author, date, id = '1' }: ProfileBookCardProps) {
  return (
    <Link
      to={`/book/${id}`}
      className="no-underline text-inherit"
    >
      <Box className="bg-white rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover"
        />
        <Box className="p-3">
          <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{author}</p>
          <p className="text-gray-400 text-xs mt-1">{date}</p>
        </Box>
      </Box>
    </Link>
  );
}
