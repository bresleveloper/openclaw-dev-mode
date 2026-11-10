//#region extensions/telegram/src/state-account-id.ts
function normalizeTelegramStateAccountId(accountId) {
	const trimmed = accountId?.trim();
	return trimmed ? trimmed.replace(/[^a-z0-9._-]+/gi, "_") : "default";
}
//#endregion
export { normalizeTelegramStateAccountId as t };
