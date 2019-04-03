import copy from 'clipboard-copy';
import { useCallback, useRef } from 'react';
import { useTimedToggle } from './useTimedToggle';

interface UseClipboardOptions {
  onSuccess?: () => void;
  onError?: () => void;
  selectStateTimeout?: number;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const [copied, toggleCopied] = useTimedToggle(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

  const handleCopy = useCallback((text: string) => {
    copy(text)
      .then(() => {
        if (options.selectStateTimeout) {
          toggleCopied(options.selectStateTimeout);
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

  return {
    copied,
    target() {
      return {
        ref: inputRef,
      };
    },
    trigger() {
      return {
        onClick: () => {
          if (inputRef.current) {
            handleCopy(inputRef.current!.value);
          }
        },
      };
    },
    copy(text?: string) {
      if (typeof text !== 'string') {
        if (inputRef.current) {
          handleCopy(inputRef.current.value);
        }
      } else {
        handleCopy(text);
      }
    },
  };
}
