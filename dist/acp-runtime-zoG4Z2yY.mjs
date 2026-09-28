import "./errors-BeQQKpA8.mjs";
import { n as testing$1 } from "./manager-BSwH2tZB.mjs";
import { i as testing$2, r as requireAcpRuntimeBackend } from "./registry-4Q9QHmjA.mjs";
import "./session-meta-DHUOlEoy.mjs";
import { n as resolveAcpAgentPolicyError, r as resolveAcpDispatchPolicyError } from "./policy-DEGknwt4.mjs";
import "./acpx-BCFv_p3m.mjs";
//#region src/plugin-sdk/acp-runtime.ts
function resolveAcpSessionAvailability(params) {
	const policyError = resolveAcpDispatchPolicyError(params.config) ?? resolveAcpAgentPolicyError(params.config, params.agentId);
	if (policyError) return {
		available: false,
		message: policyError.message
	};
	try {
		requireAcpRuntimeBackend(params.backendId);
		return { available: true };
	} catch (error) {
		return {
			available: false,
			message: error instanceof Error ? error.message : "ACP runtime backend is unavailable."
		};
	}
}
/** Lazy ACP test helper facade combining control-plane and runtime registry helpers. */
const testing = new Proxy({}, {
	get(_target, prop, receiver) {
		if (Reflect.has(testing$1, prop)) return Reflect.get(testing$1, prop, receiver);
		return Reflect.get(testing$2, prop, receiver);
	},
	has(_target, prop) {
		return Reflect.has(testing$1, prop) || Reflect.has(testing$2, prop);
	},
	ownKeys() {
		return Array.from(/* @__PURE__ */ new Set([...Reflect.ownKeys(testing$1), ...Reflect.ownKeys(testing$2)]));
	},
	getOwnPropertyDescriptor(_target, prop) {
		if (Reflect.has(testing$1, prop) || Reflect.has(testing$2, prop)) return {
			configurable: true,
			enumerable: true
		};
	}
});
//#endregion
export { testing as n, resolveAcpSessionAvailability as t };
