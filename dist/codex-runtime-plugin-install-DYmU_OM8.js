import { a as modelSelectionShouldEnsureCodexPlugin } from "./openai-routing-DXJmS9CT.js";
import { t as createRuntimePluginModelSelectionHelpers } from "./runtime-plugin-install-BhYQVXyN.js";
//#region src/commands/codex-runtime-plugin-install.ts
const CODEX_RUNTIME_PLUGIN_ID = "codex";
const CODEX_RUNTIME_PLUGIN_LABEL = "Codex";
const codexRuntimePluginInstall = createRuntimePluginModelSelectionHelpers({
	descriptor: {
		pluginId: CODEX_RUNTIME_PLUGIN_ID,
		label: CODEX_RUNTIME_PLUGIN_LABEL,
		npmSpec: "@openclaw/codex",
		warningLabel: CODEX_RUNTIME_PLUGIN_LABEL
	},
	shouldEnsure: ({ cfg, model }) => modelSelectionShouldEnsureCodexPlugin({
		config: cfg,
		model
	})
});
const ensureCodexRuntimePluginForModelSelection = codexRuntimePluginInstall.ensure;
const repairCodexRuntimePluginInstallForModelSelection = codexRuntimePluginInstall.repair;
//#endregion
export { ensureCodexRuntimePluginForModelSelection as n, repairCodexRuntimePluginInstallForModelSelection as r, CODEX_RUNTIME_PLUGIN_ID as t };
