Object.defineProperties(document, {
  execCommand: {
    value: jest.fn(),
  },
  queryCommandSupported: {
    value: jest.fn().mockReturnValue(true),
  },
});

export default jest.fn(
  (text: string) =>
    new Promise((resolve, reject) => {
      try {
        document.execCommand(text);
        resolve();
      } catch {
        reject();
      }
    }),
);
