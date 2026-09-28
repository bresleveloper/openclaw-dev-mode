import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { d as updateDefaultModelPrimaryConfig } from "./shared-yzzedLUF.mjs";
//#region src/commands/models/set-image.ts
/** Command for setting the default image model. */
/** Sets agents.defaults.imageModel.primary after resolving aliases/catalog provider aliases. */
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
