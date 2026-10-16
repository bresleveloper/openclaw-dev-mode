import "./common-Dyxcwsy8.mjs";
import "./sandbox-paths-Br7HP2l8.mjs";
import "./date-time-DNFKWNdt.mjs";
import "./typebox-X-jU33BZ.mjs";
import "./reaction-message-id-BgZjxV6k.mjs";
//#region src/channels/plugins/actions/shared.ts
/**
* Filters out accounts explicitly marked as tokenless.
*/
function listTokenSourcedAccounts(accounts) {
	return accounts.filter((account) => account.tokenSource !== "none");
}
/**
* Creates an action gate that is enabled when any account-level gate enables the action.
*/
function createUnionActionGate(accounts, createGate) {
	const gates = accounts.map((account) => createGate(account));
	return (key, defaultValue = true) => gates.some((gate) => gate(key, defaultValue));
}
//#endregion
export { listTokenSourcedAccounts as n, createUnionActionGate as t };
