//#region packages/ai/src/session-resources.ts
const sessionResourceCleanups = /* @__PURE__ */ new Set();
/** Registers a session-resource cleanup hook and returns an unregister function. */
function registerSessionResourceCleanup(cleanup) {
	sessionResourceCleanups.add(cleanup);
	return () => {
		sessionResourceCleanups.delete(cleanup);
	};
}
/** Runs all registered cleanup hooks, aggregating failures after every hook has run. */
function cleanupSessionResources(sessionId) {
	const errors = [];
	for (const cleanup of sessionResourceCleanups) try {
		cleanup(sessionId);
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to cleanup session resources");
}
//#endregion
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
export { registerSessionResourceCleanup as i, resolveOpenAICodexAccountId as n, cleanupSessionResources as r, decodeOpenAICodexJwtPayload as t };
