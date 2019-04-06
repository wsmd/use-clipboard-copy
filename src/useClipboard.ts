import copy from 'clipboard-copy';

import { useCallback, useRef } from 'react';
import { useTimedToggle } from './useTimedToggle';

interface UseClipboardOptions {
  copiedTimeout?: number;
  onSuccess?: () => void;
  onError?: () => void;
  selectOnCopy?: boolean;
  selectOnError?: boolean;
}

interface ClipboardAPI {
  readonly copied: boolean;
  readonly copy: (text?: string | any) => void;
  readonly isSupported: () => boolean;
  readonly target: React.RefObject<any>;
}

function isInputLike(
  node: any,
): node is HTMLInputElement | HTMLTextAreaElement {
  return node && (node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT');
}

export function useClipboard(options: UseClipboardOptions = {}): ClipboardAPI {
  const [copied, toggleCopied] = useTimedToggle(false);

  const targetRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  function clipboardCopy(text: string) {
    copy(text)
      .then(handleSuccess)
      .catch(handleError);
  }

  function handleSuccess() {
    if (options.onSuccess) {
      options.onSuccess();
    }
    if (options.copiedTimeout) {
      toggleCopied(options.copiedTimeout);
    }
    if (options.selectOnCopy && isInputLike(targetRef.current)) {
      targetRef.current.select();
    }
  }

  function handleError() {
    if (options.onError) {
      options.onError();
    }
    const selectOnError = options.selectOnError !== false;
    if (selectOnError && isInputLike(targetRef.current)) {
      targetRef.current.select();
    }
  }

  function isSupported() {
    return !!(
      navigator.clipboard ||
      (document.execCommand &&
        document.queryCommandSupported &&
        document.queryCommandSupported('copy'))
    );
  }

  const copyHandler = useCallback((text?: any) => {
    if (typeof text === 'string') {
      clipboardCopy(text);
    } else if (targetRef.current) {
      clipboardCopy(targetRef.current.value);
    }
  }, []);

  return {
    copied,
    copy: copyHandler,
    isSupported,
    target: targetRef,
  };
}
