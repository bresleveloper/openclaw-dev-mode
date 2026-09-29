import { c as readErrorName, i as extractErrorCode, n as collectErrorGraphCandidates, s as readErrorCauses } from "./error-coercion-C787aVxk.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-DV-j2dZ7.mjs";
import { t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { i as updateRecoverySchema, t as UpdateDestinationFailureSchema } from "./update-run-schema-BIZkdmqf.mjs";
import { a as redactSupportDiagnosticLine, o as redactSupportString, t as normalizeSupportDiagnosticErrorCode } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { r as UPDATE_ENVIRONMENT_FAILURE_REASONS, t as SKIPPED_UPDATE_OUTCOMES } from "./update-outcome-ZpL2Kt9B.mjs";
import { t as PLUGIN_CAPABILITY_CONSENT_REQUIRED } from "./capability-consent-error-details-CF5XfV3G.mjs";
import { t as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BYZF4sMi.mjs";
import { c as isServiceInspectionReason } from "./service-inspection-error-axo4k_qi.mjs";
import { pathToFileURL } from "node:url";
import path from "node:path";
//#region src/cli/daemon-cli/restart-health.types.ts
const GATEWAY_RESTART_WAIT_OUTCOMES = [
	"healthy",
	"plugin-errors",
	"channel-errors",
	"version-mismatch",
	"build-id-mismatch",
	"stale-pids",
	"stopped-free",
	"timeout",
	"still-starting",
	"generation-changed"
];
//#endregion
//#region src/infra/update-preflight-details.ts
const UPDATE_PREFLIGHT_DETAILS = {
	"installation-unclassified": "Installation ownership could not be determined. Run openclaw gateway status --deep and npm root -g; retry openclaw update from the owning installation or reinstall using the original method.",
	"target-registry-dist-tag": "The registry dist-tag did not resolve to a release. Check npm config get registry, then retry openclaw update --tag <published-version>.",
	"target-registry-metadata": "The registry package metadata could not be read. Check npm config get registry and registry connectivity, then retry openclaw update --tag <published-version>.",
	"target-version-resolution": "The target version is missing, invalid, or differs from the requested release. Verify the published version, then retry openclaw update --tag <published-version>.",
	"target-schema-metadata": "The target does not declare valid database schema support. Use a compatible artifact or retry openclaw update --tag <published-version> before initializing this profile.",
	"target-git-metadata": "The Git target manifest or revision could not be inspected. Check Git remote access and the selected ref, then retry openclaw update; a dry-run does not fetch missing objects."
};
function updatePreflightDetailMessage(code) {
	return Object.entries(UPDATE_PREFLIGHT_DETAILS).find(([key]) => key === code)?.[1];
}
function createUpdatePreflightFailure(code, detail) {
	const message = UPDATE_PREFLIGHT_DETAILS[code];
	return {
		message: detail ? `${message}\n${detail}` : message,
		failureFacts: [{
			check: code === "installation-unclassified" ? "installation-inspection" : "target-metadata-preflight",
			code,
			message
		}]
	};
}
//#endregion
//#region src/infra/update-step-identity.ts
const stepIds = new Map([
	...[
		...UPDATE_RUN_PHASES,
		"clean check",
		"upstream check",
		"tracked target ancestry",
		"git clone",
		"git fetch",
		"git remote",
		"git release remote",
		"git config update upstream",
		"git fetch tags",
		"git rollback clean",
		"git rollback clean untracked",
		"git rollback checkout",
		"git rollback reset",
		"git runtime rollback",
		"git import admitted target",
		"git target inspection fetch",
		"git runtime activation",
		"git update",
		"git update pack cleanup",
		"git target inspection cleanup",
		"git pin update upstream",
		"git update history",
		"git update tree",
		"git retained tree",
		"git retained object availability",
		"git retained object inventory",
		"git pack update",
		"git update pack read",
		"git import admitted upstream",
		"git rev-list",
		"preflight worktree",
		"preflight cleanup",
		"ui assets verify",
		"rollback outcome recording",
		"local package overrides",
		"package update",
		"package stage cleanup",
		"npm lifecycle policy preflight",
		"pnpm isolated install preflight",
		"state schema verification",
		"config rollback",
		"package rollback",
		"gateway verification",
		"gateway recovery verification",
		"rollback gateway verification",
		"previous gateway verification",
		"previous generation restoration",
		"post-update verification",
		"managed-service update handoff",
		"Windows task autostart recovery",
		"update executor settlement",
		"original managed service compensation",
		"Doctor config changes",
		"post-core plugin finalize",
		"repair restart"
	].map((name) => [name, name.toLowerCase().replaceAll(" ", "-")]),
	["global update", "package-install"],
	["global update (omit optional)", "package-install-omit-optional"],
	["global update pack", "package-pack"],
	["global update pack verify", "package-pack-verify"],
	["global install stage", "package-stage"],
	["global install verify", "package-verify"],
	["global install swap", "package-swap"],
	["global install rollback", "package-rollback"],
	["global install backup retention", "package-backup-retention"],
	["global install permissions", "package-permissions"],
	["openclaw doctor", "package-doctor"],
	["openclaw doctor entry", "package-doctor-entry"],
	["post-install verification", "post-install-verify"],
	["ui:build (post-doctor repair)", "post-doctor-ui-build"],
	["git rollback verify HEAD", "git-rollback-verify-head"],
	["git rev-parse HEAD (after)", "git-verify-head"],
	["Checking update runtime", "candidate-runtime"],
	["Preparing update checks", "candidate-state-snapshot"],
	["Checking data migrations", "candidate-doctor"],
	["Checking update health", "candidate-doctor-lint"],
	["Checking configuration", "candidate-config"],
	["Checking plugins", "candidate-plugins"],
	["Checking update recovery", "candidate-recovery"],
	["Checking Gateway startup", "candidate-gateway-startup"],
	["candidate snapshot", "candidate-state-snapshot"],
	["candidate doctor", "candidate-doctor"],
	["candidate lint", "candidate-doctor-lint"],
	["candidate config", "candidate-config"],
	["candidate plugins", "candidate-plugins"],
	["candidate runtime", "candidate-runtime"],
	["candidate migration rehearsal", "candidate-doctor"],
	["candidate doctor lint", "candidate-doctor-lint"],
	["candidate config validation", "candidate-config"],
	["candidate plugin resolution", "candidate-plugins"],
	["candidate migration continuation", "candidate-recovery"],
	["candidate gateway canary", "candidate-gateway-startup"],
	["candidate rehearsal cleanup", "candidate-state-cleanup"],
	["Removing temporary update files", "candidate-state-cleanup"],
	["Removing temporary plugin inventory", "candidate-plugin-inventory-cleanup"],
	...[
		"preflight",
		"targetConfigValidation",
		"configSnapshot",
		"doctor",
		"plugins",
		"targetConfigConvergence",
		"completionCache",
		"package-rollback-not-needed",
		"repair-continuation",
		"repair-takeover",
		"exit"
	].map((phase) => [`finalize:${phase}`, `finalize-${phase.replace(/[A-Z]/gu, (letter) => `-${letter.toLowerCase()}`)}`])
]);
for (const [name, id] of stepIds) if (name.startsWith("Checking ") && !name.endsWith(" cleanup")) stepIds.set(`${name} cleanup`, `${id}-cleanup`);
for (const manager of [
	"npm",
	"pnpm",
	"bun"
]) for (const suffix of [
	"staging preflight",
	"package preinstall",
	"package postinstall",
	"package lifecycle"
]) {
	const name = `${manager} ${suffix}`;
	stepIds.set(name, name.replaceAll(" ", "-"));
}
for (const operation of [
	"reset",
	"clean",
	"checkout",
	"local checkout",
	"rebase",
	"rebase --abort",
	"node runtime",
	"package manager",
	"deps install",
	"deps install (ignore scripts)",
	"build",
	"ui:build",
	"ui assets verify",
	"config validate",
	"lint",
	"update clean check",
	"update source check"
]) stepIds.set(`preflight ${operation}`, `preflight-${operation.replace(/[^a-z]+/gu, "-").replace(/-$/u, "")}`);
const publicIds = new Set(stepIds.values());
const gitArgumentSteps = [
	["git rollback delete ", "git-rollback-delete-branch"],
	["git checkout ", "git-checkout"],
	["git branch --set-upstream-to ", "git-set-upstream"],
	["git fetch tags ", "git-fetch-tags"],
	["git fetch ", "git-fetch-target-tag"],
	["git rev-parse ", "git-resolve-target"],
	["git show-ref ", "git-show-branch"]
];
for (const [, id] of gitArgumentSteps) publicIds.add(id);
publicIds.add("git-resolve-upstream");
/** A closed projection also handles history produced by a restored released updater. */
function resolvePublicUpdateStepId(name) {
	return stepIds.get(name) ?? (publicIds.has(name) ? name : void 0) ?? stepIds.get(name.replace(/ \([a-f0-9]{7,40}\)$/u, "")) ?? gitArgumentSteps.find(([prefix]) => name.startsWith(prefix))?.[1] ?? (/^repair attempt \d+$/u.test(name) ? "repair-attempt" : void 0);
}
//#endregion
//#region src/infra/update-failure-public-identifiers.ts
const CANARY_CHECKS = [
	"snapshot",
	"config",
	"plugins",
	"runtime",
	"startup",
	"readiness"
];
const NATIVE_CHECKS = /* @__PURE__ */ new Set([
	...UPDATE_RUN_PHASES,
	...CANARY_CHECKS,
	"doctor",
	"lint",
	"config-write",
	"preflight",
	"installation-inspection",
	"target-resolution",
	"git update",
	"update",
	"targetConfigValidation",
	"configSnapshot",
	"targetConfigConvergence",
	"completionCache",
	"readyz",
	"startupz",
	"versionMatch",
	"service",
	"pluginErrors",
	"channelsReady",
	"settled",
	"gateway-recovery",
	"node-runtime",
	"managed-service",
	"managed-service-preflight",
	"package-install",
	"package-swap",
	"package-runtime",
	"plugin-update",
	"plugin-sync",
	"plugin-convergence",
	"build",
	"openclaw doctor",
	"post-install verification",
	"package rollback",
	"global install verify",
	"global install swap",
	"npm lifecycle policy preflight"
]);
const PUBLIC_CODES = /* @__PURE__ */ new Set([
	...Object.keys(UPDATE_PREFLIGHT_DETAILS),
	...Object.keys(SKIPPED_UPDATE_OUTCOMES),
	...Object.values(PLUGIN_INSTALL_ERROR_CODE),
	...Object.values(CLAWHUB_INSTALL_ERROR_CODE),
	PLUGIN_CAPABILITY_CONSENT_REQUIRED,
	...updateRecoverySchema.options[1].shape.reason.options,
	...GATEWAY_RESTART_WAIT_OUTCOMES,
	...CANARY_CHECKS.map((phase) => `candidate-${phase}-failed`),
	"candidate-readiness-probe-failed",
	"Error",
	"TypeError",
	"SyntaxError",
	"RangeError",
	"ReferenceError",
	"URIError",
	"EvalError",
	"AggregateError",
	"ERR_SQLITE_ERROR",
	"SQLITE_BUSY",
	"SQLITE_LOCKED",
	"SQLITE_READONLY",
	"SQLITE_IOERR",
	"SQLITE_FULL",
	"command-failed",
	"doctor-failed",
	"agent-database-lease-active",
	"global-install-failed",
	...UPDATE_ENVIRONMENT_FAILURE_REASONS,
	"already-current",
	"container-image-install",
	"unmanaged-package-install",
	"package-update-requires-cli",
	"swap-failed",
	"verification-result-missing",
	"finalization-timeout",
	"finalization-failed",
	"no-output-timeout",
	"signal",
	"readyz-unhealthy",
	"service-not-running",
	"restart-unhealthy",
	"gateway-probe-failed",
	"restart-health-pending",
	"managed-service-preflight",
	"service-inspection-unavailable",
	"service-ownership-unverified",
	"database-schema-preflight",
	"update-ledger-busy",
	"invalid-git-directory",
	"managed-service-handoff-started",
	"managed-service-handoff-already-running",
	"managed-service-handoff-cancelled",
	"managed-service-handoff-failed",
	"managed-service-stop-failed",
	"rollback-state-unverified",
	"target-metadata-preflight",
	"target-native-unsupported",
	"target-state-initialization",
	"source-exposure-preparation-failed",
	"plugin-update-failed",
	"plugin-sync-failed",
	"post-update-plugins",
	"post-plugin-doctor-execution-failed",
	"post-plugin-doctor-invalid-config",
	"post-plugin-config-validation-execution-failed",
	"post-plugin-update-readiness-execution-failed",
	"post-plugin-update-readiness-failed",
	"invalid-config",
	"validation",
	"cron-owner-safety",
	"include-ownership",
	"config-conflict",
	"config-input-changed",
	"requester-revoked",
	"repair-requires-config-change"
]);
let publicPluginIds;
let publicDoctorCheckIds;
function loadPublicPluginIds() {
	publicPluginIds ??= Promise.all([import("./official-external-plugin-bundled-catalogs-BHSMJki_.mjs"), import("./official-external-plugin-catalog-source-KZziGsJJ.mjs")]).then(([catalogs, identities]) => {
		const ids = /* @__PURE__ */ new Set();
		for (const entry of catalogs.BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES) {
			const id = identities.resolveOfficialExternalPluginId(entry);
			if (id) ids.add(id);
		}
		return ids;
	});
	return publicPluginIds;
}
function loadPublicDoctorCheckIds() {
	publicDoctorCheckIds ??= import("./doctor-health-contributions-CJ_HJbjn.mjs").then((doctor) => doctor.resolveDoctorContributionHealthChecks()).then((checks) => new Set(checks.map((check) => check.id)));
	return publicDoctorCheckIds;
}
/** Capture catalogs before an interactive update can replace their code. */
async function preparePublicUpdateFailureIdentifiers() {
	await Promise.allSettled([loadPublicDoctorCheckIds(), loadPublicPluginIds()]);
}
function isPublicUpdateFailureCode(code) {
	return PUBLIC_CODES.has(code) || isServiceInspectionReason(code) || normalizeSupportDiagnosticErrorCode(code) !== void 0;
}
/** Only source-defined public identities leave the local diagnostic report. */
async function projectPublicUpdateFailureIdentifiers(fact) {
	const nativeCheck = NATIVE_CHECKS.has(fact.check) || resolvePublicUpdateStepId(fact.check) === fact.check || isPublicUpdateFailureCode(fact.check);
	const [doctorIds, pluginIds] = await Promise.all([nativeCheck ? void 0 : loadPublicDoctorCheckIds().catch(() => void 0), fact.pluginId ? loadPublicPluginIds().catch(() => void 0) : void 0]);
	return {
		check: nativeCheck || doctorIds?.has(fact.check) ? fact.check : "[redacted-check]",
		code: isPublicUpdateFailureCode(fact.code) ? fact.code : fact.errorName ? isPublicUpdateFailureCode(fact.errorName) ? fact.errorName : "[redacted-error-class]" : "[redacted-code]",
		...fact.pluginId ? { pluginId: pluginIds?.has(fact.pluginId) ? fact.pluginId : "[redacted-plugin]" } : {}
	};
}
//#endregion
//#region src/infra/update-failure-facts.ts
function normalizeDestinationFailure(fact, context) {
	const sanitizePath = (value) => {
		if (value === null) return null;
		if (typeof value !== "string" || containsAsciiControlCharacter(value) || /[`\u2028\u2029]/u.test(value) || !/^(?:[/\\]|[A-Za-z]:[/\\]|~[/\\]|\$OPENCLAW_STATE_DIR(?:[/\\]|$))/u.test(value)) return "[redacted-path]";
		return truncateUtf16Safe(redactSupportString(value, context, { maxLength: Number.MAX_SAFE_INTEGER }).replace(/([/\\](?:home|Users)[/\\])[^/\\]+/giu, "$1[redacted-user]"), 240);
	};
	const parsed = UpdateDestinationFailureSchema.safeParse({
		...fact,
		prefix: sanitizePath(fact.prefix),
		packageRoot: sanitizePath(fact.packageRoot),
		runningRoot: sanitizePath(fact.runningRoot),
		runningPrefix: sanitizePath(fact.runningPrefix),
		launcher: sanitizePath(fact.launcher),
		launcherTarget: sanitizePath(fact.launcherTarget)
	});
	return parsed.success ? parsed.data : void 0;
}
function readErrorMetadata(read) {
	try {
		return read();
	} catch {
		return;
	}
}
function createUpdateErrorFact(check, error, env = process.env) {
	const errors = collectErrorGraphCandidates(error ?? String(error), (current) => [...readErrorMetadata(() => readErrorCauses(current)) ?? [], readErrorMetadata(() => current.cause)]).map((current) => {
		const rawName = readErrorMetadata(() => current instanceof Error ? current.constructor.name : readErrorName(current));
		const name = typeof rawName === "string" && isPublicUpdateFailureCode(rawName) ? rawName : "Error";
		const code = extractErrorCode(current);
		const detail = readErrorMetadata(() => isRecord(current) ? current.message : typeof current === "object" || typeof current === "function" ? void 0 : formatErrorMessage(current));
		const { message } = createUpdateFailureFact({
			check,
			code: name,
			errorName: name,
			message: typeof detail === "string" && detail ? detail : name
		}, env);
		return Object.assign(new Error(message), {
			name,
			code: code && isPublicUpdateFailureCode(code) ? code : void 0
		});
	});
	const primary = errors[0];
	const stack = readErrorMetadata(() => error instanceof Error ? error.stack : void 0);
	const root = readErrorMetadata(() => resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url }));
	const prefixes = root ? [`${root.replaceAll("\\", "/")}/`, pathToFileURL(`${root}${path.sep}`).href] : [];
	let location;
	for (const frame of typeof stack === "string" ? stack.split("\n").slice(1) : []) {
		const file = /((?:file:\/\/)?(?:\/|[A-Z]:[\\/])[^()\r\n]+:\d+:\d+)\)?$/u.exec(frame)?.[1]?.replaceAll("\\", "/");
		const prefix = prefixes.find((candidate) => file?.startsWith(candidate));
		const local = prefix && file ? path.posix.normalize(file.slice(prefix.length)) : null;
		if (local && !local.includes("/node_modules/") && /^(?:src|dist|packages|extensions)\/[A-Za-z0-9_./-]+:\d+:\d+$/u.test(local)) {
			location = local;
			break;
		}
	}
	return createUpdateFailureFact({
		check,
		code: primary?.code ?? primary?.name ?? "Error",
		errorName: primary?.name ?? "Error",
		location: location ?? null,
		message: formatErrorMessage(new AggregateError(errors, primary?.message))
	}, env);
}
/** Capture diagnostics before output is reduced to a command tail. */
function createUpdateFailureFact(fact, env = process.env) {
	const context = {
		env,
		stateDir: resolveStateDir(env)
	};
	const line = (value, limit) => redactSupportDiagnosticLine(value, context, limit);
	const diagnostic = fact.message ? line(fact.message, Number.MAX_SAFE_INTEGER) : void 0;
	const message = fact.errorName ? diagnostic?.replace(/\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z][a-zA-Z0-9-]*(?::\d+)?\b|\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b|(?<!\w)(?:[A-Fa-f0-9]{0,4}:){2,}[A-Fa-f0-9:.%]*/gu, "[redacted-host]").replace(/\b(host(?:name)?|server|endpoint)\s*[=:]\s*["']?[A-Za-z0-9-]+["']?/giu, "$1=[redacted-host]") : diagnostic;
	const location = fact.location && /^(?:src|dist|packages|extensions)\/[A-Za-z0-9_./-]+:\d+:\d+$/u.test(fact.location) ? line(fact.location, 160) : null;
	const destination = fact.code === "global-install-foreign-destination" && fact.destination ? normalizeDestinationFailure(fact.destination, context) : void 0;
	return {
		check: line(fact.check, 128),
		code: line(fact.code, 80),
		...message ? { message: line(message, 200) } : {},
		...fact.errorName ? { errorName: line(fact.errorName, 80) } : {},
		...fact.location !== void 0 ? { location } : {},
		...fact.affectedKey ? { affectedKey: line(fact.affectedKey, 128) } : {},
		...fact.pluginId ? { pluginId: line(fact.pluginId, 80) } : {},
		...destination ? { destination } : {}
	};
}
function normalizeUpdateFailureFacts(facts, env = process.env) {
	return facts.slice(0, 5).map((fact) => createUpdateFailureFact(fact, env));
}
/** Config validation issues are more specific than the CLI's failure envelope. */
function parseConfigFailureFacts(stdout, env) {
	let report;
	try {
		report = JSON.parse(stdout);
	} catch {
		return [];
	}
	if (!isRecord(report) || !Array.isArray(report.issues)) return [];
	return normalizeUpdateFailureFacts(report.issues.flatMap((issue) => isRecord(issue) && typeof issue.message === "string" ? [{
		check: "config",
		code: "candidate-config-failed",
		message: issue.message,
		affectedKey: typeof issue.path === "string" ? issue.path : void 0
	}] : []), env);
}
//#endregion
export { isPublicUpdateFailureCode as a, resolvePublicUpdateStepId as c, parseConfigFailureFacts as i, createUpdatePreflightFailure as l, createUpdateFailureFact as n, preparePublicUpdateFailureIdentifiers as o, normalizeUpdateFailureFacts as r, projectPublicUpdateFailureIdentifiers as s, createUpdateErrorFact as t, updatePreflightDetailMessage as u };
