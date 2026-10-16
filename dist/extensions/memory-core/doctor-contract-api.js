import { o as resolveUserPath } from "../../home-dir-Dc6nN6HB.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "../../record-coerce-TIsquoVR.mjs";
import { w as root } from "../../fs-safe-BUXBSN-4.mjs";
import { n as normalizeAgentId } from "../../agent-id-D1-Q6vR4.mjs";
import { a as reclaimDefinitelyStaleFileLock } from "../../file-lock-CkzOvhYo.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import "../../routing-CEr1aXk1.mjs";
import "../../runtime-doctor-migrations-4UZBewWQ.mjs";
import { n as legacyStateFileExists } from "../../doctor-state-migration-fs-Ch3NmmKk.mjs";
import "../../memory-core-host-engine-fs-Can1vT0D.mjs";
import { c as SHORT_TERM_META_NAMESPACE, f as configureMemoryCoreDreamingState, g as normalizeMemoryCoreWorkspaceKey, i as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE, l as SHORT_TERM_PHASE_SIGNAL_NAMESPACE, r as DREAMING_SESSION_INGESTION_FILES_NAMESPACE, t as DREAMING_DAILY_INGESTION_NAMESPACE, u as SHORT_TERM_RECALL_NAMESPACE, v as readMemoryCoreWorkspaceEntries } from "../../dreaming-state-BHlTqX1G.mjs";
import { n as MANAGED_DREAMING_DECLARATION_KEY, t as classifyDreamingCronJob } from "../../dreaming-cron-classifier-BE1wMvoX.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import crypto from "node:crypto";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region extensions/memory-core/src/migration/doctor-dreaming-cron.ts
async function planDreamingCronRepair(inventory, config) {
	const constants = await import("../../plugin-sdk/memory-core-host-status.js");
	const { resolveMemoryDreamingPluginConfig } = await import("../../plugin-sdk/memory-core-host-runtime-core.js");
	const enabled = constants.resolveMemoryDeepDreamingConfig({
		cfg: config,
		pluginConfig: resolveMemoryDreamingPluginConfig(config)
	}).enabled;
	const changes = [];
	const warnings = [];
	const partitions = /* @__PURE__ */ new Map();
	for (const job of inventory.jobs) {
		if (!job.definition) {
			warnings.push(`Could not inspect cron job ${job.id} in ${job.storeKey}: invalid definition JSON; row retained.`);
			continue;
		}
		const kind = classifyDreamingCronJob(job.definition, constants);
		if (!kind) continue;
		if (kind === "ambiguous") {
			warnings.push(`Dreaming cron job ${job.id} in ${job.storeKey} retains a historical dreaming tag with an authored payload; review its ownership manually. Row retained.`);
			continue;
		}
		if (job.invalidReason) {
			warnings.push(`Dreaming cron job ${job.id} in ${job.storeKey} needs cron repair (${job.invalidReason}); row retained.`);
			continue;
		}
		const entries = partitions.get(job.storeKey) ?? [];
		entries.push({
			job,
			kind
		});
		partitions.set(job.storeKey, entries);
	}
	for (const entries of partitions.values()) {
		if (!enabled) {
			changes.push(...entries.map(({ job }) => ({
				job,
				definition: null
			})));
			continue;
		}
		const survivor = entries.toSorted((left, right) => {
			if (left.kind !== right.kind) {
				const priority = {
					declared: 0,
					legacy: 1,
					phase: 2
				};
				return priority[left.kind] - priority[right.kind];
			}
			const leftCreated = left.job.definition?.createdAtMs;
			const rightCreated = right.job.definition?.createdAtMs;
			const ageOrder = (typeof leftCreated === "number" ? leftCreated : Number.MAX_SAFE_INTEGER) - (typeof rightCreated === "number" ? rightCreated : Number.MAX_SAFE_INTEGER);
			if (ageOrder !== 0) return ageOrder;
			return left.job.id.localeCompare(right.job.id);
		})[0];
		if (!survivor?.job.definition) continue;
		const raw = survivor.job.definition;
		const definition = {
			...raw,
			declarationKey: MANAGED_DREAMING_DECLARATION_KEY
		};
		const payload = isRecord(raw.payload) ? raw.payload : {};
		const delivery = isRecord(raw.delivery) ? raw.delivery : {};
		definition.sessionTarget = "isolated";
		if (payload.kind !== "agentTurn" || survivor.kind === "phase") {
			const { text: _legacyText, ...retainedPayload } = payload;
			definition.payload = {
				...retainedPayload,
				kind: "agentTurn",
				message: constants.MEMORY_DREAMING_SYSTEM_EVENT_TEXT,
				lightContext: true
			};
		} else definition.payload = {
			...payload,
			lightContext: true
		};
		definition.delivery = {
			...delivery,
			mode: "none"
		};
		if (survivor.kind === "phase") {
			if (raw.name === constants.LEGACY_MEMORY_LIGHT_DREAMING_CRON_NAME || raw.name === constants.LEGACY_MEMORY_REM_DREAMING_CRON_NAME) definition.name = constants.MANAGED_MEMORY_DREAMING_CRON_NAME;
			if (typeof raw.description === "string") definition.description = raw.description.replace(constants.LEGACY_MEMORY_LIGHT_DREAMING_CRON_TAG, constants.MANAGED_MEMORY_DREAMING_CRON_TAG).replace(constants.LEGACY_MEMORY_REM_DREAMING_CRON_TAG, constants.MANAGED_MEMORY_DREAMING_CRON_TAG);
		}
		if (!isDeepStrictEqual(definition, raw)) changes.push({
			job: survivor.job,
			definition
		});
		for (const { job } of entries) if (job.id !== survivor.job.id) changes.push({
			job,
			definition: null
		});
	}
	return {
		changes,
		warnings,
		enabled
	};
}
function deferredCronInspection(error) {
	return `Dreaming cron inspection remains pending; existing cron rows were retained. Retry with "openclaw doctor --fix". ${String(error)}`;
}
const dreamingCronMigration = {
	id: "memory-core-dreaming-cron",
	label: "memory-core dreaming cron ownership",
	doctorOnly: true,
	phase: "after-session-repair",
	collectBackupResources: () => [],
	async detectLegacyState({ context, config }) {
		if (!context.inspectCronJobs) return null;
		let inventory;
		try {
			inventory = await context.inspectCronJobs();
		} catch (error) {
			return { preview: [deferredCronInspection(error)] };
		}
		const plan = await planDreamingCronRepair(inventory, config);
		const preview = [...plan.changes.length ? [`Repair ${plan.changes.length} historical dreaming cron row(s) after a verified SQLite backup.`] : [], ...plan.warnings];
		return preview.length ? { preview } : null;
	},
	async migrateLegacyState({ context, config }) {
		if (!context.inspectCronJobs || !context.repairCronJobs) return {
			changes: [],
			warnings: ["Dreaming cron repair requires a host with offline Doctor cron maintenance support."],
			warningDisposition: "recoverable"
		};
		let inventory;
		try {
			inventory = await context.inspectCronJobs();
		} catch (error) {
			return {
				changes: [],
				warnings: [deferredCronInspection(error)],
				warningDisposition: "recoverable"
			};
		}
		const plan = await planDreamingCronRepair(inventory, config);
		if (!plan.changes.length) return {
			changes: [],
			warnings: plan.warnings,
			warningDisposition: "recoverable"
		};
		const result = await context.repairCronJobs(inventory, plan.changes);
		return {
			changes: result.changed ? [plan.enabled ? `Repaired ${result.changed} historical dreaming cron row(s); survivor IDs, order, and runtime state preserved. SQLite backup: ${result.backupPath}.` : `Retired ${result.changed} managed dreaming cron row(s) because dreaming is disabled. SQLite backup: ${result.backupPath}.`] : [],
			warnings: plan.warnings,
			warningDisposition: "recoverable"
		};
	}
};
//#endregion
//#region extensions/memory-core/src/migration/doctor-workspaces.ts
async function resolveConfiguredWorkspaces(config, env) {
	const { resolveMemoryDreamingWorkspaces } = await import("../../plugin-sdk/memory-core-host-status.js");
	return resolveMemoryDreamingWorkspaces(config, { env }).map((entry) => entry.workspaceDir);
}
//#endregion
//#region extensions/memory-core/src/migration/doctor-dreaming-state.ts
const RETIRED_DREAMING_SOURCES = [
	{
		label: "daily ingestion",
		fileName: "daily-ingestion.json",
		namespaces: [DREAMING_DAILY_INGESTION_NAMESPACE]
	},
	{
		label: "session ingestion",
		fileName: "session-ingestion.json",
		namespaces: [DREAMING_SESSION_INGESTION_FILES_NAMESPACE, DREAMING_SESSION_INGESTION_SEEN_NAMESPACE]
	},
	{
		label: "short-term recall",
		fileName: "short-term-recall.json",
		namespaces: [SHORT_TERM_RECALL_NAMESPACE],
		metaKey: "recall"
	},
	{
		label: "phase signals",
		fileName: "phase-signals.json",
		namespaces: [SHORT_TERM_PHASE_SIGNAL_NAMESPACE],
		metaKey: "phase"
	}
];
async function unsupportedDreamingSources(params) {
	configureMemoryCoreDreamingState(params.context.openPluginStateKeyedStore);
	const warnings = [];
	for (const workspaceDir of await resolveConfiguredWorkspaces(params.config, params.env)) {
		const sources = [];
		for (const source of RETIRED_DREAMING_SOURCES) {
			const filePath = path.join(workspaceDir, "memory", ".dreams", source.fileName);
			if (await legacyStateFileExists(filePath)) sources.push({
				...source,
				filePath
			});
		}
		if (sources.length === 0) continue;
		const acknowledgements = await readMemoryCoreWorkspaceEntries({
			namespace: "legacy-dreaming-source-acknowledgements",
			workspaceDir
		});
		const metadata = await readMemoryCoreWorkspaceEntries({
			namespace: SHORT_TERM_META_NAMESPACE,
			workspaceDir
		});
		for (const source of sources) {
			if (acknowledgements.some((entry) => entry.key === `legacy-source:${source.label}`) || source.metaKey && metadata.some((entry) => entry.key === source.metaKey)) continue;
			if ((await Promise.all(source.namespaces.map((namespace) => readMemoryCoreWorkspaceEntries({
				namespace,
				workspaceDir
			})))).some((rows) => rows.length > 0)) continue;
			warnings.push(`Memory Core ${source.label}: upgrades from pre-July-2026 dreaming JSON are no longer migrated (${source.filePath}). No canonical SQLite state was found; an empty ingestion store cannot be distinguished from unmigrated state. Restore a backup produced by a July 2026 or newer release, or back up and move this retired file aside after verifying the SQLite state, then rerun openclaw doctor --fix. The file was left unchanged.`);
		}
	}
	return warnings;
}
const dreamingStateMigration = {
	id: "memory-core-dreams-json-to-sqlite",
	label: "Memory Core unsupported dreaming JSON",
	collectBackupResources: () => [],
	async detectLegacyState(params) {
		const warnings = await unsupportedDreamingSources(params);
		return warnings.length > 0 ? { preview: warnings.map((warning) => `- ${warning}`) } : null;
	},
	async migrateLegacyState(params) {
		return {
			changes: [],
			warnings: await unsupportedDreamingSources(params)
		};
	}
};
//#endregion
//#region extensions/memory-core/src/migration/doctor-host-event-sources.ts
function legacyMemoryHostEventPatterns(relativePath) {
	const baseName = path.basename(relativePath).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	return {
		archivePattern: new RegExp(`^${baseName}\\.migrated(?:\\.([2-9]|[1-9][0-9]+))?$`, "u"),
		claimPattern: new RegExp(`^\\.${baseName}\\.doctor-importing(?:\\.([2-9]|[1-9][0-9]+))?$`, "u")
	};
}
function memoryHostWorkspacePrefix(workspaceDir) {
	return crypto.createHash("sha256").update(normalizeMemoryCoreWorkspaceKey(workspaceDir)).digest("hex").slice(0, 24);
}
async function collectLegacyMemoryHostEventSources(config, env) {
	const { resolveMemoryHostEventLogPath } = await import("../../plugin-sdk/memory-host-events.js");
	const sources = [];
	const seenWorkspaces = /* @__PURE__ */ new Set();
	for (const workspaceDir of await resolveConfiguredWorkspaces(config, env)) {
		let canonicalWorkspaceDir = path.resolve(workspaceDir);
		let filePath = resolveMemoryHostEventLogPath(canonicalWorkspaceDir);
		try {
			const workspaceRoot = await root(workspaceDir, {
				hardlinks: "reject",
				maxBytes: Number.MAX_SAFE_INTEGER,
				mkdir: false,
				symlinks: "reject"
			});
			canonicalWorkspaceDir = workspaceRoot.rootReal;
			if (seenWorkspaces.has(canonicalWorkspaceDir)) continue;
			seenWorkspaces.add(canonicalWorkspaceDir);
			filePath = resolveMemoryHostEventLogPath(canonicalWorkspaceDir);
			const relativePath = path.relative(canonicalWorkspaceDir, filePath);
			const directoryRelativePath = path.dirname(relativePath);
			const { archivePattern, claimPattern } = legacyMemoryHostEventPatterns(relativePath);
			const entries = await fs.readdir(path.join(workspaceRoot.rootReal, directoryRelativePath));
			const candidates = [];
			for (const entry of entries) {
				if (entry === path.basename(relativePath)) {
					candidates.push({
						entry,
						storage: "active",
						generation: void 0
					});
					continue;
				}
				const claim = claimPattern.exec(entry);
				if (claim) {
					candidates.push({
						entry,
						storage: "claim",
						generation: BigInt(claim[1] ?? "1")
					});
					continue;
				}
				const archive = archivePattern.exec(entry);
				if (archive) candidates.push({
					entry,
					storage: "archive",
					generation: BigInt(archive[1] ?? "1")
				});
			}
			candidates.sort((left, right) => {
				if (left.generation === void 0) return 1;
				if (right.generation === void 0) return -1;
				return left.generation < right.generation ? -1 : left.generation > right.generation ? 1 : 0;
			});
			for (const candidate of candidates) {
				const candidateRelativePath = path.join(directoryRelativePath, candidate.entry);
				filePath = path.join(canonicalWorkspaceDir, candidateRelativePath);
				if (!(await workspaceRoot.stat(candidateRelativePath)).isFile) continue;
				const generationKey = (candidate.generation?.toString())?.padStart(20, "0");
				sources.push({
					kind: "ready",
					workspaceDir: canonicalWorkspaceDir,
					filePath,
					relativePath: candidateRelativePath,
					root: workspaceRoot,
					storage: candidate.storage,
					...candidate.storage === "active" ? {} : {
						archiveRelativePath: `${relativePath}.migrated${candidate.generation === 1n ? "" : `.${candidate.generation}`}`,
						generationKey
					}
				});
			}
		} catch (error) {
			const code = error.code;
			if (code === "ENOENT" || code === "ENOTDIR" || code === "not-found") continue;
			if (!seenWorkspaces.has(canonicalWorkspaceDir)) seenWorkspaces.add(canonicalWorkspaceDir);
			sources.push({
				kind: "rejected",
				workspaceDir: canonicalWorkspaceDir,
				filePath,
				reason: `Skipped unsafe Memory Core host event source ${filePath}: ${String(error)}. Check permissions and use regular files and directories inside the workspace, then rerun openclaw doctor --fix. For shared notes, use canonical paths in memory.search.extraPaths; this does not migrate legacy events.`
			});
		}
	}
	return sources;
}
async function resolveMemoryHostEventArchivePath(source) {
	const { resolveMemoryHostEventLogPath } = await import("../../plugin-sdk/memory-host-events.js");
	const activeRelativePath = path.relative(source.workspaceDir, resolveMemoryHostEventLogPath(source.workspaceDir));
	const directoryPath = path.join(source.root.rootReal, path.dirname(activeRelativePath));
	const { archivePattern, claimPattern } = legacyMemoryHostEventPatterns(activeRelativePath);
	let latestGeneration = 0n;
	for (const entry of await fs.readdir(directoryPath)) {
		const match = archivePattern.exec(entry) ?? claimPattern.exec(entry);
		if (!match) continue;
		const generation = BigInt(match[1] ?? "1");
		if (generation > latestGeneration) latestGeneration = generation;
	}
	const generation = latestGeneration + 1n;
	const generationText = generation.toString();
	if (generationText.length > 20) throw new RangeError("Memory Core host event archive generation is too large");
	const generationSuffix = generation === 1n ? "" : `.${generation}`;
	return {
		archiveRelativePath: `${activeRelativePath}.migrated${generationSuffix}`,
		claimRelativePath: path.join(path.dirname(activeRelativePath), `.${path.basename(activeRelativePath)}.doctor-importing${generationSuffix}`),
		generationKey: generationText.padStart(20, "0")
	};
}
//#endregion
//#region extensions/memory-core/src/migration/doctor-host-events.ts
const MEMORY_HOST_EVENTS_NAMESPACE = "memory-host.events";
const MEMORY_HOST_EVENT_CURSORS_NAMESPACE = "memory-host.event-cursors";
const MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS_NAMESPACE = "memory-host.event-migration-checkpoints";
const MAX_MEMORY_HOST_EVENTS = 1e4;
const MAX_MEMORY_HOST_EVENT_CURSORS = 1e3;
const MAX_MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS = 1e4;
const MAX_LEGACY_MEMORY_HOST_EVENT_VALUE_BYTES = 65536;
const LEGACY_MEMORY_HOST_SEQUENCE_BASE = Number.MIN_SAFE_INTEGER;
function memoryHostMigrationCheckpointKey(source) {
	if (!source.generationKey) throw new Error(`Missing Memory Core host event archive generation for ${source.filePath}`);
	return `${memoryHostWorkspacePrefix(source.workspaceDir)}:archive:${source.generationKey}`;
}
function memoryHostMigrationSnapshot(raw, recordCount, sequenceBase) {
	return {
		kind: "migration-checkpoint",
		contentHash: crypto.createHash("sha256").update(raw).digest("hex"),
		recordCount,
		sequenceBase,
		size: Buffer.byteLength(raw, "utf8")
	};
}
function isMemoryHostMigrationCheckpoint(value) {
	return value?.kind === "migration-checkpoint" && typeof value.contentHash === "string" && Number.isSafeInteger(value.recordCount) && value.recordCount >= 0 && Number.isSafeInteger(value.sequenceBase) && Number.isSafeInteger(value.size) && value.size >= 0;
}
async function memoryHostEventSourceNeedsMigration(params) {
	if (params.source.storage !== "archive") return true;
	const checkpoint = await params.context.openPluginStateKeyedStore({
		namespace: MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS_NAMESPACE,
		maxEntries: MAX_MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS,
		overflowPolicy: "reject-new"
	}).lookup(memoryHostMigrationCheckpointKey(params.source));
	if (!isMemoryHostMigrationCheckpoint(checkpoint)) return true;
	const raw = await params.source.root.readText(params.source.relativePath);
	return Buffer.byteLength(raw, "utf8") !== checkpoint.size || crypto.createHash("sha256").update(raw).digest("hex") !== checkpoint.contentHash;
}
async function finalizeLegacyMemoryHostEventSource(params) {
	if (params.source.storage === "archive") return true;
	const archivedRelativePath = params.source.archiveRelativePath;
	if (!archivedRelativePath) throw new Error(`Missing Memory Core host event archive path for ${params.source.filePath}`);
	try {
		await params.source.root.move(params.source.relativePath, archivedRelativePath);
		params.changes.push(`Archived Memory Core host events legacy source -> ${path.join(params.source.workspaceDir, archivedRelativePath)}`);
		return true;
	} catch (error) {
		params.warnings.push(`Failed archiving Memory Core host events legacy source: ${String(error)}`);
		return false;
	}
}
async function restoreClaimedMemoryHostEventSource(params) {
	try {
		if (!await params.source.root.exists(params.source.relativePath)) return;
		if (!await params.source.root.exists(params.activeRelativePath)) {
			await params.source.root.move(params.source.relativePath, params.activeRelativePath);
			return;
		}
		params.warnings.push(`Left claimed Memory Core host events at ${params.source.filePath} because an old writer recreated the active source`);
	} catch (error) {
		params.warnings.push(`Failed restoring claimed Memory Core host events ${params.source.filePath}: ${String(error)}`);
	}
}
async function migrateLegacyMemoryHostEventSource(params) {
	const { normalizeMemoryHostEventRecordForStorage, resolveMemoryHostEventLogPath } = await import("../../plugin-sdk/memory-host-events.js");
	const activeRelativePath = path.relative(params.source.workspaceDir, resolveMemoryHostEventLogPath(params.source.workspaceDir));
	let source = params.source;
	let restoreNewClaim = false;
	let claimFinalized = source.storage === "archive";
	if (source.storage === "active") {
		const generation = await resolveMemoryHostEventArchivePath(source);
		await source.root.move(source.relativePath, generation.claimRelativePath);
		source = {
			...source,
			filePath: path.join(source.workspaceDir, generation.claimRelativePath),
			relativePath: generation.claimRelativePath,
			storage: "claim",
			archiveRelativePath: generation.archiveRelativePath,
			generationKey: generation.generationKey
		};
		restoreNewClaim = true;
	}
	try {
		if (!source.generationKey) throw new Error(`Missing Memory Core host event generation for ${source.filePath}`);
		const warningStart = params.warnings.length;
		const raw = await source.root.readText(source.relativePath);
		const prefix = memoryHostWorkspacePrefix(source.workspaceDir);
		const records = [];
		for (const [lineIndex, line] of raw.split(/\r?\n/u).entries()) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			let event;
			try {
				event = JSON.parse(trimmed);
			} catch (error) {
				params.warnings.push(`Skipped malformed Memory Core host event at ${source.filePath}:${lineIndex + 1}: ${String(error)}`);
				continue;
			}
			const normalizedEvent = normalizeMemoryHostEventRecordForStorage(event);
			if (!normalizedEvent) {
				params.warnings.push(`Skipped invalid Memory Core host event at ${source.filePath}:${lineIndex + 1}`);
				continue;
			}
			const canonicalEvent = JSON.stringify(normalizedEvent);
			const parsedTimestamp = Date.parse(normalizedEvent.timestamp);
			const recordedAt = Number.isSafeInteger(parsedTimestamp) ? parsedTimestamp : 0;
			const ordinal = records.length;
			const digest = crypto.createHash("sha256").update(canonicalEvent).digest("hex");
			const value = {
				kind: "event",
				event: normalizedEvent,
				recordedAt,
				sequence: LEGACY_MEMORY_HOST_SEQUENCE_BASE + ordinal + 1
			};
			if (Buffer.byteLength(JSON.stringify(value), "utf8") > MAX_LEGACY_MEMORY_HOST_EVENT_VALUE_BYTES) {
				params.warnings.push(`Skipped oversized Memory Core host event at ${source.filePath}:${lineIndex + 1}`);
				continue;
			}
			records.push({
				digest,
				ordinal,
				value
			});
		}
		if (params.warnings.length > warningStart) {
			params.warnings.push("Left Memory Core host events legacy source in place because invalid rows still require repair");
			return "blocked";
		}
		const checkpointStore = params.context.openPluginStateKeyedStore({
			namespace: MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS,
			overflowPolicy: "reject-new"
		});
		const checkpointKey = memoryHostMigrationCheckpointKey(source);
		const checkpointValue = await checkpointStore.lookup(checkpointKey);
		const previousCheckpoint = isMemoryHostMigrationCheckpoint(checkpointValue) ? checkpointValue : void 0;
		if (source.storage === "archive" && previousCheckpoint) {
			const bytes = Buffer.from(raw, "utf8");
			const prefixHash = crypto.createHash("sha256").update(bytes.subarray(0, previousCheckpoint.size)).digest("hex");
			if (bytes.length < previousCheckpoint.size || prefixHash !== previousCheckpoint.contentHash || records.length < previousCheckpoint.recordCount) {
				params.warnings.push(`Skipped Memory Core host event recovery because ${source.filePath} changed other than by append; left the archive in place`);
				return "warning";
			}
		}
		const firstCandidateOrdinal = source.storage === "archive" && previousCheckpoint ? previousCheckpoint.recordCount : 0;
		const candidateRecords = records.slice(firstCandidateOrdinal);
		const store = params.context.openPluginStateKeyedStore({
			namespace: MEMORY_HOST_EVENTS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENTS
		});
		const existingEntries = await store.entries();
		const existingKeys = new Set(existingEntries.map((entry) => entry.key));
		const latestLegacySequence = existingEntries.reduce((latest, entry) => entry.value.sequence < 0 ? Math.max(latest, entry.value.sequence) : latest, LEGACY_MEMORY_HOST_SEQUENCE_BASE);
		const legacyKeyPrefix = `${prefix}:event:0:s:`;
		const existingByIdentity = new Map(existingEntries.flatMap((entry) => {
			if (!entry.key.startsWith(legacyKeyPrefix) || entry.value.sequence >= 0) return [];
			const parts = entry.key.split(":");
			return parts.length === 8 ? [[`${parts[5]}:${parts[6]}:${parts[7]}`, entry]] : [];
		}));
		const existingSourceBase = candidateRecords.flatMap((record) => {
			const identity = `${source.generationKey}:${record.ordinal.toString().padStart(16, "0")}:${record.digest}`;
			const existing = existingByIdentity.get(identity);
			return existing ? [existing.value.sequence - (record.ordinal + 1)] : [];
		})[0];
		const laterGenerationExists = existingEntries.some((entry) => {
			if (!entry.key.startsWith(legacyKeyPrefix) || entry.value.sequence >= 0) return false;
			const generationKey = entry.key.split(":")[5];
			return generationKey !== void 0 && generationKey > source.generationKey;
		});
		if (source.storage === "archive" && !previousCheckpoint && existingSourceBase === void 0 && laterGenerationExists) {
			params.warnings.push(`Skipped Memory Core host event recovery because ${source.filePath} has no durable checkpoint and later generations are already imported; left the archive in place`);
			return "blocked";
		}
		const sourceSequenceBase = previousCheckpoint?.sequenceBase ?? existingSourceBase ?? latestLegacySequence;
		let nextSequence = latestLegacySequence;
		const sequencedRecords = candidateRecords.map((record) => {
			const ordinalKey = record.ordinal.toString().padStart(16, "0");
			const identity = `${source.generationKey}:${ordinalKey}:${record.digest}`;
			const existing = existingByIdentity.get(identity);
			if (existing) return {
				...record,
				key: existing.key,
				value: {
					...record.value,
					sequence: existing.value.sequence
				}
			};
			const sequence = previousCheckpoint ? nextSequence += 1 : sourceSequenceBase + record.ordinal + 1;
			const sequenceKey = (sequence - LEGACY_MEMORY_HOST_SEQUENCE_BASE).toString().padStart(16, "0");
			return {
				...record,
				key: `${legacyKeyPrefix}${sequenceKey}:${identity}`,
				value: {
					...record.value,
					sequence
				}
			};
		});
		const sourceKeys = new Set(sequencedRecords.map((record) => record.key));
		if (sequencedRecords.some((record) => !Number.isSafeInteger(record.value.sequence) || record.value.sequence >= 0)) {
			params.warnings.push("Skipped Memory Core host event migration because legacy sequence capacity is exhausted; left legacy source in place");
			return "blocked";
		}
		const nativeCount = existingEntries.filter((entry) => entry.value.sequence >= 0).length;
		const legacyRetentionLimit = Math.max(0, MAX_MEMORY_HOST_EVENTS - nativeCount);
		const combinedLegacy = [...existingEntries.filter((entry) => entry.value.sequence < 0 && !sourceKeys.has(entry.key)).map((entry) => ({
			key: entry.key,
			sequence: entry.value.sequence
		})), ...sequencedRecords.map((record) => ({
			key: record.key,
			sequence: record.value.sequence
		}))].toSorted((left, right) => left.sequence - right.sequence || left.key.localeCompare(right.key));
		const desiredLegacyKeys = new Set(legacyRetentionLimit === 0 ? [] : combinedLegacy.slice(-legacyRetentionLimit).map((record) => record.key));
		let retainedRecords = sequencedRecords.filter((record) => desiredLegacyKeys.has(record.key));
		const capacity = params.context.getPluginStateCapacity?.();
		if (!capacity) {
			params.warnings.push("Skipped Memory Core host event migration because plugin-wide SQLite capacity is unavailable; left legacy source in place");
			return "blocked";
		}
		const pluginRemainingCapacity = Math.max(0, capacity.maxEntries - capacity.liveEntries);
		const cursorStore = params.context.openPluginStateKeyedStore({
			namespace: MEMORY_HOST_EVENT_CURSORS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENT_CURSORS
		});
		const cursorKey = `${prefix}:cursor`;
		const existingCursor = await cursorStore.lookup(cursorKey);
		const cursorCapacity = candidateRecords.length > 0 && existingCursor?.kind !== "cursor" ? 1 : 0;
		if (cursorCapacity > pluginRemainingCapacity) {
			params.warnings.push("Skipped Memory Core host event migration because SQLite plugin state has no room for its workspace cursor; left legacy source in place");
			return "blocked";
		}
		const checkpointCapacity = checkpointValue ? 0 : 1;
		if (checkpointCapacity > 0 && (checkpointStore.count ? await checkpointStore.count() : (await checkpointStore.entries()).length) >= MAX_MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS) {
			params.warnings.push("Skipped Memory Core host event migration because durable raw-archive checkpoint capacity is exhausted; left legacy source in place");
			return "blocked";
		}
		if (cursorCapacity + checkpointCapacity > pluginRemainingCapacity) {
			params.warnings.push("Skipped Memory Core host event migration because SQLite plugin state has no room for its raw-archive checkpoint; left legacy source in place");
			return "blocked";
		}
		const importEntries = params.context.importPluginStateEntries;
		if (candidateRecords.length > 0 && !importEntries) {
			params.warnings.push("Skipped Memory Core host event migration because retention-aware SQLite import is unavailable; left legacy source in place");
			return "blocked";
		}
		let retainedKeys = new Set(retainedRecords.map((record) => record.key));
		let missing = retainedRecords.filter((record) => !existingKeys.has(record.key));
		let replaceableLegacyRows = existingEntries.filter((entry) => entry.value.sequence < 0 && !retainedKeys.has(entry.key)).length;
		const reservedCapacity = cursorCapacity + checkpointCapacity;
		const eventCapacity = pluginRemainingCapacity - reservedCapacity + replaceableLegacyRows;
		const retentionDeficit = Math.max(0, missing.length - eventCapacity);
		if (retentionDeficit > 0) {
			retainedRecords = retainedRecords.slice(Math.min(retentionDeficit, retainedRecords.length));
			retainedKeys = new Set(retainedRecords.map((record) => record.key));
			missing = retainedRecords.filter((record) => !existingKeys.has(record.key));
			replaceableLegacyRows = existingEntries.filter((entry) => entry.value.sequence < 0 && !retainedKeys.has(entry.key)).length;
		}
		const availableEventCapacity = pluginRemainingCapacity - reservedCapacity + replaceableLegacyRows;
		if (missing.length > availableEventCapacity) {
			params.warnings.push(`Skipped Memory Core host event migration because SQLite plugin state has room for ${availableEventCapacity} of ${missing.length} missing rows after reserving its cursor and raw-archive checkpoint; left legacy source in place`);
			return "blocked";
		}
		if (cursorCapacity > 0) {
			const lastSequence = existingEntries.reduce((maximum, entry) => Number.isSafeInteger(entry.value.sequence) ? Math.max(maximum, entry.value.sequence) : maximum, 0);
			await cursorStore.register(cursorKey, {
				kind: "cursor",
				lastSequence
			});
			if ((await cursorStore.lookup(cursorKey))?.kind !== "cursor") {
				params.warnings.push("Skipped Memory Core host event migration because its workspace cursor could not be verified; left legacy source in place");
				return "blocked";
			}
		}
		importEntries?.({
			namespace: MEMORY_HOST_EVENTS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENTS
		}, missing.map((record) => ({
			key: record.key,
			value: record.value,
			createdAt: record.value.sequence
		})));
		const importedKeys = new Set((await store.entries()).map((entry) => entry.key));
		const missingKey = retainedRecords.find((record) => !importedKeys.has(record.key))?.key;
		if (missingKey) {
			params.warnings.push(`Skipped archiving Memory Core host events because SQLite verification missed ${missingKey}`);
			return "blocked";
		}
		if (source.storage === "archive") {
			if (missing.length > 0) params.changes.push(`Recovered ${missing.length} later Memory Core host event row(s) from ${source.filePath}`);
		} else {
			params.changes.push(records.length === 0 ? "Retired empty Memory Core host events legacy source" : `Migrated Memory Core host events -> SQLite plugin state (${missing.length} new row(s))`);
			claimFinalized = await finalizeLegacyMemoryHostEventSource({
				source,
				changes: params.changes,
				warnings: params.warnings
			});
			if (!claimFinalized) {
				params.changes.pop();
				return "blocked";
			}
		}
		const checkpoint = memoryHostMigrationSnapshot(raw, records.length, sourceSequenceBase);
		await checkpointStore.register(checkpointKey, checkpoint);
		const registeredCheckpoint = await checkpointStore.lookup(checkpointKey);
		if (!isMemoryHostMigrationCheckpoint(registeredCheckpoint) || registeredCheckpoint.contentHash !== checkpoint.contentHash || registeredCheckpoint.recordCount !== checkpoint.recordCount || registeredCheckpoint.sequenceBase !== checkpoint.sequenceBase || registeredCheckpoint.size !== checkpoint.size) {
			params.warnings.push(`Failed verifying Memory Core host event raw-archive checkpoint for ${source.filePath}`);
			return "blocked";
		}
		if (source.storage !== "archive" && await source.root.exists(activeRelativePath)) params.warnings.push("An old writer recreated the Memory Core host event source; rerun openclaw doctor --fix to import the retained rows");
		return "completed";
	} finally {
		if (restoreNewClaim && !claimFinalized) await restoreClaimedMemoryHostEventSource({
			source,
			activeRelativePath,
			warnings: params.warnings
		});
	}
}
const hostEventsStateMigration = {
	id: "memory-core-host-events-jsonl-to-sqlite",
	label: "Memory Core host events",
	doctorOnly: true,
	async collectBackupResources(params) {
		const sources = await collectLegacyMemoryHostEventSources(params.config, params.env);
		const resources = [];
		for (const source of sources) {
			if (source.kind !== "ready") continue;
			resources.push({
				path: source.filePath,
				kind: "file"
			});
			if (source.storage === "active") {
				const generation = await resolveMemoryHostEventArchivePath(source);
				resources.push({
					path: path.join(source.workspaceDir, generation.claimRelativePath),
					kind: "file"
				}, {
					path: path.join(source.workspaceDir, generation.archiveRelativePath),
					kind: "file"
				});
			} else if (source.archiveRelativePath) resources.push({
				path: path.join(source.workspaceDir, source.archiveRelativePath),
				kind: "file"
			});
		}
		return resources;
	},
	async detectLegacyState(params) {
		const sources = await collectLegacyMemoryHostEventSources(params.config, params.env);
		const pending = [];
		for (const source of sources) if (source.kind === "rejected" || await memoryHostEventSourceNeedsMigration({
			source,
			context: params.context
		})) pending.push(source);
		if (pending.length === 0) return null;
		return { preview: pending.map((source) => source.kind === "ready" ? `- Memory Core host events: ${source.filePath} -> SQLite plugin state (${MEMORY_HOST_EVENTS_NAMESPACE})` : `- ${source.reason}`) };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		let advisoryWarningCount = 0;
		const blockedWorkspaces = /* @__PURE__ */ new Set();
		for (const source of await collectLegacyMemoryHostEventSources(params.config, params.env)) {
			if (blockedWorkspaces.has(source.workspaceDir)) continue;
			if (source.kind === "rejected") {
				warnings.push(source.reason);
				blockedWorkspaces.add(source.workspaceDir);
				continue;
			}
			if (!await memoryHostEventSourceNeedsMigration({
				source,
				context: params.context
			})) continue;
			const warningStart = warnings.length;
			const result = await migrateLegacyMemoryHostEventSource({
				source,
				context: params.context,
				changes,
				warnings
			});
			if (result === "warning") advisoryWarningCount += warnings.length - warningStart;
			if (result !== "completed") blockedWorkspaces.add(source.workspaceDir);
		}
		return {
			changes,
			warnings,
			...warnings.length > 0 && advisoryWarningCount === warnings.length ? { warningDisposition: "recoverable" } : {}
		};
	}
};
//#endregion
//#region extensions/memory-core/src/migration/doctor-memory-sidecar.ts
const LEGACY_MEMORY_SIDECAR_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
async function existingLegacySidecarPaths(basePath) {
	return (await Promise.all(LEGACY_MEMORY_SIDECAR_SUFFIXES.map(async (suffix) => {
		const filePath = `${basePath}${suffix}`;
		return await legacyStateFileExists(filePath) ? filePath : null;
	}))).filter((filePath) => filePath !== null);
}
function formatLegacyVectorRows(count) {
	return count === void 0 ? "legacy vector rows" : `${count} vector row(s)`;
}
function resolveConfiguredAgentIds(config) {
	const agents = asOptionalObjectRecord(asOptionalObjectRecord(config)?.agents);
	const entries = asOptionalObjectRecord(agents?.entries);
	const listedIds = (Object.prototype.propertyIsEnumerable.call(agents ?? {}, "list") && Array.isArray(agents?.list) ? agents.list : []).flatMap((entry) => {
		const id = asOptionalObjectRecord(entry)?.id;
		return typeof id === "string" ? [id] : [];
	});
	const ids = new Set([...Object.keys(entries ?? {}), ...listedIds].map(normalizeAgentId));
	return ids.size > 0 ? [...ids] : [normalizeAgentId(void 0)];
}
function readAgentMemorySearch(config, agentId) {
	const agents = asOptionalObjectRecord(asOptionalObjectRecord(config)?.agents);
	const keyedEntries = asOptionalObjectRecord(agents?.entries);
	const keyedEntry = keyedEntries ? Object.entries(keyedEntries).find(([id]) => normalizeAgentId(id) === agentId)?.[1] : void 0;
	const keyedSearch = asOptionalObjectRecord(asOptionalObjectRecord(asOptionalObjectRecord(keyedEntry)?.memory)?.search);
	if (keyedSearch) return keyedSearch;
	const entry = (Object.prototype.propertyIsEnumerable.call(agents ?? {}, "list") && Array.isArray(agents?.list) ? agents.list : []).map(asOptionalObjectRecord).find((candidate) => normalizeAgentId(typeof candidate?.id === "string" ? candidate.id : void 0) === agentId);
	return asOptionalObjectRecord(asOptionalObjectRecord(entry?.memory)?.search);
}
function readMemorySearchLayers(config, agentId) {
	const cfg = asOptionalObjectRecord(config);
	return [
		readAgentMemorySearch(config, agentId),
		asOptionalObjectRecord(asOptionalObjectRecord(cfg?.memory)?.search),
		asOptionalObjectRecord(cfg?.memorySearch)
	].filter((value) => value !== void 0);
}
function readStoreLayers(searchLayers) {
	return searchLayers.flatMap((search) => {
		const store = asOptionalObjectRecord(search.store);
		return store ? [store] : [];
	});
}
function firstDefined(layers, key) {
	return layers.find((layer) => layer[key] !== void 0)?.[key];
}
function readMemorySearchMigrationOptions(config, agentId) {
	const searchLayers = readMemorySearchLayers(config, agentId);
	const stores = readStoreLayers(searchLayers);
	const nestedOption = (section, key) => stores.map((store) => asOptionalObjectRecord(store[section])?.[key]).find((value) => value !== void 0);
	const tokenizer = nestedOption("fts", "tokenizer");
	const provider = firstDefined(searchLayers, "provider");
	const enabled = nestedOption("vector", "enabled");
	const extensionPath = nestedOption("vector", "extensionPath");
	return {
		ftsTokenizer: tokenizer === "unicode61" || tokenizer === "trigram" ? tokenizer : void 0,
		vectorEnabled: !(typeof provider === "string" && provider.trim() === "none") && (typeof enabled === "boolean" ? enabled : true),
		vectorExtensionPath: typeof extensionPath === "string" && extensionPath.trim() ? extensionPath.trim() : void 0
	};
}
function readLegacyMemorySearchStorePaths(config, agentId) {
	return [...new Set(readStoreLayers(readMemorySearchLayers(config, agentId)).flatMap((store) => typeof store.path === "string" && store.path.trim() ? [store.path.trim()] : []))];
}
async function isCanonicalAgentDatabaseSymlink(params) {
	try {
		if (!(await fs.lstat(params.legacyPath)).isSymbolicLink()) return false;
		for (const suffix of LEGACY_MEMORY_SIDECAR_SUFFIXES.slice(1)) try {
			await fs.lstat(`${params.legacyPath}${suffix}`);
			return false;
		} catch (err) {
			if (!err || typeof err !== "object" || !("code" in err) || err.code !== "ENOENT") return false;
		}
		const [legacyTarget, canonicalTarget] = await Promise.all([fs.realpath(params.legacyPath), fs.realpath(params.agentDatabasePath)]);
		return legacyTarget === canonicalTarget;
	} catch {
		return false;
	}
}
async function collectLegacyMemorySidecarSources(params) {
	const agentIds = new Set(resolveConfiguredAgentIds(params.config));
	const legacyDir = path.join(params.stateDir, "memory");
	const retrySidecars = [];
	try {
		const entries = await fs.readdir(legacyDir, { withFileTypes: true });
		for (const entry of entries) if (entry.isFile() && entry.name.endsWith(".sqlite")) {
			const stem = entry.name.slice(0, -7);
			const retryIndex = stem.indexOf(".retry-");
			const rawAgentId = retryIndex === -1 ? stem : stem.slice(0, retryIndex);
			const agentId = normalizeAgentId(rawAgentId);
			if (retryIndex !== -1 && rawAgentId === agentId && agentIds.has(agentId)) retrySidecars.push({
				agentId,
				legacyPath: path.join(legacyDir, entry.name)
			});
		}
	} catch {}
	const migrationEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const sources = [];
	const seen = /* @__PURE__ */ new Set();
	async function addSource(agentId, legacyPath) {
		const normalizedPath = path.resolve(legacyPath);
		const key = `${agentId}\0${normalizedPath}`;
		if (seen.has(key) || !await legacyStateFileExists(normalizedPath)) return;
		seen.add(key);
		const { resolveOpenClawAgentSqlitePath } = await import("../../plugin-sdk/sqlite-runtime.js");
		const agentDatabasePath = resolveOpenClawAgentSqlitePath({
			agentId,
			env: migrationEnv
		});
		if (await isCanonicalAgentDatabaseSymlink({
			legacyPath: normalizedPath,
			agentDatabasePath
		})) return;
		sources.push({
			agentId,
			legacyPath: normalizedPath,
			stateDir: params.stateDir,
			agentDatabasePath
		});
	}
	for (const agentId of agentIds) {
		for (const configuredPath of readLegacyMemorySearchStorePaths(params.config, agentId)) await addSource(agentId, resolveUserPath(configuredPath.replaceAll("{agentId}", agentId), migrationEnv));
		await addSource(agentId, path.join(legacyDir, `${agentId}.sqlite`));
	}
	for (const retrySidecar of retrySidecars) await addSource(retrySidecar.agentId, retrySidecar.legacyPath);
	return sources;
}
async function archiveLegacyMemorySidecar(params) {
	const existingSources = await existingLegacySidecarPaths(params.source.legacyPath);
	if (existingSources.length === 0) return;
	const existingArchives = (await Promise.all(existingSources.map(async (sourcePath) => {
		const archivedPath = `${sourcePath}.migrated`;
		return await legacyStateFileExists(archivedPath) ? archivedPath : null;
	}))).filter((filePath) => filePath !== null);
	if (existingArchives.length > 0) {
		params.warnings.push(`Left migrated Memory Core legacy memory index sidecar in place because ${existingArchives[0]} already exists`);
		return;
	}
	const renamed = [];
	for (const sourcePath of existingSources) {
		const archivedPath = `${sourcePath}.migrated`;
		try {
			await fs.rename(sourcePath, archivedPath);
			renamed.push({
				sourcePath,
				archivedPath
			});
		} catch (err) {
			for (const entry of renamed.toReversed()) try {
				if (await legacyStateFileExists(entry.archivedPath) && !await legacyStateFileExists(entry.sourcePath)) await fs.rename(entry.archivedPath, entry.sourcePath);
			} catch (rollbackErr) {
				params.warnings.push(`Failed restoring Memory Core legacy memory index sidecar ${entry.archivedPath}: ${String(rollbackErr)}`);
			}
			params.warnings.push(`Failed archiving Memory Core legacy memory index sidecar ${sourcePath}: ${String(err)}; restored ${renamed.length} already archived file(s)`);
			return;
		}
	}
	params.changes.push(`Archived Memory Core legacy memory index sidecar -> ${params.source.legacyPath}.migrated`);
}
async function preserveLegacyMemorySidecarRetryPath(params) {
	const retryPath = path.join(params.source.stateDir, "memory", `${params.source.agentId}.sqlite`);
	if (path.resolve(retryPath) === path.resolve(params.source.legacyPath)) return;
	const resolvedSourcePath = path.resolve(params.source.legacyPath);
	const sourceName = path.basename(resolvedSourcePath);
	if (path.dirname(resolvedSourcePath) === path.resolve(params.source.stateDir, "memory") && sourceName.startsWith(`${params.source.agentId}.retry-`) && sourceName.endsWith(".sqlite")) return;
	const targetBasePath = (await existingLegacySidecarPaths(retryPath)).length === 0 ? retryPath : path.join(params.source.stateDir, "memory", `${params.source.agentId}.retry-${crypto.createHash("sha256").update(path.resolve(params.source.legacyPath)).digest("hex").slice(0, 12)}.sqlite`);
	if (await legacyStateFileExists(targetBasePath)) return;
	const existingSources = (await existingLegacySidecarPaths(params.source.legacyPath)).map((sourcePath) => ({
		sourcePath,
		targetPath: `${targetBasePath}${sourcePath.slice(params.source.legacyPath.length)}`
	}));
	if (existingSources.length === 0) return;
	await fs.mkdir(path.dirname(targetBasePath), { recursive: true });
	const copied = [];
	try {
		for (const entry of existingSources) {
			await fs.copyFile(entry.sourcePath, entry.targetPath, fs.constants.COPYFILE_EXCL);
			copied.push(entry.targetPath);
		}
	} catch (err) {
		for (const targetPath of copied) try {
			await fs.rm(targetPath, { force: true });
		} catch {}
		params.warnings.push(`Failed copying Memory Core legacy memory index sidecar retry path ${params.source.legacyPath} -> ${retryPath}: ${String(err)}`);
		return;
	}
	params.changes.push(`Copied Memory Core legacy memory index sidecar retry path -> ${targetBasePath}`);
}
/**
* List the sidecar files when every persisted byte is absent: the main file is
* zero bytes and no WAL/journal sidecar holds content. Returns null when any
* file carries bytes, because WAL frames alone can contain legacy rows.
*/
async function listEmptyLegacySidecarFiles(legacyPath) {
	const emptyFiles = [];
	for (const suffix of LEGACY_MEMORY_SIDECAR_SUFFIXES) {
		const candidate = `${legacyPath}${suffix}`;
		try {
			const stat = await fs.stat(candidate);
			if (!stat.isFile()) continue;
			if (stat.size > 0) return null;
			emptyFiles.push(candidate);
		} catch (err) {
			if (err.code !== "ENOENT") return null;
		}
	}
	return emptyFiles.length > 0 ? emptyFiles : null;
}
async function migrateLegacyMemorySidecarSource(params) {
	const emptySidecarFiles = await listEmptyLegacySidecarFiles(params.source.legacyPath);
	if (emptySidecarFiles) {
		let removedAll = true;
		for (const emptyPath of emptySidecarFiles) try {
			await fs.rm(emptyPath, { force: true });
		} catch {
			removedAll = false;
		}
		if (removedAll) {
			params.changes.push(`Removed empty Memory Core legacy memory index sidecar placeholder: ${params.source.legacyPath}`);
			return { archiveReady: false };
		}
	}
	const { importLegacyMemorySidecarIndex, LegacyMemoryDerivedRowsConflictError } = await import("../../doctor-memory-sidecar-import-BHhCGtbx.mjs");
	const { ensureMemoryIndexSchema, loadSqliteVecExtension } = await import("../../plugin-sdk/memory-core-host-engine-schema.js");
	const { ensureOpenClawAgentDatabaseSchema, openNodeSqliteDatabase } = await import("../../plugin-sdk/sqlite-runtime.js");
	await fs.mkdir(path.dirname(params.source.agentDatabasePath), { recursive: true });
	const db = openNodeSqliteDatabase(params.source.agentDatabasePath, { allowExtension: true });
	try {
		const migrationEnv = {
			...params.env,
			OPENCLAW_STATE_DIR: params.source.stateDir
		};
		ensureOpenClawAgentDatabaseSchema(db, {
			agentId: params.source.agentId,
			env: migrationEnv,
			path: params.source.agentDatabasePath,
			register: true
		});
		const { ftsTokenizer, vectorEnabled, vectorExtensionPath } = readMemorySearchMigrationOptions(params.config, params.source.agentId);
		ensureMemoryIndexSchema({
			db,
			cacheEnabled: true,
			ftsEnabled: true,
			ftsTokenizer
		});
		const loadedVector = vectorEnabled ? await loadSqliteVecExtension({
			db,
			extensionPath: vectorExtensionPath ? resolveUserPath(vectorExtensionPath, params.env) : void 0
		}) : {
			ok: false,
			error: "vector search is disabled"
		};
		let result;
		try {
			result = importLegacyMemorySidecarIndex({
				db,
				legacySidecarDatabasePath: params.source.legacyPath,
				copyVectorRows: vectorEnabled && loadedVector.ok,
				requireVectorRows: vectorEnabled
			});
		} catch (err) {
			if (err instanceof LegacyMemoryDerivedRowsConflictError) {
				params.changes.push(`Resolved Memory Core legacy memory index conflict for agent ${params.source.agentId} by keeping canonical per-agent SQLite rows`);
				return { archiveReady: true };
			}
			await preserveLegacyMemorySidecarRetryPath(params);
			params.warnings.push(`Skipped Memory Core legacy memory index import for agent ${params.source.agentId} because legacy rows could not be imported: ${String(err)}`);
			return { archiveReady: false };
		}
		if (result.reason === "legacy-schema-missing") {
			await preserveLegacyMemorySidecarRetryPath(params);
			params.warnings.push(`Skipped Memory Core legacy memory index import for agent ${params.source.agentId} because the sidecar schema is not a legacy memory index`);
			return { archiveReady: false };
		}
		if (!result.imported) {
			await preserveLegacyMemorySidecarRetryPath(params);
			return { archiveReady: false };
		}
		ensureMemoryIndexSchema({
			db,
			cacheEnabled: true,
			ftsEnabled: true,
			ftsTokenizer
		});
		params.changes.push(`Migrated Memory Core legacy memory index for agent ${params.source.agentId} -> per-agent SQLite (${result.sources} source(s), ${result.chunks} chunk(s), ${result.cacheEntries} cache row(s))`);
		if (!result.vectorEntriesImported) {
			await preserveLegacyMemorySidecarRetryPath(params);
			const vectorReason = loadedVector.ok ? "legacy vector table could not be validated" : loadedVector.error ?? "unknown sqlite-vec load error";
			params.warnings.push(`Left Memory Core legacy memory index sidecar in place for agent ${params.source.agentId} because ${formatLegacyVectorRows(result.vectorEntries)} still require sqlite-vec: ${vectorReason}`);
			return { archiveReady: false };
		}
		return { archiveReady: true };
	} finally {
		db.close();
	}
}
const memorySidecarStateMigration = {
	id: "memory-core-legacy-sidecar-index-to-agent-sqlite",
	label: "Memory Core legacy memory index sidecar",
	async collectBackupResources(params) {
		const sources = await collectLegacyMemorySidecarSources(params);
		const resources = [];
		for (const source of sources) {
			resources.push({
				path: source.agentDatabasePath,
				kind: "sqlite"
			});
			for (const sourcePath of await existingLegacySidecarPaths(source.legacyPath)) resources.push({
				path: sourcePath,
				kind: "file"
			}, {
				path: `${sourcePath}.migrated`,
				kind: "file"
			});
			for (const name of [`${source.agentId}.sqlite`, `${source.agentId}.retry-${crypto.createHash("sha256").update(path.resolve(source.legacyPath)).digest("hex").slice(0, 12)}.sqlite`]) for (const suffix of LEGACY_MEMORY_SIDECAR_SUFFIXES) resources.push({
				path: path.join(params.stateDir, "memory", `${name}${suffix}`),
				kind: "file"
			});
		}
		return resources;
	},
	async detectLegacyState(params) {
		const sources = await collectLegacyMemorySidecarSources(params);
		if (sources.length === 0) return null;
		return { preview: sources.map((source) => `- Memory Core legacy memory index: ${source.legacyPath} -> ${source.agentDatabasePath}`) };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const groups = /* @__PURE__ */ new Map();
		for (const source of await collectLegacyMemorySidecarSources(params)) {
			const group = groups.get(source.legacyPath) ?? [];
			group.push(source);
			groups.set(source.legacyPath, group);
		}
		for (const sources of groups.values()) {
			let archiveReady = true;
			for (const source of sources) try {
				const result = await migrateLegacyMemorySidecarSource({
					source,
					config: params.config,
					env: params.env,
					changes,
					warnings
				});
				archiveReady &&= result.archiveReady;
			} catch (err) {
				archiveReady = false;
				await preserveLegacyMemorySidecarRetryPath({
					source,
					changes,
					warnings
				});
				warnings.push(`Skipped Memory Core legacy memory index import for agent ${source.agentId} because the sidecar could not be imported: ${String(err)}`);
			}
			if (archiveReady && sources[0]) await archiveLegacyMemorySidecar({
				source: sources[0],
				changes,
				warnings
			});
		}
		return {
			changes,
			warnings
		};
	}
};
const RETIRED_QMD_GLOBAL_LOCK_NAME = "embed.lock.lock";
const RETIRED_QMD_AGENT_LOCK_NAME = "qmd-write.lock.lock";
async function collectRetiredQmdFileLocks(stateDir) {
	const { entries } = await walkDirectory(stateDir, {
		maxDepth: 3,
		symlinks: "skip",
		descend: (entry) => entry.depth === 1 && (entry.name === "qmd" || entry.name === "agents") || entry.depth === 2 && path.dirname(entry.relativePath) === "agents" && entry.name === normalizeAgentId(entry.name),
		include: (entry) => entry.kind === "file" && (entry.relativePath === path.join("qmd", RETIRED_QMD_GLOBAL_LOCK_NAME) || entry.depth === 3 && entry.name === RETIRED_QMD_AGENT_LOCK_NAME)
	});
	return entries.toSorted((left, right) => left.depth - right.depth || left.path.localeCompare(right.path)).map((entry) => entry.path);
}
async function collectRetiredQmdWorkspaceHomes(stateDir) {
	const { entries } = await walkDirectory(path.join(stateDir, "agents"), {
		maxDepth: 2,
		symlinks: "skip",
		descend: (entry) => entry.depth === 1 && entry.name === normalizeAgentId(entry.name),
		include: (entry) => entry.depth === 2 && entry.kind === "directory" && entry.name === "qmd"
	});
	const homes = [];
	for (const entry of entries) if ((await fs.readdir(entry.path).catch(() => void 0))?.length === 0) homes.push(entry.path);
	return homes.toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region extensions/memory-core/doctor-contract-api.ts
const stateMigrations = [
	hostEventsStateMigration,
	dreamingStateMigration,
	dreamingCronMigration,
	memorySidecarStateMigration,
	{
		id: "memory-core-qmd-workspace-retired",
		label: "Memory Core retired QMD workspaces",
		doctorOnly: true,
		async detectLegacyState(params) {
			const homes = await collectRetiredQmdWorkspaceHomes(params.stateDir);
			if (homes.length === 0) return null;
			return { preview: homes.map((home) => `- Empty retired Memory Core QMD workspace: ${home} -> remove empty directory`) };
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			for (const home of await collectRetiredQmdWorkspaceHomes(params.stateDir)) try {
				await fs.rmdir(home);
				changes.push(`Removed empty retired Memory Core QMD workspace: ${home}`);
			} catch (err) {
				warnings.push(`Skipped retired Memory Core QMD workspace cleanup. Run openclaw doctor --fix to retry. ${home}: ${String(err)}`);
			}
			return {
				changes,
				warnings,
				...warnings.length > 0 ? { warningDisposition: "recoverable" } : {}
			};
		}
	},
	{
		id: "memory-core-qmd-file-locks-to-sqlite-leases",
		label: "Memory Core retired QMD file locks",
		async detectLegacyState(params) {
			const lockPaths = await collectRetiredQmdFileLocks(params.stateDir);
			if (lockPaths.length === 0) return null;
			return { preview: lockPaths.map((lockPath) => `- Retired Memory Core QMD file lock: ${lockPath} -> remove only if definitely stale (coordination now uses SQLite leases)`) };
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			for (const lockPath of await collectRetiredQmdFileLocks(params.stateDir)) try {
				const result = await reclaimDefinitelyStaleFileLock(lockPath);
				if (result === "removed") changes.push(`Removed retired Memory Core QMD file lock: ${lockPath}`);
				else if (result === "retained") warnings.push(`Retained retired Memory Core QMD file lock because its owner is live or ambiguous: ${lockPath}`);
			} catch (err) {
				warnings.push(`Failed removing retired Memory Core QMD file lock ${lockPath}: ${String(err)}`);
			}
			return {
				changes,
				warnings
			};
		}
	}
];
//#endregion
export { stateMigrations };
