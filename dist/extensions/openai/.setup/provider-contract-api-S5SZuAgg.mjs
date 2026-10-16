import { l as isSIWCAuthFlow } from "./token-sharing-CmBELw8t.mjs";
import { asNonArrayRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { decodeOpenAICodexJwtPayload } from "openclaw/plugin-sdk/provider-oauth-runtime";
//#region extensions/openai/provider-contract-api.ts
const noopAuth = async () => ({ profiles: [] });
const OPENAI_API_KEY_LABEL = "OpenAI API Key";
const OPENAI_CHATGPT_LOGIN_LABEL = "Codex login (browser)";
const OPENAI_CHATGPT_LOGIN_HINT = "Sign in to Codex locally with your ChatGPT account";
const OPENAI_CHATGPT_DEVICE_PAIRING_LABEL = "Codex login (device code)";
const OPENAI_CHATGPT_DEVICE_PAIRING_HINT = "Use a browser code when OpenClaw runs on a remote VM";
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
		auth: [
			{
				id: "oauth",
				kind: "oauth",
				label: OPENAI_CHATGPT_LOGIN_LABEL,
				hint: OPENAI_CHATGPT_LOGIN_HINT,
				run: noopAuth,
				matchesPersonalAccount,
				credentialImport: CODEX_CHATGPT_IMPORT,
				wizard: {
					choiceId: "openai",
					choiceLabel: OPENAI_CHATGPT_LOGIN_LABEL,
					choiceHint: OPENAI_CHATGPT_LOGIN_HINT,
					assistantPriority: -10,
					...OPENAI_ACCOUNT_WIZARD_GROUP
				}
			},
			{
				id: "device-code",
				kind: "device_code",
				label: OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
				hint: OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
				run: noopAuth,
				matchesPersonalAccount,
				credentialImport: CODEX_CHATGPT_IMPORT,
				wizard: {
					choiceId: "openai-device-code",
					choiceLabel: OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
					choiceHint: OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
					assistantPriority: -40,
					onboardingFeatured: true,
					...OPENAI_ACCOUNT_WIZARD_GROUP
				}
			},
			{
				id: "siwc",
				kind: "oauth",
				label: "Sign in with ChatGPT (Beta)",
				hint: "Authorize OpenClaw for eligible Responses models using your Codex allowance",
				run: noopAuth,
				matchesPersonalAccount: matchesTokenSharingAccount,
				wizard: {
					choiceId: "openai-token-sharing",
					choiceLabel: "Sign in with ChatGPT (Beta)",
					choiceHint: "Authorize OpenClaw for eligible Responses models using your Codex allowance",
					assistantPriority: 0,
					...OPENAI_ACCOUNT_WIZARD_GROUP
				}
			},
			{
				id: "api-key",
				kind: "api_key",
				label: OPENAI_API_KEY_LABEL,
				hint: "Use your OpenAI API key directly",
				run: noopAuth,
				credentialImport: CODEX_API_KEY_IMPORT,
				wizard: {
					choiceId: "openai-api-key",
					choiceLabel: OPENAI_API_KEY_LABEL,
					choiceHint: "Use your OpenAI API key directly",
					assistantPriority: 5,
					onboardingFeatured: true,
					...OPENAI_ACCOUNT_WIZARD_GROUP
				}
			}
		]
	};
}
//#endregion
export { createOpenAIProvider as t };
