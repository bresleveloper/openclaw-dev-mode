import "@openclaw/ai/diagnostics";
//#region src/infra/abort-signal.d.ts
/** Resolves when the signal aborts, or immediately when no wait is needed. */
declare function waitForAbortSignal(signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/infra/unhandled-rejections.d.ts
type UnhandledRejectionHandler = (reason: unknown) => boolean;
type UncaughtExceptionHandler = (error: unknown) => boolean;
declare function registerUnhandledRejectionHandler(handler: UnhandledRejectionHandler): () => void;
declare function registerUncaughtExceptionHandler(handler: UncaughtExceptionHandler): () => void;
//#endregion
export { registerUnhandledRejectionHandler as n, waitForAbortSignal as r, registerUncaughtExceptionHandler as t };