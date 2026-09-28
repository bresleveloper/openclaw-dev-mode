import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/memory-core/src/memory/background-context.ts
const runInMemoryBackgroundContext = AsyncLocalStorage.snapshot();
//#endregion
export { runInMemoryBackgroundContext as t };
