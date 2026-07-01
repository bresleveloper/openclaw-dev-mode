import type { OpenClawConfig } from "../../../config/types.openclaw.js";
export { normalizeLegacyTalkConfig } from "./legacy-talk-config-normalizer.js";
/** Remove deprecated command config keys that no runtime reads anymore. */
export declare function normalizeLegacyCommandsConfig(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Migrate legacy browser/Chrome relay config to current browser profile settings. */
export declare function normalizeLegacyBrowserConfig(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Move single-account channel fields into accounts.default when account maps exist. */
export declare function seedMissingDefaultAccountsFromSingleAccountBase(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Move legacy runtime-tagged model/provider refs onto current agentRuntime policy fields. */
export declare function normalizeLegacyRuntimeModelRefs(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Add missing metadata source markers to legacy OpenAI Codex model catalog entries. */
export declare function normalizeLegacyOpenAICodexModelsAddMetadata(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Rename legacy OpenAI API identifiers to the current completion/chat API ids. */
export declare function normalizeLegacyOpenAIModelProviderApi(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Remove retired bundled nano-banana skill config after migrating image generation models. */
export declare function normalizeLegacyNanoBananaSkill(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Move legacy cross-context send boolean into explicit message crossContext policy. */
export declare function normalizeLegacyCrossContextMessageConfig(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Move legacy media provider option aliases into providerOptions maps. */
export declare function normalizeLegacyMediaProviderOptions(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Seed native Ollama num_ctx params from legacy context-token budgets. */
export declare function normalizeLegacyOllamaNativeNumCtxParams(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
/** Normalize stale Mistral model defaults such as prompt-cache read cost. */
export declare function normalizeLegacyMistralModelDefaults(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
