import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Yt as discriminatedUnion, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { a as UpdateDoctorConfigChangeSchema, n as UpdateFailureFactSchema, o as UpdateDoctorConfigWriteRefusalSchema } from "./update-run-schema-BIZkdmqf.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-DiyYJNo1.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/infra/update-doctor-result.ts
const UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV = "OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH";
const UPDATE_POST_INSTALL_DOCTOR_RESULT_FILENAME_RE = /^openclaw-update-doctor-\d+-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.json$/iu;
const PACKAGE_POST_INSTALL_DOCTOR_ADVISORY = {
	kind: "package-post-install-doctor",
	message: "Post-install doctor reported a recoverable update-time repair warning after the package install was verified; continuing with post-core plugin convergence."
};
const configHashSchema = string().regex(/^[0-9a-f]{64}$/u);
const doctorResultEvidence = {
	configHash: union([literal("unchanged"), configHashSchema]).optional(),
	configInputHash: configHashSchema.optional(),
	warnings: array(string()).optional(),
	failureFacts: array(UpdateFailureFactSchema).catch([]).optional(),
	configChanges: array(UpdateDoctorConfigChangeSchema).optional(),
	configWriteRefusal: UpdateDoctorConfigWriteRefusalSchema.optional()
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
/** Include publication retains its legacy writer until fs-safe supports final-effect authority. */
async function runUpdateDoctorIncludeWrite(configPath, inputHash, run) {
	const context = doctorConfigWrites.getStore();
	if (!context?.authority) return await run();
	context.authority.assertCurrent();
	assertUpdateDoctorConfigInputHash(configPath, inputHash);
	const result = await doctorConfigWrites.run({ capture: context.capture }, run);
	context.authority.assertCurrent();
	return result;
}
/** Pair the consumed snapshot with the serialized payload at publication, never a later read. */
function recordUpdateDoctorConfigWrite(configPath, inputHash, hash, inputConfig, outputJson) {
	const capture = doctorConfigWrites.getStore()?.capture;
	if (capture && capture.path === path.resolve(configPath)) {
		if (capture.hash === "unchanged") capture.inputHash = inputHash ?? void 0;
		else if (inputHash !== capture.hash) delete capture.inputHash;
		capture.hash = hash;
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
	const { warnings, failureFacts, ...result } = params.result;
	const normalizedWarnings = normalizeUpdatePostInstallDoctorWarnings(warnings ?? []);
	const facts = normalizeUpdateFailureFacts(failureFacts ?? []);
	await fs.writeFile(resultPath, `${JSON.stringify({
		...result,
		...normalizedWarnings.length ? { warnings: normalizedWarnings } : {},
		...facts.length ? { failureFacts: facts } : {}
	})}\n`, {
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
	if (!parsed.success) return null;
	const { warnings, failureFacts, ...result } = parsed.data;
	const normalizedWarnings = normalizeUpdatePostInstallDoctorWarnings(warnings ?? []);
	const facts = normalizeUpdateFailureFacts(failureFacts ?? []);
	return {
		...result,
		...normalizedWarnings.length ? { warnings: normalizedWarnings } : {},
		...facts.length ? { failureFacts: facts } : {}
	};
}
//#endregion
export { captureUpdateDoctorConfigWrites as a, createDeferredConfiguredPluginRepairDoctorResult as c, normalizeUpdatePostInstallDoctorWarnings as d, recordUpdateDoctorConfigMigration as f, writeUpdatePostInstallDoctorResult as g, runUpdateDoctorIncludeWrite as h, assertUpdateDoctorConfigInputHash as i, createUpdatePostInstallDoctorResultPath as l, recordUpdateDoctorConfigWriteRefusal as m, UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV as n, collectUpdateDoctorFailureFacts as o, recordUpdateDoctorConfigWrite as p, UpdateDoctorError as r, consumeUpdatePostInstallDoctorResult as s, PACKAGE_POST_INSTALL_DOCTOR_ADVISORY as t, getUpdateDoctorConfigWriteAuthority as u };
