import { useRef, useCallback } from 'react';

/**
 * Custom hook to prevent double trigger of a callback function
 * @param callback - The function to be protected from double trigger
 * @param delay - Delay in milliseconds before allowing the callback to be triggered again (default: 500ms)
 * @returns A wrapped callback function that prevents double triggering
 */
export function usePreventDoublePress<T extends (...args: any[]) => any>(
  callback?: T,
  delay: number = 500,
): T | undefined {
  const isProcessingRef = useRef(false);

  const handlePress = useCallback(
    (...args: Parameters<T>) => {
      if (isProcessingRef.current || !callback) return;

      isProcessingRef.current = true;
      callback(...args);

      // Reset after a delay to allow the action to complete
      setTimeout(() => {
        isProcessingRef.current = false;
      }, delay);
    },
    [callback, delay],
  );

  return callback ? (handlePress as T) : undefined;
}
