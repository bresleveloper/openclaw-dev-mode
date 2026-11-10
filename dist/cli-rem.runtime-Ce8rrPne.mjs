import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as createNormalizedPluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { _ as resolveDefaultAgentId, h as resolveConfiguredAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { E as resolveMemoryRemDreamingConfig } from "./dreaming-D2xE6WEV.mjs";
import { r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { h as normalizeExtraMemoryPathEntries } from "./engine-storage-DAQECy5K.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import { i as readMemorySearchManagerStatus } from "./types-CGuNDIwt.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-DV-G0hQT.mjs";
import { s as getMemoryEmbeddingCommandSecretTargetIds } from "./command-secret-targets-C_0e9XHi.mjs";
import { i as withProgressTotals } from "./progress-BIOeyA3T.mjs";
import "./plugin-config-runtime-Dm1sl1ov.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import { r as withManager } from "./cli-utils-C0bJ9VIR.mjs";
import "./temp-path-D_RJiwsA.mjs";
import "./memory-core-host-status-EFn_AMM-.mjs";
import "./memory-core-host-runtime-cli-BAHpg7tN.mjs";
import "./memory-core-host-runtime-core-CNLFAky0.mjs";
import { r as getActiveMemoryProvider } from "./memory-host-search-o4F9E8j9.mjs";
import { d as writeBackfillDiaryEntries, s as removeBackfillDiaryEntries } from "./dreaming-dreams-file-BFl4u8HC.mjs";
import { n as previewGroundedRemMarkdown } from "./rem-evidence-_gsdXE0h.mjs";
import { r as removeGroundedShortTermCandidates } from "./short-term-promotion-NZ4nGzEz.mjs";
import { h as DAILY_MEMORY_FILENAME_RE } from "./session-ingestion-w1VvcFpR.mjs";
import { r as recordShortTermRecalls } from "./short-term-promotion-record-yyoZVODo.mjs";
import { i as seedHistoricalDailyMemorySignals } from "./dreaming-phases-BydRGcds.mjs";
import { t as previewRemHarness } from "./rem-harness-F9Mt6qP1.mjs";
import { r as getMemorySearchManager } from "./memory-VNVX55ZQ.mjs";
import { n as runSessionBackfill } from "./session-backfill-DOVec31u.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/memory-core/src/cli-memory-slot.ts
async function loadMemoryCommandConfig(commandName, mode, providedConfig) {
	const targetIds = getMemoryEmbeddingCommandSecretTargetIds(providedConfig);
	const config = providedConfig ?? await captureRuntimeConfigAsyncReader({ skipPluginValidation: true })();
	try {
		const { resolvedConfig, diagnostics, hadUnresolvedTargets } = await resolveCommandSecretRefsViaGateway({
			config,
			commandName,
			targetIds,
			...mode ? { mode } : {}
		});
		if (hadUnresolvedTargets && resolveForeignMemorySlotOwner(config)) throw new Error(diagnostics.join("\n"));
		return {
			config: resolvedConfig,
			diagnostics
		};
	} catch (error) {
		const { code, ownerKind, ownerId, paths } = asNullableRecord(error) ?? {};
		const message = formatErrorMessage(error);
		if (mode !== "read_only_status" || resolveForeignMemorySlotOwner(config) || ownerKind === "capability" && typeof ownerId === "string" && ownerId.startsWith("memory-provider:") || Array.isArray(paths) && paths.some((entry) => typeof entry === "string" && entry.includes("memory.search.remote.apiKey")) || message.includes("capability:memory-provider:") || code !== "SECRET_SURFACE_UNAVAILABLE" && !message.includes("SECRET_SURFACE_UNAVAILABLE")) throw error;
		return {
			config,
			diagnostics: [`${commandName}: ${message}; continuing with degraded read-only config so healthy memory surfaces remain visible.`]
		};
	}
}
/** Returns the plugin that owns the memory slot when it is not Memory Core. */
function resolveForeignMemorySlotOwner(cfg) {
	const owner = createNormalizedPluginsConfig(cfg.plugins).slots.memory;
	return typeof owner === "string" && owner !== "memory-core" ? owner : void 0;
}
/** Explains that a Memory Core command touches only its sidecar index. */
function formatMemoryCoreSidecarNotice(owner) {
	return `Memory Core is running as the consolidation sidecar; plugins.slots.memory selects "${owner}". This command acts on Memory Core's sidecar index, not the agent's selected memory.`;
}
/**
* Reads the selected provider's health with host status authority, the same
* contract the host status scan uses, and always releases the provider lease.
*/
async function readSelectedMemoryProviderStatus(params) {
	const { cfg, agentId, owner } = params;
	let provider = null;
	let providerId = owner;
	let health;
	try {
		const { config } = await loadMemoryCommandConfig("memory status", "read_only_status", cfg);
		const acquired = await getActiveMemoryProvider({
			cfg: config,
			agentId,
			purpose: "status",
			context: {
				authority: {
					kind: "host",
					operation: "status"
				},
				assertCurrent() {}
			}
		});
		provider = acquired.provider;
		health = provider ? await provider.health() : {
			status: "unavailable",
			message: acquired.error ?? "memory provider unavailable"
		};
		providerId = acquired.providerId ?? owner;
	} catch (error) {
		health = {
			status: "unavailable",
			message: formatErrorMessage(error)
		};
	} finally {
		await provider?.close().catch(() => {});
	}
	return {
		agentId,
		provider: providerId,
		health,
		memoryCore: "consolidation-sidecar"
	};
}
//#endregion
//#region extensions/memory-core/src/cli-runtime-common.ts
const { warn: warn$1 } = theme;
async function syncMemoryWithProgress(params) {
	const startedAt = params.elapsed ? Date.now() : 0;
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
	await withProgressTotals({
		label: lastLabel,
		total: 0,
		fallback: params.options.verbose ? "line" : void 0
	}, async (update, progress) => {
		const interval = params.elapsed ? setInterval(() => progress.setLabel(buildLabel()), 1e3) : void 0;
		try {
			await params.sync({
				reason: "cli",
				force: Boolean(params.options.force),
				progress: (syncUpdate) => {
					if (syncUpdate.label) lastLabel = syncUpdate.label;
					lastCompleted = syncUpdate.completed;
					lastTotal = syncUpdate.total;
					update({
						completed: syncUpdate.completed,
						total: syncUpdate.total,
						label: params.elapsed ? buildLabel() : syncUpdate.label
					});
					if (params.elapsed) progress.setLabel(buildLabel());
					else if (syncUpdate.label) progress.setLabel(syncUpdate.label);
				}
			});
		} catch (error) {
			if (!params.onError) throw error;
			params.onError(error);
		} finally {
			if (interval !== void 0) clearInterval(interval);
		}
	});
}
function emitMemoryCommandWarning(message, toStderr) {
	defaultRuntime[toStderr ? "error" : "log"](warn$1(message));
}
/** Tells the operator that a Memory Core command acts on its sidecar index only. */
function emitMemoryCoreSidecarNotice(owner, params) {
	emitMemoryCommandWarning(formatMemoryCoreSidecarNotice(owner), Boolean(params?.json));
}
function resolveMemoryPluginConfig(cfg) {
	const entry = asNullableRecord(cfg.plugins?.entries?.["memory-core"]);
	return asNullableRecord(entry?.config) ?? {};
}
function formatAuditCounts(audit) {
	const coverage = audit.conceptTagScripts;
	const scriptCoverage = coverage ? [
		"latin",
		"cjk",
		"mixed",
		"other"
	].flatMap((script) => {
		const count = coverage[`${script}EntryCount`];
		return count > 0 ? [`${count} ${script}`] : [];
	}).join(", ") : "";
	const suffix = scriptCoverage ? ` · scripts=${scriptCoverage}` : "";
	return `${audit.entryCount} entries · ${audit.promotedCount} promoted · ${audit.conceptTaggedEntryCount} concept-tagged · ${audit.spacedEntryCount} spaced${suffix}`;
}
function resolveExplicitMemoryAgent(cfg, agent) {
	const trimmed = agent?.trim();
	if (agent !== void 0 && !trimmed) throw new Error("--agent must not be blank");
	return trimmed ? resolveConfiguredAgentId(cfg, trimmed) : void 0;
}
function resolveMemoryAgent(cfg, agent) {
	return resolveExplicitMemoryAgent(cfg, agent) ?? resolveDefaultAgentId(cfg);
}
function resolveMemoryAgentIds(cfg, agent) {
	const explicit = resolveExplicitMemoryAgent(cfg, agent);
	return explicit === void 0 ? listAgentIds(cfg) : [explicit];
}
function formatExtraPaths(workspaceDir, extraPaths) {
	return normalizeExtraMemoryPathEntries(workspaceDir, extraPaths).map((entry) => {
		const root = shortenHomePath(entry.path);
		return entry.pattern ? `${root} (pattern: ${entry.pattern})` : root;
	});
}
async function withMemoryCommand(params) {
	const { agent, json } = params.options;
	const onUnavailable = json && !params.allAgents ? defaultRuntime.writeJson : void 0;
	const { config: cfg, diagnostics } = await loadMemoryCommandConfig(params.commandName, params.purpose === "status" ? "read_only_status" : void 0);
	for (const entry of diagnostics) emitMemoryCommandWarning(`[secrets] ${entry}`, json === true);
	const slotOwner = resolveForeignMemorySlotOwner(cfg);
	if (slotOwner && params.requiresMemorySlot) {
		const message = `${params.commandName} reads only Memory Core's sidecar index, but plugins.slots.memory selects "${slotOwner}". Search the selected memory through the agent's memory tools or the ${slotOwner} plugin's own commands.`;
		defaultRuntime.error(message);
		process.exitCode = 1;
		onUnavailable?.({
			...formatCliJsonFailure(message),
			agentId: resolveMemoryAgent(cfg, agent)
		});
		return cfg;
	}
	if (slotOwner) emitMemoryCoreSidecarNotice(slotOwner, { json });
	const agentIds = params.allAgents ? resolveMemoryAgentIds(cfg, agent) : [resolveMemoryAgent(cfg, agent)];
	for (const agentId of agentIds) await withManager({
		getManager: () => getMemorySearchManager({
			cfg,
			agentId,
			purpose: params.purpose,
			inspectSources: params.inspectSources,
			acquireLocalService: params.acquireLocalService,
			runInBackgroundContext: params.runInBackgroundContext
		}),
		onMissing: (error) => {
			if (!error?.trim()) {
				defaultRuntime.log("Memory search disabled.");
				onUnavailable?.({
					agentId,
					status: "disabled"
				});
				return;
			}
			const message = `${params.commandName} failed (${agentId}): ${error}`;
			defaultRuntime.error(message);
			process.exitCode = 1;
			onUnavailable?.({
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
//#region extensions/memory-core/src/cli-rem.runtime.ts
const { heading, muted, warn } = theme;
async function runMemorySessionBackfill(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory session-backfill",
		options: opts,
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = (await readMemorySearchManagerStatus(manager)).workspaceDir?.trim();
			if (!workspaceDir) throw new Error("Memory session-backfill requires a resolvable workspace directory.");
			if (opts.rollback && (opts.apply || opts.rem || opts.from || opts.to || opts.archiveFiles?.length)) throw new Error("Memory session-backfill --rollback cannot be combined with input, range, --rem, or --apply options.");
			const pluginConfig = resolveMemoryPluginConfig(cfg);
			const remConfig = resolveMemoryRemDreamingConfig({
				pluginConfig,
				cfg
			});
			printSessionBackfillResult(await runSessionBackfill({
				agentId,
				workspaceDir,
				pluginConfig,
				from: opts.from,
				to: opts.to,
				limitDays: opts.limitDays,
				rem: opts.rem,
				apply: opts.apply,
				rollback: opts.rollback,
				archiveFiles: opts.archiveFiles,
				timezone: remConfig.timezone
			}), opts);
		}
	});
}
function printSessionBackfillResult(result, opts) {
	if (opts.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	if (result.rollback) {
		defaultRuntime.log([
			`${heading("Session Backfill")} ${muted("(rollback)")}`,
			muted(`workspace=${shortenHomePath(result.workspaceDir)}`),
			muted(`removedDiaryEntries=${result.rollback.removedDiaryEntries}`),
			muted(`removedStagedEntries=${result.rollback.removedStagedEntries}`)
		].join("\n"));
		return;
	}
	const lines = [
		`${heading("Session Backfill")} ${muted(`(${result.agentId})`)}`,
		muted(`workspace=${shortenHomePath(result.workspaceDir)}`),
		muted(`batches=${result.batchCount ?? 1} days=${result.days.length} candidates=${result.candidateCount} staged=${result.stagedEntries}`)
	];
	for (const batch of result.batches ?? []) lines.push(muted(`batch=${batch.batch} days=${batch.days} candidates=${batch.candidates} staged=${batch.stagedEntries}`));
	for (const day of result.days) {
		lines.push("", heading(day.day), muted(`candidates=${day.candidateCount}`));
		lines.push(...day.topCandidates.map((candidate) => `- ${candidate}`));
	}
	if (result.days.length === 0) lines.push("", "No new hash-untracked trusted session candidates.");
	if (!result.applied && !result.rem) lines.push("", muted("Dry run; use --apply to stage candidates."));
	defaultRuntime.log(lines.join("\n"));
}
async function runMemoryRemHarness(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory rem-harness",
		options: opts,
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const managerWorkspaceDir = (await readMemorySearchManagerStatus(manager)).workspaceDir?.trim();
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
				`${heading("REM Harness")} ${muted(`(${agentId})`)}`,
				muted(`workspace=${shortenHomePath(workspaceDir)}`),
				...opts.path ? [
					muted(`sourcePath=${shortenHomePath(path.resolve(opts.path))}`),
					muted(`historicalFiles=${sourceFiles.length} importedFiles=${importedFileCount} importedSignals=${importedSignalCount}`),
					...skippedPaths.length > 0 ? [warn(`skipped=${skippedPaths.map((entry) => shortenHomePath(entry)).join(", ")}`)] : []
				] : [],
				...opts.grounded ? [muted(`groundedInputs=${groundedInputPaths.length > 0 ? groundedInputPaths.map((entry) => shortenHomePath(entry)).join(", ") : "none"}`)] : [],
				muted(`recentRecallEntries=${preview.recallEntryCount} deepCandidates=${deepCandidates.length}`),
				"",
				heading("REM Preview"),
				...remPreview.bodyLines,
				...groundedPreview ? [
					"",
					heading("Grounded REM"),
					...groundedPreview.files.flatMap((file) => [
						muted(file.path),
						file.renderedMarkdown,
						""
					])
				] : [],
				"",
				heading("Deep Candidates"),
				...deepCandidates.length > 0 ? deepCandidates.slice(0, 10).map((candidate) => `${candidate.score.toFixed(3)} ${candidate.snippet} [${shortenHomePath(candidate.path)}:${candidate.startLine}-${candidate.endLine}]`) : ["- No deep candidates."]
			];
			defaultRuntime.log(lines.join("\n"));
		}
	});
}
async function runMemoryRemBackfill(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory rem-backfill",
		options: opts,
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = (await readMemorySearchManagerStatus(manager)).workspaceDir?.trim();
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
					`${heading("REM Backfill")} ${muted("(rollback)")}`,
					muted(`workspace=${shortenHomePath(workspaceDir)}`),
					...diaryRollback ? [muted(`dreamsPath=${shortenHomePath(diaryRollback.dreamsPath)}`), muted(`removedEntries=${diaryRollback.removed}`)] : [],
					...shortTermRollback ? [muted(`shortTermStorePath=${shortenHomePath(shortTermRollback.storePath)}`), muted(`removedShortTermEntries=${shortTermRollback.removed}`)] : []
				].join("\n"));
				return;
			}
			if (!opts.path) throw new Error("Memory rem-backfill requires --path <file-or-dir> unless using --rollback.");
			const { sourceFiles, groundedFiles, written, stagedShortTermEntries, replacedShortTermEntries } = await withHistoricalMemoryWorkspace("rem-backfill", opts.path, async ({ workspaceDir: scratchDir, sourceFiles, workspaceSourceFiles }) => {
				const grounded = await previewGroundedRemMarkdown({
					workspaceDir: scratchDir,
					inputPaths: workspaceSourceFiles
				});
				const sourcePathByScratchRelativePath = new Map(workspaceSourceFiles.map((scratchPath, index) => [path.relative(scratchDir, scratchPath).replace(/\\/g, "/"), sourceFiles[index] ?? scratchPath]));
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
					if (shortTermSeedItems.length > 0) await recordShortTermRecalls({
						workspaceDir,
						query: "__dreaming_grounded_backfill__",
						signalType: "grounded",
						results: shortTermSeedItems,
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
				`${heading("REM Backfill")} ${muted(`(${agentId})`)}`,
				muted(`workspace=${shortenHomePath(workspaceDir)}`),
				muted(`sourcePath=${shortenHomePath(path.resolve(opts.path))}`),
				muted(`historicalFiles=${sourceFiles.length} writtenEntries=${written.written} replacedEntries=${written.replaced}`),
				...opts.stageShortTerm ? [muted(`stagedShortTermEntries=${stagedShortTermEntries} replacedShortTermEntries=${replacedShortTermEntries}`)] : [],
				muted(`dreamsPath=${shortenHomePath(written.dreamsPath)}`)
			].join("\n"));
		}
	});
}
async function listHistoricalDailyFiles(inputPath) {
	const resolvedPath = path.resolve(inputPath);
	let stat;
	try {
		stat = await fs.stat(resolvedPath);
	} catch (err) {
		if (err?.code === "ENOENT") return [];
		throw err;
	}
	if (stat.isFile()) return DAILY_MEMORY_FILENAME_RE.test(path.basename(resolvedPath)) ? [resolvedPath] : [];
	if (!stat.isDirectory()) return [];
	return (await fs.readdir(resolvedPath, { withFileTypes: true })).filter((entry) => entry.isFile() && DAILY_MEMORY_FILENAME_RE.test(entry.name)).map((entry) => path.join(resolvedPath, entry.name)).toSorted((a, b) => path.basename(a).localeCompare(path.basename(b)));
}
async function withHistoricalMemoryWorkspace(command, inputPath, run) {
	const sourceFiles = await listHistoricalDailyFiles(inputPath);
	if (sourceFiles.length === 0) throw new Error(`Memory ${command} found no YYYY-MM-DD.md files at ${shortenHomePath(path.resolve(inputPath))}.`);
	const workspaceDir = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), `openclaw-${command}-`));
	try {
		const memoryDir = path.join(workspaceDir, "memory");
		await fs.mkdir(memoryDir, { recursive: true });
		const workspaceSourceFiles = [];
		for (const filePath of sourceFiles) {
			const destination = path.join(memoryDir, path.basename(filePath));
			await fs.copyFile(filePath, destination);
			workspaceSourceFiles.push(destination);
		}
		return await run({
			workspaceDir,
			sourceFiles,
			workspaceSourceFiles
		});
	} finally {
		await fs.rm(workspaceDir, {
			recursive: true,
			force: true
		});
	}
}
function extractIsoDayFromPath(filePath) {
	return path.basename(filePath).match(DAILY_MEMORY_FILENAME_RE)?.[1] ?? null;
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
		for (const [signals, score, query, signalCount] of [[
			file.memoryImplications,
			.92,
			"__dreaming_grounded_backfill__:lasting-update",
			2
		], [
			file.candidates.filter((candidate) => candidate.lean === "likely_durable"),
			.82,
			"__dreaming_grounded_backfill__:candidate",
			1
		]]) for (const signal of signals) {
			if (!signal.text.trim()) continue;
			const firstRef = signal.refs.find((ref) => ref.trim().length > 0);
			const parsedRef = firstRef ? parseGroundedRef(file.path, firstRef) : null;
			if (!parsedRef) continue;
			const key = `${parsedRef.path}:${parsedRef.startLine}:${parsedRef.endLine}:${query}:${signal.text.toLowerCase()}`;
			if (seen.has(key)) continue;
			seen.add(key);
			items.push({
				source: "memory",
				path: parsedRef.path,
				startLine: parsedRef.startLine,
				endLine: parsedRef.endLine,
				snippet: signal.text,
				score,
				query,
				signalCount,
				...dayBucket ? { dayBucket } : {}
			});
		}
	}
	return items;
}
//#endregion
export { emitMemoryCoreSidecarNotice as a, formatMemoryIndexOutcome as c, resolveMemoryPluginConfig as d, scanMemoryManagerSources as f, resolveForeignMemorySlotOwner as g, readSelectedMemoryProviderStatus as h, runMemorySessionBackfill as i, resolveMemoryAgent as l, withMemoryCommand as m, runMemoryRemBackfill as n, formatAuditCounts as o, syncMemoryWithProgress as p, runMemoryRemHarness as r, formatExtraPaths as s, printSessionBackfillResult as t, resolveMemoryAgentIds as u };
