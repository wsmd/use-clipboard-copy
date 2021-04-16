<h1 align="center">
  <img src="https://user-images.githubusercontent.com/2100222/55596467-9c054980-5716-11e9-8723-b8c286fcd9e3.png" width="128">
  <br>
  use-clipboard-copy
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/use-clipboard-copy">
    <img src="https://img.shields.io/npm/v/use-clipboard-copy.svg" alt="Current Release" />
  </a>
  <a href="https://www.npmjs.com/package/use-clipboard-copy">
    <img src="https://badgen.net/npm/dt/use-clipboard-copy" alt="Downloads" />
  </a>
  <a href="https://travis-ci.org/wsmd/use-clipboard-copy">
    <img src="https://travis-ci.org/wsmd/use-clipboard-copy.svg?branch=master" alt="CI Build">
  </a>
  <a href='https://coveralls.io/github/wsmd/use-clipboard-copy?branch=master'>
    <img src='https://coveralls.io/repos/github/wsmd/use-clipboard-copy/badge.svg?branch=master' alt='Coverage Status' />
  </a>
  <a href="https://github.com/wsmd/use-clipboard-copy/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/wsmd/use-clipboard-copy.svg" alt="Licence">
  </a>
</p>

<details>
<summary>📖 Table of Contents</summary>
<p>

