import i18n from '@base/i18n';

export function changeLanguage(value: string): void {
  if (value) {
    document.querySelector('html')?.setAttribute('lang', value);
  }
  i18n.changeLanguage(value).catch(() => {
    // 에러를 적절히 처리하거나 무시
    // 필요한 경우 여기에 에러 로깅 서비스를 사용할 수 있습니다
  });
}
