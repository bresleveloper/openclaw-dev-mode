import "@openclaw/ai/diagnostics";
/** Resolves on abort or when `until` settles; passing the source releases abandoned listeners. */
declare function waitForAbortSignal(signal?: AbortSignal, until?: Promise<unknown>): Promise<void>;
type ErrorHandler = (error: unknown) => boolean;
declare function registerUnhandledRejectionHandler(handler: ErrorHandler): () => void;
declare function registerUncaughtExceptionHandler(handler: ErrorHandler): () => void;
export { registerUnhandledRejectionHandler as n, waitForAbortSignal as r, registerUncaughtExceptionHandler as t };