import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
//#region src/channels/logging.ts
const inboundDropWarnings = createDedupeCache({
	ttlMs: 0,
	maxSize: 512
});
/** Emits a normalized inbound-drop diagnostic for channel plugins. */
function logInboundDrop(params) {
	if (params.onceKey !== void 0 && inboundDropWarnings.check(JSON.stringify([
		params.channel,
		params.reason,
		params.onceKey
	]))) return;
	const target = params.target ? ` target=${params.target}` : "";
	const hint = params.hint ? `. ${params.hint}` : "";
	params.log(`${params.channel}: drop ${params.reason}${target}${hint}`);
}
/** Emits a normalized typing-indicator failure diagnostic for channel plugins. */
function logTypingFailure(params) {
	const target = params.target ? ` target=${params.target}` : "";
	const action = params.action ? ` action=${params.action}` : "";
	params.log(`${params.channel} typing${action} failed${target}: ${String(params.error)}`);
}
/** Emits a normalized acknowledgement-cleanup failure diagnostic for channel plugins. */
function logAckFailure(params) {
	const target = params.target ? ` target=${params.target}` : "";
	params.log(`${params.channel} ack cleanup failed${target}: ${String(params.error)}`);
}
//#endregion
export { logInboundDrop as n, logTypingFailure as r, logAckFailure as t };
