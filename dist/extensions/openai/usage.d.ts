import { o as ProviderUsageSnapshot } from "../../provider-usage.types-wjE6UjsI.js";
import { Jt as ProviderResolveUsageAuthContext, Ot as ProviderFetchUsageSnapshotContext, Xt as ProviderResolvedUsageAuth } from "../../plugin-entry-L7QTXRH5.js";

//#region extensions/openai/usage.d.ts
declare function fetchOpenAIAdminUsage(params: {
  apiKey: string;
  projectId?: string;
  timeoutMs: number;
  fetchFn: typeof fetch;
  now?: number;
  periodDays?: number;
}): Promise<ProviderUsageSnapshot>;
declare function resolveOpenAIUsageAuth(ctx: ProviderResolveUsageAuthContext): Promise<ProviderResolvedUsageAuth>;
declare function fetchOpenAIUsage(ctx: ProviderFetchUsageSnapshotContext): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchOpenAIAdminUsage, fetchOpenAIUsage, resolveOpenAIUsageAuth };