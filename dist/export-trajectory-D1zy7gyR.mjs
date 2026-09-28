import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { f as resolveConfiguredAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as readRegularFile } from "./regular-file-D4i0kJHS.mjs";
import { b as redactToolPayloadText, p as redactSecrets } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { o as redactSupportString } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { i as hasMeaningfulRetiredMediaCarrier, t as PERSISTED_LEGACY_MEDIA_KEYS } from "./media-facts-BEHTU0wM.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { l as scanSessionTranscriptTree, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-3xvvNd9-.mjs";
import { c as loadTranscriptEvents } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import { l as loadSessionEntryReadOnly, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { a as resolveTrajectoryFilePath, i as TRAJECTORY_RUNTIME_FILE_MAX_BYTES, o as resolveTrajectoryPointerFilePath, s as safeTrajectorySessionFileName, t as TRAJECTORY_POINTER_FILE_MAX_BYTES } from "./paths-DV-XPqk-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-BFzDgQIL.mjs";
import { r as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-CV-eEST-.mjs";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-CJjzDrhT.mjs";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-DPHUXa81.mjs";
import { t as safeJsonStringify } from "./safe-json-CY5cd4H1.mjs";
import { r as loadSqliteTrajectoryRuntimeEvents } from "./runtime-store.sqlite-3vtRfGdn.mjs";
import { n as parseSessionFileEntriesWithWarnings, t as isSessionFileEntry } from "./session-file-parser-C3OG26SR.mjs";
import { a as writeSupportBundleDirectory, i as textSupportBundleFile, n as jsonlSupportBundleFile, r as supportBundleContents, t as jsonSupportBundleFile } from "./diagnostic-support-bundle-BYEENxY_.mjs";
import { n as resolveExplicitSessionStorePath } from "./session-store-targets-DIixS5gT.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/trajectory/runtime-file.ts
async function isRegularNonSymlinkFile(filePath) {
	try {
		const linkStat = await fs.lstat(filePath);
		if (linkStat.isSymbolicLink() || !linkStat.isFile()) return false;
		const stat = await fs.stat(filePath);
		return stat.isFile() && stat.dev === linkStat.dev && stat.ino === linkStat.ino;
	} catch {
		return false;
	}
}
async function readRuntimePointerFile(sessionFile, sessionId) {
	const pointerPath = resolveTrajectoryPointerFilePath(sessionFile);
	try {
		const { buffer } = await readRegularFile({
			filePath: pointerPath,
			maxBytes: TRAJECTORY_POINTER_FILE_MAX_BYTES
		});
		const parsed = JSON.parse(buffer.toString("utf8"));
		if (!isRecord(parsed)) return;
		if (parsed.sessionId !== sessionId || typeof parsed.runtimeFile !== "string") return;
		const runtimeFile = path.resolve(parsed.runtimeFile);
		const safeRuntimeFileName = `${safeTrajectorySessionFileName(sessionId)}.jsonl`;
		if (runtimeFile !== path.resolve(resolveTrajectoryFilePath({
			env: {},
			sessionFile,
			sessionId
		})) && path.basename(runtimeFile) !== safeRuntimeFileName) return;
		return runtimeFile;
	} catch {
		return;
	}
}
async function resolveTrajectoryRuntimeFile(params) {
	if (params.runtimeFile) return params.runtimeFile;
	const candidates = [
		await readRuntimePointerFile(params.sessionFile, params.sessionId),
		resolveTrajectoryFilePath({
			env: {},
			sessionFile: params.sessionFile,
			sessionId: params.sessionId
		}),
		resolveTrajectoryFilePath({
			sessionFile: params.sessionFile,
			sessionId: params.sessionId
		})
	].filter((candidate) => Boolean(candidate));
	for (const candidate of candidates) if (await isRegularNonSymlinkFile(candidate)) return candidate;
}
//#endregion
//#region src/trajectory/export.ts
const MAX_TRAJECTORY_RUNTIME_EVENTS = 2e5;
const MAX_TRAJECTORY_TOTAL_EVENTS = 25e4;
const MAX_TRAJECTORY_SESSION_FILE_BYTES = 52428800;
const MAX_TRAJECTORY_WARNING_ROWS = 20;
function normalizeCompleteSessionTarget(target) {
	if (!target) return;
	const agentId = normalizeOptionalString(target.agentId);
	const sessionId = normalizeOptionalString(target.sessionId);
	const sessionKey = normalizeOptionalString(target.sessionKey);
	const storePath = normalizeOptionalString(target.storePath);
	return agentId && sessionId && sessionKey && storePath ? {
		agentId,
		sessionId,
		sessionKey,
		storePath
	} : void 0;
}
function isFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value);
}
function formatSessionParseWarnings(warnings) {
	return warnings.map((warning) => ({
		source: "session",
		code: warning.code,
		row: warning.row,
		message: warning.code === "invalid-session-json" ? "Skipped a session JSONL row that is not valid JSON." : "Skipped a session JSONL row that is not a session entry object."
	}));
}
function collectSessionEntries(rows, warnings = []) {
	const entries = [];
	const rowByEntry = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (!isSessionFileEntry(row.value)) {
			warnings.push({
				source: "session",
				code: "invalid-session-row",
				row: row.row,
				message: "Skipped a session JSONL row that is not a session entry object."
			});
			continue;
		}
		entries.push(row.value);
		rowByEntry.set(row.value, row.row);
	}
	return {
		entries,
		warnings,
		rowByEntry
	};
}
function migrateLegacySessionEntries(entries) {
	const version = entries.find((entry) => entry.type === "session")?.version ?? 1;
	if (version < 2) {
		let previousId = null;
		let index = 0;
		for (const entry of entries) {
			if (entry.type === "session") {
				entry.version = 2;
				continue;
			}
			const mutable = entry;
			if (typeof mutable.id !== "string") mutable.id = `legacy-${index++}`;
			mutable.parentId = previousId;
			const entryId = mutable.id;
			previousId = typeof entryId === "string" ? entryId : null;
			if (entry.type === "compaction" && typeof mutable.firstKeptEntryIndex === "number") {
				const target = entries[mutable.firstKeptEntryIndex];
				if (target && target.type !== "session") mutable.firstKeptEntryId = target.id;
				delete mutable.firstKeptEntryIndex;
			}
		}
	}
	if (version < 3) for (const entry of entries) {
		if (entry.type === "session") {
			entry.version = 3;
			continue;
		}
		if (entry.type === "message") {
			const message = entry.message;
			if (message?.role === "hookMessage") message.role = "custom";
		}
	}
}
async function readSessionEntries(params) {
	const completeTarget = normalizeCompleteSessionTarget(params.sessionTarget);
	if (completeTarget) {
		const targetKeyAgentId = parseAgentSessionKey(completeTarget.sessionKey)?.agentId;
		const targetKeyEntry = loadSessionEntry({
			agentId: completeTarget.agentId,
			sessionKey: completeTarget.sessionKey,
			storePath: completeTarget.storePath
		});
		if (completeTarget.sessionId !== params.sessionId || params.sessionKey !== void 0 && completeTarget.sessionKey !== params.sessionKey || targetKeyAgentId && targetKeyAgentId !== completeTarget.agentId || targetKeyEntry && targetKeyEntry.sessionId !== completeTarget.sessionId) throw new Error("Trajectory export transcript target does not match the requested session");
		return collectSessionEntries((await loadTranscriptEvents({
			agentId: completeTarget.agentId,
			sessionId: completeTarget.sessionId,
			sessionKey: completeTarget.sessionKey,
			storePath: completeTarget.storePath,
			maxEventBytes: MAX_TRAJECTORY_SESSION_FILE_BYTES
		})).map((value, index) => ({
			row: index + 1,
			value
		})));
	}
	const incompleteTarget = params.sessionTarget ? {
		agentId: normalizeOptionalString(params.sessionTarget.agentId),
		sessionId: normalizeOptionalString(params.sessionTarget.sessionId),
		sessionKey: normalizeOptionalString(params.sessionTarget.sessionKey),
		storePath: normalizeOptionalString(params.sessionTarget.storePath)
	} : void 0;
	if (!params.sessionFile) throw new Error("Trajectory export requires a transcript identity or artifact file");
	const marker = parseSqliteSessionFileMarker(params.sessionFile);
	if (!marker) {
		const { entries, warnings, rowByEntry } = parseSessionFileEntriesWithWarnings(await fs.readFile(params.sessionFile, "utf8"));
		return {
			entries,
			warnings: formatSessionParseWarnings(warnings),
			rowByEntry
		};
	}
	if (marker.sessionId !== params.sessionId) throw new Error("Trajectory export legacy marker does not match the requested session");
	const targetKeyAgentId = parseAgentSessionKey(incompleteTarget?.sessionKey)?.agentId;
	const targetKeyEntry = incompleteTarget?.sessionKey && marker ? loadSessionEntry({
		agentId: marker.agentId,
		sessionKey: incompleteTarget.sessionKey,
		storePath: marker.storePath
	}) : void 0;
	if (incompleteTarget && (incompleteTarget.agentId && incompleteTarget.agentId !== marker.agentId || incompleteTarget.sessionId && incompleteTarget.sessionId !== marker.sessionId || targetKeyAgentId && targetKeyAgentId !== marker.agentId || incompleteTarget.sessionKey && targetKeyEntry?.sessionId !== marker.sessionId || incompleteTarget.storePath && path.resolve(incompleteTarget.storePath) !== path.resolve(marker.storePath))) throw new Error("Trajectory export transcript target conflicts with the legacy marker");
	const suppliedKeyEntry = params.sessionKey ? loadSessionEntry({
		agentId: marker.agentId,
		sessionKey: params.sessionKey,
		storePath: marker.storePath
	}) : void 0;
	const markerMatches = listSessionEntriesCore({
		agentId: marker.agentId,
		storePath: marker.storePath
	}).filter(({ entry }) => entry.sessionId === marker.sessionId);
	if (suppliedKeyEntry && suppliedKeyEntry.sessionId !== marker.sessionId) throw new Error("Trajectory export session key conflicts with the legacy marker");
	if (params.sessionKey && !suppliedKeyEntry && markerMatches.length > 0) throw new Error("Trajectory export session key is not mapped to the legacy marker");
	const markerSessionKey = suppliedKeyEntry ? params.sessionKey : resolvePreferredSessionKeyForSessionIdMatches(markerMatches.map(({ sessionKey, entry }) => [sessionKey, entry]), marker.sessionId) ?? (markerMatches.length === 0 ? params.sessionKey : void 0);
	if (!markerSessionKey && markerMatches.length > 0) throw new Error("Trajectory export legacy marker session key is ambiguous");
	return collectSessionEntries((await loadTranscriptEvents({
		agentId: marker.agentId,
		sessionId: marker.sessionId,
		...markerSessionKey ? { sessionKey: markerSessionKey } : {},
		storePath: marker.storePath,
		maxEventBytes: MAX_TRAJECTORY_SESSION_FILE_BYTES
	})).map((value, index) => ({
		row: index + 1,
		value
	})));
}
async function readSessionBranch(params) {
	const { entries: fileEntries, warnings, rowByEntry } = await readSessionEntries(params);
	migrateLegacySessionEntries(fileEntries);
	const header = fileEntries.find((entry) => entry.type === "session") ?? null;
	const entries = fileEntries.filter((entry) => entry.type !== "session" && isCanonicalSessionTranscriptEntry(entry) && typeof entry.id === "string");
	const tree = scanSessionTranscriptTree(fileEntries);
	if (!tree.hasLeafUpdate) return {
		header,
		leafId: entries.at(-1)?.id ?? null,
		branchEntries: entries,
		warnings
	};
	const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
	const branchEntries = [];
	const seen = /* @__PURE__ */ new Set();
	let descendantEntry;
	let currentId = tree.leafId;
	while (currentId) {
		if (seen.has(currentId)) {
			const cycleEntry = tree.byId.get(currentId)?.entry;
			warnings.push({
				source: "session",
				code: "cyclic-session-branch",
				row: cycleEntry ? rowByEntry.get(cycleEntry) ?? 0 : 0,
				message: "Stopped trajectory session branch export at a cyclic parent link."
			});
			break;
		}
		seen.add(currentId);
		const current = tree.byId.get(currentId);
		if (!current) {
			warnings.push({
				source: "session",
				code: "incomplete-session-branch",
				row: 0,
				message: "Exported the reachable session branch suffix after a missing parent link."
			});
			break;
		}
		const visibleEntry = entriesById.get(currentId);
		if (visibleEntry) {
			const normalizedEntry = {
				...visibleEntry,
				parentId: current.parentId
			};
			if (descendantEntry) descendantEntry.parentId = normalizedEntry.id;
			branchEntries.unshift(normalizedEntry);
			descendantEntry = normalizedEntry;
		}
		if (current.parentId && !tree.byId.has(current.parentId)) {
			warnings.push({
				source: "session",
				code: "incomplete-session-branch",
				row: rowByEntry.get(current.entry) ?? 0,
				message: "Exported the reachable session branch suffix after a missing parent link."
			});
			break;
		}
		currentId = current.parentId;
	}
	return {
		header,
		leafId: tree.leafId,
		branchEntries,
		warnings
	};
}
async function parseJsonlFile(filePath, params) {
	let stat;
	try {
		stat = await fs.stat(filePath);
	} catch (error) {
		if (error.code === "ENOENT") return {
			events: [],
			warnings: []
		};
		throw error;
	}
	if (!stat.isFile()) return {
		events: [],
		warnings: []
	};
	if (stat.size > params.maxBytes) throw new Error(`Trajectory runtime file is too large to export (${stat.size} bytes; limit ${params.maxBytes})`);
	const rows = (await fs.readFile(filePath, "utf8")).split(/\r?\n/u);
	const parsed = [];
	const warnings = [];
	for (const [index, rawLine] of rows.entries()) {
		const row = rawLine.trim();
		if (!row) continue;
		if (parsed.length >= params.maxEvents) throw new Error(`Trajectory runtime file has too many events to export (limit ${params.maxEvents})`);
		try {
			const value = JSON.parse(row);
			if (!params.validate || params.validate(value)) {
				const typedValue = value;
				if (!params.include || params.include(typedValue)) parsed.push(typedValue);
			} else warnings.push({
				source: "runtime",
				code: "invalid-runtime-event",
				row: index + 1,
				message: "Skipped a runtime trajectory JSONL row that does not match the session schema."
			});
		} catch {
			warnings.push({
				source: "runtime",
				code: "invalid-runtime-json",
				row: index + 1,
				message: "Skipped a runtime trajectory JSONL row that is not valid JSON."
			});
		}
	}
	return {
		events: parsed,
		warnings
	};
}
async function readRuntimeTrajectoryEvents(params) {
	const marker = normalizeCompleteSessionTarget(params.sessionTarget) ?? parseSqliteSessionFileMarker(params.sessionFile);
	if (marker && marker.sessionId !== params.sessionId) throw new Error("Trajectory runtime target does not match the requested session");
	if (marker) return {
		events: await loadSqliteTrajectoryRuntimeEvents({
			agentId: marker.agentId,
			sessionId: marker.sessionId,
			storePath: marker.storePath,
			maxEventBytes: TRAJECTORY_RUNTIME_FILE_MAX_BYTES,
			maxEventCount: MAX_TRAJECTORY_RUNTIME_EVENTS
		}),
		warnings: []
	};
	if (!params.sessionFile) return {
		events: [],
		warnings: []
	};
	const runtimeFile = await resolveTrajectoryRuntimeFile({
		runtimeFile: params.runtimeFile,
		sessionFile: params.sessionFile,
		sessionId: params.sessionId
	});
	if (!runtimeFile) return {
		events: [],
		warnings: []
	};
	return {
		...await parseJsonlFile(runtimeFile, {
			maxBytes: TRAJECTORY_RUNTIME_FILE_MAX_BYTES,
			maxEvents: MAX_TRAJECTORY_RUNTIME_EVENTS,
			include: (value) => value.sessionId === params.sessionId,
			validate: isRuntimeTrajectoryEvent
		}),
		runtimeFile
	};
}
function isRuntimeTrajectoryEvent(value) {
	if (!isRecord(value)) return false;
	return value.traceSchema === "openclaw-trajectory" && value.schemaVersion === 1 && value.source === "runtime" && typeof value.type === "string" && typeof value.ts === "string" && Number.isFinite(Date.parse(value.ts)) && isFiniteNumber(value.seq) && typeof value.sessionId === "string" && (!("data" in value) || value.data === void 0 || isRecord(value.data));
}
function summarizeJsonlWarnings(warnings) {
	const byKey = /* @__PURE__ */ new Map();
	for (const warning of warnings) {
		const key = `${warning.source}:${warning.code}`;
		const existing = byKey.get(key);
		if (existing) {
			existing.count += 1;
			if (existing.rows.length < MAX_TRAJECTORY_WARNING_ROWS) existing.rows.push(warning.row);
			continue;
		}
		byKey.set(key, {
			source: warning.source,
			code: warning.code,
			count: 1,
			rows: [warning.row],
			message: warning.message
		});
	}
	return [...byKey.values()];
}
function normalizeTimestamp(value) {
	if (typeof value === "number" && Number.isFinite(value)) {
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
	}
	if (typeof value === "string") {
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
	}
	return (/* @__PURE__ */ new Date(0)).toISOString();
}
function resolveMessageEventType(message) {
	if (message.role === "user") return "user.message";
	if (message.role === "assistant") return "assistant.message";
	if (message.role === "toolResult") return "tool.result";
	return `message.${message.role}`;
}
function extractAssistantToolCalls(message) {
	if (message.role !== "assistant" || !Array.isArray(message.content)) return [];
	return message.content.flatMap((block, index) => {
		if (!block || typeof block !== "object") return [];
		const typedBlock = block;
		const blockType = typeof typedBlock.type === "string" ? typedBlock.type.trim().toLowerCase() : "";
		if (blockType !== "toolcall" && blockType !== "tooluse" && blockType !== "functioncall") return [];
		return [{
			id: typeof typedBlock.id === "string" ? typedBlock.id : void 0,
			name: typeof typedBlock.name === "string" ? typedBlock.name : void 0,
			arguments: typedBlock.arguments ?? typedBlock.input ?? typedBlock.parameters,
			index
		}];
	});
}
function sanitizeTrajectoryExportValue(value) {
	return redactSecrets(sanitizeDiagnosticPayload(value));
}
function buildTranscriptEvents(params) {
	const events = [];
	let seq = 0;
	for (const entry of params.entries) {
		const push = (type, data) => {
			events.push({
				traceSchema: "openclaw-trajectory",
				schemaVersion: 1,
				traceId: params.traceId,
				source: "transcript",
				type,
				ts: normalizeTimestamp(entry.timestamp),
				seq: 0,
				sourceSeq: seq += 1,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				entryId: entry.id,
				parentEntryId: entry.parentId,
				data
			});
		};
		switch (entry.type) {
			case "message":
				push(resolveMessageEventType(entry.message), { message: sanitizeDiagnosticPayload(entry.message) });
				for (const toolCall of extractAssistantToolCalls(entry.message)) push("tool.call", {
					toolCallId: toolCall.id,
					name: toolCall.name,
					arguments: sanitizeDiagnosticPayload(toolCall.arguments),
					assistantEntryId: entry.id,
					blockIndex: toolCall.index
				});
				break;
			case "compaction":
				push("session.compaction", {
					summary: entry.summary,
					firstKeptEntryId: entry.firstKeptEntryId,
					tokensBefore: entry.tokensBefore,
					details: sanitizeDiagnosticPayload(entry.details),
					fromHook: entry.fromHook ?? false
				});
				break;
			case "reset":
				push("session.reset", {
					reason: entry.reason,
					firstKeptEntryId: entry.firstKeptEntryId
				});
				break;
			case "branch_summary":
				push("session.branch_summary", {
					fromId: entry.fromId,
					summary: entry.summary,
					details: sanitizeDiagnosticPayload(entry.details),
					fromHook: entry.fromHook ?? false
				});
				break;
			case "custom":
				push("session.custom", {
					customType: entry.customType,
					data: sanitizeDiagnosticPayload(entry.data)
				});
				break;
			case "custom_message":
				push("session.custom_message", {
					customType: entry.customType,
					content: sanitizeDiagnosticPayload(entry.content),
					details: sanitizeDiagnosticPayload(entry.details),
					display: entry.display
				});
				break;
			case "thinking_level_change":
				push("session.thinking_level_change", { thinkingLevel: entry.thinkingLevel });
				break;
			case "model_change":
				push("session.model_change", {
					provider: entry.provider,
					modelId: entry.modelId
				});
				break;
			case "label":
				push("session.label", {
					targetId: entry.targetId,
					label: entry.label
				});
				break;
			case "session_info": push("session.info", { name: entry.name });
		}
	}
	return events;
}
function assertCanonicalTrajectoryInputs(entries, runtimeEvents) {
	const branchHasLegacy = entries.some((entry) => entry.type === "message" && isRecord(entry.message) && (Object.hasOwn(entry.message, "media") || PERSISTED_LEGACY_MEDIA_KEYS.some((key) => Object.hasOwn(entry.message, key))));
	const runtimeHasLegacy = runtimeEvents.some((event) => Array.isArray(event.data?.messagesSnapshot) && event.data.messagesSnapshot.some((message) => isRecord(message) && hasMeaningfulRetiredMediaCarrier(message)));
	if (branchHasLegacy || runtimeHasLegacy) throw new Error("Trajectory export input contains retired top-level media fields; migrate the source transcript before exporting.");
}
function sortTrajectoryEvents(events) {
	const sourceOrder = {
		runtime: 0,
		transcript: 1,
		export: 2
	};
	const sorted = events.toSorted((left, right) => {
		const byTs = left.ts.localeCompare(right.ts);
		if (byTs !== 0) return byTs;
		const bySource = sourceOrder[left.source] - sourceOrder[right.source];
		if (bySource !== 0) return bySource;
		return (left.sourceSeq ?? left.seq) - (right.sourceSeq ?? right.seq);
	});
	for (const [index, event] of sorted.entries()) event.seq = index + 1;
	return sorted;
}
function trajectoryJsonlFile(pathName, events) {
	const lines = events.map((event) => safeJsonStringify(event)).filter((line) => Boolean(line));
	return jsonlSupportBundleFile(pathName, lines);
}
function redactTrajectoryBundleFileContent(file) {
	return {
		...file,
		content: redactToolPayloadText(file.content)
	};
}
function buildTrajectoryExportRedaction(params) {
	const env = process.env;
	return {
		env,
		stateDir: resolveStateDir(env),
		workspaceDir: path.resolve(params.workspaceDir)
	};
}
function redactWorkspacePathString(value, redaction) {
	const workspaceDir = redaction.workspaceDir;
	if (!workspaceDir) return value;
	const normalizedWorkspaceDir = workspaceDir.replaceAll("\\", "/");
	let next = value;
	for (const candidate of /* @__PURE__ */ new Set([workspaceDir, normalizedWorkspaceDir])) {
		if (!candidate) continue;
		const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		next = next.replace(new RegExp(`${escaped}(?=$|[\\\\/])`, "gu"), "$WORKSPACE_DIR");
	}
	return next;
}
function maybeRedactPathString(value, redaction) {
	const workspaceRedacted = redactWorkspacePathString(value, redaction);
	if (workspaceRedacted !== value || path.isAbsolute(workspaceRedacted) || workspaceRedacted.includes(redaction.stateDir) || (redaction.env.HOME ? workspaceRedacted.includes(redaction.env.HOME) : false) || (redaction.env.USERPROFILE ? workspaceRedacted.includes(redaction.env.USERPROFILE) : false)) return redactSupportString(workspaceRedacted, redaction);
	return workspaceRedacted;
}
function redactLocalPathValues(value, redaction) {
	if (typeof value === "string") return maybeRedactPathString(value, redaction);
	if (Array.isArray(value)) return value.map((entry) => redactLocalPathValues(entry, redaction));
	if (!value || typeof value !== "object") return value;
	const record = value;
	const next = {};
	for (const [key, entry] of Object.entries(record)) next[key] = redactLocalPathValues(entry, redaction);
	return next;
}
function uniqueRedactedObjectKey(key, usedKeys) {
	if (!usedKeys.has(key)) {
		usedKeys.add(key);
		return key;
	}
	let index = 2;
	while (usedKeys.has(`${key}#${index}`)) index += 1;
	const unique = `${key}#${index}`;
	usedKeys.add(unique);
	return unique;
}
function redactTrajectoryExportObjectKeys(value, redaction) {
	if (Array.isArray(value)) return value.map((entry) => redactTrajectoryExportObjectKeys(entry, redaction));
	if (!value || typeof value !== "object") return value;
	const usedKeys = /* @__PURE__ */ new Set();
	const next = {};
	for (const [key, entry] of Object.entries(value)) {
		const redactedKey = redactToolPayloadText(maybeRedactPathString(key, redaction));
		next[uniqueRedactedObjectKey(redactedKey, usedKeys)] = redactTrajectoryExportObjectKeys(entry, redaction);
	}
	return next;
}
function redactTrajectoryExportValue(value, redaction) {
	return redactTrajectoryExportObjectKeys(sanitizeTrajectoryExportValue(redactLocalPathValues(value, redaction)), redaction);
}
function redactEventForExport(event, redaction) {
	return redactTrajectoryExportValue(event, redaction);
}
function resolveRuntimeContext(runtimeEvents) {
	const runtimeData = runtimeEvents.findLast((event) => event.type === "context.compiled")?.data;
	const toolsValue = Array.isArray(runtimeData?.tools) ? runtimeData.tools : void 0;
	return {
		systemPrompt: typeof runtimeData?.systemPrompt === "string" ? runtimeData.systemPrompt : void 0,
		tools: toolsValue
	};
}
function resolveLatestRuntimeEventData(runtimeEvents, type) {
	return runtimeEvents.findLast((candidate) => candidate.type === type)?.data;
}
function normalizePathForMatch(value) {
	return value.replaceAll("\\", "/").trim().toLowerCase();
}
function collectPotentialPathStrings(value) {
	const found = /* @__PURE__ */ new Set();
	const visit = (input) => {
		if (!input || typeof input !== "object") return;
		if (Array.isArray(input)) {
			for (const entry of input) visit(entry);
			return;
		}
		for (const [key, entry] of Object.entries(input)) if (typeof entry === "string" && (key.toLowerCase().includes("path") || entry.endsWith("SKILL.md") || entry.endsWith("skill.md"))) found.add(entry);
		else visit(entry);
	};
	visit(value);
	return [...found];
}
function markInvokedSkills(params) {
	if (!params.skills || typeof params.skills !== "object") return params.skills;
	const skillsRecord = params.skills;
	if (!Array.isArray(skillsRecord.entries) || skillsRecord.entries.length === 0) return params.skills;
	const invokedPaths = new Set(params.events.flatMap((event) => {
		if (event.type !== "tool.call") return [];
		return collectPotentialPathStrings(event.data?.arguments);
	}));
	const normalizedInvokedPaths = new Set([...invokedPaths].map((value) => normalizePathForMatch(value)));
	const entries = skillsRecord.entries.map((entry) => {
		const rawPath = typeof entry.filePath === "string" ? entry.filePath : void 0;
		const normalizedPath = rawPath ? normalizePathForMatch(rawPath) : void 0;
		const skillDirName = rawPath?.replaceAll("\\", "/").split("/").slice(-2, -1)[0]?.toLowerCase() ?? void 0;
		const invoked = normalizedPath ? [...normalizedInvokedPaths].some((candidate) => candidate === normalizedPath || candidate.endsWith(normalizedPath) || (skillDirName ? candidate.endsWith(`/${skillDirName}/skill.md`) : false)) : false;
		return invoked ? {
			...entry,
			invoked,
			invocationDetectedBy: "tool-call-file-path"
		} : {
			...entry,
			invoked: false
		};
	});
	return {
		...skillsRecord,
		entries
	};
}
function buildMetadataCapture(params) {
	const runtimeMetadata = resolveLatestRuntimeEventData(params.runtimeEvents, "trace.metadata");
	if (!runtimeMetadata) return;
	const modelFallback = (() => {
		const latest = params.runtimeEvents.findLast((event) => event.provider || event.modelId || event.modelApi);
		if (!latest?.provider && !latest?.modelId && !latest?.modelApi) return;
		return {
			provider: latest.provider,
			name: latest.modelId,
			api: latest.modelApi
		};
	})();
	return {
		traceSchema: "openclaw-trajectory",
		schemaVersion: 1,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		traceId: params.manifest.traceId,
		sessionId: params.manifest.sessionId,
		sessionKey: params.manifest.sessionKey,
		harness: runtimeMetadata.harness,
		model: runtimeMetadata.model ?? modelFallback,
		config: runtimeMetadata.config,
		plugins: runtimeMetadata.plugins,
		skills: markInvokedSkills({
			skills: runtimeMetadata.skills,
			events: params.events
		}),
		prompting: runtimeMetadata.prompting,
		redaction: runtimeMetadata.redaction,
		metadata: runtimeMetadata.metadata
	};
}
function buildArtifactsCapture(params) {
	const cohortStart = params.runtimeEvents.findLastIndex((event) => event.type === "session.started");
	const selectedEnd = (cohortStart < 0 ? params.runtimeEvents.filter((event) => event.type === "session.ended" && isFiniteNumber(event.data?.startedAt)).toSorted((left, right) => Number(left.data?.startedAt) - Number(right.data?.startedAt)).at(-1) : void 0) ?? (cohortStart < 0 ? params.runtimeEvents.findLast((event) => event.type === "session.ended") : void 0);
	const cohortRunId = params.runtimeEvents[cohortStart]?.runId ?? selectedEnd?.runId ?? params.runtimeEvents.at(-1)?.runId;
	const cohortEnd = selectedEnd ? params.runtimeEvents.lastIndexOf(selectedEnd) + 1 : params.runtimeEvents.length;
	const partialStart = selectedEnd ? params.runtimeEvents.findLastIndex((event, index) => index < cohortEnd - 1 && event.type === "session.ended" && event.runId === cohortRunId) + 1 : cohortStart;
	const cohort = params.runtimeEvents.slice(Math.max(0, partialStart), cohortEnd).filter((event) => cohortRunId === void 0 || event.runId === cohortRunId);
	const runtimeArtifacts = resolveLatestRuntimeEventData(cohort, "trace.artifacts");
	const runtimeCompletion = resolveLatestRuntimeEventData(cohort, "model.completed");
	const runtimeEnd = resolveLatestRuntimeEventData(cohort, "session.ended");
	if (!runtimeArtifacts && !runtimeCompletion && !runtimeEnd) return;
	return {
		traceSchema: "openclaw-trajectory",
		schemaVersion: 1,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		traceId: params.manifest.traceId,
		sessionId: params.manifest.sessionId,
		sessionKey: params.manifest.sessionKey,
		finalStatus: runtimeArtifacts?.finalStatus ?? runtimeEnd?.status,
		aborted: runtimeArtifacts?.aborted ?? runtimeEnd?.aborted,
		externalAbort: runtimeArtifacts?.externalAbort ?? runtimeEnd?.externalAbort,
		timedOut: runtimeArtifacts?.timedOut ?? runtimeEnd?.timedOut,
		idleTimedOut: runtimeArtifacts?.idleTimedOut ?? runtimeEnd?.idleTimedOut,
		timedOutDuringCompaction: runtimeArtifacts?.timedOutDuringCompaction ?? runtimeEnd?.timedOutDuringCompaction,
		timedOutDuringToolExecution: runtimeArtifacts?.timedOutDuringToolExecution ?? runtimeEnd?.timedOutDuringToolExecution,
		timedOutByRunBudget: runtimeArtifacts?.timedOutByRunBudget ?? runtimeEnd?.timedOutByRunBudget,
		promptError: runtimeArtifacts?.promptError ?? runtimeEnd?.promptError ?? runtimeCompletion?.promptError,
		promptErrorSource: runtimeArtifacts?.promptErrorSource ?? runtimeCompletion?.promptErrorSource,
		terminalError: runtimeArtifacts?.terminalError ?? runtimeEnd?.terminalError ?? runtimeCompletion?.terminalError,
		usage: runtimeArtifacts?.usage ?? runtimeCompletion?.usage,
		promptCache: runtimeArtifacts?.promptCache ?? runtimeCompletion?.promptCache,
		compactionCount: runtimeArtifacts?.compactionCount ?? runtimeCompletion?.compactionCount,
		assistantTexts: runtimeArtifacts?.assistantTexts ?? runtimeCompletion?.assistantTexts,
		stopReason: runtimeArtifacts?.stopReason ?? runtimeCompletion?.stopReason ?? runtimeEnd?.stopReason,
		finalPromptText: runtimeArtifacts?.finalPromptText ?? runtimeCompletion?.finalPromptText,
		finalPromptTextOriginalLength: runtimeArtifacts?.finalPromptTextOriginalLength ?? runtimeCompletion?.finalPromptTextOriginalLength,
		itemLifecycle: runtimeArtifacts?.itemLifecycle,
		toolMetas: runtimeArtifacts?.toolMetas,
		didSendViaMessagingTool: runtimeArtifacts?.didSendViaMessagingTool,
		successfulCronAdds: runtimeArtifacts?.successfulCronAdds,
		messagingToolSentTexts: runtimeArtifacts?.messagingToolSentTexts,
		messagingToolSentMediaUrls: runtimeArtifacts?.messagingToolSentMediaUrls,
		messagingToolSentTargets: runtimeArtifacts?.messagingToolSentTargets,
		lastToolError: runtimeArtifacts?.lastToolError
	};
}
function buildPromptsCapture(params) {
	const runtimeMetadata = resolveLatestRuntimeEventData(params.runtimeEvents, "trace.metadata");
	const latestCompiled = resolveLatestRuntimeEventData(params.runtimeEvents, "context.compiled");
	const submittedPrompts = params.runtimeEvents.filter((event) => event.type === "prompt.submitted").map((event) => event.data?.prompt).filter((prompt) => typeof prompt === "string");
	const systemPrompt = (typeof latestCompiled?.systemPrompt === "string" ? latestCompiled.systemPrompt : void 0) ?? params.runtimeContext.systemPrompt;
	const skillsPrompt = runtimeMetadata?.prompting && typeof runtimeMetadata.prompting === "object" && typeof runtimeMetadata.prompting.skillsPrompt === "string" ? runtimeMetadata.prompting.skillsPrompt : void 0;
	const userPromptPrefixText = runtimeMetadata?.prompting && typeof runtimeMetadata.prompting === "object" && typeof runtimeMetadata.prompting.userPromptPrefixText === "string" ? runtimeMetadata.prompting.userPromptPrefixText : void 0;
	const promptReport = runtimeMetadata?.prompting && typeof runtimeMetadata.prompting === "object" && typeof runtimeMetadata.prompting.systemPromptReport === "object" ? runtimeMetadata.prompting.systemPromptReport : void 0;
	if (!systemPrompt && submittedPrompts.length === 0 && !skillsPrompt && !userPromptPrefixText) return;
	return {
		traceSchema: "openclaw-trajectory",
		schemaVersion: 1,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		traceId: params.manifest.traceId,
		sessionId: params.manifest.sessionId,
		sessionKey: params.manifest.sessionKey,
		system: systemPrompt,
		submittedPrompts,
		latestSubmittedPrompt: submittedPrompts.at(-1),
		skillsPrompt,
		userPromptPrefixText,
		systemPromptReport: promptReport
	};
}
function resolveDefaultTrajectoryExportDir(params) {
	const timestamp = (params.now ?? /* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
	const sessionFileName = safeTrajectorySessionFileName(params.sessionId);
	return path.join(params.workspaceDir, ".openclaw", "trajectory-exports", `openclaw-trajectory-${sessionFileName.slice(0, 8)}-${timestamp}`);
}
async function exportTrajectoryBundle(params) {
	const redaction = buildTrajectoryExportRedaction({ workspaceDir: params.workspaceDir });
	const sessionTarget = normalizeCompleteSessionTarget(params.sessionTarget);
	if (params.sessionFile && !sessionTarget && !parseSqliteSessionFileMarker(params.sessionFile)) {
		const sessionStat = await fs.stat(params.sessionFile);
		if (sessionStat.size > MAX_TRAJECTORY_SESSION_FILE_BYTES) throw new Error(`Trajectory session file is too large to export (${sessionStat.size} bytes; limit ${MAX_TRAJECTORY_SESSION_FILE_BYTES})`);
	}
	const { header, leafId, branchEntries, warnings: sessionWarnings } = await readSessionBranch({
		sessionFile: params.sessionFile,
		sessionTarget: params.sessionTarget,
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
	const runtimeParse = await readRuntimeTrajectoryEvents({
		runtimeFile: params.runtimeFile,
		sessionFile: params.sessionFile,
		sessionTarget,
		sessionId: params.sessionId
	});
	const runtimeFile = runtimeParse.runtimeFile;
	const runtimeEvents = runtimeParse.events;
	assertCanonicalTrajectoryInputs(branchEntries, runtimeEvents);
	const projectedBranchEntries = branchEntries;
	const transcriptEvents = buildTranscriptEvents({
		entries: projectedBranchEntries,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		traceId: params.sessionId
	});
	const maxTotalEvents = params.maxTotalEvents ?? MAX_TRAJECTORY_TOTAL_EVENTS;
	const totalEventCount = runtimeEvents.length + transcriptEvents.length;
	if (totalEventCount > maxTotalEvents) throw new Error(`Trajectory export has too many events (${totalEventCount}; limit ${maxTotalEvents})`);
	const rawEvents = sortTrajectoryEvents([...runtimeEvents, ...transcriptEvents]);
	const events = rawEvents.map((event) => redactEventForExport(event, redaction));
	const manifest = {
		traceSchema: "openclaw-trajectory",
		schemaVersion: 1,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		traceId: params.sessionId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: maybeRedactPathString(params.workspaceDir, redaction),
		leafId,
		eventCount: events.length,
		runtimeEventCount: runtimeEvents.length,
		transcriptEventCount: transcriptEvents.length,
		sourceFiles: {
			session: maybeRedactPathString(sessionTarget?.sessionKey ?? params.sessionFile ?? params.sessionId, redaction),
			runtime: runtimeFile && await isRegularNonSymlinkFile(runtimeFile) ? maybeRedactPathString(runtimeFile, redaction) : void 0
		}
	};
	const warnings = summarizeJsonlWarnings([...sessionWarnings, ...runtimeParse.warnings]);
	if (warnings.length > 0) manifest.warnings = warnings;
	const bundleRuntimeContext = resolveRuntimeContext(runtimeEvents);
	const files = [];
	const supplementalFiles = [];
	const metadataCapture = buildMetadataCapture({
		manifest,
		runtimeEvents,
		events: rawEvents
	});
	const artifactsCapture = buildArtifactsCapture({
		manifest,
		runtimeEvents
	});
	const promptsCapture = buildPromptsCapture({
		manifest,
		runtimeEvents,
		runtimeContext: bundleRuntimeContext
	});
	if (metadataCapture) {
		files.push(jsonSupportBundleFile("metadata.json", redactTrajectoryExportValue(metadataCapture, redaction)));
		supplementalFiles.push("metadata.json");
	}
	if (artifactsCapture) {
		files.push(jsonSupportBundleFile("artifacts.json", redactTrajectoryExportValue(artifactsCapture, redaction)));
		supplementalFiles.push("artifacts.json");
	}
	if (promptsCapture) {
		files.push(jsonSupportBundleFile("prompts.json", redactTrajectoryExportValue(promptsCapture, redaction)));
		supplementalFiles.push("prompts.json");
	}
	if (supplementalFiles.length > 0) manifest.supplementalFiles = supplementalFiles;
	files.push(trajectoryJsonlFile("events.jsonl", events));
	files.push(jsonSupportBundleFile("session-branch.json", redactTrajectoryExportValue({
		header,
		leafId,
		entries: projectedBranchEntries
	}, redaction)));
	if (bundleRuntimeContext.systemPrompt) files.push(textSupportBundleFile("system-prompt.txt", redactTrajectoryExportValue(bundleRuntimeContext.systemPrompt, redaction)));
	if (bundleRuntimeContext.tools) files.push(jsonSupportBundleFile("tools.json", redactTrajectoryExportValue(bundleRuntimeContext.tools, redaction)));
	const redactedFiles = files.map(redactTrajectoryBundleFileContent);
	manifest.contents = supportBundleContents(redactedFiles);
	const redactedManifest = redactTrajectoryExportValue(manifest, redaction);
	const manifestFile = redactTrajectoryBundleFileContent(jsonSupportBundleFile("manifest.json", redactedManifest));
	const writtenFiles = await writeSupportBundleDirectory({
		outputDir: params.outputDir,
		files: [manifestFile, ...redactedFiles]
	});
	return {
		manifest: redactedManifest,
		outputDir: params.outputDir,
		events,
		header,
		runtimeFile: runtimeFile && await isRegularNonSymlinkFile(runtimeFile) ? runtimeFile : void 0,
		supplementalFiles,
		files: writtenFiles.map((file) => file.path)
	};
}
//#endregion
//#region src/trajectory/command-export.ts
async function validateExistingExportDirectory(params) {
	const linkStat = await fs.lstat(params.dir);
	if (linkStat.isSymbolicLink() || !linkStat.isDirectory()) throw new Error(`${params.label} must be a real directory inside the workspace`);
	const realDir = await fs.realpath(params.dir);
	if (!isPathInside(params.realWorkspace, realDir)) throw new Error("Trajectory exports directory must stay inside the workspace");
	return realDir;
}
async function mkdirIfMissingThenValidate(params) {
	try {
		await fs.mkdir(params.dir, { mode: 448 });
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
	}
	return await validateExistingExportDirectory(params);
}
async function resolveTrajectoryExportBaseDir(workspaceDir) {
	const workspacePath = path.resolve(workspaceDir);
	const realWorkspace = await fs.realpath(workspacePath);
	const stateDir = path.join(workspacePath, ".openclaw");
	await mkdirIfMissingThenValidate({
		dir: stateDir,
		label: "OpenClaw state directory",
		realWorkspace
	});
	const baseDir = path.join(stateDir, "trajectory-exports");
	const realBase = await mkdirIfMissingThenValidate({
		dir: baseDir,
		label: "Trajectory exports directory",
		realWorkspace
	});
	return {
		baseDir: path.resolve(baseDir),
		realBase
	};
}
async function resolveTrajectoryCommandOutputDir(params) {
	const { baseDir, realBase } = await resolveTrajectoryExportBaseDir(params.workspaceDir);
	const raw = params.outputPath?.trim();
	if (!raw) {
		const defaultDir = resolveDefaultTrajectoryExportDir({
			workspaceDir: params.workspaceDir,
			sessionId: params.sessionId
		});
		return path.join(baseDir, path.basename(defaultDir));
	}
	if (path.isAbsolute(raw) || raw.startsWith("~")) throw new Error("Output path must be relative to the workspace trajectory exports directory");
	const resolvedBase = path.resolve(baseDir);
	const outputDir = path.resolve(resolvedBase, raw);
	const relative = path.relative(resolvedBase, outputDir);
	if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Output path must stay inside the workspace trajectory exports directory");
	let existingParent = outputDir;
	while (!await pathExists(existingParent)) {
		const next = path.dirname(existingParent);
		if (next === existingParent) break;
		existingParent = next;
	}
	const realExistingParent = await fs.realpath(existingParent);
	if (!isPathInside(realBase, realExistingParent)) throw new Error("Output path must stay inside the real trajectory exports directory");
	return outputDir;
}
async function exportTrajectoryForCommand(params) {
	const bundle = await exportTrajectoryBundle({
		outputDir: params.outputDir ?? await resolveTrajectoryCommandOutputDir({
			outputPath: params.outputPath,
			workspaceDir: params.workspaceDir,
			sessionId: params.sessionId
		}),
		sessionFile: params.sessionFile,
		sessionTarget: params.sessionTarget,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir
	});
	const relativePath = path.relative(params.workspaceDir, bundle.outputDir);
	const displayPath = relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath) ? relativePath : path.basename(bundle.outputDir);
	return {
		outputDir: bundle.outputDir,
		displayPath,
		sessionId: params.sessionId,
		eventCount: bundle.manifest.eventCount,
		runtimeEventCount: bundle.manifest.runtimeEventCount,
		transcriptEventCount: bundle.manifest.transcriptEventCount,
		files: [...bundle.files.filter((file) => !bundle.supplementalFiles.includes(file)), ...bundle.supplementalFiles]
	};
}
function formatTrajectoryCommandExportSummary(summary) {
	return [
		"✅ Trajectory exported!",
		"",
		`📦 Bundle: ${summary.displayPath}`,
		`🧵 Session: ${summary.sessionId}`,
		`📊 Events: ${summary.eventCount}`,
		`🧪 Runtime events: ${summary.runtimeEventCount}`,
		`📝 Transcript events: ${summary.transcriptEventCount}`,
		`📁 Files: ${summary.files.join(", ")}`
	].join("\n");
}
//#endregion
//#region src/commands/export-trajectory.ts
/** CLI command for exporting a session transcript as a trajectory artifact. */
const ENCODED_EXPORT_REQUEST_RE = /^[A-Za-z0-9_-]{1,65536}$/u;
function decodeExportTrajectoryRequest(encoded) {
	if (!ENCODED_EXPORT_REQUEST_RE.test(encoded)) throw new Error("Encoded trajectory export request is invalid");
	const bytes = Buffer.from(encoded, "base64url");
	if (bytes.toString("base64url") !== encoded) throw new Error("Encoded trajectory export request is invalid");
	let decoded;
	try {
		decoded = JSON.parse(bytes.toString("utf8"));
	} catch {
		throw new Error("Encoded trajectory export request is invalid JSON");
	}
	if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) throw new Error("Encoded trajectory export request must be a JSON object");
	const request = decoded;
	const opts = {};
	const sessionKey = readNonBlankString(request.sessionKey);
	if (sessionKey !== void 0) opts.sessionKey = sessionKey;
	const output = readNonBlankString(request.output);
	if (output !== void 0) opts.output = output;
	const store = readStringValue(request.store);
	if (store !== void 0) opts.store = store;
	const agent = readStringValue(request.agent);
	if (agent !== void 0) opts.agent = agent;
	const workspace = readNonBlankString(request.workspace);
	if (workspace !== void 0) opts.workspace = workspace;
	return opts;
}
function resolveExportTrajectoryOptions(opts) {
	const encoded = opts.requestJsonBase64;
	if (encoded === void 0 || encoded.length === 0) return opts;
	return {
		...opts,
		...decodeExportTrajectoryRequest(encoded)
	};
}
function throwTrajectoryExportError(message) {
	throw new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
/** Resolves the requested session and exports its trajectory summary or JSON result. */
async function exportTrajectoryCommand(opts, runtime) {
	let resolvedOpts;
	try {
		resolvedOpts = resolveExportTrajectoryOptions(opts);
	} catch (error) {
		throwTrajectoryExportError(`Failed to decode trajectory export request: ${formatErrorMessage(error)}`);
	}
	const sessionKey = resolvedOpts.sessionKey?.trim();
	if (!sessionKey) throwTrajectoryExportError(`--session-key is required. Run ${formatCliCommand("openclaw sessions")} to choose a session.`);
	const requestedAgent = resolvedOpts.agent?.trim();
	if (resolvedOpts.agent !== void 0 && !requestedAgent) throwTrajectoryExportError("--agent must not be blank");
	if (resolvedOpts.store !== void 0 && !resolvedOpts.store.trim()) throwTrajectoryExportError("--store must not be blank");
	let targetAgentId;
	try {
		targetAgentId = requestedAgent ? resolveConfiguredAgentId(getRuntimeConfig(), requestedAgent) : resolveAgentIdFromSessionKey(sessionKey);
	} catch (error) {
		throwTrajectoryExportError(formatErrorMessage(error));
	}
	let storePath = resolvedOpts.store ? resolveSessionStorePathCore(resolvedOpts.store, { agentId: targetAgentId }) : resolveSessionStorePathCore(getRuntimeConfig().session?.store, { agentId: targetAgentId });
	if (resolvedOpts.store) try {
		storePath = resolveExplicitSessionStorePath({
			storePath,
			inputStorePath: resolvedOpts.store,
			agentId: targetAgentId
		});
	} catch (error) {
		throwTrajectoryExportError(formatErrorMessage(error));
	}
	const entry = loadSessionEntryReadOnly({
		agentId: targetAgentId,
		sessionKey,
		storePath
	});
	if (!entry?.sessionId) throwTrajectoryExportError(`Session not found: ${sessionKey}. Run ${formatCliCommand("openclaw sessions")} to see available sessions.`);
	let sessionTarget;
	try {
		sessionTarget = resolveSessionTranscriptReadTarget({
			agentId: targetAgentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey,
			storePath
		});
	} catch (error) {
		throwTrajectoryExportError(`Failed to resolve session file: ${formatErrorMessage(error)}`);
	}
	let summary;
	try {
		summary = await exportTrajectoryForCommand({
			outputPath: resolvedOpts.output,
			sessionTarget: {
				agentId: sessionTarget.agentId ?? targetAgentId,
				sessionId: sessionTarget.sessionId,
				sessionKey: sessionTarget.sessionKey ?? sessionKey,
				storePath: sessionTarget.storePath
			},
			sessionId: entry.sessionId,
			sessionKey,
			workspaceDir: path.resolve(resolvedOpts.workspace ?? process.cwd())
		});
	} catch (error) {
		throwTrajectoryExportError(`Failed to export trajectory: ${formatErrorMessage(error)}`);
	}
	if (resolvedOpts.json) {
		writeRuntimeJson(runtime, summary);
		return;
	}
	runtime.log(formatTrajectoryCommandExportSummary(summary));
}
//#endregion
export { exportTrajectoryCommand };
