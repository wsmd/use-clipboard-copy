import copy from 'clipboard-copy';

import { useCallback, useMemo, useRef } from 'react';
import { useTimedToggle } from './useTimedToggle';

interface UseClipboardOptions {
  copiedTimeout?: number;
  onSuccess?: () => void;
  onError?: () => void;
}

interface ClipboardAPI {
  copied: boolean;
  copy: (text?: string) => void;
  target: React.MutableRefObject<
    HTMLInputElement | HTMLTextAreaElement | undefined
  >;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const [copied, toggleCopied] = useTimedToggle(false);

  const targetRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

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

  const copyHandler = useCallback((text?: string | React.SyntheticEvent) => {
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
    target: targetRef as React.RefObject<any>,
  };
}
