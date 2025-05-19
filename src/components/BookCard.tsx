import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { RegionInfo } from '@helpers/api/kakao';

interface BookCardProps {
  title: string;
  image: string;
  regionInfo: RegionInfo;
  genres: string[];
  condition: string;
  status: string;
  id?: string;
}

export default function BookCard({ title, image, regionInfo, genres, condition, status, id = '1' }: BookCardProps) {
  return (
    <Link
      to={`/book/${id}`}
      state={{ book: { title, image, regionInfo, genres, condition, status, id } }}
      className="no-underline text-inherit"
    >
      <Box className="w-full mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
        <h3 className="font-medium text-lg mb-1 line-clamp-2 min-h-[48px]">{title}</h3>
        <Box className="flex justify-between items-center text-gray-500 text-sm mb-1">
          <Box className="flex items-center">
            <LocationOnIcon fontSize="small" />
            <span>{regionInfo?.region3 || '-'}</span>
          </Box>
          <span>{condition}</span>
        </Box>
        <Box className="flex justify-between items-center">
          <Box className="flex gap-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className="text-gray-500 text-sm"
              >
                {genre}
              </span>
            ))}
          </Box>
          <span className="text-sm text-green-700">{status}</span>
        </Box>
      </Box>
    </Link>
  );
}
