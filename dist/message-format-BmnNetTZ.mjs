import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { n as isRich, r as theme } from "./theme-DzaUZY4q.mjs";
import { t as findChatChannelMeta } from "./chat-meta-CrZhPtTU.mjs";
import "./registry-BKdVEB34.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as formatTargetDisplay } from "./target-resolver-BZNj5Sdk.mjs";
import { n as resolveMessageActionOutcome, t as resolveMessageActionMessageId } from "./message-action-contracts-B8BlEOFc.mjs";
import { n as renderTable, r as renderTerminalSafeTable, t as getTerminalTableWidth } from "./table-BRdXcJHh.mjs";
import { n as shortenText } from "./text-format-D_7c--rP.mjs";
//#region src/infra/outbound/format.ts
const resolveChannelLabel$1 = (channel) => {
	const pluginLabel = getChannelPlugin(channel)?.meta.label;
	if (pluginLabel) return pluginLabel;
	const normalized = normalizeChatChannelId(channel);
	if (normalized) return findChatChannelMeta(normalized)?.label ?? channel;
	return channel;
};
/**
* Formats the human-readable direct delivery summary for CLI output.
*/
function formatOutboundDeliverySummary(channel, result, opts) {
	const action = opts?.action ?? "Sent";
	if (!result) return `✅ ${action} via ${resolveChannelLabel$1(channel)}. Message ID: unknown`;
	const base = `✅ ${action} via ${resolveChannelLabel$1(result.channel)}. Message ID: ${result.messageId}`;
	if (result.target) return `${base} (${result.target.kind} ${result.target.id})`;
	return base;
}
/**
* Formats the human-readable gateway delivery summary for CLI output.
*/
function formatGatewaySummary(params) {
	return `✅ ${params.action ?? "Sent"} via gateway${params.channel ? ` (${params.channel})` : ""}. Message ID: ${params.messageId ?? "unknown"}`;
}
//#endregion
//#region src/commands/message-format.ts
/** Human-readable formatter for `openclaw message` action results. */
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
	if (!payload || typeof payload !== "object") return String(payload);
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
	return renderTable({
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
function renderMessageList(messages, opts, emptyLabel) {
	const cap = opts.displayLimit ?? 25;
	const rows = messages.slice(0, cap).map((m) => {
		const msg = m;
		const id = firstNonemptyString(msg, "id", "ts", "messageId");
		const authorObj = msg.author;
		const author = firstNonemptyString(msg, "authorTag") || firstNonemptyString(authorObj, "username") || firstNonemptyString(msg, "user");
		const time = firstNonemptyString(msg, "timestamp", "ts");
		const text = firstNonemptyString(msg, "content", "text");
		return {
			Time: shortenText(time, 28),
			Author: shortenText(author, 22),
			Text: shortenText(text.replace(/\s+/g, " ").trim(), 90),
			Id: shortenText(id, 22)
		};
	});
	if (rows.length === 0) return theme.muted(emptyLabel);
	return renderTable({
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
/**
* Emit a muted hint when the provider payload signals more results are available
* beyond the current page (e.g. hasMore, nextBatch, @odata.nextLink).
*/
function renderPaginationHint(payload, muted) {
	if (!payload || typeof payload !== "object") return null;
	const obj = payload;
	if (obj.hasMore === true || typeof obj.nextBatch === "string" && obj.nextBatch || typeof obj["@odata.nextLink"] === "string" && obj["@odata.nextLink"]) return muted("More results available. Use --limit to fetch more, or --json for the raw cursor.");
	return null;
}
function formatMessageCliText(result, opts) {
	const rich = isRich();
	const ok = (text) => rich ? theme.success(text) : text;
	const fail = (text) => rich ? theme.error(text) : text;
	const muted = (text) => rich ? theme.muted(text) : text;
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
		return [(successful ? ok : fail)(`${successful ? "✅ Broadcast complete" : notAttemptedCount ? "❌ Broadcast incomplete" : "❌ Broadcast failed"} (${okCount}/${total} succeeded, ${failedCount} failed${notAttemptedCount ? `, ${notAttemptedCount} not attempted` : ""})`), renderTable({
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
	if (result.kind === "send") {
		if (result.handledBy === "core" && result.sendResult) {
			const send = result.sendResult;
			if (send.via === "direct") {
				const directResult = send.result;
				return [ok(formatOutboundDeliverySummary(send.channel, directResult))];
			}
			const gatewayResult = send.result;
			return [ok(formatGatewaySummary({
				channel: send.channel,
				messageId: gatewayResult?.messageId ?? null
			}))];
		}
		const label = resolveChannelLabel(result.channel);
		const msgId = resolveMessageActionMessageId(result.payload);
		return [ok(`✅ Sent via ${label}.${msgId ? ` Message ID: ${msgId}` : ""}`)];
	}
	if (result.kind === "poll") {
		if (result.handledBy === "core" && result.pollResult) {
			const poll = result.pollResult;
			const pollId = poll.result?.pollId;
			const msgId = poll.result?.messageId ?? null;
			let summary;
			if (poll.via === "direct") {
				const directResult = poll.result ? {
					...poll.result,
					channel: poll.channel
				} : void 0;
				summary = formatOutboundDeliverySummary(poll.channel, directResult, { action: "Poll sent" });
			} else summary = formatGatewaySummary({
				action: "Poll sent",
				channel: poll.channel,
				messageId: msgId
			});
			const lines = [ok(summary)];
			if (pollId) lines.push(ok(`Poll id: ${pollId}`));
			return lines;
		}
		const label = resolveChannelLabel(result.channel);
		const msgId = resolveMessageActionMessageId(result.payload);
		return [ok(`✅ Poll sent via ${label}.${msgId ? ` Message ID: ${msgId}` : ""}`)];
	}
	const payload = result.payload;
	const lines = [];
	if (result.action === "react") {
		const added = payload.added;
		const removed = payload.removed;
		if (typeof added === "string" && added.trim()) {
			lines.push(ok(`✅ Reaction added: ${added.trim()}`));
			return lines;
		}
		if (typeof removed === "string" && removed.trim()) {
			lines.push(ok(`✅ Reaction removed: ${removed.trim()}`));
			return lines;
		}
		if (Array.isArray(removed)) {
			const list = normalizeStringEntries(removed).join(", ");
			lines.push(ok(`✅ Reactions removed${list ? `: ${list}` : ""}`));
			return lines;
		}
		lines.push(ok("✅ Reaction updated."));
		return lines;
	}
	const reactionsTable = renderReactions(payload, formatOpts);
	if (reactionsTable !== null && result.action === "reactions") {
		lines.push(heading("Reactions"));
		lines.push(reactionsTable);
		return lines;
	}
	if (result.action === "read" || result.action === "list-pins") {
		const read = result.action === "read";
		const messages = payload && typeof payload === "object" ? payload[read ? "messages" : "pins"] : void 0;
		if (Array.isArray(messages)) {
			const table = renderMessageList(messages, formatOpts, read ? "No messages." : "No pins.");
			lines.push(heading(read ? "Messages" : "Pinned messages"));
			lines.push(table);
			const hint = renderPaginationHint(payload, muted);
			if (hint) lines.push(hint);
			return lines;
		}
	}
	if (result.action === "search") {
		const results = payload.results;
		const list = extractDiscordSearchResultsMessages(results);
		if (list) {
			lines.push(heading("Search results"));
			lines.push(renderMessageList(list, formatOpts, "No results."));
			const hint = renderPaginationHint(payload, muted) ?? renderPaginationHint(results, muted);
			if (hint) lines.push(hint);
			return lines;
		}
	}
	lines.push(ok(`✅ ${result.action} via ${resolveChannelLabel(result.channel)}.`));
	const summary = renderObjectSummary(payload, formatOpts);
	lines.push("");
	lines.push(summary);
	lines.push("");
	lines.push(muted("Tip: use --json for full output."));
	return lines;
}
//#endregion
export { formatMessageCliText };
