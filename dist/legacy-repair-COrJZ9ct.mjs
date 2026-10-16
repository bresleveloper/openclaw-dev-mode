import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, u as normalizeOptionalStringifiedId } from "./string-coerce-1VuiLaaR.mjs";
import { n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { a as asOptionalRecord, c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { r as isUpdateRehearsalReadOnlyPath } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { f as syncDirectoryIfSupported } from "./directory-durability-CqSvP1tc.mjs";
import { l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as TASK_SUGGESTION_TOOL_NAME_MIGRATION, t as IMAGE_INSPECTION_TOOL_NAME_MIGRATION } from "./legacy-tool-name-migration-hwNf4VK8.mjs";
import { t as inspectCronOwnerRowsForDoctor } from "./store-inventory-BNU8BqxX.mjs";
import { i as fingerprintCronJobRows } from "./row-codec-DgIrj0Uv.mjs";
import { t as resolveCronJobsStorePath } from "./paths-C7ju4So0.mjs";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BqkZLKq3.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { c as CronJobsStoreChangedError } from "./save.kernel-DXaa8SoK.mjs";
import { n as loadCronJobsStoreWithConfigJobsReadOnly } from "./read-only-BnZqzQN0.mjs";
import { i as loadCronJobsStoreWithConfigJobs, l as saveCronJobsStore, m as saveCronQuarantinedJobs, p as loadCronQuarantinedJobs, t as assertCronJobsStoreUnchanged, u as saveCronJobsStoreChanges } from "./store-ChPMJI5O.mjs";
import { n as assertNoRetiredStateFiles, t as RetiredStateFormatError } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import { t as listRetiredCronStateFiles } from "./state-migrations.retired-cron-files-BfwwvNnu.mjs";
import { a as recoverValidQuarantinedCronScheduleJobs, i as normalizeStoredCronJobs, n as collectStoredCronCodexRuntimePolicyTargets, r as cronCodexRuntimePolicyTargetKey, t as canRepairCronDeliveryForDoctor } from "./store-migration-bjHoqgkQ.mjs";
import { t as countLabel } from "./doctor-state-integrity-format-CGut2D9E.mjs";
import { i as repairRetiredModelSlots, n as repairModelRefAuthProfile, t as createRetiredModelRefRepairResolver } from "./retired-model-ref-repair-Dkf-HCPp.mjs";
import { t as planCronCodexRefRewriteAgainstPersistedConfig } from "./runtime-policy-migration-2PPKA_-b.mjs";
import { n as inspectCronJobOwnersForDoctor, t as backupCronStoreForDoctor } from "./store-repair--ssNPU7z.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
//#region src/commands/doctor/cron/legacy-notify.ts
function migrateLegacyNotifyFallback(params) {
	let changed = false;
	const warnings = [];
	const configuredLegacyWebhook = normalizeOptionalString(params.legacyWebhook);
	const legacyWebhook = configuredLegacyWebhook ? normalizeHttpWebhookUrl(configuredLegacyWebhook) : void 0;
	for (const raw of params.jobs) {
		if (!("notify" in raw)) continue;
		const jobName = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id) ?? "<unnamed>";
		if (!(raw.notify === true)) {
			delete raw.notify;
			changed = true;
			continue;
		}
		const delivery = asNullableRecord(raw.delivery);
		const mode = normalizeOptionalLowercaseString(delivery?.mode);
		const to = normalizeOptionalString(delivery?.to);
		const hasLegacyChatDelivery = mode === void 0 && delivery !== null && (normalizeOptionalString(delivery.channel) !== void 0 || normalizeOptionalString(delivery.accountId) !== void 0 || "threadId" in delivery || to !== void 0 && !normalizeHttpWebhookUrl(to));
		const completionDestination = asNullableRecord(delivery?.completionDestination);
		const completionMode = normalizeOptionalLowercaseString(completionDestination?.mode);
		const completionTo = normalizeOptionalString(completionDestination?.to);
		const validWebhookTo = to ? normalizeHttpWebhookUrl(to) : void 0;
		const validCompletionTo = completionTo ? normalizeHttpWebhookUrl(completionTo) : void 0;
		if (mode === "webhook" && validWebhookTo || completionMode === "webhook" && validCompletionTo) {
			delete raw.notify;
			changed = true;
			continue;
		}
		if (configuredLegacyWebhook && !legacyWebhook) {
			warnings.push(`Automation "${jobName}" still uses legacy notify fallback, but cron.webhook is not a valid HTTP(S) URL so doctor cannot migrate it automatically.`);
			continue;
		}
		if (legacyWebhook && (mode === void 0 && !hasLegacyChatDelivery || mode === "none" || mode === "webhook")) raw.delivery = {
			...delivery,
			mode: "webhook",
			to: mode === "none" ? legacyWebhook : validWebhookTo ?? legacyWebhook
		};
		else if (legacyWebhook) raw.delivery = {
			...delivery,
			...hasLegacyChatDelivery ? { mode: "announce" } : {},
			completionDestination: {
				...completionDestination,
				mode: "webhook",
				to: legacyWebhook
			}
		};
		delete raw.notify;
		changed = true;
	}
	return {
		changed,
		warnings
	};
}
//#endregion
//#region src/commands/doctor/cron/legacy-quarantine-migration.ts
/** Imports shipped cron quarantine sidecars only through the doctor migration boundary. */
/** Resolves the historical sidecar without making it part of the runtime store API. */
function resolveLegacyCronQuarantinePath(storePath) {
	return storePath.endsWith(".json") ? storePath.replace(/\.json$/, "-quarantine.json") : `${storePath}-quarantine.json`;
}
/** Reads and validates a historical quarantine file without modifying its source. */
async function loadLegacyCronQuarantineForMigration(storePath) {
	const quarantinePath = resolveLegacyCronQuarantinePath(storePath);
	let raw;
	try {
		raw = await fs.readFile(quarantinePath, "utf-8");
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	const parsed = parseJsonWithJson5Fallback(raw);
	if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.jobs)) throw new Error(`Unsupported cron quarantine file shape at ${quarantinePath}`);
	const jobs = parsed.jobs.map((entry, index) => {
		if (!isRecord(entry) || typeof entry.reason !== "string" || !isRecord(entry.job) && !("raw" in entry)) throw new Error(`Unsupported cron quarantine entry at ${quarantinePath} index ${index}`);
		const quarantined = {
			quarantinedAtMs: typeof entry.quarantinedAtMs === "number" && Number.isFinite(entry.quarantinedAtMs) ? entry.quarantinedAtMs : Date.now(),
			sourceIndex: typeof entry.sourceIndex === "number" ? entry.sourceIndex : -1,
			reason: entry.reason
		};
		if (isRecord(entry.job)) quarantined.job = entry.job;
		if ("raw" in entry) quarantined.raw = entry.raw;
		if (isRecord(entry.state)) quarantined.state = entry.state;
		if (typeof entry.updatedAtMs === "number" && Number.isFinite(entry.updatedAtMs)) quarantined.updatedAtMs = entry.updatedAtMs;
		if (typeof entry.scheduleIdentity === "string") quarantined.scheduleIdentity = entry.scheduleIdentity;
		return quarantined;
	});
	return {
		path: quarantinePath,
		sourceSha256: createHash("sha256").update(raw).digest("hex"),
		jobs
	};
}
//#endregion
//#region src/commands/doctor/cron/quarantine-archive.ts
const LEGACY_CRON_ARCHIVE_SUFFIX = ".migrated";
async function legacyCronFileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT")) return false;
		throw err;
	}
}
async function sha256File(filePath) {
	return createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
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
		if (hasErrnoCode(err, "EXDEV")) {
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
			if (!hasErrnoCode(err, "EEXIST") || !useNumberedArchive) throw err;
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
		let cleanupReason = "";
		if (archiveCreated) {
			let archiveRemoved = false;
			try {
				try {
					await fs.unlink(archivePath);
				} catch (cleanupErr) {
					if (!hasErrnoCode(cleanupErr, "ENOENT")) throw cleanupErr;
				}
				archiveRemoved = true;
				await syncDirectoryIfSupported(path.dirname(archivePath));
			} catch (cleanupErr) {
				cleanupReason = archiveRemoved ? `; the partial archive was removed, but cleanup directory sync failed: ${formatErrorMessage(cleanupErr)}` : `; partial archive remains at ${archivePath} because cleanup failed: ${formatErrorMessage(cleanupErr)}`;
			}
		}
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
	if (isUpdateRehearsalReadOnlyPath(filePath, process.env)) return {
		ok: false,
		deferred: true,
		reason: `Update rehearsal retained legacy cron source at ${filePath}; Doctor will archive it during the live update.`
	};
	try {
		await fs.rename(filePath, archivePath);
	} catch (err) {
		if (!hasErrnoCode(err, "EXDEV")) return {
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
//#endregion
//#region src/commands/doctor/cron/repair-plan.ts
function formatJobNameList(names) {
	const preview = names.slice(0, 5).map((name) => `\`${name}\``);
	const remaining = names.length - preview.length;
	return remaining > 0 ? `: ${preview.join(", ")} (+${remaining} more)` : `: ${preview.join(", ")}`;
}
/**
* Advisory for isolated agentTurn cron jobs that describe a command but cannot access shell tools.
* These need operator attention, but `doctor --fix` cannot safely infer whether to grant tool
* access or recreate them as command cron jobs.
*/
function formatUnresolvedCommandPromptAdvisory(names) {
	if (names.length === 0) return null;
	const describeVerb = names.length === 1 ? "describes" : "describe";
	const accessVerb = names.length === 1 ? "lacks" : "lack";
	return [
		`${countLabel(names.length, "isolated automation")} ${describeVerb} a shell command in the agent prompt but ${accessVerb} shell/process tool access${formatJobNameList(names)}.`,
		"- This is not the supported shell-tool prompt shape, so doctor cannot prove the job will execute the requested command.",
		"- Recreate it as a command automation (`openclaw automations add ... --command \"<shell>\"`) or grant explicit shell/process tool access before relying on it."
	].join("\n");
}
/**
* Advisory for isolated agentTurn cron jobs that drive shell/process tools from the prompt.
* These keep running and are not a legacy store row, so `doctor --fix` cannot rewrite them;
* routing this through the auto-repair preview made the finding persist after every --fix.
*/
function formatUnresolvedShellPromptAdvisory(names) {
	if (names.length === 0) return null;
	const verb = names.length === 1 ? "drives" : "drive";
	const keepVerb = names.length === 1 ? "keeps" : "keep";
	return [
		`${countLabel(names.length, "isolated automation")} ${verb} shell/process tools from the agent prompt and ${keepVerb} running as-is${formatJobNameList(names)}.`,
		"- This is a supported shape, not a legacy store row, so the doctor fix path cannot convert it and the finding is informational only.",
		"- For a deterministic run, recreate it as a command automation (`openclaw automations add ... --command \"<shell>\"`)."
	].join("\n");
}
/** Advisory for jobs whose scheduled authority cannot be recovered without a caller decision. */
function formatScheduledToolPolicyAdvisory(params) {
	const lines = [];
	if (params.legacyJobs.length > 0) lines.push(`${countLabel(params.legacyJobs.length, "tool-bearing cron job")} ${params.legacyJobs.length === 1 ? "keeps" : "keep"} legacy sender-policy resolution because an explicit tool cap or provable stored account identity is missing${formatJobNameList(params.legacyJobs)}.`);
	if (params.invalidJobs.length > 0) lines.push(`${countLabel(params.invalidJobs.length, "tool-bearing cron job")} ${params.invalidJobs.length === 1 ? "has" : "have"} invalid or inconsistent scheduled authority provenance${formatJobNameList(params.invalidJobs)}.`);
	if (lines.length === 0) return null;
	lines.push("- These jobs continue through restrictive sender-policy resolution; doctor will not infer authority from delivery or current configuration.", "- Reauthorize with an exact explicit cap: `openclaw cron edit <id> --tools <tool,...>`.");
	return lines.join("\n");
}
/** Advisory for alias-only jobs whose original exec authority cannot be proven from storage. */
function formatLegacyGatewayExecAdvisory(names) {
	if (names.length === 0) return null;
	return [
		`${countLabel(names.length, "automation")} ${names.length === 1 ? "grants" : "grant"} the retired \`gateway_exec\` alias${formatJobNameList(names)}.`,
		"- Doctor will not convert this alias to `exec` because the stored name does not prove its original producer or approval restrictions.",
		"- Recreate the automation from a fresh authenticated creator turn, or explicitly reauthorize its complete tool cap from a trusted operator shell."
	].join("\n");
}
function formatLegacyIssuePreview(issues) {
	const descriptions = {
		jobId: "still uses legacy `jobId`",
		missingId: "is missing a canonical string `id`",
		nonStringId: "stores `id` as a non-string value",
		legacyScheduleString: "stores schedule as a bare string",
		legacyScheduleCron: "still uses `schedule.cron`",
		legacyScheduleKind: "stores a non-canonical schedule `kind` or stream `mode` that will be normalized",
		legacyPayloadKind: "needs payload kind normalization",
		legacyPayloadCodexModel: "still uses legacy `openai-codex/*` cron model refs",
		legacyTaskSuggestionToolName: `still grants legacy tool \`${TASK_SUGGESTION_TOOL_NAME_MIGRATION.legacyName}\`; doctor will rename it to \`${TASK_SUGGESTION_TOOL_NAME_MIGRATION.canonicalName}\``,
		legacyImageInspectionToolName: `still relies on legacy \`${IMAGE_INSPECTION_TOOL_NAME_MIGRATION.legacyName}\` coverage; doctor will preserve equivalent \`${IMAGE_INSPECTION_TOOL_NAME_MIGRATION.canonicalName}\` access`,
		legacyAgentTurnCommandPayload: "uses an agent prompt to run a shell command",
		legacyPayloadProvider: "still uses payload `provider` as a delivery alias",
		legacyTopLevelPayloadFields: "still uses top-level payload fields",
		legacyTopLevelDeliveryFields: "still uses top-level delivery fields",
		legacyDeliveryMode: "still uses delivery mode `deliver`",
		migratedScheduledToolPolicy: "can recover scheduled account authority from persisted owner identity",
		reconciledOwnerAccount: "can reconcile its owner account from persisted creator identity without changing tool permissions",
		invalidSchedule: "has an invalid persisted schedule and will be removed",
		invalidPayload: "has an invalid persisted payload and will be removed"
	};
	const lines = [];
	for (const [key, description] of Object.entries(descriptions)) {
		const count = issues[key];
		if (count) lines.push(`- ${countLabel(count, "job")} ${description}`);
	}
	return lines;
}
function mergeRuntimeEntryIntoConfigJob(params) {
	return {
		...params.job,
		...params.runtimeEntry?.updatedAtMs !== void 0 ? { updatedAtMs: params.runtimeEntry.updatedAtMs } : {},
		...params.runtimeEntry?.state ? { state: structuredClone(params.runtimeEntry.state) } : {}
	};
}
//#endregion
//#region src/commands/doctor/cron/schema-safety.ts
function assertCronStateSchemaSupported(env) {
	withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(() => void 0, { env });
}
async function assertCronStateSchemaSupportedAsync(env) {
	await withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(() => void 0, { env });
}
function rethrowSqliteSchemaVersionError(error) {
	if (isSqliteSchemaVersionError(error)) throw error;
}
//#endregion
//#region src/commands/doctor/cron/legacy-repair.ts
function readLegacyCronStorePath(cfg) {
	return cfg.cron?.store;
}
function projectCronOwner(job, runtimeDefaultAgentId) {
	const explicitAgentId = normalizeOptionalString(job.agentId) ?? parseAgentSessionKey(normalizeOptionalString(job.sessionKey))?.agentId;
	if (explicitAgentId) return {
		kind: "explicit",
		agentId: explicitAgentId
	};
	return runtimeDefaultAgentId ? {
		kind: "runtime-default",
		agentId: runtimeDefaultAgentId
	} : { kind: "unresolved" };
}
async function loadLegacyCronRepairState(params) {
	const storePath = params.storePath ?? resolveCronJobsStorePath(readLegacyCronStorePath(params.cfg), params.env);
	await assertCronStateSchemaSupportedAsync(params.env);
	assertNoRetiredStateFiles("Cron state", await listRetiredCronStateFiles(storePath));
	const legacyQuarantine = await loadLegacyCronQuarantineForMigration(storePath);
	if (params.onlyIfLegacyDetected && !legacyQuarantine) return null;
	let persistedQuarantine;
	try {
		persistedQuarantine = await loadCronQuarantinedJobs(storePath, params.env);
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		persistedQuarantine = [];
	}
	const loaded = params.readOnly ? await loadCronJobsStoreWithConfigJobsReadOnly(storePath, params.env) : await loadCronJobsStoreWithConfigJobs(storePath);
	const runtimeDefaultAgentId = tryResolveAmbientOwnerAgentId(params.cfg);
	const projectedOwnersByJobId = new Map(loaded.store.jobs.map((job) => [job.id, projectCronOwner(job, runtimeDefaultAgentId)]));
	const ownerRows = await inspectCronJobOwnersForDoctor({ env: params.env ?? process.env }, storePath);
	if (loaded.jobsFingerprint !== void 0 && fingerprintCronJobRows(ownerRows) !== loaded.jobsFingerprint) throw new CronJobsStoreChangedError(storePath);
	const sqlOwners = new Map(ownerRows.flatMap((row) => {
		const agentId = normalizeOptionalString(row.agent_id);
		return agentId ? [[row.job_id, agentId]] : [];
	}));
	for (const [jobId, agentId] of sqlOwners) if (projectedOwnersByJobId.get(jobId)?.kind !== "explicit") projectedOwnersByJobId.set(jobId, {
		kind: "explicit",
		agentId
	});
	const invalidConfigRows = [...loaded.invalidConfigRows];
	const currentJobs = loaded.configJobs.length > 0 ? loaded.configJobs.map((job, index) => mergeRuntimeEntryIntoConfigJob({
		job,
		runtimeEntry: loaded.configJobRuntimeEntries[index]
	})) : loaded.store.jobs;
	for (const job of currentJobs) {
		const jobId = normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
		const sqlOwner = jobId ? sqlOwners.get(jobId) : void 0;
		if (sqlOwner && canRepairCronDeliveryForDoctor(job.delivery) && projectCronOwner(job, void 0).kind === "unresolved") job.agentId = sqlOwner;
	}
	return {
		storePath,
		legacyQuarantine,
		invalidConfigRows,
		persistedQuarantine,
		projectedOwnersByJobId,
		rawJobs: currentJobs,
		jobsFingerprint: loaded.jobsFingerprint,
		ownerRows
	};
}
async function applyLegacyCronStoreRepair(params) {
	assertCronStateSchemaSupported();
	assertNoRetiredStateFiles("Cron state", await listRetiredCronStateFiles(params.state.storePath));
	assertCronStateSchemaSupported();
	const { state } = params;
	const changes = [];
	const warnings = [];
	const resolveRetired = params.repairRetiredModelRefs === true ? createRetiredModelRefRepairResolver({
		cfg: params.cfg,
		checkModelPolicy: true,
		retiredModelRefConfig: params.retiredModelRefConfig,
		authProfileIdMap: params.authProfileIdMap,
		warnings
	}) : params.authProfileIdMap?.size ? ({ modelRef }) => repairModelRefAuthProfile(modelRef, params.authProfileIdMap) : void 0;
	const quarantineEntriesToRevalidate = params.recoverQuarantinedScheduleJobs === true ? [...state.persistedQuarantine, ...state.legacyQuarantine?.jobs ?? []] : [];
	const persistedQuarantineEntrySet = new Set(state.persistedQuarantine);
	const quarantineRecovery = recoverValidQuarantinedCronScheduleJobs(quarantineEntriesToRevalidate, new Set(state.rawJobs.map((job) => normalizeOptionalStringifiedId(job.id)).filter((id) => id !== void 0)));
	if (quarantineRecovery.recoveredJobs.length > 0) state.rawJobs.push(...quarantineRecovery.recoveredJobs);
	const runtimePolicyPlan = params.migrateCodexModelRefs === true ? planCronCodexRefRewriteAgainstPersistedConfig({
		cfg: params.cfg,
		targets: collectStoredCronCodexRuntimePolicyTargets(state.rawJobs),
		blockedModelIdentities: params.blockedModelIdentities,
		resolveFinalModelRef: resolveRetired
	}) : void 0;
	warnings.push(...runtimePolicyPlan?.warnings ?? []);
	const blockedRuntimePolicyTargets = new Set((runtimePolicyPlan?.blockedTargets ?? []).map(cronCodexRuntimePolicyTargetKey));
	const normalized = params.normalized && quarantineRecovery.recoveredJobs.length === 0 ? params.normalized : normalizeStoredCronJobs(state.rawJobs, {
		migrateCodexModelRefs: params.migrateCodexModelRefs,
		shouldMigrateCodexRuntimePolicyTarget: (target) => !blockedRuntimePolicyTargets.has(cronCodexRuntimePolicyTargetKey(target))
	});
	warnings.push(...normalized.unsupportedLegacyTriggerScriptJobs.map((job) => `Cron trigger script for ${job} uses legacy Code Mode APIs that cannot be safely converted; inspect the automation and update its trigger script manually to use direct tool calls.`));
	warnings.push(...normalized.unsupportedDeliveryModeJobs.map((job) => `Cron job ${job} has an unsupported delivery mode. Review its intended delivery and set mode to "none", "announce", or "webhook"; Doctor cannot infer the intended route.`));
	const legacyWebhook = normalizeOptionalString(params.cfg.cron?.webhook);
	const notifyMigration = migrateLegacyNotifyFallback({
		jobs: state.rawJobs.filter((job) => canRepairCronDeliveryForDoctor(job.delivery)),
		legacyWebhook
	});
	warnings.push(...notifyMigration.warnings);
	const retirementChanges = [];
	if (resolveRetired) for (const job of state.rawJobs) {
		if (!canRepairCronDeliveryForDoctor(job.delivery)) continue;
		const payload = asOptionalRecord(job.payload);
		const jobId = normalizeOptionalStringifiedId(job.id);
		if (!payload || !jobId) continue;
		const projectedOwner = state.projectedOwnersByJobId.get(jobId);
		const agentId = normalizeOptionalString(job.agentId) ?? (projectedOwner && projectedOwner.kind !== "unresolved" ? projectedOwner.agentId : tryResolveAmbientOwnerAgentId(params.cfg));
		if (!agentId && params.repairRetiredModelRefs) warnings.push(`Skipped retired model repair for cron job "${jobId}": select its owning agent, then rerun openclaw doctor --fix.`);
		const beforeChanges = retirementChanges.length;
		repairRetiredModelSlots({
			owner: payload,
			path: `cron.${jobId}.payload`,
			agentId,
			authProfileOnly: !agentId,
			resolve: resolveRetired,
			changes: retirementChanges
		});
		if (retirementChanges.length > beforeChanges && asOptionalRecord(job.state)?.autoDisabled) {
			const jobName = normalizeOptionalString(job.name) ?? jobId;
			retirementChanges.push(`Automation "${jobName}" remains auto-disabled. Run openclaw automations enable ${jobId} to resume it after this repair.`);
		}
	}
	const storeChanged = retirementChanges.length > 0 || state.invalidConfigRows.length > 0 || normalized.mutated || notifyMigration.changed || quarantineRecovery.recoveredJobs.length > 0;
	if (!(state.legacyQuarantine !== void 0 || storeChanged) && warnings.length === 0) return {
		changes,
		warnings
	};
	const quarantineEntries = [
		...params.recoverQuarantinedScheduleJobs === true ? quarantineRecovery.retainedEntries.filter((entry) => !persistedQuarantineEntrySet.has(entry)) : state.legacyQuarantine?.jobs ?? [],
		...state.invalidConfigRows,
		...normalized.removedJobs.map((entry) => ({
			sourceIndex: entry.sourceIndex,
			reason: entry.reason,
			job: entry.job
		}))
	];
	const quarantine = quarantineEntries.length > 0 ? {
		entries: quarantineEntries,
		nowMs: Date.now()
	} : void 0;
	const deleteQuarantineEntries = quarantineRecovery.recoveredEntries.filter((entry) => persistedQuarantineEntrySet.has(entry));
	if (storeChanged || quarantine) try {
		if (storeChanged) {
			const store = {
				version: 1,
				jobs: state.rawJobs
			};
			const source = captureOpenClawStateReadContext();
			const assertCurrent = () => {
				source.admission.assertCurrent();
				source.maintenanceScope?.assertDatabaseAccess(source.admission.databasePath);
			};
			const assertSnapshotCurrent = (db) => {
				assertCurrent();
				if (!isDeepStrictEqual(inspectCronOwnerRowsForDoctor(db, cronStoreKey(state.storePath)), state.ownerRows)) throw new CronJobsStoreChangedError(state.storePath);
				if (state.jobsFingerprint !== void 0) assertCronJobsStoreUnchanged(db, state.storePath, state.jobsFingerprint);
			};
			const saveOptions = {
				...quarantine ? { quarantine } : {},
				...deleteQuarantineEntries.length > 0 ? { deleteQuarantineEntries } : {},
				preserveRuntimeState: true
			};
			if (state.ownerRows.length > 0 || state.persistedQuarantine.length > 0) {
				const backupPath = await backupCronStoreForDoctor({ env: process.env }, {
					assertCurrent,
					assertRowsUnchanged: assertSnapshotCurrent
				});
				changes.push(`Saved pre-repair cron backup: ${backupPath}`);
			}
			await saveCronJobsStore(state.storePath, store, {
				...saveOptions,
				transactionHooks: { beforeWrite: assertSnapshotCurrent }
			});
		} else if (quarantine) await saveCronQuarantinedJobs({
			storePath: state.storePath,
			...quarantine
		});
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		const failure = collectErrorGraphCandidates(err, (current) => [current.cause]).some((cause) => cause instanceof CronJobsStoreChangedError) ? `Cron store at ${shortenHomePath(state.storePath)} changed while doctor was waiting, so no rows were rewritten; re-run ${formatCliCommand("openclaw doctor --fix")} to repair from a fresh snapshot.` : `Failed writing migrated cron store at ${shortenHomePath(state.storePath)}: ${formatErrorMessage(err)}`;
		return {
			changes,
			warnings: [...warnings, failure]
		};
	}
	changes.push(...retirementChanges);
	if (normalized.issues.reconciledOwnerAccount) changes.push(`Reconciled ${countLabel(normalized.issues.reconciledOwnerAccount, "cron job owner account")} from persisted creator identity; existing tool permissions were preserved.`);
	if (quarantineRecovery.recoveredJobs.length > 0) changes.push(`Recovered ${countLabel(quarantineRecovery.recoveredJobs.length, "quarantined automation")} after current schedule validation passed.`);
	if (state.legacyQuarantine) {
		const archiveResult = await archiveLegacyCronFile(state.legacyQuarantine.path, state.legacyQuarantine.sourceSha256);
		if (archiveResult.ok) changes.push(`Cron quarantine migrated to SQLite from ${shortenHomePath(state.legacyQuarantine.path)}.`);
		else warnings.push(archiveResult.deferred ? archiveResult.reason : `Migrated quarantined automations to SQLite but could not archive the legacy cron file at ${shortenHomePath(state.legacyQuarantine.path)}: ${archiveResult.reason}. Remove it manually or rerun ${formatCliCommand("openclaw doctor --fix")} to retry.`);
	}
	if (storeChanged) changes.push(`Cron store normalized at ${shortenHomePath(state.storePath)}.`);
	if (normalized.legacyTriggerScriptJobs.length > 0) changes.push(`Rewrote ${countLabel(normalized.legacyTriggerScriptJobs.length, "legacy cron trigger script")} to canonical direct tool calls: ${normalized.legacyTriggerScriptJobs.join(", ")}.`);
	return {
		changes,
		warnings,
		codexRuntimePolicyTargets: normalized.codexRuntimePolicyTargets
	};
}
async function repairLegacyCronStoreWithoutPrompt(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	let state;
	try {
		state = await loadLegacyCronRepairState({
			cfg: params.cfg,
			onlyIfLegacyDetected: true
		});
	} catch (err) {
		if (err instanceof RetiredStateFormatError) throw err;
		rethrowSqliteSchemaVersionError(err);
		return {
			changes: [],
			warnings: [`Failed reading legacy cron storage at ${shortenHomePath(storePath)}: ${formatErrorMessage(err)}`]
		};
	}
	if (!state) return {
		changes: [],
		warnings: []
	};
	return await applyLegacyCronStoreRepair({
		...params,
		state
	});
}
/** Read legacy Codex cron targets without changing either cron storage or config. */
async function collectCronCodexRuntimePolicyTargetsReadOnly(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	try {
		const state = await loadLegacyCronRepairState({
			cfg: params.cfg,
			readOnly: true
		});
		return {
			targets: state ? collectStoredCronCodexRuntimePolicyTargets(state.rawJobs) : [],
			warnings: []
		};
	} catch (err) {
		if (err instanceof RetiredStateFormatError) throw err;
		rethrowSqliteSchemaVersionError(err);
		return {
			targets: [],
			warnings: [`Failed reading cron storage at ${shortenHomePath(storePath)} while planning Codex model migration: ${formatErrorMessage(err)}`]
		};
	}
}
/** Commit Codex cron refs only after their model-scoped config policy is durable. */
async function repairCronCodexModelRefsAfterConfigWrite(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	try {
		if (!params.migrateCodexModelRefs && !params.repairRetiredModelRefs) {
			const loaded = await loadCronJobsStoreWithConfigJobsReadOnly(storePath);
			const { store } = loaded;
			const repaired = structuredClone(store);
			const changes = [];
			for (const [index, job] of repaired.jobs.entries()) {
				const { runtimeAuthority: _embeddedAuthority, runtimeAuthorityRecoveryRequired: _embeddedRecovery, ...config } = loaded.configJobs[index];
				const candidate = Object.assign(structuredClone(job), mergeRuntimeEntryIntoConfigJob({
					job: structuredClone(config),
					runtimeEntry: loaded.configJobRuntimeEntries[index]
				}));
				const before = changes.length;
				repairRetiredModelSlots({
					owner: candidate.payload,
					path: `cron.${job.id}.payload`,
					authProfileOnly: true,
					resolve: ({ modelRef }) => repairModelRefAuthProfile(modelRef, params.authProfileIdMap),
					changes
				});
				if (changes.length > before) repaired.jobs[index] = candidate;
			}
			await saveCronJobsStoreChanges(storePath, store, repaired);
			return {
				changes,
				warnings: []
			};
		}
		const state = await loadLegacyCronRepairState({ cfg: params.cfg });
		return state ? await applyLegacyCronStoreRepair({
			...params,
			state
		}) : {
			changes: [],
			warnings: []
		};
	} catch (err) {
		if (err instanceof RetiredStateFormatError) throw err;
		rethrowSqliteSchemaVersionError(err);
		return {
			changes: [],
			warnings: [`Failed reading cron storage at ${shortenHomePath(storePath)} while committing Codex model migration: ${formatErrorMessage(err)}`]
		};
	}
}
//#endregion
export { repairLegacyCronStoreWithoutPrompt as a, formatLegacyIssuePreview as c, formatUnresolvedShellPromptAdvisory as d, repairCronCodexModelRefsAfterConfigWrite as i, formatScheduledToolPolicyAdvisory as l, collectCronCodexRuntimePolicyTargetsReadOnly as n, rethrowSqliteSchemaVersionError as o, loadLegacyCronRepairState as r, formatLegacyGatewayExecAdvisory as s, applyLegacyCronStoreRepair as t, formatUnresolvedCommandPromptAdvisory as u };
