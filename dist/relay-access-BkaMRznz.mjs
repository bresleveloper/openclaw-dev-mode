//#region extensions/browser/src/browser/extension-relay/relay-access.ts
const borrowedCdpAccess = /* @__PURE__ */ new Map();
function registerBorrowedRelayCdpAccess(cdpUrl, relay) {
	const key = cdpUrl.replace(/\/$/u, "");
	borrowedCdpAccess.set(key, relay);
	return () => {
		if (borrowedCdpAccess.get(key) === relay) borrowedCdpAccess.delete(key);
	};
}
function getBorrowedRelayCdpAccess(cdpUrl) {
	const relay = borrowedCdpAccess.get(cdpUrl.replace(/\/$/u, ""));
	relay?.client.assertCurrent();
	return relay;
}
//#endregion
export { registerBorrowedRelayCdpAccess as n, getBorrowedRelayCdpAccess as t };
