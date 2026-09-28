import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import { s as buildCopilotIdeHeaders } from "./copilot-dynamic-headers-C8eJEO7a.mjs";
import "./provider-auth-C_UP8nFt.mjs";
//#region extensions/github-copilot/runtime-identity.ts
const COPILOT_RUNTIME_INTEGRATION_ID = "copilot-developer-cli";
/** Keep catalog and inference identity aligned without forwarding unrelated configured secrets. */
function buildCopilotRuntimeHeaders(params) {
	const provider = params?.config?.models?.providers?.["github-copilot"];
	let integrationId = COPILOT_RUNTIME_INTEGRATION_ID;
	for (const headers of [
		provider?.headers,
		provider?.request?.headers,
		params?.headers
	]) for (const [name, value] of Object.entries(headers ?? {})) if (name.toLowerCase() === "copilot-integration-id") integrationId = normalizeResolvedSecretInputString({
		value,
		path: "models.providers.github-copilot.headers.Copilot-Integration-Id"
	}) ?? integrationId;
	const headers = Object.fromEntries(Object.entries(params?.headers ?? {}).filter(([name]) => name.toLowerCase() !== "copilot-integration-id"));
	return {
		...buildCopilotIdeHeaders(),
		"Openai-Organization": "github-copilot",
		...headers,
		"Copilot-Integration-Id": integrationId
	};
}
//#endregion
export { buildCopilotRuntimeHeaders as t };
