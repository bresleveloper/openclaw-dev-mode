import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-BKwhAL2c.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { r as UpdateRunRecordSchema } from "./update-run-schema-BIZkdmqf.mjs";
import { t as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BYZF4sMi.mjs";
import { r as normalizeUpdateFailureFacts, t as createUpdateErrorFact } from "./update-failure-facts-THF-vx3i.mjs";
import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { t as finishUpdateRunRecord } from "./update-run-record-B5xSBZMw.mjs";
import { i as updateRunStepsFromResultStep } from "./update-run-step-ijjXM1mH.mjs";
import { t as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-UfK-2Yan.mjs";
import { a as readUpdateRunRecord, t as decodeRun } from "./update-run-read.kernel-Blv-D7Xz.mjs";
//#region src/infra/update-run-step-key.ts
const RELEASED_STEP_KEYS = /* @__PURE__ */ new Map([
	["package-install", "global update"],
	["package-install-omit-optional", "global update (omit optional)"],
	["git-fetch", "git fetch"],
	["git-fetch-tags", "git fetch tags"],
	["git-fetch-target-tag", "git fetch target tag"],
	["git-target-inspection-fetch", "git target inspection fetch"],
	["git-import-admitted-target", "git import admitted target"]
]);
function updateRunStepKey(step) {
	return RELEASED_STEP_KEYS.get(step) ?? step;
}
//#endregion
//#region src/infra/update-run-codec.ts
const JSON_BYTES = 16384;
const RETAINED_STEP_NAMES = [
	...UPDATE_RUN_PHASES,
	"notice:ack",
	"notice:activating",
	"notice:verifying",
	"previous generation restoration",
	"post-update verification",
	"task-delivery-recovery",
	"driver:adopted",
	"driver:identity-unavailable",
	"reconcile:abandoned",
	"reconcile:superseded",
	"reconcile:acknowledged",
	"reconcile:settle"
];
function mapJsonText(value, transform) {
	if (typeof value === "string") return transform(value);
	if (Array.isArray(value)) return value.map((entry) => mapJsonText(entry, transform));
	if (isRecord(value)) return Object.fromEntries(Object.keys(value).toSorted().map((key) => [key, mapJsonText(value[key], transform)]));
	return value;
}
function isRetainedStep(item) {
	return isRecord(item) && typeof item.step === "string" && (item.step.startsWith("finalize:") || RETAINED_STEP_NAMES.some((name) => name === item.step));
}
/** Phase history, notice custody, and restoration proof survive diagnostic eviction. */
function boundedJson(input, maxBytes = JSON_BYTES) {
	let value = input;
	let json = JSON.stringify(value);
	while (Buffer.byteLength(json) > maxBytes) {
		if (Array.isArray(value)) {
			const disposable = value.findIndex((item) => !isRetainedStep(item));
			if (disposable >= 0) value = value.toSpliced(disposable, 1);
			else {
				const compacted = value.map((item) => isRecord(item) && item.step !== "task-delivery-recovery" && !(typeof item.step === "string" && item.step.startsWith("finalize:doctor-lint:")) ? {
					...item,
					detail: void 0,
					failureFacts: void 0
				} : item);
				if (JSON.stringify(compacted) === json) throw new Error("Update run retained step metadata exceeds its byte limit");
				value = compacted;
			}
		} else if (isRecord(value)) {
			const object = value;
			const key = Object.keys(object).toSorted().find((field) => Array.isArray(object[field]) && object[field].length > 0);
			const array = key ? object[key] : void 0;
			if (key && Array.isArray(array)) value = {
				...object,
				[key]: array.slice(1)
			};
			else value = mapJsonText(value, (text) => truncateUtf16Safe(text, Math.floor(text.length / 2)));
		} else throw new Error("Update run metadata exceeds its bounded schema");
		json = JSON.stringify(value);
	}
	return json;
}
function boundedOriginJson(origin) {
	const { driver, previousDrivers, ...diagnostics } = origin;
	const identities = JSON.stringify({
		driver,
		previousDrivers
	});
	const boundedDiagnostics = boundedJson(diagnostics, JSON_BYTES - Buffer.byteLength(identities));
	return `{${[identities.slice(1, -1), boundedDiagnostics.slice(1, -1)].filter(Boolean).join(",")}}`;
}
function encodeRun(input, options) {
	const env = options.env ?? process.env;
	const redactPaths = [
		[resolveRequiredHomeDir(env), "~"],
		[env.HOME, "~"],
		[env.USERPROFILE, "~"],
		[resolveStateDir(env), "$OPENCLAW_STATE_DIR"],
		[env.OPENCLAW_CONFIG_PATH, "[path]"],
		...(options.redactPaths ?? []).map((root) => [root, "[path]"])
	].flatMap(([root, replacement]) => {
		if (!root) return [];
		const prefix = root.replaceAll("\\", "/").replace(/\/+$/u, "").split("/").map(escapeRegExp).join("[\\\\/]");
		const flags = /^(?:[A-Za-z]:|\\\\)/u.test(root) ? "giu" : "gu";
		return prefix ? [[new RegExp(`(?<!https?:)(?:(?<![\\w/])|(?<=file:///?))${prefix}(?=$|[\\\\/\\s"'<>.,;:)])`, flags), replacement]] : [];
	});
	const { driver, previousDrivers, ...originDiagnostics } = input.origin;
	const record = UpdateRunRecordSchema.parse(mapJsonText({
		...input,
		origin: originDiagnostics,
		steps: input.steps.map((step) => ({
			...step,
			...step.failureFacts ? { failureFacts: normalizeUpdateFailureFacts(step.failureFacts, env) } : {}
		}))
	}, (value) => {
		let text = redactSensitiveText(value, { mode: "tools" });
		for (const [pattern, replacement] of redactPaths) text = text.replace(pattern, () => replacement);
		return truncateUtf16Safe(text, UPDATE_RUN_TEXT_LIMIT);
	}));
	record.origin = UpdateRunRecordSchema.shape.origin.parse({
		...record.origin,
		driver,
		previousDrivers
	});
	return {
		run_id: record.runId,
		created_at_ms: record.createdAtMs,
		updated_at_ms: record.updatedAtMs,
		trigger: record.trigger,
		phase: record.phase,
		status: record.status,
		reason: record.reason,
		origin_json: boundedOriginJson(record.origin),
		target_json: boundedJson(record.target),
		before_json: boundedJson(record.before),
		after_json: boundedJson(record.after),
		steps_json: boundedJson(record.steps),
		verification_json: boundedJson(record.verification),
		repair_json: boundedJson(record.repair),
		confirmed_at_ms: record.confirmedAtMs,
		finished_at_ms: record.finishedAtMs,
		downtime_ms: record.downtimeMs
	};
}
//#endregion
//#region src/infra/update-run-verification.ts
function isUpdateRunVerificationConfirmed(verification) {
	return verification.serviceRunning === true && verification.versionMatch === true && verification.settled === true && verification.readyz === true && verification.channelsReady === true && verification.pluginErrors?.length === 0;
}
function recordUpdateRunVerificationRecord(record, verification, options = {}) {
	if (options.onlyIfRunning && record.status !== "running") return;
	record.verification = {
		...record.verification,
		...verification,
		...verification.pluginErrors ? { pluginErrors: verification.pluginErrors.slice(-32) } : {}
	};
	if (record.status === "running" && verification.serviceRunning === false) record.confirmedAtMs = null;
	if (isUpdateRunVerificationConfirmed(record.verification) && record.confirmedAtMs === null) record.confirmedAtMs = Date.now();
}
//#endregion
//#region src/infra/update-run-write.ts
const schemaStart = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS update_runs (");
const schemaEnd = OPENCLAW_STATE_SCHEMA_SQL.indexOf("ON update_runs(status, created_at_ms DESC, run_id);", schemaStart);
if (schemaStart < 0 || schemaEnd < 0) throw new Error("Update run schema markers are missing");
const updateRunLedgerSchema = OPENCLAW_STATE_SCHEMA_SQL.slice(schemaStart, schemaEnd + 51);
function upsertStep(record, input) {
	const step = {
		...input,
		step: updateRunStepKey(input.step)
	};
	const index = record.steps.findIndex((existing) => existing.step === step.step);
	if (index >= 0) record.steps[index] = {
		...record.steps[index],
		...step
	};
	else record.steps.push(step);
	while (record.steps.length > 128) {
		const disposable = record.steps.findIndex((entry) => !isRetainedStep(entry));
		if (disposable < 0) throw new Error("Update run retained steps exceed the step limit");
		record.steps.splice(disposable, 1);
	}
}
function persistRun(db, record, options) {
	record.updatedAtMs = Math.max(Date.now(), record.updatedAtMs + 1);
	const row = encodeRun(record, options);
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("update_runs").set(row).where("run_id", "=", record.runId));
	return decodeRun(row);
}
function mutateRunInTransaction(db, runId, update, options, captureBefore) {
	const record = readUpdateRunRecord(db, runId);
	if (!record) throw new Error(`Unknown update run: ${runId}`);
	const before = JSON.stringify(record);
	captureBefore?.(structuredClone(record));
	update(record);
	return before === JSON.stringify(record) ? record : persistRun(db, record, options);
}
function mutateRun(runId, update, options, captureBefore) {
	return runExistingOpenClawStateWriteTransaction(({ db }) => mutateRunInTransaction(db, runId, update, options, captureBefore), options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run",
		busyTimeoutMs: options.busyTimeoutMs
	});
}
function applyUpdateRunDiagnostics(record, diagnostics) {
	const { failure, verification, steps, recovery: observedRecovery, rollbackOutcome: observedRollback } = typeof diagnostics === "function" ? diagnostics(record.verification) : diagnostics;
	if (failure && record.status === "running") upsertStep(record, {
		...failure,
		status: "failed"
	});
	if (verification) {
		const { recovery, rollbackOutcome, booted, noticeDelivered, doctorHint } = record.verification;
		record.verification = {
			recovery,
			rollbackOutcome,
			booted,
			noticeDelivered,
			doctorHint
		};
		record.confirmedAtMs = null;
		for (const step of (steps ?? []).flatMap(updateRunStepsFromResultStep)) upsertStep(record, step);
	}
	const constraint = record.verification.recovery;
	const recovery = verification && constraint?.serviceRestartSafe === false ? constraint : observedRecovery;
	if (recovery || observedRollback || verification) recordUpdateRunVerificationRecord(record, {
		...verification,
		...verification ? record.verification : {},
		...recovery ? { recovery } : {},
		...observedRollback ? { rollbackOutcome: observedRollback } : {}
	});
}
/** Diagnostic capture cannot interrupt lifecycle work or replace its original outcome. */
function recordUpdateRunDiagnostics(runId, diagnostics, warn, options = {}) {
	try {
		if (typeof diagnostics !== "function" && !(diagnostics.failure || diagnostics.recovery || diagnostics.rollbackOutcome || diagnostics.verification)) return;
		return mutateRun(runId, (record) => {
			applyUpdateRunDiagnostics(record, diagnostics);
		}, options);
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		const fact = createUpdateErrorFact("requested", error, options.env);
		warn(`Update diagnostics could not be recorded (${fact.code}): ${fact.message ?? "no error message"}`);
		return;
	}
}
function finishUpdateRun(runId, result, options = {}) {
	return mutateRun(runId, (record) => {
		if (record.status === "running") {
			const diagnostics = result.diagnostics;
			if (diagnostics) {
				applyUpdateRunDiagnostics(record, diagnostics);
				if (!diagnostics.verification) for (const step of (diagnostics.steps ?? []).flatMap(updateRunStepsFromResultStep)) upsertStep(record, step);
			}
			record.before = {
				...record.before,
				...result.before
			};
		}
		finishUpdateRunRecord(record, result);
	}, options);
}
//#endregion
export { recordUpdateRunDiagnostics as a, isUpdateRunVerificationConfirmed as c, updateRunStepKey as d, persistRun as i, recordUpdateRunVerificationRecord as l, mutateRun as n, updateRunLedgerSchema as o, mutateRunInTransaction as r, upsertStep as s, finishUpdateRun as t, encodeRun as u };
