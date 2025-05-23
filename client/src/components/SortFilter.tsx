import GridViewIcon from '@mui/icons-material/GridView';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';

interface SortFilterProps {
  onSortChange: (value: 'distance' | 'date') => void;
  value: 'distance' | 'date';
}

export default function SortFilter({ onSortChange, value }: SortFilterProps) {
  const handleSortChange = (e: SelectChangeEvent) => {
    const newValue = e.target.value as 'distance' | 'date';
    onSortChange(newValue);
  };

  return (
    <Box className="flex justify-between items-center px-4 py-2">
      <Box className="flex gap-4">
        <Select
          value={value}
          onChange={handleSortChange}
          size="small"
          className="text-gray-600"
          sx={{
            '& .MuiSelect-select': {
              padding: '4px 8px',
              fontSize: '14px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        >
          <MenuItem value="distance">거리순</MenuItem>
          <MenuItem value="date">최신순</MenuItem>
        </Select>
      </Box>
      <GridViewIcon />
    </Box>
  );
}
