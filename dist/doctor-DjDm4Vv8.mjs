import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { C as tryResolveAmbientOwnerAgentId, d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { C as resolveMemoryDreamingPluginConfig, E as resolveMemoryDreamingWorkspaces, O as resolveMemoryRemDreamingConfig, S as resolveMemoryDreamingConfig } from "./dreaming-D1wokp9N.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BPRn5nuX.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-CeRsYrid.mjs";
import { t as sortAndLimitBy } from "./sort-and-limit-NdojqZsZ.mjs";
import { a as getActiveMemoryProviderCore, l as resolveActiveMemoryBackendConfig, o as getActiveMemorySearchManagerCore } from "./memory-runtime-DvJ6BFOQ.mjs";
import { s as memory_core_bundled_runtime_exports } from "./memory-core-bundled-runtime-BEjG00DG.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/server-methods/doctor-memory-files.ts
const DREAM_DIARY_FILE_NAMES = ["DREAMS.md", "dreams.md"];
function getWorkspaceMemoryMaintenance(workspaceDir) {
	const access = getAgentWorkspaceAccess(workspaceDir, "memoryFiles");
	if (!access?.memoryFiles) return;
	const files = access.memoryFiles.maintenance;
	if (!files) throw new WorkspaceAccessUnavailableError("Remote Memory maintenance is unavailable");
	return files;
}
async function listWorkspaceDailyFiles(workspaceDir) {
	const memoryDir = path.join(workspaceDir, "memory");
	const files = getWorkspaceMemoryMaintenance(workspaceDir);
	let entries;
	try {
		entries = files ? (await files.listDirectory(memoryDir)).map((entry) => entry.name) : await fs.readdir(memoryDir);
	} catch (err) {
		if (extractErrorCode(err) === "ENOENT") return [];
		throw err;
	}
	return entries.filter((name) => /^\d{4}-\d{2}-\d{2}(?:-[^/]+)?\.md$/i.test(name)).map((name) => path.join(memoryDir, name)).toSorted((left, right) => left.localeCompare(right));
}
async function readDreamDiary(workspaceDir) {
	const files = getWorkspaceMemoryMaintenance(workspaceDir);
	for (const name of DREAM_DIARY_FILE_NAMES) {
		const filePath = path.join(workspaceDir, name);
		let stat;
		try {
			if (files) stat = await files.stat(filePath, false);
			else {
				const localStat = await fs.lstat(filePath);
				stat = {
					isSymbolicLink: localStat.isSymbolicLink(),
					isFile: localStat.isFile(),
					mtimeMs: localStat.mtimeMs
				};
			}
		} catch (err) {
			if (extractErrorCode(err) === "ENOENT") continue;
			return {
				found: false,
				path: name
			};
		}
		if (stat.isSymbolicLink || !stat.isFile) continue;
		try {
			return {
				found: true,
				path: name,
				content: files ? (await files.readFile(filePath)).toString("utf-8") : await fs.readFile(filePath, "utf-8"),
				updatedAtMs: Math.floor(stat.mtimeMs)
			};
		} catch {
			return {
				found: false,
				path: name
			};
		}
	}
	return {
		found: false,
		path: DREAM_DIARY_FILE_NAMES[0]
	};
}
//#endregion
//#region src/gateway/server-methods/doctor-memory-provider-status.ts
const SKIPPED_MEMORY_EMBEDDING_PROBE = {
	ok: false,
	checked: false,
	error: "memory embedding readiness not checked; run `openclaw memory status --deep` to probe"
};
/** Reads provider-native memory health under the current operator request authority. */
async function respondProviderMemoryStatus(params) {
	let open = true;
	const assertRequestCurrent = () => {
		params.signal?.throwIfAborted();
		params.client?.connectionSignal?.throwIfAborted();
		if (!open || params.client?.invalidated || params.hasCurrentClientAuthority?.() === false) throw new Error("Memory status authority is no longer active");
	};
	let captured = void 0;
	let provider = null;
	try {
		captured = await captureGatewayOperatorRunAuthority({
			client: params.client,
			context: params.context,
			hasCurrentClientAuthority: params.hasCurrentClientAuthority,
			invocationAuthority: {
				assertCurrent: assertRequestCurrent,
				signal: params.signal
			}
		});
		if (!captured) throw new Error("Memory provider status requires authenticated operator authority");
		const authority = captured.authority;
		const assertCurrent = () => {
			assertRequestCurrent();
			authority.assertCurrent();
		};
		assertCurrent();
		const acquired = await getActiveMemoryProviderCore({
			cfg: params.cfg,
			agentId: params.agentId,
			purpose: "status",
			context: {
				authority: {
					kind: "operator",
					scopes: authority.scopes,
					connId: params.client?.connId
				},
				assertCurrent,
				signal: params.signal
			}
		});
		provider = acquired.provider;
		if (!provider) throw new Error(acquired.error ?? `memory plugin "${params.providerId}" unavailable`);
		const health = await provider.health();
		assertCurrent();
		params.respond(true, {
			agentId: params.agentId,
			provider: acquired.providerId ?? params.providerId,
			health,
			embedding: SKIPPED_MEMORY_EMBEDDING_PROBE
		}, void 0);
	} catch (err) {
		params.respond(true, {
			agentId: params.agentId,
			provider: params.providerId,
			health: {
				status: "unavailable",
				message: formatErrorMessage(err)
			},
			embedding: SKIPPED_MEMORY_EMBEDDING_PROBE
		}, void 0);
	} finally {
		open = false;
		try {
			await provider?.close();
		} finally {
			captured?.release();
		}
	}
}
//#endregion
//#region src/gateway/server-methods/doctor-memory-target.ts
/** Resolves and validates the agent targeted by a Doctor memory request. */
function resolveDoctorMemoryAgent(context, params, respond) {
	const cfg = context.getRuntimeConfig();
	const rawAgentId = asOptionalRecord(params)?.agentId;
	if (rawAgentId !== void 0 && typeof rawAgentId !== "string") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId must be a string"));
		return null;
	}
	const requestedAgentId = typeof rawAgentId === "string" ? normalizeAgentId(rawAgentId) : void 0;
	let agentId = requestedAgentId ?? tryResolveAmbientOwnerAgentId(cfg);
	if (!agentId) try {
		agentId = resolveDefaultAgentId(cfg, {
			surface: "doctor memory",
			hint: "Pass agentId to select a configured agent."
		});
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		return null;
	}
	if (requestedAgentId && !listAgentIds(cfg).includes(agentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${requestedAgentId}"`));
		return null;
	}
	return {
		cfg,
		agentId,
		...requestedAgentId ? { requestedAgentId } : {}
	};
}
function resolveDoctorMemoryTarget(context, params, respond) {
	const resolved = resolveDoctorMemoryAgent(context, params, respond);
	if (!resolved) return null;
	return {
		cfg: resolved.cfg,
		agentId: resolved.agentId,
		workspaceDir: resolveAgentWorkspaceDir(resolved.cfg, resolved.agentId)
	};
}
/** Builds a Doctor memory action handler with shared target validation. */
function memoryActionHandler(action, run) {
	return async ({ respond, context, params }) => {
		const target = resolveDoctorMemoryTarget(context, params, respond);
		if (!target) return;
		respond(true, {
			agentId: target.agentId,
			action,
			...await run(target)
		}, void 0);
	};
}
//#endregion
//#region src/gateway/server-methods/doctor.ts
function extractIsoDayFromPath(filePath) {
	return filePath.replaceAll("\\", "/").match(/(\d{4}-\d{2}-\d{2})(?:-[^/]+)?\.md$/i)?.[1] ?? null;
}
function groundedMarkdownToDiaryLines(markdown) {
	return markdown.split("\n").map((line) => line.replace(/^##\s+/, "").trimEnd()).filter((line, index, lines) => line.length > 0 || index > 0 && expectDefined(lines[index - 1], "lines entry at index 1")?.length > 0);
}
function resolveDreamingConfig(cfg) {
	const resolved = resolveMemoryDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(cfg),
		cfg
	});
	const { light, deep, rem } = resolved.phases;
	const cronStatus = { managedCronPresent: false };
	return {
		enabled: resolved.enabled,
		...resolved.timezone ? { timezone: resolved.timezone } : {},
		verboseLogging: resolved.verboseLogging,
		storageMode: resolved.storage.mode,
		separateReports: resolved.storage.separateReports,
		phases: {
			light: {
				enabled: resolved.enabled && light.enabled,
				cron: light.cron,
				lookbackDays: light.lookbackDays,
				limit: light.limit,
				...cronStatus
			},
			deep: {
				enabled: resolved.enabled && deep.enabled,
				cron: deep.cron,
				limit: deep.limit,
				minScore: deep.minScore,
				minRecallCount: deep.minRecallCount,
				minUniqueQueries: deep.minUniqueQueries,
				recencyHalfLifeDays: deep.recencyHalfLifeDays,
				...cronStatus,
				...typeof deep.maxAgeDays === "number" ? { maxAgeDays: deep.maxAgeDays } : {}
			},
			rem: {
				enabled: resolved.enabled && rem.enabled,
				cron: rem.cron,
				lookbackDays: rem.lookbackDays,
				limit: rem.limit,
				minPatternStrength: rem.minPatternStrength,
				...cronStatus
			}
		}
	};
}
const DREAMING_ENTRY_LIST_LIMIT = 8;
function parseDreamingTimestampMs(value) {
	return parseDateStringTimestampMs(value) ?? Number.NEGATIVE_INFINITY;
}
function compareDreamingEntryByRecency(a, b) {
	const aMs = parseDreamingTimestampMs(a.lastRecalledAt);
	const bMs = parseDreamingTimestampMs(b.lastRecalledAt);
	if (bMs !== aMs) return bMs > aMs ? 1 : -1;
	if (b.totalSignalCount !== a.totalSignalCount) return b.totalSignalCount - a.totalSignalCount;
	return a.path.localeCompare(b.path);
}
function compareDreamingEntryBySignals(a, b) {
	if (b.totalSignalCount !== a.totalSignalCount) return b.totalSignalCount - a.totalSignalCount;
	if (b.phaseHitCount !== a.phaseHitCount) return b.phaseHitCount - a.phaseHitCount;
	return compareDreamingEntryByRecency(a, b);
}
function compareDreamingEntryByPromotion(a, b) {
	const aMs = parseDreamingTimestampMs(a.promotedAt);
	const bMs = parseDreamingTimestampMs(b.promotedAt);
	if (bMs !== aMs) return bMs > aMs ? 1 : -1;
	return compareDreamingEntryBySignals(a, b);
}
async function loadDreamingStoreStats(workspaceDir, nowMs, loadShortTermPromotionDreamingStats, timezone) {
	try {
		return await loadShortTermPromotionDreamingStats({
			workspaceDir,
			nowMs,
			timezone
		});
	} catch (err) {
		return {
			...mergeDreamingStoreStats([]),
			storeError: formatErrorMessage(err)
		};
	}
}
function mergeDreamingStoreStats(stats) {
	let shortTermCount = 0;
	let recallSignalCount = 0;
	let dailySignalCount = 0;
	let groundedSignalCount = 0;
	let totalSignalCount = 0;
	let phaseSignalCount = 0;
	let lightPhaseHitCount = 0;
	let remPhaseHitCount = 0;
	let promotedTotal = 0;
	let promotedToday = 0;
	let latestPromotedAtMs = Number.NEGATIVE_INFINITY;
	let lastPromotedAt;
	const storePaths = /* @__PURE__ */ new Set();
	const phaseSignalPaths = /* @__PURE__ */ new Set();
	const storeErrors = [];
	const phaseSignalErrors = [];
	const shortTermEntries = [];
	const signalEntries = [];
	const promotedEntries = [];
	for (const stat of stats) {
		shortTermCount += stat.shortTermCount;
		recallSignalCount += stat.recallSignalCount;
		dailySignalCount += stat.dailySignalCount;
		groundedSignalCount += stat.groundedSignalCount;
		totalSignalCount += stat.totalSignalCount;
		phaseSignalCount += stat.phaseSignalCount;
		lightPhaseHitCount += stat.lightPhaseHitCount;
		remPhaseHitCount += stat.remPhaseHitCount;
		promotedTotal += stat.promotedTotal;
		promotedToday += stat.promotedToday;
		if (stat.storePath) storePaths.add(stat.storePath);
		if (stat.phaseSignalPath) phaseSignalPaths.add(stat.phaseSignalPath);
		if (stat.storeError) storeErrors.push(stat.storeError);
		if (stat.phaseSignalError) phaseSignalErrors.push(stat.phaseSignalError);
		shortTermEntries.push(...stat.shortTermEntries);
		signalEntries.push(...stat.signalEntries);
		promotedEntries.push(...stat.promotedEntries);
		const promotedAtMs = stat.lastPromotedAt ? Date.parse(stat.lastPromotedAt) : NaN;
		if (Number.isFinite(promotedAtMs) && promotedAtMs > latestPromotedAtMs) {
			latestPromotedAtMs = promotedAtMs;
			lastPromotedAt = stat.lastPromotedAt;
		}
	}
	return {
		shortTermCount,
		recallSignalCount,
		dailySignalCount,
		groundedSignalCount,
		totalSignalCount,
		phaseSignalCount,
		lightPhaseHitCount,
		remPhaseHitCount,
		promotedTotal,
		promotedToday,
		shortTermEntries: sortAndLimitBy(shortTermEntries, DREAMING_ENTRY_LIST_LIMIT, compareDreamingEntryByRecency),
		signalEntries: sortAndLimitBy(signalEntries, DREAMING_ENTRY_LIST_LIMIT, compareDreamingEntryBySignals),
		promotedEntries: sortAndLimitBy(promotedEntries, DREAMING_ENTRY_LIST_LIMIT, compareDreamingEntryByPromotion),
		...storePaths.size === 1 ? { storePath: [...storePaths][0] } : {},
		...phaseSignalPaths.size === 1 ? { phaseSignalPath: [...phaseSignalPaths][0] } : {},
		...lastPromotedAt ? { lastPromotedAt } : {},
		...storeErrors.length === 1 ? { storeError: storeErrors[0] } : storeErrors.length > 1 ? { storeError: `${storeErrors.length} dreaming stores had read errors.` } : {},
		...phaseSignalErrors.length === 1 ? { phaseSignalError: phaseSignalErrors[0] } : phaseSignalErrors.length > 1 ? { phaseSignalError: `${phaseSignalErrors.length} phase signal stores had read errors.` } : {}
	};
}
function isManagedDreamingJob(job) {
	if (normalizeOptionalString(job.description)?.includes("[managed-by=memory-core.short-term-promotion]")) return true;
	return normalizeOptionalString(job.name) === "Memory Dreaming Promotion" && job.payload.kind === "systemEvent" && normalizeOptionalString(job.payload.text) === "__openclaw_memory_core_short_term_promotion_dream__";
}
async function resolveManagedDreamingCronStatus(context) {
	try {
		const managed = (await context.cron.list({ includeDisabled: true })).filter(isManagedDreamingJob);
		let nextRunAtMs;
		for (const job of managed) {
			if (!job.enabled) continue;
			const candidate = job.state?.nextRunAtMs;
			if (typeof candidate !== "number" || !Number.isFinite(candidate)) continue;
			if (nextRunAtMs === void 0 || candidate < nextRunAtMs) nextRunAtMs = candidate;
		}
		return {
			managedCronPresent: managed.length > 0,
			...nextRunAtMs !== void 0 ? { nextRunAtMs } : {}
		};
	} catch {
		return { managedCronPresent: false };
	}
}
const createDoctorHandlers = (memoryCoreRuntime = memory_core_bundled_runtime_exports) => ({
	"doctor.memory.status": async ({ respond, context, params, client, signal, hasCurrentClientAuthority }) => {
		const resolved = resolveDoctorMemoryAgent(context, params, respond);
		if (!resolved) return;
		const { cfg, agentId, requestedAgentId } = resolved;
		const backend = resolveActiveMemoryBackendConfig({
			cfg,
			agentId
		});
		if (backend?.backend === "provider-runtime") {
			await respondProviderMemoryStatus({
				cfg,
				agentId,
				providerId: backend.providerId,
				respond,
				context,
				client,
				signal,
				hasCurrentClientAuthority
			});
			return;
		}
		const { manager, error, searchRuntimeRegistered } = await getActiveMemorySearchManagerCore({
			cfg,
			agentId,
			purpose: "status"
		});
		if (!manager) {
			respond(true, {
				agentId,
				searchRuntimeRegistered,
				embedding: {
					ok: false,
					error: error ?? "memory search unavailable"
				}
			}, void 0);
			return;
		}
		try {
			let status = manager.status();
			const shouldProbe = params.probe === true || params.deep === true;
			let embedding = shouldProbe ? await manager.probeEmbeddingAvailability() : manager.getCachedEmbeddingAvailability?.() ?? SKIPPED_MEMORY_EMBEDDING_PROBE;
			if (shouldProbe) status = manager.status();
			if (!embedding.ok && !embedding.error) embedding = {
				ok: false,
				error: "memory embeddings unavailable"
			};
			const nowMs = Date.now();
			const dreamingConfig = resolveDreamingConfig(cfg);
			const workspaceDir = normalizeOptionalString(status.workspaceDir);
			const allWorkspaces = requestedAgentId ? workspaceDir ? [workspaceDir] : [] : resolveMemoryDreamingWorkspaces(cfg, {
				primaryWorkspaceDir: workspaceDir,
				primaryAgentId: agentId
			}).map((entry) => entry.workspaceDir);
			const storeStats = mergeDreamingStoreStats(allWorkspaces.length === 0 ? [] : await Promise.all(allWorkspaces.map((entry) => loadDreamingStoreStats(entry, nowMs, memoryCoreRuntime.loadShortTermPromotionDreamingStats, dreamingConfig.timezone))));
			const cronStatus = await resolveManagedDreamingCronStatus(context);
			respond(true, {
				agentId,
				provider: status.provider,
				embedding,
				embeddingRuntime: (() => {
					const runtime = asOptionalRecord(asOptionalRecord(status.custom)?.llamaCppRuntime);
					return runtime?.engine === "llama.cpp" ? runtime : void 0;
				})(),
				dreaming: {
					...dreamingConfig,
					...storeStats,
					phases: {
						light: {
							...dreamingConfig.phases.light,
							...cronStatus
						},
						deep: {
							...dreamingConfig.phases.deep,
							...cronStatus
						},
						rem: {
							...dreamingConfig.phases.rem,
							...cronStatus
						}
					}
				}
			}, void 0);
		} catch (err) {
			respond(true, {
				agentId,
				embedding: {
					ok: false,
					error: `gateway memory probe failed: ${formatErrorMessage(err)}`
				}
			}, void 0);
		} finally {
			await manager.close?.().catch(() => {});
		}
	},
	"doctor.memory.dreamDiary": async ({ respond, context, params }) => {
		const target = resolveDoctorMemoryTarget(context, params, respond);
		if (!target) return;
		const { agentId, workspaceDir } = target;
		respond(true, {
			agentId,
			...await readDreamDiary(workspaceDir)
		}, void 0);
	},
	"doctor.memory.backfillDreamDiary": memoryActionHandler("backfill", async ({ cfg, workspaceDir }) => {
		const sourceFiles = await listWorkspaceDailyFiles(workspaceDir);
		if (sourceFiles.length === 0) {
			const dreamDiary = await readDreamDiary(workspaceDir);
			return {
				path: dreamDiary.path,
				found: dreamDiary.found,
				scannedFiles: 0,
				written: 0,
				replaced: 0
			};
		}
		const grounded = await memoryCoreRuntime.previewGroundedRemMarkdown({
			workspaceDir,
			inputPaths: sourceFiles
		});
		const remConfig = resolveMemoryRemDreamingConfig({
			pluginConfig: resolveMemoryDreamingPluginConfig(cfg),
			cfg
		});
		const entries = grounded.files.map((file) => {
			const isoDay = extractIsoDayFromPath(file.path);
			if (!isoDay) return null;
			return {
				isoDay,
				sourcePath: file.path,
				bodyLines: groundedMarkdownToDiaryLines(file.renderedMarkdown)
			};
		}).filter((entry) => entry !== null);
		const written = await memoryCoreRuntime.writeBackfillDiaryEntries({
			workspaceDir,
			entries,
			timezone: remConfig.timezone
		});
		const dreamDiary = await readDreamDiary(workspaceDir);
		return {
			path: dreamDiary.path,
			found: dreamDiary.found,
			scannedFiles: grounded.scannedFiles,
			written: written.written,
			replaced: written.replaced
		};
	}),
	"doctor.memory.resetDreamDiary": memoryActionHandler("reset", async ({ workspaceDir }) => {
		const removed = await memoryCoreRuntime.removeBackfillDiaryEntries({ workspaceDir });
		const dreamDiary = await readDreamDiary(workspaceDir);
		return {
			path: dreamDiary.path,
			found: dreamDiary.found,
			removedEntries: removed.removed
		};
	}),
	"doctor.memory.resetGroundedShortTerm": memoryActionHandler("resetGroundedShortTerm", async ({ workspaceDir }) => {
		return { removedShortTermEntries: (await memoryCoreRuntime.removeGroundedShortTermCandidates({ workspaceDir })).removed };
	}),
	"doctor.memory.repairDreamingArtifacts": memoryActionHandler("repairDreamingArtifacts", async ({ workspaceDir }) => {
		const repair = await memoryCoreRuntime.repairDreamingArtifacts({ workspaceDir });
		return {
			changed: repair.changed,
			archiveDir: repair.archiveDir,
			archivedDreamsDiary: repair.archivedDreamsDiary,
			archivedSessionCorpus: repair.archivedSessionCorpus,
			archivedSessionIngestion: repair.archivedSessionIngestion,
			warnings: repair.warnings
		};
	}),
	"doctor.memory.dedupeDreamDiary": memoryActionHandler("dedupeDreamDiary", async ({ workspaceDir }) => {
		const dedupe = await memoryCoreRuntime.dedupeDreamDiaryEntries({ workspaceDir });
		const dreamDiary = await readDreamDiary(workspaceDir);
		return {
			path: dreamDiary.path,
			found: dreamDiary.found,
			removedEntries: dedupe.removed,
			dedupedEntries: dedupe.removed,
			keptEntries: dedupe.kept
		};
	})
});
//#endregion
export { createDoctorHandlers };
