import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.mjs";
import { Lt as boolean } from "./schemas-BOYIvvln.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey, T as parseSessionDeliveryRoute } from "./session-key-CBvmC8zz.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as isBlockedLegacyCodexModelRef, b as toCanonicalOpenAIModelRef } from "./codex-route-model-ref-CXtvdgWA.mjs";
import { a as migrateLegacyToolNameList, i as hasLegacyToolNameList, n as TASK_SUGGESTION_TOOL_NAME_MIGRATION, t as IMAGE_INSPECTION_TOOL_NAME_MIGRATION } from "./legacy-tool-name-migration-CqSg4UH7.mjs";
import { f as syncDirectoryIfSupported } from "./directory-durability-BKe2aOQN.mjs";
import { n as parseCodeModeScriptSyntax, t as buildCodeModeScriptParseSource } from "./code-mode-script-syntax-DZwdESO8.mjs";
import { a as LowercaseNonEmptyStringFieldSchema, i as DeliveryThreadIdFieldSchema, l as parseOptionalField, s as TrimmedNonEmptyStringFieldSchema, t as inferCronJobName } from "./normalize-tfeRpKhn.mjs";
import { i as normalizeCronScheduledToolPolicy, s as resolveCronScheduledToolPolicy, t as createAccountCronScheduledToolPolicy } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BCmwDHWH.mjs";
import { t as coerceFiniteScheduleNumber } from "./schedule-number-sXnjd9Sk.mjs";
import { i as resolveCronCurrentSessionTarget } from "./session-target-DJsUULzX.mjs";
import { r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-wESOTFE0.mjs";
import { n as getInvalidPersistedCronJobReason } from "./persisted-shape-C0aWTtcm.mjs";
import { n as hasCronShellToolAccess, r as parseCronAgentTurnCommandPrompt, t as classifyCronAgentTurnShellPrompt } from "./agent-turn-command-prompt-CcC5OtqR.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { tokenizer } from "acorn";
//#region src/commands/doctor/cron/legacy-delivery.ts
function parseLegacyDeliveryHintsInput(payload) {
	return {
		deliver: parseOptionalField(boolean(), payload.deliver),
		bestEffortDeliver: parseOptionalField(boolean(), payload.bestEffortDeliver),
		channel: parseOptionalField(LowercaseNonEmptyStringFieldSchema, payload.channel),
		provider: parseOptionalField(LowercaseNonEmptyStringFieldSchema, payload.provider),
		to: parseOptionalField(TrimmedNonEmptyStringFieldSchema, payload.to),
		threadId: parseOptionalField(DeliveryThreadIdFieldSchema.transform((value) => String(value)), payload.threadId)
	};
}
/** Return true when a payload still carries legacy delivery hint fields. */
function hasLegacyDeliveryHints(payload) {
	const hints = parseLegacyDeliveryHintsInput(payload);
	return hints.deliver !== void 0 || hints.bestEffortDeliver !== void 0 || hints.channel !== void 0 || hints.provider !== void 0 || hints.to !== void 0 || hints.threadId !== void 0;
}
/** Build a new delivery object from legacy top-level payload delivery fields. */
function buildDeliveryFromLegacyPayload(payload) {
	const hints = parseLegacyDeliveryHintsInput(payload);
	const next = { mode: hints.deliver === false ? "none" : "announce" };
	if (hints.channel ?? hints.provider) next.channel = hints.channel ?? hints.provider;
	if (hints.to) next.to = hints.to;
	if (hints.threadId) next.threadId = hints.threadId;
	if (hints.bestEffortDeliver !== void 0) next.bestEffort = hints.bestEffortDeliver;
	return next;
}
/** Build a partial delivery patch from legacy payload fields, or null when none exist. */
function buildDeliveryPatchFromLegacyPayload(payload) {
	const hints = parseLegacyDeliveryHintsInput(payload);
	const next = {};
	let hasPatch = false;
	if (hints.deliver === false) {
		next.mode = "none";
		hasPatch = true;
	} else if (hints.deliver === true || hints.channel || hints.provider || hints.to || hints.threadId || hints.bestEffortDeliver !== void 0) {
		next.mode = "announce";
		hasPatch = true;
	}
	if (hints.channel ?? hints.provider) {
		next.channel = hints.channel ?? hints.provider;
		hasPatch = true;
	}
	if (hints.to) {
		next.to = hints.to;
		hasPatch = true;
	}
	if (hints.threadId) {
		next.threadId = hints.threadId;
		hasPatch = true;
	}
	if (hints.bestEffortDeliver !== void 0) {
		next.bestEffort = hints.bestEffortDeliver;
		hasPatch = true;
	}
	return hasPatch ? next : null;
}
/** Merge legacy payload delivery hints into an existing delivery object. */
function mergeLegacyDeliveryInto(delivery, payload) {
	const patch = buildDeliveryPatchFromLegacyPayload(payload);
	if (!patch) return {
		delivery,
		mutated: false
	};
	const next = { ...delivery };
	let mutated = false;
	if ("mode" in patch && patch.mode !== next.mode) {
		next.mode = patch.mode;
		mutated = true;
	}
	if ("channel" in patch && patch.channel !== next.channel) {
		next.channel = patch.channel;
		mutated = true;
	}
	if ("to" in patch && patch.to !== next.to) {
		next.to = patch.to;
		mutated = true;
	}
	if ("threadId" in patch && patch.threadId !== next.threadId) {
		next.threadId = patch.threadId;
		mutated = true;
	}
	if ("bestEffort" in patch && patch.bestEffort !== next.bestEffort) {
		next.bestEffort = patch.bestEffort;
		mutated = true;
	}
	return {
		delivery: next,
		mutated
	};
}
/** Normalize delivery and strip consumed legacy delivery fields from the payload. */
function normalizeLegacyDeliveryInput(params) {
	if (!params.payload || !hasLegacyDeliveryHints(params.payload)) return {
		delivery: params.delivery ?? void 0,
		mutated: false
	};
	const nextDelivery = params.delivery ? mergeLegacyDeliveryInto(params.delivery, params.payload) : {
		delivery: buildDeliveryFromLegacyPayload(params.payload),
		mutated: true
	};
	stripLegacyDeliveryFields(params.payload);
	return {
		delivery: nextDelivery.delivery,
		mutated: true
	};
}
function stripLegacyDeliveryFields(payload) {
	if ("deliver" in payload) delete payload.deliver;
	if ("channel" in payload) delete payload.channel;
	if ("provider" in payload) delete payload.provider;
	if ("to" in payload) delete payload.to;
	if ("threadId" in payload) delete payload.threadId;
	if ("bestEffortDeliver" in payload) delete payload.bestEffortDeliver;
}
//#endregion
//#region src/commands/doctor/cron/legacy-store-migration.ts
const LEGACY_CRON_ARCHIVE_SUFFIX = ".migrated";
const legacyCronMigrationIds = /* @__PURE__ */ new WeakMap();
function resolveLegacyCronMigrationId(job) {
	return legacyCronMigrationIds.get(job);
}
function markLegacyCronMigrationIdentity(job, sourceIndex) {
	if (normalizeOptionalStringifiedId(job.id) ?? normalizeOptionalStringifiedId(job.jobId)) return;
	const digest = createHash("sha256").update(JSON.stringify(job)).digest("hex");
	legacyCronMigrationIds.set(job, `cron-migrated-${sourceIndex}-${digest}`);
}
function resolveLegacyCronStatePath(storePath) {
	if (storePath.endsWith(".json")) return storePath.replace(/\.json$/, "-state.json");
	return `${storePath}-state.json`;
}
function createLegacyCronMigrationSource(params) {
	const sourceSha256 = createHash("sha256").update(params.raw).digest("hex");
	const stateSha256 = params.stateRaw !== void 0 ? createHash("sha256").update(params.stateRaw).digest("hex") : void 0;
	return {
		sourceKey: `cron-json:${createHash("sha256").update(`${params.sourcePath}\0${sourceSha256}\0${stateSha256 ?? ""}`).digest("hex")}`,
		sourcePath: params.sourcePath,
		sourceSha256,
		statePath: params.statePath,
		stateSha256,
		sourceSizeBytes: Buffer.byteLength(params.raw) + Buffer.byteLength(params.stateRaw ?? ""),
		sourceRecordCount: params.recordCount
	};
}
async function legacyCronFileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch (err) {
		if (err.code === "ENOENT") return false;
		throw err;
	}
}
async function sha256File(filePath) {
	return createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
}
/** Refuse to persist a migration plan built from legacy files that changed after loading. */
async function assertLegacyCronMigrationSourceCurrent(source) {
	if (await sha256File(source.sourcePath) !== source.sourceSha256) throw new Error("legacy cron source changed while doctor was preparing its migration");
	if (source.stateSha256) {
		if (await sha256File(source.statePath) !== source.stateSha256) throw new Error("legacy cron state changed while doctor was preparing its migration");
	} else if (await legacyCronFileExists(source.statePath)) throw new Error("legacy cron state appeared while doctor was preparing its migration");
}
async function restoreArchivedSource(archivePath, sourcePath, expectedSha256) {
	try {
		if (await legacyCronFileExists(sourcePath)) return {
			ok: false,
			reason: `archive remains at ${archivePath} because a new source exists at ${sourcePath}`
		};
	} catch (err) {
		return {
			ok: false,
			reason: `archive remains at ${archivePath} because the source path could not be checked: ${formatErrorMessage(err)}`
		};
	}
	try {
		await fs.rename(archivePath, sourcePath);
	} catch (err) {
		if (err.code === "EXDEV") {
			const outcome = await copyLegacyCronFileAcrossDevices(archivePath, sourcePath, expectedSha256, false);
			return outcome.ok ? { ok: true } : outcome;
		}
		return {
			ok: false,
			reason: `archive remains at ${archivePath} because restoration failed: ${formatErrorMessage(err)}`
		};
	}
	try {
		await syncDirectoryIfSupported(path.dirname(sourcePath));
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			reason: `the source was restored, but rollback directory sync failed: ${formatErrorMessage(err)}`
		};
	}
}
async function copyLegacyCronFileAcrossDevices(filePath, initialArchivePath, expectedSha256, useNumberedArchive = true) {
	let archivePath = initialArchivePath;
	let archiveCreated = false;
	let sourceRemoved = false;
	try {
		const sourceStat = await fs.stat(filePath);
		if (!sourceStat.isFile()) throw new Error("legacy cron source is not a regular file");
		if (expectedSha256 && await sha256File(filePath) !== expectedSha256) throw new Error("legacy cron source changed after it was imported; refusing to archive it");
		const sourceMode = sourceStat.mode & 511;
		for (let index = 2;; index += 1) try {
			const archiveHandle = await fs.open(archivePath, "wx", sourceMode | 384);
			archiveCreated = true;
			await archiveHandle.close();
			break;
		} catch (err) {
			if (err.code !== "EEXIST" || !useNumberedArchive) throw err;
			archivePath = `${filePath}${LEGACY_CRON_ARCHIVE_SUFFIX}.${index}`;
		}
		await fs.copyFile(filePath, archivePath);
		if (expectedSha256 && await sha256File(archivePath) !== expectedSha256) throw new Error("copied legacy cron archive does not match the imported source");
		await fs.chmod(archivePath, sourceMode | 384);
		const archiveHandle = await fs.open(archivePath, "r+");
		try {
			await archiveHandle.chmod(sourceMode);
			await archiveHandle.utimes(sourceStat.atime, sourceStat.mtime);
			await archiveHandle.sync();
		} finally {
			await archiveHandle.close();
		}
		await syncDirectoryIfSupported(path.dirname(archivePath));
		const currentSourceStat = await fs.stat(filePath);
		if (currentSourceStat.dev !== sourceStat.dev || currentSourceStat.ino !== sourceStat.ino || expectedSha256 && await sha256File(filePath) !== expectedSha256) throw new Error("legacy cron source changed during archival; refusing to remove it");
		await fs.unlink(filePath);
		sourceRemoved = true;
		await syncDirectoryIfSupported(path.dirname(filePath));
		return {
			ok: true,
			archivePath
		};
	} catch (err) {
		if (sourceRemoved) return {
			ok: false,
			reason: `${formatErrorMessage(err)}; the durable archive is preserved at ${archivePath} because the source was already removed`
		};
		const cleanupFailures = [];
		if (archiveCreated) {
			let archiveRemoved = false;
			try {
				try {
					await fs.unlink(archivePath);
				} catch (cleanupErr) {
					if (cleanupErr.code !== "ENOENT") throw cleanupErr;
				}
				archiveRemoved = true;
				await syncDirectoryIfSupported(path.dirname(archivePath));
			} catch (cleanupErr) {
				cleanupFailures.push(archiveRemoved ? `the partial archive was removed, but cleanup directory sync failed: ${formatErrorMessage(cleanupErr)}` : `partial archive remains at ${archivePath} because cleanup failed: ${formatErrorMessage(cleanupErr)}`);
			}
		}
		const cleanupReason = cleanupFailures.length > 0 ? `; ${cleanupFailures.join("; ")}` : "";
		return {
			ok: false,
			reason: `${formatErrorMessage(err)}${cleanupReason}`
		};
	}
}
/** Archives an imported legacy cron artifact only after its source bytes are verified. */
async function archiveLegacyCronFile(filePath, expectedSha256) {
	let archivePath = `${filePath}${LEGACY_CRON_ARCHIVE_SUFFIX}`;
	try {
		if (!await legacyCronFileExists(filePath)) return { ok: true };
		for (let index = 2; await legacyCronFileExists(archivePath); index += 1) archivePath = `${filePath}${LEGACY_CRON_ARCHIVE_SUFFIX}.${index}`;
	} catch (err) {
		return {
			ok: false,
			reason: formatErrorMessage(err)
		};
	}
	try {
		await fs.rename(filePath, archivePath);
	} catch (err) {
		if (err?.code !== "EXDEV") return {
			ok: false,
			reason: formatErrorMessage(err)
		};
		return await copyLegacyCronFileAcrossDevices(filePath, archivePath, expectedSha256);
	}
	try {
		if (expectedSha256 && await sha256File(archivePath) !== expectedSha256) throw new Error("legacy cron source changed after it was imported; refusing to archive it");
		await syncDirectoryIfSupported(path.dirname(filePath));
		if (await legacyCronFileExists(filePath)) return {
			ok: false,
			reason: `the imported source was archived, but a new legacy cron source now exists at ${filePath}`
		};
		return {
			ok: true,
			archivePath
		};
	} catch (err) {
		const restoreFailure = await restoreArchivedSource(archivePath, filePath, expectedSha256);
		return {
			ok: false,
			reason: restoreFailure.ok ? formatErrorMessage(err) : `${formatErrorMessage(err)}; ${restoreFailure.reason}`
		};
	}
}
function parseCronStateFile(raw) {
	try {
		const parsed = parseJsonWithJson5Fallback(raw);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		const record = parsed;
		if (record.version !== 1 || typeof record.jobs !== "object" || record.jobs === null || Array.isArray(record.jobs)) return null;
		return {
			version: 1,
			jobs: record.jobs
		};
	} catch {
		return null;
	}
}
function readScheduleString(record, key) {
	return normalizeOptionalString(record[key]);
}
function readScheduleNumber(record, key) {
	return coerceFiniteScheduleNumber(record[key]);
}
function legacySchedulePayloadFromRecord(schedule) {
	const rawKind = readScheduleString(schedule, "kind")?.toLowerCase();
	const expr = readScheduleString(schedule, "expr") ?? readScheduleString(schedule, "cron");
	const at = readScheduleString(schedule, "at");
	const atMs = readScheduleNumber(schedule, "atMs");
	const everyMs = readScheduleNumber(schedule, "everyMs");
	const anchorMs = readScheduleNumber(schedule, "anchorMs");
	const tz = readScheduleString(schedule, "tz");
	const staggerMs = normalizeCronStaggerMs(schedule.staggerMs);
	const kind = rawKind === "at" || rawKind === "every" || rawKind === "cron" ? rawKind : at || atMs !== void 0 ? "at" : everyMs !== void 0 ? "every" : expr ? "cron" : void 0;
	if (kind === "at") return at ? {
		kind: "at",
		at
	} : atMs !== void 0 ? {
		kind: "at",
		at: String(atMs)
	} : void 0;
	if (kind === "every" && everyMs !== void 0) return {
		kind: "every",
		everyMs,
		anchorMs
	};
	if (kind === "cron" && expr) return {
		kind: "cron",
		expr,
		tz,
		staggerMs
	};
}
function tryLegacyCronScheduleIdentity(job) {
	const schedule = job.schedule && typeof job.schedule === "object" && !Array.isArray(job.schedule) ? legacySchedulePayloadFromRecord(job.schedule) : legacySchedulePayloadFromRecord(job);
	if (!schedule) return;
	return JSON.stringify({
		version: 1,
		enabled: typeof job.enabled === "boolean" ? job.enabled : true,
		schedule
	});
}
function getRawCronJobs(parsed) {
	return Array.isArray(parsed) ? parsed : isRecord(parsed) && Array.isArray(parsed.jobs) ? parsed.jobs : [];
}
function cloneConfigJobs(jobs) {
	return jobs.map((job) => structuredClone(job));
}
async function loadStateFile(statePath) {
	let raw;
	try {
		raw = await fs.readFile(statePath, "utf-8");
	} catch (err) {
		if (err?.code === "ENOENT") return { state: null };
		throw new Error(`Failed to read cron state at ${statePath}: ${String(err)}`, { cause: err });
	}
	return {
		state: parseCronStateFile(raw),
		raw
	};
}
function hasInlineState(jobs) {
	return jobs.some((job) => job != null && isRecord(job.state) && Object.keys(job.state).length > 0);
}
function ensureJobStateObject(job) {
	if (!isRecord(job.state)) job.state = {};
}
function backfillMissingRuntimeFields(job) {
	ensureJobStateObject(job);
	if (typeof job.updatedAtMs !== "number") job.updatedAtMs = typeof job.createdAtMs === "number" ? job.createdAtMs : Date.now();
}
function resolveUpdatedAtMs(job, updatedAtMs) {
	if (typeof updatedAtMs === "number" && Number.isFinite(updatedAtMs)) return updatedAtMs;
	if (typeof job.updatedAtMs === "number" && Number.isFinite(job.updatedAtMs)) return job.updatedAtMs;
	return typeof job.createdAtMs === "number" && Number.isFinite(job.createdAtMs) ? job.createdAtMs : Date.now();
}
function mergeStateFileEntry(job, entry) {
	if (!isRecord(entry)) {
		backfillMissingRuntimeFields(job);
		return;
	}
	job.updatedAtMs = resolveUpdatedAtMs(job, entry.updatedAtMs);
	job.state = isRecord(entry.state) ? entry.state : {};
	if (typeof entry.scheduleIdentity === "string" && entry.scheduleIdentity !== tryLegacyCronScheduleIdentity(job)) {
		ensureJobStateObject(job);
		if (isRecord(job.state)) job.state.nextRunAtMs = void 0;
	}
}
function resolveCronStateId(job) {
	return normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
}
/** Return true when legacy cron JSON or state files exist for a store path. */
async function legacyCronStoreFilesExist(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	return await legacyCronFileExists(resolvedStorePath) || await legacyCronFileExists(resolveLegacyCronStatePath(resolvedStorePath));
}
/** Archive legacy cron JSON/state files after successful migration. */
async function archiveLegacyCronStoreForMigration(storePath, source) {
	const resolvedStorePath = path.resolve(storePath);
	const statePath = resolveLegacyCronStatePath(resolvedStorePath);
	const failures = [];
	const archived = [];
	const rollbackArchived = async () => {
		for (const target of archived.toReversed()) {
			const outcome = await restoreArchivedSource(target.archivePath, target.path, target.sha256);
			if (!outcome.ok) failures.push({
				path: target.path,
				reason: `archive rollback failed: ${outcome.reason}`
			});
		}
	};
	const unexpectedStateReason = async () => {
		try {
			return await legacyCronFileExists(statePath) ? "legacy cron state appeared after the store was imported; refusing to archive it" : void 0;
		} catch (err) {
			return `legacy cron state path could not be checked: ${formatErrorMessage(err)}`;
		}
	};
	if (source && !source.stateSha256) {
		const reason = await unexpectedStateReason();
		if (reason) return {
			ok: false,
			failures: [{
				path: statePath,
				reason
			}]
		};
	}
	const targets = source ? [...source.stateSha256 ? [{
		path: statePath,
		sha256: source.stateSha256
	}] : [], {
		path: resolvedStorePath,
		sha256: source.sourceSha256
	}] : [{ path: statePath }, { path: resolvedStorePath }];
	for (const target of targets) {
		const outcome = await archiveLegacyCronFile(target.path, target.sha256);
		if (!outcome.ok) {
			failures.push({
				path: target.path,
				reason: outcome.reason
			});
			await rollbackArchived();
			break;
		}
		if (outcome.archivePath) archived.push({
			...target,
			archivePath: outcome.archivePath
		});
	}
	if (failures.length === 0 && source) {
		const reason = await unexpectedStateReason();
		if (reason) {
			failures.push({
				path: statePath,
				reason
			});
			await rollbackArchived();
		}
	}
	return failures.length === 0 ? { ok: true } : {
		ok: false,
		failures
	};
}
/** Load legacy cron JSON/state files into the current loaded-store shape for migration. */
async function loadLegacyCronStoreForMigration(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	try {
		const raw = await fs.readFile(resolvedStorePath, "utf-8");
		let parsed;
		try {
			parsed = parseJsonWithJson5Fallback(raw);
		} catch (err) {
			throw new Error(`Failed to parse cron store at ${resolvedStorePath}: ${String(err)}`, { cause: err });
		}
		const rawJobs = getRawCronJobs(parsed);
		const configJobIndexes = [];
		const configRows = [];
		const configJobRuntimeEntries = [];
		const invalidConfigRows = [];
		for (const [index, row] of rawJobs.entries()) if (isRecord(row)) {
			markLegacyCronMigrationIdentity(row, index);
			if (isRecord(row.createdActor) && row.createdActor.type === "human") row.createdActor = {
				...row.createdActor,
				source: "unknown"
			};
			configJobIndexes.push(index);
			configRows.push(row);
		} else invalidConfigRows.push({
			sourceIndex: index,
			reason: "non-object-row",
			raw: structuredClone(row)
		});
		const store = {
			version: 1,
			jobs: configRows
		};
		const jobs = configRows;
		const configJobs = cloneConfigJobs(configRows);
		const statePath = resolveLegacyCronStatePath(resolvedStorePath);
		const loadedStateFile = await loadStateFile(statePath);
		const stateFile = loadedStateFile.state;
		const hasLegacyInlineState = !stateFile && hasInlineState(jobs);
		if (stateFile) for (const job of jobs) {
			const stateId = resolveCronStateId(job);
			const entry = stateId ? stateFile.jobs[stateId] : void 0;
			configJobRuntimeEntries.push(isRecord(entry) ? structuredClone(entry) : {});
			if (entry) mergeStateFileEntry(job, entry);
			else backfillMissingRuntimeFields(job);
		}
		else if (!hasLegacyInlineState) for (const job of jobs) backfillMissingRuntimeFields(job);
		for (const job of jobs) ensureJobStateObject(job);
		return {
			store,
			configJobs,
			configJobIndexes,
			configJobRuntimeEntries,
			invalidConfigRows,
			migrationSource: createLegacyCronMigrationSource({
				sourcePath: resolvedStorePath,
				raw,
				statePath,
				stateRaw: loadedStateFile.raw,
				recordCount: rawJobs.length
			})
		};
	} catch (err) {
		if (err?.code === "ENOENT") return {
			store: {
				version: 1,
				jobs: []
			},
			configJobs: [],
			configJobIndexes: [],
			configJobRuntimeEntries: [],
			invalidConfigRows: []
		};
		throw err;
	}
}
//#endregion
//#region src/commands/doctor/cron/payload-migration.ts
const LEGACY_DELIVERY_HINT_FIELDS = [
	"deliver",
	"bestEffortDeliver",
	"channel",
	"provider",
	"to",
	"threadId"
];
function normalizePayloadKind(payload) {
	const raw = normalizeOptionalLowercaseString(payload.kind) ?? "";
	if (raw === "agentturn") {
		if (payload.kind !== "agentTurn") {
			payload.kind = "agentTurn";
			return true;
		}
		return false;
	}
	if (raw === "systemevent") {
		if (payload.kind !== "systemEvent") {
			payload.kind = "systemEvent";
			return true;
		}
		return false;
	}
	return false;
}
function inferPayloadIfMissing(raw) {
	const message = normalizeOptionalString(raw.message) ?? "";
	const text = normalizeOptionalString(raw.text) ?? "";
	const command = normalizeOptionalString(raw.command) ?? "";
	if (message) {
		raw.payload = {
			kind: "agentTurn",
			message
		};
		return true;
	}
	if (text) {
		raw.payload = {
			kind: "systemEvent",
			text
		};
		return true;
	}
	if (command) {
		raw.payload = {
			kind: "systemEvent",
			text: command
		};
		return true;
	}
	return false;
}
function copyTopLevelAgentTurnFields(raw, payload) {
	let mutated = false;
	const copyTrimmedString = (field) => {
		if (normalizeOptionalString(payload[field])) return;
		const value = normalizeOptionalString(raw[field]);
		if (value) {
			payload[field] = value;
			mutated = true;
		}
	};
	copyTrimmedString("model");
	copyTrimmedString("thinking");
	if (typeof payload.timeoutSeconds !== "number" && typeof raw.timeoutSeconds === "number" && Number.isFinite(raw.timeoutSeconds)) {
		payload.timeoutSeconds = Math.max(0, Math.floor(raw.timeoutSeconds));
		mutated = true;
	}
	if (typeof payload.allowUnsafeExternalContent !== "boolean" && typeof raw.allowUnsafeExternalContent === "boolean") {
		payload.allowUnsafeExternalContent = raw.allowUnsafeExternalContent;
		mutated = true;
	}
	if (typeof payload.deliver !== "boolean" && typeof raw.deliver === "boolean") {
		payload.deliver = raw.deliver;
		mutated = true;
	}
	const channel = normalizeOptionalString(raw.channel);
	if (typeof payload.channel !== "string" && channel) {
		payload.channel = channel;
		mutated = true;
	}
	const to = normalizeOptionalString(raw.to);
	if (typeof payload.to !== "string" && to) {
		payload.to = to;
		mutated = true;
	}
	const rawThreadId = normalizeOptionalString(raw.threadId);
	if (!("threadId" in payload) && (typeof raw.threadId === "number" && Number.isFinite(raw.threadId) || Boolean(rawThreadId))) {
		payload.threadId = rawThreadId ?? raw.threadId;
		mutated = true;
	}
	if (typeof payload.bestEffortDeliver !== "boolean" && typeof raw.bestEffortDeliver === "boolean") {
		payload.bestEffortDeliver = raw.bestEffortDeliver;
		mutated = true;
	}
	const provider = normalizeOptionalString(raw.provider);
	if (typeof payload.provider !== "string" && provider) {
		payload.provider = provider;
		mutated = true;
	}
	return mutated;
}
function stripLegacyTopLevelFields(raw) {
	if ("model" in raw) delete raw.model;
	if ("thinking" in raw) delete raw.thinking;
	if ("timeoutSeconds" in raw) delete raw.timeoutSeconds;
	if ("allowUnsafeExternalContent" in raw) delete raw.allowUnsafeExternalContent;
	if ("message" in raw) delete raw.message;
	if ("text" in raw) delete raw.text;
	if ("deliver" in raw) delete raw.deliver;
	if ("channel" in raw) delete raw.channel;
	if ("to" in raw) delete raw.to;
	if ("threadId" in raw) delete raw.threadId;
	if ("bestEffortDeliver" in raw) delete raw.bestEffortDeliver;
	if ("provider" in raw) delete raw.provider;
	if ("command" in raw) delete raw.command;
	if ("timeout" in raw) delete raw.timeout;
}
function readLegacyOpenAICodexCronModelRoute(value) {
	const legacyModelRef = readStringValue(value)?.trim();
	const canonicalModelRef = legacyModelRef ? toCanonicalOpenAIModelRef(legacyModelRef) : void 0;
	return legacyModelRef && canonicalModelRef ? {
		legacyModelRef,
		canonicalModelRef
	} : void 0;
}
/** Legacy and canonical route pairs retained for namespace-specific migration blockers. */
function collectLegacyOpenAICodexCronModelRoutes(payload) {
	const routes = /* @__PURE__ */ new Map();
	const add = (value) => {
		const route = readLegacyOpenAICodexCronModelRoute(value);
		if (route) routes.set(`${route.legacyModelRef}\u0000${route.canonicalModelRef}`, route);
	};
	add(payload.model);
	if (Array.isArray(payload.fallbacks)) for (const fallback of payload.fallbacks) add(fallback);
	return [...routes.values()];
}
/** Canonical OpenAI refs whose legacy cron shape implied the Codex runtime. */
function collectLegacyOpenAICodexCronModelRefs(payload) {
	return [...new Set(collectLegacyOpenAICodexCronModelRoutes(payload).map((route) => route.canonicalModelRef))];
}
function normalizeChannel(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
function readPositiveInteger(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
/** Return true when a cron payload contains legacy Codex-route model refs. */
function hasLegacyOpenAICodexCronModelRef(payload) {
	return collectLegacyOpenAICodexCronModelRefs(payload).length > 0;
}
function migrateLegacyOpenAICodexModelRefs(payload, shouldMigrate) {
	let mutated = false;
	const model = readLegacyOpenAICodexCronModelRoute(payload.model);
	if (model && shouldMigrate(model.canonicalModelRef, model.legacyModelRef) && payload.model !== model.canonicalModelRef) {
		payload.model = model.canonicalModelRef;
		mutated = true;
	}
	const fallbacks = payload.fallbacks;
	if (Array.isArray(fallbacks)) {
		const next = fallbacks.map((fallback) => {
			const route = readLegacyOpenAICodexCronModelRoute(fallback);
			return route && shouldMigrate(route.canonicalModelRef, route.legacyModelRef) ? route.canonicalModelRef : fallback;
		});
		if (next.some((fallback, index) => fallback !== fallbacks[index])) {
			payload.fallbacks = next;
			mutated = true;
		}
	}
	return mutated;
}
/** Normalize legacy cron payload channel/provider and model reference fields in place. */
function migrateLegacyCronPayload(payload, options = {}) {
	let mutated = false;
	if (migrateLegacyToolNameList(payload.toolsAllow, TASK_SUGGESTION_TOOL_NAME_MIGRATION)) mutated = true;
	if (migrateLegacyToolNameList(payload.toolsAllow, IMAGE_INSPECTION_TOOL_NAME_MIGRATION)) mutated = true;
	const channelValue = readStringValue(payload.channel);
	const providerValue = readStringValue(payload.provider);
	const nextChannel = typeof channelValue === "string" && channelValue.trim().length > 0 ? normalizeChannel(channelValue) : typeof providerValue === "string" && providerValue.trim().length > 0 ? normalizeChannel(providerValue) : "";
	if (nextChannel) {
		if (channelValue !== nextChannel) {
			payload.channel = nextChannel;
			mutated = true;
		}
	}
	if ("provider" in payload) {
		delete payload.provider;
		mutated = true;
	}
	if (migrateLegacyOpenAICodexModelRefs(payload, options.migrateCodexModelRefs === true ? options.shouldMigrateCodexModelRef ?? (() => true) : () => false)) mutated = true;
	return mutated;
}
function migrateLegacyAgentTurnCommandPayload(payload) {
	if (payload.kind !== "agentTurn") return false;
	const message = readStringValue(payload.message);
	if (typeof message !== "string") return false;
	const parsed = parseCronAgentTurnCommandPrompt(message);
	if (!parsed) return false;
	if (!hasCronShellToolAccess(payload.toolsAllow)) return false;
	const timeoutSeconds = readPositiveInteger(payload.timeoutSeconds) ?? parsed.timeoutSeconds;
	const deliveryHints = {};
	for (const key of LEGACY_DELIVERY_HINT_FIELDS) if (key in payload) deliveryHints[key] = payload[key];
	for (const key of Object.keys(payload)) delete payload[key];
	payload.kind = "command";
	payload.argv = [
		"sh",
		"-lc",
		parsed.command
	];
	if (parsed.cwd) payload.cwd = parsed.cwd;
	if (timeoutSeconds !== void 0) payload.timeoutSeconds = timeoutSeconds;
	Object.assign(payload, deliveryHints);
	return true;
}
function classifyUnresolvedAgentTurnShellToolPrompt(payload) {
	return classifyCronAgentTurnShellPrompt(payload);
}
//#endregion
//#region src/commands/doctor/cron/scheduled-tool-policy-migration.ts
/** Collects operator-visible recovery outcomes while normalizing a cron store. */
function createScheduledToolPolicyMigrationCollector() {
	const legacyJobs = [];
	const invalidJobs = [];
	return {
		legacyJobs,
		invalidJobs,
		migrate(raw, onMigrated) {
			const result = migrateScheduledToolPolicy(raw);
			const jobName = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
			if (result.status === "migrated") onMigrated("policy");
			if (result.ownerReconciled) onMigrated("owner");
			if (result.status === "legacy" && jobName) legacyJobs.push(jobName);
			else if (result.status === "invalid" && jobName) invalidJobs.push(jobName);
			return result.mutated;
		}
	};
}
function usesToolRuntime(raw) {
	const payload = asOptionalRecord(raw.payload);
	const trigger = asOptionalRecord(raw.trigger);
	return payload?.kind === "agentTurn" || payload?.kind === "script" || typeof trigger?.script === "string" && trigger.script.trim().length > 0;
}
/** Recovers only account authority proven by immutable persisted owner identity. */
function migrateScheduledToolPolicy(raw) {
	if (!usesToolRuntime(raw)) return {
		mutated: false,
		status: raw.scheduledToolPolicy === void 0 ? "not-applicable" : "invalid"
	};
	const payload = asOptionalRecord(raw.payload);
	const toolsAllow = Array.isArray(payload?.toolsAllow) && payload.toolsAllow.every((value) => typeof value === "string") ? payload.toolsAllow : void 0;
	const owner = asOptionalRecord(raw.owner);
	const ownerSessionKey = normalizeOptionalString(owner?.sessionKey);
	const ownerAccountId = normalizeOptionalAccountId(typeof owner?.accountId === "string" ? owner.accountId : void 0);
	if (raw.scheduledToolPolicy !== void 0) {
		const normalized = normalizeCronScheduledToolPolicy(raw.scheduledToolPolicy);
		const resolved = resolveCronScheduledToolPolicy({
			toolsAllow,
			scheduledToolPolicy: normalized,
			owner: {
				sessionKey: ownerSessionKey,
				accountId: ownerAccountId
			}
		});
		if (!resolved) return {
			mutated: false,
			status: "invalid"
		};
		const mutated = JSON.stringify(raw.scheduledToolPolicy) !== JSON.stringify(resolved);
		if (mutated) raw.scheduledToolPolicy = resolved;
		return {
			mutated,
			status: "current"
		};
	}
	if (!ownerSessionKey) return {
		mutated: false,
		status: "legacy"
	};
	const parsedSession = parseAgentSessionKey(ownerSessionKey);
	if (!parsedSession) return {
		mutated: false,
		status: "legacy"
	};
	const ownerAgentId = normalizeOptionalString(owner?.agentId);
	if (ownerAgentId && normalizeAgentId(ownerAgentId) !== normalizeAgentId(parsedSession.agentId)) return {
		mutated: false,
		status: "legacy"
	};
	const encodedAccountId = normalizeOptionalAccountId(parseSessionDeliveryRoute(ownerSessionKey)?.accountId);
	if (ownerAccountId && encodedAccountId && ownerAccountId !== encodedAccountId) return {
		mutated: false,
		status: "legacy"
	};
	const recoveredAccountId = ownerAccountId ?? encodedAccountId;
	if (!recoveredAccountId) return {
		mutated: false,
		status: "legacy"
	};
	const scheduledToolPolicy = createAccountCronScheduledToolPolicy({
		ownerSessionKey,
		ownerAccountId: recoveredAccountId
	});
	if (!scheduledToolPolicy) return {
		mutated: false,
		status: "legacy"
	};
	const reconciledOwner = {
		...owner,
		...ownerAgentId ? { agentId: normalizeAgentId(ownerAgentId) } : {},
		sessionKey: ownerSessionKey,
		accountId: recoveredAccountId
	};
	const ownerReconciled = JSON.stringify(raw.owner) !== JSON.stringify(reconciledOwner);
	raw.owner = reconciledOwner;
	if (!toolsAllow) return {
		mutated: ownerReconciled,
		ownerReconciled,
		status: "legacy"
	};
	raw.scheduledToolPolicy = scheduledToolPolicy;
	return {
		mutated: true,
		ownerReconciled,
		status: "migrated"
	};
}
//#endregion
//#region src/commands/doctor/cron/trigger-script-migration.ts
function sourceContainsComment(source) {
	let hasComment = false;
	const tokens = tokenizer(source, {
		ecmaVersion: "latest",
		onComment: () => {
			hasComment = true;
		}
	});
	while (tokens.getToken().type.label !== "eof") if (hasComment) return true;
	return hasComment;
}
function isSyntaxNode(value) {
	return typeof value === "object" && value !== null && "type" in value && typeof value.type === "string" && "start" in value && typeof value.start === "number" && "end" in value && typeof value.end === "number";
}
function collectSyntaxVisits(node, ancestors = []) {
	const visits = [{
		node,
		ancestors
	}];
	for (const value of Object.values(node)) for (const child of Array.isArray(value) ? value : [value]) if (isSyntaxNode(child)) visits.push(...collectSyntaxVisits(child, [...ancestors, node]));
	return visits;
}
function isNoncomputedPropertyName(node, parent) {
	return parent?.type === "MemberExpression" && parent.property === node && !parent.computed || parent?.type === "Property" && parent.key === node && !parent.computed && !parent.shorthand;
}
function isStaticPlainObjectArgument(node) {
	return node.type === "ObjectExpression" && node.properties.every((property) => property.type === "Property" && property.kind === "init" && !property.computed && !property.method);
}
function legacyToolCall(node) {
	if (node.type !== "CallExpression") return;
	const call = node;
	const callee = node.callee;
	if (callee.type !== "MemberExpression" || callee.computed || callee.optional || callee.object.type !== "Identifier" || callee.object.name !== "tools" || callee.property.type !== "Identifier" || callee.property.name !== "call" || call.optional || call.arguments.length !== 2) return;
	const [toolName, args] = call.arguments;
	return toolName?.type === "Literal" && toolName.value === "exec" && args && isStaticPlainObjectArgument(args) ? call : void 0;
}
/** Rewrite only the exact v2026.7.1 Cron trigger idiom; custom legacy code stays untouched. */
function migrateLegacyCronTriggerScript(script) {
	const parsed = parseCodeModeScriptSyntax(script);
	if (!parsed.ok) return { kind: "unsupported" };
	const wrapper = parsed.program.body[0];
	if (wrapper?.type !== "ExpressionStatement" || wrapper.expression.type !== "ArrowFunctionExpression" || wrapper.expression.body.type !== "BlockStatement") return { kind: "unsupported" };
	const body = wrapper.expression.body;
	const visits = collectSyntaxVisits(body);
	if (visits.some(({ node, ancestors }) => {
		if (node.type !== "MemberExpression") return false;
		const receiver = node.object;
		const isGlobalObject = receiver.type === "Identifier" && receiver.name === "globalThis";
		const isTopLevelThis = receiver.type === "ThisExpression" && !ancestors.some((ancestor) => ancestor.type === "FunctionDeclaration" || ancestor.type === "FunctionExpression");
		if (!isGlobalObject && !isTopLevelThis) return false;
		const property = node.property;
		const name = node.computed ? property.type === "Literal" ? property.value : void 0 : property.type === "Identifier" ? property.name : void 0;
		return name === "tools" || name === "ALL_TOOLS";
	})) return { kind: "unsupported" };
	const legacyIdentifiers = visits.filter(({ node, ancestors }) => {
		if (node.type !== "Identifier") return false;
		return (node.name === "tools" || node.name === "ALL_TOOLS") && !isNoncomputedPropertyName(node, ancestors.at(-1));
	});
	if (legacyIdentifiers.length === 0) return { kind: "current" };
	const edits = [];
	const bindings = /* @__PURE__ */ new Map();
	const recognizedTools = /* @__PURE__ */ new Set();
	const { codeOffset } = buildCodeModeScriptParseSource(script);
	for (const { node, ancestors } of visits) {
		if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression" || node.type === "WithStatement") return { kind: "unsupported" };
		const call = legacyToolCall(node);
		if (!call) continue;
		const parent = ancestors.at(-1);
		const awaited = parent?.type === "AwaitExpression";
		const expression = awaited ? parent : node;
		const owner = ancestors.at(awaited ? -2 : -1);
		const statement = ancestors.at(awaited ? -4 : -3);
		if (owner?.type === "VariableDeclarator") {
			const declaration = ancestors.at(awaited ? -3 : -2);
			const declarator = owner;
			if (!awaited || declaration?.type !== "VariableDeclaration" || declaration.kind !== "const" || declaration.declarations.length !== 1 || statement !== body || declarator.id.type !== "Identifier" || declarator.init !== expression || declarator.id.name === "exec" || bindings.has(declarator.id.name)) return { kind: "unsupported" };
			bindings.set(declarator.id.name, declarator.id);
		} else if (owner?.type !== "ExpressionStatement" || ancestors.at(awaited ? -3 : -2) !== body) return { kind: "unsupported" };
		if (call.callee.type !== "MemberExpression") return { kind: "unsupported" };
		recognizedTools.add(call.callee.object);
		const args = call.arguments[1];
		if (!args) return { kind: "unsupported" };
		if (sourceContainsComment(script.slice(call.start - codeOffset, args.start - codeOffset))) return { kind: "unsupported" };
		edits.push({
			start: call.start - codeOffset,
			end: args.start - codeOffset,
			replacement: "exec("
		});
	}
	for (const { node, ancestors } of visits) {
		if (node.type !== "Identifier") continue;
		const parent = ancestors.at(-1);
		if (isNoncomputedPropertyName(node, parent)) continue;
		if (node.name === "tools" || node.name === "ALL_TOOLS") {
			if (!recognizedTools.has(node)) return { kind: "unsupported" };
			continue;
		}
		if (node.name === "exec") {
			if (parent?.type !== "CallExpression" || parent.callee !== node) return { kind: "unsupported" };
			continue;
		}
		const declaration = bindings.get(node.name);
		if (!declaration || declaration === node) continue;
		const result = parent;
		const details = ancestors.at(-2);
		if (result?.type !== "MemberExpression" || result.object !== node || result.computed || result.property.type !== "Identifier" || result.property.name !== "result" || details?.type !== "MemberExpression" || details.object !== result || details.computed || details.property.type !== "Identifier" || details.property.name !== "details") return { kind: "unsupported" };
		if (sourceContainsComment(script.slice(node.end - codeOffset, details.end - codeOffset))) return { kind: "unsupported" };
		edits.push({
			start: node.end - codeOffset,
			end: details.end - codeOffset,
			replacement: ""
		});
	}
	if (recognizedTools.size !== legacyIdentifiers.length || edits.length === 0) return { kind: "unsupported" };
	let rewritten = script;
	for (const edit of edits.toSorted((left, right) => right.start - left.start)) rewritten = `${rewritten.slice(0, edit.start)}${edit.replacement}${rewritten.slice(edit.end)}`;
	return migrateLegacyCronTriggerScript(rewritten).kind === "current" ? {
		kind: "supported",
		script: rewritten
	} : { kind: "unsupported" };
}
//#endregion
//#region src/commands/doctor/cron/store-migration.ts
function cronCodexRuntimePolicyTargetKey(target) {
	return `${target.agentId ?? ""}\u0000${target.modelRef}\u0000${target.legacyModelRef ?? ""}`;
}
function collectStoredCronCodexRuntimePolicyTargets(jobs, blockedModelIdentities) {
	const targets = /* @__PURE__ */ new Map();
	for (const job of jobs) {
		const agentId = normalizeOptionalString(job.agentId);
		const routes = [...collectLegacyOpenAICodexCronModelRoutes(job.payload && typeof job.payload === "object" && !Array.isArray(job.payload) ? job.payload : {}), ...collectLegacyOpenAICodexCronModelRoutes({ model: job.model })];
		for (const route of routes) {
			if (isBlockedLegacyCodexModelRef({
				modelRef: route.legacyModelRef,
				blockedModelIdentities
			})) continue;
			const target = {
				...agentId ? { agentId } : {},
				modelRef: route.canonicalModelRef,
				legacyModelRef: route.legacyModelRef
			};
			targets.set(cronCodexRuntimePolicyTargetKey(target), target);
		}
	}
	return [...targets.values()];
}
function incrementIssue(issues, key) {
	issues[key] = (issues[key] ?? 0) + 1;
}
function normalizeStoredCronJobIdentity(raw) {
	const hadIdKey = "id" in raw;
	const hadJobIdKey = "jobId" in raw;
	const id = normalizeOptionalStringifiedId(raw.id);
	const legacyJobId = normalizeOptionalStringifiedId(raw.jobId);
	const canonicalId = id ?? legacyJobId ?? resolveLegacyCronMigrationId(raw) ?? `cron-${randomUUID()}`;
	const nonStringIdIssue = hadIdKey && raw.id != null && typeof raw.id !== "string";
	const missingIdIssue = !id && !legacyJobId;
	let mutated = false;
	if (raw.id !== canonicalId) {
		raw.id = canonicalId;
		mutated = true;
	}
	if (hadJobIdKey) {
		delete raw.jobId;
		mutated = true;
	}
	return {
		mutated,
		legacyJobIdIssue: hadJobIdKey,
		missingIdIssue,
		nonStringIdIssue
	};
}
/** Normalize persisted cron jobs in place and report issues plus rows to quarantine. */
function normalizeStoredCronJobs(jobs, options = {}) {
	const issues = {};
	const unresolvedAgentTurnCommandPromptJobs = [];
	const unresolvedAgentTurnShellToolPromptJobs = [];
	const legacyTriggerScriptJobs = [];
	const unsupportedLegacyTriggerScriptJobs = [];
	const legacyGatewayExecJobs = [];
	const scheduledToolPolicyMigrations = createScheduledToolPolicyMigrationCollector();
	const unresolvedAgentTurnPromptJobsByKind = {
		commandPromptWithoutShellAccess: unresolvedAgentTurnCommandPromptJobs,
		shellToolPrompt: unresolvedAgentTurnShellToolPromptJobs
	};
	let mutated = false;
	const keptJobs = [];
	const removedJobs = [];
	const codexRuntimePolicyTargets = /* @__PURE__ */ new Map();
	for (const [sourceIndex, raw] of jobs.entries()) {
		const jobIssues = /* @__PURE__ */ new Set();
		const trackIssue = (key) => {
			if (jobIssues.has(key)) return;
			jobIssues.add(key);
			incrementIssue(issues, key);
		};
		const idNorm = normalizeStoredCronJobIdentity(raw);
		if (idNorm.mutated) mutated = true;
		if (idNorm.legacyJobIdIssue) trackIssue("jobId");
		if (idNorm.missingIdIssue) trackIssue("missingId");
		if (idNorm.nonStringIdIssue) trackIssue("nonStringId");
		const state = raw.state;
		if (!state || typeof state !== "object" || Array.isArray(state)) {
			raw.state = {};
			mutated = true;
		}
		if (typeof raw.schedule === "string") {
			raw.schedule = {
				kind: "cron",
				expr: raw.schedule.trim()
			};
			mutated = true;
			trackIssue("legacyScheduleString");
		}
		const nameRaw = raw.name;
		if (typeof nameRaw !== "string" || nameRaw.trim().length === 0) {
			raw.name = inferCronJobName({
				schedule: raw.schedule,
				payload: raw.payload
			});
			mutated = true;
		} else raw.name = nameRaw.trim();
		const trigger = raw.trigger;
		if (isRecord(trigger)) {
			if (typeof trigger.script === "string") {
				const migration = migrateLegacyCronTriggerScript(trigger.script);
				const id = normalizeOptionalString(raw.id);
				const name = normalizeOptionalString(raw.name);
				const jobIdentity = name && id && name !== id ? `${name} (${id})` : name ?? id;
				if (migration.kind === "supported") {
					trigger.script = migration.script;
					mutated = true;
					if (jobIdentity) legacyTriggerScriptJobs.push(jobIdentity);
				} else if (migration.kind === "unsupported" && jobIdentity) unsupportedLegacyTriggerScriptJobs.push(jobIdentity);
			}
		}
		const desc = normalizeOptionalString(raw.description);
		if (raw.description !== desc) {
			raw.description = desc;
			mutated = true;
		}
		if ("sessionKey" in raw) {
			const sessionKey = typeof raw.sessionKey === "string" ? normalizeOptionalString(raw.sessionKey) : void 0;
			if (raw.sessionKey !== sessionKey) {
				raw.sessionKey = sessionKey;
				mutated = true;
			}
		}
		if (typeof raw.enabled !== "boolean") {
			raw.enabled = true;
			mutated = true;
		}
		const wakeModeRaw = normalizeOptionalLowercaseString(raw.wakeMode) ?? "";
		if (wakeModeRaw === "next-heartbeat") {
			if (raw.wakeMode !== "next-heartbeat") {
				raw.wakeMode = "next-heartbeat";
				mutated = true;
			}
		} else if (wakeModeRaw === "now") {
			if (raw.wakeMode !== "now") {
				raw.wakeMode = "now";
				mutated = true;
			}
		} else {
			raw.wakeMode = "now";
			mutated = true;
		}
		const payload = raw.payload;
		if ((!payload || typeof payload !== "object" || Array.isArray(payload)) && inferPayloadIfMissing(raw)) {
			mutated = true;
			trackIssue("legacyTopLevelPayloadFields");
		}
		const payloadRecord = raw.payload && typeof raw.payload === "object" && !Array.isArray(raw.payload) ? raw.payload : null;
		if (payloadRecord) {
			if (normalizePayloadKind(payloadRecord)) {
				mutated = true;
				trackIssue("legacyPayloadKind");
			}
			if (!payloadRecord.kind) {
				if (normalizeOptionalString(payloadRecord.message)) {
					payloadRecord.kind = "agentTurn";
					mutated = true;
					trackIssue("legacyPayloadKind");
				} else if (normalizeOptionalString(payloadRecord.text)) {
					payloadRecord.kind = "systemEvent";
					mutated = true;
					trackIssue("legacyPayloadKind");
				}
			}
			if (payloadRecord.kind === "agentTurn" && copyTopLevelAgentTurnFields(raw, payloadRecord)) mutated = true;
			if (payloadRecord.kind === "systemEvent" && !normalizeOptionalString(payloadRecord.text)) {
				const message = normalizeOptionalString(payloadRecord.message);
				if (message) {
					payloadRecord.text = message;
					delete payloadRecord.message;
					mutated = true;
					trackIssue("legacyPayloadKind");
				}
			}
		}
		const hadLegacyTopLevelPayloadFields = "model" in raw || "thinking" in raw || "timeoutSeconds" in raw || "allowUnsafeExternalContent" in raw || "message" in raw || "text" in raw || "command" in raw || "timeout" in raw;
		const hadLegacyTopLevelDeliveryFields = "deliver" in raw || "channel" in raw || "to" in raw || "threadId" in raw || "bestEffortDeliver" in raw || "provider" in raw;
		if (hadLegacyTopLevelPayloadFields || hadLegacyTopLevelDeliveryFields) {
			stripLegacyTopLevelFields(raw);
			mutated = true;
			if (hadLegacyTopLevelPayloadFields) trackIssue("legacyTopLevelPayloadFields");
			if (hadLegacyTopLevelDeliveryFields) trackIssue("legacyTopLevelDeliveryFields");
		}
		if (payloadRecord) {
			if (Array.isArray(payloadRecord.toolsAllow) && payloadRecord.toolsAllow.some((tool) => typeof tool === "string" && normalizeOptionalLowercaseString(tool) === "gateway_exec")) {
				const name = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
				if (name) legacyGatewayExecJobs.push(name);
			}
			const hadLegacyPayloadProvider = Boolean(normalizeOptionalString(payloadRecord.provider));
			const hadLegacyPayloadCodexModel = hasLegacyOpenAICodexCronModelRef(payloadRecord);
			const hadLegacyTaskSuggestionToolName = hasLegacyToolNameList(payloadRecord.toolsAllow, TASK_SUGGESTION_TOOL_NAME_MIGRATION);
			const hadLegacyImageInspectionToolName = hasLegacyToolNameList(payloadRecord.toolsAllow, IMAGE_INSPECTION_TOOL_NAME_MIGRATION);
			const legacyCodexModelRoutes = collectLegacyOpenAICodexCronModelRoutes(payloadRecord);
			const agentId = normalizeOptionalString(raw.agentId);
			const shouldMigrateCodexModelRef = (modelRef, legacyModelRef) => options.shouldMigrateCodexRuntimePolicyTarget?.({
				...agentId ? { agentId } : {},
				modelRef,
				legacyModelRef
			}) !== false;
			if (hadLegacyPayloadCodexModel) trackIssue("legacyPayloadCodexModel");
			if (hadLegacyTaskSuggestionToolName) trackIssue("legacyTaskSuggestionToolName");
			if (hadLegacyImageInspectionToolName) trackIssue("legacyImageInspectionToolName");
			if (migrateLegacyCronPayload(payloadRecord, {
				migrateCodexModelRefs: options.migrateCodexModelRefs,
				shouldMigrateCodexModelRef
			})) {
				mutated = true;
				if (hadLegacyPayloadProvider) trackIssue("legacyPayloadProvider");
			}
			if (hadLegacyPayloadCodexModel && options.migrateCodexModelRefs === true) for (const route of legacyCodexModelRoutes) {
				const target = {
					...agentId ? { agentId } : {},
					modelRef: route.canonicalModelRef,
					legacyModelRef: route.legacyModelRef
				};
				if (shouldMigrateCodexModelRef(route.canonicalModelRef, route.legacyModelRef)) codexRuntimePolicyTargets.set(cronCodexRuntimePolicyTargetKey(target), target);
			}
			if (migrateLegacyAgentTurnCommandPayload(payloadRecord)) {
				mutated = true;
				trackIssue("legacyAgentTurnCommandPayload");
			} else {
				const unresolvedPromptKind = classifyUnresolvedAgentTurnShellToolPrompt(payloadRecord);
				if (unresolvedPromptKind) {
					trackIssue("unresolvedAgentTurnShellToolPrompt");
					const name = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
					if (name) unresolvedAgentTurnPromptJobsByKind[unresolvedPromptKind].push(name);
				}
			}
		}
		const schedule = raw.schedule;
		if (schedule && typeof schedule === "object" && !Array.isArray(schedule)) {
			const sched = schedule;
			const kind = normalizeOptionalLowercaseString(sched.kind) ?? "";
			const canonicalKind = kind === "at" || kind === "every" || kind === "cron" || kind === "on-exit" || kind === "stream" ? kind : void 0;
			if (canonicalKind && sched.kind !== canonicalKind) {
				sched.kind = canonicalKind;
				mutated = true;
				trackIssue("legacyScheduleKind");
			}
			if (canonicalKind === "stream") {
				const streamMode = normalizeOptionalLowercaseString(sched.mode);
				if ((streamMode === "line" || streamMode === "match") && sched.mode !== streamMode) {
					sched.mode = streamMode;
					mutated = true;
					trackIssue("legacyScheduleKind");
				}
			}
			if (!kind && ("at" in sched || "atMs" in sched)) {
				sched.kind = "at";
				mutated = true;
			}
			const atRaw = normalizeOptionalString(sched.at) ?? "";
			const atMsRaw = sched.atMs;
			const parsedAtMs = typeof atMsRaw === "number" ? atMsRaw : typeof atMsRaw === "string" ? parseAbsoluteTimeMs(atMsRaw) : atRaw ? parseAbsoluteTimeMs(atRaw) : null;
			const parsedAt = parsedAtMs !== null ? timestampMsToIsoString(parsedAtMs) : void 0;
			const fallbackAtMs = !parsedAt && atRaw ? parseAbsoluteTimeMs(atRaw) : null;
			const fallbackAt = fallbackAtMs !== null ? timestampMsToIsoString(fallbackAtMs) : void 0;
			const normalizedAt = parsedAt ?? fallbackAt;
			if (normalizedAt) {
				sched.at = normalizedAt;
				if ("atMs" in sched) delete sched.atMs;
				mutated = true;
			}
			const everyMsRaw = sched.everyMs;
			const everyMsCoerced = coerceFiniteScheduleNumber(everyMsRaw);
			const everyMs = everyMsCoerced !== void 0 ? Math.floor(everyMsCoerced) : null;
			if (everyMs !== null && everyMsRaw !== everyMs) {
				sched.everyMs = everyMs;
				mutated = true;
			}
			if ((kind === "every" || sched.kind === "every") && everyMs !== null) {
				const anchorRaw = sched.anchorMs;
				const anchorCoerced = coerceFiniteScheduleNumber(anchorRaw);
				const normalizedAnchor = anchorCoerced !== void 0 ? Math.max(0, Math.floor(anchorCoerced)) : typeof raw.createdAtMs === "number" && Number.isFinite(raw.createdAtMs) ? Math.max(0, Math.floor(raw.createdAtMs)) : typeof raw.updatedAtMs === "number" && Number.isFinite(raw.updatedAtMs) ? Math.max(0, Math.floor(raw.updatedAtMs)) : null;
				if (normalizedAnchor !== null && anchorRaw !== normalizedAnchor) {
					sched.anchorMs = normalizedAnchor;
					mutated = true;
				}
			}
			const exprRaw = normalizeOptionalString(sched.expr) ?? "";
			const legacyCronRaw = normalizeOptionalString(sched.cron) ?? "";
			let normalizedExpr = exprRaw;
			if (!normalizedExpr && legacyCronRaw) {
				normalizedExpr = legacyCronRaw;
				sched.expr = normalizedExpr;
				mutated = true;
				trackIssue("legacyScheduleCron");
			}
			if (typeof sched.expr === "string" && sched.expr !== normalizedExpr) {
				sched.expr = normalizedExpr;
				mutated = true;
			}
			if ("cron" in sched) {
				delete sched.cron;
				mutated = true;
				trackIssue("legacyScheduleCron");
			}
			if ((kind === "cron" || sched.kind === "cron") && normalizedExpr) {
				const explicitStaggerMs = normalizeCronStaggerMs(sched.staggerMs);
				const defaultStaggerMs = resolveDefaultCronStaggerMs(normalizedExpr);
				const targetStaggerMs = explicitStaggerMs ?? defaultStaggerMs;
				if (targetStaggerMs === void 0) {
					if ("staggerMs" in sched) {
						delete sched.staggerMs;
						mutated = true;
					}
				} else if (sched.staggerMs !== targetStaggerMs) {
					sched.staggerMs = targetStaggerMs;
					mutated = true;
				}
			}
		}
		const delivery = raw.delivery;
		if (delivery && typeof delivery === "object" && !Array.isArray(delivery)) {
			const modeRaw = delivery.mode;
			if (typeof modeRaw === "string") {
				if ((normalizeOptionalLowercaseString(modeRaw) ?? "") === "deliver") {
					delivery.mode = "announce";
					mutated = true;
					trackIssue("legacyDeliveryMode");
				}
			} else if (modeRaw === void 0 || modeRaw === null) {
				delivery.mode = "announce";
				mutated = true;
			}
		}
		const isolation = raw.isolation;
		if (isolation && typeof isolation === "object" && !Array.isArray(isolation)) {
			delete raw.isolation;
			mutated = true;
		}
		const payloadKind = payloadRecord && typeof payloadRecord.kind === "string" ? payloadRecord.kind : "";
		const rawSessionTarget = normalizeOptionalString(raw.sessionTarget) ?? "";
		const loweredSessionTarget = normalizeLowercaseStringOrEmpty(rawSessionTarget);
		if (loweredSessionTarget === "main" || loweredSessionTarget === "isolated" || loweredSessionTarget === "current") {
			const sessionTarget = resolveCronCurrentSessionTarget({
				sessionTarget: loweredSessionTarget,
				sessionKey: normalizeOptionalString(raw.sessionKey)
			});
			if (raw.sessionTarget !== sessionTarget) {
				raw.sessionTarget = sessionTarget;
				mutated = true;
			}
		} else if (loweredSessionTarget.startsWith("session:")) {
			const customSessionId = rawSessionTarget.slice(8).trim();
			if (customSessionId) {
				const normalizedSessionTarget = `session:${customSessionId}`;
				if (raw.sessionTarget !== normalizedSessionTarget) {
					raw.sessionTarget = normalizedSessionTarget;
					mutated = true;
				}
			}
		} else {
			const inferredSessionTarget = payloadKind === "agentTurn" || payloadKind === "command" || payloadKind === "script" ? "isolated" : "main";
			if (raw.sessionTarget !== inferredSessionTarget) {
				raw.sessionTarget = inferredSessionTarget;
				mutated = true;
			}
		}
		const sessionTarget = normalizeOptionalLowercaseString(raw.sessionTarget) ?? "";
		const isIsolatedRunnablePayload = sessionTarget === "isolated" || sessionTarget === "current" || sessionTarget.startsWith("session:") || sessionTarget === "" && (payloadKind === "agentTurn" || payloadKind === "command" || payloadKind === "script");
		const hasDelivery = delivery && typeof delivery === "object" && !Array.isArray(delivery);
		const normalizedLegacy = normalizeLegacyDeliveryInput({
			delivery: hasDelivery ? delivery : null,
			payload: payloadRecord
		});
		if (isIsolatedRunnablePayload && (payloadKind === "agentTurn" || payloadKind === "command" || payloadKind === "script")) {
			if (!hasDelivery && normalizedLegacy.delivery) {
				raw.delivery = normalizedLegacy.delivery;
				mutated = true;
			} else if (!hasDelivery) {
				raw.delivery = { mode: "announce" };
				mutated = true;
			} else if (normalizedLegacy.mutated && normalizedLegacy.delivery) {
				raw.delivery = normalizedLegacy.delivery;
				mutated = true;
			}
		} else if (normalizedLegacy.mutated && normalizedLegacy.delivery) {
			raw.delivery = normalizedLegacy.delivery;
			mutated = true;
		}
		const scheduledPolicyMutated = scheduledToolPolicyMigrations.migrate(raw, (kind) => trackIssue(kind === "owner" ? "reconciledOwnerAccount" : "migratedScheduledToolPolicy"));
		mutated ||= scheduledPolicyMutated;
		const invalidPersistedReason = getInvalidPersistedCronJobReason(raw);
		if (invalidPersistedReason) {
			if (invalidPersistedReason === "missing-schedule" || invalidPersistedReason === "invalid-schedule") trackIssue("invalidSchedule");
			else if (invalidPersistedReason === "missing-payload" || invalidPersistedReason === "invalid-payload") trackIssue("invalidPayload");
			removedJobs.push({
				job: structuredClone(raw),
				reason: invalidPersistedReason,
				sourceIndex
			});
			mutated = true;
			continue;
		}
		keptJobs.push(raw);
	}
	if (keptJobs.length !== jobs.length) jobs.splice(0, jobs.length, ...keptJobs);
	return {
		codexRuntimePolicyTargets: [...codexRuntimePolicyTargets.values()],
		issues,
		unresolvedAgentTurnCommandPromptJobs,
		unresolvedAgentTurnShellToolPromptJobs,
		legacyTriggerScriptJobs,
		unsupportedLegacyTriggerScriptJobs,
		legacyScheduledToolPolicyJobs: scheduledToolPolicyMigrations.legacyJobs,
		invalidScheduledToolPolicyJobs: scheduledToolPolicyMigrations.invalidJobs,
		legacyGatewayExecJobs,
		jobs,
		mutated,
		removedJobs
	};
}
function restoredCronJobId(job) {
	return normalizeOptionalStringifiedId(job.id) ?? normalizeOptionalStringifiedId(job.jobId);
}
/** Revalidate quarantined schedule rows for an explicit Doctor repair. */
function recoverValidQuarantinedCronScheduleJobs(entries, activeJobIds) {
	const recoveredJobs = [];
	const recoveredEntries = [];
	const retainedEntries = [];
	const recoveredJobIds = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		if (entry.reason !== "invalid-schedule" || !isRecord(entry.job)) {
			retainedEntries.push(entry);
			continue;
		}
		const candidate = structuredClone(entry.job);
		const jobId = restoredCronJobId(candidate);
		if (jobId && (activeJobIds.has(jobId) || recoveredJobIds.has(jobId))) {
			retainedEntries.push(entry);
			continue;
		}
		if (isRecord(entry.state)) candidate.state = structuredClone(entry.state);
		if (typeof entry.updatedAtMs === "number" && Number.isFinite(entry.updatedAtMs)) candidate.updatedAtMs = entry.updatedAtMs;
		const normalized = normalizeStoredCronJobs([candidate]);
		if (normalized.jobs.length !== 1 || normalized.removedJobs.length !== 0) {
			retainedEntries.push(entry);
			continue;
		}
		recoveredJobs.push(candidate);
		recoveredEntries.push(entry);
		if (jobId) recoveredJobIds.add(jobId);
	}
	return {
		recoveredJobs,
		recoveredEntries,
		retainedEntries
	};
}
//#endregion
export { archiveLegacyCronFile as a, legacyCronStoreFilesExist as c, recoverValidQuarantinedCronScheduleJobs as i, loadLegacyCronStoreForMigration as l, cronCodexRuntimePolicyTargetKey as n, archiveLegacyCronStoreForMigration as o, normalizeStoredCronJobs as r, assertLegacyCronMigrationSourceCurrent as s, collectStoredCronCodexRuntimePolicyTargets as t, resolveLegacyCronMigrationId as u };
