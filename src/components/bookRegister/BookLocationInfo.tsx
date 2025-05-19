import { Box, Typography } from '@mui/material';
import React from 'react';

export default function BookLocationInfo() {
  return (
    <Box>
      <Typography className="mb-2 font-medium">위치 정보</Typography>
      <Box className="rounded-lg overflow-hidden border">
        <img
          src="https://maps.googleapis.com/maps/api/staticmap?center=37.5665,126.9780&zoom=15&size=600x200&key=YOUR_API_KEY"
          alt="map"
          className="w-full h-32 object-cover"
        />
      </Box>
      <Box className="flex items-center mt-2 bg-green-50 rounded p-2">
        <span className="material-icons text-green-700 mr-2">location_on</span>
        <Typography className="text-sm text-gray-600">현재 위치로 등록됩니다</Typography>
      </Box>
    </Box>
  );
}
