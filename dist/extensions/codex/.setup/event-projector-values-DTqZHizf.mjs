import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Buffer } from "node:buffer";
//#region extensions/codex/src/app-server/event-projector-values.ts
const BIO_POLICY_SAFETY_ACCESS_BLOCK_PREFIX = "This content was flagged for possible biological risk.";
/** Decode app-server v2 findings with the Codex UI's UTF-8 limits; never truncate a steer. */
function readCodexMisalignmentReview(value) {
	if (!isJsonObject(value)) return;
	const explanation = value.detailedExplanation;
	if (typeof explanation !== "string" || !explanation.trim() || Buffer.byteLength(explanation, "utf8") > 65536) return;
	const message = isJsonObject(value.steer) ? value.steer.message : void 0;
	return {
		explanation,
		...typeof message === "string" && message.trim() && Buffer.byteLength(message, "utf8") <= 1024 ? { continuation: { message } } : {},
		...typeof value.errorType === "string" && value.errorType.trim() ? { errorType: value.errorType } : {}
	};
}
/** Project only Codex's explicit refusal contracts; other policy errors retain their own paths. */
function readCodexProviderRefusal(message, codexErrorInfo, options) {
	if (!message) return;
	if (codexErrorInfo === "cyberPolicy") return {
		category: "cyber",
		message
	};
	if (codexErrorInfo === "misalignmentPolicyViolation") {
		const review = readCodexMisalignmentReview(options?.misalignment);
		return {
			category: "misalignment",
			message,
			...review ? { review } : {},
			...options?.nativeThreadId ? { nativeThreadId: options.nativeThreadId } : {},
			...options?.nativeTurnId ? { nativeTurnId: options.nativeTurnId } : {}
		};
	}
	return message.startsWith(BIO_POLICY_SAFETY_ACCESS_BLOCK_PREFIX) ? {
		category: "bio",
		message
	} : void 0;
}
function codexProviderRefusalDetails(refusal) {
	return {
		provider: "openai",
		category: refusal.category,
		...refusal.review ? { review: refusal.review } : {},
		...refusal.nativeThreadId ? { nativeThreadId: refusal.nativeThreadId } : {},
		...refusal.nativeTurnId ? { nativeTurnId: refusal.nativeTurnId } : {}
	};
}
function codexProviderRefusalDiagnostics(refusal, timestamp) {
	return refusal ? { diagnostics: [{
		type: "provider_refusal",
		timestamp,
		details: codexProviderRefusalDetails(refusal)
	}] } : {};
}
function readNullableString(record, key) {
	const value = record[key];
	if (value === null) return null;
	return typeof value === "string" ? value : void 0;
}
function readCodexErrorNotificationMessage(record) {
	const error = record.error;
	return isJsonObject(error) ? readStringField(error, "message") : void 0;
}
function readHookOutputEntries(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const text = readStringField(entry, "text");
		if (!text) return [];
		const kind = readStringField(entry, "kind");
		return [{
			...kind ? { kind } : {},
			text
		}];
	});
}
function extractRawAssistantText(item) {
	const parts = (Array.isArray(item.content) ? item.content : []).flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const type = readStringField(entry, "type");
		if (type !== "output_text" && type !== "text") return [];
		const value = readStringField(entry, "text");
		return value === void 0 ? [] : [value];
	});
	return parts.length > 0 ? parts.join("").trim() : void 0;
}
function readItem(value) {
	if (!isJsonObject(value)) return;
	const type = typeof value.type === "string" ? value.type : void 0;
	const id = typeof value.id === "string" ? value.id : void 0;
	if (!type || !id) return;
	return value;
}
//#endregion
export { readHookOutputEntries as a, readCodexProviderRefusal as i, extractRawAssistantText as n, readItem as o, readCodexErrorNotificationMessage as r, readNullableString as s, codexProviderRefusalDiagnostics as t };
