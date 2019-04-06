import copy from 'clipboard-copy';

import { useCallback, useMemo, useRef } from 'react';
import { useTimedToggle } from './useTimedToggle';

interface UseClipboardOptions {
  onSuccess?: () => void;
  onError?: () => void;
  copiedTimeout?: number;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const [copied, toggleCopied] = useTimedToggle(false);

  const targetRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

  const handleCopy = useCallback((text: string) => {
    copy(text)
      .then(() => {
        if (options.copiedTimeout) {
          toggleCopied(options.copiedTimeout);
        }
        if (options.onSuccess) {
          options.onSuccess();
        }
      })
      .catch(() => {
        if (options.onError) {
          options.onError();
        }
      });
  }, []);

  const copyHandler = useCallback((text: string) => {
    if (typeof text !== 'string') {
      if (targetRef.current) {
        handleCopy(targetRef.current.value);
      }
    } else {
      handleCopy(text);
    }
  }, []);

  return {
    copied,
    copy: copyHandler,
    target: targetRef,
  };
}
