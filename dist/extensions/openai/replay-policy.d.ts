import { Ht as ProviderReplayPolicyContext, Vt as ProviderReplayPolicy } from "../../plugin-entry-DpILbQ7M.js";

//#region extensions/openai/replay-policy.d.ts
/**
 * Returns the provider-owned replay policy for OpenAI-family transports.
 */
declare function buildOpenAIReplayPolicy(ctx: ProviderReplayPolicyContext): ProviderReplayPolicy;
//#endregion
export { buildOpenAIReplayPolicy };