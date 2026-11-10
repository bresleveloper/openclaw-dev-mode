import "./incognito-session-error-Dsi9IsoJ.mjs";
import "./errors-BYR7FGxG.mjs";
import { n as resolveAcpAgentPolicyError, r as resolveAcpDispatchPolicyError } from "./policy-C2Xkhgxq.mjs";
import { a as testing$1, i as requireAcpRuntimeBackend } from "./registry-S4l3N3eT.mjs";
import { r as testing$2 } from "./manager-Cge77N9B.mjs";
import { n as readAcpSessionEntryAsync$1 } from "./session-meta-read-C9RqVGp2.mjs";
import "./session-meta-DC-FqIqd.mjs";
import "./acpx-XKojYCKI.mjs";
//#region src/plugin-sdk/acp-runtime.ts
/** Keep internal actor authority outside the released one-argument SDK contract. */
const readAcpSessionEntryAsync = readAcpSessionEntryAsync$1;
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
		if (Reflect.has(testing$2, prop)) return Reflect.get(testing$2, prop, receiver);
		return Reflect.get(testing$1, prop, receiver);
	},
	has(_target, prop) {
		return Reflect.has(testing$2, prop) || Reflect.has(testing$1, prop);
	},
	ownKeys() {
		return Array.from(/* @__PURE__ */ new Set([...Reflect.ownKeys(testing$2), ...Reflect.ownKeys(testing$1)]));
	},
	getOwnPropertyDescriptor(_target, prop) {
		if (Reflect.has(testing$2, prop) || Reflect.has(testing$1, prop)) return {
			configurable: true,
			enumerable: true
		};
	}
});
//#endregion
export { resolveAcpSessionAvailability as n, testing as r, readAcpSessionEntryAsync as t };
