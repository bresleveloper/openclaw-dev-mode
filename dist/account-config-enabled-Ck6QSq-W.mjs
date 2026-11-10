import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
//#region src/channels/account-config-enabled.ts
/** Reads an operator's explicit disable without resolving an operational account. */
function isChannelAccountExplicitlyDisabled(params) {
	const channel = asOptionalRecord(params.cfg.channels?.[params.channel]);
	const account = asOptionalRecord(resolveChannelAccountEntry(asOptionalRecord(channel?.accounts), params.accountId, params.channel));
	return channel?.enabled === false || account?.enabled === false;
}
//#endregion
export { isChannelAccountExplicitlyDisabled as t };
