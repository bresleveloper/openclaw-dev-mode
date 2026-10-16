import { s as KILOCODE_DEFAULT_MODEL_REF, t as KILOCODE_BASE_URL } from "./.setup/provider-models-CplaZ4OM.mjs";
import { buildKilocodeProvider } from "./provider-catalog.js";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/kilocode/onboard.ts
const { applyConfig: applyKilocodeConfig } = createProviderConnectionPresetAppliers({
	primaryModelRef: KILOCODE_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "kilocode",
		api: "openai-completions",
		baseUrl: KILOCODE_BASE_URL,
		catalogModels: () => buildKilocodeProvider().models,
		aliases: [{
			modelRef: KILOCODE_DEFAULT_MODEL_REF,
			alias: "Kilo Gateway"
		}]
	})
});
//#endregion
export { KILOCODE_DEFAULT_MODEL_REF, applyKilocodeConfig };
