import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-1VuiLaaR.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { n as approveDevicePairing } from "../../device-pairing-approval-DyoNg7Fe.mjs";
import "../../api-D-QH72dU.mjs";
import { n as formatPendingRequests } from "../../notify-fisumnKG.mjs";
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
	if (approved.status === "forbidden") return { text: `⚠️ This command requires ${approved.scope ?? approved.role ?? "additional approval"} to approve this pairing request.` };
	return formatApprovedPairingReply(approved);
}
//#endregion
export { approvePendingPairingRequest, selectPendingApprovalRequest };
