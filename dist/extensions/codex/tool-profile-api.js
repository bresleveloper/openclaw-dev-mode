import { p as readCodexPluginConfig } from "./.setup/config-parsing-BugaRTEy.mjs";
import { t as filterCodexDynamicTools } from "./.setup/dynamic-tool-profile-Cl_HKG4m.mjs";
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
// extensions/codex/tool-profile-api.ts
/** Projects supplied dynamic tools through the same policy used by Codex turns. */
function filterDynamicToolNames(names, config) {
	return filterCodexDynamicTools(names.map((name) => ({ name })), readCodexPluginConfig(resolvePluginConfigObject(config, "codex"))).map((tool) => tool.name);
}
export { filterDynamicToolNames };