- [Motivation](#motivation)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Copying Text of Another Target Element](#copying-text-of-another-target-element)
  - [Copying Text Imperatively (Without a Target Element)](#copying-text-imperatively-without-a-target-element)
  - [Displaying a Temporary Success State](#displaying-a-temporary-success-state)
  - [Handling Success and Errors](#handling-success-and-errors)
- [Browser Support](#browser-support)
- [API](#api)
  - [`useClipboard(options?: UseClipboardOptions): ClipboardAPI`](#useclipboardoptions-useclipboardoptions-clipboardapi)
  - [`UseClipboardOptions`](#useclipboardoptions)
    - [`copiedTimeout?: number`](#copiedtimeout-number)
    - [`onSuccess?: () => void`](#onsuccess---void)
    - [`onError?: () => void`](#onerror---void)
    - [`selectOnCopy?: boolean`](#selectoncopy-boolean)
    - [`selectOnError?: boolean`](#selectonerror-boolean)
  - [`ClipboardAPI`](#clipboardapi)
    - [`copy: (text?: string) => void`](#copy-text-string--void)
    - [`target: React.RefObject<any>`](#target-reactrefobjectany)
    - [`isSupported: () => boolean`](#issupported---boolean)
    - [`copied: boolean`](#copied-boolean)
- [Acknowledgements](#acknowledgements)
- [License](#license)

</p>
</details>

## Motivation

There are various copy-to-clipboard solutions for Javascript – really good ones, but getting them to work with React can feel a little odd... they don't feel very _React-y_.

`use-clipboard-copy` is a **lightweight** (< 1KB) React hook that makes it possible to add a copy-to-clipboard functionality to your React application with very little code! A simple implementation looks like this:

```js
function CopyText() {
  const clipboard = useClipboard();
  return (
    <div>
      <input ref={clipboard.target} />
      <button onClick={clipboard.copy}>Copy</button>
    </div>
  );
}
```

P.S. You can do more than that with `use-clipboard-copy`. Keep reading!

## Getting Started

To get started, add `use-clipboard-copy` to your project:

```
npm install --save use-clipboard-copy
```

Please note that `use-clipboard-copy` requires `react@^16.8.0` as a peer dependency.

## Usage

### Copying Text of Another Target Element

A simple copy-to-clipboard interface consists of two parts:

- The `target`, an element who holds the value to be copied, usually an input.
- The `copy` action.

```jsx
import { useClipboard } from 'use-clipboard-copy';

export default function PublicUrl({ url }) {
  const clipboard = useClipboard();
  return (
    <div>
      <input ref={clipboard.target} value={url} readOnly />
      <button onClick={clipboard.copy}>Copy Link</button>
    </div>
  );
}
```

### Copying Text Imperatively (Without a Target Element)

It is also possible to perform a copy action imperatively (programmatically). For example, a copy-to-clipboard interface may consist of a single copy button without any additional inputs or values displayed to the user. By passing a string to the `clipboard.copy` action, the specified string will be copied to the clipboard.

```jsx
import { useClipboard } from 'use-clipboard-copy';

export default function PublicUrl({ id }) {
  const clipboard = useClipboard();

  const handleClick = React.useCallback(
    () => {
      const url = Utils.formatUrl({ query: { id } });
      clipboard.copy(url); // programmatically copying a value
    },
    [clipboard.copy, id]
  );

  return (
    <button onClick={handleClick}>Copy Link</button>
  );
}
```

### Displaying a Temporary Success State

Sometimes it can be helpful to notify the user that the text was successfully copied to the clipboard, usually by displaying a temporary "Copied" state after they trigger the copy action.

By passing the `copiedTimeout` option to `useClipboard()`, you can use `clipboard.copied` as a way to toggle the copied state in the UI.

```jsx
import { useClipboard } from 'use-clipboard-copy';

export default function PublicUrl({ url }) {
  const clipboard = useClipboard({
    copiedTimeout: 600, // timeout duration in milliseconds
  });
  return (
    <div>
      <input ref={clipboard.target} value={url} readOnly />
      <button onClick={clipboard.copy}>
        {clipboard.copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  );
}
```

### Handling Success and Errors

Copy to clipboard in browsers can be tricky some times - there are various reasons that can contribute to preventing the copy action from working. Therefore, you should always handle such cases.

By passing an `onSuccess` and `onError` callbacks to the `useClipboard` options, you will be able to handle whether the `copy` action was performed successfully.

```js
function CopyText() {
  const clipboard = useClipboard({
    onSuccess() {
      console.log('Text was copied successfully!')
    },
    onError() {
      console.log('Failed to copy text!')
    }
  });
  return (
    <div>
      <input ref={clipboard.target} />
      <button onClick={clipboard.copy}>Copy</button>
    </div>
  );
}
```

In case the `copy` action fails, `useClipboard` will handle that gracefully by selecting the `target` input instead so that users can copy the text manually. This behavior can be disabled by passing `selectOnError: false` to the clipboard options.

## Browser Support

`use-clipboard-copy` is supported in all browsers that [supports the native clipboard APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard), including major browsers such as **Chrome, Firefox, Edge, Safari, IE11**.

This hook provides an `isSupported` method that you can use to check for browser support and update the UI accordingly:

```jsx
function ClipboardSupport() {
  const clipboard = useClipboard();
  return (
    <div>
      {clipboard.isSupported()
        ? "yay! copy-to-clipboard is supported"
        : "meh. copy-to-clipboard is not supported"}
    </div>
  );
}
```



## API

### `useClipboard(options?: UseClipboardOptions): ClipboardAPI`

`use-clipboard-copy` exposes a named export `useClipboard` which is the hook function itself. It takes an optional options object, and returns an object to control the clipboard.

```js
import { useClipboard } from 'use-clipboard-copy';

function CopyText() {
  const clipboard = useClipboard();
  return (
    // ...
  );
}
```

### `UseClipboardOptions`

`useClipboard` takes an optional object with the following properties:

- [`copiedTimeout?: number`](#copiedtimeout-number)
- [`onSuccess?: () => void`](#onsuccess---void)
- [`onError?: () => void`](#onerror---void)
- [`selectOnCopy?: boolean`](#selectoncopy-boolean)
- [`selectOnError?: boolean`](#selectonerror-boolean)

#### `copiedTimeout?: number`

The duration in milliseconds used to toggled the [`copied`](#copied-boolean) state upon a successful copy action.

#### `onSuccess?: () => void`

A callback function that will be called upon a successful copy action.

#### `onError?: () => void`

A callback function that will be called when the copy action fails.

#### `selectOnCopy?: boolean`

Defaults to `false`.

A boolean indicating whether the text of the [`target`](#target-reactrefobjectany) element (if set) will be selected upon a successful copy action.

#### `selectOnError?: boolean`

Defaults to `true`.

A boolean indicating whether the text of the [`target`](#target-reactrefobjectany) element (if set) will be selected when the copy action fails.

### `ClipboardAPI`

`useClipboard` returns an object with the following properties:

- [`copied: boolean`](#copied-boolean)
- [`copy: (text?: string) => void`](#copy-text-string--void)
- [`isSupported: () => boolean`](#issupported---boolean)
- [`target: React.RefObject<any>`](#target-reactrefobjectany)

#### `copy: (text?: string) => void`

A method that will be used to preform the copy action. If it's used without passing a string, the `copy` action will use the text of the [`target`](#target-reactrefobjectany) element (if set).

```jsx
<input ref={clipboard.target} value="a text to copy" />;
<button onClick={clipboard.copy} />;
```

Optionally, `copy` takes a `string` to perform the copy action imperatively (programmatically). When this is used, the [`target`](#target-reactrefobjectany) element (if set) will be ignored.

```jsx
<button onClick={() => clipboard.copy('a text to copy')} />;
```

#### `target: React.RefObject<any>`

A React Ref object used on input and textarea elements that holds the text to be copied.

```jsx
<input ref={clipboard.target} value="a text to copy" />;
```

#### `isSupported: () => boolean`

A function that returns a boolean indicating whether the browser supports the clipboard APIs. Useful to deterministically update the UI if the browser does not support the clipboard functionality for whatever reason.

#### `copied: boolean`

A boolean indicating whether the copy action was just performed. Must be used with the [`copiedTimeout`](#copiedtimeout-number) option. Useful to update the UI to display temporary success state.

## Acknowledgements

This hook is powered by [clipboard-copy](https://github.com/feross/clipboard-copy), the lightweight copy to clipboard for the web.

## License

MIT
