//#region extensions/line/src/account-helpers.ts
function hasLineCredentials(account) {
	if (account.tokenStatus && account.signingSecretStatus) return account.tokenStatus !== "missing" && account.signingSecretStatus !== "missing";
	return Boolean(account.channelAccessToken?.trim() && account.channelSecret?.trim());
}
function parseLineAllowFromId(raw) {
	const trimmed = raw.trim().replace(/^line:(?:user:)?/i, "");
	if (!/^U[a-f0-9]{32}$/i.test(trimmed)) return null;
	return trimmed;
}
//#endregion
export { parseLineAllowFromId as n, hasLineCredentials as t };
