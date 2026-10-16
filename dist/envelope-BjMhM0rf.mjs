import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { o as resolveUserTimezone } from "./date-time-DNFKWNdt.mjs";
import { a as resolveTimezone, n as formatUtcTimestamp, r as formatZonedTimestamp } from "./format-datetime-QNTzUilb.mjs";
import { n as formatTimeAgo } from "./format-relative-Bcp7RoO9.mjs";
//#region src/channels/sender-label.ts
const OPAQUE_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
/** Resolves the best one-line sender label from available identity fields. */
function resolveSenderLabel(params) {
	const display = normalizeOptionalString(params.name) ?? normalizeOptionalString(params.username) ?? normalizeOptionalString(params.tag) ?? "";
	const idPart = normalizeOptionalString(params.e164) ?? normalizeOptionalString(params.id) ?? "";
	if (display && idPart && display !== idPart && !OPAQUE_UUID_RE.test(idPart)) return `${display} (${idPart})`;
	return display || idPart || null;
}
//#endregion
//#region src/auto-reply/envelope.ts
function sanitizeEnvelopeHeaderPart(value) {
	return value.replaceAll("[", "(").replaceAll("]", ")").replace(/\s+/g, " ").trim();
}
/** Resolves envelope formatting defaults from agent config. */
function resolveEnvelopeFormatOptions(cfg) {
	const defaults = cfg?.agents?.defaults;
	const configuredTimezone = normalizeOptionalString(defaults?.userTimezone);
	return {
		timezone: configuredTimezone ? resolveTimezone(configuredTimezone) ?? "local" : void 0,
		includeTimestamp: true,
		includeElapsed: true,
		userTimezone: defaults?.userTimezone
	};
}
function resolveEnvelopeTimezone(options) {
	const trimmed = normalizeOptionalString(options?.timezone);
	if (!trimmed) return { mode: "local" };
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered === "utc" || lowered === "gmt") return { mode: "utc" };
	if (lowered === "local" || lowered === "host") return { mode: "local" };
	if (lowered === "user") return {
		mode: "iana",
		timeZone: resolveUserTimezone(options?.userTimezone)
	};
	const explicit = resolveTimezone(trimmed);
	return explicit ? {
		mode: "iana",
		timeZone: explicit
	} : { mode: "utc" };
}
let utcWeekdayFormatter;
/** Formats an envelope timestamp using local, UTC, user, or explicit IANA timezone rules. */
function formatAgentEnvelopeTimestamp(ts, options) {
	if (ts === void 0 || options?.includeTimestamp === false) return;
	const date = ts instanceof Date ? ts : new Date(ts);
	if (Number.isNaN(date.getTime())) return;
	const zone = resolveEnvelopeTimezone(options);
	if (zone.mode !== "utc") return formatZonedTimestamp(date, {
		timeZone: zone.mode === "iana" ? zone.timeZone : void 0,
		displaySeconds: true,
		displayWeekday: true
	});
	const formatted = formatUtcTimestamp(date, { displaySeconds: true });
	try {
		const DateTimeFormat = Intl.DateTimeFormat;
		const cached = utcWeekdayFormatter;
		const formatter = cached?.dateTimeFormatConstructor === DateTimeFormat ? cached.formatter : new DateTimeFormat("en-US", {
			timeZone: "UTC",
			weekday: "short"
		});
		const weekday = formatter.format(date);
		if (formatter !== cached?.formatter) utcWeekdayFormatter = {
			dateTimeFormatConstructor: DateTimeFormat,
			formatter
		};
		return `${weekday} ${formatted}`;
	} catch {
		return formatted;
	}
}
function resolveDirectEnvelopeBodyLabel(from) {
	const label = sanitizeEnvelopeHeaderPart(from || "");
	const idMarkerIndex = label.search(/\s+id:/i);
	const displayLabel = idMarkerIndex > 0 ? label.slice(0, idMarkerIndex).trim() : label;
	return displayLabel.includes(":") ? "(sender)" : displayLabel;
}
/** Formats the generic bracketed envelope prepended to agent-visible messages. */
function formatAgentEnvelope(params) {
	const parts = [sanitizeEnvelopeHeaderPart(normalizeOptionalString(params.channel) || "Channel")];
	let elapsed;
	if (params.envelope?.includeElapsed !== false && params.timestamp && params.previousTimestamp) {
		const elapsedMs = (params.timestamp instanceof Date ? params.timestamp.getTime() : params.timestamp) - (params.previousTimestamp instanceof Date ? params.previousTimestamp.getTime() : params.previousTimestamp);
		elapsed = Number.isFinite(elapsedMs) && elapsedMs >= 0 ? formatTimeAgo(elapsedMs, { suffix: false }) : void 0;
	}
	const from = normalizeOptionalString(params.from);
	if (from) {
		const fromLabel = sanitizeEnvelopeHeaderPart(from);
		parts.push(elapsed ? `${fromLabel} +${elapsed}` : fromLabel);
	} else if (elapsed) parts.push(`+${elapsed}`);
	for (const value of [params.host, params.ip]) {
		const normalized = normalizeOptionalString(value);
		if (normalized) parts.push(sanitizeEnvelopeHeaderPart(normalized));
	}
	const ts = formatAgentEnvelopeTimestamp(params.timestamp, params.envelope);
	if (ts) parts.push(ts);
	return `${`[${parts.join(" ")}]`} ${params.body}`;
}
/** Formats an inbound message body with sender attribution appropriate for direct/group chats. */
function formatInboundEnvelope(params) {
	const chatType = normalizeChatType(params.chatType);
	const isDirect = !chatType || chatType === "direct";
	const resolvedSenderRaw = normalizeOptionalString(params.senderLabel) || resolveSenderLabel(params.sender ?? {});
	const resolvedSender = resolvedSenderRaw ? sanitizeEnvelopeHeaderPart(resolvedSenderRaw) : "";
	const directSender = resolveDirectEnvelopeBodyLabel(normalizeOptionalString(params.from));
	const body = isDirect && params.fromMe ? `(self): ${params.body}` : isDirect && directSender ? `${directSender}: ${params.body}` : !isDirect && resolvedSender ? `${resolvedSender}: ${params.body}` : params.body;
	return formatAgentEnvelope({
		channel: params.channel,
		from: params.from,
		timestamp: params.timestamp,
		previousTimestamp: params.previousTimestamp,
		envelope: params.envelope,
		body
	});
}
/** Builds the compact `from` label used in inbound envelope headers. */
function formatInboundFromLabel(params) {
	if (params.isGroup) {
		const label = normalizeOptionalString(params.groupLabel) || params.groupFallback || "Group";
		const id = params.groupId?.trim();
		return id ? `${label} id:${id}` : label;
	}
	const directLabel = params.directLabel.trim();
	const directId = params.directId?.trim();
	if (!directId || directId === directLabel) return directLabel;
	return `${directLabel} id:${directId}`;
}
//#endregion
export { resolveEnvelopeFormatOptions as a, formatInboundFromLabel as i, formatAgentEnvelopeTimestamp as n, formatInboundEnvelope as r, formatAgentEnvelope as t };
