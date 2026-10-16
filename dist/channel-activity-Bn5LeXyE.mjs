//#region src/infra/channel-activity.ts
const activity = /* @__PURE__ */ new Map();
function keyFor(params) {
	const accountId = params.accountId?.trim() || "default";
	return `${params.channel}:${accountId}`;
}
/** Records the latest inbound or outbound activity timestamp for a channel/account. */
function recordChannelActivity(params) {
	const at = typeof params.at === "number" ? params.at : Date.now();
	const key = keyFor(params);
	const entry = activity.get(key) ?? {
		inboundAt: null,
		outboundAt: null
	};
	activity.set(key, entry);
	if (params.direction === "inbound") entry.inboundAt = at;
	if (params.direction === "outbound") entry.outboundAt = at;
}
/** Returns the latest known inbound/outbound activity timestamps for a channel/account. */
function getChannelActivity(params) {
	return activity.get(keyFor(params)) ?? {
		inboundAt: null,
		outboundAt: null
	};
}
//#endregion
export { recordChannelActivity as n, getChannelActivity as t };
