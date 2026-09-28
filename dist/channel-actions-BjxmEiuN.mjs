import "./date-time-CaOYkXPL.mjs";
import { m as readStringOrNumberParam } from "./common-XfKigJno.mjs";
import "./sandbox-paths-BZ4BvxS2.mjs";
import "./typebox-DIBvVmm8.mjs";
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
//#region src/channels/plugins/actions/reaction-message-id.ts
/**
* Reaction action message-id resolver.
*
* Reads explicit reaction targets or falls back to the current tool message context.
*/
/**
* Resolves the message id for reaction tools from explicit args or current tool context.
*/
function resolveReactionMessageId(params) {
	return readStringOrNumberParam(params.args, "messageId") ?? params.toolContext?.currentMessageId;
}
//#endregion
export { createUnionActionGate as n, listTokenSourcedAccounts as r, resolveReactionMessageId as t };
