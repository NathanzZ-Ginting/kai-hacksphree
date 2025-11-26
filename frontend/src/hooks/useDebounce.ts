import { useState, useEffect } from "react";

// Custom hook to debounce a value
export const useDebounce = <T>(value: T, delay: number): T => {
  // State for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Update debounced value after delay
  useEffect(() => {
    // Set timeout to update debounced value
    const handler = setTimeout(() => {
      // Update debounced value
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // Return debounced value
  return debouncedValue;
};
