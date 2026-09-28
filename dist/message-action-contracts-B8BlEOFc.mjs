import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/infra/outbound/message-action-contracts.ts
function resolveMessageSendOutcome(sendResult, action = "Message") {
	if (sendResult?.deliveryStatus === void 0 || sendResult.deliveryStatus === "sent") return { ok: true };
	switch (sendResult.deliveryStatus) {
		case "suppressed": return {
			ok: false,
			error: `${action} send suppressed: ${sendResult.suppressionReason ?? "unknown reason"}.`,
			...sendResult.sentBeforeError ? { sentBeforeError: true } : {}
		};
		case "failed": return {
			ok: false,
			error: sendResult.error ?? `${action} send failed.`,
			...sendResult.sentBeforeError ? { sentBeforeError: true } : {}
		};
		case "partial_failed": return {
			ok: false,
			error: sendResult.error ?? `${action} send partially failed.`,
			sentBeforeError: true
		};
	}
	return sendResult.deliveryStatus;
}
function resolveMessageActionOutcome(result, action = "Message") {
	if (result.kind === "broadcast") {
		const failure = result.payload.results.find((entry) => !entry.ok);
		return failure ? {
			ok: false,
			error: failure.error ?? "Broadcast failed."
		} : { ok: true };
	}
	if (result.dryRun) return { ok: true };
	const outcome = result.kind === "send" ? resolveMessageSendOutcome(result.sendResult, action) : { ok: true };
	const payload = result.payload;
	if (!outcome.ok || !isRecord(payload) || payload.ok !== false) return outcome;
	const error = [
		payload.error,
		payload.warning,
		payload.hint,
		payload.reason
	].map(normalizeOptionalString).find(Boolean) ?? `Message ${result.action} failed.`;
	return payload.sentBeforeError === true ? {
		ok: false,
		error,
		sentBeforeError: true
	} : {
		ok: false,
		error
	};
}
function resolveMessageActionMessageId(payload) {
	if (!payload || typeof payload !== "object") return;
	const record = payload;
	const direct = normalizeOptionalString(record.messageId);
	if (direct) return direct;
	const result = record.result;
	if (!result || typeof result !== "object") return;
	return normalizeOptionalString(result.messageId);
}
//#endregion
export { resolveMessageActionOutcome as n, resolveMessageActionMessageId as t };
