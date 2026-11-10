import { l as asNonNegativeFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries, p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as appendRegularFile, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { _ as formatMemoryDreamingDay, w as resolveMemoryDreamingWorkspaces } from "./dreaming-D2xE6WEV.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as assertNoSymlinkParentsSync } from "./file-access-runtime-DZTMkCCU.mjs";
import "./security-runtime-6domDoE8.mjs";
import { n as getMemoryWorkspaceMaintenance } from "./memory-workspace-files-_Z-dpV0O.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./memory-core-host-engine-foundation-Cj49LzJw.mjs";
import { a as sessionPathForFile, i as matchesSessionEntryPrefixHash, o as statSessionEntry } from "./session-files-Cv_U1iPC.mjs";
import { s as loadMemorySessionMetadataBatchAsync, t as buildSessionEntry } from "./memory-core-host-engine-sessions-D3l0Zm6q.mjs";
import "./memory-core-host-status-EFn_AMM-.mjs";
import { g as normalizeMemoryCoreWorkspaceKey, i as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE, r as DREAMING_SESSION_INGESTION_FILES_NAMESPACE, t as DREAMING_DAILY_INGESTION_NAMESPACE, v as readMemoryCoreWorkspaceEntries, x as captureMemoryMutationAuthority, y as writeMemoryCoreWorkspaceEntries } from "./dreaming-state-D1mfF5St.mjs";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/memory-core/src/dreaming-ingestion-state.ts
const DAILY_MEMORY_FILENAME_RE = /^(\d{4}-\d{2}-\d{2})(?:-[^/]+)?\.md$/i;
function parseDailyMemoryFileName(fileName) {
	const day = fileName.match(DAILY_MEMORY_FILENAME_RE)?.[1];
	return day ? {
		fileName,
		day,
		canonical: fileName.toLowerCase() === `${day}.md`
	} : null;
}
function compareDailyMemoryFilesByNewestDay(left, right) {
	const dayOrder = right.day.localeCompare(left.day);
	if (dayOrder !== 0) return dayOrder;
	if (left.canonical !== right.canonical) return left.canonical ? -1 : 1;
	return left.fileName.localeCompare(right.fileName);
}
const MEMORY_DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
function normalizeMemoryDay(value) {
	if (typeof value !== "string") return;
	const day = value.trim();
	return MEMORY_DAY_RE.test(day) ? day : void 0;
}
function normalizeIngestionFiles(entries, decode) {
	const files = {};
	for (const { key, value } of entries) {
		const file = asNullableRecord(value);
		if (!file || key.trim().length === 0) continue;
		const mtimeMs = Number(file.mtimeMs);
		const size = Number(file.size);
		if (!Number.isFinite(mtimeMs) || mtimeMs < 0 || !Number.isFinite(size) || size < 0) continue;
		files[key] = {
			mtimeMs: Math.floor(mtimeMs),
			size: Math.floor(size),
			...decode(file)
		};
	}
	return files;
}
async function readDailyIngestionState(workspaceDir) {
	return {
		version: 1,
		files: normalizeIngestionFiles(await readMemoryCoreWorkspaceEntries({
			namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
			workspaceDir
		}), (file) => {
			const lastDreamingDayIngested = normalizeMemoryDay(file.lastDreamingDayIngested);
			return lastDreamingDayIngested ? { lastDreamingDayIngested } : {};
		})
	};
}
async function writeDailyIngestionState(workspaceDir, state) {
	await writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
		workspaceDir,
		entries: Object.entries(state.files).map(([key, value]) => ({
			key,
			value
		}))
	});
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
	const normalizedFiles = normalizeIngestionFiles(files, (file) => {
		const lineCount = asNonNegativeFiniteNumber(Math.floor(Number(file.lineCount))) ?? 0;
		const lastContentLine = asNonNegativeFiniteNumber(Math.floor(Number(file.lastContentLine))) ?? 0;
		return {
			contentHash: typeof file.contentHash === "string" ? file.contentHash.trim() : "",
			lineCount,
			lastContentLine: Math.min(lineCount, lastContentLine),
			...typeof file.excludedReason === "string" && file.excludedReason.trim() ? { excludedReason: file.excludedReason.trim() } : {}
		};
	});
	const normalizedSeenMessages = {};
	for (const [scope, value] of Object.entries(seenMessages)) {
		const unique = normalizeStringEntries([...new Set(value.filter((entry) => typeof entry === "string"))]).slice(-4096);
		if (unique.length > 0) normalizedSeenMessages[scope] = unique;
	}
	return {
		version: 3,
		files: normalizedFiles,
		seenMessages: normalizedSeenMessages
	};
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
	const writes = [writeMemoryCoreWorkspaceEntries({
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
	})];
	try {
		await Promise.all(writes);
	} finally {
		await Promise.allSettled(writes);
	}
}
//#endregion
//#region extensions/memory-core/src/session-ingestion.ts
const SESSION_CORPUS_RELATIVE_DIR = path.join("memory", ".dreams", "session-corpus");
const SESSION_INGESTION_SCORE = .58;
const SESSION_INGESTION_MAX_MESSAGES_PER_FILE = 80;
const SESSION_INGESTION_MIN_MESSAGES_PER_FILE = 12;
const SESSION_INGESTION_MIN_SNIPPET_CHARS = 12;
const SESSION_INGESTION_MAX_SNIPPET_CHARS = 280;
function resolveSessionAgentsForWorkspace(params) {
	const { cfg, workspaceDir } = params;
	const target = normalizeMemoryCoreWorkspaceKey(workspaceDir);
	const match = resolveMemoryDreamingWorkspaces(cfg).find((entry) => normalizeMemoryCoreWorkspaceKey(entry.workspaceDir) === target);
	if (!match) return [];
	return uniqueStrings(match.agentIds.filter((agentId) => agentId.trim().length > 0)).toSorted();
}
function resolveSessionIngestionFileCap(sourceCount) {
	return Math.min(SESSION_INGESTION_MAX_MESSAGES_PER_FILE, Math.max(SESSION_INGESTION_MIN_MESSAGES_PER_FILE, Math.ceil(240 / Math.max(1, sourceCount))));
}
function buildSessionScope(agentId, sessionId) {
	return `${agentId}:${sessionId}`;
}
function sessionPathFromCorpus(entry) {
	return entry.transcriptSource === "sqlite" ? path.join("sessions", entry.agentId, entry.sessionId).replace(/\\/g, "/") : sessionPathForFile(entry.sessionFile);
}
function sessionIngestionSourceFromCorpus(entry, purpose) {
	const sessionPath = sessionPathFromCorpus(entry);
	if (entry.sessionKind !== "interactive" || (purpose === "dreaming" ? entry.artifactKind !== "active-session" || /\.checkpoint\..+\.jsonl$/i.test(path.basename(entry.sessionFile)) : entry.generatedByDreamingNarrative || entry.generatedByCronRun)) return null;
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
	const policy = {
		hookExternalContentSources: normalizeTrimmedStringList(exclusions.hookExternalContentSources),
		channels: normalizeTrimmedStringList(exclusions.channels),
		chatTypes: normalizeTrimmedStringList(exclusions.chatTypes)
	};
	return Object.values(policy).some((entries) => entries.length > 0) ? policy : void 0;
}
async function sessionExclusionReasons(sources, policy, forgottenSessionIds) {
	const reasons = /* @__PURE__ */ new Map();
	const scopes = /* @__PURE__ */ new Map();
	for (const source of sources) {
		if (!source.sessionOrigin) continue;
		const { agentId, sessionId, sessionKey } = source.sessionOrigin;
		if (forgottenSessionIds.has(sessionId)) {
			reasons.set(source, "forgotten");
			continue;
		}
		if (!policy) continue;
		const storePath = source.buildOptions.storePath;
		const key = JSON.stringify([agentId, storePath]);
		const scope = scopes.get(key);
		const session = {
			source,
			sessionId,
			sessionKey
		};
		if (scope) scope.sessions.push(session);
		else scopes.set(key, {
			agentId,
			storePath,
			sessions: [session]
		});
	}
	if (!policy) return reasons;
	for (const scope of scopes.values()) {
		const metadata = new Map((await loadMemorySessionMetadataBatchAsync({
			agentId: scope.agentId,
			storePath: scope.storePath,
			sessions: scope.sessions.map(({ sessionId, sessionKey }) => ({
				sessionId,
				sessionKey
			}))
		})).map((entry) => [entry.sessionId, entry]));
		for (const { source, sessionId, sessionKey } of scope.sessions) {
			const entry = metadata.get(sessionId);
			if (!entry || sessionKey !== void 0 && entry.sessionKey !== sessionKey) continue;
			const reason = entry.hookExternalContentSource && policy.hookExternalContentSources.includes(entry.hookExternalContentSource) ? `hookExternalContentSource:${entry.hookExternalContentSource}` : entry.channel && policy.channels.includes(entry.channel) ? `channel:${entry.channel}` : entry.chatType && policy.chatTypes.includes(entry.chatType) ? `chatType:${entry.chatType}` : void 0;
			if (reason) reasons.set(source, reason);
		}
	}
	return reasons;
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
		const stat = await statSessionEntry(source.absolutePath, source.buildOptions);
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
	return [.../* @__PURE__ */ new Set([...existing, ...additions])].slice(-4096);
}
function trimTrackedSessionScopes(seenMessages) {
	const keep = new Set(Object.keys(seenMessages).toSorted().slice(-2048));
	return Object.fromEntries(Object.entries(seenMessages).filter(([scope]) => keep.has(scope)));
}
async function appendSessionCorpusLines(params) {
	if (params.lines.length === 0) return [];
	const relativePath = path.posix.join("memory", ".dreams", "session-corpus", `${params.day}.txt`);
	const absolutePath = path.join(params.workspaceDir, SESSION_CORPUS_RELATIVE_DIR, `${params.day}.txt`);
	const content = `${params.lines.map((entry) => entry.rendered).join("\n")}\n`;
	const files = getMemoryWorkspaceMaintenance(params.workspaceDir);
	const assertCurrent = captureMemoryMutationAuthority();
	assertCurrent?.();
	const existingLines = files ? await files.appendCorpus(absolutePath, content, assertCurrent) : await appendSessionCorpusText(absolutePath, content);
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
	const assertCurrent = captureMemoryMutationAuthority();
	assertCurrent?.();
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	const normalized = (await fs.readFile(filePath, "utf-8").catch((error) => {
		if (error.code === "ENOENT") return "";
		throw error;
	})).replace(/\r\n/g, "\n");
	const existingLines = normalized ? (normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized).split("\n").length : 0;
	if (assertCurrent) {
		const assertAppendCurrent = () => {
			assertCurrent();
			assertNoSymlinkParentsSync({
				rootDir: path.parse(path.resolve(filePath)).root,
				targetPath: path.dirname(filePath),
				allowMissing: false,
				allowRootChildSymlink: true,
				requireDirectories: true,
				messagePrefix: "Refusing to append under"
			});
		};
		assertAppendCurrent();
		await (await root(path.dirname(filePath), {
			hardlinks: "reject",
			symlinks: "reject",
			mode: 384,
			assertBeforeMutation: assertAppendCurrent
		})).append(path.basename(filePath), content, {
			assertBeforeMutation: assertAppendCurrent,
			durable: false
		});
	} else await appendRegularFile({
		filePath,
		content,
		rejectSymlinkParents: true
	});
	return existingLines;
}
//#endregion
export { writeSessionIngestionState as S, normalizeMemoryDay as _, foreignSessionIngestionSource as a, readSessionIngestionState as b, resolveSessionAgentsForWorkspace as c, sessionExclusionReasons as d, sessionIngestionSourceFromCorpus as f, compareDailyMemoryFilesByNewestDay as g, DAILY_MEMORY_FILENAME_RE as h, appendSessionCorpusText as i, resolveSessionIngestionFileCap as l, trimTrackedSessionScopes as m, SESSION_INGESTION_SCORE as n, mergeTrackedMessageHashes as o, sessionIngestionStateKeyFromCorpus as p, appendSessionCorpusLines as r, resolveAdmissionPolicy as s, SESSION_CORPUS_RELATIVE_DIR as t, scanSessionIngestionSource as u, parseDailyMemoryFileName as v, writeDailyIngestionState as x, readDailyIngestionState as y };
