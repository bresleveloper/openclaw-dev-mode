import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { r as logConfigUpdated } from "./logging-BBc-wU1i.mjs";
import { d as updateDefaultModelPrimaryConfig } from "./shared-CP4E7wPe.mjs";
//#region src/commands/models/set-image.ts
async function modelsSetImageCommand(modelRaw, runtime) {
	const { updated, warning } = await updateDefaultModelPrimaryConfig({
		modelRaw,
		field: "imageModel"
	});
	if (warning) runtime.error?.(warning);
	logConfigUpdated(runtime);
	runtime.log(`Image model: ${resolveAgentModelPrimaryValue(updated.agents?.defaults?.imageModel) ?? modelRaw}`);
}
//#endregion
export { modelsSetImageCommand };
