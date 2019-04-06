import { useEffect, useRef, useState } from 'react';

export function useTimedToggle(
  initialValue: boolean,
): [boolean, (timeout: number) => void] {
  const [value, setValue] = useState(false);
  const timeoutRef = useRef<number>();
  const initialValueRef = useRef(initialValue);

  const toggleValue = (timeout: number) => {
    clearTimeout(timeoutRef.current);
    setValue(!initialValueRef.current);
    timeoutRef.current = window.setTimeout(
      () => setValue(initialValueRef.current),
      timeout,
    );
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return [value, toggleValue];
}
