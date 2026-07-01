type UnknownRecord = Record<string, unknown>;
export type UnresolvedAgentTurnShellToolPromptKind = "commandPromptWithoutShellAccess" | "shellToolPrompt";
/** Return true when a cron payload contains legacy `openai-codex/*` model refs. */
export declare function hasLegacyOpenAICodexCronModelRef(payload: UnknownRecord): boolean;
/** Normalize legacy cron payload channel/provider and model reference fields in place. */
export declare function migrateLegacyCronPayload(payload: UnknownRecord): boolean;
export declare function migrateLegacyAgentTurnCommandPayload(payload: UnknownRecord): boolean;
export declare function classifyUnresolvedAgentTurnShellToolPrompt(payload: UnknownRecord): UnresolvedAgentTurnShellToolPromptKind | null;
export {};
