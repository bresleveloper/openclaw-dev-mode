import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { C as isDreamingNarrativeSessionStoreKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { o as parseUsageCountedSessionIdFromFileName } from "./transcript-file-names-BZ8jA63H.mjs";
import { a as isSessionArchiveArtifactName, c as isUsageCountedSessionTranscriptFileName } from "./artifacts-C6u8F4sP.mjs";
import { c as hasInterSessionUserProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { g as stripInternalRuntimeContext } from "./internal-runtime-context-DLJtDQoI.mjs";
import { a as renderSessionExportLines, n as hashSessionEntrySnapshot, r as parseSessionTimestampMs, t as collectRawSessionText } from "./session-entry-projection-E2uWbpaJ.mjs";
import { t as resolveSessionResetRecallCutoff } from "./session-reset-recall-Be-x5cWW.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-DHFPcfdZ.mjs";
import { o as stripInboundMetadata } from "./strip-inbound-meta-D65t0FgP.mjs";
import "./bash-tools.exec-output-C0VhBuNW.mjs";
import { n as HEARTBEAT_PROMPT } from "./heartbeat-C40cs1ec.mjs";
import { r as isHeartbeatUserMessage } from "./heartbeat-filter-3DbSzqaf.mjs";
import { t as classifySessionMessageOrigin } from "./session-provenance-2cpkCo2r.mjs";
import path from "node:path";
//#region packages/memory-host-sdk/src/host/session-entry-render.ts
const SESSION_ENTRY_PARSE_YIELD_LINES = 250;
const DIRECT_CRON_PROMPT_RE = /^\[cron:[^\]]+\]\s*/;
const SESSION_RESET_RECALL_CUTOFF = Symbol.for("openclaw.memory.sessionResetRecallCutoff");
function readSessionEntryResetRecallCutoff(entry) {
	const value = Object.getOwnPropertyDescriptor(entry, SESSION_RESET_RECALL_CUTOFF)?.value;
	if (!value || typeof value !== "object" || !("state" in value)) return { state: "invalid" };
	if (value.state === "absent" || value.state === "invalid") return { state: value.state };
	if (value.state === "valid" && "cutoffLine" in value && typeof value.cutoffLine === "number") return {
		state: "valid",
		cutoffLine: value.cutoffLine
	};
	return { state: "invalid" };
}
function attachSessionEntryResetRecallCutoff(entry, cutoff) {
	Object.defineProperty(entry, SESSION_RESET_RECALL_CUTOFF, {
		configurable: false,
		enumerable: false,
		value: cutoff,
		writable: false
	});
	return entry;
}
function isUsageCountedSessionArchiveTranscriptPath(absPath) {
	const fileName = path.basename(absPath);
	return isUsageCountedSessionTranscriptFileName(fileName) && isSessionArchiveArtifactName(fileName) && parseUsageCountedSessionIdFromFileName(fileName) !== null;
}
function hasDreamingNarrativeIdentity(value) {
	return typeof value === "string" && isDreamingNarrativeSessionStoreKey(value);
}
function isDreamingNarrativeGeneratedRecord(record) {
	const candidate = asOptionalRecord(record);
	if (!candidate) return false;
	const data = asOptionalRecord(candidate.data);
	if (candidate.type === "custom" && candidate.customType === "openclaw:bootstrap-context:full" && typeof data?.runId === "string" && data.runId.startsWith("dreaming-narrative-")) return true;
	const message = candidate.type === "message" ? asOptionalRecord(candidate.message) : void 0;
	const metadata = asOptionalRecord(message?.["__openclaw"]);
	return hasDreamingNarrativeIdentity(candidate.runId) || hasDreamingNarrativeIdentity(candidate.sessionKey) || hasDreamingNarrativeIdentity(data?.runId) || hasDreamingNarrativeIdentity(data?.sessionKey) || (message?.role === "assistant" || message?.role === "toolResult") && hasDreamingNarrativeIdentity(metadata?.runId);
}
function hasCronRunSessionKey(value) {
	return typeof value === "string" && isCronRunSessionKey(value);
}
function isCronRunGeneratedRecord(record) {
	const candidate = asOptionalRecord(record);
	return hasCronRunSessionKey(candidate?.sessionKey) || hasCronRunSessionKey(asOptionalRecord(candidate?.data)?.sessionKey);
}
/** Returns the logical memory path for a live SQLite-backed session transcript. */
function sessionPathForSessionIdentity(agentId, sessionId) {
	return path.join("sessions", normalizeAgentId(agentId), `${sessionId}.jsonl`).replace(/\\/g, "/");
}
function normalizeSessionText(value) {
	return value.replace(/\s+/g, " ").trim();
}
const GENERATED_SYSTEM_MESSAGE_RE = /^System(?: \(untrusted\))?: \[[^\]]+\]\s*/;
function sanitizeSessionText(text, role) {
	const strippedInbound = role === "user" ? stripInboundMetadata(text) : text;
	const normalized = normalizeSessionText(stripInternalRuntimeContext(strippedInbound));
	if (!normalized) return null;
	if (role === "user" && (GENERATED_SYSTEM_MESSAGE_RE.test(normalized) || DIRECT_CRON_PROMPT_RE.test(normalized) || isHeartbeatUserMessage({
		role,
		content: normalized
	}, HEARTBEAT_PROMPT))) return null;
	if (isSilentReplyPayloadText(normalized)) return null;
	if (role === "assistant" && normalized === "HEARTBEAT_OK") return null;
	if (isExecCompletionEvent(normalized.replace(GENERATED_SYSTEM_MESSAGE_RE, "").trim())) return null;
	return normalized;
}
function resolveSessionEntryParseYieldLines(opts) {
	const configured = opts.parseYieldEveryLines;
	if (typeof configured === "number" && Number.isFinite(configured)) return Math.max(1, Math.floor(configured));
	return SESSION_ENTRY_PARSE_YIELD_LINES;
}
function sqliteSessionFileState(absPath, identity, stats, updatedAtMs) {
	return {
		absPath,
		path: sessionPathForSessionIdentity(identity.agentId, identity.sessionId),
		mtimeMs: updatedAtMs ?? stats.maxSeq,
		revisionMs: stats.lastMutationAtMs ?? stats.maxSeq,
		size: stats.sizeBytes
	};
}
async function yieldSessionEntryParseIfNeeded(lineIndex, everyLines) {
	if (lineIndex > 0 && lineIndex % everyLines === 0) await new Promise((resolve) => {
		setImmediate(resolve);
	});
}
/** Recognize historical exec notices when exporting conversation text for memory. */
function isExecCompletionEvent(event) {
	const trimmed = event.trim();
	if (/^exec finished(?::|\s*\()/i.test(trimmed)) return true;
	const match = /^exec (completed|failed) \(([a-z0-9_-]{1,64}), (code -?\d+|signal [^)]+)\)(?: :: ([\s\S]*)|\n\n([\s\S]+))?$/i.exec(trimmed);
	return Boolean(match && (match[5] === void 0 || match[5] === "The command was terminated, but external side effects may already have completed. Verify the resulting state before retrying. Do not automatically rerun commands unless repeating them is safe. Use a higher timeout only when the command is known to be safe to retry."));
}
/** Render the worker's admitted snapshot without entering host discovery or restoration. */
function renderSessionEntrySnapshot(absPath, opts, snapshot) {
	return renderSessionEntry(absPath, opts, {
		...sqliteSessionFileState(absPath, opts, snapshot.stats, opts.updatedAtMs),
		kind: "sqlite",
		records: snapshot.events,
		resetRecallCutoff: resolveSessionResetRecallCutoff(snapshot.events),
		sessionKey: snapshot.sessionKey
	});
}
async function renderSessionEntry(absPath, opts, source) {
	const { mtimeMs, size, path: memoryPath } = source;
	const sqliteSource = source.kind === "sqlite" ? source : null;
	const raw = source.kind === "file" ? source.raw : "";
	const sessionStoreClassification = source.kind === "file" ? source.classification : null;
	const collected = [];
	const lineMap = [];
	const messageTimestampsMs = [];
	const lineProvenance = [];
	const parseYieldEveryLines = resolveSessionEntryParseYieldLines(opts);
	const sqliteSessionKey = !opts.sessionKey ? sqliteSource?.sessionKey : void 0;
	let generatedByDreamingNarrative = opts.generatedByDreamingNarrative ?? (sqliteSessionKey ? isDreamingNarrativeSessionStoreKey(sqliteSessionKey) : void 0) ?? sessionStoreClassification?.generatedByDreamingNarrative ?? false;
	let generatedByCronRun = opts.generatedByCronRun ?? (sqliteSessionKey ? isCronRunSessionKey(sqliteSessionKey) : void 0) ?? sessionStoreClassification?.generatedByCronRun ?? false;
	const sessionKind = opts.sessionKind ?? "unknown";
	const allowArchiveRecordCronClassification = isUsageCountedSessionArchiveTranscriptPath(absPath);
	let insideHeartbeatTurn = false;
	let insideRecalledMemoryTurn = false;
	let turnOrigin = "untrusted";
	for (let jsonlIdx = 0, lineStart = 0; sqliteSource ? jsonlIdx < sqliteSource.records.length : lineStart <= raw.length; jsonlIdx++) {
		await yieldSessionEntryParseIfNeeded(jsonlIdx, parseYieldEveryLines);
		let record;
		if (sqliteSource) record = sqliteSource.records[jsonlIdx];
		else {
			const newlineIndex = raw.indexOf("\n", lineStart);
			const lineEnd = newlineIndex === -1 ? raw.length : newlineIndex;
			const line = raw.slice(lineStart, lineEnd);
			lineStart = newlineIndex === -1 ? raw.length + 1 : newlineIndex + 1;
			if (!line.trim()) continue;
			try {
				record = JSON.parse(line);
			} catch {
				continue;
			}
		}
		const identifiesDreamingNarrative = !generatedByDreamingNarrative && isDreamingNarrativeGeneratedRecord(record);
		const identifiesCronRun = !generatedByCronRun && allowArchiveRecordCronClassification && isCronRunGeneratedRecord(record);
		if (identifiesDreamingNarrative || identifiesCronRun) {
			generatedByDreamingNarrative ||= identifiesDreamingNarrative;
			generatedByCronRun ||= identifiesCronRun;
			collected.length = 0;
			lineMap.length = 0;
			messageTimestampsMs.length = 0;
			lineProvenance.length = 0;
		}
		const candidate = asOptionalRecord(record);
		if (candidate?.type !== "message") continue;
		const message = asOptionalRecord(candidate.message);
		if (!message || typeof message.role !== "string") continue;
		if (message.role !== "user" && message.role !== "assistant") continue;
		const timestampMs = parseSessionTimestampMs(candidate, message);
		opts.onTranscriptMessage?.(message, Math.max(0, Math.floor(timestampMs || mtimeMs)));
		const inputProvenance = asOptionalRecord(message.provenance);
		const isHeartbeatUser = message.role === "user" && inputProvenance?.kind === "internal_system" && inputProvenance.sourceTool === "heartbeat";
		if (message.role === "user") {
			insideHeartbeatTurn = isHeartbeatUser;
			insideRecalledMemoryTurn = inputProvenance?.kind === "internal_system" && (inputProvenance.sourceTool === "memory_search" || inputProvenance.sourceTool === "memory_get");
			turnOrigin = classifySessionMessageOrigin(message, turnOrigin);
		}
		if (message.role === "user" && hasInterSessionUserProvenance(message)) continue;
		if (insideHeartbeatTurn || insideRecalledMemoryTurn || generatedByDreamingNarrative || generatedByCronRun) continue;
		const rawText = collectRawSessionText(message.content);
		if (rawText === null) continue;
		const text = sanitizeSessionText(rawText, message.role);
		if (!text) continue;
		const label = message.role === "user" ? "User" : "Assistant";
		const renderedLines = renderSessionExportLines(label, text);
		const memoryProvenance = {
			originClass: classifySessionMessageOrigin(message, turnOrigin),
			sessionKind,
			observedAt: Math.max(0, Math.floor(timestampMs || mtimeMs))
		};
		collected.push(...renderedLines);
		lineMap.push(...renderedLines.map(() => jsonlIdx + 1));
		messageTimestampsMs.push(...renderedLines.map(() => timestampMs));
		lineProvenance.push(...renderedLines.map(() => memoryProvenance));
	}
	const content = collected.join("\n");
	return attachSessionEntryResetRecallCutoff({
		path: memoryPath,
		absPath,
		mtimeMs,
		...sqliteSource ? { revisionMs: sqliteSource.revisionMs } : {},
		size,
		hash: hashSessionEntrySnapshot({
			content,
			lineMap,
			messageTimestampsMs,
			lineProvenance,
			resetRecallCutoff: sqliteSource?.resetRecallCutoff ?? { state: "absent" }
		}),
		content,
		lineMap,
		messageTimestampsMs,
		lineProvenance,
		sessionKind,
		...generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
		...generatedByCronRun ? { generatedByCronRun: true } : {}
	}, sqliteSource?.resetRecallCutoff ?? { state: "absent" });
}
//#endregion
export { renderSessionEntrySnapshot as a, renderSessionEntry as i, isUsageCountedSessionArchiveTranscriptPath as n, sessionPathForSessionIdentity as o, readSessionEntryResetRecallCutoff as r, sqliteSessionFileState as s, attachSessionEntryResetRecallCutoff as t };
