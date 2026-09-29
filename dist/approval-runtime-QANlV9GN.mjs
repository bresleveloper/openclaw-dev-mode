import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { t as isApprovalNotFoundError } from "./approval-errors-BPkaCbRr.mjs";
import "./plugin-approvals-DV5u4TwS.mjs";
import "./approval-request-filters-C0-UKdRV.mjs";
import "./exec-approval-reply-Cd667sf7.mjs";
import "./approval-client-helpers-CezcxdM0.mjs";
import "./approval-request-account-binding-CJyRIlPn.mjs";
import "./exec-approval-session-target-OgVTuS1l.mjs";
import "./approval-native-helpers-Bu6FTCbI.mjs";
import "./approval-delivery-helpers-3TrBi_Wa.mjs";
import "./approval-renderers-CXRXTpSo.mjs";
import "./approval-native-runtime-B-szWi4q.mjs";
import "./exec-approval-command-display-Dzor4H8W.mjs";
import { randomBytes } from "node:crypto";
//#region src/plugin-sdk/approval-native-controls.ts
/** Own one plugin's process-local native controls through resolution and card updates. */
function createNativeApprovalControlRegistry(params) {
	const bindings = /* @__PURE__ */ new Map();
	const resolving = /* @__PURE__ */ new Set();
	const get = (token) => {
		const binding = bindings.get(token);
		if (!binding) return null;
		if (binding.expiresAtMs <= Date.now()) {
			bindings.delete(token);
			if (params.releaseClaimOnLookupExpiry) resolving.delete(token);
			return null;
		}
		return binding;
	};
	const complete = (token) => {
		const binding = bindings.get(token);
		resolving.delete(token);
		bindings.delete(token);
		if (binding) params.onComplete?.(binding);
	};
	return {
		createToken: () => randomBytes(18).toString("base64url"),
		register(binding) {
			if (binding.expiresAtMs <= Date.now()) return false;
			bindings.delete(binding.token);
			bindings.set(binding.token, binding);
			pruneMapToMaxSize(bindings, 1024);
			return true;
		},
		get,
		values: () => bindings.values(),
		pruneExpired(nowMs) {
			for (const [token, binding] of bindings) if (binding.expiresAtMs <= nowMs) {
				bindings.delete(token);
				resolving.delete(token);
			}
		},
		unregister(tokens) {
			for (const token of tokens) complete(token);
		},
		async settle(token, resolveAndUpdate) {
			const binding = get(token);
			if (!binding) return { kind: "missing" };
			if (resolving.has(token)) return { kind: "in-flight" };
			resolving.add(token);
			let result;
			try {
				result = await resolveAndUpdate(binding);
			} catch (error) {
				if (isApprovalNotFoundError(error)) {
					complete(token);
					return {
						kind: "not-found",
						binding
					};
				}
				resolving.delete(token);
				throw error;
			}
			complete(token);
			return {
				kind: "settled",
				binding,
				result
			};
		}
	};
}
//#endregion
export { createNativeApprovalControlRegistry as t };
