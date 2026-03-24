import { useCallback, useRef } from "react";

/**
 * useDebouncedCallback hook
 * @param callback 디바운싱할 함수
 * @param delay 지연 시간(ms)
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // 이전 타이머가 있으면 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 새로운 타이머 설정
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  return debouncedCallback;
}
