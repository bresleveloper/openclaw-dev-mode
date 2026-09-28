import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { r as createCodexAppServerConfig } from "./config-options-BvaRs51b.mjs";
import { resolveProviderIdForAuth } from "openclaw/plugin-sdk/provider-auth-aliases";
//#region extensions/codex/src/app-server/config-runtime.ts
var config_runtime_exports = /* @__PURE__ */ __exportAll({
	resolveCodexAppServerRuntimeOptions: () => resolveCodexAppServerRuntimeOptions,
	resolveCodexSupervisionAppServerRuntimeOptions: () => resolveCodexSupervisionAppServerRuntimeOptions
});
const { resolveCodexAppServerRuntimeOptions, resolveCodexSupervisionAppServerRuntimeOptions } = createCodexAppServerConfig({ resolveProviderIdForAuth });
//#endregion
export { resolveCodexAppServerRuntimeOptions as n, resolveCodexSupervisionAppServerRuntimeOptions as r, config_runtime_exports as t };
