import { g as readStringValue, l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { b as redactToolPayloadText, p as redactSecrets } from "./redact-DJ8j6ADa.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as ExpectedCliError } from "./failure-output-gtb9zaTk.mjs";
import { c as redactSupportString } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as hasMeaningfulRetiredMediaCarrier, t as PERSISTED_LEGACY_MEDIA_KEYS } from "./media-facts-CJdQ4R61.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { l as scanSessionTranscriptTree, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-CaYJo8Xs.mjs";
import { a as loadSessionEntry, o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { a as resolveTrajectoryFilePath, i as TRAJECTORY_RUNTIME_FILE_MAX_BYTES, o as resolveTrajectoryPointerFilePath, s as safeTrajectorySessionFileName, t as TRAJECTORY_POINTER_FILE_MAX_BYTES } from "./paths-9AeKxTu3.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-8r2jOQkD.mjs";
import { d as loadTranscriptEvents } from "./session-accessor-CQ-g9yb2.mjs";
import { i as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-CAOPCw68.mjs";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution--80nkk68.mjs";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-N9xicL2K.mjs";
import { t as safeJsonStringify } from "./safe-json-CY5cd4H1.mjs";
import { i as loadSqliteTrajectoryRuntimeEvents } from "./runtime-store.sqlite-Chl9fskF.mjs";
import { n as parseSessionFileEntriesWithWarnings, t as isSessionFileEntry } from "./session-file-parser-D1ykkA6l.mjs";
import { a as writeSupportBundleDirectory, i as textSupportBundleFile, n as jsonlSupportBundleFile, r as supportBundleContents, t as jsonSupportBundleFile } from "./diagnostic-support-bundle-BD_gGSa7.mjs";
import { n as resolveExplicitSessionStorePath } from "./session-store-targets-CmuVIFk-.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { pathScope, readRegularFile } from "@openclaw/fs-safe/advanced";
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
function collectSessionEntries(rows) {
	const entries = [];
	const warnings = [];
	const rowByEntry = /* @__PURE__ */ new Map();
	for (const [index, value] of rows.entries()) {
		if (!isSessionFileEntry(value)) {
			warnings.push({
				source: "session",
				code: "invalid-session-row",
				row: index + 1,
				message: "Skipped a session JSONL row that is not a session entry object."
			});
			continue;
		}
		entries.push(value);
		rowByEntry.set(value, index + 1);
	}
	return {
		entries,
		warnings,
		rowByEntry
	};
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
		return collectSessionEntries(await loadTranscriptEvents({
			agentId: completeTarget.agentId,
			sessionId: completeTarget.sessionId,
			sessionKey: completeTarget.sessionKey,
			storePath: completeTarget.storePath,
			maxEventBytes: MAX_TRAJECTORY_SESSION_FILE_BYTES
		}));
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
	const targetKeyEntry = incompleteTarget?.sessionKey ? loadSessionEntry({
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
	return collectSessionEntries(await loadTranscriptEvents({
		agentId: marker.agentId,
		sessionId: marker.sessionId,
		...markerSessionKey ? { sessionKey: markerSessionKey } : {},
		storePath: marker.storePath,
		maxEventBytes: MAX_TRAJECTORY_SESSION_FILE_BYTES
	}));
}
async function readSessionBranch(params) {
	const { entries: fileEntries, warnings, rowByEntry } = await readSessionEntries(params);
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
async function parseRuntimeJsonlFile(filePath, sessionId) {
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
	if (stat.size > 52428800) throw new Error(`Trajectory runtime file is too large to export (${stat.size} bytes; limit ${TRAJECTORY_RUNTIME_FILE_MAX_BYTES})`);
	const rows = (await fs.readFile(filePath, "utf8")).split(/\r?\n/u);
	const parsed = [];
	const warnings = [];
	for (const [index, rawLine] of rows.entries()) {
		const row = rawLine.trim();
		if (!row) continue;
		if (parsed.length >= MAX_TRAJECTORY_RUNTIME_EVENTS) throw new Error(`Trajectory runtime file has too many events to export (limit ${MAX_TRAJECTORY_RUNTIME_EVENTS})`);
		try {
			const value = JSON.parse(row);
			if (isRuntimeTrajectoryEvent(value)) {
				if (value.sessionId === sessionId) parsed.push(value);
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
		...await parseRuntimeJsonlFile(runtimeFile, params.sessionId),
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
	if (typeof value === "string" || typeof value === "number" && Number.isFinite(value)) {
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
	return redactTrajectoryExportObjectKeys(redactSecrets(sanitizeDiagnosticPayload(redactLocalPathValues(value, redaction))), redaction);
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
	const latestModelEvent = params.runtimeEvents.findLast((event) => event.provider || event.modelId || event.modelApi);
	const modelFallback = latestModelEvent ? {
		provider: latestModelEvent.provider,
		name: latestModelEvent.modelId,
		api: latestModelEvent.modelApi
	} : void 0;
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
	const submittedPrompts = params.runtimeEvents.filter((event) => event.type === "prompt.submitted").map((event) => event.data?.prompt).filter((prompt) => typeof prompt === "string");
	const systemPrompt = params.systemPrompt;
	const prompting = runtimeMetadata?.prompting && typeof runtimeMetadata.prompting === "object" ? runtimeMetadata.prompting : void 0;
	const skillsPrompt = typeof prompting?.skillsPrompt === "string" ? prompting.skillsPrompt : void 0;
	const userPromptPrefixText = typeof prompting?.userPromptPrefixText === "string" ? prompting.userPromptPrefixText : void 0;
	const promptReport = typeof prompting?.systemPromptReport === "object" ? prompting.systemPromptReport : void 0;
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
	const env = process.env;
	const redaction = {
		env,
		stateDir: resolveStateDir(env),
		workspaceDir: path.resolve(params.workspaceDir)
	};
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
	const transcriptEvents = buildTranscriptEvents({
		entries: branchEntries,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		traceId: params.sessionId
	});
	const maxTotalEvents = params.maxTotalEvents ?? MAX_TRAJECTORY_TOTAL_EVENTS;
	const totalEventCount = runtimeEvents.length + transcriptEvents.length;
	if (totalEventCount > maxTotalEvents) throw new Error(`Trajectory export has too many events (${totalEventCount}; limit ${maxTotalEvents})`);
	const rawEvents = sortTrajectoryEvents([...runtimeEvents, ...transcriptEvents]);
	const events = rawEvents.map((event) => redactTrajectoryExportValue(event, redaction));
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
	const compiledContext = resolveLatestRuntimeEventData(runtimeEvents, "context.compiled");
	const systemPrompt = typeof compiledContext?.systemPrompt === "string" ? compiledContext.systemPrompt : void 0;
	const tools = Array.isArray(compiledContext?.tools) ? compiledContext.tools : void 0;
	const files = [];
	const supplementalFiles = [];
	const captures = {
		"metadata.json": buildMetadataCapture({
			manifest,
			runtimeEvents,
			events: rawEvents
		}),
		"artifacts.json": buildArtifactsCapture({
			manifest,
			runtimeEvents
		}),
		"prompts.json": buildPromptsCapture({
			manifest,
			runtimeEvents,
			systemPrompt
		})
	};
	for (const [fileName, capture] of Object.entries(captures)) {
		if (!capture) continue;
		files.push(jsonSupportBundleFile(fileName, redactTrajectoryExportValue(capture, redaction)));
		supplementalFiles.push(fileName);
	}
	if (supplementalFiles.length > 0) manifest.supplementalFiles = supplementalFiles;
	files.push(trajectoryJsonlFile("events.jsonl", events));
	files.push(jsonSupportBundleFile("session-branch.json", redactTrajectoryExportValue({
		header,
		leafId,
		entries: branchEntries
	}, redaction)));
	if (systemPrompt) files.push(textSupportBundleFile("system-prompt.txt", redactTrajectoryExportValue(systemPrompt, redaction)));
	if (tools) files.push(jsonSupportBundleFile("tools.json", redactTrajectoryExportValue(tools, redaction)));
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
async function resolveTrajectoryExportBaseDir(workspaceDir) {
	const workspacePath = path.resolve(workspaceDir);
	const realWorkspace = await fs.realpath(workspacePath);
	const relative = path.join(".openclaw", "trajectory-exports");
	const prepared = await pathScope(realWorkspace, { label: "workspace" }).ensureDir(relative, { mode: 448 });
	if (!prepared.ok) throw prepared.diagnostic ?? new Error(prepared.error);
	return {
		baseDir: path.join(workspacePath, relative),
		realBase: prepared.path
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
	await (await root(realBase)).resolve(`.${path.sep}${relative}`);
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
	if (!isRecord(decoded)) throw new Error("Encoded trajectory export request must be a JSON object");
	const opts = {};
	for (const key of [
		"sessionKey",
		"output",
		"store",
		"agent",
		"workspace"
	]) {
		const value = key === "store" || key === "agent" ? readStringValue(decoded[key]) : readNonBlankString(decoded[key]);
		if (value !== void 0) opts[key] = value;
	}
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
