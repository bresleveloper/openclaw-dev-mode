//#region extensions/browser/src/browser/extension-relay/relay-access.ts
const borrowedCdpAccess = /* @__PURE__ */ new Map();
function registerBorrowedRelayCdpAccess(cdpUrl, relay) {
	const key = cdpUrl.replace(/\/$/u, "");
	const entry = { relay };
	borrowedCdpAccess.set(key, entry);
	return () => {
		if (borrowedCdpAccess.get(key) === entry) borrowedCdpAccess.delete(key);
	};
}
function getBorrowedRelayCdpAccess(cdpUrl) {
	const relay = borrowedCdpAccess.get(cdpUrl.replace(/\/$/u, ""))?.relay;
	relay?.client.assertCurrent();
	return relay;
}
//#endregion
export { registerBorrowedRelayCdpAccess as n, getBorrowedRelayCdpAccess as t };
