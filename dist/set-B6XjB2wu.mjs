import { s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { r as logConfigUpdated } from "./logging-CTh_T0q8.mjs";
import { d as updateDefaultModelPrimaryConfig } from "./shared-Ck_WZImY.mjs";
//#region src/commands/models/set.ts
async function modelsSetCommand(modelRaw, runtime, field = "model") {
	const repair = field === "model" ? (await import("./runtime-plugin-install-C2kmPBmi.mjs")).repairModelSelectionRuntimePlugins : void 0;
	const { updated, warning: catalogWarning } = await updateDefaultModelPrimaryConfig({
		modelRaw,
		field
	});
	if (catalogWarning) runtime.error?.(catalogWarning);
	const selectedModel = resolveAgentModelPrimaryValue(updated.agents?.defaults?.[field]) ?? modelRaw;
	const warnings = repair ? await repair({
		cfg: updated,
		model: selectedModel
	}) : [];
	for (const warning of warnings) runtime.error?.(warning);
	logConfigUpdated(runtime);
	runtime.log(`${field === "model" ? "Default" : "Image"} model: ${selectedModel}`);
}
//#endregion
export { modelsSetCommand };
