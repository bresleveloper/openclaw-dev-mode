import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import { a as findChatChannelMeta } from "./registry-DqsL4UWB.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { n as isRich, r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatTargetDisplay } from "./target-resolver-c-W9fpkt.mjs";
import { i as resolveMessageActionOutcome, r as resolveMessageActionMessageId } from "./message-action-contracts-CNqJc02D.mjs";
import { r as renderTerminalSafeTable, t as getTerminalTableWidth } from "./table-BerrlExF.mjs";
import { n as shortenText } from "./text-format-ZicORTH1.mjs";
//#region src/infra/outbound/format.ts
function formatOutboundDeliverySummary(channel, result, opts) {
	const action = opts?.action ?? "Sent";
	const resultChannel = result ? result.channel : channel;
	let label = getChannelPlugin(resultChannel)?.meta.label;
	if (!label) {
		const normalized = normalizeChatChannelId(resultChannel);
		label = normalized ? findChatChannelMeta(normalized)?.label ?? resultChannel : resultChannel;
	}
	const base = `✅ ${action} via ${label}. Message ID: ${result ? result.messageId : "unknown"}`;
	return result?.target ? `${base} (${result.target.kind} ${result.target.id})` : base;
}
function formatGatewaySummary(params) {
	return `✅ ${params.action ?? "Sent"} via gateway${params.channel ? ` (${params.channel})` : ""}. Message ID: ${params.messageId ?? "unknown"}`;
}
//#endregion
//#region src/commands/message-format.ts
const resolveChannelLabel = (channel) => getLoadedChannelPlugin(channel)?.meta.label ?? channel;
function firstNonemptyString(record, ...keys) {
	for (const key of keys) {
		const value = typeof record?.[key] === "string" && record?.[key];
		if (value) return value;
	}
	return "";
}
function renderSummaryValue(value) {
	if (value == null) return "null";
	if (Array.isArray(value)) return `${value.length} items`;
	switch (typeof value) {
		case "string":
		case "number":
		case "boolean":
		case "bigint":
		case "symbol": return String(value);
		default: return typeof value;
	}
}
function renderObjectSummary(payload, opts) {
	if (!payload || typeof payload !== "object") return sanitizeTerminalText(String(payload));
	const obj = payload;
	const keys = Object.keys(obj);
	if (keys.length === 0) return theme.muted("(empty)");
	const rows = keys.slice(0, 20).map((k) => {
		const value = renderSummaryValue(obj[k]);
		return {
			Key: k,
			Value: shortenText(value, 96)
		};
	});
	return renderTerminalSafeTable({
		width: opts.width,
		columns: [{
			key: "Key",
			header: "Key",
			minWidth: 16
		}, {
			key: "Value",
			header: "Value",
			flex: true,
			minWidth: 24
		}],
		rows
	}).trimEnd();
}
function renderMessageList(messages, opts, emptyLabel, unwrapMessage = false) {
	const cap = opts.displayLimit ?? 25;
	const rows = messages.slice(0, cap).map((m) => {
		const msg = unwrapMessage && isRecord(m) && isRecord(m.message) ? m.message : m;
		const id = firstNonemptyString(msg, "id", "ts", "messageId");
		const authorObj = msg.author;
		let author = firstNonemptyString(msg, "authorTag") || firstNonemptyString(authorObj, "username") || firstNonemptyString(msg, "user");
		if (!author) {
			const from = asOptionalObjectRecord(msg.from);
			author = firstNonemptyString(asOptionalObjectRecord(from?.user ?? from?.application), "displayName", "id");
		}
		const time = firstNonemptyString(msg, "timestamp", "ts", "createdAt");
		const text = firstNonemptyString(msg, "content", "text");
		return {
			Time: shortenText(time, 28),
			Author: shortenText(author, 22),
			Text: shortenText(text.replace(/\s+/g, " ").trim(), 90),
			Id: shortenText(id, 22)
		};
	});
	if (rows.length === 0) return theme.muted(emptyLabel);
	return renderTerminalSafeTable({
		width: opts.width,
		columns: [
			{
				key: "Time",
				header: "Time",
				minWidth: 14
			},
			{
				key: "Author",
				header: "Author",
				minWidth: 10
			},
			{
				key: "Text",
				header: "Text",
				flex: true,
				minWidth: 24
			},
			{
				key: "Id",
				header: "Id",
				minWidth: 10
			}
		],
		rows
	}).trimEnd();
}
function extractDiscordSearchResultsMessages(results) {
	if (!results || typeof results !== "object") return null;
	const raw = results.messages;
	if (!Array.isArray(raw)) return null;
	const flattened = [];
	for (const entry of raw) if (Array.isArray(entry) && entry.length > 0) flattened.push(entry[0]);
	else if (entry && typeof entry === "object") flattened.push(entry);
	return flattened;
}
function renderReactions(payload, opts) {
	if (!payload || typeof payload !== "object") return null;
	const reactions = payload.reactions;
	if (!Array.isArray(reactions)) return null;
	const rows = reactions.slice(0, opts.displayLimit ?? 50).map((r) => {
		const entry = r;
		const emojiObj = entry.emoji;
		const emoji = firstNonemptyString(emojiObj, "raw") || firstNonemptyString(entry, "name", "emoji", "key");
		const count = typeof entry.count === "number" ? String(entry.count) : "";
		const userList = Array.isArray(entry.users) ? entry.users.slice(0, 8).map((u) => {
			if (typeof u === "string") return u;
			if (!u || typeof u !== "object") return "";
			return firstNonemptyString(u, "tag", "username", "id");
		}).filter(Boolean) : [];
		return {
			Emoji: emoji,
			Count: count,
			Users: shortenText(userList.join(", "), 72)
		};
	});
	if (rows.length === 0) return theme.muted("No reactions.");
	return renderTerminalSafeTable({
		width: opts.width,
		columns: [
			{
				key: "Emoji",
				header: "Emoji",
				minWidth: 8
			},
			{
				key: "Count",
				header: "Count",
				align: "right",
				minWidth: 6
			},
			{
				key: "Users",
				header: "Users",
				flex: true,
				minWidth: 20
			}
		],
		rows
	}).trimEnd();
}
function renderPaginationHint(payload, muted) {
	if (!payload || typeof payload !== "object") return null;
	const obj = payload;
	if (obj.hasMore === true || typeof obj.nextBatch === "string" && obj.nextBatch || typeof obj["@odata.nextLink"] === "string" && obj["@odata.nextLink"]) return muted("More results available. Use --limit to fetch more, or --json for the raw cursor.");
	return null;
}
function formatMessageCliText(result, opts) {
	const rich = isRich();
	const ok = (text) => {
		const safeText = sanitizeTerminalText(text);
		return rich ? theme.success(safeText) : safeText;
	};
	const fail = (text) => {
		const safeText = sanitizeTerminalText(text);
		return rich ? theme.error(safeText) : safeText;
	};
	const muted = (text) => {
		const safeText = sanitizeTerminalText(text);
		return rich ? theme.muted(safeText) : safeText;
	};
	const heading = (text) => rich ? theme.heading(text) : text;
	const formatOpts = {
		width: getTerminalTableWidth(),
		displayLimit: opts?.displayLimit
	};
	if (result.dryRun) return [muted(`[dry-run] would run ${result.action} via ${result.channel}`)];
	const outcome = resolveMessageActionOutcome(result);
	if (result.kind === "broadcast") {
		const results = result.payload.results ?? [];
		const rows = results.map((entry) => ({
			Channel: resolveChannelLabel(entry.channel),
			Target: shortenText(formatTargetDisplay({
				channel: entry.channel,
				target: entry.to
			}), 36),
			Status: entry.ok ? "ok" : entry.attempted === false ? "not attempted" : "error",
			Error: entry.ok ? "" : shortenText(entry.error ?? "unknown error", 48)
		}));
		const okCount = results.filter((entry) => entry.ok).length;
		const notAttemptedCount = results.filter((entry) => entry.attempted === false).length;
		const failedCount = results.length - okCount - notAttemptedCount;
		const total = results.length;
		const successful = outcome.ok;
		return [(successful ? ok : fail)(`${successful ? "✅ Broadcast complete" : notAttemptedCount ? "❌ Broadcast incomplete" : "❌ Broadcast failed"} (${okCount}/${total} succeeded, ${failedCount} failed${notAttemptedCount ? `, ${notAttemptedCount} not attempted` : ""})`), renderTerminalSafeTable({
			width: formatOpts.width,
			columns: [
				{
					key: "Channel",
					header: "Channel",
					minWidth: 10
				},
				{
					key: "Target",
					header: "Target",
					minWidth: 12,
					flex: true
				},
				{
					key: "Status",
					header: "Status",
					minWidth: 6
				},
				{
					key: "Error",
					header: "Error",
					minWidth: 20,
					flex: true
				}
			],
			rows
		}).trimEnd()];
	}
	if (!outcome.ok) {
		const messageId = result.kind === "send" ? result.sendResult?.result?.messageId : void 0;
		return [fail(`❌ ${outcome.error}${messageId ? ` Message ID: ${messageId}` : ""}`)];
	}
	if (result.kind === "send" || result.kind === "poll") {
		const send = result.kind === "send" ? result.sendResult : void 0;
		const poll = result.kind === "poll" ? result.pollResult : void 0;
		const delivery = send ?? poll;
		const action = result.kind === "poll" ? "Poll sent" : "Sent";
		if (result.handledBy === "core" && delivery) {
			const pollId = poll?.result?.pollId;
			const directResult = poll?.result ? {
				...poll.result,
				channel: poll.channel
			} : send?.result;
			const lines = [ok(delivery.via === "direct" ? formatOutboundDeliverySummary(delivery.channel, directResult, { action }) : formatGatewaySummary({
				action,
				channel: delivery.channel,
				messageId: delivery.result?.messageId ?? null
			}))];
			if (pollId) lines.push(ok(`Poll id: ${pollId}`));
			return lines;
		}
		const label = resolveChannelLabel(result.channel);
		const msgId = resolveMessageActionMessageId(result.payload);
		return [ok(`✅ ${action} via ${label}.${msgId ? ` Message ID: ${msgId}` : ""}`)];
	}
	const payload = result.payload;
	if (result.action === "react") {
		const added = payload.added;
		const removed = payload.removed;
		if (typeof added === "string" && added.trim()) return [ok(`✅ Reaction added: ${added.trim()}`)];
		if (typeof removed === "string" && removed.trim()) return [ok(`✅ Reaction removed: ${removed.trim()}`)];
		if (Array.isArray(removed)) {
			const list = normalizeStringEntries(removed).join(", ");
			return [ok(`✅ Reactions removed${list ? `: ${list}` : ""}`)];
		}
		return [ok("✅ Reaction updated.")];
	}
	const reactionsTable = renderReactions(payload, formatOpts);
	if (reactionsTable !== null && result.action === "reactions") return [heading("Reactions"), reactionsTable];
	if (result.action === "read" || result.action === "list-pins") {
		const read = result.action === "read";
		let messages = payload && typeof payload === "object" ? payload[read ? "messages" : "pins"] : void 0;
		if (read && !Array.isArray(messages)) {
			const message = asOptionalObjectRecord(payload)?.message;
			if (message && typeof message === "object") messages = [message];
		}
		if (Array.isArray(messages)) {
			const table = renderMessageList(messages, formatOpts, read ? "No messages." : "No pins.", !read && result.channel === "slack");
			const lines = [heading(read ? "Messages" : "Pinned messages"), table];
			const hint = renderPaginationHint(payload, muted);
			if (hint) lines.push(hint);
			return lines;
		}
	}
	if (result.action === "search") {
		const results = payload.results;
		let list = extractDiscordSearchResultsMessages(results);
		if (list === null) {
			const messages = asOptionalObjectRecord(payload)?.messages;
			if (Array.isArray(messages)) list = messages;
		}
		if (list) {
			const lines = [heading("Search results"), renderMessageList(list, formatOpts, "No results.")];
			const hint = renderPaginationHint(payload, muted) ?? renderPaginationHint(results, muted);
			if (hint) lines.push(hint);
			return lines;
		}
	}
	return [
		ok(`✅ ${result.action} via ${resolveChannelLabel(result.channel)}.`),
		"",
		renderObjectSummary(payload, formatOpts),
		"",
		muted("Tip: use --json for full output.")
	];
}
//#endregion
export { formatMessageCliText };
