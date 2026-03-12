import { Bt as DEFAULT_ACCOUNT_ID } from "./paths-BPFh8Kvv.js";
import { Xs as formatCliCommand } from "./model-selection-JGO58U_j.js";
//#region src/web/active-listener.ts
const listeners = /* @__PURE__ */ new Map();
function resolveWebAccountId(accountId) {
	return (accountId ?? "").trim() || "default";
}
function requireActiveWebListener(accountId) {
	const id = resolveWebAccountId(accountId);
	const listener = listeners.get(id) ?? null;
	if (!listener) throw new Error(`No active WhatsApp Web listener (account: ${id}). Start the gateway, then link WhatsApp with: ${formatCliCommand(`openclaw channels login --channel whatsapp --account ${id}`)}.`);
	return {
		accountId: id,
		listener
	};
}
function setActiveWebListener(accountIdOrListener, maybeListener) {
	const { accountId, listener } = typeof accountIdOrListener === "string" ? {
		accountId: accountIdOrListener,
		listener: maybeListener ?? null
	} : {
		accountId: DEFAULT_ACCOUNT_ID,
		listener: accountIdOrListener ?? null
	};
	const id = resolveWebAccountId(accountId);
	if (!listener) listeners.delete(id);
	else listeners.set(id, listener);
	if (id === "default") {}
}
function getActiveWebListener(accountId) {
	const id = resolveWebAccountId(accountId);
	return listeners.get(id) ?? null;
}
//#endregion
export { requireActiveWebListener as n, setActiveWebListener as r, getActiveWebListener as t };
