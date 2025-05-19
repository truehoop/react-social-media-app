import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

const genres = ['전체', '소설', '에세이', '고전문학', '현대문학', '판타지', 'SF', '로맨스', '자기계발', '인문학', '역사', '음악', '스포츠'];

interface CategoryFilterProps {
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
}

export default function CategoryFilter({ selectedGenres, onGenreChange }: CategoryFilterProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleGenres, setVisibleGenres] = useState<string[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateVisibleGenres = () => {
      const container = document.getElementById('genre-container');
      if (container) {
        const width = container.clientWidth;
        setContainerWidth(width);

        // 각 버튼의 예상 너비 (padding + margin + text width)
        const buttonWidth = 80; // 예상 버튼 너비 (4글자 기준)
        const maxVisibleButtons = Math.floor(width / buttonWidth) * 2; // 2줄로 표시

        setVisibleGenres(genres.slice(0, maxVisibleButtons));
      }
    };

    updateVisibleGenres();
    window.addEventListener('resize', updateVisibleGenres);
    return () => window.removeEventListener('resize', updateVisibleGenres);
  }, []);

  const handleGenreClick = (genre: string) => {
    if (genre === '전체') {
      onGenreChange(['전체']);
      return;
    }

    let newSelectedGenres = [...selectedGenres];

    if (newSelectedGenres.includes('전체')) {
      newSelectedGenres = [genre];
    } else if (newSelectedGenres.includes(genre)) {
      newSelectedGenres = newSelectedGenres.filter((g) => g !== genre);
    } else {
      newSelectedGenres.push(genre);
    }

    if (newSelectedGenres.length === 0) {
      newSelectedGenres = ['전체'];
    }

    onGenreChange(newSelectedGenres);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogConfirm = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      id="genre-container"
      className="relative"
    >
      <Box className="flex flex-col gap-2 p-4">
        <Box className="grid grid-cols-5 gap-2">
          {visibleGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`px-2 py-1.5 rounded-full whitespace-nowrap text-sm text-center ${
                selectedGenres.includes(genre) ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {genre.length > 4 ? `${genre.slice(0, 4)}...` : genre}
            </button>
          ))}
          {genres.length > visibleGenres.length && (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-2 py-1.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap flex items-center justify-center gap-1 text-sm"
            >
              더보기
              <KeyboardArrowDownIcon fontSize="small" />
            </button>
          )}
        </Box>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>장르 선택</DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-3 gap-2 mt-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={`px-2 py-1.5 rounded-full whitespace-nowrap text-sm text-center ${
                  selectedGenres.includes(genre) ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>취소</Button>
          <Button
            onClick={handleDialogConfirm}
            variant="contained"
            color="primary"
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
