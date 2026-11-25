import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-CE_cMy1x.mjs";
import { DEEPSEEK_BASE_URL, DEEPSEEK_MODEL_CATALOG } from "./models.js";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
// extensions/deepseek/onboard.ts
const DEEPSEEK_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "deepseek");
const { applyConfig: applyDeepSeekConfig } = createProviderConnectionPresetAppliers({
	primaryModelRef: DEEPSEEK_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "deepseek",
		api: "openai-completions",
		baseUrl: DEEPSEEK_BASE_URL,
		catalogModels: DEEPSEEK_MODEL_CATALOG,
		aliases: [{
			modelRef: DEEPSEEK_DEFAULT_MODEL_REF,
			alias: "DeepSeek"
		}]
	})
});
export { applyDeepSeekConfig };
