import { a as resolveCodexAppServerRequestTimeoutMs, i as resolveCodexAppServerHomeScope, n as codexSandboxPolicyForTurn, o as resolveCodexAppServerStartOptionsForAgent, r as createCodexAppServerConfig, s as resolveCodexComputerUseConfig, t as codexAppServerStartOptionsKey } from "./config-options-ZyoXdPOW.mjs";
import { t as __exportAll } from "./session-binding-sidecars-DPQAWL9D.mjs";
import { resolveProviderIdForAuth } from "openclaw/plugin-sdk/provider-auth-aliases";
// extensions/codex/src/app-server/config-runtime.ts
var config_runtime_exports = /* @__PURE__ */ __exportAll({
	codexAppServerStartOptionsKey: () => codexAppServerStartOptionsKey,
	codexSandboxPolicyForTurn: () => codexSandboxPolicyForTurn,
	resolveCodexAppServerHomeScope: () => resolveCodexAppServerHomeScope,
	resolveCodexAppServerRequestTimeoutMs: () => resolveCodexAppServerRequestTimeoutMs,
	resolveCodexAppServerRuntimeOptions: () => resolveCodexAppServerRuntimeOptions,
	resolveCodexAppServerStartOptionsForAgent: () => resolveCodexAppServerStartOptionsForAgent,
	resolveCodexComputerUseConfig: () => resolveCodexComputerUseConfig,
	resolveCodexSupervisionAppServerRuntimeOptions: () => resolveCodexSupervisionAppServerRuntimeOptions
});
const { resolveCodexAppServerRuntimeOptions, resolveCodexSupervisionAppServerRuntimeOptions } = createCodexAppServerConfig({ resolveProviderIdForAuth });
export { resolveCodexAppServerRuntimeOptions as n, resolveCodexSupervisionAppServerRuntimeOptions as r, config_runtime_exports as t };
