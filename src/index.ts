import clipboardCopy from 'clipboard-copy';
import { useCallback, useRef } from 'react';
import { useTimedToggle } from './useTimedToggle';

export interface UseClipboardOptions {
  copiedTimeout?: number;
  onSuccess?: () => void;
  onError?: () => void;
  selectOnCopy?: boolean;
  selectOnError?: boolean;
}

export interface ClipboardAPI {
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
  const optionsRef = useRef<UseClipboardOptions>(options);
  optionsRef.current = options;

  function isSupported() {
    return (
      !!navigator.clipboard ||
      (typeof document.execCommand === 'function' &&
        typeof document.queryCommandSupported === 'function' &&
        document.queryCommandSupported('copy'))
    );
  }

  const copyHandler = useCallback((text?: any) => {
    const opts = optionsRef.current;
    const target = targetRef.current;

    function handleSuccess() {
      if (opts.onSuccess) {
        opts.onSuccess();
      }
      if (opts.copiedTimeout) {
        toggleCopied(opts.copiedTimeout);
      }
      if (opts.selectOnCopy && isInputLike(target)) {
        target.select();
      }
    }

    function handleError() {
      if (opts.onError) {
        opts.onError();
      }
      if (opts.selectOnError !== false && isInputLike(target)) {
        target.select();
      }
    }

    function copy(value: string) {
      clipboardCopy(value).then(handleSuccess).catch(handleError);
    }

    if (typeof text === 'string') {
      copy(text);
    } else if (target) {
      copy(target.value);
    }
  }, []);

  return {
    copied,
    copy: copyHandler,
    isSupported,
    target: targetRef,
  };
}
