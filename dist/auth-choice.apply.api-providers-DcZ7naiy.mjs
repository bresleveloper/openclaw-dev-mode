import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveProviderMatch } from "./provider-auth-choice-helpers-D4IfJl_2.mjs";
import { t as resolvePluginProviders } from "./provider-auth-choice.runtime-BoKc_L9w.mjs";
//#region src/commands/auth-choice.apply.api-providers.ts
/** Translate generic api-key/token choices to provider-specific auth choices when possible. */
function normalizeApiKeyTokenProviderAuthChoice(params) {
	const normalizedTokenProvider = normalizeOptionalLowercaseString(params.tokenProvider);
	if (!normalizedTokenProvider) return params.authChoice;
	const kind = params.authChoice === "apiKey" ? "api_key" : params.authChoice === "token" || params.authChoice === "setup-token" ? "token" : void 0;
	if (!kind) return params.authChoice;
	return resolveProviderMatch(resolvePluginProviders({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		mode: "setup"
	}), normalizedTokenProvider)?.auth.find((method) => method.kind === kind)?.wizard?.choiceId ?? params.authChoice;
}
//#endregion
export { normalizeApiKeyTokenProviderAuthChoice as t };
