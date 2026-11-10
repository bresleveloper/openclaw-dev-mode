import { i as resolveOpenAICodexAuthIdentity } from "./provider-openai-chatgpt-auth-DrXK_39U.mjs";
import "./provider-oauth-runtime-CGs7wjl8.mjs";
//#region extensions/openai/realtime-auth.ts
const OPENAI_CHATGPT_SUBSCRIPTION_PROFILE_TYPES = ["oauth", "token"];
async function resolveOpenAIChatGptSubscriptionAuth(params, { resolveProviderAuthProfileApiKey }) {
	const lookup = {
		provider: "openai",
		capability: "realtime-voice",
		cfg: params.cfg,
		agentDir: params.agentDir,
		includeExternalCliAuth: false
	};
	const oauthToken = await resolveProviderAuthProfileApiKey({
		...lookup,
		profileTypes: ["oauth"]
	});
	if (oauthToken) {
		const accountId = resolveOpenAICodexAuthIdentity({ access: oauthToken }).accountId;
		if (!accountId) throw new Error("The selected ChatGPT OAuth profile is missing its account id");
		return {
			type: "oauth",
			token: oauthToken,
			accountId
		};
	}
	const pastedToken = await resolveProviderAuthProfileApiKey({
		...lookup,
		profileTypes: ["token"]
	});
	const accountId = pastedToken ? resolveOpenAICodexAuthIdentity({ access: pastedToken }).accountId : void 0;
	return pastedToken && accountId ? {
		type: "oauth",
		token: pastedToken,
		accountId
	} : void 0;
}
//#endregion
export { resolveOpenAIChatGptSubscriptionAuth as n, OPENAI_CHATGPT_SUBSCRIPTION_PROFILE_TYPES as t };
