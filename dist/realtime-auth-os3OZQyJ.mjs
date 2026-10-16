import { i as resolveOpenAICodexAuthIdentity } from "./provider-openai-chatgpt-auth-fIvYFuQh.mjs";
import "./provider-oauth-runtime-B6eXjkVx.mjs";
//#region extensions/openai/realtime-auth.ts
async function resolveOpenAIChatGptSubscriptionAuth(params, { resolveProviderAuthProfileApiKey }) {
	const token = await resolveProviderAuthProfileApiKey({
		provider: "openai",
		capability: "realtime-voice",
		cfg: params.cfg,
		agentDir: params.agentDir,
		profileTypes: ["oauth"],
		includeExternalCliAuth: false
	});
	if (!token) return;
	const accountId = resolveOpenAICodexAuthIdentity({ access: token }).accountId;
	if (!accountId) throw new Error("The selected ChatGPT OAuth profile is missing its account id");
	return {
		type: "oauth",
		token,
		accountId
	};
}
//#endregion
export { resolveOpenAIChatGptSubscriptionAuth as t };
