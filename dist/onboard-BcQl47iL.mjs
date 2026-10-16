import { f as createAliasOnlyPresetAppliers } from "./provider-onboard-CF3Sw4qH.mjs";
//#region extensions/openrouter/onboard.ts
const OPENROUTER_DEFAULT_MODEL_REF = "openrouter/auto";
const { applyProviderConfig: applyOpenrouterProviderConfig, applyConfig: applyOpenrouterConfig } = createAliasOnlyPresetAppliers({
	modelRef: OPENROUTER_DEFAULT_MODEL_REF,
	alias: "OpenRouter"
});
//#endregion
export { applyOpenrouterConfig as n, applyOpenrouterProviderConfig as r, OPENROUTER_DEFAULT_MODEL_REF as t };
