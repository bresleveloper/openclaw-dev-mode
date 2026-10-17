import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import "./exec-approvals-B1rZTeax.mjs";
import { t as isApprovalNotFoundError } from "./approval-errors-Ccn5PiLn.mjs";
import "./plugin-approvals-BXljsQyC.mjs";
import "./approval-request-filters-RxKxwld1.mjs";
import "./exec-approval-reply-CsEym-Wu.mjs";
import "./approval-client-helpers-Dr5J_II9.mjs";
import "./approval-request-account-binding-CtjEtTK0.mjs";
import "./exec-approval-session-target-DOmoIXFw.mjs";
import "./approval-native-helpers-D6DcoF8Y.mjs";
import "./approval-delivery-helpers-D5aE2c2O.mjs";
import "./approval-native-runtime-Caob5D04.mjs";
import "./exec-approval-command-display-BGbZnsXu.mjs";
import "./approval-renderers-DEzohh5R.mjs";
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
