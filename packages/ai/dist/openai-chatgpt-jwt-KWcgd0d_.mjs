//#region packages/ai/src/utils/oauth/openai-chatgpt-jwt.ts
const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
function decodeOpenAICodexJwtPayload(token) {
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	try {
		const decoded = Buffer.from(parts[1] ?? "", "base64url").toString("utf8");
		const parsed = JSON.parse(decoded);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function resolveOpenAICodexAccountId(token) {
	const accountId = decodeOpenAICodexJwtPayload(token)?.[OPENAI_CODEX_AUTH_CLAIM]?.chatgpt_account_id;
	return typeof accountId === "string" && accountId.length > 0 ? accountId : null;
}
//#endregion
export { resolveOpenAICodexAccountId as n, decodeOpenAICodexJwtPayload as t };
