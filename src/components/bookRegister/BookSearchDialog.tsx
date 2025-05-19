import { Dialog, DialogTitle, DialogContent, Card, CardContent, CardMedia, Typography, Box, Chip, Button, Stack } from '@mui/material';
import React from 'react';

import { BookInfo } from '@helpers/types/api';

interface BookSearchDialogProps {
  open: boolean;
  onClose: () => void;
  books: BookInfo[];
  onSelect: (book: BookInfo) => void;
}

export default function BookSearchDialog({ open, onClose, books, onSelect }: BookSearchDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        도서 검색 결과{' '}
        <Typography
          component="span"
          color="primary"
        >
          ({books.length}건)
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {books.map((book) => (
            <Card
              key={book.isbn}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: 2,
                borderRadius: 2,
                '&:hover': { boxShadow: 6, borderColor: 'primary.main' },
                border: 1,
                borderColor: 'grey.200',
              }}
              onClick={() => onSelect(book)}
            >
              <CardMedia
                component="img"
                image={book.thumbnail}
                alt={book.title}
                sx={{ width: 60, height: 80, borderRadius: 1, m: 1 }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                >
                  {book.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {book.authors.join(', ')} | {book.publisher}
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={`${book.price.toLocaleString()}원`}
                    size="small"
                    color="primary"
                  />
                  <Chip
                    label={book.status}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Box
          mt={2}
          textAlign="right"
        >
          <Button
            onClick={onClose}
            variant="outlined"
          >
            닫기
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
