import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, b as tryResolveAmbientOwnerAgentId, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { C as resolveMemoryDreamingPluginConfig, D as resolveMemoryLightDreamingConfig, E as resolveMemoryDreamingWorkspaces, O as resolveMemoryRemDreamingConfig, S as resolveMemoryDreamingConfig, x as resolveMemoryDeepDreamingConfig } from "./dreaming-Rnb_FGdU.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-BNUXOhfF.mjs";
import "./server-utils-BHpxAA43.mjs";
import { a as getActiveMemorySearchManagerCore } from "./memory-runtime-Dxg3qwYx.mjs";
import { a as memory_core_bundled_runtime_exports } from "./memory-core-bundled-runtime-BmbJAmQp.mjs";
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
//#region src/gateway/server-methods/doctor.ts
const MANAGED_DEEP_SLEEP_CRON_NAME = "Memory Dreaming Promotion";
const MANAGED_DEEP_SLEEP_CRON_TAG = "[managed-by=memory-core.short-term-promotion]";
const DEEP_SLEEP_SYSTEM_EVENT_TEXT = "__openclaw_memory_core_short_term_promotion_dream__";
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
	const light = resolveMemoryLightDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(cfg),
		cfg
	});
	const deep = resolveMemoryDeepDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(cfg),
		cfg
	});
	const rem = resolveMemoryRemDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(cfg),
		cfg
	});
	return {
		enabled: resolved.enabled,
		...resolved.timezone ? { timezone: resolved.timezone } : {},
		verboseLogging: resolved.verboseLogging,
		storageMode: resolved.storage.mode,
		separateReports: resolved.storage.separateReports,
		shortTermEntries: [],
		signalEntries: [],
		promotedEntries: [],
		phases: {
			light: {
				enabled: light.enabled,
				cron: light.cron,
				lookbackDays: light.lookbackDays,
				limit: light.limit,
				managedCronPresent: false
			},
			deep: {
				enabled: deep.enabled,
				cron: deep.cron,
				limit: deep.limit,
				minScore: deep.minScore,
				minRecallCount: deep.minRecallCount,
				minUniqueQueries: deep.minUniqueQueries,
				recencyHalfLifeDays: deep.recencyHalfLifeDays,
				managedCronPresent: false,
				...typeof deep.maxAgeDays === "number" ? { maxAgeDays: deep.maxAgeDays } : {}
			},
			rem: {
				enabled: rem.enabled,
				cron: rem.cron,
				lookbackDays: rem.lookbackDays,
				limit: rem.limit,
				minPatternStrength: rem.minPatternStrength,
				managedCronPresent: false
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
function trimDreamingEntries(entries, compare) {
	const selected = [];
	for (const entry of entries) {
		let insertAt = selected.length;
		for (let index = 0; index < selected.length; index += 1) if (compare(entry, expectDefined(selected[index], "selected entry at index")) < 0) {
			insertAt = index;
			break;
		}
		if (insertAt < DREAMING_ENTRY_LIST_LIMIT) {
			selected.splice(insertAt, 0, entry);
			if (selected.length > DREAMING_ENTRY_LIST_LIMIT) selected.pop();
		} else if (selected.length < DREAMING_ENTRY_LIST_LIMIT) selected.push(entry);
	}
	return selected;
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
			shortTermCount: 0,
			recallSignalCount: 0,
			dailySignalCount: 0,
			groundedSignalCount: 0,
			totalSignalCount: 0,
			phaseSignalCount: 0,
			lightPhaseHitCount: 0,
			remPhaseHitCount: 0,
			promotedTotal: 0,
			promotedToday: 0,
			shortTermEntries: [],
			signalEntries: [],
			promotedEntries: [],
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
		shortTermEntries: trimDreamingEntries(shortTermEntries, compareDreamingEntryByRecency),
		signalEntries: trimDreamingEntries(signalEntries, compareDreamingEntryBySignals),
		promotedEntries: trimDreamingEntries(promotedEntries, compareDreamingEntryByPromotion),
		...storePaths.size === 1 ? { storePath: [...storePaths][0] } : {},
		...phaseSignalPaths.size === 1 ? { phaseSignalPath: [...phaseSignalPaths][0] } : {},
		...lastPromotedAt ? { lastPromotedAt } : {},
		...storeErrors.length === 1 ? { storeError: storeErrors[0] } : storeErrors.length > 1 ? { storeError: `${storeErrors.length} dreaming stores had read errors.` } : {},
		...phaseSignalErrors.length === 1 ? { phaseSignalError: phaseSignalErrors[0] } : phaseSignalErrors.length > 1 ? { phaseSignalError: `${phaseSignalErrors.length} phase signal stores had read errors.` } : {}
	};
}
function isManagedDreamingJob(job, params) {
	if (normalizeOptionalString(job.description)?.includes(params.tag)) return true;
	const name = normalizeOptionalString(job.name);
	const payloadKind = normalizeOptionalString(job.payload?.kind)?.toLowerCase();
	const payloadText = normalizeOptionalString(job.payload?.text);
	return name === params.name && payloadKind === "systemevent" && payloadText === params.payloadText;
}
async function resolveManagedDreamingCronStatus(params) {
	if (!params.context.cron || typeof params.context.cron.list !== "function") return { managedCronPresent: false };
	try {
		const managed = (await params.context.cron.list({ includeDisabled: true })).filter((job) => typeof job === "object" && job !== null).filter((job) => isManagedDreamingJob(job, params.match));
		let nextRunAtMs;
		for (const job of managed) {
			if (job.enabled !== true) continue;
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
async function resolveAllManagedDreamingCronStatuses(context) {
	const sweepStatus = await resolveManagedDreamingCronStatus({
		context,
		match: {
			name: MANAGED_DEEP_SLEEP_CRON_NAME,
			tag: MANAGED_DEEP_SLEEP_CRON_TAG,
			payloadText: DEEP_SLEEP_SYSTEM_EVENT_TEXT
		}
	});
	return {
		light: sweepStatus,
		deep: sweepStatus,
		rem: sweepStatus
	};
}
function shouldProbeMemoryEmbeddings(params) {
	if (!params || typeof params !== "object") return false;
	const record = params;
	return record.probe === true || record.deep === true;
}
function resolveDoctorMemoryAgent(context, params, respond, omittedAgentId) {
	const cfg = context.getRuntimeConfig();
	const rawAgentId = asOptionalRecord(params)?.agentId;
	if (rawAgentId !== void 0 && typeof rawAgentId !== "string") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId must be a string"));
		return null;
	}
	const requestedAgentId = typeof rawAgentId === "string" ? normalizeAgentId(rawAgentId) : void 0;
	let agentId = requestedAgentId ?? omittedAgentId;
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
const SKIPPED_MEMORY_EMBEDDING_PROBE = {
	ok: false,
	checked: false,
	error: "memory embedding readiness not checked; run `openclaw memory status --deep` to probe"
};
const createDoctorHandlers = (memoryCoreRuntime = memory_core_bundled_runtime_exports) => ({
	"doctor.memory.status": async ({ respond, context, params }) => {
		const resolved = resolveDoctorMemoryAgent(context, params, respond, tryResolveAmbientOwnerAgentId(context.getRuntimeConfig()));
		if (!resolved) return;
		const { cfg, agentId, requestedAgentId } = resolved;
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
			const shouldProbe = shouldProbeMemoryEmbeddings(params);
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
			const storeStats = allWorkspaces.length > 0 ? mergeDreamingStoreStats(await Promise.all(allWorkspaces.map((entry) => loadDreamingStoreStats(entry, nowMs, memoryCoreRuntime.loadShortTermPromotionDreamingStats, dreamingConfig.timezone)))) : {
				shortTermCount: 0,
				recallSignalCount: 0,
				dailySignalCount: 0,
				groundedSignalCount: 0,
				totalSignalCount: 0,
				phaseSignalCount: 0,
				lightPhaseHitCount: 0,
				remPhaseHitCount: 0,
				promotedTotal: 0,
				promotedToday: 0
			};
			const cronStatuses = await resolveAllManagedDreamingCronStatuses(context);
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
							...cronStatuses.light
						},
						deep: {
							...dreamingConfig.phases.deep,
							...cronStatuses.deep
						},
						rem: {
							...dreamingConfig.phases.rem,
							...cronStatuses.rem
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
	"doctor.memory.backfillDreamDiary": async ({ respond, context, params }) => {
		const target = resolveDoctorMemoryTarget(context, params, respond);
		if (!target) return;
		const { cfg, agentId, workspaceDir } = target;
		const sourceFiles = await listWorkspaceDailyFiles(workspaceDir);
		if (sourceFiles.length === 0) {
			const dreamDiary = await readDreamDiary(workspaceDir);
			respond(true, {
				agentId,
				path: dreamDiary.path,
				action: "backfill",
				found: dreamDiary.found,
				scannedFiles: 0,
				written: 0,
				replaced: 0
			}, void 0);
			return;
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
		respond(true, {
			agentId,
			path: dreamDiary.path,
			action: "backfill",
			found: dreamDiary.found,
			scannedFiles: grounded.scannedFiles,
			written: written.written,
			replaced: written.replaced
		}, void 0);
	},
	"doctor.memory.resetDreamDiary": async ({ respond, context, params }) => {
		const target = resolveDoctorMemoryTarget(context, params, respond);
		if (!target) return;
		const { agentId, workspaceDir } = target;
		const removed = await memoryCoreRuntime.removeBackfillDiaryEntries({ workspaceDir });
		const dreamDiary = await readDreamDiary(workspaceDir);
		respond(true, {
			agentId,
			path: dreamDiary.path,
			action: "reset",
			found: dreamDiary.found,
			removedEntries: removed.removed
		}, void 0);
	},
	"doctor.memory.resetGroundedShortTerm": async ({ respond, context, params }) => {
		const target = resolveDoctorMemoryTarget(context, params, respond);
		if (!target) return;
		const { agentId, workspaceDir } = target;
		respond(true, {
			agentId,
			action: "resetGroundedShortTerm",
			removedShortTermEntries: (await memoryCoreRuntime.removeGroundedShortTermCandidates({ workspaceDir })).removed
		}, void 0);
	},
	"doctor.memory.repairDreamingArtifacts": async ({ respond, context, params }) => {
		const target = resolveDoctorMemoryTarget(context, params, respond);
		if (!target) return;
		const { agentId, workspaceDir } = target;
		const repair = await memoryCoreRuntime.repairDreamingArtifacts({ workspaceDir });
		respond(true, {
			agentId,
			action: "repairDreamingArtifacts",
			changed: repair.changed,
			archiveDir: repair.archiveDir,
			archivedDreamsDiary: repair.archivedDreamsDiary,
			archivedSessionCorpus: repair.archivedSessionCorpus,
			archivedSessionIngestion: repair.archivedSessionIngestion,
			warnings: repair.warnings
		}, void 0);
	},
	"doctor.memory.dedupeDreamDiary": async ({ respond, context, params }) => {
		const target = resolveDoctorMemoryTarget(context, params, respond);
		if (!target) return;
		const { agentId, workspaceDir } = target;
		const dedupe = await memoryCoreRuntime.dedupeDreamDiaryEntries({ workspaceDir });
		const dreamDiary = await readDreamDiary(workspaceDir);
		respond(true, {
			agentId,
			action: "dedupeDreamDiary",
			path: dreamDiary.path,
			found: dreamDiary.found,
			removedEntries: dedupe.removed,
			dedupedEntries: dedupe.removed,
			keptEntries: dedupe.kept
		}, void 0);
	}
});
//#endregion
export { createDoctorHandlers };
