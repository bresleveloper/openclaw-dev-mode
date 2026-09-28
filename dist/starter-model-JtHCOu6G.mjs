import { t as DEFAULT_COPILOT_MODEL } from "./model-metadata-2b9VF8l_.mjs";
import { t as buildCopilotRuntimeHeaders } from "./runtime-identity-lRGKz0Kw.mjs";
import { n as PROVIDER_ID, o as selectCopilotStarterModel, r as fetchCopilotModelCatalog } from "./models-at_nI0o1.mjs";
import { n as resolveCopilotRuntimeAuth } from "./runtime-auth-B1nEIuFA.mjs";
//#region extensions/github-copilot/starter-model.ts
function preferredCopilotStarterModelId() {
	const prefix = `${PROVIDER_ID}/`;
	return "github-copilot/claude-sonnet-5".startsWith(prefix) ? DEFAULT_COPILOT_MODEL.slice(prefix.length) : DEFAULT_COPILOT_MODEL;
}
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
	const selected = selectCopilotStarterModel(models, preferredCopilotStarterModelId());
	if (!selected) throw new Error("GitHub Copilot did not return an enabled, picker-visible chat model with streaming and tool-call support.");
	return `${PROVIDER_ID}/${selected.id}`;
}
//#endregion
export { resolveCopilotStarterModel as t };
