import copy from 'clipboard-copy';

import { useCallback, useMemo, useRef } from 'react';
import { useTimedToggle } from './useTimedToggle';

interface UseClipboardOptions {
  copiedTimeout?: number;
  onSuccess?: () => void;
  onError?: () => void;
}

interface ClipboardAPI {
  readonly copied: boolean;
  readonly copy: (text?: string | any) => void;
  readonly isSupported: () => boolean;
  readonly target: React.RefObject<any>;
}

export function useClipboard(options: UseClipboardOptions = {}): ClipboardAPI {
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

  const copyHandler = useCallback((text?: any) => {
    if (typeof text === 'string') {
      handleCopy(text);
    } else if (targetRef.current) {
      handleCopy(targetRef.current.value);
    }
  }, []);

  const isSupported = useCallback(() => {
    return !!(
      navigator.clipboard ||
      (document.execCommand &&
        document.queryCommandSupported &&
        document.queryCommandSupported('copy'))
    );
  }, []);

  return {
    copied,
    copy: copyHandler,
    isSupported,
    target: targetRef,
  };
}
