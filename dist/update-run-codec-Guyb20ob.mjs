import { i as resolveRequiredHomeDir } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as UpdateRunRecordSchema } from "./update-run-schema-CY2FAM7T.mjs";
import { n as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BuT3Q1bJ.mjs";
import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
import { a as normalizeUpdateFailureFacts } from "./update-failure-facts-3t5Fm3wV.mjs";
//#region src/infra/update-run-codec.ts
const JSON_BYTES = 16384;
const RETAINED_STEP_NAMES = [
	...UPDATE_RUN_PHASES,
	"candidate-admission",
	"warning:update-admission-unsupported-target",
	"warning:update-admission-fallback",
	"warning:managed-service-membership",
	"warning:finalize:plugins:deadline",
	"global update",
	"global update (omit optional)",
	"candidate-state-snapshot",
	"candidate-doctor",
	"candidate-doctor-lint",
	"updater-runtime-retention",
	"diagnostic:updater-runtime-retention",
	"candidate-gateway-startup",
	"candidate-state-cleanup",
	"post-stop-checks",
	"git-checkout",
	"git-runtime-activation",
	"openclaw doctor",
	"pre-plugin doctor",
	"post-plugin doctor",
	"diagnostic:candidate-doctor",
	"diagnostic:openclaw doctor",
	"diagnostic:pre-plugin doctor",
	"diagnostic:post-plugin doctor",
	"managed-service-executor-check",
	"managed-service-install",
	"managed-service-restart",
	"managed-service update handoff",
	"service-stop",
	"service-start",
	"service-running",
	"update-driver-handoff",
	"diagnostic:update-driver-handoff",
	"notice:ack",
	"notice:activating",
	"notice:verifying",
	"previous generation restoration",
	"post-update verification",
	"diagnostic:database snapshot",
	"diagnostic:database migration writes",
	"warning:database migration writes",
	"diagnostic:database rollback",
	"task-delivery-recovery",
	"driver:adopted",
	"driver:identity-unavailable",
	"reconcile:abandoned",
	"reconcile:superseded",
	"reconcile:acknowledged",
	"reconcile:settle"
];
/** Capture only path redaction facts; the state worker keeps its own authority environment. */
function captureUpdateRunRedactionFacts(env = process.env) {
	return {
		effectiveHome: resolveRequiredHomeDir(env),
		home: env.HOME,
		userProfile: env.USERPROFILE,
		configPath: env.OPENCLAW_CONFIG_PATH
	};
}
function resolveUpdateRunCodecEnv(stateEnv, facts) {
	return {
		...stateEnv ?? process.env,
		OPENCLAW_HOME: facts.effectiveHome,
		HOME: facts.home,
		USERPROFILE: facts.userProfile,
		OPENCLAW_CONFIG_PATH: facts.configPath
	};
}
function mapJsonText(value, transform, key) {
	if (typeof value === "string") return transform(value, key);
	if (Array.isArray(value)) return value.map((entry) => mapJsonText(entry, transform, key));
	if (isRecord(value)) return Object.fromEntries(Object.keys(value).toSorted().map((field) => [field, mapJsonText(value[field], transform, field)]));
	return value;
}
function compactConfigWriteRefusal(value) {
	if (!isRecord(value) || !Array.isArray(value.keys) || !value.keys.some((key) => typeof key === "string" && key.length > 0)) return;
	return mapJsonText(value, (text, key) => key === "keys" ? truncateUtf16Safe(text, Math.floor(text.length / 2)) : text);
}
function isRetainedStep(item) {
	return isRecord(item) && typeof item.step === "string" && (item.termination === "signal" || item.step.startsWith("finalize:") || RETAINED_STEP_NAMES.some((name) => name === item.step));
}
/** Phase history, notice custody, and restoration proof survive diagnostic eviction. */
function boundedJson(input, maxBytes = JSON_BYTES, preservedTextFields) {
	let value = input;
	let json = JSON.stringify(value);
	while (Buffer.byteLength(json) > maxBytes) {
		if (Array.isArray(value)) {
			const disposable = value.findIndex((item) => !isRetainedStep(item));
			if (disposable >= 0) value = value.toSpliced(disposable, 1);
			else {
				const compacted = value.map((item) => isRecord(item) && item.termination !== "signal" && item.step !== "task-delivery-recovery" && item.step !== "diagnostic:database snapshot" && item.step !== "diagnostic:database migration writes" && item.step !== "warning:database migration writes" && item.step !== "diagnostic:database rollback" && item.step !== "finalize:data-at-risk" && !(typeof item.step === "string" && item.step.startsWith("finalize:doctor-lint:")) ? {
					...item,
					detail: void 0,
					failureFacts: void 0,
					configWriteRefusal: compactConfigWriteRefusal(item.configWriteRefusal)
				} : item);
				if (JSON.stringify(compacted) === json) {
					const item = value.findLast((entry) => isRecord(entry) && typeof entry.stderrTail === "string" && entry.stderrTail.length > 0);
					if (!item) throw new Error("Update run retained step metadata exceeds its byte limit");
					value = value.with(value.indexOf(item), {
						...item,
						stderrTail: truncateUtf16Safe(item.stderrTail, Math.floor(item.stderrTail.length / 2))
					});
				} else value = compacted;
			}
		} else if (isRecord(value)) {
			const object = value;
			const arrayField = Object.keys(object).toSorted().find((field) => Array.isArray(object[field]) && object[field].length > 0);
			const array = arrayField ? object[arrayField] : void 0;
			if (arrayField && Array.isArray(array)) value = {
				...object,
				[arrayField]: array.slice(1)
			};
			else value = mapJsonText(value, (text, key) => key && preservedTextFields?.has(key) ? text : truncateUtf16Safe(text, Math.floor(text.length / 2)));
		} else throw new Error("Update run metadata exceeds its bounded schema");
		const nextJson = JSON.stringify(value);
		if (nextJson === json) throw new Error("Update run retained metadata exceeds its byte limit");
		json = nextJson;
	}
	return json;
}
function boundedOriginJson(origin) {
	const { driver, previousDrivers, updateRecoveryCapture, requester, sessionKey, deliveryContext, campaignId, ...admissionDiagnostics } = origin;
	const retained = JSON.stringify({
		driver,
		previousDrivers,
		updateRecoveryCapture
	});
	if (Buffer.byteLength(retained) > JSON_BYTES) throw new Error("Update run recovery receipts exceed the origin byte limit");
	const routing = {
		requester,
		sessionKey,
		deliveryContext,
		campaignId
	};
	const hasAdmission = origin.admission !== void 0 || origin.candidateAdmission !== void 0;
	const identities = hasAdmission ? JSON.stringify({
		driver,
		previousDrivers,
		updateRecoveryCapture,
		...routing
	}) : retained;
	const diagnostics = hasAdmission ? admissionDiagnostics : {
		...admissionDiagnostics,
		...routing
	};
	const diagnosticBudget = JSON_BYTES - Buffer.byteLength(identities) + 2 - (identities === "{}" ? 0 : 1);
	if (diagnostics.candidateAdmission?.warnings.length && Buffer.byteLength(JSON.stringify(diagnostics)) > diagnosticBudget) diagnostics.candidateAdmission = {
		...diagnostics.candidateAdmission,
		warnings: []
	};
	const preservedTextFields = /* @__PURE__ */ new Set([
		"owner",
		"verdict",
		"status",
		"code",
		"name",
		"candidateVersion",
		"installedVersion",
		"fallbackReason"
	]);
	const minimumDiagnostics = JSON.stringify(mapJsonText(diagnostics, (text, key) => key && preservedTextFields.has(key) ? text : ""));
	if (Buffer.byteLength(minimumDiagnostics) > diagnosticBudget) return retained;
	const boundedDiagnostics = boundedJson(diagnostics, diagnosticBudget, preservedTextFields);
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
	const { driver, previousDrivers, updateRecoveryCapture, ...originDiagnostics } = input.origin;
	const record = UpdateRunRecordSchema.parse(mapJsonText({
		...input,
		origin: originDiagnostics,
		steps: input.steps.map((step) => ({
			...step,
			...step.failureFacts ? { failureFacts: normalizeUpdateFailureFacts(step.failureFacts, env) } : {}
		}))
	}, (value, key) => {
		let text = redactSensitiveText(value, { mode: "tools" });
		for (const [pattern, replacement] of redactPaths) text = text.replace(pattern, () => replacement);
		return truncateUtf16Safe(text, key === "stderrTail" ? 8192 : UPDATE_RUN_TEXT_LIMIT);
	}));
	record.origin = UpdateRunRecordSchema.shape.origin.parse({
		...record.origin,
		driver,
		previousDrivers,
		updateRecoveryCapture
	});
	if (record.verification.recovery?.serviceRestartSafe === false) delete record.verification.recovery.dataAtRisk;
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
export { resolveUpdateRunCodecEnv as i, encodeRun as n, isRetainedStep as r, captureUpdateRunRedactionFacts as t };
