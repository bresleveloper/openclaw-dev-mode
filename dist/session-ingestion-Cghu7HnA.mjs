import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as appendRegularFile } from "./fs-safe-BAPek8At.mjs";
import { y as formatMemoryDreamingDay } from "./dreaming-Rnb_FGdU.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import "./memory-core-host-engine-foundation-wgSi2CJX.mjs";
import { c as statSessionEntrySync, o as sessionPathForFile, r as matchesSessionEntryPrefixHash, t as buildSessionEntry } from "./session-files-DSNs2wC3.mjs";
import { t as loadMemorySessionMetadata } from "./memory-core-host-engine-sessions-Dp8skDK4.mjs";
import "./memory-core-host-status-CWOM9o6Y.mjs";
import { b as writeMemoryCoreWorkspaceEntries, i as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE, r as DREAMING_SESSION_INGESTION_FILES_NAMESPACE, y as readMemoryCoreWorkspaceEntries } from "./dreaming-state-DJfKblhZ.mjs";
import { n as getMemoryWorkspaceMaintenance } from "./memory-workspace-files-Dz8_mlEr.mjs";
import { n as SESSION_INGESTION_MAX_TRACKED_MESSAGES_PER_SESSION, o as normalizeSessionIngestionState } from "./dreaming-ingestion-state-BH9hcR6l.mjs";
import { r as listMemorySessionTombstones } from "./memory-entry-origins-B0k3pTMh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region extensions/memory-core/src/session-ingestion.ts
const SESSION_CORPUS_RELATIVE_DIR = path.join("memory", ".dreams", "session-corpus");
const SESSION_INGESTION_SCORE = .58;
const SESSION_INGESTION_MIN_SNIPPET_CHARS = 12;
const SESSION_INGESTION_MAX_SNIPPET_CHARS = 280;
function buildSessionScope(agentId, sessionId) {
	return `${agentId}:${sessionId}`;
}
function sessionPathFromCorpus(entry) {
	return entry.transcriptSource === "sqlite" ? path.join("sessions", entry.agentId, entry.sessionId).replace(/\\/g, "/") : sessionPathForFile(entry.sessionFile);
}
function sessionIngestionSourceFromCorpus(entry) {
	const sessionPath = sessionPathFromCorpus(entry);
	if (entry.sessionKind !== "interactive") return null;
	const scope = entry.transcriptSource === "sqlite" ? `${entry.agentId}:${sessionPath}` : buildSessionScope(entry.agentId, entry.sessionId);
	return {
		agentId: entry.agentId,
		absolutePath: entry.sessionFile,
		foreign: false,
		sessionPath,
		stateKey: `${entry.agentId}:${sessionPath}`,
		scope,
		sessionOrigin: {
			agentId: entry.agentId,
			sessionId: entry.sessionId,
			...entry.sessionKey ? { sessionKey: entry.sessionKey } : {}
		},
		...entry.transcriptSource === "sqlite" ? { legacyScope: buildSessionScope(entry.agentId, entry.sessionId) } : {},
		buildOptions: {
			sessionKind: "interactive",
			...entry.transcriptSource === "sqlite" ? {
				agentId: entry.agentId,
				sessionId: entry.sessionId
			} : {},
			...entry.sessionKey ? { sessionKey: entry.sessionKey } : {},
			...entry.storePath ? { storePath: entry.storePath } : {},
			...entry.updatedAtMs !== void 0 ? { updatedAtMs: entry.updatedAtMs } : {},
			...entry.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
			...entry.generatedByCronRun ? { generatedByCronRun: true } : {}
		}
	};
}
function resolveAdmissionPolicy(pluginConfig) {
	const exclusions = asNullableRecord(asNullableRecord(pluginConfig?.memoryPolicy)?.excludeSessions);
	if (!exclusions) return;
	const values = (key) => Array.isArray(exclusions[key]) ? normalizeStringEntries(exclusions[key].filter((value) => typeof value === "string")) : [];
	const policy = {
		hookExternalContentSources: values("hookExternalContentSources"),
		channels: values("channels"),
		chatTypes: values("chatTypes")
	};
	return Object.values(policy).some((entries) => entries.length > 0) ? policy : void 0;
}
function sessionExclusionReason(source, policy, forgottenSessionIds) {
	if (!source.sessionOrigin) return;
	const { agentId, sessionId } = source.sessionOrigin;
	if (forgottenSessionIds ? forgottenSessionIds.has(sessionId) : listMemorySessionTombstones({
		agentId,
		sessionIds: [sessionId]
	}).length > 0) return "forgotten";
	if (!policy) return;
	const metadata = loadMemorySessionMetadata({
		...source.sessionOrigin,
		storePath: source.buildOptions.storePath
	});
	if (!metadata) return;
	if (metadata.hookExternalContentSource && policy.hookExternalContentSources.includes(metadata.hookExternalContentSource)) return `hookExternalContentSource:${metadata.hookExternalContentSource}`;
	if (metadata.channel && policy.channels.includes(metadata.channel)) return `channel:${metadata.channel}`;
	return metadata.chatType && policy.chatTypes.includes(metadata.chatType) ? `chatType:${metadata.chatType}` : void 0;
}
function sessionIngestionStateKeyFromCorpus(entry) {
	return `${entry.agentId}:${sessionPathFromCorpus(entry)}`;
}
function foreignSessionIngestionSource(agentId, archiveFile) {
	const absolutePath = path.resolve(archiveFile);
	const normalizedPath = absolutePath.replaceAll("\\", "/");
	return {
		agentId,
		absolutePath,
		foreign: true,
		sessionPath: sessionPathForFile(absolutePath),
		stateKey: `session-backfill:${normalizedPath}`,
		scope: `archive:${agentId}:${normalizedPath}`,
		buildOptions: { sessionKind: "interactive" }
	};
}
function normalizeSessionCorpusSnippet(value) {
	return truncateUtf16Safe(value.replace(/\s+/g, " ").trim(), SESSION_INGESTION_MAX_SNIPPET_CHARS);
}
function hashSessionMessageId(value) {
	return createHash("sha1").update(value).digest("hex");
}
async function statSessionSource(source) {
	if (source.buildOptions.agentId && source.buildOptions.storePath) try {
		const stat = statSessionEntrySync(source.absolutePath, source.buildOptions);
		return stat ? {
			mtimeMs: Math.floor(Math.max(0, stat.revisionMs ?? stat.mtimeMs)),
			size: Math.floor(stat.size)
		} : null;
	} catch {
		return;
	}
	const stat = await fs.stat(source.absolutePath).catch((error) => {
		if (error.code === "ENOENT") return null;
		throw error;
	});
	return stat ? {
		mtimeMs: Math.floor(Math.max(0, stat.mtimeMs)),
		size: Math.floor(stat.size)
	} : null;
}
async function scanSessionIngestionSource(params) {
	const emptyScan = (status, fileState) => ({
		status,
		candidates: [],
		...fileState ? { fileState } : {},
		scannedEndIndex: fileState?.lastContentLine ?? 0
	});
	const fingerprint = await statSessionSource(params.source);
	if (fingerprint === null) return emptyScan("absent");
	if (!params.verifyContent && fingerprint && params.previous?.mtimeMs === fingerprint.mtimeMs && params.previous.size === fingerprint.size && params.previous.contentHash.length > 0 && params.previous.lastContentLine >= params.previous.lineCount) return emptyScan("unchanged", params.previous);
	const entry = await buildSessionEntry(params.source.absolutePath, params.source.buildOptions);
	if (!entry) return emptyScan("unavailable", params.previous);
	const fileFingerprint = {
		mtimeMs: Math.floor(Math.max(0, entry.revisionMs ?? entry.mtimeMs)),
		size: Math.floor(Math.max(0, entry.size))
	};
	const lines = entry.content ? entry.content.split("\n") : [];
	const terminalState = {
		...fileFingerprint,
		contentHash: entry.hash.trim(),
		lineCount: lines.length,
		lastContentLine: lines.length
	};
	if (entry.generatedByDreamingNarrative || entry.generatedByCronRun) return emptyScan("excluded", terminalState);
	if (params.previous?.mtimeMs === fileFingerprint.mtimeMs && params.previous.size === fileFingerprint.size && params.previous.contentHash === terminalState.contentHash && params.previous.lineCount === lines.length && params.previous.lastContentLine >= lines.length) return emptyScan("unchanged", params.previous);
	const startIndex = params.previous !== void 0 && params.previous.contentHash.length > 0 && (params.previous.lineCount === lines.length && params.previous.contentHash === terminalState.contentHash || params.previous.lineCount < lines.length && matchesSessionEntryPrefixHash(entry, params.previous.lineCount, params.previous.contentHash)) ? Math.max(0, Math.min(params.previous?.lastContentLine ?? 0, lines.length)) : 0;
	const seen = new Set(params.seenMessages[params.source.scope] ?? []);
	const legacySeen = params.source.legacyScope ? new Set(params.seenMessages[params.source.legacyScope] ?? []) : void 0;
	const candidates = [];
	let progressBlockIndex;
	let scannedEndIndex = startIndex;
	for (let index = startIndex; index < lines.length; index += 1) {
		if (params.maxCandidates !== void 0 && candidates.length >= params.maxCandidates) break;
		scannedEndIndex = index + 1;
		const snippet = normalizeSessionCorpusSnippet(lines[index] ?? "");
		if (snippet.length < SESSION_INGESTION_MIN_SNIPPET_CHARS) continue;
		const lineNumber = entry.lineMap[index] ?? index + 1;
		const timestampMs = entry.messageTimestampsMs[index] ?? 0;
		const parsedProvenance = entry.lineProvenance[index] ?? {
			originClass: "untrusted",
			sessionKind: "interactive",
			observedAt: timestampMs || entry.mtimeMs
		};
		const provenance = params.source.foreign ? {
			...parsedProvenance,
			originClass: "untrusted"
		} : parsedProvenance;
		if (params.acceptProvenance && !params.acceptProvenance(provenance)) continue;
		const day = formatMemoryDreamingDay(timestampMs || entry.mtimeMs, params.timezone);
		const disposition = params.classifyDay(day);
		if (disposition !== "include") {
			if (disposition === "block") progressBlockIndex ??= index;
			continue;
		}
		const basis = timestampMs > 0 ? `ts:${Math.floor(timestampMs)}` : `line:${lineNumber}`;
		const hash = hashSessionMessageId(`${params.source.scope}\n${basis}\n${snippet}`);
		const legacyHash = params.source.legacyScope ? hashSessionMessageId(`${params.source.legacyScope}\n${basis}\n${snippet}`) : void 0;
		if (seen.has(hash) || legacyHash && legacySeen?.has(legacyHash)) continue;
		candidates.push({
			contentIndex: index,
			day,
			hash,
			lineNumber,
			provenance,
			rendered: truncateUtf16Safe(`[${params.source.agentId}/${params.source.sessionPath}#L${lineNumber}] ${snippet}`, 344),
			scope: params.source.scope,
			stateKey: params.source.stateKey,
			snippet,
			...params.source.sessionOrigin ? { sessionOrigin: params.source.sessionOrigin } : {}
		});
		seen.add(hash);
	}
	return {
		status: "scanned",
		candidates,
		fileState: {
			...terminalState,
			lastContentLine: scannedEndIndex
		},
		...progressBlockIndex !== void 0 ? { progressBlockIndex } : {},
		scannedEndIndex
	};
}
function mergeTrackedMessageHashes(existing, additions) {
	return [.../* @__PURE__ */ new Set([...existing, ...additions])].slice(-SESSION_INGESTION_MAX_TRACKED_MESSAGES_PER_SESSION);
}
function trimTrackedSessionScopes(seenMessages) {
	const keep = new Set(Object.keys(seenMessages).toSorted().slice(-2048));
	return Object.fromEntries(Object.entries(seenMessages).filter(([scope]) => keep.has(scope)));
}
async function readSessionIngestionState(workspaceDir) {
	const [files, seenChunks] = await Promise.all([readMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
		workspaceDir
	}), readMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
		workspaceDir
	})]);
	const seenMessages = {};
	for (const { value } of seenChunks.toSorted((a, b) => a.value.index - b.value.index)) {
		if (!value.scope.trim()) continue;
		seenMessages[value.scope] = [...seenMessages[value.scope] ?? [], ...value.hashes];
	}
	return normalizeSessionIngestionState({
		version: 3,
		files: Object.fromEntries(files.map((entry) => [entry.key, entry.value])),
		seenMessages
	});
}
async function writeSessionIngestionState(workspaceDir, state) {
	const seenEntries = Object.entries(state.seenMessages).flatMap(([scope, hashes]) => Array.from({ length: Math.ceil(hashes.length / 512) }, (_, index) => ({
		key: `${scope}:${index}`,
		value: {
			scope,
			index,
			hashes: hashes.slice(index * 512, (index + 1) * 512)
		}
	})));
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
		workspaceDir,
		entries: Object.entries(state.files).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
		workspaceDir,
		entries: seenEntries
	})]);
}
async function appendSessionCorpusLines(params) {
	if (params.lines.length === 0) return [];
	const relativePath = path.posix.join("memory", ".dreams", "session-corpus", `${params.day}.txt`);
	const absolutePath = path.join(params.workspaceDir, SESSION_CORPUS_RELATIVE_DIR, `${params.day}.txt`);
	const content = `${params.lines.map((entry) => entry.rendered).join("\n")}\n`;
	const files = getMemoryWorkspaceMaintenance(params.workspaceDir);
	const existingLines = files ? await files.appendCorpus(absolutePath, content) : await appendSessionCorpusText(absolutePath, content);
	return params.lines.map((entry, index) => ({
		path: relativePath,
		startLine: existingLines + index + 1,
		endLine: existingLines + index + 1,
		score: SESSION_INGESTION_SCORE,
		snippet: entry.snippet,
		source: "memory",
		provenance: entry.provenance,
		...entry.sessionOrigin ? { sessionOrigin: entry.sessionOrigin } : {}
	}));
}
/** Native file append; session admission and checkpoints stay with the caller. */
async function appendSessionCorpusText(filePath, content) {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	const normalized = (await fs.readFile(filePath, "utf-8").catch((error) => {
		if (error.code === "ENOENT") return "";
		throw error;
	})).replace(/\r\n/g, "\n");
	const existingLines = normalized ? (normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized).split("\n").length : 0;
	await appendRegularFile({
		filePath,
		content,
		rejectSymlinkParents: true
	});
	return existingLines;
}
//#endregion
export { foreignSessionIngestionSource as a, resolveAdmissionPolicy as c, sessionIngestionSourceFromCorpus as d, sessionIngestionStateKeyFromCorpus as f, appendSessionCorpusText as i, scanSessionIngestionSource as l, writeSessionIngestionState as m, SESSION_INGESTION_SCORE as n, mergeTrackedMessageHashes as o, trimTrackedSessionScopes as p, appendSessionCorpusLines as r, readSessionIngestionState as s, SESSION_CORPUS_RELATIVE_DIR as t, sessionExclusionReason as u };
