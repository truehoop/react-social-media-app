import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

import BookImageUploader from './BookImageUploader';

interface BookRegisterFormProps {
  author: string;
  closeGenreDialog: () => void;
  confirmGenreDialog: () => void;
  condition: string;
  description: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  GENRES: string[];
  genreDialogOpen: boolean;
  handleGenreToggle: (genre: string) => void;
  handleRegister: () => void;
  images: string[];
  isSearching: boolean;
  onAddImage: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  onBookSearch: () => void;
  onImageUploadClick: () => void;
  onRemoveImage: (idx: number) => void;
  openGenreDialog: () => void;
  searchQuery: string;
  selectedGenres: string[];
  setAuthor: (value: string) => void;
  setCondition: (value: string) => void;
  setDescription: (value: string) => void;
  setSearchQuery: (value: string) => void;
  setTempGenres: (genres: string[]) => void;
  setTitle: (value: string) => void;
  setWish: (value: string) => void;
  tempGenres: string[];
  title: string;
  wish: string;
}

export default function BookRegisterForm({
  author,
  closeGenreDialog,
  confirmGenreDialog,
  condition,
  description,
  fileInputRef,
  GENRES,
  genreDialogOpen,
  handleGenreToggle,
  handleRegister,
  images,
  isSearching,
  onAddImage,
  onBookSearch,
  onImageUploadClick,
  onRemoveImage,
  openGenreDialog,
  searchQuery,
  selectedGenres,
  setAuthor,
  setCondition,
  setDescription,
  setSearchQuery,
  setTempGenres,
  setTitle,
  setWish,
  tempGenres,
  title,
  wish,
}: BookRegisterFormProps) {
  const conditions = ['최상', '상', '중', '하'];

  return (
    <>
      <Paper
        elevation={3}
        sx={{ borderRadius: 3, p: { xs: 2, sm: 4 }, mb: 4 }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          도서 정보 입력
        </Typography>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <TextField
              fullWidth
              label="도서명 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서명을 입력하세요"
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={onBookSearch}
              disabled={isSearching}
              sx={{ minWidth: 100, height: 40 }}
            >
              {isSearching ? '검색 중...' : '도서 검색'}
            </Button>
          </Stack>
          <TextField
            fullWidth
            label="도서명"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="저자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            select
            label="도서 상태"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            variant="outlined"
            size="small"
          >
            {conditions.map((option) => (
              <MenuItem
                key={option}
                value={option}
              >
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="도서 설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            size="small"
          />
          <TextField
            fullWidth
            label="희망 교환 도서"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            variant="outlined"
            multiline
            rows={2}
            placeholder="희망하는 교환 도서가 있다면 입력해주세요"
            size="small"
          />
          <Button
            variant="outlined"
            onClick={openGenreDialog}
            sx={{ mt: 2 }}
          >
            장르 선택 ({selectedGenres.length}/2)
          </Button>
          <BookImageUploader
            images={images}
            onAddImage={onAddImage}
            onImageUploadClick={onImageUploadClick}
            onRemoveImage={onRemoveImage}
            fileInputRef={fileInputRef}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            sx={{ mt: 2 }}
            fullWidth
          >
            도서 등록하기
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={genreDialogOpen}
        onClose={closeGenreDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>장르 선택 (최대 2개)</DialogTitle>
        <DialogContent>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 2 }}
          >
            {GENRES.map((genre) => (
              <Button
                key={genre}
                variant={tempGenres.includes(genre) ? 'contained' : 'outlined'}
                onClick={() => handleGenreToggle(genre)}
                disabled={!tempGenres.includes(genre) && tempGenres.length >= 2}
                sx={{ mb: 1 }}
              >
                {genre}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeGenreDialog}>취소</Button>
          <Button
            onClick={confirmGenreDialog}
            variant="contained"
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
