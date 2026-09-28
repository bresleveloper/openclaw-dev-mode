import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/gateway/server/ws-policy-close.ts
const policyMethods = /* @__PURE__ */ new Set([
	"config.set",
	"config.patch",
	"config.apply",
	"secrets.reload",
	"secrets.store.set",
	"secrets.store.delete",
	"device.pair.remove",
	"device.token.rotate",
	"device.token.revoke",
	"users.setRole"
]);
const responses = /* @__PURE__ */ new WeakMap();
const clients = /* @__PURE__ */ new WeakMap();
const invalidationListeners = /* @__PURE__ */ new WeakMap();
function hasCurrentGatewayPolicyClientSource(client) {
	return !(client.sourceInvalidated ?? client.invalidated ?? false);
}
/** Accepted work follows authentication invalidation even after its transport disconnects. */
function onGatewayPolicyClientInvalidated(client, listener) {
	if (!hasCurrentGatewayPolicyClientSource(client)) {
		listener();
		return () => {};
	}
	let listeners = invalidationListeners.get(client);
	if (!listeners) {
		listeners = /* @__PURE__ */ new Set();
		invalidationListeners.set(client, listeners);
	}
	const unsubscribe = registerListener(listeners, listener);
	return () => {
		unsubscribe();
		if (listeners.size === 0 && invalidationListeners.get(client) === listeners) invalidationListeners.delete(client);
	};
}
/** The dispatcher owns response completion, including throws and handlers that return silently. */
function registerGatewayPolicyResponse(method, client, respond) {
	if (!policyMethods.has(method)) return;
	let state;
	const response = {
		get pending() {
			return state !== void 0;
		},
		hold() {
			if (state) return;
			if (client.invalidated) throw new Error("client authorization is no longer active");
			state = clients.get(client) ?? { pending: 0 };
			state.pending++;
			clients.set(client, state);
		},
		finish() {
			responses.delete(respond);
			if (!state) return;
			const completed = state;
			state = void 0;
			if (--completed.pending === 0) {
				clients.delete(client);
				completed.close?.();
			}
		}
	};
	responses.set(respond, response);
	return response;
}
/** Claim only at the mutation owner, after request validation and before publication can revoke it. */
function holdGatewayPolicyResponse(respond) {
	if (respond) responses.get(respond)?.hold();
}
/** Fence requests immediately; tentative reloads preserve already accepted source authority. */
function invalidateGatewayPolicyClient(client, policy) {
	client.sourceInvalidated = (client.sourceInvalidated ?? client.invalidated ?? false) || policy.revokeSource !== false;
	client.invalidated = true;
	client.invalidatedReason ??= policy.reason;
	if (client.sourceInvalidated) {
		const listeners = invalidationListeners.get(client);
		invalidationListeners.delete(client);
		notifyListeners(listeners ?? [], void 0);
	}
	const close = () => {
		try {
			if (policy.close) policy.close();
			else client.socket.close(policy.code, policy.message);
		} catch {}
	};
	const state = clients.get(client);
	if (state) state.close ??= close;
	else close();
}
//#endregion
export { registerGatewayPolicyResponse as a, onGatewayPolicyClientInvalidated as i, holdGatewayPolicyResponse as n, invalidateGatewayPolicyClient as r, hasCurrentGatewayPolicyClientSource as t };
