//#region src/auto-reply/reply/system-event-session-key.ts
const REPLY_SYSTEM_EVENT_CONTEXT = Symbol("openclaw.reply.systemEventContext");
/** Carry the queue and its optional prepared selection through internal option spreads. */
function withReplySystemEventContext(options, context) {
	return {
		...options,
		[REPLY_SYSTEM_EVENT_CONTEXT]: context
	};
}
/** An absent selection means an ordinary turn may inspect the current queue. */
function getReplySystemEventContext(options) {
	return options?.[REPLY_SYSTEM_EVENT_CONTEXT];
}
//#endregion
export { withReplySystemEventContext as n, getReplySystemEventContext as t };
