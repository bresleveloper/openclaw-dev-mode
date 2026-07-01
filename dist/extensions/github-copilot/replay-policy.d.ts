import { s as AgentMessage } from "../../types-BoFHdU9q.js";
import { Zt as ProviderSanitizeReplayHistoryContext } from "../../plugin-entry-DpILbQ7M.js";

//#region extensions/github-copilot/replay-policy.d.ts
declare function stripCopilotAssistantThinkingMessages<T>(messages: T[]): T[];
declare function buildGithubCopilotReplayPolicy(modelId?: string): {
  dropThinkingBlocks: boolean;
} | {
  dropThinkingBlocks?: undefined;
};
declare function sanitizeGithubCopilotReplayHistory(ctx: ProviderSanitizeReplayHistoryContext): AgentMessage[];
//#endregion
export { buildGithubCopilotReplayPolicy, sanitizeGithubCopilotReplayHistory, stripCopilotAssistantThinkingMessages };