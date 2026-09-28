import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { d as updateDefaultModelPrimaryConfig } from "./shared-yzzedLUF.mjs";
import { a as repairCopilotRuntimePluginInstallForModelSelection, i as repairCodexRuntimePluginInstallForModelSelection } from "./runtime-plugin-install-B0E7RQ_S.mjs";
import "./codex-runtime-plugin-install-DJjDc5z0.mjs";
import "./copilot-runtime-plugin-install-DJjDc5z0.mjs";
//#region src/commands/models/set.ts
/** Command for setting the default text model. */
/** Sets agents.defaults.model.primary and repairs provider runtime plugin installs when needed. */
async function modelsSetCommand(modelRaw, runtime) {
	const { updated, warning: catalogWarning } = await updateDefaultModelPrimaryConfig({
		modelRaw,
		field: "model"
	});
	if (catalogWarning) runtime.error?.(catalogWarning);
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
