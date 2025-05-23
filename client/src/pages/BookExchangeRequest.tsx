import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, IconButton, TextField, Button, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import BookSearchDialog from '@components/bookRegister/BookSearchDialog';
import { searchBookByTitle } from '@helpers/api/books';
import { BookInfo } from '@helpers/types/api';

interface BookExchangeRequestProps {
  title: string;
  image: string;
  genres: string[];
  condition: string;
  status: string;
  registeredDate: string;
  id?: string;
}

const BOOK_CONDITIONS = [
  { value: '최상', label: '최상 - 새 책과 동일한 상태' },
  { value: '상', label: '상 - 약간의 사용 흔적만 있음' },
  { value: '중', label: '중 - 일반적인 사용 흔적 있음' },
  { value: '하', label: '하 - 많은 사용 흔적 있음' },
];

export default function BookExchangeRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.book as BookExchangeRequestProps;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BookInfo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exchangeBookTitle, setExchangeBookTitle] = useState('');
  const [exchangeBookAuthor, setExchangeBookAuthor] = useState('');
  const [exchangeBookCondition, setExchangeBookCondition] = useState('');
  const [exchangeBookDescription, setExchangeBookDescription] = useState('');

  if (!book) {
    return <Box className="p-8">도서 정보를 찾을 수 없습니다.</Box>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  // Kakao book search
  const handleBookSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await searchBookByTitle(searchQuery);
      setSearchResults(response.documents);
      setIsDialogOpen(true);
    } catch (error) {
      alert('도서 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // Book select from search dialog
  const handleBookSelect = (book: BookInfo) => {
    setExchangeBookTitle(book.title);
    setExchangeBookAuthor(book.authors.join(', '));
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement exchange request submission logic
    console.log({
      requestedBookId: book.id,
      exchangeBook: {
        title: exchangeBookTitle,
        author: exchangeBookAuthor,
        condition: exchangeBookCondition,
        description: exchangeBookDescription,
      },
    });
    navigate('/');
  };

  return (
    <Box className="min-h-screen bg-white">
      {/* Header */}
      <Box className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 bg-white z-10">
        <IconButton onClick={handleBack}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <span className="text-lg font-medium">교환 신청</span>
        <Box className="w-10" /> {/* Spacer for alignment */}
      </Box>

      <Box className="pt-16 pb-20">
        {/* Requested Book Info */}
        <Box className="bg-gray-50 p-4 mb-4">
          <h2 className="text-lg font-medium mb-2">교환 희망 도서</h2>
          <Box className="flex gap-4">
            <img
              src={book.image}
              alt={book.title}
              className="w-24 h-32 object-cover rounded-lg"
            />
            <Box>
              <h3 className="font-medium">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.genres.join(', ')}</p>
              <p className="text-sm text-gray-600">상태: {book.condition}</p>
            </Box>
          </Box>
        </Box>

        {/* Exchange Request Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4"
        >
          <h2 className="text-lg font-medium mb-4">교환할 도서 정보</h2>

          {/* Book Search */}
          <Box className="mb-4">
            <TextField
              fullWidth
              label="도서 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleBookSearch();
                }
              }}
              margin="normal"
              placeholder="도서 제목을 입력하세요"
            />
            <Button
              fullWidth
              variant="outlined"
              onClick={handleBookSearch}
              disabled={isSearching}
              sx={{ mt: 1 }}
            >
              {isSearching ? '검색 중...' : '도서 검색'}
            </Button>
          </Box>

          <TextField
            fullWidth
            label="도서 제목"
            value={exchangeBookTitle}
            onChange={(e) => setExchangeBookTitle(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="저자"
            value={exchangeBookAuthor}
            onChange={(e) => setExchangeBookAuthor(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="도서 상태"
            value={exchangeBookCondition}
            onChange={(e) => setExchangeBookCondition(e.target.value)}
            margin="normal"
            required
            select
            SelectProps={{
              native: false,
            }}
          >
            {BOOK_CONDITIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="도서 설명"
            value={exchangeBookDescription}
            onChange={(e) => setExchangeBookDescription(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
            placeholder="도서의 상태나 특이사항을 자세히 설명해주세요"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="mt-6"
            sx={{
              backgroundColor: '#2E7D32',
              '&:hover': {
                backgroundColor: '#1B5E20',
              },
            }}
          >
            교환 신청하기
          </Button>
        </form>
      </Box>

      <BookSearchDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        books={searchResults}
        onSelect={handleBookSelect}
      />
    </Box>
  );
}
