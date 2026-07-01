/** Context passed to fatal-error hooks before the process exits. */
type FatalErrorHookContext = {
    reason: string;
    error?: unknown;
};
/** Hook that can return one extra diagnostic line for fatal error output. */
type FatalErrorHook = (context: FatalErrorHookContext) => string | undefined | void;
/** Registers a fatal-error hook and returns an unsubscribe callback. */
export declare function registerFatalErrorHook(hook: FatalErrorHook): () => void;
/** Runs registered fatal-error hooks and returns non-empty diagnostic lines. */
export declare function runFatalErrorHooks(context: FatalErrorHookContext): string[];
/** Clears registered fatal-error hooks; test-only helper. */
export declare function resetFatalErrorHooksForTest(): void;
export {};
