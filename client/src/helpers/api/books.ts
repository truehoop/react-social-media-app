import { BookInfo } from '@helpers/types/api';

interface KakaoBookResponse {
  documents: BookInfo[];
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
}

export async function searchBookByTitle(title: string): Promise<KakaoBookResponse> {
  const apiKey = process.env.REACT_APP_KAKAO_API_KEY;
  if (!apiKey) {
    throw new Error('Kakao API key is not set');
  }

  const encodedTitle = encodeURIComponent(title);
  const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${encodedTitle}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}
