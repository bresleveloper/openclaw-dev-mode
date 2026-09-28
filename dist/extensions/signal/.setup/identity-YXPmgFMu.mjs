import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
//#region extensions/signal/src/uuid.ts
const UUID_HYPHENATED_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_COMPACT_RE = /^[0-9a-f]{32}$/i;
function looksLikeUuid(value) {
	if (UUID_HYPHENATED_RE.test(value) || UUID_COMPACT_RE.test(value)) return true;
	const compact = value.replace(/-/g, "");
	if (!/^[0-9a-f]+$/i.test(compact)) return false;
	return /[a-f]/i.test(compact);
}
//#endregion
//#region extensions/signal/src/identity.ts
function stripSignalPrefix(value) {
	return value.replace(/^signal:/i, "").trim();
}
function resolveSignalSender(params) {
	const sourceNumber = params.sourceNumber?.trim();
	const sourceUuid = params.sourceUuid?.trim();
	if (sourceNumber) {
		const e164 = normalizeE164(sourceNumber);
		if (e164) return {
			kind: "phone",
			raw: sourceNumber,
			e164,
			...sourceUuid ? { aliases: { uuid: sourceUuid } } : {}
		};
	}
	if (sourceUuid) return {
		kind: "uuid",
		raw: sourceUuid
	};
	return null;
}
function formatSignalSenderId(sender) {
	return sender.kind === "phone" ? sender.e164 : `uuid:${sender.raw}`;
}
function formatSignalSenderDisplay(sender) {
	return sender.kind === "phone" ? sender.e164 : `uuid:${sender.raw}`;
}
function formatSignalPairingIdLine(sender) {
	if (sender.kind === "phone") return `Your Signal number: ${sender.e164}`;
	return `Your Signal sender id: ${formatSignalSenderId(sender)}`;
}
function resolveSignalRecipient(sender) {
	return sender.kind === "phone" ? sender.e164 : sender.raw;
}
function resolveSignalPeerId(sender) {
	return sender.kind === "phone" ? sender.e164 : `uuid:${sender.raw}`;
}
function parseSignalAllowEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed) return null;
	if (trimmed === "*") return { kind: "any" };
	const stripped = stripSignalPrefix(trimmed);
	if (normalizeLowercaseStringOrEmpty(stripped).startsWith("uuid:")) {
		const raw = stripped.slice(5).trim();
		if (!raw) return null;
		return {
			kind: "uuid",
			raw
		};
	}
	if (looksLikeUuid(stripped)) return {
		kind: "uuid",
		raw: stripped
	};
	const e164 = normalizeE164(stripped);
	return e164 ? {
		kind: "phone",
		e164
	} : null;
}
function normalizeSignalAllowRecipient(entry) {
	const parsed = parseSignalAllowEntry(entry);
	if (!parsed || parsed.kind === "any") return;
	return parsed.kind === "phone" ? parsed.e164 : parsed.raw;
}
function isSignalSenderAllowed(sender, allowFrom) {
	const normalizedAllowFrom = allowFrom.flatMap((entry) => {
		const parsed = parseSignalAllowEntry(entry);
		if (!parsed) return [];
		if (parsed.kind === "any") return ["*"];
		return [parsed.kind === "phone" ? `phone:${parsed.e164}` : `uuid:${parsed.raw}`];
	});
	const senderE164 = sender.kind === "phone" ? sender.e164 : sender.aliases?.e164;
	const senderUuid = sender.kind === "uuid" ? sender.raw : sender.aliases?.uuid;
	return resolveAllowlistMatchByCandidates({
		allowList: normalizedAllowFrom,
		candidates: [{
			value: senderE164 ? `phone:${senderE164}` : void 0,
			source: "phone"
		}, {
			value: senderUuid ? `uuid:${senderUuid}` : void 0,
			source: "uuid"
		}]
	}).allowed;
}
//#endregion
export { normalizeSignalAllowRecipient as a, resolveSignalSender as c, isSignalSenderAllowed as i, looksLikeUuid as l, formatSignalSenderDisplay as n, resolveSignalPeerId as o, formatSignalSenderId as r, resolveSignalRecipient as s, formatSignalPairingIdLine as t };
