import { i as OpenClawConfig } from "../../types.openclaw-B5gtuEn_.js";
import { jt as ProviderAuthResult } from "../../types-BpDhk2ev.js";
import { n as readClaudeCliCredentialsForSetup } from "../../cli-auth-seam-jH8DVHJh.js";
//#region extensions/anthropic/cli-migration.d.ts
type ClaudeCliCredential = NonNullable<ReturnType<typeof readClaudeCliCredentialsForSetup>>;
/** Build the config migration result for adopting Claude CLI-backed Anthropic defaults. */
declare function buildAnthropicCliMigrationResult(config: OpenClawConfig, credential?: ClaudeCliCredential | null): ProviderAuthResult;
//#endregion
export { buildAnthropicCliMigrationResult };