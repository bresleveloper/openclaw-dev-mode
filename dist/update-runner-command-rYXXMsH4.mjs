import { i as stripAnsi } from "./ansi-BeFJ0Uu7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as UPDATE_NPM_ERROR_CODES } from "./update-run-vocabulary-BuT3Q1bJ.mjs";
import { a as UPDATE_RUN_HEARTBEAT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { p as updatePreflightDetailMessage } from "./service-inspection-error-Bsltcpi4.mjs";
import { i as createGlobalInstallEnv } from "./update-global-rkW-mKvG.mjs";
import { s as redactSupportDiagnosticLine, t as normalizeSupportDiagnosticErrorCode } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { n as npmFailurePackageSpec, r as parseNpmErrorCode } from "./npm-error-DcU9_CMV.mjs";
import { w as trimLogTail } from "./restart-sentinel-CWHFSDjo.mjs";
import { n as createUpdateErrorFact, r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { r as isFailedUpdateStep, t as createUpdateStepFailureError } from "./update-run-step-BDxgGAu8.mjs";
//#region src/infra/update-npm-failure.ts
function sanitizeNpmLines(lines, context) {
	const marker = " …[truncated]";
	return lines.slice(0, 5).map((line) => {
		const message = redactSupportDiagnosticLine(line, context, Number.MAX_SAFE_INTEGER).replace(/^(npm (?:ERR!|error) code)\s+\S+/u, (_match, prefix) => `${prefix} ${normalizeSupportDiagnosticErrorCode(line.split(/\s+/u)[3]) ?? "unknown"}`);
		return Buffer.byteLength(message) > 200 ? `${truncateUtf8Prefix(message, 200 - Buffer.byteLength(marker))}${marker}` : message;
	});
}
/** Capture npm's error lines before command tails or permission guidance replace them. */
function createNpmFailureFacts(stdout, stderr, env = process.env, manager = "npm") {
	const output = stripAnsi(`${stderr}\n${stdout}`);
	const lines = output.split(/[\r\n\u2028\u2029]/u).map((line) => line.trim()).filter((line) => manager === "npm" ? /^npm (?:ERR!|error)(?:\s|$)/u.test(line) : line.startsWith("error:"));
	const code = normalizeSupportDiagnosticErrorCode(parseNpmErrorCode(output)) ?? "unknown";
	const npmErrorCode = UPDATE_NPM_ERROR_CODES.find((entry) => entry === code) ?? "unknown";
	const packageSpec = npmFailurePackageSpec(output);
	const context = {
		env,
		stateDir: resolveStateDir(env)
	};
	return sanitizeNpmLines(lines.length ? lines : [`${manager} error (no error lines captured)`], context).map((message, index) => ({
		check: manager,
		code,
		message,
		npmErrorCode: index === 0 ? npmErrorCode : void 0,
		packageSpec: index === 0 ? packageSpec : void 0
	}));
}
function formatNpmFailureFacts(facts, context) {
	const npm = facts.filter((fact) => fact.check === "npm" || fact.check === "bun").slice(0, 5);
	if (!npm.length) return [];
	const code = normalizeSupportDiagnosticErrorCode(npm[0]?.code) ?? "unknown";
	const remedy = updatePreflightDetailMessage(`npm-${code === "EPERM" ? "EACCES" : code === "E404" ? "ETARGET" : code}`)?.replace("<spec>", npm[0]?.packageSpec ? quoteCliArg(npm[0].packageSpec) : "<spec>");
	return [
		`${npm[0]?.check} failure code: ${code}`,
		...sanitizeNpmLines(npm.flatMap((fact) => fact.message ? [fact.message] : []), context),
		...remedy ? [`Next step: ${remedy}`] : []
	];
}
//#endregion
//#region src/infra/update-runner-command.ts
const MAX_LOG_CHARS = 8e3;
const warnedHeartbeats = /* @__PURE__ */ new WeakSet();
function selectCommandFailureMessage(stdout, stderr) {
	const lines = stripAnsi(stderr).split(/[\r\n\u2028\u2029]/u);
	if (!lines.find((line) => line.trim())?.trimStart().startsWith("$ ")) return stderr;
	return [...lines, ...stripAnsi(stdout).split(/[\r\n\u2028\u2029]/u)].find((line) => /^\s*\w*Error(?: \[[A-Z][A-Z0-9_]*\])?:\s/u.test(line)) ?? stderr;
}
async function reportUpdateStepCompletion(progress, step, commandFailure) {
	let reportOutcome = { ok: true };
	try {
		await progress?.onStepComplete?.(step);
	} catch (error) {
		reportOutcome = {
			ok: false,
			error
		};
	}
	if (reportOutcome.ok) return;
	if (commandFailure || isFailedUpdateStep(step)) {
		const failure = commandFailure ? commandFailure.cause : createUpdateStepFailureError(step);
		throw new AggregateError([failure, reportOutcome.error], "Update command and completion reporting failed", { cause: failure });
	}
	throw reportOutcome.error;
}
async function runStep(opts) {
	const { runCommand, name, argv, cwd, timeoutMs, env, progress, stepIndex, totalSteps } = opts;
	const command = argv.join(" ");
	const stepInfo = {
		name,
		command,
		index: stepIndex,
		total: totalSteps
	};
	await progress?.onStepStart?.(stepInfo);
	const started = Date.now();
	const onHeartbeat = progress?.onHeartbeat;
	const heartbeat = onHeartbeat ? setInterval(() => {
		try {
			onHeartbeat();
		} catch (error) {
			if (!warnedHeartbeats.has(onHeartbeat)) {
				warnedHeartbeats.add(onHeartbeat);
				console.warn(`[update] Could not refresh the update heartbeat; continuing the command: ${trimLogTail(formatErrorMessage(error), 500)}`);
			}
		}
	}, UPDATE_RUN_HEARTBEAT_MS) : void 0;
	heartbeat?.unref();
	let result;
	let commandError;
	let failureFacts;
	try {
		result = await runCommand(argv, {
			cwd,
			timeoutMs,
			env,
			...opts.input !== void 0 ? { input: opts.input } : {}
		});
	} catch (error) {
		commandError = { cause: error };
		const fact = createUpdateErrorFact(name, error, env);
		failureFacts = [fact];
		result = {
			code: 1,
			stdout: "",
			stderr: fact.message ?? ""
		};
	} finally {
		clearInterval(heartbeat);
	}
	const durationMs = Date.now() - started;
	const stdoutTail = trimLogTail(result.stdout, MAX_LOG_CHARS);
	const stderrTail = trimLogTail(result.stderr, MAX_LOG_CHARS);
	if (!failureFacts && result.code !== 0 && [
		"package-install",
		"package-install-prefer-online",
		"package-install-omit-optional",
		"package-pack"
	].includes(name) && (/(?:^|[\\/])(?:npm|bun)(?:\.cmd|\.exe)?$/iu.test(argv[0] ?? "") || /\bnpm (?:ERR!|error)(?:\s|$)/u.test(`${result.stderr}\n${result.stdout}`))) failureFacts = createNpmFailureFacts(result.stdout, result.stderr, env, /(?:^|[\\/])bun(?:\.exe)?$/iu.test(argv[0] ?? "") ? "bun" : "npm");
	failureFacts ??= isFailedUpdateStep({
		exitCode: result.code,
		killed: result.killed,
		outputLimitExceeded: result.outputLimitExceeded,
		termination: result.termination
	}) ? [createUpdateFailureFact({
		check: name,
		code: parseNpmErrorCode(result.stderr) ?? (result.termination && result.termination !== "exit" ? result.termination : "command-failed"),
		message: selectCommandFailureMessage(result.stdout, result.stderr)
	}, env)] : void 0;
	const completion = {
		name,
		command,
		durationMs,
		exitCode: result.code,
		stdoutTail,
		stderrTail,
		signal: result.signal,
		killed: result.killed,
		outputLimitExceeded: result.outputLimitExceeded,
		termination: result.termination,
		...failureFacts ? { failureFacts } : {}
	};
	const stepResult = {
		...completion,
		cwd
	};
	opts.results?.push(stepResult);
	await reportUpdateStepCompletion(progress, {
		...stepInfo,
		...completion
	}, commandError);
	if (commandError) throw commandError.cause;
	return stepResult;
}
function normalizeFallbackFailureReason(stepName) {
	switch (stepName) {
		case "package-install":
		case "package-install-omit-optional":
		case "package-install-prefer-online":
		case "package-stage":
		case "package-verify":
		case "package-swap": return "global-install-failed";
		case "openclaw doctor": return "doctor-failed";
		case "post-install-verify": return "runtime-verification-failed";
		case "post-doctor-ui-build": return "ui-build-failed";
		default: return "unexpected-error";
	}
}
async function buildUpdateCommandRunner(runCommand) {
	const defaultCommandEnv = await createGlobalInstallEnv();
	return {
		defaultCommandEnv,
		runCommand: runCommand ?? (async (argv, options) => await runCommandWithTimeout(argv, {
			...options,
			env: defaultCommandEnv && options.env ? {
				...defaultCommandEnv,
				...options.env
			} : defaultCommandEnv ?? options.env,
			killProcessTree: true
		}))
	};
}
//#endregion
export { runStep as a, reportUpdateStepCompletion as i, buildUpdateCommandRunner as n, formatNpmFailureFacts as o, normalizeFallbackFailureReason as r, MAX_LOG_CHARS as t };
