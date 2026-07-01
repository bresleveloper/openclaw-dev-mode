import type { OpenClawConfig } from "./types.openclaw.js";
/**
 * Reports whether the default OpenAI route intentionally avoids the Codex plugin.
 *
 * Route-specific Codex selections still win; this only answers the missing-plugin
 * diagnostic question for OpenAI defaults and OpenAI-compatible proxy configs.
 */
export declare function configExplicitlyKeepsCodexUnavailableForOpenAi(cfg: OpenClawConfig): boolean;
/**
 * Suppresses missing Codex plugin diagnostics when config makes Codex optional.
 *
 * Explicitly enabled entries still warn so operator intent is honored even when
 * all default routes would otherwise stay on the OpenClaw runtime.
 */
export declare function shouldSuppressMissingCodexPluginDiagnostics(cfg: OpenClawConfig): boolean;
