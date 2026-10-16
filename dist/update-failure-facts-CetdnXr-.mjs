import { c as readErrorName, i as extractErrorCode, n as collectErrorGraphCandidates, s as readErrorCauses } from "./error-coercion-CvJK4lmH.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CBoxhfke.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as UpdateFailureFactSchema, t as UpdateDestinationFailureSchema } from "./update-run-schema-DOichlUj.mjs";
import { a as redactPublicSupportDiagnosticLine, c as redactSupportString, s as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { t as npmFailurePackageName } from "./npm-error-DcU9_CMV.mjs";
import "./update-outcome-BHX5xsqd.mjs";
import { n as isPublicUpdateFailureCode } from "./update-failure-public-codes-C2YOHbsK.mjs";
import { pathToFileURL } from "node:url";
import path from "node:path";
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
	const configDiagnostic = fact.code === "invalid-config" && fact.message ? redactPublicSupportDiagnosticLine(fact.message, context) : void 0;
	const diagnostic = configDiagnostic && configDiagnostic !== "[redacted-diagnostic]" ? configDiagnostic : fact.message ? line(fact.message, Number.MAX_SAFE_INTEGER) : void 0;
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
		...destination ? { destination } : {},
		...fact.npmErrorCode || fact.code === "global-install-failed" ? { npmErrorCode: UpdateFailureFactSchema.shape.npmErrorCode.safeParse(fact.npmErrorCode).data ?? "unknown" } : {},
		...fact.packageSpec && npmFailurePackageName(fact.packageSpec) ? { packageSpec: fact.packageSpec } : {}
	};
}
function normalizeUpdateFailureFacts(facts, env = process.env) {
	return facts.slice(0, 5).map((fact) => createUpdateFailureFact(fact, env));
}
function createUpdateCanaryFailureFacts(params) {
	const { phase, signal, timedOut, exitWarning, failureMessage, diagnostic, findings, env } = params;
	if (signal) return [createUpdateFailureFact({
		check: phase,
		code: "signal",
		message: `${phase === "doctor" ? "Checking data migrations" : params.name}: terminated by ${signal}`
	}, env), ...(findings ?? []).slice(0, 4)];
	return findings?.length ? findings : [createUpdateFailureFact({
		check: phase,
		code: timedOut && !exitWarning ? "candidate-checks-timeout" : phase === "doctor" || phase === "lint" ? "doctor-failed" : `candidate-${phase}-failed`,
		message: timedOut ? failureMessage : diagnostic ?? failureMessage
	}, env)];
}
/** Config validation issues are more specific than the CLI's failure envelope. */
function parseConfigFailureFacts(stdout, env) {
	const report = safeParseJsonRecord(stdout);
	if (!Array.isArray(report?.issues)) return [];
	return normalizeUpdateFailureFacts(report.issues.flatMap((issue) => isRecord(issue) && typeof issue.message === "string" ? [{
		check: "config",
		code: "candidate-config-failed",
		message: issue.message,
		affectedKey: typeof issue.path === "string" ? issue.path : void 0
	}] : []), env);
}
//#endregion
export { parseConfigFailureFacts as a, normalizeUpdateFailureFacts as i, createUpdateErrorFact as n, createUpdateFailureFact as r, createUpdateCanaryFailureFacts as t };
