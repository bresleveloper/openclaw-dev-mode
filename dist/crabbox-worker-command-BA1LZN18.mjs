import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText, u as redactToolPayloadText } from "./redact-BcXJu5HP.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import "./logging-core-CsXmxYo2.mjs";
import { l as CRABBOX_STOP_TIMEOUT_MS } from "./crabbox-worker-timeouts-BzTVngvW.mjs";
import { homedir } from "node:os";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
//#region extensions/crabbox/src/crabbox-process.ts
function runCrabboxProcess(argv, options) {
	const command = options.cwd === void 0 && argv[0] && /[\\/]/u.test(argv[0]) ? [path.resolve(argv[0]), ...argv.slice(1)] : argv;
	return runCommandWithTimeout(command, {
		...options,
		cwd: options.cwd ?? homedir()
	});
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-command.ts
const MAX_OUTPUT_BYTES = 65536;
const MAX_COMMAND_DETAIL_CHARS = 512;
function sanitizeCrabboxNotice(text) {
	return sliceUtf16Safe(redactToolPayloadText(text).replace(/\s+/gu, " ").trim(), 0, 512);
}
function leaseRunArgs(context, forwardedEnvNames = [], envProfilePath) {
	return [
		"run",
		"--provider",
		context.provider,
		"--network",
		"public",
		"--tailscale=false",
		"--id",
		context.id,
		"--keep=true",
		"--no-sync",
		...forwardedEnvNames.flatMap((name) => ["--allow-env", name]),
		...envProfilePath ? ["--env-from-profile", envProfilePath] : [],
		"--script-stdin"
	];
}
async function runCrabboxCommand(params) {
	params.signal?.throwIfAborted();
	let result;
	try {
		result = await params.runCommand([params.binary, ...params.args], {
			timeoutMs: params.timeoutMs,
			maxOutputBytes: MAX_OUTPUT_BYTES,
			killProcessTree: true,
			...params.env === void 0 ? {} : { env: params.env },
			...params.input === void 0 ? {} : { input: params.input },
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		params.signal?.throwIfAborted();
		throw crabboxExecutionError(params.action, error);
	}
	params.signal?.throwIfAborted();
	return result;
}
function crabboxExecutionError(action, cause) {
	const message = cause instanceof Error ? cause.message : typeof cause === "string" ? cause : "unknown runner failure";
	const detail = redactToolPayloadText(message).replace(/\s+/gu, " ").trim();
	return /* @__PURE__ */ new Error(`Crabbox ${action} execution failed: ${sliceUtf16Safe(detail, -512)}`);
}
function crabboxCommandDetail(result) {
	const raw = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
	if (!raw) return "";
	const compressed = redactSensitiveText(raw).replace(/\s+/gu, " ");
	return compressed.length <= MAX_COMMAND_DETAIL_CHARS ? `: ${compressed}` : `: ... ${sliceUtf16Safe(compressed, -508)}`;
}
function crabboxCommandError(action, result) {
	const attempts = result.coordinatorAttempts ? ` (after ${result.coordinatorAttempts} attempts)` : "";
	const detail = crabboxCommandDetail(result) || result.coordinatorDetail || "";
	if (result.termination !== "exit") return /* @__PURE__ */ new Error(`Crabbox ${action} did not exit normally (${result.termination})${detail}${attempts}`);
	return /* @__PURE__ */ new Error(`Crabbox ${action} failed with exit code ${result.code ?? "unknown"}${detail}${attempts}`);
}
function crabboxCommandOutput(action, result) {
	if (result.termination !== "exit" || result.code !== 0) throw crabboxCommandError(action, result);
	return result.stdout;
}
function parseCrabboxJson(stdout, action) {
	try {
		return JSON.parse(stdout);
	} catch {
		throw new Error(`Crabbox ${action} returned invalid JSON`);
	}
}
function isCoordinatorTransportFailure(result) {
	if (result.termination !== "exit" || result.code === null || result.code === 0) return false;
	let hasLeaseTimeout = false;
	return `${result.stderr}\n${result.stdout}`.trim().split(/[\r\n]+/u).every((line) => {
		const diagnostic = line.replace(/^warning: could not inspect lease before release: /u, "");
		if (/^(?:context deadline exceeded\s+)?(?:Get|Post) "https:\/\/[^/\s"]+\/v1\/leases\/[^/\s"?]+(?:\/(?:release|heartbeat))?(?:\?[^\s"]*)?": context deadline exceeded$/u.test(diagnostic)) {
			hasLeaseTimeout = true;
			return true;
		}
		return diagnostic === "context deadline exceeded" || /^coordinator read retry \d+\/\d+ reason=timeout$/u.test(diagnostic);
	}) && hasLeaseTimeout;
}
function isFixedLeaseIdUnsupported(result, provider) {
	return result.termination === "exit" && result.code === 2 && result.stdout.trim() === "" && result.stderr.trim() === `provider=${provider} does not support fixed idempotent lease IDs`;
}
/** Only fixed-lease callers opt in; allocation keeps Gateway replay ownership. */
async function runCrabboxCommandWithCoordinatorRetry(params) {
	const deadline = performance.now() + params.timeoutMs;
	const sleep = params.sleep ?? ((ms, signal) => setTimeout(ms, void 0, { signal }));
	let timeoutMs = params.timeoutMs;
	let coordinatorDetail;
	for (let attempt = 1;; attempt += 1) {
		const result = await runCrabboxCommand({
			...params,
			timeoutMs
		});
		const transient = isCoordinatorTransportFailure(result);
		if (transient) coordinatorDetail = crabboxCommandDetail(result);
		const observed = transient || attempt > 1 ? {
			...result,
			coordinatorAttempts: attempt,
			coordinatorDetail
		} : result;
		const backoffMs = 1e3 * 2 ** (attempt - 1);
		if (!transient || attempt === 3 || deadline - performance.now() <= backoffMs) return observed;
		await sleep(backoffMs, params.signal);
		params.signal?.throwIfAborted();
		timeoutMs = deadline - performance.now();
		if (timeoutMs <= 0) return observed;
	}
}
function isUnrecognizedLease(result, identifier, action) {
	const output = `${result.stderr}\n${result.stdout}`;
	if (result.termination !== "exit" || result.code === null || result.code === 0 || !new RegExp(`(?:^|[^\\w-])${escapeRegExp(identifier)}(?=$|[^\\w-])`, "u").test(output) || /\b(?:access\s+denied|auth|authentication|authorization|credentials?|forbidden|permission|token|unauthorized)\b/iu.test(output)) return false;
	if (/\bcoordinator\b/iu.test(output)) {
		const responses = output.trim().split(/[\r\n]+/u).map((line) => line.match(/^(?:warning: could not inspect lease before release: )?coordinator (GET|POST) (?:https?:\/\/[^/\s]+)?\/v1\/leases\/([^/:?\s]+)(\/release)?(?:\?[^\s:]*)?:[ \t]*http (\d{3})\b([^\r\n]*)$/iu));
		const hasRead = responses.some((response) => response?.[1] === "GET" && response[2] === identifier && !response[3] && response[4] === "404");
		if (action === "inspect") return hasRead;
		return hasRead && responses.some((response) => response?.[1] === "POST" && response[3] === "/release") && responses.every((response) => response?.[2] === identifier && response[4] === "404" && (response[1] === "GET" ? !response[3] : response[3] === "/release") && /^:\s*(?:not_found|\{\s*"error"\s*:\s*"not_found"\s*\})\s*$/u.test(response[5] ?? ""));
	}
	return result.code === 4 && (/\b(?:was\s+)?not found\b/iu.test(output) || /\bno longer exists\b/iu.test(output) || /\b(?:points to|is bound to) (?:a )?missing (?:instance|sandbox)\b/iu.test(output) || /\bdisappeared before release\b/iu.test(output) || /\bunknown blacksmith testbox(?:\s|:)/iu.test(output) || action === "inspect" && (/\bis not claimed by Crabbox\b/iu.test(output) || /\bwandb sandbox "[^"\r\n]+" has no matching local ownership claim\b/iu.test(output)) || /\bunknown lease(?:\s|:)/iu.test(output)) || action === "inspect" && result.code === 5 && /\bcoder workspace "[^"\r\n]+" not found\b/iu.test(output);
}
async function stopCrabboxLease(params) {
	const deadline = performance.now() + CRABBOX_STOP_TIMEOUT_MS;
	let result = await runCrabboxCommandWithCoordinatorRetry({
		action: "stop",
		args: [
			"stop",
			"--provider",
			params.provider,
			"--id",
			params.id
		],
		binary: params.binary,
		runCommand: params.runCommand,
		sleep: params.sleep,
		timeoutMs: CRABBOX_STOP_TIMEOUT_MS
	});
	if (isUnrecognizedLease(result, params.id, "stop")) {
		params.warn(`Crabbox lease ${params.id} (provider ${params.provider}) is absent; treating stop as already released`);
		return;
	}
	const output = `${result.stderr}\n${result.stdout}`;
	if (params.provider === "azure" && result.termination === "exit" && result.code === 4 && output.includes("Azure fixed lease cannot be adopted without its create intent")) {
		const remainingMs = deadline - performance.now();
		if (remainingMs <= 0) throw new Error("Crabbox stop timed out before Azure fixed-lease recovery", { cause: crabboxCommandError("stop", result) });
		result = await runCrabboxCommandWithCoordinatorRetry({
			action: "stop recovery",
			args: [
				"stop",
				"--provider",
				params.provider,
				"--id",
				params.id,
				"--force"
			],
			binary: params.binary,
			runCommand: params.runCommand,
			sleep: params.sleep,
			timeoutMs: remainingMs
		});
	}
	crabboxCommandOutput("stop", result);
}
//#endregion
export { isUnrecognizedLease as a, runCrabboxCommand as c, stopCrabboxLease as d, runCrabboxProcess as f, isFixedLeaseIdUnsupported as i, runCrabboxCommandWithCoordinatorRetry as l, crabboxCommandOutput as n, leaseRunArgs as o, crabboxExecutionError as r, parseCrabboxJson as s, crabboxCommandError as t, sanitizeCrabboxNotice as u };
