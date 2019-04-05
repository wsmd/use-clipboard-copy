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

- [Getting Started](#getting-started)
- [Examples](#examples)
  - [Copy Text from Another Element](#copy-text-from-another-element)
- [License](#license)

</p>
</details>

## Getting Started

> _Warning: This is still under active development and the current API is experimental and likely to change in a future release. Use with caution!_

To get started, add `use-clipboard-copy` to your project:

```
npm install --save use-clipboard-copy
```

Please note that `use-clipboard-copy` requires `react@^16.8.0` as a peer dependency.

## Examples

### Copy Text from Another Element

```jsx
import { useClipboard } from 'use-clipboard-copy';

export default function CopyTextComponent({ value }) {
  const clipboard = useClipboard();
  return (
    <div>
      <input {...clipboard.target()} value="Hello, World!" readOnly />
      <button {...clipboard.trigger()}>Copy Text</button>
    </div>
  );
}
```

## License

MIT
