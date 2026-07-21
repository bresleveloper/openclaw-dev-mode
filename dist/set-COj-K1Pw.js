import { i as resolveAgentModelPrimaryValue } from "./model-input-B5RmygIK.js";
import { r as logConfigUpdated } from "./logging-Bmyw9sby.js";
import { d as updateConfig, t as applyDefaultModelPrimaryUpdate } from "./shared-BPNNLkzQ.js";
import { r as repairCodexRuntimePluginInstallForModelSelection } from "./codex-runtime-plugin-install-DYmU_OM8.js";
import { n as repairCopilotRuntimePluginInstallForModelSelection } from "./copilot-runtime-plugin-install-AFEW34hG.js";
//#region src/commands/models/set.ts
/** Command for setting the default text model. */
/** Sets agents.defaults.model.primary and repairs provider runtime plugin installs when needed. */
async function modelsSetCommand(modelRaw, runtime) {
	const updated = await updateConfig((cfg, context) => {
		return applyDefaultModelPrimaryUpdate({
			cfg,
			resolveCfg: context.runtimeConfig,
			modelRaw,
			field: "model"
		});
	});
	const selectedModel = resolveAgentModelPrimaryValue(updated.agents?.defaults?.model) ?? modelRaw;
	const repaired = await repairCodexRuntimePluginInstallForModelSelection({
		cfg: updated,
		model: selectedModel
	});
	const copilotRepaired = await repairCopilotRuntimePluginInstallForModelSelection({
		cfg: updated,
		model: selectedModel
	});
	const warnings = [...repaired.warnings, ...copilotRepaired.warnings];
	for (const warning of warnings) runtime.error?.(warning);
	logConfigUpdated(runtime);
	runtime.log(`Default model: ${selectedModel}`);
}
//#endregion
export { modelsSetCommand };
