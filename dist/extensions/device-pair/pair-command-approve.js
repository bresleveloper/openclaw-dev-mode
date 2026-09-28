import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-CIXf7egm.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { n as approveDevicePairing } from "../../device-pairing-approval-6orhFPdN.mjs";
import "../../api-BT7x4kQo.mjs";
import { r as formatPendingRequests } from "../../notify-7st1j3-u.mjs";
//#region extensions/device-pair/pair-command-approve.ts
function buildMultiplePendingApprovalReply(pending) {
	return { text: `${formatPendingRequests(pending)}\n\nMultiple pending requests found. Approve one explicitly:
/pair approve <requestId>
Or approve the most recent:
/pair approve latest` };
}
function selectPendingApprovalRequest(params) {
	const [firstPending, ...remainingPending] = params.pending;
	if (!firstPending) return { reply: { text: "No pending device pairing requests." } };
	if (!params.requested) return remainingPending.length === 0 ? { pending: firstPending } : { reply: buildMultiplePendingApprovalReply(params.pending) };
	if (normalizeLowercaseStringOrEmpty(params.requested) === "latest") {
		let latest = firstPending;
		for (const pending of remainingPending) if ((pending.ts ?? 0) > (latest.ts ?? 0)) latest = pending;
		return { pending: latest };
	}
	return {
		pending: params.pending.find((entry) => entry.requestId === params.requested),
		reply: void 0
	};
}
function formatApprovedPairingReply(approved) {
	const label = normalizeOptionalString(approved.device.displayName) || approved.device.deviceId;
	const platform = normalizeOptionalString(approved.device.platform);
	return { text: `✅ Paired ${label}${platform ? ` (${platform})` : ""}.` };
}
function formatForbiddenPairingRequirement(approved) {
	return approved.scope ?? approved.role ?? "additional approval";
}
async function approvePendingPairingRequest(params) {
	const assertCurrent = params.assertCurrent;
	const isApprovalCurrent = assertCurrent ? () => {
		assertCurrent();
		return true;
	} : void 0;
	const approved = params.callerScopes === void 0 && !isApprovalCurrent ? await approveDevicePairing(params.requestId) : await approveDevicePairing(params.requestId, {
		callerScopes: params.callerScopes,
		...isApprovalCurrent ? { isApprovalCurrent } : {}
	});
	if (!approved) return { text: "Pairing request not found." };
	if (approved.status === "forbidden") return { text: `⚠️ This command requires ${formatForbiddenPairingRequirement(approved)} to approve this pairing request.` };
	return formatApprovedPairingReply(approved);
}
//#endregion
export { approvePendingPairingRequest, selectPendingApprovalRequest };
