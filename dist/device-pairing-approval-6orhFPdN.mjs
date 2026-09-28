import { l as withDevicePairingLock, n as executeDevicePairingMutation, t as DevicePairingAuthorityRefusedError } from "./device-pairing-worker-DPa4iZOd.mjs";
import { h as resolvePairingRequestExpiry } from "./device-pairing-identity-BnU9nqx2.mjs";
//#region src/infra/device-pairing-approval.ts
/** Format a device-pairing authorization failure for CLI/API callers. */
function formatDevicePairingForbiddenMessage(result) {
	switch (result.reason) {
		case "caller-scopes-required": return `missing scope: ${result.scope ?? "callerScopes-required"}`;
		case "caller-missing-scope": return `missing scope: ${result.scope ?? "unknown"}`;
		case "scope-outside-requested-roles": return `invalid scope for requested roles: ${result.scope ?? "unknown"}`;
		case "approval-policy-changed": return "automatic pairing policy changed; retry pairing or request manual approval";
		case "bootstrap-role-not-allowed": return `bootstrap profile does not allow role: ${result.role ?? "unknown"}`;
		case "bootstrap-scope-not-allowed": return `bootstrap profile does not allow scope: ${result.scope ?? "unknown"}`;
	}
	throw new Error("Unsupported device pairing forbidden reason");
}
function approvalAdmission(options) {
	let expired = false;
	return {
		get refusedResult() {
			return expired ? null : {
				status: "forbidden",
				reason: "approval-policy-changed"
			};
		},
		admit(facts) {
			if (facts.kind !== "pairing-approval") return;
			if (Date.now() > resolvePairingRequestExpiry(facts.pending.refreshedAtMs ?? facts.pending.ts)) {
				expired = true;
				throw new DevicePairingAuthorityRefusedError("Pairing request expired before approval commit");
			}
			if (options?.isApprovalCurrent?.({
				pending: facts.pending,
				existing: facts.existing
			}) === false) throw new DevicePairingAuthorityRefusedError("Pairing approval policy changed");
		}
	};
}
async function approveDevicePairing(requestId, optionsOrBaseDir, maybeBaseDir) {
	const options = typeof optionsOrBaseDir === "object" ? optionsOrBaseDir : void 0;
	const baseDir = typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir;
	const { isApprovalCurrent: _isApprovalCurrent, ...wireOptions } = options ?? {};
	return await withDevicePairingLock(async () => {
		const admission = approvalAdmission(options);
		try {
			return await executeDevicePairingMutation({
				type: "devicePairing.approve",
				input: {
					requestId,
					options: wireOptions,
					nowMs: Date.now()
				}
			}, {
				baseDir,
				admit: (facts) => {
					if (facts.kind === "pairing-approval") admission.admit(facts);
				}
			});
		} catch (error) {
			if (error instanceof DevicePairingAuthorityRefusedError) return admission.refusedResult;
			throw error;
		}
	});
}
async function approveBootstrapDevicePairing(requestId, bootstrapProfile, optionsOrBaseDir, maybeBaseDir) {
	const options = typeof optionsOrBaseDir === "object" ? optionsOrBaseDir : void 0;
	const baseDir = typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir;
	return await withDevicePairingLock(async () => {
		const admission = approvalAdmission(options);
		try {
			const { result } = await executeDevicePairingMutation({
				type: "devicePairing.approveBootstrap",
				input: {
					requestId,
					bootstrapProfile,
					accessMetadata: options?.accessMetadata,
					nowMs: Date.now()
				}
			}, {
				baseDir,
				onTokensReplaced: options?.onTokensReplaced,
				admit: (facts) => {
					if (facts.kind === "pairing-approval") admission.admit(facts);
				}
			});
			return result;
		} catch (error) {
			if (error instanceof DevicePairingAuthorityRefusedError) return admission.refusedResult;
			throw error;
		}
	});
}
//#endregion
export { approveDevicePairing as n, formatDevicePairingForbiddenMessage as r, approveBootstrapDevicePairing as t };
