import { n as executeDevicePairingMutation, t as DevicePairingAuthorityRefusedError } from "./device-pairing-worker-DLHLJ4yt.mjs";
import { o as withDevicePairingLock } from "./device-pairing-store-readonly-Cbi-VDom.mjs";
import { h as resolvePairingRequestExpiry } from "./device-pairing-identity-BRtdqCdi.mjs";
import { m as publishDevicePairingResolution } from "./device-pairing-_Xo0MHGf.mjs";
//#region src/infra/device-pairing-approval.ts
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
		admit: (facts) => {
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
		const result = await executeDevicePairingMutation({
			type: "devicePairing.approve",
			input: {
				requestId,
				options: wireOptions,
				nowMs: Date.now()
			}
		}, {
			baseDir,
			onAuthorityRefused: () => admission.refusedResult,
			admit: admission.admit
		});
		if (result?.status === "approved") publishDevicePairingResolution({
			requestId,
			deviceId: result.device.deviceId
		}, "approved", baseDir);
		return result;
	});
}
async function approveBootstrapDevicePairing(requestId, bootstrapProfile, optionsOrBaseDir, maybeBaseDir) {
	const options = typeof optionsOrBaseDir === "object" ? optionsOrBaseDir : void 0;
	const baseDir = typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir;
	return await withDevicePairingLock(async () => {
		const admission = approvalAdmission(options);
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
			onAuthorityRefused: () => ({
				result: admission.refusedResult,
				replacedRoles: []
			}),
			admit: admission.admit
		});
		if (result?.status === "approved") publishDevicePairingResolution({
			requestId,
			deviceId: result.device.deviceId
		}, "approved", baseDir);
		return result;
	});
}
//#endregion
export { approveDevicePairing as n, formatDevicePairingForbiddenMessage as r, approveBootstrapDevicePairing as t };
