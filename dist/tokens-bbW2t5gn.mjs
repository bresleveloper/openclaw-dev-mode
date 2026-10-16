import { t as createOneTimeTicketStore } from "./one-time-ticket-store-B8dK9Gfu.mjs";
//#region extensions/browser/src/browser/screencast/tokens.ts
const tokens = createOneTimeTicketStore({
	ttlMs: 6e4,
	onExpire: (params) => params.releaseRequester?.()
});
function mintBrowserScreencastToken(params) {
	const release = params.releaseRequester;
	if (release && params.requesterSignal) {
		const signal = params.requesterSignal;
		let released = false;
		const onAbort = () => params.releaseRequester?.();
		params.releaseRequester = () => {
			if (released) return;
			released = true;
			signal.removeEventListener("abort", onAbort);
			release();
		};
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) params.releaseRequester();
	}
	return tokens.mint(params, { revokeSignal: params.requesterSignal });
}
function consumeBrowserScreencastToken(token) {
	const params = token === token.trim() ? tokens.consume(token) : void 0;
	if (params && (params.requesterSignal?.aborted || params.isRequesterCurrent?.() === false)) {
		params.releaseRequester?.();
		return;
	}
	return params;
}
function clearBrowserScreencastTokens() {
	tokens.clear();
}
//#endregion
export { consumeBrowserScreencastToken as n, mintBrowserScreencastToken as r, clearBrowserScreencastTokens as t };
