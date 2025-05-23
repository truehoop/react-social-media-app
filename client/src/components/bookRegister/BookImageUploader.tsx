import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';

interface BookImageUploaderProps {
  images: string[];
  onAddImage: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUploadClick: () => void;
  onRemoveImage: (idx: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function BookImageUploader({ images, onAddImage, onImageUploadClick, onRemoveImage, fileInputRef }: BookImageUploaderProps) {
  return (
    <Box className="mx-4 mt-6 p-4 rounded-lg border-2 border-dashed border-green-300 bg-green-50 flex flex-col items-center">
      <AddAPhotoIcon
        className="text-green-700"
        fontSize="large"
      />
      <Typography className="text-gray-500 mt-2">책 사진을 등록해주세요 (최대 3장)</Typography>
      <Box className="flex gap-2 mt-4">
        {Array.from({ length: 3 }).map((_, idx) =>
          images[idx] ? (
            <Box
              key={idx}
              className="relative"
            >
              <img
                src={images[idx]}
                alt="book"
                className="w-16 h-20 object-cover rounded border"
              />
              <IconButton
                size="small"
                className="absolute -top-2 -right-2 bg-white shadow-md"
                onClick={() => onRemoveImage(idx)}
              >
                <span className="text-sm">×</span>
              </IconButton>
            </Box>
          ) : (
            <IconButton
              key={idx}
              onClick={onImageUploadClick}
              className="w-16 h-20 border rounded flex items-center justify-center bg-white"
              disabled={images.length > idx}
            >
              <span className="text-2xl text-gray-400">+</span>
            </IconButton>
          ),
        )}
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onAddImage}
        accept="image/*"
        className="hidden"
      />
    </Box>
  );
}
