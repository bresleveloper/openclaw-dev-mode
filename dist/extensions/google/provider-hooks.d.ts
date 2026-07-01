import { s as AgentMessage } from "../../types-BoFHdU9q.js";
import { Cu as ProviderThinkingProfile, In as ProviderSanitizeReplayHistoryContext, Sn as ProviderReplayPolicyContext, bn as ProviderReasoningOutputModeContext, xn as ProviderReplayPolicy, yn as ProviderReasoningOutputMode } from "../../types-BVLQjFJF.js";
import { Nt as ProviderNormalizeToolSchemasContext, a as AnyAgentTool, en as ProviderToolSchemaDiagnostic, wt as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-DpILbQ7M.js";
import { d as createGoogleThinkingStreamWrapper } from "../../provider-stream-shared-CmNDECbW.js";
//#region extensions/google/provider-hooks.d.ts
declare const GOOGLE_GEMINI_PROVIDER_HOOKS: {
  resolveThinkingProfile: (context: ProviderDefaultThinkingPolicyContext) => ProviderThinkingProfile | undefined;
  wrapStreamFn: typeof createGoogleThinkingStreamWrapper;
  normalizeToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => AnyAgentTool[];
  inspectToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[];
  buildReplayPolicy?: ((ctx: ProviderReplayPolicyContext) => ProviderReplayPolicy | null | undefined) | undefined;
  sanitizeReplayHistory?: ((ctx: ProviderSanitizeReplayHistoryContext) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined) | undefined;
  resolveReasoningOutputMode?: ((ctx: ProviderReasoningOutputModeContext) => ProviderReasoningOutputMode | null | undefined) | undefined;
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS };