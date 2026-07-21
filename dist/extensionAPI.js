import "./agent-scope-B2Pk_xhT.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import { S as loadSessionStore, g as saveSessionStore, v as updateSessionStore, y as updateSessionStoreEntry } from "./store-Cvp82S16.js";
import { a as resolveSessionFilePath, d as resolveStorePath } from "./paths-C2C4lJH6.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-tUPEe2Ur.js";
import "./model-selection-CFL1kjzt.js";
import { d as ensureAgentWorkspace } from "./workspace-BJm9kqLw.js";
import { n as resolveAgentTimeoutMs } from "./timeout-0Cw4kcol.js";
import "./sessions-BIAJdhW6.js";
import { n as resolveAgentIdentity } from "./identity-BfKoTsep.js";
import { t as runEmbeddedAgent } from "./embedded-agent-rBjsQK7b.js";
//#region src/extensionAPI.ts
if (process.env.VITEST !== "true" && process.env.OPENCLAW_SUPPRESS_EXTENSION_API_WARNING !== "1") process.emitWarning("openclaw/extension-api is deprecated. Migrate to api.runtime.agent.* or focused openclaw/plugin-sdk/<subpath> imports. See https://docs.openclaw.ai/plugins/sdk-migration", {
	code: "OPENCLAW_EXTENSION_API_DEPRECATED",
	detail: "This compatibility bridge is temporary. Bundled plugins should use the injected plugin runtime instead of importing host-side agent helpers directly. Migration guide: https://docs.openclaw.ai/plugins/sdk-migration"
});
//#endregion
export { DEFAULT_MODEL, DEFAULT_PROVIDER, ensureAgentWorkspace, loadSessionStore, resolveAgentDir, resolveAgentIdentity, resolveAgentTimeoutMs, resolveAgentWorkspaceDir, resolveSessionFilePath, resolveStorePath, resolveThinkingDefault, runEmbeddedAgent, runEmbeddedAgent as runEmbeddedPiAgent, saveSessionStore, updateSessionStore, updateSessionStoreEntry };
