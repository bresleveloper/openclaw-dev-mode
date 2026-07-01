import type { ProviderUsageSnapshot, UsageProviderId } from "./provider-usage.types.js";
/** Fetches JSON-compatible provider usage endpoints with an abort timeout. */
export declare function fetchJson(url: string, init: RequestInit, timeoutMs: number, fetchFn: typeof fetch): Promise<Response>;
export declare function discardUsageResponseBody(response: Response): Promise<void>;
export declare function parseFiniteNumber(value: unknown): number | undefined;
type BuildUsageHttpErrorSnapshotOptions = {
    provider: UsageProviderId;
    status: number;
    message?: string;
    tokenExpiredStatuses?: readonly number[];
};
/** Builds a provider usage snapshot for non-HTTP fetch or parse failures. */
export declare function buildUsageErrorSnapshot(provider: UsageProviderId, error: string): ProviderUsageSnapshot;
export declare function buildUsageHttpErrorSnapshot(options: BuildUsageHttpErrorSnapshotOptions): ProviderUsageSnapshot;
export declare function readUsageJson(provider: UsageProviderId, response: Response): Promise<{
    ok: true;
    data: unknown;
} | {
    ok: false;
    snapshot: ProviderUsageSnapshot;
}>;
export {};
