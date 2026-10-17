import { t as DEFAULT_COPILOT_MODEL } from "./model-metadata-DcfNVGd3.mjs";
import { t as buildCopilotRuntimeHeaders } from "./runtime-identity-Dd194vpt.mjs";
import { n as PROVIDER_ID, o as selectCopilotStarterModel, r as fetchCopilotModelCatalog } from "./models-FpFBYioI.mjs";
import { n as resolveCopilotRuntimeAuth } from "./runtime-auth-Bk7UhxKB.mjs";
//#region extensions/github-copilot/starter-model.ts
const PREFERRED_COPILOT_STARTER_MODEL_ID = DEFAULT_COPILOT_MODEL.slice(PROVIDER_ID.length + 1);
async function resolveCopilotStarterModel(params) {
	const auth = await resolveCopilotRuntimeAuth({
		githubToken: params.githubToken,
		...params.env ? { env: params.env } : {},
		...params.githubDomain ? { githubDomain: params.githubDomain } : {},
		...params.config ? { config: params.config } : {}
	});
	const models = await fetchCopilotModelCatalog({
		copilotApiToken: auth.apiKey,
		baseUrl: auth.baseUrl,
		headers: buildCopilotRuntimeHeaders({ config: params.config })
	});
	const selected = selectCopilotStarterModel(models, PREFERRED_COPILOT_STARTER_MODEL_ID);
	if (!selected) throw new Error("GitHub Copilot did not return an enabled, picker-visible chat model with streaming and tool-call support.");
	return `${PROVIDER_ID}/${selected.id}`;
}
//#endregion
export { resolveCopilotStarterModel as t };
