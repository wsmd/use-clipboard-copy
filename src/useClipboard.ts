import copy from 'clipboard-copy';

import { useCallback, useMemo, useRef } from 'react';
import { useTimedToggle } from './useTimedToggle';

interface UseClipboardOptions {
  onSuccess?: () => void;
  onError?: () => void;
  copiedStateTimeout?: number;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const [copied, toggleCopied] = useTimedToggle(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

  const handleCopy = useCallback((text: string) => {
    copy(text)
      .then(() => {
        if (options.copiedStateTimeout) {
          toggleCopied(options.copiedStateTimeout);
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

  const imperativeCopy = useCallback((text: string) => {
    if (typeof text !== 'string') {
      if (inputRef.current) {
        handleCopy(inputRef.current.value);
      }
    } else {
      handleCopy(text);
    }
  }, []);

  const targetProps = useMemo(() => {
    return {
      ref: inputRef,
    };
  }, []);

  const triggerProps = useMemo(() => {
    return {
      onClick: () => {
        if (inputRef.current) {
          handleCopy(inputRef.current.value);
        }
      },
    };
  }, []);

  return {
    copied,
    copy: imperativeCopy,
    target: () => targetProps,
    trigger: () => triggerProps,
  };
}
