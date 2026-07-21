import { o as ProviderUsageSnapshot } from "../../provider-usage.types-wjE6UjsI.js";

//#region extensions/clawrouter/usage.d.ts
declare function fetchClawRouterUsage(params: {
  token: string;
  baseUrl?: string;
  timeoutMs: number;
  fetchFn: typeof fetch;
}): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchClawRouterUsage };