import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/gateway/device-revocation.ts
const owners = /* @__PURE__ */ new WeakMap();
const captures = /* @__PURE__ */ new WeakMap();
const sourceIdentities = /* @__PURE__ */ new WeakMap();
function retainSourceIdentity({ client, ...dependencies }) {
	let identities = sourceIdentities.get(client);
	if (!identities) {
		identities = /* @__PURE__ */ new Set();
		sourceIdentities.set(client, identities);
	}
	let source = [...identities].find((entry) => entry.dependencies.context === dependencies.context && entry.dependencies.authPolicyGeneration === dependencies.authPolicyGeneration && entry.dependencies.sharedGenerationOwner === dependencies.sharedGenerationOwner && entry.dependencies.sharedGeneration === dependencies.sharedGeneration);
	if (!source) {
		source = {
			dependencies,
			token: Object.freeze({}),
			references: 0
		};
		identities.add(source);
	}
	const retained = source;
	const bucket = identities;
	retained.references += 1;
	return {
		token: retained.token,
		release: () => {
			if (--retained.references === 0) bucket.delete(retained);
		}
	};
}
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
		capture.releaseSourceIdentity?.();
		capture.releaseSourceIdentity = void 0;
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
		revoked: false,
		sourceAccepted: false
	};
	if (state.deviceId && !owner.closed) {
		let bucket = owner.devices.get(state.deviceId);
		if (!bucket) {
			bucket = /* @__PURE__ */ new Set();
			owner.devices.set(state.deviceId, bucket);
		}
		bucket.add(state);
	}
	const isRevocationCurrent = () => !owner.closed && !state.revoked && (state.references > 0 || !state.sourceAccepted && connectionSignal?.aborted === false);
	const isCurrent = () => isRevocationCurrent() && (state.sourceAccepted && sourceAuthority ? sourceAuthority.isCurrent() : hasCurrentClientAuthority());
	const capture = {
		owner,
		state,
		isCurrent,
		isSourceCurrent: sourceAuthority ? () => isRevocationCurrent() && sourceAuthority.isCurrent() : isCurrent,
		hasSourceAuthority: sourceAuthority !== void 0,
		isRevocationCurrent,
		sourceIdentity: Object.freeze({})
	};
	captures.set(isCurrent, capture);
	capture.releaseClientRevocation = sourceAuthority?.subscribe(() => revoke(state));
	if (sourceAuthority?.dependencies) {
		const source = retainSourceIdentity(sourceAuthority.dependencies);
		capture.sourceIdentity = source.token;
		capture.releaseSourceIdentity = source.release;
	}
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
/** A committed request may finish its accepted input under the retained source grant. */
function acceptGatewayDeviceSourceAuthority(guard) {
	const capture = guard ? captures.get(guard) : void 0;
	if (!capture?.hasSourceAuthority || capture.state.references === 0 || !capture.isSourceCurrent()) return false;
	capture.state.sourceAccepted = true;
	return true;
}
function readAcceptedGatewayDeviceSourceAuthority(guard) {
	const capture = guard ? captures.get(guard) : void 0;
	return capture?.state.sourceAccepted ? capture.isSourceCurrent : void 0;
}
/** Only a producer-proven dependency cohort can share queued-input custody. */
function readGatewayDeviceSourceIdentity(guard) {
	return guard ? captures.get(guard)?.sourceIdentity : void 0;
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
	owner.devices.clear();
}
//#endregion
export { invalidateGatewayDeviceRevocation as a, readGatewayDeviceRevocationGuard as c, retainGatewayDeviceRevocation as d, closeGatewayDeviceRevocation as i, readGatewayDeviceSourceAuthority as l, bindGatewayDeviceRevocation as n, onGatewayDeviceSourceRevoked as o, captureGatewayDeviceRevocation as r, readAcceptedGatewayDeviceSourceAuthority as s, acceptGatewayDeviceSourceAuthority as t, readGatewayDeviceSourceIdentity as u };
