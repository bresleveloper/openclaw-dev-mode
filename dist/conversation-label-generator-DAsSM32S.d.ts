import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
//#region src/auto-reply/reply/conversation-label-generator.d.ts
/** Inputs for generating a short conversation label from the configured utility model. */
type ConversationLabelParams = {
  userMessage: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  agentHarnessRuntimeOverride?: string;
  modelRef?: string;
  timeoutMs?: number;
  maxLength?: number;
  abortSignal?: AbortSignal;
  assertCurrent?: () => void;
};
/** Generates a bounded human-readable label for a session, or null for empty output. */
declare function generateConversationLabel(params: ConversationLabelParams): Promise<string | null>;
//#endregion
export { generateConversationLabel as n, ConversationLabelParams as t };