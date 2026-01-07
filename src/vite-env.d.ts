/// <reference types="vite/client" />

declare module 'monaco-editor/esm/vs/*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}
