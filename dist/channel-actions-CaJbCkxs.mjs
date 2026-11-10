import "./common-BofcG96e.mjs";
import "./sandbox-paths-CgSBSdCM.mjs";
import "./date-time-B92eHI7U.mjs";
import "./typebox-DhJiP5MZ.mjs";
import "./reaction-message-id-DT0v2AYr.mjs";
//#region src/channels/plugins/actions/shared.ts
function listTokenSourcedAccounts(accounts) {
	return accounts.filter((account) => account.tokenSource !== "none");
}
function createUnionActionGate(accounts, createGate) {
	const gates = accounts.map((account) => createGate(account));
	return (key, defaultValue = true) => gates.some((gate) => gate(key, defaultValue));
}
//#endregion
export { listTokenSourcedAccounts as n, createUnionActionGate as t };
