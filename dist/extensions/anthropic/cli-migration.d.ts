import { i as OpenClawConfig } from "../../types.openclaw-DlpCUWMr.js";
import { jt as ProviderAuthResult } from "../../types-BVLQjFJF.js";
import { n as readClaudeCliCredentialsForSetup } from "../../cli-auth-seam-DCuRgeiE.js";
//#region extensions/anthropic/cli-migration.d.ts
type ClaudeCliCredential = NonNullable<ReturnType<typeof readClaudeCliCredentialsForSetup>>;
/** Build the config migration result for adopting Claude CLI-backed Anthropic defaults. */
declare function buildAnthropicCliMigrationResult(config: OpenClawConfig, credential?: ClaudeCliCredential | null): ProviderAuthResult;
//#endregion
export { buildAnthropicCliMigrationResult };