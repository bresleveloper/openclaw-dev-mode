import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { r as logConfigUpdated } from "./logging-BBc-wU1i.mjs";
import { d as updateDefaultModelPrimaryConfig } from "./shared-CiQX6hqA.mjs";
import { a as repairCopilotRuntimePluginInstallForModelSelection, i as repairCodexRuntimePluginInstallForModelSelection } from "./runtime-plugin-install-aqHZuKKo.mjs";
import "./codex-runtime-plugin-install-DnyB6qHS.mjs";
import "./copilot-runtime-plugin-install-DnyB6qHS.mjs";
//#region src/commands/models/set.ts
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
