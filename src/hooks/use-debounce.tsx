import { useState, useEffect } from "react";

/**
 * useDebounce hook
 * @param value 디바운싱할 값
 * @param delay 지연 시간(ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup (새로운 값이 들어오면 타이머 초기화)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
