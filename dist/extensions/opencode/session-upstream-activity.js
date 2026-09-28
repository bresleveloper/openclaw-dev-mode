import { OPENCODE_SESSION_ID_PATTERN } from "./session-catalog-shared.js";
import { exportOpenCodeSession, queryOpenCodeDatabase } from "./session-catalog.js";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { isExternalUserText, normalizeUserText } from "openclaw/plugin-sdk/session-catalog";
import { runTasksWithConcurrency } from "openclaw/plugin-sdk/concurrency-runtime";
//#region extensions/opencode/session-upstream-activity.ts
const OPENCODE_EXPORT_CONCURRENCY = 4;
const OPENCODE_REPLAY_LOOKBACK_USER_MESSAGES = 50;
const OPENCODE_SHELL_SENTINEL = "The following tool was executed by the user";
function sqlString(value) {
	return `'${value.replaceAll("'", "''")}'`;
}
function readProbeThreadId(probe) {
	if (probe.hostId !== "gateway" || probe.upstreamKind !== "opencode-cli" || !isRecord(probe.upstreamRef) || probe.upstreamRef.threadId !== probe.threadId || !OPENCODE_SESSION_ID_PATTERN.test(probe.threadId)) return;
	return probe.threadId;
}
function readMarker(probe) {
	if (!isRecord(probe.marker)) return;
	return Number.isSafeInteger(probe.marker.seq) && Number(probe.marker.seq) >= 0 && (probe.marker.lastHumanMessageId === null || typeof probe.marker.lastHumanMessageId === "string") ? {
		seq: Number(probe.marker.seq),
		lastHumanMessageId: probe.marker.lastHumanMessageId
	} : void 0;
}
async function readIndicators(threadIds) {
	if (threadIds.length === 0) return /* @__PURE__ */ new Map();
	const query = [
		"SELECT s.id AS id, es.seq AS seq",
		"FROM session AS s",
		"LEFT JOIN event_sequence AS es ON es.aggregate_id = s.id",
		`WHERE s.id IN (${threadIds.map(sqlString).join(", ")})`
	].join(" ");
	const value = await queryOpenCodeDatabase(query);
	if (!Array.isArray(value)) throw new Error("OpenCode returned invalid upstream indicators");
	const indicators = /* @__PURE__ */ new Map();
	for (const row of value) {
		const seq = isRecord(row) && row.seq === null ? 0 : isRecord(row) ? row.seq : void 0;
		if (!isRecord(row) || typeof row.id !== "string" || !OPENCODE_SESSION_ID_PATTERN.test(row.id) || !Number.isSafeInteger(seq) || Number(seq) < 0) throw new Error("OpenCode returned invalid upstream indicators");
		indicators.set(row.id, {
			threadId: row.id,
			seq: Number(seq)
		});
	}
	return indicators;
}
function readExportPart(value) {
	if (!isRecord(value) || typeof value.type !== "string") return;
	const sourceText = isRecord(value.source) && isRecord(value.source.text) && typeof value.source.text.value === "string" && typeof value.source.text.start === "number" && Number.isFinite(value.source.text.start) && typeof value.source.text.end === "number" && Number.isFinite(value.source.text.end) ? {
		value: value.source.text.value,
		start: value.source.text.start,
		end: value.source.text.end
	} : void 0;
	return {
		type: value.type,
		...typeof value.text === "string" ? { text: value.text } : {},
		...typeof value.synthetic === "boolean" ? { synthetic: value.synthetic } : {},
		...typeof value.ignored === "boolean" ? { ignored: value.ignored } : {},
		...isRecord(value.metadata) ? { metadata: value.metadata } : {},
		...typeof value.mime === "string" ? { mime: value.mime } : {},
		...typeof value.filename === "string" ? { filename: value.filename } : {},
		...sourceText ? { sourceText } : {}
	};
}
function visibleTextPart(part, sourceRanges) {
	if (part.type !== "text" || part.text === void 0 || part.synthetic === true || part.ignored === true || part.metadata?.compaction_continue === true) return;
	let text = part.text;
	for (const source of sourceRanges) if (Number.isInteger(source.start) && Number.isInteger(source.end) && source.start >= 0 && source.end >= source.start && source.end <= text.length && text.slice(source.start, source.end) === source.value) text = text.slice(0, source.start) + text.slice(source.end);
	return text;
}
function messageSourceRanges(message) {
	return message.parts.flatMap((part) => part.sourceText ? [part.sourceText] : []).toSorted((left, right) => right.start - left.start);
}
function visibleTextParts(message) {
	const sourceRanges = messageSourceRanges(message);
	return message.parts.flatMap((part) => {
		const text = visibleTextPart(part, sourceRanges);
		return text === void 0 ? [] : [text];
	});
}
function readExportMessages(value) {
	if (!isRecord(value) || !Array.isArray(value.messages)) throw new Error("OpenCode returned an invalid session export");
	return value.messages.flatMap((message) => {
		if (!isRecord(message) || !isRecord(message.info) || !Array.isArray(message.parts)) return [];
		const id = message.info.id;
		const role = message.info.role;
		if (typeof id !== "string" || typeof role !== "string") return [];
		const createdAt = isRecord(message.info.time) && typeof message.info.time.created === "number" && Number.isFinite(message.info.time.created) ? message.info.time.created : void 0;
		return [{
			id,
			role,
			parts: message.parts.flatMap((part) => {
				const parsed = readExportPart(part);
				return parsed ? [parsed] : [];
			}),
			...createdAt === void 0 ? {} : { createdAt }
		}];
	}).toSorted((left, right) => (left.createdAt ?? Number.NEGATIVE_INFINITY) - (right.createdAt ?? Number.NEGATIVE_INFINITY) || left.id.localeCompare(right.id));
}
function normalizedMessageText(message) {
	if (message.role !== "user") return;
	const sourceRanges = messageSourceRanges(message);
	const texts = message.parts.flatMap((part) => {
		const visibleText = visibleTextPart(part, sourceRanges);
		if (visibleText !== void 0) return [visibleText];
		if (part.type === "file" && part.mime !== void 0 && (part.mime.startsWith("image/") || part.mime === "application/pdf")) return [`[Attached ${part.mime}: ${part.filename ?? "file"}]`];
		return [];
	});
	return texts.length > 0 ? normalizeUserText(texts.join("\n")) : void 0;
}
function directHumanText(message) {
	if (message.role !== "user" || message.parts.some((part) => part.type === "compaction") || message.parts.some((part) => part.metadata?.compaction_continue === true)) return;
	const texts = visibleTextParts(message);
	if (texts.length === 0) return;
	const text = normalizeUserText(texts.join("\n"));
	return !text || text === OPENCODE_SHELL_SENTINEL ? void 0 : text;
}
function latestMessageId(current, candidate) {
	return current === null || candidate > current ? candidate : current;
}
function latestBaselineHumanMessageId(messages) {
	let latest = null;
	for (const message of messages) if (directHumanText(message) !== void 0) latest = latestMessageId(latest, message.id);
	return latest;
}
function classifyExport(params) {
	let humanTurns = 0;
	let occurredAt;
	let lastHumanMessageId = params.marker.lastHumanMessageId;
	let latestExternalMessageId;
	const earlierUserTexts = [];
	for (const message of params.messages) {
		const text = directHumanText(message);
		const replay = text !== void 0 && earlierUserTexts.slice(-50).includes(text);
		const newerThanMarker = params.marker.lastHumanMessageId === null || message.id > params.marker.lastHumanMessageId;
		if (text !== void 0 && message.createdAt !== void 0 && newerThanMarker) lastHumanMessageId = latestMessageId(lastHumanMessageId, message.id);
		if (text !== void 0 && !replay && message.createdAt !== void 0 && newerThanMarker && isExternalUserText(params.probe, text)) {
			humanTurns += 1;
			occurredAt = Math.max(occurredAt ?? 0, message.createdAt);
			latestExternalMessageId = message.id;
		}
		if (message.role === "user") {
			earlierUserTexts.push(normalizedMessageText(message));
			if (earlierUserTexts.length > OPENCODE_REPLAY_LOOKBACK_USER_MESSAGES) earlierUserTexts.shift();
		}
	}
	const nextMarker = {
		seq: params.seq,
		lastHumanMessageId
	};
	return {
		kind: "activity",
		sessionKey: params.probe.sessionKey,
		humanTurns,
		nextMarker,
		...humanTurns > 0 ? {
			occurredAt: occurredAt ?? Date.now(),
			dedupeId: latestExternalMessageId ?? String(params.seq)
		} : {}
	};
}
async function linkContinuedOpenCodeSession(sessionKey, threadId) {
	try {
		const indicator = (await readIndicators([threadId])).get(threadId);
		if (!indicator) return { sessionKey };
		const messages = readExportMessages(await exportOpenCodeSession(threadId));
		return {
			sessionKey,
			upstream: {
				kind: "opencode-cli",
				ref: { threadId },
				marker: {
					seq: indicator.seq,
					lastHumanMessageId: latestBaselineHumanMessageId(messages)
				}
			}
		};
	} catch {
		return { sessionKey };
	}
}
async function classifyChangedProbe(probe, indicator) {
	const marker = readMarker(probe);
	if (!marker || indicator.seq === marker.seq) return;
	if (indicator.seq < marker.seq) return {
		kind: "activity",
		sessionKey: probe.sessionKey,
		humanTurns: 0,
		nextMarker: {
			seq: indicator.seq,
			lastHumanMessageId: marker.lastHumanMessageId
		}
	};
	return classifyExport({
		probe,
		marker,
		seq: indicator.seq,
		messages: readExportMessages(await exportOpenCodeSession(probe.threadId))
	});
}
async function checkOpenCodeUpstreamActivity(probes) {
	const eligible = probes.flatMap((probe) => readProbeThreadId(probe) ? [probe] : []);
	let indicators;
	try {
		indicators = await readIndicators([...new Set(eligible.map((probe) => probe.threadId))]);
	} catch {
		return [];
	}
	const { results: outcomes } = await runTasksWithConcurrency({
		tasks: eligible.map((probe) => async () => {
			const indicator = indicators.get(probe.threadId);
			if (!indicator) return {
				kind: "missing",
				sessionKey: probe.sessionKey
			};
			try {
				return await classifyChangedProbe(probe, indicator);
			} catch {
				return;
			}
		}),
		limit: OPENCODE_EXPORT_CONCURRENCY,
		throwOnError: true
	});
	return outcomes.filter((outcome) => outcome !== void 0);
}
//#endregion
export { checkOpenCodeUpstreamActivity, linkContinuedOpenCodeSession };
