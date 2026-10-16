import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Un as record, Yt as discriminatedUnion, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { c as UpdateDoctorConfigWriteRefusalSchema, n as UpdateFailureFactSchema, s as UpdateDoctorConfigChangeSchema } from "./update-run-schema-DOichlUj.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { i as normalizeUpdateFailureFacts } from "./update-failure-facts-CetdnXr-.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/infra/update-doctor-result.ts
const UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV = "OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH";
const UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE = 86;
const UPDATE_POST_INSTALL_DOCTOR_RESULT_FILENAME_RE = /^openclaw-update-doctor-\d+-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.json$/iu;
const PACKAGE_POST_INSTALL_DOCTOR_ADVISORY = {
	kind: "package-post-install-doctor",
	message: "Post-install doctor reported a recoverable update-time repair warning after the package install was verified; continuing with post-core plugin convergence."
};
const configHashSchema = string().regex(/^[0-9a-f]{64}$/u);
const configFileWriteSchema = object({
	inputHash: configHashSchema.optional(),
	hash: configHashSchema
});
const DoctorMaintenanceRefusalSchema = discriminatedUnion("kind", [object({
	kind: literal("deferred"),
	reason: _enum([
		"coordinator-contention",
		"agent-database-in-use",
		"admission-unavailable"
	])
}), object({
	kind: literal("data-at-risk"),
	reason: _enum([
		"active-mutation",
		"unreadable-state",
		"incomplete-migration",
		"gateway-state-unverified"
	])
})]);
const doctorResultEvidence = {
	configHash: union([literal("unchanged"), configHashSchema]).optional(),
	configInputHash: configHashSchema.optional(),
	configFileWrites: record(string().refine((filePath) => path.isAbsolute(filePath)), configFileWriteSchema).optional().catch(void 0),
	warnings: array(string()).optional(),
	maintenanceRefusal: DoctorMaintenanceRefusalSchema.optional(),
	failureFacts: array(UpdateFailureFactSchema).catch([]).optional(),
	configChanges: array(UpdateDoctorConfigChangeSchema).optional(),
	configWriteRefusal: UpdateDoctorConfigWriteRefusalSchema.optional(),
	databaseWrites: object({
		unchanged: boolean(),
		fromGenerations: record(string(), string().nullable()).optional(),
		generations: record(string(), string().nullable())
	}).optional().catch(void 0)
};
const UpdatePostInstallDoctorResultSchema = discriminatedUnion("status", [object({
	status: _enum(["ok", "error"]),
	...doctorResultEvidence
}), object({
	status: literal("advisory"),
	advisory: object({
		kind: literal("package-post-install-doctor"),
		reason: literal("deferred-configured-plugin-repair"),
		message: string().transform(() => PACKAGE_POST_INSTALL_DOCTOR_ADVISORY.message),
		details: array(string().refine((detail) => detail.trim().length > 0)).min(1)
	}),
	...doctorResultEvidence
})]);
var UpdateDoctorError = class extends Error {
	constructor(message, failureFacts, options) {
		super(message, options);
		this.failureFacts = failureFacts;
		this.name = "UpdateDoctorError";
		this.exitCode = options?.exitCode;
	}
};
var DoctorMaintenanceRefusalError = class extends UpdateDoctorError {
	constructor(message, refusal, options) {
		super(message, options?.failureFacts ?? [], options);
		this.refusal = refusal;
		this.name = "DoctorMaintenanceRefusalError";
	}
};
function collectUpdateDoctorFailureFacts(error) {
	return normalizeUpdateFailureFacts(collectNestedErrorCandidates(error).flatMap((candidate) => candidate instanceof UpdateDoctorError ? candidate.failureFacts : []));
}
/** Keep optional health diagnostics bounded across Doctor and its update parent. */
function normalizeUpdatePostInstallDoctorWarnings(warnings) {
	const normalized = [];
	for (const warning of warnings) {
		const message = truncateUtf16Safe(warning.trim(), 500);
		if (message) {
			normalized.push(message);
			if (normalized.length === 32) break;
		}
	}
	return normalized;
}
/** Receipts describe the caller's existing maintenance interval without owning its lifecycle. */
function createUpdateDoctorDatabaseWriteCapture(input, options) {
	if (!input) return;
	let expectedGenerations = { ...input };
	let fromGenerations;
	let unchanged = true;
	let receipt;
	const read = async () => {
		if (!expectedGenerations) return;
		let generations;
		try {
			const { readUpdateDatabaseGenerationsIsolated } = await import("./update-candidate-state-D4RyyU-V.mjs");
			generations = await readUpdateDatabaseGenerationsIsolated(Object.keys(expectedGenerations), options);
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			options.assertCurrent?.();
			expectedGenerations = void 0;
			receipt = void 0;
			options.warn(`Database write verification is unavailable; automatic database restoration cannot be confirmed: ${formatErrorMessage(error)}`);
			return;
		}
		options.assertCurrent?.();
		return generations;
	};
	return {
		get receipt() {
			return receipt;
		},
		async admit() {
			receipt = void 0;
			const generations = await read();
			if (generations && expectedGenerations) {
				fromGenerations ??= generations;
				unchanged &&= Object.entries(expectedGenerations).every(([pathname, generation]) => generations[pathname] === generation);
			}
		},
		async settle() {
			const generations = await read();
			if (generations && expectedGenerations) {
				unchanged &&= Object.entries(expectedGenerations).every(([pathname, generation]) => generations[pathname] === generation);
				receipt = {
					unchanged,
					fromGenerations,
					generations
				};
			}
		}
	};
}
const doctorConfigWrites = new AsyncLocalStorage();
function captureUpdateDoctorConfigWrites(configPath, run, authority) {
	const capture = {
		path: path.resolve(configPath),
		hash: "unchanged",
		configChanges: []
	};
	return doctorConfigWrites.run({
		capture,
		authority: authority ? {
			inputHash: authority.inputHash,
			assertCurrent: authority.assertCurrent
		} : void 0
	}, () => run(capture));
}
/** The same authority covers include writers; only the root has a captured input hash. */
function getUpdateDoctorConfigWriteAuthority(configPath) {
	const context = doctorConfigWrites.getStore();
	if (!context?.authority) return;
	const { capture, authority } = context;
	return {
		assertCurrent: authority.assertCurrent,
		...capture.path === path.resolve(configPath) ? { inputHash: capture.hash === "unchanged" ? authority.inputHash : capture.hash } : {}
	};
}
function assertUpdateDoctorConfigInputHash(configPath, inputHash) {
	const authority = getUpdateDoctorConfigWriteAuthority(configPath);
	if (authority?.inputHash !== void 0 && authority.inputHash !== inputHash) {
		const message = "Config changed after update validation; Doctor did not promote its changes.";
		recordUpdateDoctorConfigWriteRefusal({
			reason: "config-input-changed",
			message,
			keys: []
		});
		throw new ConfigMutationConflictError(message, { retryable: false });
	}
}
/** Retain the validated root input and live Doctor owner through include publication. */
async function runUpdateDoctorIncludeWrite(configPath, inputHash, run) {
	const context = doctorConfigWrites.getStore();
	if (!context?.authority) return await run();
	context.authority.assertCurrent();
	assertUpdateDoctorConfigInputHash(configPath, inputHash);
	const result = await run();
	context.authority.assertCurrent();
	return result;
}
/** Retain one contiguous chain from the writer's input through its actual publications. */
function recordUpdateDoctorConfigFileWrite(configPath, inputHash, hash) {
	const capture = doctorConfigWrites.getStore()?.capture;
	if (!capture) return;
	const resolvedPath = path.resolve(configPath);
	const write = capture.path === resolvedPath ? capture : (capture.fileWrites ??= {})[resolvedPath] ??= { hash: "unchanged" };
	if (write.hash === "unchanged") write.inputHash = inputHash ?? void 0;
	else if (inputHash !== write.hash) delete write.inputHash;
	write.hash = hash;
}
/** Pair the consumed snapshot with the serialized payload at publication, never a later read. */
function recordUpdateDoctorConfigWrite(configPath, inputHash, hash, inputConfig, outputJson) {
	recordUpdateDoctorConfigFileWrite(configPath, inputHash, hash);
	const capture = doctorConfigWrites.getStore()?.capture;
	if (capture && capture.path === path.resolve(configPath)) {
		const before = isRecord(inputConfig) ? inputConfig : {};
		const after = JSON.parse(outputJson);
		if (!isRecord(after)) throw new Error("Committed Doctor config is not an object.");
		const keys = new Set(capture.configChanges.flatMap((change) => change.kind === "key" ? [change.key] : []));
		for (const key of /* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)])) if (!isDeepStrictEqual(before[key], after[key])) keys.add(key);
		capture.configChanges = [...[...keys].toSorted().map((key) => ({
			kind: "key",
			key
		})), ...capture.configChanges.filter((change) => change.kind === "migration")];
	}
}
/** Record migration notes only after their matching config write has committed. */
function recordUpdateDoctorConfigMigration(message) {
	const capture = doctorConfigWrites.getStore()?.capture;
	if (capture && message.trim() && !capture.configChanges.some((change) => change.kind === "migration" && change.message === message)) capture.configChanges.push({
		kind: "migration",
		message
	});
}
function recordUpdateDoctorConfigWriteRefusal(refusal) {
	const capture = doctorConfigWrites.getStore()?.capture;
	if (capture) capture.configWriteRefusal ??= {
		...refusal,
		keys: [...new Set(refusal.keys)].toSorted()
	};
}
function createUpdatePostInstallDoctorResultPath(options) {
	return path.join(resolvePreferredOpenClawTmpDir(options), `openclaw-update-doctor-${process.pid}-${randomUUID()}.json`);
}
function resolveSafeUpdatePostInstallDoctorResultPath(resultPath, options) {
	const tempRoot = path.resolve(resolvePreferredOpenClawTmpDir(options));
	const resolvedPath = path.resolve(resultPath);
	if (path.dirname(resolvedPath) !== tempRoot || !UPDATE_POST_INSTALL_DOCTOR_RESULT_FILENAME_RE.test(path.basename(resolvedPath))) throw new Error("Unsafe post-install doctor result path");
	return resolvedPath;
}
function createDeferredConfiguredPluginRepairDoctorResult(details) {
	return {
		status: "advisory",
		advisory: {
			...PACKAGE_POST_INSTALL_DOCTOR_ADVISORY,
			reason: "deferred-configured-plugin-repair",
			details: details.filter((line) => line.trim())
		}
	};
}
async function writeUpdatePostInstallDoctorResult(params) {
	const resultPath = resolveSafeUpdatePostInstallDoctorResultPath(params.resultPath);
	await fs.writeFile(resultPath, `${JSON.stringify(normalizeUpdatePostInstallDoctorResult(params.result))}\n`, {
		encoding: "utf8",
		mode: 384,
		flag: "wx"
	});
}
async function consumeUpdatePostInstallDoctorResult(resultPath, options) {
	let safeResultPath;
	try {
		safeResultPath = resolveSafeUpdatePostInstallDoctorResultPath(resultPath, options);
	} catch {
		return null;
	}
	try {
		const raw = await fs.readFile(safeResultPath, "utf8");
		return parseUpdatePostInstallDoctorResult(JSON.parse(raw));
	} catch {
		return null;
	} finally {
		await fs.rm(safeResultPath, { force: true }).catch(() => {});
	}
}
function parseUpdatePostInstallDoctorResult(value) {
	const parsed = UpdatePostInstallDoctorResultSchema.safeParse(value);
	return parsed.success ? normalizeUpdatePostInstallDoctorResult(parsed.data) : null;
}
function normalizeUpdatePostInstallDoctorResult({ warnings, failureFacts, ...result }) {
	const normalizedWarnings = normalizeUpdatePostInstallDoctorWarnings(warnings ?? []);
	const facts = normalizeUpdateFailureFacts(failureFacts ?? []);
	return {
		...result,
		...normalizedWarnings.length ? { warnings: normalizedWarnings } : {},
		...facts.length ? { failureFacts: facts } : {}
	};
}
//#endregion
export { recordUpdateDoctorConfigWrite as _, UpdateDoctorError as a, writeUpdatePostInstallDoctorResult as b, collectUpdateDoctorFailureFacts as c, createUpdateDoctorDatabaseWriteCapture as d, createUpdatePostInstallDoctorResultPath as f, recordUpdateDoctorConfigMigration as g, recordUpdateDoctorConfigFileWrite as h, UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV as i, consumeUpdatePostInstallDoctorResult as l, normalizeUpdatePostInstallDoctorWarnings as m, PACKAGE_POST_INSTALL_DOCTOR_ADVISORY as n, assertUpdateDoctorConfigInputHash as o, getUpdateDoctorConfigWriteAuthority as p, UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE as r, captureUpdateDoctorConfigWrites as s, DoctorMaintenanceRefusalError as t, createDeferredConfiguredPluginRepairDoctorResult as u, recordUpdateDoctorConfigWriteRefusal as v, runUpdateDoctorIncludeWrite as y };
