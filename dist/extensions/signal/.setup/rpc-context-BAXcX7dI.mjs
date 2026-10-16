//#region extensions/signal/src/rpc-context.ts
function resolveSignalRpcContext(opts, accountInfo) {
	const baseUrlOverride = opts.baseUrl?.trim();
	const accountOverride = opts.account?.trim();
	const baseUrl = baseUrlOverride || accountInfo.baseUrl;
	if (!baseUrl) throw new Error("Signal base URL is required");
	return {
		baseUrl,
		account: accountOverride || accountInfo.config.account?.trim() || void 0
	};
}
//#endregion
export { resolveSignalRpcContext as t };
