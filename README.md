<h1 align="center">
  <img src="https://user-images.githubusercontent.com/2100222/55596467-9c054980-5716-11e9-8723-b8c286fcd9e3.png" width="128">
  <br>
  use-clipboard-copy
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/use-clipboard-copy">
    <img src="https://img.shields.io/npm/v/use-clipboard-copy.svg" alt="Current Release" />
  </a>
  <a href="https://travis-ci.org/wsmd/use-clipboard-copy">
    <img src="https://travis-ci.org/wsmd/use-clipboard-copy.svg?branch=master" alt="CI Build">
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
- [Examples](#examples)
  - [Copying Text of Another Target Element](#copying-text-of-another-target-element)
  - [Displaying a temporary "copied" state](#displaying-a-temporary-copied-state)
  - [Copying Text Without a Target Element](#copying-text-without-a-target-element)
- [API](#api)
- [Browser Support](#browser-support)
- [Acknowledgements](#acknowledgements)
- [License](#license)

</p>
</details>

## Motivation

There are many copy-to-clipboard solutions for Javascript – really good solutions. Some of these solutions can feel out of place when it comes to implementing them with React... they do not feel very _React-y_.

`use-clipboard-copy` is a **lightweight** React hook that makes it possible to add a copy-to-clipboard functionality to your user interface with very little code! A simple implementation looks like this:

```js
function CopyText() {
  const clipboard = useClipboard();
  return (
    <>
      <input {...clipboard.target()} />
      <button {...clipboard.trigger()}>Copy</button>
    </>
  );
}
```

P.S. You can still do more with `use-clipboard-copy`. Keep reading!

## Getting Started

> _Warning: Please note that this is still under active development. The current API is experimental and likely to change in a future release. Use with caution!_

To get started, add `use-clipboard-copy` to your project:

```
npm install --save use-clipboard-copy
```

Please note that `use-clipboard-copy` requires `react@^16.8.0` as a peer dependency.

## Examples

### Copying Text of Another Target Element

A simple copy-to-clipboard interface can consist of two parts:

- The target: the element who holds the value to be copied.
- The trigger: the element that triggers the copy action.

```jsx
import { useClipboard } from 'use-clipboard-copy';

export default function PublicUrl({ url }) {
  const clipboard = useClipboard();
  return (
    <div>
      <input {...clipboard.target()} value={url} readOnly />
      <button {...clipboard.trigger()}>Copy Shareable Link</button>
    </div>
  );
}
```

### Displaying a temporary "copied" state

Sometimes it can be helpful to notify users that the text was successfully copied to the clipboard. For example, displaying a temporary "Copied" state after they trigger the copy action.

```jsx
import { useClipboard } from 'use-clipboard-copy';

export default function PublicUrl({ url }) {
  const clipboard = useClipboard({
    copiedTimeout: 600, // timeout duration in milliseconds
  });
  return (
    <div>
      <input {...clipboard.target()} value={url} readOnly />
      <button {...clipboard.trigger()}>
        {clipboard.copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  );
}
```

### Copying Text Without a Target Element

Some user interfaces might consist of only a simple copy-to-clipboard button without any values displayed to the user.

<!-- prettier-ignore -->
```jsx
import { useClipboard } from 'use-clipboard-copy';

export default function PublicUrl({ url }) {
  const clipboard = useClipboard();
  return (
    <button onClick={() => clipboard.copy(url)}>
      Copy Shareable Link
    </button>
  );
}
```

Use `clipboard.copy` as a way to perform copy-to-clipboard action imperatively. For example, an async copy-to-clipboard operation would look something like this:

<!-- prettier-ignore -->
```jsx
import { useClipboard } from 'use-clipboard-copy';

export default function PublicUrl({ id }) {
  const clipboard = useClipboard();

  const handleClick = React.useCallback(async () => {
    const url = await fakeAPI.getShareableLink(id);
    clipboard.copy(url);
  });

  return (
    <button onClick={handleClick}>Copy Shareable Link</button>
  );
}
```

## API

Still under active development...

## Browser Support

Chrome, Firefox, Edge, Safari, IE11.

## Acknowledgements

This hook is powered by [clipboard-copy](https://github.com/feross/clipboard-copy), the lightweight copy to clipboard for the web.

## License

MIT
