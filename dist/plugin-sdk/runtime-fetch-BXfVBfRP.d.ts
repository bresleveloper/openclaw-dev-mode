import { Dispatcher } from "undici";

//#region src/infra/net/runtime-fetch.d.ts
type DispatcherAwareRequestInit = RequestInit & {
  dispatcher?: Dispatcher;
};
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Returns true for Vitest-style mocked fetch functions that should stay injectable. */
declare function isMockedFetch(fetchImpl: FetchLike | undefined): boolean;
/** Uses the undici runtime fetch so callers can pass dispatcher-aware options. */
declare function fetchWithRuntimeDispatcher(input: RequestInfo | URL, init?: DispatcherAwareRequestInit): Promise<Response>;
/**
 * Uses test-injected global fetch when present, otherwise preserves dispatcher
 * support by routing through the undici runtime fetch.
 */
declare function fetchWithRuntimeDispatcherOrMockedGlobal(input: RequestInfo | URL, init?: DispatcherAwareRequestInit): Promise<Response>;
//#endregion
export { isMockedFetch as i, fetchWithRuntimeDispatcher as n, fetchWithRuntimeDispatcherOrMockedGlobal as r, DispatcherAwareRequestInit as t };