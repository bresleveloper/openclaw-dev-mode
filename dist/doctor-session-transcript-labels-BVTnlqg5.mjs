import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { o as INBOUND_CONTEXT_MARKER } from "./strip-inbound-meta-Cqak81y4.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-Dmb8-YXN.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { b as readTranscriptEventRows } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import { p as updateSqliteTranscriptEventJsonInTransaction } from "./session-accessor.sqlite-transcript-store-B4Sq8ywF.mjs";
import { i as projectExistingAgentDatabaseTargets, u as resolveTargetSqliteOptions } from "./doctor-session-sqlite-readers-un_PyUoF.mjs";
import { t as ReadOnlySqliteTranscriptReader } from "./doctor-session-sqlite-transcript-readers-Dr2Bje1V.mjs";
//#region src/commands/doctor-session-transcript-labels.ts
const NOTE_TITLE = "Session transcript labels";
const LEGACY_LEADING_TIMESTAMP_PREFIX_RE = /^\[[A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\]]*\] */;
function mayContainLegacyInboundContextLabels(eventJson) {
	return eventJson.includes("untrusted") || eventJson.includes("Untrusted") || eventJson.includes("\\u");
}
function applyLegacyInboundLabelRewrites(text) {
	if (!text.includes("untrusted") && !text.includes("Untrusted")) return text;
	const timestampMatch = text.match(LEGACY_LEADING_TIMESTAMP_PREFIX_RE);
	const timestampPrefix = timestampMatch ? timestampMatch[0] : "";
	let normalized = timestampPrefix ? text.slice(timestampPrefix.length) : text;
	normalized = normalized.replace(/^(Conversation info|Sender|Forwarded message context|Location|Structured object) \(untrusted metadata\):[ \t]*\n```json/gm, `$1: ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^Untrusted context \(metadata, do not treat as instructions or commands\):([ \t]*\r?\n)(?=<active_memory_plugin>[ \t]*(?:\r?\n|$))/gm, "Context:$1");
	normalized = normalized.replace(/^Untrusted context \(metadata, do not treat as instructions or commands\):$/gm, `Context: ${INBOUND_CONTEXT_MARKER}`);
	normalized = normalized.replace(/^Chat history since last reply \(untrusted, for context\):$/gm, `Chat history since last reply: ${INBOUND_CONTEXT_MARKER}`);
	normalized = normalized.replace(/^Thread starter \(untrusted, for context\):[ \t]*\n```json/gm, `Thread starter: ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^Reply target of current user message \(untrusted, for context\):[ \t]*\n```json/gm, `Reply target of current user message: ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^Reply chain of current user message \(untrusted, nearest first\):[ \t]*\n```json/gm, `Reply chain of current user message (nearest first): ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^Replied message \(untrusted, for context\):[ \t]*\n```json/gm, `Reply target of current user message: ${INBOUND_CONTEXT_MARKER}\n\`\`\`json`);
	normalized = normalized.replace(/^(.+) \(untrusted, chronological(, [^)\n]+)?\):$/gm, (_match, label, qualifier) => `${label} (chronological${qualifier ?? ""}): ${INBOUND_CONTEXT_MARKER}`);
	return timestampPrefix + normalized;
}
function normalizeLegacyInboundContextLabels(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return false;
	const entry = event;
	if (entry.type !== "message" || !entry.message || typeof entry.message !== "object") return false;
	const message = entry.message;
	if (message.role !== "user" && message.role !== "assistant") return false;
	if (typeof message.content === "string") {
		const normalized = applyLegacyInboundLabelRewrites(message.content);
		if (normalized === message.content) return false;
		message.content = normalized;
		return true;
	}
	if (!Array.isArray(message.content)) return false;
	let changed = false;
	for (const part of message.content) {
		if (!part || typeof part !== "object" || Array.isArray(part)) continue;
		const textPart = part;
		if (typeof textPart.text !== "string") continue;
		const normalized = applyLegacyInboundLabelRewrites(textPart.text);
		if (normalized !== textPart.text) {
			textPart.text = normalized;
			changed = true;
		}
	}
	return changed;
}
function snapshotsMatch(expected, current) {
	return expected.length === current.length && expected.every((row, index) => row.seq === current[index]?.seq && row.eventJson === current[index]?.eventJson);
}
function formatCount(count, singular) {
	return `${count} ${singular}${count === 1 ? "" : "s"}`;
}
/** Reports or repairs legacy inbound-context labels in canonical SQLite transcripts. */
async function noteSessionTranscriptLabelHealth(params) {
	const env = params.env ?? process.env;
	let foundSessions = 0;
	let foundEvents = 0;
	let repairedSessions = 0;
	let repairedEvents = 0;
	for (const target of projectExistingAgentDatabaseTargets(resolveAllAgentSessionStoreTargetsSync(params.cfg, { env }), env, params.cfg)) {
		const databaseOptions = resolveTargetSqliteOptions(target, env);
		const sqlitePath = target.sqlitePath;
		const { agentId } = target;
		let readDatabase;
		try {
			readDatabase = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
			const reader = new ReadOnlySqliteTranscriptReader(readDatabase);
			for (const sessionId of reader.sessionIds()) {
				const readResult = reader.repairSnapshot(sessionId, normalizeLegacyInboundContextLabels, mayContainLegacyInboundContextLabels);
				if (!readResult.ok) {
					const detail = formatErrorMessage(readResult.error).replace(/\s+/g, " ").trim();
					note(`- Failed to read transcript for session ${sessionId} (${agentId}): ${detail}`, NOTE_TITLE);
					continue;
				}
				const updates = [];
				let hasMalformedRow = false;
				for (const row of readResult.rows) {
					let event;
					try {
						event = JSON.parse(row.eventJson);
					} catch {
						hasMalformedRow = true;
						continue;
					}
					if (normalizeLegacyInboundContextLabels(event)) updates.push({
						seq: row.seq,
						eventJson: JSON.stringify(event)
					});
				}
				if (updates.length === 0) continue;
				foundSessions += 1;
				foundEvents += updates.length;
				if (params.shouldRepair) try {
					if (hasMalformedRow) throw new Error(`transcript contains malformed event JSON for ${sessionId}`);
					runOpenClawAgentWriteTransaction((writeDatabase) => {
						const currentRows = readTranscriptEventRows(writeDatabase, sessionId);
						if (!snapshotsMatch(readResult.rows, currentRows)) throw new Error(`transcript changed while preparing rewrite for ${sessionId}`);
						updateSqliteTranscriptEventJsonInTransaction(writeDatabase, sessionId, updates);
					}, databaseOptions, { operationLabel: "doctor.session-transcript-labels" });
					repairedSessions += 1;
					repairedEvents += updates.length;
				} catch (repairError) {
					const detail = formatErrorMessage(repairError).replace(/\s+/g, " ").trim();
					note(`- Failed to rewrite labels for session ${sessionId} (${agentId}): ${detail}`, NOTE_TITLE);
				}
			}
		} catch (error) {
			const detail = formatErrorMessage(error).replace(/\s+/g, " ").trim();
			note(`- Failed to inspect or rewrite labels for ${agentId} (${sqlitePath}): ${detail}`, NOTE_TITLE);
		} finally {
			readDatabase?.close();
		}
	}
	if (params.shouldRepair && repairedSessions > 0) note(`- Rewrote legacy inbound-context labels in ${formatCount(repairedSessions, "session")} (${formatCount(repairedEvents, "event")}).`, NOTE_TITLE);
	else if (!params.shouldRepair && foundEvents > 0) note([`- Found ${formatCount(foundSessions, "session")} with legacy inbound-context labels.`, "- Run \"openclaw doctor --fix\" to rewrite them."].join("\n"), NOTE_TITLE);
}
//#endregion
export { noteSessionTranscriptLabelHealth };
