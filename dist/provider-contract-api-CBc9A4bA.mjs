import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as decodeOpenAICodexJwtPayload } from "./provider-openai-chatgpt-auth-DrXK_39U.mjs";
import "./provider-oauth-runtime-CGs7wjl8.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { l as isSIWCAuthFlow } from "./token-sharing-CmBELw8t.mjs";
import { l as resolveServiceTiers, s as resolveFastModeSupport } from "./provider-policy-api-C5GDY1fk.mjs";
//#region extensions/openai/provider-contract-api.ts
const noopAuth = async () => ({ profiles: [] });
const OPENAI_ACCOUNT_WIZARD_GROUP = {
	groupId: "openai",
	groupLabel: "OpenAI",
	groupHint: "Codex login, Sign in with ChatGPT (Beta), or API key"
};
const CODEX_CHATGPT_IMPORT = {
	migrationProviderId: "codex",
	itemId: "auth:openai",
	credentialKind: "oauth"
};
const CODEX_API_KEY_IMPORT = {
	migrationProviderId: "codex",
	itemId: "auth:openai:api-key",
	credentialKind: "api_key"
};
const matchesTokenSharingAccount = (credential, existing) => {
	if (credential.type !== "oauth" || existing.type !== "oauth" || credential.provider !== "openai" || existing.provider !== "openai" || !isSIWCAuthFlow(credential.authFlow) || !isSIWCAuthFlow(existing.authFlow) || !credential.idToken || !existing.idToken || !credential.clientId || credential.clientId !== existing.clientId) return false;
	const current = decodeOpenAICodexJwtPayload(credential.idToken);
	const previous = decodeOpenAICodexJwtPayload(existing.idToken);
	return Boolean(current?.sub && current.sub === previous?.sub && current.iss === previous?.iss);
};
function accountSubject(access) {
	const claims = asNonArrayRecord(decodeOpenAICodexJwtPayload(access)?.["https://api.openai.com/auth"]);
	const accountId = normalizeOptionalString(claims.chatgpt_account_id);
	const userId = normalizeOptionalString(claims.chatgpt_user_id) ?? normalizeOptionalString(claims.user_id);
	return accountId && userId ? {
		accountId,
		userId
	} : void 0;
}
const matchesPersonalAccount = (credential, existing) => {
	if (credential.type !== "oauth" || existing.type !== "oauth" || credential.provider !== "openai" || existing.provider !== credential.provider) return false;
	const subject = accountSubject(credential.access);
	const previous = accountSubject(existing.access);
	return Boolean(subject && previous?.accountId === subject.accountId && previous.userId === subject.userId);
};
function createOpenAIProvider() {
	return {
		id: "openai",
		label: "OpenAI",
		hookAliases: ["azure-openai", "azure-openai-responses"],
		docsPath: "/providers/models",
		envVars: ["OPENAI_API_KEY"],
		resolveFastModeSupport,
		resolveServiceTiers,
		auth: [
			{
				id: "oauth",
				kind: "oauth",
				label: "Codex login (browser)",
				hint: "Sign in to Codex locally with your ChatGPT account",
				matchesPersonalAccount,
				credentialImport: CODEX_CHATGPT_IMPORT,
				wizard: {
					choiceId: "openai",
					assistantPriority: -10
				}
			},
			{
				id: "device-code",
				kind: "device_code",
				label: "Codex login (device code)",
				hint: "Use a browser code when OpenClaw runs on a remote VM",
				matchesPersonalAccount,
				credentialImport: CODEX_CHATGPT_IMPORT,
				wizard: {
					choiceId: "openai-device-code",
					assistantPriority: -40,
					onboardingFeatured: true
				}
			},
			{
				id: "siwc",
				kind: "oauth",
				label: "Sign in with ChatGPT (Beta)",
				hint: "Authorize OpenClaw for eligible Responses models using your Codex allowance",
				matchesPersonalAccount: matchesTokenSharingAccount,
				wizard: {
					choiceId: "openai-token-sharing",
					assistantPriority: 0
				}
			},
			{
				id: "api-key",
				kind: "api_key",
				label: "OpenAI API Key",
				hint: "Use your OpenAI API key directly",
				credentialImport: CODEX_API_KEY_IMPORT,
				wizard: {
					choiceId: "openai-api-key",
					assistantPriority: 5,
					onboardingFeatured: true
				}
			}
		].map((method) => Object.assign({}, method, {
			run: noopAuth,
			wizard: {
				...method.wizard,
				choiceLabel: method.label,
				choiceHint: method.hint,
				...OPENAI_ACCOUNT_WIZARD_GROUP
			}
		}))
	};
}
//#endregion
export { createOpenAIProvider as t };
