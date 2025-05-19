declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (options: { redirectUri: string; scope?: string }) => void;
        login: (options: { success: (authObj: any) => void; fail: (err: any) => void; throughTalk?: boolean }) => void;
        getStatusInfo: (callback: (status: any) => void) => void;
        setAccessToken: (token: string) => void;
      };
      API: {
        request: (options: { url: string; success: (res: any) => void; fail: (err: any) => void }) => void;
      };
    };
  }
}

export const initializeKakaoSDK = () => {
  const kakaoAppKey = process.env.REACT_APP_KAKAO_JS_KEY;
  if (!kakaoAppKey) {
    console.error('Kakao App Key is not defined');
    return;
  }

  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoAppKey);
    console.log('Kakao SDK initialized');
  }
};

export const loadKakaoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Kakao?.isInitialized()) {
      resolve();
      return;
    }

    const kakaoAppKey = process.env.REACT_APP_KAKAO_JS_KEY;
    if (!kakaoAppKey) {
      reject(new Error('Kakao App Key is not defined'));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    script.onload = () => {
      window.Kakao.init(kakaoAppKey);
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load Kakao SDK'));
    };
    document.head.appendChild(script);
  });
};
