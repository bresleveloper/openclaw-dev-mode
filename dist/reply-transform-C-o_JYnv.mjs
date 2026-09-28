import { T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { t as bindNormalizeReplyTransformOwner } from "./normalize-reply-gZujyBo1.mjs";
//#region src/channels/message/reply-transform.ts
const channelReplyTransformOwners = /* @__PURE__ */ new WeakMap();
function resolveChannelReplyTransformOwner(messaging, accountId) {
	let owners = channelReplyTransformOwners.get(messaging);
	if (!owners) {
		owners = /* @__PURE__ */ new Map();
		channelReplyTransformOwners.set(messaging, owners);
	}
	const key = accountId?.trim() ?? "";
	let owner = owners.get(key);
	if (!owner) {
		owner = {};
		owners.set(key, owner);
	}
	return owner;
}
function bindChannelReplyTransformOwner(transform, messaging, accountId) {
	return bindNormalizeReplyTransformOwner(transform, resolveChannelReplyTransformOwner(messaging, accountId));
}
function createChannelReplyTransform(params) {
	if (!params.messaging?.transformReplyPayload) return;
	const transform = (payload) => applyChannelReplyTransform({
		...params,
		payload
	});
	return bindChannelReplyTransformOwner(transform, params.messaging, params.accountId);
}
function applyChannelReplyTransform(params) {
	const transform = params.messaging?.transformReplyPayload;
	if (!transform || !params.messaging) return params.payload;
	const transformed = transform.call(params.messaging, {
		payload: params.payload,
		cfg: params.cfg,
		accountId: params.accountId
	});
	return transformed === null ? null : setReplyPayloadMetadata(copyReplyPayloadMetadata(params.payload, transformed), { channelReplyTransformOwner: resolveChannelReplyTransformOwner(params.messaging, params.accountId) });
}
//#endregion
export { bindChannelReplyTransformOwner as n, createChannelReplyTransform as r, applyChannelReplyTransform as t };
