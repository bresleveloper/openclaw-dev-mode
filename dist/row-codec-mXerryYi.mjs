import { f as asSafeIntegerInRange, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import { n as sha256Base64Url } from "./crypto-digest-D9Nqq3c7.mjs";
import { n as normalizeCronJobInput } from "./normalize-_k1oAXPq.mjs";
import { a as normalizeCronToolsAllowExecTarget, l as restoreCronPinnedExecGrant, o as normalizeCronToolsAllowExecTargetRequirement, u as stripCronPinnedExecGrant } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { t as coerceFiniteScheduleNumber } from "./schedule-number-sXnjd9Sk.mjs";
import { t as normalizeCronStaggerMs } from "./stagger-wESOTFE0.mjs";
import { n as getInvalidPersistedCronJobReason } from "./persisted-shape-C0aWTtcm.mjs";
import { t as parseCronPacingBounds } from "./pacing-DuamEQSm.mjs";
import { n as CRON_JOB_READ_COLUMNS, r as getCronStoreKysely, t as CRON_JOB_GENERATION_READ_COLUMNS } from "./schema-BUdLKyI9.mjs";
//#region src/cron/definition-hash.ts
/** Hashes one canonical cron definition while preserving meaningful env-key order. */
function hashCronJobDefinition(definition) {
	const payload = isRecord(definition.payload) ? definition.payload : void 0;
	const env = payload && isRecord(payload.env) ? payload.env : void 0;
	if (payload?.kind !== "command" || !env) return `sha256:${sha256Base64Url(stableStringify(definition))}`;
	const foldedKeys = /* @__PURE__ */ new Set();
	if (!Object.keys(env).some((key) => {
		const folded = key.toLowerCase();
		if (foldedKeys.has(folded)) return true;
		foldedKeys.add(folded);
		return false;
	})) return `sha256:${sha256Base64Url(stableStringify(definition))}`;
	const { env: _env, ...payloadWithoutEnv } = payload;
	const orderedDefinition = {
		...definition,
		payload: {
			...payloadWithoutEnv,
			envEntries: Object.entries(env)
		}
	};
	return `sha256:${sha256Base64Url(stableStringify(orderedDefinition))}`;
}
//#endregion
//#region src/cron/normalize-job-identity.ts
/** Repairs legacy cron job identity fields into the canonical id shape. */
/** Normalizes mutable cron job rows from old `jobId` storage into the canonical `id` field. */
function normalizeCronJobIdentityFields(raw) {
	const rawId = normalizeOptionalString(raw.id) ?? "";
	const legacyJobId = normalizeOptionalString(raw.jobId) ?? "";
	const hadJobIdKey = "jobId" in raw;
	const normalizedId = rawId || legacyJobId;
	const idChanged = Boolean(normalizedId && raw.id !== normalizedId);
	if (idChanged) raw.id = normalizedId;
	if (hadJobIdKey) delete raw.jobId;
	return {
		mutated: idChanged || hadJobIdKey,
		legacyJobIdIssue: hadJobIdKey
	};
}
//#endregion
//#region src/cron/schedule-identity.ts
/** Builds stable identities for cron scheduling inputs. */
function readScheduleTime(record, key) {
	return coerceFiniteScheduleNumber(record[key]);
}
function readScheduleInteger(record, key) {
	const parsed = parseStrictFiniteNumber(record[key]);
	return asSafeIntegerInRange(parsed, {
		min: Number.MIN_SAFE_INTEGER,
		max: Number.MAX_SAFE_INTEGER
	});
}
function schedulePayloadFromRecord(schedule) {
	const rawKind = normalizeOptionalString(schedule.kind)?.toLowerCase();
	const expr = normalizeOptionalString(schedule.expr);
	const at = normalizeOptionalString(schedule.at);
	const everyMs = readScheduleTime(schedule, "everyMs");
	const anchorMs = readScheduleTime(schedule, "anchorMs");
	const tz = normalizeOptionalString(schedule.tz);
	const staggerMs = normalizeCronStaggerMs(schedule.staggerMs);
	const kind = rawKind === "at" || rawKind === "every" || rawKind === "cron" || rawKind === "on-exit" || rawKind === "stream" ? rawKind : at ? "at" : everyMs !== void 0 ? "every" : expr ? "cron" : void 0;
	if (kind === "at") return at ? {
		kind: "at",
		at
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
	if (kind === "on-exit") {
		const command = normalizeOptionalString(schedule.command);
		return command ? {
			kind: "on-exit",
			command,
			cwd: normalizeOptionalString(schedule.cwd)
		} : void 0;
	}
	if (kind === "stream") {
		const command = schedule.command;
		if (!Array.isArray(command) || command.length === 0 || command.some((entry) => typeof entry !== "string" || entry.length === 0)) return;
		const mode = normalizeOptionalString(schedule.mode);
		return {
			kind: "stream",
			command: [...command],
			cwd: normalizeOptionalString(schedule.cwd),
			mode: mode === "line" || mode === "match" ? mode : void 0,
			match: typeof schedule.match === "string" ? schedule.match : void 0,
			batchMs: readScheduleInteger(schedule, "batchMs"),
			maxBatchBytes: readScheduleInteger(schedule, "maxBatchBytes")
		};
	}
}
function resolvePacingPayload(job) {
	if (job.pacing === void 0 || job.pacing === null) return;
	if (typeof job.pacing !== "object" || Array.isArray(job.pacing)) return null;
	const pacing = job.pacing;
	const min = normalizeOptionalString(pacing.min);
	const max = normalizeOptionalString(pacing.max);
	try {
		return parseCronPacingBounds({
			min,
			max
		});
	} catch {
		return null;
	}
}
/** Builds a stable scheduling identity for deciding whether stored timer state is still valid. */
function tryCronScheduleIdentity(job) {
	const schedule = job.schedule && typeof job.schedule === "object" && !Array.isArray(job.schedule) ? schedulePayloadFromRecord(job.schedule) : void 0;
	const pacing = resolvePacingPayload(job);
	if (!schedule || pacing === null) return;
	return JSON.stringify({
		version: 2,
		enabled: typeof job.enabled === "boolean" ? job.enabled : true,
		schedule,
		pacing,
		hasTrigger: job.trigger !== void 0 && job.trigger !== null
	});
}
/** Compares two cron jobs by the normalized inputs that affect next-run computation. */
function cronSchedulingInputsEqual(previous, next) {
	const previousIdentity = tryCronScheduleIdentity(previous);
	const nextIdentity = tryCronScheduleIdentity(next);
	return previousIdentity !== void 0 && previousIdentity === nextIdentity;
}
//#endregion
//#region src/cron/store/delivery-codec.ts
/** JSON codec for cron delivery configuration and explicit destination clears. */
const FAILURE_DESTINATION_FIELDS = [
	"channel",
	"to",
	"accountId",
	"mode"
];
/** Encodes explicitly undefined failure overrides as durable JSON null values. */
function deliveryToJson(delivery) {
	const failureDestination = delivery.failureDestination;
	if (!failureDestination) return { ...delivery };
	return {
		...delivery,
		failureDestination: Object.fromEntries(FAILURE_DESTINATION_FIELDS.filter((field) => Object.hasOwn(failureDestination, field)).map((field) => [field, failureDestination[field] ?? null]))
	};
}
/** Restores JSON null overrides as present-but-undefined runtime properties. */
function deliveryFromJson(value) {
	if (!isRecord(value) || value.mode !== "none" && value.mode !== "announce" && value.mode !== "webhook") return;
	const failureDestination = value.failureDestination;
	if (!isRecord(failureDestination)) return value;
	return {
		...value,
		failureDestination: Object.fromEntries(FAILURE_DESTINATION_FIELDS.filter((field) => Object.hasOwn(failureDestination, field)).map((field) => [field, failureDestination[field] ?? void 0]))
	};
}
//#endregion
//#region src/cron/store/scalar-codec.ts
function tryParseJsonObject(raw) {
	const parsed = safeParseJson(raw);
	return isRecord(parsed) ? parsed : void 0;
}
//#endregion
//#region src/cron/store/row-codec.ts
function stripJobRuntimeFields(job) {
	const { runtimeAuthority: _runtimeAuthority, runtimeAuthorityRecoveryRequired: _runtimeAuthorityRecoveryRequired, state: _state, updatedAtMs: _updatedAtMs, ...rest } = job;
	const payload = isRecord(rest.payload) ? rest.payload : void 0;
	const toolsAllow = Array.isArray(payload?.toolsAllow) ? payload.toolsAllow.filter((tool) => typeof tool === "string") : void 0;
	const storedToolsAllow = stripCronPinnedExecGrant({
		toolsAllow,
		requirement: rest.toolsAllowExecTargetRequirement
	});
	return {
		...rest,
		...payload && storedToolsAllow ? { payload: {
			...payload,
			toolsAllow: storedToolsAllow
		} } : {},
		...rest.delivery ? { delivery: deliveryToJson(rest.delivery) } : {},
		state: {}
	};
}
function resolveCronJobGrantDefinitionRevision(job) {
	const storedDefinition = tryParseJsonObject(JSON.stringify(stripJobRuntimeFields(job)));
	if (!storedDefinition) throw new Error(`Cannot canonicalize cron job ${job.id} for grant revision`);
	const { enabled: _enabled, state: _state, ...definition } = storedDefinition;
	return hashCronJobDefinition(definition);
}
function serializeCronJobState(state) {
	return JSON.stringify({
		...state,
		...state.lastRunStatus === void 0 && state.lastStatus !== void 0 ? { lastRunStatus: state.lastStatus } : {}
	});
}
function bindCronJobRow(storeKey, job, sortOrder) {
	return {
		store_key: storeKey,
		job_id: job.id,
		declaration_key: job.declarationKey ?? null,
		owner_agent_id: job.owner?.agentId ?? null,
		name: job.name,
		description: job.description ?? null,
		enabled: job.enabled ? 1 : 0,
		updated_at: job.updatedAtMs,
		agent_id: job.agentId ?? null,
		payload_kind: job.payload.kind,
		job_json: JSON.stringify(stripJobRuntimeFields(job)),
		grant_definition_revision: resolveCronJobGrantDefinitionRevision(job),
		grant_definition_generation: 1,
		grant_definition_updated_at: job.updatedAtMs,
		state_json: serializeCronJobState(job.state ?? {}),
		runtime_updated_at_ms: job.updatedAtMs,
		schedule_identity: tryCronScheduleIdentity({ ...job }) ?? null,
		sort_order: sortOrder
	};
}
function normalizeCronJobForSqlite(job) {
	const raw = { ...structuredClone(job) };
	const hadDeleteAfterRun = Object.hasOwn(raw, "deleteAfterRun");
	normalizeCronJobIdentityFields(raw);
	const normalized = normalizeCronJobInput(raw, { applyDefaults: true });
	if (!normalized || getInvalidPersistedCronJobReason(normalized)) return null;
	if (!hadDeleteAfterRun) delete normalized.deleteAfterRun;
	const createdAtMs = typeof normalized.createdAtMs === "number" && Number.isFinite(normalized.createdAtMs) ? normalized.createdAtMs : Date.now();
	const updatedAtMs = typeof normalized.updatedAtMs === "number" && Number.isFinite(normalized.updatedAtMs) ? normalized.updatedAtMs : createdAtMs;
	return {
		...normalized,
		createdAtMs,
		updatedAtMs,
		state: isRecord(normalized.state) ? normalized.state : {}
	};
}
function countUnpersistableCronJobs(store) {
	return store.jobs.reduce((count, job) => count + (normalizeCronJobForSqlite(job) ? 0 : 1), 0);
}
/** Fails before replacing SQLite rows when any config job cannot round-trip. */
function assertCronStoreCanPersist(store) {
	const invalidJobs = countUnpersistableCronJobs(store);
	if (invalidJobs > 0) throw new Error(`Cannot persist cron store with ${invalidJobs} invalid job(s)`);
}
function decodeCronJobConfig(jobJson) {
	const delivery = deliveryFromJson(jobJson.delivery);
	return delivery ? {
		...jobJson,
		delivery
	} : jobJson;
}
function rowToCronJob(row, jobJson) {
	const state = tryParseJsonObject(row.state_json);
	if (!state || getInvalidPersistedCronJobReason(jobJson)) return null;
	const toolsAllowExecTarget = normalizeCronToolsAllowExecTarget(jobJson.toolsAllowExecTarget);
	const toolsAllowExecTargetRequirement = normalizeCronToolsAllowExecTargetRequirement(jobJson.toolsAllowExecTargetRequirement);
	const createdAtMs = typeof jobJson.createdAtMs === "number" && Number.isFinite(jobJson.createdAtMs) ? jobJson.createdAtMs : Date.now();
	const { notify: _legacyNotify, toolsAllowExecTarget: _rawToolsAllowExecTarget, toolsAllowExecTargetRequirement: _rawToolsAllowExecTargetRequirement, ...runtimeConfig } = decodeCronJobConfig(jobJson);
	const payload = isRecord(runtimeConfig.payload) ? runtimeConfig.payload : void 0;
	const toolsAllow = Array.isArray(payload?.toolsAllow) ? payload.toolsAllow.filter((tool) => typeof tool === "string") : void 0;
	const runtimeToolsAllow = restoreCronPinnedExecGrant({
		toolsAllow,
		requirement: toolsAllowExecTargetRequirement,
		execTarget: toolsAllowExecTarget
	});
	if (payload && runtimeToolsAllow) runtimeConfig.payload = {
		...payload,
		toolsAllow: runtimeToolsAllow
	};
	if (isRecord(runtimeConfig.delivery) && runtimeConfig.delivery.mode === void 0) runtimeConfig.delivery = deliveryFromJson({
		...runtimeConfig.delivery,
		mode: "announce"
	});
	return {
		...runtimeConfig,
		id: row.job_id,
		...toolsAllowExecTarget ? { toolsAllowExecTarget } : {},
		...toolsAllowExecTargetRequirement ? { toolsAllowExecTargetRequirement } : {},
		createdAtMs,
		updatedAtMs: normalizeSqliteNumber(row.runtime_updated_at_ms) ?? normalizeSqliteNumber(row.updated_at) ?? createdAtMs,
		state
	};
}
/** Projects a live job through the same normalization/codecs used by SQLite persistence. */
function projectCronJobThroughStorageCodec(job) {
	const normalized = normalizeCronJobForSqlite(job);
	if (!normalized) throw new Error(`cannot project invalid cron job ${job.id}`);
	const jobJson = JSON.stringify(stripJobRuntimeFields(normalized));
	const projected = rowToCronJob({
		job_id: normalized.id,
		updated_at: normalized.updatedAtMs,
		state_json: serializeCronJobState(normalized.state ?? {}),
		runtime_updated_at_ms: normalized.updatedAtMs
	}, tryParseJsonObject(jobJson) ?? {});
	if (!projected) throw new Error(`cannot project cron job ${job.id} through storage codecs`);
	return projected;
}
function loadCronRows(db, storeKey, jobIds, opts) {
	let query = getCronStoreKysely(db).selectFrom(getCronStoreKysely(db).selectFrom("cron_jobs").selectAll().as("cron_rows")).select(opts ? CRON_JOB_GENERATION_READ_COLUMNS : CRON_JOB_READ_COLUMNS).where("store_key", "=", storeKey).orderBy("sort_order", "asc").orderBy("updated_at", "asc").orderBy("job_id", "asc");
	if (jobIds) {
		const ids = [...jobIds];
		query = ids.length === 1 ? query.where("job_id", "=", ids[0]) : query.where("job_id", "in", sqliteStringSet(ids));
	}
	const rows = executeSqliteQuerySync(db, query).rows;
	return jobIds ? rows.filter((row) => jobIds.has(row.job_id)) : rows;
}
/** Fingerprints raw definition rows without mutating their config order. */
function fingerprintCronJobRows(rows) {
	const ordered = rows.map(({ job_id, job_json, sort_order }) => ({
		idBytes: Buffer.from(job_id),
		definition: {
			job_id,
			job_json,
			sort_order
		}
	})).toSorted((left, right) => Buffer.compare(left.idBytes, right.idBytes));
	return sha256Hex(JSON.stringify(ordered.map(({ definition }) => definition)));
}
/** Reads only definition JSON and order while excluding runtime-owned state. */
function readCronJobsFingerprint(db, storeKey) {
	const rows = executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").select([
		"job_id",
		"job_json",
		"sort_order"
	]).where("store_key", "=", storeKey)).rows;
	return fingerprintCronJobRows(rows);
}
/** Materializes retired ownership within the caller's write transaction. */
function materializeCronRowAgentOwners(db, storeKey, legacyDefaultAgentId) {
	const agentId = normalizeAgentId(legacyDefaultAgentId);
	let rewritten = 0;
	for (const row of loadCronRows(db, storeKey)) {
		const jobJson = tryParseJsonObject(row.job_json);
		const jsonSessionAgentId = parseAgentSessionKey(normalizeOptionalString(jobJson?.sessionKey))?.agentId;
		if (normalizeOptionalString(row.agent_id) || normalizeOptionalString(jobJson?.agentId) || jsonSessionAgentId) continue;
		if (jobJson) jobJson.agentId = agentId;
		executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_jobs").set((eb) => ({
			agent_id: agentId,
			...jobJson ? { job_json: JSON.stringify(jobJson) } : {},
			grant_definition_revision: null,
			grant_definition_generation: eb(eb.fn.coalesce("grant_definition_generation", eb.val(0)), "+", 1),
			grant_definition_updated_at: null
		})).where("store_key", "=", storeKey).where("job_id", "=", row.job_id));
		rewritten += 1;
	}
	return rewritten;
}
/** Removes one owned job family from obsolete store partitions. */
function deleteStaleCronJobFamilyRows(db, activeStoreKey, family) {
	const staleRows = executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").select([
		"store_key",
		"job_id",
		"declaration_key",
		"name"
	]).select((eb) => [/^\p{ASCII}*$/u.test(family.name) ? eb.case().when("name", "=", family.name).then(eb.ref("description")).else(null).end().as("description") : "description"]).where("store_key", "!=", activeStoreKey)).rows.filter((row) => row.declaration_key === family.declarationKey || row.name === family.name && row.description?.includes(family.ownerPluginTag) === true);
	for (const row of staleRows) deleteCronJobRowInDatabase(db, row.store_key, row.job_id);
	return staleRows.length;
}
function replaceCronRows(db, storeKey, store, opts) {
	const existingRows = executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").select("job_id").$if(opts?.preserveRuntimeState === true, (query) => query.select("job_json")).where("store_key", "=", storeKey)).rows;
	const normalizedJobs = [];
	for (const [index, job] of store.jobs.entries()) normalizedJobs.push(upsertCronJobRow(db, storeKey, job, index, opts));
	const nextJobIds = new Set(normalizedJobs.map((job) => job.id));
	const existingJobIds = /* @__PURE__ */ new Set();
	const legacyAuthorityJobIds = /* @__PURE__ */ new Set();
	for (const row of existingRows) {
		existingJobIds.add(row.job_id);
		const storedJob = row.job_json === void 0 ? void 0 : tryParseJsonObject(row.job_json);
		if (storedJob && (Object.hasOwn(storedJob, "runtimeAuthority") || Object.hasOwn(storedJob, "runtimeAuthorityRecoveryRequired"))) legacyAuthorityJobIds.add(row.job_id);
		if (nextJobIds.has(row.job_id)) continue;
		revokeCronJobStandingGrants(db, row.job_id);
		executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_jobs").where("store_key", "=", storeKey).where("job_id", "=", row.job_id));
	}
	return {
		existingJobIds,
		jobs: normalizedJobs,
		legacyAuthorityJobIds
	};
}
/** Upserts one persisted cron row without rewriting unrelated jobs in its store partition. */
function upsertCronJobRow(db, storeKey, job, sortOrder, opts) {
	const normalized = normalizeCronJobForSqlite(job);
	if (!normalized) throw new Error(`Cannot persist invalid cron job ${job.id}`);
	const existingRow = opts?.knownExistingRow === void 0 ? executeSqliteQueryTakeFirstSync(db, getCronStoreKysely(db).selectFrom("cron_jobs").selectAll().where("store_key", "=", storeKey).where("job_id", "=", normalized.id)) : opts.knownExistingRow ?? void 0;
	const retainedGrantGeneration = readMaximumRetainedGrantDefinitionGeneration(db, normalized.id);
	const values = {
		...bindCronJobRow(storeKey, normalized, sortOrder),
		grant_definition_generation: retainedGrantGeneration + 1
	};
	const existingJobJson = existingRow ? tryParseJsonObject(existingRow.job_json) : null;
	const existingJob = existingRow && existingJobJson ? rowToCronJob(existingRow, existingJobJson) : null;
	const existingDefinitionRevision = existingJob ? resolveCronJobGrantDefinitionRevision(existingJob) : null;
	const generationPreservationGuard = existingRow && existingDefinitionRevision === values.grant_definition_revision && existingRow.grant_definition_revision === existingDefinitionRevision && existingRow.grant_definition_updated_at === existingRow.updated_at ? {
		jobJson: existingRow.job_json,
		revision: existingDefinitionRevision,
		updatedAt: existingRow.updated_at
	} : null;
	const invalidatedGenerationFloor = Math.max(retainedGrantGeneration, typeof existingRow?.grant_definition_generation === "number" && Number.isSafeInteger(existingRow.grant_definition_generation) && existingRow.grant_definition_generation >= 1 ? existingRow.grant_definition_generation : 0) + 1;
	const { state_json: _stateJson, runtime_updated_at_ms: _runtimeUpdatedAtMs, grant_definition_generation: _grantDefinitionGeneration, ...definitionValues } = values;
	const { grant_definition_generation: _fullGrantDefinitionGeneration, ...fullValues } = values;
	const insert = getCronStoreKysely(db).insertInto("cron_jobs");
	const insertWithValues = hasStandingGrantGenerationCompanion(db) ? insert.values((eb) => ({
		...values,
		grant_definition_generation: eb.selectFrom("operator_approval_standing_grant_generations").innerJoin("operator_approval_standing_grants", "operator_approval_standing_grants.grant_id", "operator_approval_standing_grant_generations.grant_id").select((inner) => inner(inner.fn.coalesce(inner.fn.max("operator_approval_standing_grant_generations.job_definition_generation"), inner.val(0)), "+", 1).as("next_generation")).where("operator_approval_standing_grants.cron_job_id", "=", normalized.id)
	})) : insert.values(values);
	executeSqliteQuerySync(db, insertWithValues.onConflict((conflict) => conflict.columns(["store_key", "job_id"]).doUpdateSet((eb) => {
		const incrementedGeneration = eb(eb.fn.coalesce("cron_jobs.grant_definition_generation", eb.val(0)), "+", 1);
		const invalidatedGeneration = eb.case().when("cron_jobs.grant_definition_generation", ">=", invalidatedGenerationFloor).then(incrementedGeneration).else(invalidatedGenerationFloor).end();
		return {
			...opts?.preserveRuntimeState ? definitionValues : fullValues,
			grant_definition_generation: generationPreservationGuard ? eb.case().when(eb.and([
				eb("cron_jobs.job_json", "=", generationPreservationGuard.jobJson),
				eb("cron_jobs.grant_definition_revision", "=", generationPreservationGuard.revision),
				eb("cron_jobs.updated_at", "=", generationPreservationGuard.updatedAt),
				eb("cron_jobs.grant_definition_updated_at", "=", generationPreservationGuard.updatedAt)
			])).then(eb.fn.coalesce("cron_jobs.grant_definition_generation", eb.val(1))).else(invalidatedGeneration).end() : invalidatedGeneration
		};
	})));
	return normalized;
}
function hasStandingGrantGenerationCompanion(db) {
	return tableExists(db, "operator_approval_standing_grants") && tableExists(db, "operator_approval_standing_grant_generations");
}
function readMaximumRetainedGrantDefinitionGeneration(db, jobId) {
	if (!hasStandingGrantGenerationCompanion(db)) return 0;
	const maximum = executeSqliteQueryTakeFirstSync(db, getCronStoreKysely(db).selectFrom("operator_approval_standing_grant_generations").innerJoin("operator_approval_standing_grants", "operator_approval_standing_grants.grant_id", "operator_approval_standing_grant_generations.grant_id").select((eb) => eb.fn.max("operator_approval_standing_grant_generations.job_definition_generation").as("max_generation")).where("operator_approval_standing_grants.cron_job_id", "=", jobId))?.max_generation;
	return typeof maximum === "number" && Number.isSafeInteger(maximum) && maximum >= 1 ? maximum : 0;
}
function resolveCronJobGrantDefinitionGenerationFloor(db, jobId) {
	return readMaximumRetainedGrantDefinitionGeneration(db, jobId) + 1;
}
function deleteCronJobRowInDatabase(db, storeKey, jobId) {
	revokeCronJobStandingGrants(db, jobId);
	executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_job_scratch").where("store_key", "=", storeKey).where("job_id", "=", jobId));
	executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_jobs").where("store_key", "=", storeKey).where("job_id", "=", jobId));
}
function revokeCronJobStandingGrants(db, jobId) {
	if (tableExists(db, "operator_approval_standing_grants")) executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("operator_approval_standing_grants").set({
		revoked_at_ms: Date.now(),
		revoked_by: "cron-job-deleted"
	}).where("cron_job_id", "=", jobId).where("revoked_at_ms", "is", null));
}
/** Updates only mutable runtime columns without rewriting full job config JSON. */
function updateCronRuntimeRows(db, storeKey, store) {
	for (const job of store.jobs) executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_jobs").set({
		state_json: serializeCronJobState(job.state ?? {}),
		runtime_updated_at_ms: job.updatedAtMs,
		schedule_identity: tryCronScheduleIdentity({ ...job })
	}).where("store_key", "=", storeKey).where("job_id", "=", job.id));
}
/** Reconstructs loaded cron store data and config-runtime sidecars from SQLite rows. */
function loadedCronStoreFromRows(rows) {
	const jobs = [];
	const configJobs = [];
	const configJobIndexes = [];
	const configJobRuntimeEntries = [];
	const invalidConfigRows = [];
	for (const [index, row] of rows.entries()) {
		const parsedJobJson = tryParseJsonObject(row.job_json);
		const parsedStateJson = tryParseJsonObject(row.state_json);
		if (!parsedJobJson || !parsedStateJson) {
			invalidConfigRows.push({
				sourceIndex: index,
				reason: parsedJobJson ? "invalid-state" : "invalid-payload",
				...parsedJobJson ? { job: decodeCronJobConfig(parsedJobJson) } : {},
				raw: {
					jobId: row.job_id,
					jobJson: row.job_json,
					stateJson: row.state_json
				}
			});
			continue;
		}
		const job = rowToCronJob(row, parsedJobJson);
		const configJob = decodeCronJobConfig(parsedJobJson);
		const runtimeEntry = {
			updatedAtMs: normalizeSqliteNumber(row.runtime_updated_at_ms) ?? normalizeSqliteNumber(row.updated_at),
			scheduleIdentity: row.schedule_identity ?? void 0,
			state: parsedStateJson
		};
		if (!job) {
			invalidConfigRows.push({
				sourceIndex: index,
				reason: getInvalidPersistedCronJobReason(configJob) ?? "invalid-payload",
				job: configJob,
				...runtimeEntry.state ? { state: runtimeEntry.state } : {},
				...runtimeEntry.updatedAtMs !== void 0 ? { updatedAtMs: runtimeEntry.updatedAtMs } : {},
				...runtimeEntry.scheduleIdentity !== void 0 ? { scheduleIdentity: runtimeEntry.scheduleIdentity } : {}
			});
			continue;
		}
		jobs.push(job);
		configJobs.push(configJob);
		configJobIndexes.push(index);
		configJobRuntimeEntries.push(runtimeEntry);
	}
	return {
		store: {
			version: 1,
			jobs
		},
		configJobs,
		configJobIndexes,
		configJobRuntimeEntries,
		invalidConfigRows
	};
}
//#endregion
export { tryCronScheduleIdentity as _, loadCronRows as a, projectCronJobThroughStorageCodec as c, resolveCronJobGrantDefinitionGenerationFloor as d, resolveCronJobGrantDefinitionRevision as f, cronSchedulingInputsEqual as g, tryParseJsonObject as h, fingerprintCronJobRows as i, readCronJobsFingerprint as l, upsertCronJobRow as m, deleteCronJobRowInDatabase as n, loadedCronStoreFromRows as o, updateCronRuntimeRows as p, deleteStaleCronJobFamilyRows as r, materializeCronRowAgentOwners as s, assertCronStoreCanPersist as t, replaceCronRows as u, normalizeCronJobIdentityFields as v, hashCronJobDefinition as y };
