import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/gateway/device-revocation.ts
const owners = /* @__PURE__ */ new WeakMap();
const captures = /* @__PURE__ */ new WeakMap();
function getOwner(context) {
	let owner = owners.get(context);
	if (!owner) {
		owner = {
			closed: false,
			devices: /* @__PURE__ */ new Map()
		};
		owners.set(context, owner);
	}
	return owner;
}
function releaseHold(capture) {
	const { owner, state } = capture;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		state.references -= 1;
		if (state.references !== 0) return;
		capture.releaseClientRevocation?.();
		capture.releaseClientRevocation = void 0;
		state.listeners?.clear();
		if (!state.deviceId) return;
		const bucket = owner.devices.get(state.deviceId);
		bucket?.delete(state);
		if (bucket?.size === 0) owner.devices.delete(state.deviceId);
	};
}
function revoke(state) {
	if (state.revoked) return;
	state.revoked = true;
	notifyListeners(state.listeners ?? [], void 0);
}
/** Capture the attested identity before dispatch yields, without retaining credentials or sockets. */
function captureGatewayDeviceRevocation(context, identity, hasCurrentClientAuthority, connectionSignal, sourceAuthority) {
	const owner = getOwner(context);
	const state = {
		deviceId: identity.deviceId,
		role: identity.role,
		references: 1,
		revoked: false
	};
	if (state.deviceId && !owner.closed) {
		let bucket = owner.devices.get(state.deviceId);
		if (!bucket) {
			bucket = /* @__PURE__ */ new Set();
			owner.devices.set(state.deviceId, bucket);
		}
		bucket.add(state);
	}
	const isRevocationCurrent = () => !owner.closed && !state.revoked && (state.references > 0 || connectionSignal?.aborted === false);
	const isCurrent = () => isRevocationCurrent() && hasCurrentClientAuthority();
	const capture = {
		owner,
		state,
		isCurrent,
		isSourceCurrent: sourceAuthority ? () => isRevocationCurrent() && sourceAuthority.isCurrent() : isCurrent,
		isRevocationCurrent
	};
	captures.set(isCurrent, capture);
	capture.releaseClientRevocation = sourceAuthority?.subscribe(() => revoke(state));
	return {
		isCurrent,
		release: releaseHold(capture)
	};
}
/** Carry the original capture through a composed commit guard without changing its contract. */
function bindGatewayDeviceRevocation(guard, isCurrent) {
	const capture = isCurrent ? captures.get(isCurrent) : void 0;
	if (capture) captures.set(guard, capture);
	return guard;
}
/** Read only owner-held revocation/lifetime facts, without invoking the caller authority callback. */
function readGatewayDeviceRevocationGuard(guard) {
	return guard ? captures.get(guard)?.isRevocationCurrent : void 0;
}
/** Original committed source authority, excluding tentative transport and later request lifetimes. */
function readGatewayDeviceSourceAuthority(guard) {
	return guard ? captures.get(guard)?.isSourceCurrent : void 0;
}
/** Notify retained work of access revocation, independently of transport or Gateway shutdown. */
function onGatewayDeviceSourceRevoked(guard, onRevoked) {
	const capture = guard ? captures.get(guard) : void 0;
	if (!capture) return;
	const unsubscribe = registerListener(capture.state.listeners ??= /* @__PURE__ */ new Set(), onRevoked);
	if (capture.state.revoked) onRevoked();
	return unsubscribe;
}
/** Transfer a hold on the original captured state, never recapture a later device/session. */
function retainGatewayDeviceRevocation(guard) {
	const capture = guard ? captures.get(guard) : void 0;
	if (!capture) return;
	if (!capture.isCurrent() || capture.state.references === 0) throw new Error("Gateway caller authority is no longer active.");
	capture.state.references += 1;
	return releaseHold(capture);
}
function invalidateGatewayDeviceRevocation(context, deviceId, role) {
	for (const state of owners.get(context)?.devices.get(deviceId) ?? []) if (!role || state.role === role) revoke(state);
}
function closeGatewayDeviceRevocation(context) {
	const owner = getOwner(context);
	owner.closed = true;
	for (const bucket of owner.devices.values()) bucket.clear();
	owner.devices.clear();
}
//#endregion
export { onGatewayDeviceSourceRevoked as a, retainGatewayDeviceRevocation as c, invalidateGatewayDeviceRevocation as i, captureGatewayDeviceRevocation as n, readGatewayDeviceRevocationGuard as o, closeGatewayDeviceRevocation as r, readGatewayDeviceSourceAuthority as s, bindGatewayDeviceRevocation as t };
