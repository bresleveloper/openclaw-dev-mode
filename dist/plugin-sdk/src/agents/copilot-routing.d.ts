/**
 * Decides when a GitHub Copilot model selection should install the Copilot
 * runtime plugin instead of using the built-in provider path.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Returns true when the selected model should trigger the external
 * `@openclaw/copilot` runtime plugin install.
 *
 * Gating contract (review #2, P1):
 *   - Model ref must use the `github-copilot/*` provider prefix.
 *   - The user's config must explicitly opt in by setting
 *     `agentRuntime.id: "copilot"` at the provider, model, or agent scope
 *     (resolved via `resolveModelRuntimePolicy`).
 *
 * Without the explicit opt-in we fall through to the built-in GitHub
 * Copilot provider, which has shipped support for `github-copilot/*`
 * models for a long time and must not install the runtime plugin for
 * users who never asked for it.
 */
export declare function modelSelectionShouldEnsureCopilotRuntimePlugin(params: {
    model?: string;
    config?: OpenClawConfig;
}): boolean;
