import type { Dispatcher } from "undici";
export type DispatcherAwareRequestInit = RequestInit & {
    dispatcher?: Dispatcher;
};
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Returns true for Vitest-style mocked fetch functions that should stay injectable. */
export declare function isMockedFetch(fetchImpl: FetchLike | undefined): boolean;
/** Uses the undici runtime fetch so callers can pass dispatcher-aware options. */
export declare function fetchWithRuntimeDispatcher(input: RequestInfo | URL, init?: DispatcherAwareRequestInit): Promise<Response>;
/**
 * Uses test-injected global fetch when present, otherwise preserves dispatcher
 * support by routing through the undici runtime fetch.
 */
export declare function fetchWithRuntimeDispatcherOrMockedGlobal(input: RequestInfo | URL, init?: DispatcherAwareRequestInit): Promise<Response>;
export {};
