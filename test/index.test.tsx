import React, { useState } from 'react';
import clipboardCopy from 'clipboard-copy';
import { cleanup, renderHook } from 'react-hooks-testing-library';
import { render, fireEvent } from 'react-testing-library';
import { useClipboard } from '../src';

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
  jest.useRealTimers();
});

describe('useClipboard', () => {
  it('returns correct API', () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current).toEqual({
      copied: false,
      copy: expect.any(Function),
      isSupported: expect.any(Function),
      target: {
        current: null,
      },
    });
  });

  it('calls clipboard-copy with the ref value', () => {
    const { result } = renderHook(() => useClipboard());
    render(<input ref={result.current.target} defaultValue="test" />);
    result.current.copy();
    expect(clipboardCopy).toHaveBeenCalledWith('test');
  });

  it('calls clipboard-copy with the specified value', () => {
    const { result } = renderHook(() => useClipboard());
    result.current.copy('test');
    expect(clipboardCopy).toHaveBeenCalledWith('test');
  });

  it('calls onSuccess when copy is successful', (done) => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useClipboard({ onSuccess }));
    render(<input ref={result.current.target} defaultValue="test" />);
    result.current.copy();
    setTimeout(() => {
      expect(onSuccess).toHaveBeenCalled();
      done();
    });
  });

  it('calls onSuccess with latest closure', async () => {
    const successFn = jest.fn();

    function Component() {
      const [value, setValue] = useState(0);
      const { target, copy } = useClipboard({
        onSuccess: () => successFn(value),
      });
      return (
        <>
          <input ref={target} />
          <button data-testid="copy" onClick={copy} />
          <button data-testid="increment" onClick={() => setValue(value + 1)} />
        </>
      );
    }

    const { findByTestId } = render(<Component />);

    const copyBtn = await findByTestId('copy');
    const incrementBtn = await findByTestId('increment');

    fireEvent.click(copyBtn as Element);
    await new Promise(process.nextTick);
    expect(successFn).toHaveBeenLastCalledWith(0);

    fireEvent.click(incrementBtn as Element);

    fireEvent.click(copyBtn as Element);
    await new Promise(process.nextTick);
    expect(successFn).toHaveBeenLastCalledWith(1);
  });

  it('selects the target input on copy', (done) => {
    const { result } = renderHook(() => useClipboard({ selectOnCopy: true }));
    const { container } = render(
      <input ref={result.current.target} defaultValue="test" />,
    );
    result.current.copy();
    setTimeout(() => {
      const input: HTMLInputElement = container.firstChild as any;
      expect(input.selectionEnd).toBe(4);
      done();
    });
  });

  it('checks for clipboard browser support', () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.isSupported()).toBe(true);
    jest.spyOn(document, 'queryCommandSupported').mockReturnValueOnce(false);
    expect(result.current.isSupported()).toBe(false);
  });

  it('updates copied state', async () => {
    jest.useFakeTimers();
    const { result, waitForNextUpdate } = renderHook(() =>
      useClipboard({ copiedTimeout: 1000 }),
    );

    expect(result.current.copied).toBe(false);
    result.current.copy('test');

    await waitForNextUpdate();
    expect(result.current.copied).toBe(true);

    jest.advanceTimersByTime(500);
    expect(result.current.copied).toBe(true);

    jest.advanceTimersByTime(500);
    expect(result.current.copied).toBe(false);
  });

  describe('error handling', () => {
    let commandExec: jest.SpyInstance;

    beforeEach(() => {
      commandExec = jest.spyOn(document, 'execCommand');
      commandExec.mockImplementation(() => {
        throw new Error();
      });
    });

    afterEach(() => {
      commandExec.mockRestore();
    });

    it('calls onError when copy fails', (done) => {
      const onError = jest.fn(() => {
        expect(onError).toHaveBeenCalled();
        done();
      });
      const { result } = renderHook(() => useClipboard({ onError }));
      render(<input ref={result.current.target} defaultValue="test" />);
      result.current.copy();
    });

    it('selects an input on error', (done) => {
      const { result } = renderHook(() => useClipboard());
      const { container } = render(
        <input ref={result.current.target} defaultValue="test" />,
      );
      result.current.copy();
      setTimeout(() => {
        const input: HTMLInputElement = container.firstChild as any;
        expect(input.selectionEnd).toBe(4);
        done();
      });
    });
  });
});
