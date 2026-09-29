import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { f as shortenHomeInString, p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { O as listAgentIds, f as resolveConfiguredAgentId, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as setVerbose } from "./global-state-BAD7XgmL.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { f as parseUsageCountedSessionIdFromFileName } from "./artifacts-C9weQ_MG.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { D as resolveMemoryLightDreamingConfig, O as resolveMemoryRemDreamingConfig, S as resolveMemoryDreamingConfig, T as resolveMemoryDreamingWorkspace, x as resolveMemoryDeepDreamingConfig } from "./dreaming-Rnb_FGdU.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-BskpG3v_.mjs";
import { n as readMemoryEntryOriginsInDatabase } from "./memory-core-host-engine-storage-Dt5aD7j9.mjs";
import { s as normalizeExtraMemoryPathEntries } from "./internal-CDL7w83q.mjs";
import { n as isFileMissingError, r as isPathInside } from "./fs-utils-BVDi6fm8.mjs";
import { i as resolveMemoryIndexIdentityDiagnostic, s as resolveMemorySearchStaleness, t as formatMemoryIndexRebuildGuidance } from "./types-BH9UhQoF.mjs";
import { t as withOpenClawAgentDatabaseWrite } from "./openclaw-agent-db-write-BhC-9Wsf.mjs";
import "./sqlite-runtime-DhVTOiCi.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as ensureMemorySessionTombstones } from "./memory-session-tombstones-Bu9FRJQf.mjs";
import { t as buildAgentSessionKey } from "./resolve-route-zfKT6ZcU.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./routing-JKvWkBDR.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import { n as listMemoryArtifactProvenance } from "./memory-artifact-provenance-p1TjNKv0.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-DiGRTwKs.mjs";
import { l as getMemoryEmbeddingCommandSecretTargetIds } from "./command-secret-targets-DAUWRpL2.mjs";
import { i as withProgressTotals, r as withProgress } from "./progress-BQygak_O.mjs";
import "./session-store-paths-C0kAfy_y.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import "./setup-runtime-o3LAKJcI.mjs";
import { r as withManager } from "./cli-utils-CPCW_T04.mjs";
import "./temp-path-PENdksor.mjs";
import "./memory-core-host-engine-foundation-wgSi2CJX.mjs";
import { l as listSessionTranscriptCorpusEntriesForAgent, t as buildSessionEntry } from "./session-files-DSNs2wC3.mjs";
import { n as resolveMemorySessionTargets } from "./memory-core-host-engine-sessions-Dp8skDK4.mjs";
import "./memory-core-host-status-CWOM9o6Y.mjs";
import "./memory-core-host-runtime-cli-ee_djNcN.mjs";
import "./memory-core-host-runtime-core-C8uEsC2w.mjs";
import { b as writeMemoryCoreWorkspaceEntries, d as SHORT_TERM_RECALL_NAMESPACE, n as DREAMING_MEMORY_BACKUP_NAMESPACE, y as readMemoryCoreWorkspaceEntries } from "./dreaming-state-DJfKblhZ.mjs";
import { t as formatRecallRepairDetails } from "./dreaming-shared-CofeOWBR.mjs";
import { r as resolveMemoryPromotionFileMaxChars } from "./memory-budget-BD5Ujhwr.mjs";
import { a as listWorkspaceMemoryFiles, c as readWorkspaceText, i as listWorkspaceDirectory } from "./memory-workspace-files-Dz8_mlEr.mjs";
import { d as writeBackfillDiaryEntries, g as withMemoryWorkspaceLock, s as removeBackfillDiaryEntries, t as DREAMS_FILENAMES } from "./dreaming-dreams-file-C-CZ4y6s.mjs";
import { c as writePhaseSignalStore, r as readPhaseSignalStore } from "./short-term-promotion-store-CMmsbVWh.mjs";
import { n as previewGroundedRemMarkdown } from "./rem-evidence-8JlTTS2o.mjs";
import { a as resolveShortTermRecallLockPath, c as readMemoryPreimages, i as repairShortTermPromotionArtifacts, n as auditShortTermPromotionArtifacts, o as resolveShortTermRecallStorePath, r as removeGroundedShortTermCandidates, s as applyShortTermPromotions, t as rankShortTermPromotionCandidates } from "./short-term-promotion-i0KUeUoz.mjs";
import { i as commitMemoryContent, o as hashMemoryContent } from "./short-term-promotion-memory-write-CFZnCVmO.mjs";
import { n as listMemoryEntryOrigins, o as recordMemorySessionTombstonesInDatabase, t as deleteMemoryEntryOriginsInDatabase } from "./memory-entry-origins-B0k3pTMh.mjs";
import { m as writeSessionIngestionState, s as readSessionIngestionState, t as SESSION_CORPUS_RELATIVE_DIR } from "./session-ingestion-Cghu7HnA.mjs";
import { i as recordShortTermRecalls, r as recordGroundedShortTermCandidates } from "./short-term-promotion-record-B9ScgmfO.mjs";
import { i as seedHistoricalDailyMemorySignals } from "./dreaming-phases-BT-n43oF.mjs";
import { t as previewRemHarness } from "./rem-harness-BAzo3mpg.mjs";
import { t as captureMemoryRebuildNotice } from "./memory-rebuild-notice-1g-sm2bb.mjs";
import { c as openMemoryDatabaseAtPath, d as resetMemoryDatabase, r as isMemorySessionIndexable, s as closeMemoryDatabase, t as formatMemoryVectorDegradedWriteReason } from "./manager-vector-warning-DACF6YPM.mjs";
import { r as getMemorySearchManager } from "./memory-Bv2u560h.mjs";
import { n as repairDreamingArtifacts, t as auditDreamingArtifacts } from "./dreaming-repair-qFwLjGF3.mjs";
import { r as runSessionBackfill } from "./session-backfill-h1NRN5vZ.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region extensions/memory-core/src/cli-runtime-common.ts
const { warn: warn$3 } = theme;
function isMemorySecretOwnerFailure(error, message) {
	const candidate = error && typeof error === "object" ? error : {};
	if (candidate.ownerKind === "capability" && typeof candidate.ownerId === "string" && candidate.ownerId.startsWith("memory-provider:")) return true;
	if (Array.isArray(candidate.paths) && candidate.paths.some((entry) => typeof entry === "string" && entry.includes("memory.search.remote.apiKey"))) return true;
	return message.includes("capability:memory-provider:");
}
async function loadMemoryCommandConfig(commandName, mode) {
	const config = getRuntimeConfig({ skipPluginValidation: true });
	try {
		const { resolvedConfig, diagnostics } = await resolveCommandSecretRefsViaGateway({
			config,
			commandName,
			targetIds: getMemoryEmbeddingCommandSecretTargetIds(),
			...mode ? { mode } : {}
		});
		return {
			config: resolvedConfig,
			diagnostics
		};
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
		const message = formatErrorMessage(error);
		if (mode !== "read_only_status" || isMemorySecretOwnerFailure(error, message) || code !== "SECRET_SURFACE_UNAVAILABLE" && !message.includes("SECRET_SURFACE_UNAVAILABLE")) throw error;
		return {
			config,
			diagnostics: [`${commandName}: ${message}; continuing with degraded read-only config so healthy memory surfaces remain visible.`]
		};
	}
}
function emitMemorySecretResolveDiagnostics(diagnostics, params) {
	if (diagnostics.length === 0) return;
	const toStderr = params?.json === true;
	for (const entry of diagnostics) {
		const message = warn$3(`[secrets] ${entry}`);
		if (toStderr) defaultRuntime.error(message);
		else defaultRuntime.log(message);
	}
}
function resolveMemoryPluginConfig(cfg) {
	const entry = asNullableRecord(cfg.plugins?.entries?.["memory-core"]);
	return asNullableRecord(entry?.config) ?? {};
}
function formatAuditCounts(audit) {
	const scriptCoverage = audit.conceptTagScripts ? [
		audit.conceptTagScripts.latinEntryCount > 0 ? `${audit.conceptTagScripts.latinEntryCount} latin` : null,
		audit.conceptTagScripts.cjkEntryCount > 0 ? `${audit.conceptTagScripts.cjkEntryCount} cjk` : null,
		audit.conceptTagScripts.mixedEntryCount > 0 ? `${audit.conceptTagScripts.mixedEntryCount} mixed` : null,
		audit.conceptTagScripts.otherEntryCount > 0 ? `${audit.conceptTagScripts.otherEntryCount} other` : null
	].filter(Boolean).join(", ") : "";
	const suffix = scriptCoverage ? ` · scripts=${scriptCoverage}` : "";
	return `${audit.entryCount} entries · ${audit.promotedCount} promoted · ${audit.conceptTaggedEntryCount} concept-tagged · ${audit.spacedEntryCount} spaced${suffix}`;
}
function resolveMemoryAgent(cfg, agent) {
	const trimmed = agent?.trim();
	if (agent !== void 0 && !trimmed) throw new Error("--agent must not be blank");
	return trimmed ? resolveConfiguredAgentId(cfg, trimmed) : resolveDefaultAgentId(cfg);
}
function buildCliMemorySearchSessionKey(agentId) {
	return buildAgentSessionKey({
		agentId,
		channel: "cli",
		peer: {
			kind: "direct",
			id: "memory-search"
		},
		dmScope: "per-channel-peer"
	});
}
function resolveMemoryAgentIds(cfg, agent) {
	const trimmed = agent?.trim();
	if (agent !== void 0 && !trimmed) throw new Error("--agent must not be blank");
	return trimmed ? [resolveConfiguredAgentId(cfg, trimmed)] : listAgentIds(cfg);
}
function formatExtraPaths(workspaceDir, extraPaths) {
	return normalizeExtraMemoryPathEntries(workspaceDir, extraPaths).map((entry) => {
		const root = shortenHomePath(entry.path);
		return entry.pattern ? `${root} (pattern: ${entry.pattern})` : root;
	});
}
async function withMemoryCommand(params) {
	const { config: cfg, diagnostics } = await loadMemoryCommandConfig(params.commandName, params.purpose === "status" ? "read_only_status" : void 0);
	emitMemorySecretResolveDiagnostics(diagnostics, { json: params.diagnosticsToStderr });
	const agentIds = params.allAgents ? resolveMemoryAgentIds(cfg, params.agent) : [resolveMemoryAgent(cfg, params.agent)];
	for (const agentId of agentIds) {
		const managerParams = {
			cfg,
			agentId
		};
		if (params.purpose) managerParams.purpose = params.purpose;
		if (params.inspectSources) managerParams.inspectSources = true;
		if (params.acquireLocalService) managerParams.acquireLocalService = params.acquireLocalService;
		await withManager({
			getManager: () => getMemorySearchManager(managerParams),
			onMissing: (error) => {
				if (!error?.trim()) {
					defaultRuntime.log("Memory search disabled.");
					params.onUnavailable?.({
						agentId,
						status: "disabled"
					});
					return;
				}
				const message = `${params.commandName} failed (${agentId}): ${error}`;
				defaultRuntime.error(message);
				process.exitCode = 1;
				params.onUnavailable?.({
					...formatCliJsonFailure(message),
					agentId
				});
			},
			onCloseError: (err) => defaultRuntime.error(`Memory manager close failed: ${formatErrorMessage(err)}`),
			close: async (manager) => {
				await manager.close?.();
			},
			run: async (manager) => params.run({
				manager,
				cfg,
				agentId
			})
		});
	}
	return cfg;
}
async function scanMemoryManagerSources(status) {
	if (!status.sourceCounts?.length) return;
	const sources = status.sourceCounts.map((entry) => ({
		source: entry.source,
		totalFiles: entry.eligible ?? null,
		issues: entry.issues ?? []
	}));
	return {
		sources,
		totalFiles: sources.some((entry) => entry.totalFiles === null) ? null : sources.reduce((total, entry) => total + (entry.totalFiles ?? 0), 0),
		issues: sources.flatMap((entry) => entry.issues)
	};
}
function formatMemoryIndexOutcome(status, scan, agentId) {
	const indexedFiles = status.files ?? 0;
	if (indexedFiles === 0 && status.workspaceDir && scan?.totalFiles === 0) return `No memory files found in ${shortenHomePath(status.workspaceDir)}; nothing indexed (${agentId}).`;
	return `Memory index updated (${agentId}): ${indexedFiles} ${indexedFiles === 1 ? "file" : "files"} indexed.`;
}
//#endregion
//#region extensions/memory-core/src/memory-forget-curated-writes.ts
function collectTranscriptWrites(params) {
	const message = asNullableRecord(params.message);
	if (message?.role !== "assistant" || !Array.isArray(message.content)) return;
	for (const item of message.content) {
		const call = asNullableRecord(item);
		if (!call || call.type !== "toolCall" && call.type !== "tool_call" && call.type !== "tool_use" || call.name !== "apply_patch" && call.name !== "write" && call.name !== "edit") continue;
		let rawArguments = call.arguments ?? call.input;
		if (typeof rawArguments === "string") try {
			rawArguments = JSON.parse(rawArguments);
		} catch {
			rawArguments = call.name === "apply_patch" ? { input: rawArguments } : void 0;
		}
		const args = asNullableRecord(rawArguments);
		if (!args) continue;
		const candidates = [
			args.path,
			args.file_path,
			args.filePath
		];
		if (call.name === "apply_patch") {
			const input = typeof args.input === "string" ? args.input : args.patch;
			if (typeof input === "string") for (const match of input.matchAll(/^\*\*\* (?:(?:Add|Update|Delete) File|Move to): (.+)$/gmu)) candidates.push(match[1]);
			if (Array.isArray(args.changes)) for (const change of args.changes) {
				const entry = asNullableRecord(change);
				if (entry) candidates.push(entry.path, asNullableRecord(entry.kind)?.move_path);
			}
			else candidates.push(...Object.keys(asNullableRecord(args.changes) ?? {}));
		}
		const cwd = typeof args.cwd === "string" ? args.cwd : params.workspaceDir;
		for (const candidate of candidates) {
			if (typeof candidate !== "string" || !candidate.trim()) continue;
			const absolutePath = path.resolve(params.workspaceDir, cwd, candidate);
			if (!isPathInside(params.workspaceDir, absolutePath)) continue;
			const relativePath = path.relative(params.workspaceDir, absolutePath).replaceAll("\\", "/");
			if ((relativePath === "MEMORY.md" || relativePath === "USER.md" || relativePath.startsWith("memory/")) && !params.writes.has(relativePath)) params.writes.set(relativePath, {
				relativePath,
				observedAt: params.observedAt
			});
		}
	}
}
//#endregion
//#region extensions/memory-core/src/memory-forget-index-sources.ts
function referencesSession(value, agentId, sessionIds) {
	const agent = escapePattern(agentId);
	const references = new RegExp(`(?:^|[\\s[/:])(?:sessions/${agent}/|${agent}:(?!sessions/))([^\\s\\]#;:/]+)`, "gu");
	return [...value.matchAll(references)].some(([, reference]) => sessionIds.has(parseUsageCountedSessionIdFromFileName(reference) ?? reference)) || [...value.matchAll(/\bSession ID:\s*([^;\s]+)/giu)].some(([, sessionId]) => sessionIds.has(sessionId));
}
function escapePattern(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
async function planMemoryIndex(params) {
	const result = withOpenClawAgentDatabaseReadOnly(({ db, path: databasePath }) => {
		const kysely = getNodeSqliteKysely(db);
		const indexedChunks = executeSqliteQuerySync(db, kysely.selectFrom("memory_index_chunks as chunk").select([
			"chunk.id",
			"chunk.path",
			"chunk.source"
		]).$if(tableExists(db, "memory_index_chunk_provenance"), (query) => query.leftJoin("memory_index_chunk_provenance as provenance", "provenance.chunk_id", "chunk.id").select(["provenance.origin_class as originClass", "provenance.session_kind as sessionKind"])).select((eb) => eb.case("chunk.source").when("sessions").then("").else(eb.ref("chunk.text")).end().as("text"))).rows;
		const changedPaths = new Set(params.changedPaths);
		for (const chunk of indexedChunks) if (chunk.source === "memory" && params.matchesMemory(chunk.text)) changedPaths.add(chunk.path);
		const chunks = indexedChunks.filter((chunk) => changedPaths.has(chunk.path) || referencesSession(chunk.path, params.agentId, params.sessionIds) || params.sessionIds.size > 0 && chunk.source === "sessions" && (chunk.originClass === "system" || !isMemorySessionIndexable({ sessionKind: chunk.sessionKind ?? "unknown" }) || referencesSession(chunk.path, params.agentId, params.excludedSessionIds)));
		const removedSessionPaths = new Set(chunks.filter((chunk) => chunk.source === "sessions").map((chunk) => chunk.path));
		const sources = executeSqliteQuerySync(db, kysely.selectFrom("memory_index_sources").select(["path", "source"])).rows.filter((source) => params.removedPaths.has(source.path) || source.source === "sessions" && removedSessionPaths.has(source.path));
		const chunkIds = chunks.map((chunk) => chunk.id);
		const ftsRows = chunkIds.length > 0 && tableExists(db, "memory_index_chunks_fts") ? executeSqliteQuerySync(db, kysely.selectFrom("memory_index_chunks_fts").select((eb) => eb.fn.countAll().as("count")).where("rowid", "in", kysely.selectFrom("memory_index_chunks").select("chunk_rowid").where("id", "in", chunkIds))).rows[0].count : 0;
		const hasVectorTable = tableExists(db, "memory_index_chunks_vec");
		let embeddingCacheRows = 0;
		if (params.sessionIds.size > 0 && tableExists(db, "memory_embedding_cache")) {
			const cacheCount = db.prepare("SELECT COUNT(*) AS count FROM memory_embedding_cache").get();
			embeddingCacheRows = Number(cacheCount.count ?? 0);
		}
		return {
			chunks,
			sources,
			ftsRows,
			embeddingCacheRows,
			hasVectorTable,
			databasePath
		};
	}, { agentId: params.agentId });
	if (!result.found) return {
		chunks: [],
		sources: [],
		ftsRows: 0,
		vectorRows: 0,
		embeddingCacheRows: 0,
		hasVectorTable: false
	};
	let vectorRows = 0;
	if (result.value.hasVectorTable && result.value.chunks.length > 0) {
		const probe = openNodeSqliteDatabase(":memory:", { allowExtension: true });
		let extensionPath;
		try {
			const loaded = await loadSqliteVecExtension({ db: probe });
			if (!loaded.ok || !loaded.extensionPath) throw new Error(`memory forget cannot inspect vector index: ${loaded.error ?? "load failed"}`);
			extensionPath = loaded.extensionPath;
		} finally {
			probe.close();
		}
		const vectorResult = withOpenClawAgentDatabaseReadOnly(({ db }) => {
			db.enableLoadExtension(true);
			db.loadExtension(extensionPath);
			const vectorKysely = getNodeSqliteKysely(db);
			return executeSqliteQuerySync(db, vectorKysely.selectFrom("memory_index_chunks_vec").select((eb) => eb.fn.countAll().as("count")).where("id", "in", result.value.chunks.map((chunk) => chunk.id))).rows[0].count;
		}, { agentId: params.agentId }, { allowExtension: true });
		vectorRows = vectorResult.found ? vectorResult.value : 0;
	}
	return {
		...result.value,
		vectorRows
	};
}
function deleteMemoryIndexSources(database, sources) {
	const db = getNodeSqliteKysely(database);
	for (let start = 0; start < sources.length;) {
		const source = sources[start];
		let end = start + 1;
		while (end < sources.length && sources[end].source === source.source) end += 1;
		executeSqliteQuerySync(database, db.deleteFrom("memory_index_sources").where("path", "in", sqliteStringSet(sources.slice(start, end).map((row) => row.path))).where("source", "=", source.source));
		start = end;
	}
}
//#endregion
//#region extensions/memory-core/src/memory-forget-report.ts
function summarizeParticipantMatches(targets, participants) {
	return [...new Set(participants ?? [])].toSorted().map((actorId) => ({
		actorId,
		identities: [...new Map(targets.flatMap((target) => target.participants.filter((identity) => identity.id === actorId).map((identity) => [JSON.stringify(identity), identity]))).values()]
	}));
}
//#endregion
//#region extensions/memory-core/src/memory-forget.ts
const PROMOTION_MARKER = /^\s*<!--\s*openclaw-memory-promotion:([^\n]*?)\s*-->\s*$/u;
const LINEAGE_MARKER = /^\s*<!--\s*openclaw-memory-lineage:[^\n]*?-->\s*$/u;
function scrubMemoryContent(params) {
	const lines = params.content.split("\n");
	const corpusSnippets = [...params.corpusSnippets];
	let removedEntries = 0;
	let removedLines = 0;
	for (let index = 0; index < lines.length; index += 1) {
		const markerKey = PROMOTION_MARKER.exec(lines[index] ?? "")?.[1]?.trim();
		if (markerKey && params.entryKeys.has(markerKey)) {
			const start = index > 0 && LINEAGE_MARKER.test(lines[index - 1] ?? "") ? index - 1 : index;
			let end = index + 1;
			if (end < lines.length && !PROMOTION_MARKER.test(lines[end] ?? "")) {
				end += 1;
				while (end < lines.length && /^\s+\S/u.test(lines[end] ?? "")) end += 1;
			}
			lines.splice(start, end - start);
			removedEntries += 1;
			index = start - 1;
			continue;
		}
		if (corpusSnippets.some((snippet) => lines[index]?.includes(snippet))) {
			lines.splice(index, 1);
			removedLines += 1;
			index -= 1;
			continue;
		}
		if (!referencesSession(lines[index] ?? "", params.agentId, params.sessionIds)) continue;
		const heading = /^(#{1,6})\s/u.exec(lines[index] ?? "");
		const rowIndent = /^(\s*)[-*+]\s/u.exec(lines[index] ?? "")?.[1]?.length;
		if (!heading && !/\bSession ID:/iu.test(lines[index] ?? "")) continue;
		let end = index + 1;
		while (end < lines.length) {
			const nextHeading = /^(#{1,6})\s/u.exec(lines[end] ?? "");
			if (rowIndent !== void 0 && (lines[end] ?? "").search(/\S/u) <= rowIndent || nextHeading && (!heading || nextHeading[1].length <= heading[1].length) || /\bSession ID:/iu.test(lines[end] ?? "")) break;
			end += 1;
		}
		lines.splice(index, end - index);
		removedEntries += 1;
		index -= 1;
	}
	return {
		content: lines.join("\n"),
		removedEntries,
		removedLines
	};
}
function selectedLineageIdentity(origins, sessionIds, entryKeys) {
	return JSON.stringify(origins.filter((origin) => sessionIds.has(origin.sessionId) || entryKeys.has(origin.entryKey)).map(({ entryKey, sessionId }) => [entryKey, sessionId]));
}
async function forgetMemoryEntries(params) {
	if (!params.sessionIds?.length && !params.hookSources?.length && !params.participants?.length) throw new Error("memory forget requires a session, hook source, or participant selector");
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
	const run = async () => {
		const env = {
			...process.env,
			OPENCLAW_STATE_DIR: resolveStateDir(process.env)
		};
		const databaseOptions = {
			agentId: params.agentId,
			env,
			path: resolveOpenClawAgentSqlitePath({
				agentId: params.agentId,
				env
			})
		};
		const context = {
			targets: resolveMemorySessionTargets({
				agentId: params.agentId,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId }),
				sessionIds: params.sessionIds,
				hookSources: params.hookSources,
				participants: params.participants,
				since: params.since
			}),
			databaseOptions,
			selectedEntryKeys: /* @__PURE__ */ new Set(),
			tombstoned: false
		};
		try {
			for (;;) {
				const result = await forgetWorkspaceMemory(params, workspaceDir, context);
				if (result.kind === "complete") return result.report;
			}
		} finally {
			context.database?.release();
		}
	};
	return params.dryRun ? run() : withMemoryWorkspaceLock(workspaceDir, run);
}
async function forgetWorkspaceMemory(params, workspaceDir, context) {
	const targets = context.targets;
	const sessionIds = new Set(targets.map((target) => target.sessionId));
	const allOrigins = context.origins ?? listMemoryEntryOrigins({ agentId: params.agentId });
	for (const origin of allOrigins) if (sessionIds.has(origin.sessionId)) context.selectedEntryKeys.add(origin.entryKey);
	const entryKeys = new Set(context.selectedEntryKeys);
	const lineageIdentity = selectedLineageIdentity(allOrigins, sessionIds, entryKeys);
	const allOriginKeys = /* @__PURE__ */ new Set([...entryKeys, ...allOrigins.map((origin) => origin.entryKey)]);
	const mixedLineageEntryKeys = new Set(allOrigins.filter((origin) => entryKeys.has(origin.entryKey) && !sessionIds.has(origin.sessionId)).map((origin) => origin.entryKey));
	const untargetableEntryKeys = /* @__PURE__ */ new Set();
	const refusals = [];
	const corpusDir = path.join(workspaceDir, SESSION_CORPUS_RELATIVE_DIR);
	const corpusFiles = await listWorkspaceDirectory(workspaceDir, corpusDir).catch((error) => {
		if (isFileMissingError(error)) return [];
		throw error;
	});
	const corpusRewrites = [];
	const corpusSnippets = /* @__PURE__ */ new Set();
	let removedCorpusLines = 0;
	for (const file of corpusFiles) {
		if (!file.isFile() || !/\.(?:txt|md)$/iu.test(file.name)) continue;
		const absolutePath = path.join(corpusDir, file.name);
		const content = await readWorkspaceText(workspaceDir, absolutePath);
		const lines = content.split("\n");
		const retained = lines.filter((line) => {
			if (!referencesSession(line, params.agentId, sessionIds)) return true;
			const snippet = /^\[[^\]]+#L\d+\]\s*(.+)$/u.exec(line.trimEnd())?.[1]?.trim();
			if (snippet && snippet.length >= 12) corpusSnippets.add(snippet);
			return false;
		});
		if (retained.length !== lines.length) {
			removedCorpusLines += lines.length - retained.length;
			const rewritten = retained.join("\n");
			corpusRewrites.push({
				absolutePath,
				relativePath: path.relative(workspaceDir, absolutePath).replaceAll("\\", "/"),
				content: rewritten,
				remove: rewritten.trim().length === 0,
				expectedContent: content
			});
		}
	}
	const memoryRewrites = [];
	const scrub = (content) => scrubMemoryContent({
		content,
		entryKeys,
		sessionIds,
		corpusSnippets,
		agentId: params.agentId
	});
	let removedMemoryEntries = 0;
	let removedMemoryLines = 0;
	const memoryFiles = await listWorkspaceMemoryFiles(workspaceDir, DREAMS_FILENAMES.map((name) => path.join(workspaceDir, name)));
	for (const absolutePath of memoryFiles) {
		if (path.dirname(absolutePath) === corpusDir) continue;
		const content = await readWorkspaceText(workspaceDir, absolutePath);
		for (const line of content.split(/\r?\n/u)) {
			const key = PROMOTION_MARKER.exec(line)?.[1]?.trim();
			if (key && !allOriginKeys.has(key)) untargetableEntryKeys.add(key);
		}
		const scrubbed = scrub(content);
		if (/^## Memory Consolidation History\r?$[\s\S]*^ {2}- `[+-] /mu.test(scrubbed.content)) refusals.push(`Cannot trace historical consolidation highlights in ${path.relative(workspaceDir, absolutePath)}; review them manually.`);
		if (scrubbed.content !== content) {
			memoryRewrites.push({
				absolutePath,
				relativePath: path.relative(workspaceDir, absolutePath).replaceAll("\\", "/"),
				content: scrubbed.content,
				remove: false,
				expectedContent: content
			});
			removedMemoryEntries += scrubbed.removedEntries;
			removedMemoryLines += scrubbed.removedLines;
		}
	}
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const [shortTermEntries, phaseSignals, ingestionState, backups, artifactProvenance, sessionCorpusEntries] = await Promise.all([
		readMemoryCoreWorkspaceEntries({
			namespace: SHORT_TERM_RECALL_NAMESPACE,
			workspaceDir
		}),
		readPhaseSignalStore(workspaceDir, nowIso),
		readSessionIngestionState(workspaceDir),
		readMemoryPreimages(workspaceDir),
		listMemoryArtifactProvenance({ workspaceDir }),
		listSessionTranscriptCorpusEntriesForAgent(params.agentId)
	]);
	const sessionKeys = new Set(targets.map((target) => target.sessionKey));
	const curatedWrites = new Map(artifactProvenance.filter(({ provenance }) => provenance.sessionId ? sessionIds.has(provenance.sessionId) : Boolean(provenance.sessionKey && sessionKeys.has(provenance.sessionKey))).map(({ relativePath, provenance }) => [relativePath, {
		relativePath,
		observedAt: provenance.observedAt
	}]));
	const retainedShortTerm = shortTermEntries.filter(({ key, value }) => !entryKeys.has(key) && !entryKeys.has(value.key) && !referencesSession(`${value.path}\n${value.snippet}`, params.agentId, sessionIds));
	const retainedShortTermSet = new Set(retainedShortTerm);
	const removedShortTermKeys = new Set(shortTermEntries.filter((entry) => !retainedShortTermSet.has(entry)).flatMap(({ key, value }) => [key, value.key]));
	const removedPhaseSignalKeys = Object.keys(phaseSignals.entries).filter((key) => entryKeys.has(key) || removedShortTermKeys.has(key));
	const retainedSeenMessages = Object.entries(ingestionState.seenMessages).filter(([scope]) => !referencesSession(scope, params.agentId, sessionIds));
	const removedSeenScopes = Object.keys(ingestionState.seenMessages).length - retainedSeenMessages.length;
	const retainedFileStates = Object.fromEntries(Object.entries(ingestionState.files).filter(([key]) => !referencesSession(key, params.agentId, sessionIds)));
	let rewrittenBackups = 0;
	const nextBackups = backups.map(({ key, value }) => {
		const scrubbed = scrub(value.content);
		if (scrubbed.content === value.content) return {
			key,
			value
		};
		rewrittenBackups += 1;
		return {
			key,
			value: {
				...value,
				content: scrubbed.content,
				contentHash: createHash("sha256").update(scrubbed.content).digest("hex")
			}
		};
	});
	const excludedSessionIds = /* @__PURE__ */ new Set();
	for (const entry of sessionCorpusEntries) {
		const selectedSession = sessionIds.has(entry.sessionId);
		if (!isMemorySessionIndexable(entry)) {
			excludedSessionIds.add(entry.sessionId);
			if (!selectedSession) continue;
		}
		if (selectedSession || entry.artifactKind === "archive-artifact" && (!entry.sessionKind || entry.sessionKind === "unknown")) {
			const parsed = await buildSessionEntry(entry.sessionFile, {
				...entry.transcriptSource === "sqlite" ? {
					agentId: entry.agentId,
					sessionId: entry.sessionId,
					storePath: entry.storePath
				} : {},
				...entry.sessionKey ? { sessionKey: entry.sessionKey } : {},
				...entry.sessionKind ? { sessionKind: entry.sessionKind } : {},
				...selectedSession ? { onTranscriptMessage: (message, observedAt) => collectTranscriptWrites({
					message,
					observedAt,
					workspaceDir,
					writes: curatedWrites
				}) } : {}
			});
			if (parsed && !isMemorySessionIndexable(parsed)) excludedSessionIds.add(entry.sessionId);
		}
	}
	const changedPaths = new Set([...memoryRewrites, ...corpusRewrites].map((rewrite) => rewrite.relativePath));
	const indexPlan = await planMemoryIndex({
		agentId: params.agentId,
		changedPaths,
		removedPaths: new Set(corpusRewrites.filter((rewrite) => rewrite.remove).map((rewrite) => rewrite.relativePath)),
		sessionIds,
		excludedSessionIds,
		matchesMemory: (content) => scrub(content).content !== content
	});
	const report = {
		agentId: params.agentId,
		dryRun: params.dryRun === true,
		sessionIds: [...sessionIds].toSorted(),
		participantMatches: summarizeParticipantMatches(targets, params.participants),
		sessionResolutions: targets.map(({ sessionId, sessionKey, resolution }) => sessionKey ? {
			sessionId,
			sessionKey,
			source: resolution
		} : {
			sessionId,
			source: resolution
		}).toSorted((left, right) => left.sessionId.localeCompare(right.sessionId)),
		entryKeys: [...entryKeys].toSorted(),
		mixedLineageEntryKeys: [...mixedLineageEntryKeys].toSorted(),
		untargetableEntryKeys: [...untargetableEntryKeys].toSorted(),
		curatedWrites: [...curatedWrites.values()].toSorted((left, right) => left.relativePath.localeCompare(right.relativePath)),
		artifacts: {
			memoryFiles: memoryRewrites.length,
			memoryEntries: removedMemoryEntries,
			memoryLines: removedMemoryLines,
			sessionCorpusFiles: corpusRewrites.length,
			sessionCorpusLines: removedCorpusLines,
			indexChunks: indexPlan.chunks.length,
			indexSources: indexPlan.sources.length,
			ftsRows: indexPlan.ftsRows,
			vectorRows: indexPlan.vectorRows,
			embeddingCacheRows: indexPlan.embeddingCacheRows,
			shortTermEntries: shortTermEntries.length - retainedShortTerm.length,
			seenHashScopes: removedSeenScopes,
			backups: rewrittenBackups,
			originRows: allOrigins.filter((origin) => entryKeys.has(origin.entryKey)).length
		},
		refusals
	};
	if (params.dryRun || sessionIds.size === 0) return {
		kind: "complete",
		report
	};
	context.database ??= await withOpenClawAgentDatabaseWrite(context.databaseOptions, () => borrowOpenClawAgentDatabase(context.databaseOptions));
	const { db } = context.database;
	const lineageIsCurrent = () => {
		const origins = tableExists(db, "memory_entry_origins") ? readMemoryEntryOriginsInDatabase(db, { agentId: params.agentId }) : [];
		if (selectedLineageIdentity(origins, sessionIds, entryKeys) === lineageIdentity) return true;
		context.origins = origins;
		for (const origin of origins) if (sessionIds.has(origin.sessionId)) context.selectedEntryKeys.add(origin.entryKey);
		return false;
	};
	const kysely = getNodeSqliteKysely(db);
	const chunkIds = indexPlan.chunks.map((chunk) => chunk.id);
	if (chunkIds.length > 0 && indexPlan.hasVectorTable) {
		const loaded = await loadSqliteVecExtension({ db });
		if (!loaded.ok) throw new Error(`memory forget cannot purge vector index: ${loaded.error ?? "load failed"}`);
	}
	if (!await withOpenClawAgentDatabaseWrite(context.databaseOptions, () => {
		if (!context.tombstoned) {
			ensureMemorySessionTombstones(db);
			if (!runSqliteImmediateTransactionSync(db, () => {
				if (!lineageIsCurrent()) return false;
				if (recordMemorySessionTombstonesInDatabase(db, {
					agentId: params.agentId,
					sessionIds: [...sessionIds]
				}) === 0) executeSqliteQuerySync(db, kysely.updateTable("memory_index_state").set((expression) => ({ revision: expression("revision", "+", 1) })).where("id", "=", 1));
				return true;
			})) return false;
			context.tombstoned = true;
		}
		return runSqliteImmediateTransactionSync(db, () => {
			if (!lineageIsCurrent()) return false;
			if (chunkIds.length > 0) {
				if (indexPlan.hasVectorTable) executeSqliteQuerySync(db, kysely.deleteFrom("memory_index_chunks_vec").where("id", "in", chunkIds));
				executeSqliteQuerySync(db, kysely.deleteFrom("memory_index_chunks").where("id", "in", chunkIds));
			}
			deleteMemoryIndexSources(db, indexPlan.sources);
			if (tableExists(db, "memory_embedding_cache")) executeSqliteQuerySync(db, kysely.deleteFrom("memory_embedding_cache"));
			return true;
		});
	}, db)) return { kind: "reprepare" };
	if (removedPhaseSignalKeys.length > 0) {
		for (const key of removedPhaseSignalKeys) delete phaseSignals.entries[key];
		phaseSignals.updatedAt = nowIso;
		await writePhaseSignalStore(workspaceDir, phaseSignals);
	}
	if (retainedShortTerm.length !== shortTermEntries.length) await writeMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_RECALL_NAMESPACE,
		workspaceDir,
		entries: retainedShortTerm
	});
	if (removedSeenScopes > 0 || Object.keys(retainedFileStates).length !== Object.keys(ingestionState.files).length) await writeSessionIngestionState(workspaceDir, {
		...ingestionState,
		files: retainedFileStates,
		seenMessages: Object.fromEntries(retainedSeenMessages)
	});
	if (rewrittenBackups > 0) await writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_MEMORY_BACKUP_NAMESPACE,
		workspaceDir,
		entries: nextBackups
	});
	for (const rewrite of [...memoryRewrites, ...corpusRewrites]) await commitMemoryContent({
		workspaceDir,
		filePath: rewrite.absolutePath,
		tempPrefix: `${path.basename(rewrite.absolutePath)}.forget`,
		expectedHash: hashMemoryContent(rewrite.expectedContent),
		expectedContent: rewrite.expectedContent,
		allowInPlaceFallback: true,
		conflictMessage: `${path.basename(rewrite.absolutePath)} changed before the memory forget rewrite could commit`,
		content: rewrite.remove ? null : rewrite.content
	});
	await withOpenClawAgentDatabaseWrite(context.databaseOptions, () => deleteMemoryEntryOriginsInDatabase(db, {
		agentId: params.agentId,
		entryKeys: [...entryKeys]
	}), db);
	return {
		kind: "complete",
		report
	};
}
//#endregion
//#region extensions/memory-core/src/cli-index-search.runtime.ts
const { accent: accent$1, heading: heading$2, info: info$1, muted: muted$2, success: success$1, warn: warn$2 } = theme;
function formatSourceLabel(source, workspaceDir) {
	if (source === "memory") return shortenHomeInString(`memory (MEMORY.md + ${path.join(workspaceDir, "memory")}${path.sep}*.md)`);
	if (source === "sessions") return "sessions (current transcripts + retained transcript artifacts)";
	return source;
}
async function runMemoryIndex(opts, hostOptions) {
	setVerbose(Boolean(opts.verbose));
	await withMemoryCommand({
		commandName: "memory index",
		agent: opts.agent,
		allAgents: true,
		purpose: "cli",
		inspectSources: true,
		...hostOptions,
		run: async ({ manager, agentId }) => {
			try {
				const syncFn = manager.sync ? manager.sync.bind(manager) : void 0;
				if (opts.verbose) {
					const status = manager.status();
					const label = (text) => muted$2(`${text}:`);
					const sourceLabels = (status.sources ?? []).map((source) => formatSourceLabel(source, status.workspaceDir ?? ""));
					const extraPaths = status.workspaceDir ? formatExtraPaths(status.workspaceDir, status.extraPaths ?? []) : [];
					const requestedProvider = status.requestedProvider ?? status.provider;
					const modelLabel = status.model ?? status.provider;
					const lines = [
						`${heading$2("Memory Index")} ${muted$2(`(${agentId})`)}`,
						`${label("Provider")} ${info$1(status.provider)} ${muted$2(`(requested: ${requestedProvider})`)}`,
						`${label("Model")} ${info$1(modelLabel)}`,
						sourceLabels.length ? `${label("Sources")} ${info$1(sourceLabels.join(", "))}` : null,
						extraPaths.length ? `${label("Extra paths")} ${info$1(extraPaths.join(", "))}` : null
					].filter(Boolean);
					if (status.fallback) lines.push(`${label("Fallback")} ${warn$2(status.fallback.from)}`);
					defaultRuntime.log(lines.join("\n"));
					defaultRuntime.log("");
				}
				const startedAt = Date.now();
				let lastLabel = "Indexing memory…";
				let lastCompleted = 0;
				let lastTotal = 0;
				const formatDuration = (elapsedMs) => {
					const seconds = Math.floor(elapsedMs / 1e3);
					return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
				};
				const buildLabel = () => {
					const elapsedMs = Math.max(1, Date.now() - startedAt);
					const elapsed = formatDuration(elapsedMs);
					if (lastTotal <= 0 || lastCompleted <= 0) return `${lastLabel} · elapsed ${elapsed}`;
					const remainingMs = Math.max(0, (lastTotal - lastCompleted) * elapsedMs / lastCompleted);
					return `${lastLabel} · elapsed ${elapsed} · eta ${formatDuration(remainingMs)}`;
				};
				if (!syncFn) {
					defaultRuntime.log("Memory backend does not support manual reindex.");
					return;
				}
				await withProgressTotals({
					label: "Indexing memory…",
					total: 0,
					fallback: opts.verbose ? "line" : void 0
				}, async (update, progress) => {
					const interval = setInterval(() => {
						progress.setLabel(buildLabel());
					}, 1e3);
					try {
						await syncFn({
							reason: "cli",
							force: Boolean(opts.force),
							progress: (syncUpdate) => {
								if (syncUpdate.label) lastLabel = syncUpdate.label;
								lastCompleted = syncUpdate.completed;
								lastTotal = syncUpdate.total;
								update({
									completed: syncUpdate.completed,
									total: syncUpdate.total,
									label: buildLabel()
								});
								progress.setLabel(buildLabel());
							}
						});
					} finally {
						clearInterval(interval);
					}
				});
				let postIndexStatus = manager.status();
				const scan = await scanMemoryManagerSources(postIndexStatus);
				const outcome = formatMemoryIndexOutcome(postIndexStatus, scan, agentId);
				let semanticVectorAvailable = postIndexStatus.vector?.semanticAvailable;
				const vectorStoreAvailable = postIndexStatus.vector?.storeAvailable ?? postIndexStatus.vector?.available;
				if (postIndexStatus.backend === "builtin" && (postIndexStatus.vector?.enabled ?? false) && semanticVectorAvailable === void 0 && vectorStoreAvailable !== false && typeof manager.probeVectorAvailability === "function") {
					semanticVectorAvailable = await manager.probeVectorAvailability();
					postIndexStatus = manager.status();
					semanticVectorAvailable = postIndexStatus.vector?.semanticAvailable ?? semanticVectorAvailable;
				}
				const vectorEnabled = postIndexStatus.vector?.enabled ?? false;
				const vectorAvailable = semanticVectorAvailable ?? postIndexStatus.vector?.semanticAvailable ?? postIndexStatus.vector?.available ?? postIndexStatus.vector?.storeAvailable;
				const vectorLoadErr = postIndexStatus.vector?.loadError;
				defaultRuntime.log(outcome);
				if (vectorEnabled && vectorAvailable === false) defaultRuntime.error(`Memory index WARNING (${agentId}): chunks_vec not updated — ${formatMemoryVectorDegradedWriteReason(vectorLoadErr)}. Vector recall degraded.`);
			} catch (err) {
				const message = formatErrorMessage(err);
				defaultRuntime.error(`Memory index failed (${agentId}): ${message}`);
				process.exitCode = 1;
			}
		}
	});
}
async function runMemorySearch(query, opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory search",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		onUnavailable: opts.json ? defaultRuntime.writeJson : void 0,
		purpose: "cli",
		inspectSources: true,
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const memoryPluginConfig = resolveMemoryPluginConfig(cfg);
			const dreamingEnabled = resolveMemoryDreamingConfig({
				pluginConfig: memoryPluginConfig,
				cfg
			}).enabled;
			const dreaming = resolveMemoryDeepDreamingConfig({
				pluginConfig: memoryPluginConfig,
				cfg
			});
			const sessionKey = buildCliMemorySearchSessionKey(agentId);
			let readRebuildWarning = () => void 0;
			let results;
			try {
				readRebuildWarning = captureMemoryRebuildNotice(manager.status());
				results = await manager.search(query, {
					maxResults: opts.maxResults,
					minScore: opts.minScore,
					sessionKey
				});
			} catch (err) {
				const message = formatErrorMessage(err);
				throw new Error([`Memory search failed: ${message}`, readRebuildWarning()].filter(Boolean).join(" "), { cause: err });
			}
			const status = manager.status();
			const staleness = resolveMemorySearchStaleness(status, agentId);
			const warning = [staleness?.warning, readRebuildWarning()].filter((message) => typeof message === "string").join(" ");
			const workspaceDir = status.workspaceDir;
			if (dreamingEnabled) await recordShortTermRecalls({
				workspaceDir,
				query,
				results,
				timezone: dreaming.timezone
			}).catch(() => {});
			if (opts.json) {
				defaultRuntime.writeJson({
					results,
					...staleness,
					...warning ? { warning } : {}
				});
				return;
			}
			if (warning) defaultRuntime.error([warning, staleness?.action].filter(Boolean).join(" "));
			if (results.length === 0) {
				defaultRuntime.log("No matches.");
				return;
			}
			const lines = [];
			for (const result of results) {
				lines.push(`${success$1(result.score.toFixed(3))} ${accent$1(`${shortenHomePath(result.path)}:${result.startLine}-${result.endLine}`)}`);
				lines.push(muted$2(result.snippet));
				lines.push("");
			}
			defaultRuntime.log(lines.join("\n").trim());
		}
	});
}
async function runMemoryForget(opts) {
	try {
		const cfg = getRuntimeConfig({ skipPluginValidation: true });
		const agentId = resolveMemoryAgent(cfg, opts.agent);
		const report = await forgetMemoryEntries({
			cfg,
			agentId,
			sessionIds: opts.session,
			hookSources: opts.hookSource,
			participants: opts.participant,
			since: opts.since,
			dryRun: Boolean(opts.dryRun)
		});
		if (opts.json) {
			defaultRuntime.writeJson(report);
			return;
		}
		const lines = [
			`${heading$2(report.dryRun ? "Memory Deletion Preview" : "Memory Deletion")} ${muted$2(`(${agentId})`)}`,
			`${muted$2("Source sessions:")} ${report.sessionIds.length}`,
			`${muted$2("Source transcripts retained:")} ${report.sessionIds.length}`,
			`${muted$2("Deleted entries:")} ${report.entryKeys.length}`,
			`${muted$2("Mixed-lineage entries deleted whole:")} ${report.mixedLineageEntryKeys.length}`,
			`${muted$2("Entries without targetable provenance:")} ${report.untargetableEntryKeys.length}`,
			`${muted$2("Curated writes retained:")} ${report.curatedWrites.length}`,
			`${muted$2("Memory artifacts:")} ${report.artifacts.memoryFiles} files, ${report.artifacts.memoryEntries} entries, ${report.artifacts.memoryLines} quoted lines`,
			`${muted$2("Session corpus:")} ${report.artifacts.sessionCorpusFiles} files, ${report.artifacts.sessionCorpusLines} lines`,
			`${muted$2("Index artifacts:")} ${report.artifacts.indexChunks} chunks, ${report.artifacts.indexSources} sources, ${report.artifacts.ftsRows} full-text rows, ${report.artifacts.vectorRows} vector rows, ${report.artifacts.embeddingCacheRows} cached embeddings`,
			`${muted$2("Plugin state:")} ${report.artifacts.shortTermEntries} short-term entries, ${report.artifacts.seenHashScopes} seen-hash scopes, ${report.artifacts.backups} backups`,
			`${muted$2("Origin rows:")} ${report.artifacts.originRows}`
		];
		if (report.sessionIds.length > 0) lines.push(`${muted$2("Session IDs:")} ${report.sessionIds.join(", ")}`);
		for (const session of report.sessionResolutions) lines.push(`${muted$2("Session resolution:")} ${session.sessionId} (${session.source})`);
		for (const match of report.participantMatches) lines.push(`${muted$2("Raw participant selector:")} ${match.actorId}: ${match.identities.map((identity) => JSON.stringify(identity)).join(", ") || "no live match"}. Matches select whole sessions across identity namespaces.`);
		if (report.mixedLineageEntryKeys.length > 0) lines.push(`${muted$2("Mixed-lineage entry keys:")} ${report.mixedLineageEntryKeys.join(", ")}`);
		if (report.untargetableEntryKeys.length > 0) lines.push(`${muted$2("Untargetable entry keys:")} ${report.untargetableEntryKeys.join(", ")}`);
		for (const curatedWrite of report.curatedWrites) lines.push(`${muted$2("Curated write retained:")} ${curatedWrite.relativePath} (${new Date(curatedWrite.observedAt).toISOString()})`);
		for (const refusal of report.refusals) lines.push(warn$2(`Refused: ${refusal}`));
		if (report.dryRun) lines.push(muted$2("Dry run: no memory files, index rows, or plugin state were changed."));
		defaultRuntime.log(lines.join("\n"));
	} catch (error) {
		throw new Error(`Memory forget failed: ${formatErrorMessage(error)}`, { cause: error });
	}
}
function matchesPromotionSelector(candidate, selector) {
	const trimmed = selector.trim().toLowerCase();
	if (!trimmed) return false;
	return candidate.key.toLowerCase() === trimmed || candidate.key.toLowerCase().includes(trimmed) || candidate.path.toLowerCase().includes(trimmed) || candidate.snippet.toLowerCase().includes(trimmed);
}
async function runMemoryPromote(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory promote",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		onUnavailable: opts.json ? defaultRuntime.writeJson : void 0,
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = manager.status().workspaceDir?.trim();
			const dreaming = resolveMemoryDeepDreamingConfig({
				pluginConfig: resolveMemoryPluginConfig(cfg),
				cfg
			});
			if (!workspaceDir) throw new Error("Memory promote requires a resolvable workspace directory.");
			let candidates;
			try {
				const gatherAllForApply = Boolean(opts.apply);
				candidates = await rankShortTermPromotionCandidates({
					workspaceDir,
					limit: gatherAllForApply ? void 0 : opts.limit,
					minScore: gatherAllForApply ? 0 : opts.minScore ?? dreaming.minScore,
					minRecallCount: gatherAllForApply ? 0 : opts.minRecallCount ?? dreaming.minRecallCount,
					minUniqueQueries: gatherAllForApply ? 0 : opts.minUniqueQueries ?? dreaming.minUniqueQueries,
					recencyHalfLifeDays: dreaming.recencyHalfLifeDays,
					maxAgeDays: gatherAllForApply ? void 0 : dreaming.maxAgeDays,
					includePromoted: Boolean(opts.includePromoted)
				});
			} catch (err) {
				throw new Error(`Memory promote ranking failed: ${formatErrorMessage(err)}`, { cause: err });
			}
			let applyResult;
			if (opts.apply) try {
				const workspaceAgentIds = resolveMemoryDreamingWorkspace(cfg, workspaceDir)?.agentIds ?? [agentId];
				applyResult = await applyShortTermPromotions({
					agentId,
					workspaceAgentIds,
					workspaceDir,
					candidates,
					limit: opts.limit,
					minScore: opts.minScore ?? dreaming.minScore,
					minRecallCount: opts.minRecallCount ?? dreaming.minRecallCount,
					minUniqueQueries: opts.minUniqueQueries ?? dreaming.minUniqueQueries,
					maxAgeDays: dreaming.maxAgeDays,
					maxPromotedSnippetTokens: dreaming.maxPromotedSnippetTokens,
					maxPriorEntryLossFraction: dreaming.maxPriorEntryLossFraction,
					memoryFileMaxChars: resolveMemoryPromotionFileMaxChars({
						cfg,
						agentIds: workspaceAgentIds
					}),
					timezone: dreaming.timezone
				});
			} catch (err) {
				throw new Error(`Memory promote apply failed: ${formatErrorMessage(err)}`, { cause: err });
			}
			const outputLimit = typeof opts.limit === "number" && Number.isFinite(opts.limit) ? Math.max(0, Math.floor(opts.limit)) : candidates.length;
			const rejectedCandidates = applyResult ? applyResult.rejectedCandidates.slice(0, Math.max(0, outputLimit - applyResult.appliedCandidates.length)) : [];
			const outputCandidateKeys = applyResult ? /* @__PURE__ */ new Set([...applyResult.appliedCandidates.map((candidate) => candidate.key), ...rejectedCandidates.map((rejection) => rejection.candidate.key)]) : void 0;
			const outputCandidates = outputCandidateKeys ? candidates.filter((candidate) => outputCandidateKeys.has(candidate.key)) : candidates;
			const storePath = resolveShortTermRecallStorePath(workspaceDir);
			const lockPath = resolveShortTermRecallLockPath(workspaceDir);
			const audit = await auditShortTermPromotionArtifacts({ workspaceDir });
			if (opts.json) {
				defaultRuntime.writeJson({
					workspaceDir,
					storePath,
					lockPath,
					audit,
					candidates: outputCandidates,
					apply: applyResult ? {
						applied: applyResult.applied,
						appended: applyResult.appended,
						reconciledExisting: applyResult.reconciledExisting,
						memoryPath: applyResult.memoryPath,
						appliedCandidates: applyResult.appliedCandidates,
						rejectedCandidates
					} : void 0
				});
				return;
			}
			if (candidates.length === 0) {
				defaultRuntime.log("No short-term recall candidates.");
				defaultRuntime.log(`Recall store: ${shortenHomePath(storePath)}`);
				if (audit.issues.length > 0) for (const issue of audit.issues) defaultRuntime.log(issue.message);
				return;
			}
			const lines = [];
			lines.push(`${heading$2("Short-Term Promotion Candidates")} ${muted$2(`(${agentId})`)}`);
			lines.push(`${muted$2("Recall store:")} ${shortenHomePath(storePath)}`);
			lines.push(muted$2(`Store health: ${formatAuditCounts(audit)}`));
			for (const candidate of outputCandidates) {
				lines.push(`${success$1(candidate.score.toFixed(3))} ${accent$1(`${shortenHomePath(candidate.path)}:${candidate.startLine}-${candidate.endLine}`)}`);
				lines.push(muted$2(`signals=${candidate.signalCount} recalls=${candidate.recallCount} avg=${candidate.avgScore.toFixed(3)} queries=${candidate.uniqueQueries} age=${candidate.ageDays.toFixed(1)}d consolidate=${candidate.components.consolidation.toFixed(2)} conceptual=${candidate.components.conceptual.toFixed(2)}`));
				if (candidate.conceptTags.length > 0) lines.push(muted$2(`concepts=${candidate.conceptTags.join(", ")}`));
				if (candidate.snippet) lines.push(muted$2(candidate.snippet));
				lines.push("");
			}
			if (audit.issues.length > 0) {
				lines.push(warn$2("Audit issues:"));
				for (const issue of audit.issues) lines.push((issue.severity === "error" ? warn$2 : muted$2)(issue.message));
				lines.push("");
			}
			if (applyResult) {
				for (const rejection of rejectedCandidates) {
					const candidate = rejection.candidate;
					const source = `${shortenHomePath(candidate.path)}:${candidate.startLine}-${candidate.endLine}`;
					lines.push(warn$2(`Skipped ${source}: ${rejection.reason}.`));
				}
				if (applyResult.applied > 0) {
					lines.push(success$1(`Processed ${applyResult.applied} candidate(s) for ${shortenHomePath(applyResult.memoryPath)}.`));
					lines.push(muted$2(`appended=${applyResult.appended} reconciledExisting=${applyResult.reconciledExisting}`));
				} else if (rejectedCandidates.length === 0) lines.push(warn$2("No candidates met apply criteria."));
			}
			defaultRuntime.log(lines.join("\n").trim());
		}
	});
}
async function runMemoryPromoteExplain(selector, opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory promote-explain",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		onUnavailable: opts.json ? defaultRuntime.writeJson : void 0,
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = manager.status().workspaceDir?.trim();
			const dreaming = resolveMemoryDeepDreamingConfig({
				pluginConfig: resolveMemoryPluginConfig(cfg),
				cfg
			});
			if (!workspaceDir) throw new Error("Memory promote-explain requires a resolvable workspace directory.");
			let candidates;
			try {
				candidates = await rankShortTermPromotionCandidates({
					workspaceDir,
					minScore: 0,
					minRecallCount: 0,
					minUniqueQueries: 0,
					includePromoted: Boolean(opts.includePromoted),
					recencyHalfLifeDays: dreaming.recencyHalfLifeDays,
					maxAgeDays: dreaming.maxAgeDays
				});
			} catch (err) {
				throw new Error(`Memory promote-explain failed: ${formatErrorMessage(err)}`, { cause: err });
			}
			const candidate = candidates.find((entry) => matchesPromotionSelector(entry, selector));
			if (!candidate) throw new Error(`No promotion candidate matched "${selector}".`);
			const thresholds = {
				minScore: dreaming.minScore,
				minRecallCount: dreaming.minRecallCount,
				minUniqueQueries: dreaming.minUniqueQueries,
				maxAgeDays: dreaming.maxAgeDays ?? null
			};
			if (opts.json) {
				defaultRuntime.writeJson({
					workspaceDir,
					thresholds,
					candidate,
					passes: {
						score: candidate.score >= thresholds.minScore,
						recallCount: candidate.signalCount >= thresholds.minRecallCount,
						uniqueQueries: candidate.uniqueQueries >= thresholds.minUniqueQueries,
						maxAge: thresholds.maxAgeDays === null ? true : candidate.ageDays <= thresholds.maxAgeDays
					}
				});
				return;
			}
			const lines = [
				`${heading$2("Promotion Explain")} ${muted$2("(" + agentId + ")")}`,
				accent$1(candidate.key),
				muted$2(`${shortenHomePath(candidate.path)}:${String(candidate.startLine)}-${String(candidate.endLine)}`),
				candidate.snippet,
				muted$2(`score=${candidate.score.toFixed(3)} signals=${candidate.signalCount} recalls=${candidate.recallCount} uniqueQueries=${candidate.uniqueQueries} ageDays=${candidate.ageDays.toFixed(1)}`),
				muted$2(`components: frequency=${candidate.components.frequency.toFixed(2)} relevance=${candidate.components.relevance.toFixed(2)} diversity=${candidate.components.diversity.toFixed(2)} recency=${candidate.components.recency.toFixed(2)} consolidation=${candidate.components.consolidation.toFixed(2)} conceptual=${candidate.components.conceptual.toFixed(2)}`),
				muted$2(`thresholds: minScore=${thresholds.minScore} minRecallCount=${thresholds.minRecallCount} minUniqueQueries=${thresholds.minUniqueQueries} maxAgeDays=${thresholds.maxAgeDays ?? "none"}`)
			];
			if (candidate.conceptTags.length > 0) lines.push(muted$2(`concepts=${candidate.conceptTags.join(", ")}`));
			defaultRuntime.log(lines.join("\n"));
		}
	});
}
//#endregion
//#region extensions/memory-core/src/cli-rem.runtime.ts
const { heading: heading$1, muted: muted$1, warn: warn$1 } = theme;
async function runMemorySessionBackfill(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory session-backfill",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		onUnavailable: opts.json ? defaultRuntime.writeJson : void 0,
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = manager.status().workspaceDir?.trim();
			if (!workspaceDir) throw new Error("Memory session-backfill requires a resolvable workspace directory.");
			if (opts.rollback && (opts.apply || opts.rem || opts.from || opts.to || opts.archiveFiles?.length)) throw new Error("Memory session-backfill --rollback cannot be combined with input, range, --rem, or --apply options.");
			const pluginConfig = resolveMemoryPluginConfig(cfg);
			const remConfig = resolveMemoryRemDreamingConfig({
				pluginConfig,
				cfg
			});
			let result;
			try {
				result = await runSessionBackfill({
					agentId,
					workspaceDir,
					pluginConfig,
					...opts.from !== void 0 ? { from: opts.from } : {},
					...opts.to !== void 0 ? { to: opts.to } : {},
					...opts.limitDays !== void 0 ? { limitDays: opts.limitDays } : {},
					...opts.rem !== void 0 ? { rem: opts.rem } : {},
					...opts.apply !== void 0 ? { apply: opts.apply } : {},
					...opts.rollback !== void 0 ? { rollback: opts.rollback } : {},
					...opts.archiveFiles !== void 0 ? { archiveFiles: opts.archiveFiles } : {},
					...remConfig.timezone !== void 0 ? { timezone: remConfig.timezone } : {}
				});
			} catch (error) {
				throw new Error(error instanceof Error ? error.message : String(error), { cause: error });
			}
			if (opts.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			if (result.rollback) {
				defaultRuntime.log([
					`${heading$1("Session Backfill")} ${muted$1("(rollback)")}`,
					muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
					muted$1(`removedDiaryEntries=${result.rollback.removedDiaryEntries}`),
					muted$1(`removedStagedEntries=${result.rollback.removedStagedEntries}`)
				].join("\n"));
				return;
			}
			const lines = [
				`${heading$1("Session Backfill")} ${muted$1(`(${agentId})`)}`,
				muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
				muted$1(`batches=${result.batchCount ?? 1} days=${result.days.length} candidates=${result.candidateCount} staged=${result.stagedEntries}`)
			];
			for (const batch of result.batches ?? []) lines.push(muted$1(`batch=${batch.batch} days=${batch.days} candidates=${batch.candidates} staged=${batch.stagedEntries}`));
			for (const day of result.days) {
				lines.push("", heading$1(day.day), muted$1(`candidates=${day.candidateCount}`));
				lines.push(...day.topCandidates.map((candidate) => `- ${candidate}`));
			}
			if (result.days.length === 0) lines.push("", "No new hash-untracked trusted session candidates.");
			if (!result.applied && !result.rem) lines.push("", muted$1("Dry run; use --apply to stage candidates."));
			defaultRuntime.log(lines.join("\n"));
		}
	});
}
async function runMemoryRemHarness(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory rem-harness",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		onUnavailable: opts.json ? defaultRuntime.writeJson : void 0,
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const managerWorkspaceDir = manager.status().workspaceDir?.trim();
			const pluginConfig = resolveMemoryPluginConfig(cfg);
			const remConfig = resolveMemoryRemDreamingConfig({
				pluginConfig,
				cfg
			});
			const nowMs = Date.now();
			const previewWorkspace = async (workspaceDir, historical) => {
				if (!workspaceDir) throw new Error("Memory rem-harness requires a resolvable workspace directory.");
				const seeded = historical ? await seedHistoricalDailyMemorySignals({
					workspaceDir,
					filePaths: historical.workspaceSourceFiles,
					limit: remConfig.limit,
					nowMs,
					timezone: remConfig.timezone
				}) : void 0;
				const preview = await previewRemHarness({
					workspaceDir,
					cfg,
					pluginConfig,
					grounded: Boolean(opts.grounded),
					groundedInputPaths: historical?.workspaceSourceFiles ?? [],
					includePromoted: Boolean(opts.includePromoted),
					nowMs
				});
				return {
					workspaceDir,
					sourceFiles: historical?.sourceFiles ?? [],
					seeded,
					preview
				};
			};
			const { workspaceDir, sourceFiles, seeded, preview } = opts.path ? await withHistoricalMemoryWorkspace("rem-harness", opts.path, (historical) => previewWorkspace(historical.workspaceDir, historical)) : await previewWorkspace(managerWorkspaceDir ?? "");
			const importedFileCount = seeded?.importedFileCount ?? 0;
			const importedSignalCount = seeded?.importedSignalCount ?? 0;
			const skippedPaths = seeded?.skippedPaths ?? [];
			const groundedInputPaths = preview.groundedInputPaths;
			const remPreview = preview.rem;
			const groundedPreview = preview.grounded;
			const deepCandidates = preview.deep.candidates;
			if (opts.json) {
				defaultRuntime.writeJson({
					workspaceDir,
					sourcePath: opts.path ? path.resolve(opts.path) : null,
					sourceFiles,
					historicalImport: opts.path ? {
						importedFileCount,
						importedSignalCount,
						skippedPaths
					} : null,
					remConfig: preview.remConfig,
					deepConfig: {
						minScore: preview.deepConfig.minScore,
						minRecallCount: preview.deepConfig.minRecallCount,
						minUniqueQueries: preview.deepConfig.minUniqueQueries,
						recencyHalfLifeDays: preview.deepConfig.recencyHalfLifeDays,
						maxAgeDays: preview.deepConfig.maxAgeDays ?? null,
						maxPromotedSnippetTokens: preview.deepConfig.maxPromotedSnippetTokens
					},
					rem: {
						skipped: preview.remSkipped,
						...remPreview
					},
					grounded: groundedPreview,
					deep: {
						candidateCount: preview.deep.candidateCount,
						candidates: deepCandidates
					}
				});
				return;
			}
			const lines = [
				`${heading$1("REM Harness")} ${muted$1(`(${agentId})`)}`,
				muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
				...opts.path ? [
					muted$1(`sourcePath=${shortenHomePath(path.resolve(opts.path))}`),
					muted$1(`historicalFiles=${sourceFiles.length} importedFiles=${importedFileCount} importedSignals=${importedSignalCount}`),
					...skippedPaths.length > 0 ? [warn$1(`skipped=${skippedPaths.map((entry) => shortenHomePath(entry)).join(", ")}`)] : []
				] : [],
				...opts.grounded ? [muted$1(`groundedInputs=${groundedInputPaths.length > 0 ? groundedInputPaths.map((entry) => shortenHomePath(entry)).join(", ") : "none"}`)] : [],
				muted$1(`recentRecallEntries=${preview.recallEntryCount} deepCandidates=${deepCandidates.length}`),
				"",
				heading$1("REM Preview"),
				...remPreview.bodyLines,
				...groundedPreview ? [
					"",
					heading$1("Grounded REM"),
					...groundedPreview.files.flatMap((file) => [
						muted$1(file.path),
						file.renderedMarkdown,
						""
					])
				] : [],
				"",
				heading$1("Deep Candidates"),
				...deepCandidates.length > 0 ? deepCandidates.slice(0, 10).map((candidate) => `${candidate.score.toFixed(3)} ${candidate.snippet} [${shortenHomePath(candidate.path)}:${candidate.startLine}-${candidate.endLine}]`) : ["- No deep candidates."]
			];
			defaultRuntime.log(lines.join("\n"));
		}
	});
}
async function runMemoryRemBackfill(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory rem-backfill",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		onUnavailable: opts.json ? defaultRuntime.writeJson : void 0,
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = manager.status().workspaceDir?.trim();
			const pluginConfig = resolveMemoryPluginConfig(cfg);
			const remConfig = resolveMemoryRemDreamingConfig({
				pluginConfig,
				cfg
			});
			if (!workspaceDir) throw new Error("Memory rem-backfill requires a resolvable workspace directory.");
			if (opts.rollback || opts.rollbackShortTerm) {
				const diaryRollback = opts.rollback ? await removeBackfillDiaryEntries({ workspaceDir }) : null;
				const shortTermRollback = opts.rollbackShortTerm ? await removeGroundedShortTermCandidates({ workspaceDir }) : null;
				if (opts.json) {
					defaultRuntime.writeJson({
						workspaceDir,
						rollback: Boolean(opts.rollback),
						rollbackShortTerm: Boolean(opts.rollbackShortTerm),
						...diaryRollback ? {
							dreamsPath: diaryRollback.dreamsPath,
							removedEntries: diaryRollback.removed
						} : {},
						...shortTermRollback ? {
							shortTermStorePath: shortTermRollback.storePath,
							removedShortTermEntries: shortTermRollback.removed
						} : {}
					});
					return;
				}
				defaultRuntime.log([
					`${heading$1("REM Backfill")} ${muted$1("(rollback)")}`,
					muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
					...diaryRollback ? [muted$1(`dreamsPath=${shortenHomePath(diaryRollback.dreamsPath)}`), muted$1(`removedEntries=${diaryRollback.removed}`)] : [],
					...shortTermRollback ? [muted$1(`shortTermStorePath=${shortenHomePath(shortTermRollback.storePath)}`), muted$1(`removedShortTermEntries=${shortTermRollback.removed}`)] : []
				].join("\n"));
				return;
			}
			if (!opts.path) throw new Error("Memory rem-backfill requires --path <file-or-dir> unless using --rollback.");
			const { sourceFiles, groundedFiles, written, stagedShortTermEntries, replacedShortTermEntries } = await withHistoricalMemoryWorkspace("rem-backfill", opts.path, async ({ workspaceDir: scratchDir, sourceFiles, workspaceSourceFiles }) => {
				const grounded = await previewGroundedRemMarkdown({
					workspaceDir: scratchDir,
					inputPaths: workspaceSourceFiles
				});
				const sourcePathByScratchRelativePath = new Map(workspaceSourceFiles.map((scratchPath, index) => [normalizeRelativePath(scratchDir, scratchPath), sourceFiles[index] ?? scratchPath]));
				const entries = grounded.files.map((file) => {
					const isoDay = extractIsoDayFromPath(file.path);
					if (!isoDay) return null;
					return {
						isoDay,
						sourcePath: sourcePathByScratchRelativePath.get(file.path) ?? file.path,
						bodyLines: groundedMarkdownToDiaryLines(file.renderedMarkdown)
					};
				}).filter((entry) => entry !== null);
				const written = await writeBackfillDiaryEntries({
					workspaceDir,
					entries,
					timezone: remConfig.timezone
				});
				let stagedShortTermEntries = 0;
				let replacedShortTermEntries = 0;
				if (opts.stageShortTerm) {
					replacedShortTermEntries = (await removeGroundedShortTermCandidates({ workspaceDir })).removed;
					const shortTermSeedItems = collectGroundedShortTermSeedItems(grounded.files);
					if (shortTermSeedItems.length > 0) await recordGroundedShortTermCandidates({
						workspaceDir,
						query: "__dreaming_grounded_backfill__",
						items: shortTermSeedItems,
						dedupeByQueryPerDay: true,
						nowMs: Date.now(),
						timezone: remConfig.timezone
					});
					stagedShortTermEntries = shortTermSeedItems.length;
				}
				return {
					sourceFiles,
					groundedFiles: grounded.scannedFiles,
					written,
					stagedShortTermEntries,
					replacedShortTermEntries
				};
			});
			if (opts.json) {
				defaultRuntime.writeJson({
					workspaceDir,
					sourcePath: path.resolve(opts.path),
					sourceFiles,
					groundedFiles,
					writtenEntries: written.written,
					replacedEntries: written.replaced,
					dreamsPath: written.dreamsPath,
					...opts.stageShortTerm ? {
						stagedShortTermEntries,
						replacedShortTermEntries
					} : {}
				});
				return;
			}
			defaultRuntime.log([
				`${heading$1("REM Backfill")} ${muted$1(`(${agentId})`)}`,
				muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
				muted$1(`sourcePath=${shortenHomePath(path.resolve(opts.path))}`),
				muted$1(`historicalFiles=${sourceFiles.length} writtenEntries=${written.written} replacedEntries=${written.replaced}`),
				...opts.stageShortTerm ? [muted$1(`stagedShortTermEntries=${stagedShortTermEntries} replacedShortTermEntries=${replacedShortTermEntries}`)] : [],
				muted$1(`dreamsPath=${shortenHomePath(written.dreamsPath)}`)
			].join("\n"));
		}
	});
}
const DAILY_MEMORY_FILE_NAME_RE = /^(\d{4}-\d{2}-\d{2})(?:-[^/]+)?\.md$/i;
async function listHistoricalDailyFiles(inputPath) {
	const resolvedPath = path.resolve(inputPath);
	let stat;
	try {
		stat = await fs$1.stat(resolvedPath);
	} catch (err) {
		if (err?.code === "ENOENT") return [];
		throw err;
	}
	if (stat.isFile()) return DAILY_MEMORY_FILE_NAME_RE.test(path.basename(resolvedPath)) ? [resolvedPath] : [];
	if (!stat.isDirectory()) return [];
	return (await fs$1.readdir(resolvedPath, { withFileTypes: true })).filter((entry) => entry.isFile() && DAILY_MEMORY_FILE_NAME_RE.test(entry.name)).map((entry) => path.join(resolvedPath, entry.name)).toSorted((a, b) => path.basename(a).localeCompare(path.basename(b)));
}
async function withHistoricalMemoryWorkspace(command, inputPath, run) {
	const sourceFiles = await listHistoricalDailyFiles(inputPath);
	if (sourceFiles.length === 0) throw new Error(`Memory ${command} found no YYYY-MM-DD.md files at ${shortenHomePath(path.resolve(inputPath))}.`);
	const workspaceDir = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), `openclaw-${command}-`));
	try {
		const memoryDir = path.join(workspaceDir, "memory");
		await fs$1.mkdir(memoryDir, { recursive: true });
		const workspaceSourceFiles = [];
		for (const filePath of sourceFiles) {
			const destination = path.join(memoryDir, path.basename(filePath));
			await fs$1.copyFile(filePath, destination);
			workspaceSourceFiles.push(destination);
		}
		return await run({
			workspaceDir,
			sourceFiles,
			workspaceSourceFiles
		});
	} finally {
		await fs$1.rm(workspaceDir, {
			recursive: true,
			force: true
		});
	}
}
function extractIsoDayFromPath(filePath) {
	return path.basename(filePath).match(DAILY_MEMORY_FILE_NAME_RE)?.[1] ?? null;
}
function normalizeRelativePath(baseDir, filePath) {
	return path.relative(baseDir, filePath).replace(/\\/g, "/");
}
function groundedMarkdownToDiaryLines(markdown) {
	return markdown.split(/\r?\n/).map((line) => line.replace(/^##\s+/, "").trimEnd()).filter((line, index, lines) => !(line.length === 0 && lines[index - 1]?.length === 0));
}
function parseGroundedRef(fallbackPath, ref) {
	const trimmed = ref.trim();
	if (!trimmed) return null;
	const match = trimmed.match(/^(.*?):(\d+)(?:-(\d+))?$/);
	if (!match) return null;
	return {
		path: (match[1] ?? fallbackPath).replaceAll("\\", "/").replace(/^\.\//, ""),
		startLine: Math.max(1, Number(match[2])),
		endLine: Math.max(1, Number(match[3] ?? match[2]))
	};
}
function collectGroundedShortTermSeedItems(previews) {
	const items = [];
	const seen = /* @__PURE__ */ new Set();
	for (const file of previews) {
		const dayBucket = extractIsoDayFromPath(file.path) ?? void 0;
		const signals = [...file.memoryImplications.map((item) => ({
			text: item.text,
			refs: item.refs,
			score: .92,
			query: "__dreaming_grounded_backfill__:lasting-update",
			signalCount: 2
		})), ...file.candidates.filter((candidate) => candidate.lean === "likely_durable").map((candidate) => ({
			text: candidate.text,
			refs: candidate.refs,
			score: .82,
			query: "__dreaming_grounded_backfill__:candidate",
			signalCount: 1
		}))];
		for (const signal of signals) {
			if (!signal.text.trim()) continue;
			const firstRef = signal.refs.find((ref) => ref.trim().length > 0);
			const parsedRef = firstRef ? parseGroundedRef(file.path, firstRef) : null;
			if (!parsedRef) continue;
			const key = `${parsedRef.path}:${parsedRef.startLine}:${parsedRef.endLine}:${signal.query}:${signal.text.toLowerCase()}`;
			if (seen.has(key)) continue;
			seen.add(key);
			items.push({
				path: parsedRef.path,
				startLine: parsedRef.startLine,
				endLine: parsedRef.endLine,
				snippet: signal.text,
				score: signal.score,
				query: signal.query,
				signalCount: signal.signalCount,
				...dayBucket ? { dayBucket } : {}
			});
		}
	}
	return items;
}
//#endregion
//#region extensions/memory-core/src/cli-status.runtime.ts
const { accent, heading, info, muted, success, warn } = theme;
function readLlamaCppRuntimeStatus(status) {
	const runtime = asNullableRecord(asNullableRecord(status.custom)?.llamaCppRuntime);
	return runtime?.engine === "llama.cpp" ? runtime : null;
}
function formatMemoryIndexIdentityWarning(status, agentId) {
	const diagnostic = resolveMemoryIndexIdentityDiagnostic(status);
	if (!diagnostic) return null;
	return {
		reason: `${diagnostic.reason} (owner: ${diagnostic.owner}, code: ${diagnostic.code})`,
		fix: `Run: ${formatMemoryIndexRebuildGuidance(status, agentId)}`,
		paused: diagnostic.owner === "configuration" ? "paused until memory is rebuilt" : "paused"
	};
}
function formatDreamingSummary(cfg) {
	const pluginConfig = resolveMemoryPluginConfig(cfg);
	const light = resolveMemoryLightDreamingConfig({
		pluginConfig,
		cfg
	});
	const deep = resolveMemoryDeepDreamingConfig({
		pluginConfig,
		cfg
	});
	const rem = resolveMemoryRemDreamingConfig({
		pluginConfig,
		cfg
	});
	const timezone = deep.timezone ?? light.timezone ?? rem.timezone;
	const formatCron = (cron) => timezone ? `${cron} (${timezone})` : cron;
	const lightSummary = light.enabled ? `light=${formatCron(light.cron)} · limit=${light.limit} · lookbackDays=${light.lookbackDays}` : null;
	const remSummary = rem.enabled ? `rem=${formatCron(rem.cron)} · limit=${rem.limit} · lookbackDays=${rem.lookbackDays} · minPatternStrength=${rem.minPatternStrength}` : null;
	const deepLabel = light.enabled || rem.enabled ? "deep=" : "";
	const deepDetails = `${formatCron(deep.cron)} · limit=${deep.limit} · minScore=${deep.minScore} · minRecallCount=${deep.minRecallCount} · minUniqueQueries=${deep.minUniqueQueries} · recencyHalfLifeDays=${deep.recencyHalfLifeDays} · maxAgeDays=${deep.maxAgeDays ?? "none"} · maxPromotedSnippetTokens=${deep.maxPromotedSnippetTokens}`;
	const phases = [
		lightSummary,
		remSummary,
		deep.enabled ? `${deepLabel}${deepDetails}` : null
	].filter(Boolean);
	return phases.length > 0 ? phases.join(" · ") : "off";
}
function formatRepairSummary(repair) {
	const actions = [];
	if (repair.rewroteStore) {
		const details = formatRecallRepairDetails(repair);
		actions.push(`rewrote store${details ? ` (${details})` : ""}`);
	}
	if (repair.removedStaleLock) actions.push("removed stale lock");
	return actions.length > 0 ? actions.join(" · ") : "no changes";
}
function formatDreamingAuditSummary(audit) {
	return [
		audit.dreamsPath ? "diary present" : "diary absent",
		`${audit.sessionCorpusFileCount} corpus files`,
		audit.sessionIngestionExists ? "ingestion state present" : "ingestion state absent",
		audit.suspiciousSessionCorpusLineCount > 0 ? `${audit.suspiciousSessionCorpusLineCount} suspicious lines` : null
	].filter(Boolean).join(" · ");
}
function formatDreamingRepairSummary(repair) {
	const actions = [];
	if (repair.archivedSessionCorpus) actions.push("archived session corpus");
	if (repair.archivedSessionIngestion) actions.push("archived ingestion state");
	if (repair.archivedDreamsDiary) actions.push("archived diary");
	if (repair.warnings.length > 0) actions.push(`${repair.warnings.length} warning${repair.warnings.length === 1 ? "" : "s"}`);
	return actions.length > 0 ? actions.join(" · ") : "no changes";
}
async function runMemoryStatus(opts, hostOptions) {
	setVerbose(Boolean(opts.verbose));
	const deep = Boolean(opts.deep || opts.index);
	const allResults = [];
	const cfg = await withMemoryCommand({
		commandName: "memory status",
		agent: opts.agent,
		allAgents: true,
		diagnosticsToStderr: Boolean(opts.json),
		purpose: opts.index || opts.fix ? "cli" : "status",
		inspectSources: true,
		...hostOptions,
		run: async ({ manager, agentId }) => {
			let embeddingProbe;
			let indexError;
			const syncFn = manager.sync ? manager.sync.bind(manager) : void 0;
			if (deep) {
				const hasVectorStoreProbe = manager.status().backend === "builtin" && typeof manager.probeVectorStoreAvailability === "function";
				await withProgress({
					label: "Checking memory…",
					total: hasVectorStoreProbe ? 3 : 2
				}, async (progress) => {
					progress.setLabel(hasVectorStoreProbe ? "Probing vector store…" : "Probing vectors…");
					if (hasVectorStoreProbe) await manager.probeVectorStoreAvailability?.();
					else await manager.probeVectorAvailability();
					progress.tick();
					progress.setLabel("Probing embeddings…");
					embeddingProbe = await manager.probeEmbeddingAvailability();
					progress.tick();
					if (hasVectorStoreProbe) {
						progress.setLabel("Checking semantic vectors…");
						await manager.probeVectorAvailability();
						progress.tick();
					}
				});
				if (opts.index && syncFn) await withProgressTotals({
					label: "Indexing memory…",
					total: 0,
					fallback: opts.verbose ? "line" : void 0
				}, async (update, progress) => {
					try {
						await syncFn({
							reason: "cli",
							force: Boolean(opts.force),
							progress: (syncUpdate) => {
								update({
									completed: syncUpdate.completed,
									total: syncUpdate.total,
									label: syncUpdate.label
								});
								if (syncUpdate.label) progress.setLabel(syncUpdate.label);
							}
						});
					} catch (err) {
						indexError = formatErrorMessage(err);
						defaultRuntime.error(`Memory index failed: ${indexError}`);
						process.exitCode = 1;
					}
				});
				else if (opts.index && !syncFn) defaultRuntime.log("Memory backend does not support manual reindex.");
			}
			const status = manager.status();
			const scan = await scanMemoryManagerSources(status);
			const workspaceDir = status.workspaceDir;
			let audit;
			let repair;
			let dreamingAudit;
			let dreamingRepair;
			if (workspaceDir) {
				dreamingAudit = await auditDreamingArtifacts({ workspaceDir });
				if (opts.fix && dreamingAudit.issues.some((issue) => issue.fixable)) {
					dreamingRepair = await repairDreamingArtifacts({ workspaceDir });
					dreamingAudit = await auditDreamingArtifacts({ workspaceDir });
				}
				if (opts.fix) repair = await repairShortTermPromotionArtifacts({ workspaceDir });
				audit = await auditShortTermPromotionArtifacts({ workspaceDir });
			}
			allResults.push({
				agentId,
				status,
				embeddingProbe,
				indexError,
				scan,
				audit,
				repair,
				dreamingAudit,
				dreamingRepair
			});
		}
	});
	if (opts.json) {
		defaultRuntime.writeJson(allResults);
		return;
	}
	const label = (text) => muted(`${text}:`);
	for (const result of allResults) {
		const { agentId, status, embeddingProbe, indexError, scan, audit, repair, dreamingAudit, dreamingRepair } = result;
		const filesIndexed = status.files ?? 0;
		const chunksIndexed = status.chunks ?? 0;
		const totalFiles = scan?.totalFiles ?? null;
		const indexedLabel = totalFiles === null ? `${filesIndexed}/? files · ${chunksIndexed} chunks` : `${filesIndexed}/${totalFiles} files · ${chunksIndexed} chunks`;
		if (opts.index) {
			const line = indexError ? `Memory index failed: ${indexError}` : formatMemoryIndexOutcome(status, scan, agentId);
			defaultRuntime.log(line);
		}
		const requestedProvider = status.requestedProvider ?? status.provider;
		const modelLabel = status.model ?? status.provider;
		const storePath = status.dbPath ? shortenHomePath(status.dbPath) : "<unknown>";
		const workspacePath = status.workspaceDir ? shortenHomePath(status.workspaceDir) : "<unknown>";
		const sourceList = status.sources?.length ? status.sources.join(", ") : null;
		const extraPaths = status.workspaceDir ? formatExtraPaths(status.workspaceDir, status.extraPaths ?? []) : [];
		const lines = [
			`${heading("Memory Search")} ${muted(`(${agentId})`)}`,
			`${label("Provider")} ${info(status.provider)} ${muted(`(requested: ${requestedProvider})`)}`,
			`${label("Model")} ${info(modelLabel)}`,
			sourceList ? `${label("Sources")} ${info(sourceList)}` : null,
			extraPaths.length ? `${label("Extra paths")} ${info(extraPaths.join(", "))}` : null,
			`${label("Indexed")} ${success(indexedLabel)}`,
			`${label("Dirty")} ${status.dirty ? warn("yes") : muted("no")}`,
			`${label("Store")} ${info(storePath)}`,
			`${label("Workspace")} ${info(workspacePath)}`,
			`${label("Dreaming")} ${info(formatDreamingSummary(cfg))}`
		].filter(Boolean);
		if (status.storage) {
			const storage = status.storage;
			const bytes = (value) => formatByteSize(value, {
				style: "iec",
				maxUnit: "tera",
				separator: " ",
				fractionDigits: 1
			});
			lines.push(`${label("Agent database")} ${info(bytes(storage.databaseBytes))} · WAL ${bytes(storage.walBytes)} · reusable ${bytes(storage.reusableBytes)}`);
			lines.push(`${label("Stored embedding cache")} ${info(bytes(storage.embeddingCacheBytes))} · ${storage.embeddingCacheEntries} entries`);
			lines.push(muted("Database includes sessions and other agent data. Reusable pages remain allocated until compaction."));
		}
		if (embeddingProbe) {
			const state = embeddingProbe.ok && embeddingProbe.checked === false ? "skipped" : embeddingProbe.ok ? "ready" : "unavailable";
			const stateColor = state === "skipped" ? muted : embeddingProbe.ok ? success : warn;
			lines.push(`${label("Embeddings")} ${stateColor(state)}`);
			if (embeddingProbe.error) lines.push(`${label("Embeddings error")} ${warn(embeddingProbe.error)}`);
		}
		const llamaCppRuntime = deep ? readLlamaCppRuntimeStatus(status) : null;
		if (llamaCppRuntime) {
			const runtime = llamaCppRuntime;
			const backend = runtime.backend ?? "unknown";
			const build = runtime.buildInfo ? ` (${runtime.buildInfo})` : "";
			lines.push(`${label("llama.cpp server")} ${info(backend)}${muted(build)}`);
			if (runtime.model?.id) lines.push(`${label("Server model")} ${info(runtime.model.id)}`);
			if (runtime.model?.path) lines.push(`${label("Model path")} ${info(shortenHomePath(runtime.model.path))}`);
			if (runtime.capabilities) {
				const capabilities = [runtime.capabilities.vision ? "vision" : null, runtime.capabilities.draft ? "draft" : null].filter(Boolean);
				lines.push(`${label("Capabilities")} ${info(capabilities.length ? capabilities.join(", ") : "text only")}`);
			}
			if (runtime.endpoints) lines.push(`${label("Endpoints")} ${info(Object.entries(runtime.endpoints).map(([name, state]) => `${name}=${state}`).join(" "))}`);
			if (runtime.loadError) lines.push(`${label("llama.cpp error")} ${warn(runtime.loadError)}`);
		}
		const identityWarning = formatMemoryIndexIdentityWarning(status, agentId);
		if (identityWarning) {
			lines.push(`${label("Index identity")} ${warn(identityWarning.reason)}`);
			lines.push(`${label("Vector search")} ${warn(identityWarning.paused)}`);
			lines.push(`${label("Fix")} ${muted(identityWarning.fix)}`);
		}
		if (status.sourceCounts?.length) {
			lines.push(label("By source"));
			for (const entry of status.sourceCounts) {
				const total = scan?.sources?.find((scanEntry) => scanEntry.source === entry.source)?.totalFiles;
				const counts = total === null ? `${entry.files}/? files · ${entry.chunks} chunks` : `${entry.files}/${total} files · ${entry.chunks} chunks`;
				const payload = entry.chunkBytes === void 0 ? "" : ` · ${formatByteSize(entry.chunkBytes, {
					style: "iec",
					maxUnit: "tera",
					separator: " ",
					fractionDigits: 1
				})} text + embeddings`;
				lines.push(`  ${accent(entry.source)} ${muted("·")} ${muted(counts + payload)}`);
			}
		}
		if (status.fallback) lines.push(`${label("Fallback")} ${warn(status.fallback.from)}`);
		if (status.vector) {
			const formatVectorState = (available) => status.vector?.enabled ? available === void 0 ? "unknown" : available ? "ready" : "unavailable" : "disabled";
			const formatVectorLine = (lineLabel, state) => {
				const vectorColor = state === "ready" ? success : state === "unavailable" ? warn : muted;
				lines.push(`${label(lineLabel)} ${vectorColor(state)}`);
			};
			if (status.backend === "builtin") {
				formatVectorLine("Vector store", status.vector.storeAvailable === void 0 && status.vector.enabled ? status.vector.index?.state === "complete" ? "indexed (unprobed)" : status.vector.index?.state === "incomplete" ? "index incomplete (unprobed)" : status.vector.index?.state === "unverified" ? "index unverified (unprobed)" : formatVectorState(void 0) : formatVectorState(status.vector.storeAvailable));
				if (status.vector.semanticAvailable !== void 0) formatVectorLine("Semantic vectors", formatVectorState(status.vector.semanticAvailable));
			} else formatVectorLine("Vector", formatVectorState(status.vector.semanticAvailable ?? status.vector.available));
			if (status.vector.dims) lines.push(`${label("Vector dims")} ${info(String(status.vector.dims))}`);
			if (status.vector.extensionPath) lines.push(`${label("Vector path")} ${info(shortenHomePath(status.vector.extensionPath))}`);
			if (status.vector.loadError) lines.push(`${label("Vector error")} ${warn(status.vector.loadError)}`);
		}
		if (status.fts) {
			const ftsState = status.fts.enabled ? status.fts.available ? "ready" : "unavailable" : "disabled";
			const ftsColor = ftsState === "ready" ? success : ftsState === "unavailable" ? warn : muted;
			lines.push(`${label("FTS")} ${ftsColor(ftsState)}`);
			if (status.fts.error) lines.push(`${label("FTS error")} ${warn(status.fts.error)}`);
		}
		if (status.cache) {
			const cacheState = status.cache.enabled ? "enabled" : "disabled";
			const cacheColor = status.cache.enabled ? success : muted;
			const suffix = status.cache.enabled && typeof status.cache.entries === "number" ? ` (${status.cache.entries} entries)` : "";
			lines.push(`${label("Embedding cache")} ${cacheColor(cacheState)}${suffix}`);
			if (status.cache.enabled && typeof status.cache.maxEntries === "number") lines.push(`${label("Cache cap")} ${info(String(status.cache.maxEntries))}`);
		}
		if (status.batch) {
			const batchState = status.batch.enabled ? "enabled" : "disabled";
			const batchColor = status.batch.enabled ? success : warn;
			const batchSuffix = ` (failures ${status.batch.failures}/${status.batch.limit})`;
			lines.push(`${label("Batch")} ${batchColor(batchState)}${muted(batchSuffix)}`);
			if (status.batch.lastError) lines.push(`${label("Batch error")} ${warn(status.batch.lastError)}`);
		}
		if (audit) {
			lines.push(`${label("Recall store")} ${info(formatAuditCounts(audit))}`);
			lines.push(`${label("Recall path")} ${info(shortenHomePath(audit.storePath))}`);
			if (audit.updatedAt) lines.push(`${label("Recall updated")} ${info(audit.updatedAt)}`);
		}
		if (dreamingAudit) {
			lines.push(`${label("Dreaming artifacts")} ${info(formatDreamingAuditSummary(dreamingAudit))}`);
			lines.push(`${label("Dream corpus")} ${info(shortenHomePath(dreamingAudit.sessionCorpusDir))}`);
			lines.push(`${label("Dream ingestion")} ${info(shortenHomePath(dreamingAudit.sessionIngestionPath))}`);
			if (dreamingAudit.dreamsPath) lines.push(`${label("Dream diary")} ${info(shortenHomePath(dreamingAudit.dreamsPath))}`);
		}
		if (repair) lines.push(`${label("Repair")} ${info(formatRepairSummary(repair))}`);
		if (dreamingRepair) {
			lines.push(`${label("Dream repair")} ${info(formatDreamingRepairSummary(dreamingRepair))}`);
			if (dreamingRepair.archiveDir) lines.push(`${label("Dream archive")} ${info(shortenHomePath(dreamingRepair.archiveDir))}`);
		}
		if (status.fallback?.reason) lines.push(muted(status.fallback.reason));
		if (indexError) lines.push(`${label("Index error")} ${warn(indexError)}`);
		if (scan?.issues.length) {
			lines.push(label("Issues"));
			for (const issue of scan.issues) lines.push(`  ${warn(issue)}`);
		}
		if (audit?.issues.length) {
			if (!scan?.issues.length) lines.push(label("Issues"));
			for (const issue of audit.issues) lines.push(`  ${issue.severity === "error" ? warn(issue.message) : muted(issue.message)}`);
			if (!opts.fix) {
				if (audit.issues.some((issue) => issue.fixable)) lines.push(`  ${muted(`Fix: openclaw memory status --fix --agent ${agentId}`)}`);
			}
		}
		if (dreamingAudit?.issues.length) {
			if (!scan?.issues.length && !audit?.issues.length) lines.push(label("Issues"));
			for (const issue of dreamingAudit.issues) lines.push(`  ${issue.severity === "error" ? warn(issue.message) : muted(issue.message)}`);
			if (!opts.fix && dreamingAudit.issues.some((issue) => issue.fixable)) lines.push(`  ${muted(`Fix: openclaw memory status --fix --agent ${agentId}`)}`);
		}
		defaultRuntime.log(lines.join("\n"));
		defaultRuntime.log("");
	}
}
//#endregion
//#region extensions/memory-core/src/cli-reset.runtime.ts
async function runMemoryReset(opts) {
	const cfg = getRuntimeConfig({ skipPluginValidation: true });
	const agentIds = resolveMemoryAgentIds(cfg, opts.agent);
	if (!opts.yes) {
		if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error("Memory reset requires confirmation. Re-run with --yes in non-interactive mode.");
		if (!await createClackPrompter().confirm({
			message: `Reset the derived memory index and embedding cache for ${agentIds.join(", ")}? Sessions and memory files will be preserved.`,
			initialValue: false
		})) {
			defaultRuntime.log("Memory reset cancelled.");
			return;
		}
	}
	for (const agentId of agentIds) {
		const dbPath = resolveOpenClawAgentSqlitePath({ agentId });
		if (!fs.existsSync(dbPath)) {
			defaultRuntime.log(`No memory index to reset (${agentId}).`);
			continue;
		}
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const extensionPath = resolveAgentConfig(cfg, agentId)?.memory?.search?.store?.vector?.extensionPath ?? cfg.memory?.search?.store?.vector?.extensionPath;
		const db = openMemoryDatabaseAtPath(dbPath, true);
		try {
			assertOpenClawAgentDatabaseForMaintenance(db, {
				agentId,
				pathname: dbPath
			});
			const changed = await resetMemoryDatabase({
				targetDb: db,
				dbPath,
				workspaceDir,
				vectorExtensionPath: extensionPath ? resolveUserPath(extensionPath) : void 0
			});
			defaultRuntime.log(changed ? `Memory index reset (${agentId}). Sessions preserved. Rebuild with: openclaw memory index --agent ${agentId}` : `No memory index to reset (${agentId}).`);
			defaultRuntime.log(`Reset does not shrink the database file. To reclaim space, back up data and stop the Gateway and other writers, then run: openclaw doctor --session-sqlite compact --session-sqlite-agent ${agentId}`);
		} finally {
			closeMemoryDatabase(db);
		}
	}
}
//#endregion
export { runMemoryForget, runMemoryIndex, runMemoryPromote, runMemoryPromoteExplain, runMemoryRemBackfill, runMemoryRemHarness, runMemoryReset, runMemorySearch, runMemorySessionBackfill, runMemoryStatus };
