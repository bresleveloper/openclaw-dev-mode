//#region src/commands/channels/account-selector.ts
function parseAccountSelector(account) {
	if (account !== void 0 && !account.trim()) throw new Error("--account must not be blank");
	return account;
}
//#endregion
export { parseAccountSelector as t };
