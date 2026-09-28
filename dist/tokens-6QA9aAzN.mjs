import { t as createOneTimeTicketStore } from "./one-time-ticket-store-DtARpIum.mjs";
//#region extensions/browser/src/browser/screencast/tokens.ts
const tokens = createOneTimeTicketStore({ ttlMs: 6e4 });
function mintBrowserScreencastToken(params) {
	return tokens.mint(params, { revokeSignal: params.requesterSignal });
}
function consumeBrowserScreencastToken(token) {
	const params = token === token.trim() ? tokens.consume(token) : void 0;
	return params && !params.requesterSignal?.aborted && params.isRequesterCurrent?.() !== false ? params : void 0;
}
function clearBrowserScreencastTokens() {
	tokens.clear();
}
//#endregion
export { consumeBrowserScreencastToken as n, mintBrowserScreencastToken as r, clearBrowserScreencastTokens as t };
