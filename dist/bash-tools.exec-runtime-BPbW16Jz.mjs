import { s as formatErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as killProcessTree } from "./kill-tree-D8IW3UNJ.mjs";
import { u as redactToolPayloadText } from "./redact-BcXJu5HP.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage$1 } from "./errors-DPfGDWk1.mjs";
import { L as recordDiagnosticToolExecutionDeadline, i as emitDiagnosticEventWithTrustedTraceContext } from "./diagnostic-events-C91J-XX8.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { s as omitGatewayCredentialEnv } from "./host-env-security-D0hvR517.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { i as withChildProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS } from "./exec-approvals-core-7oJu_fRe.mjs";
import { l as withSystemEventOwner } from "./system-event-ownership-DAgHWXZ1.mjs";
import { d as withExecRequestOwners, l as readExecRequestOwners, s as execRequestAbortSignal, u as retainExecRequestProcess } from "./exec-request-context-CWnK9ayt.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { l as enqueueSystemEventWithReceipt } from "./system-events-Bf4ozS7L.mjs";
import { r as captureSessionEventTargetForHost, t as enqueueSessionEventForHost } from "./session-event-handoff-BLWR3ywE.mjs";
import { o as resolveExecApprovalAllowedDecisions } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { m as withoutGatewayToolCallerIdentity, o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { r as markToolExecutionNotStarted } from "./tool-effect-receipt-BHVAm8DM.mjs";
import { a as appendExecTimeoutRetryGuidance, c as renderExecExitLabel, l as renderExecOutputText, o as compactNotifyOutput, u as renderExecUpdateText } from "./bash-tools.exec-output-C0VhBuNW.mjs";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.mjs";
import { n as createSessionSlug } from "./session-slug-mrhmi8jZ.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-ClVlVfGz.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { a as removePathPrepend, n as findPathKey, r as mergePathPrepend } from "./path-prepend-D21kYd3c.mjs";
import { t as spawnProcess } from "./spawn-utils-o4xgZL-d.mjs";
import { t as getProcessSupervisor } from "./supervisor-BxKhxTp_.mjs";
import { a as registerSecretEgressProxyProcess } from "./registry-vAykEA0u.mjs";
import { r as captureAgentToolSourceExecutionGuard, s as runWithAgentToolSourceExecutionScope } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { C as tail, D as chunkString, O as clampWithDefault, S as settleExecSessionFinalization, T as waitForExecSession, d as isProcessSessionIdTaken, g as markExited, j as readEnvInt, n as addSession, r as appendOutput, v as processSessionInstanceId, x as resolveProcessCleanupMs, y as recordNotifyOnExitRemoval } from "./bash-process-registry-D3AARAgk.mjs";
import { t as prependShellPath } from "./login-shell-path-carrier-R4yUJcLb.mjs";
import { t as buildGitHubExecLaunchArgv } from "./github-exec-launch-IIN8uo4w.mjs";
import { n as createStreamingBinaryOutputSanitizer, o as getShellConfig } from "./shell-utils-bJwhgbCe.mjs";
import { t as resolveEventSessionKeyForPolicy } from "./event-session-routing-TMTpLGFx.mjs";
import { t as isRequestedExecTargetAllowed } from "./bash-tools.exec-target-CRl70nUx.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import "./tool-result-error-IpvGgAny.mjs";
import { statSync } from "node:fs";
import { createHash } from "node:crypto";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/agents/bash-tools.exec-diagnostics.ts
function emitExecProcessCompleted(params) {
	const signal = params.outcome.exitSignal;
	const exitSignal = signal === null ? void 0 : String(signal);
	emitDiagnosticEventWithTrustedTraceContext({
		type: "exec.process.completed",
		target: params.target,
		mode: params.mode,
		outcome: params.outcome.status,
		durationMs: params.outcome.durationMs,
		commandLength: params.command.length,
		...params.sessionKey?.trim() ? { sessionKey: params.sessionKey.trim() } : {},
		...typeof params.outcome.exitCode === "number" ? { exitCode: params.outcome.exitCode } : {},
		...exitSignal ? { exitSignal } : {},
		...params.outcome.status === "failed" ? {
			timedOut: params.outcome.timedOut,
			failureKind: params.outcome.failureKind
		} : {}
	});
}
//#endregion
//#region src/agents/bash-tools.exec-path-prepend.ts
/**
* Apply PATH prepends inside the shell command.
* This ensures our paths take precedence even if user RC files (e.g. ~/.zshenv)
* prepend their own entries to PATH during shell startup.
*/
function wrapPosixCommandWithPathPrepend(command, env, pathPrepend) {
	if (process.platform === "win32") return command;
	if (!pathPrepend || pathPrepend.length === 0) return command;
	const pathKey = findPathKey(env);
	const currentPath = env[pathKey];
	if (currentPath) {
		const newPath = removePathPrepend(currentPath, pathPrepend);
		if (newPath !== void 0) env[pathKey] = newPath;
	}
	return prependShellPath(command, env, pathPrepend.join(path.delimiter));
}
//#endregion
//#region src/agents/shell-snapshot.ts
const SNAPSHOT_VERSION = 1;
const SNAPSHOT_REFRESH_MS = 3e5;
const SNAPSHOT_MAX_AGE_MS = 2592e5;
const SNAPSHOT_CACHE_MAX_ENTRIES = 128;
const CAPTURE_MARKER = "__OPENCLAW_SHELL_SNAPSHOT_CAPTURE__";
const ENV_MARKER = "__OPENCLAW_SHELL_SNAPSHOT_ENV__";
const EXEC_SHELL_SNAPSHOT_ENV = "OPENCLAW_EXEC_SHELL_SNAPSHOT";
const SNAPSHOT_SHELLS = /* @__PURE__ */ new Set(["bash", "zsh"]);
const SNAPSHOT_DISABLE_VALUES = /* @__PURE__ */ new Set([
	"0",
	"false",
	"no",
	"off"
]);
const SAFE_ENV_NAMES = /* @__PURE__ */ new Set([
	"ASDF_DIR",
	"BUN_INSTALL",
	"CARGO_HOME",
	"CDPATH",
	"GOPATH",
	"GOROOT",
	"GOENV_ROOT",
	"HOMEBREW_CELLAR",
	"HOMEBREW_PREFIX",
	"HOMEBREW_REPOSITORY",
	"INFOPATH",
	"MANPATH",
	"NVM_DIR",
	"PATH",
	"PNPM_HOME",
	"PYENV_ROOT",
	"RBENV_ROOT",
	"RUSTUP_HOME",
	"VOLTA_HOME"
]);
const CAPTURE_ENV_NAMES = /* @__PURE__ */ new Set([
	...SAFE_ENV_NAMES,
	"HOME",
	"OPENCLAW_SHELL",
	"SHELL",
	"USERPROFILE",
	"ZDOTDIR"
]);
const SECRET_ENV_PATTERN = /(secret|token|password|passwd|credential|cookie|session|auth|key)/i;
const SECRET_SHELL_STATE_PATTERNS = [
	/\b(authorization|api[_-]?key|access[_-]?token|refresh[_-]?token|secret|password|passwd|credential)\b\s*[:=]/i,
	/\b[A-Z][A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PASSWD|CREDENTIAL|API_KEY|ACCESS_KEY|SESSION)[A-Z0-9_]*\s*[:=]/,
	/\b(GITHUB_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY|GEMINI_API_KEY)\b/,
	/\b(ghp_|github_pat_|sk-[A-Za-z0-9]|xox[baprs]-|ya29\.|AIza[0-9A-Za-z_-]|AKIA[0-9A-Z]{16})/,
	/-----BEGIN [A-Z ]*PRIVATE KEY-----/
];
const snapshotCache = new LruCache(SNAPSHOT_CACHE_MAX_ENTRIES);
let cleanupPromise = null;
async function maybeWrapCommandWithShellSnapshot(opts) {
	if (opts.enabled === false || process.platform === "win32" || isExecShellSnapshotDisabled(process.env) || !isSupportedSnapshotShell(opts.shell, opts.shellArgs)) return opts.command;
	try {
		const snapshotPath = await getOrCreateShellSnapshot(opts);
		return snapshotPath ? buildSnapshotWrappedCommand(opts.command, snapshotPath, buildRuntimeEnvRestoreScript(opts.env)) : opts.command;
	} catch {
		return opts.command;
	}
}
function resolveShellSnapshotDir(env = process.env) {
	return path.join(resolveStateDir(env), "cache", "shell-snapshots");
}
function isSupportedSnapshotShell(shell, shellArgs) {
	return shellArgs.includes("-c") && SNAPSHOT_SHELLS.has(path.basename(shell));
}
function isExecShellSnapshotDisabled(env) {
	const value = env[EXEC_SHELL_SNAPSHOT_ENV]?.trim().toLowerCase();
	return Boolean(value && SNAPSHOT_DISABLE_VALUES.has(value));
}
async function getOrCreateShellSnapshot(opts) {
	const key = buildSnapshotKey(opts);
	const cached = snapshotCache.get(key);
	const now = Date.now();
	if (cached && now - cached.createdAtMs < SNAPSHOT_REFRESH_MS) return await cached.promise;
	const created = createShellSnapshot(opts, key, Boolean(cached));
	snapshotCache.set(key, {
		createdAtMs: now,
		promise: created
	});
	return await created;
}
function buildSnapshotKey(opts) {
	return createHash("sha256").update(JSON.stringify({
		version: SNAPSHOT_VERSION,
		shell: opts.shell,
		shellArgs: opts.shellArgs,
		cwd: path.resolve(opts.cwd),
		home: getTrustedShellHome(),
		stateDir: resolveStateDir(process.env),
		env: buildSafeEnvSignature(process.env),
		startup: buildStartupSignature(opts.shell)
	})).digest("hex");
}
function buildSafeEnvSignature(env) {
	return [...SAFE_ENV_NAMES].toSorted().map((key) => [key, env[key] ?? null]);
}
function buildStartupSignature(shell) {
	const shellName = path.basename(shell);
	const home = getTrustedShellHome();
	const zdotdir = process.env.ZDOTDIR?.trim() || home;
	return (shellName === "zsh" ? [path.join(zdotdir, ".zshrc")] : shellName === "bash" ? [path.join(home, ".bashrc")] : []).map((candidate) => {
		try {
			const stat = statSync(candidate);
			return [
				candidate,
				stat.mtimeMs,
				stat.size
			];
		} catch {
			return [candidate, null];
		}
	});
}
function readNonBlankPathEnv(value) {
	return value?.trim() ? value : void 0;
}
function getTrustedShellHome() {
	const configuredHome = readNonBlankPathEnv(process.env.HOME) ?? readNonBlankPathEnv(process.env.USERPROFILE);
	if (configuredHome) return configuredHome;
	const accountHome = readNonBlankPathEnv(os.userInfo().homedir);
	if (!accountHome) throw new Error("Unable to resolve the current user's home directory");
	return accountHome;
}
async function createShellSnapshot(opts, key, forceRefresh) {
	const snapshotDir = resolveShellSnapshotDir(process.env);
	await fs$1.mkdir(snapshotDir, {
		recursive: true,
		mode: 448
	});
	cleanupPromise ??= cleanupStaleSnapshots(snapshotDir);
	const snapshotPath = path.join(snapshotDir, `${key}.sh`);
	if (!forceRefresh && await isFreshSnapshot(snapshotPath)) return snapshotPath;
	const capture = await captureShellSnapshot(opts);
	if (!capture) return null;
	const tmpPath = path.join(snapshotDir, `${key}.${process.pid}.${Date.now()}.tmp`);
	await fs$1.writeFile(tmpPath, capture, {
		encoding: "utf8",
		mode: 384
	});
	await fs$1.chmod(tmpPath, 384);
	if (!await validateSnapshot(opts, tmpPath)) {
		await fs$1.rm(tmpPath, { force: true });
		return null;
	}
	await fs$1.rename(tmpPath, snapshotPath);
	await fs$1.chmod(snapshotPath, 384);
	return snapshotPath;
}
async function isFreshSnapshot(snapshotPath) {
	try {
		const stat = await fs$1.stat(snapshotPath);
		return Date.now() - stat.mtimeMs < SNAPSHOT_REFRESH_MS;
	} catch {
		return false;
	}
}
async function validateSnapshot(opts, snapshotPath) {
	return await runShell({
		shell: opts.shell,
		shellArgs: opts.shellArgs,
		cwd: opts.cwd,
		env: buildTrustedSnapshotCaptureEnv(opts.env),
		command: `. ${shQuote(snapshotPath)} >/dev/null 2>&1`,
		timeoutMs: 2e3
	}) === 0;
}
async function captureShellSnapshot(opts) {
	const shellName = path.basename(opts.shell);
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-shell-snapshot-",
		dirMode: 448,
		mode: 384
	}, async (workspace) => {
		const captureOutputPath = await workspace.writeText("snapshot.out", "");
		const captureCommand = [
			"{",
			shellName === "zsh" ? `if [ -r "\${ZDOTDIR:-$HOME}/.zshrc" ]; then . "\${ZDOTDIR:-$HOME}/.zshrc"; fi` : ":",
			`printf '\\n%s\\n' ${shQuote(CAPTURE_MARKER)}`,
			shellName === "zsh" ? "alias -L 2>/dev/null || true" : "alias 2>/dev/null || true",
			"(typeset -f 2>/dev/null || declare -f 2>/dev/null || true)",
			`printf '\\n%s\\n' ${shQuote(ENV_MARKER)}`,
			`${shQuote(process.execPath)} -e ${shQuote(ENV_CAPTURE_NODE_SCRIPT)}`,
			`} > ${shQuote(captureOutputPath)}`
		].join("\n");
		if (await runShell({
			shell: opts.shell,
			shellArgs: shellName === "bash" ? ["-i", "-c"] : [
				"-f",
				"-i",
				"-c"
			],
			cwd: opts.cwd,
			env: buildTrustedSnapshotCaptureEnv(opts.env),
			command: captureCommand,
			timeoutMs: 5e3
		}) !== 0) return null;
		return buildSnapshotFile(await fs$1.readFile(captureOutputPath, "utf8"));
	});
}
function buildSnapshotCaptureEnv(env) {
	return Object.fromEntries(Object.entries(env).filter(([key]) => CAPTURE_ENV_NAMES.has(key) && !SECRET_ENV_PATTERN.test(key)));
}
function buildTrustedSnapshotCaptureEnv(runtimeEnv) {
	const env = buildSnapshotCaptureEnv(process.env);
	env.HOME = getTrustedShellHome();
	if (runtimeEnv.OPENCLAW_SHELL === "exec") env.OPENCLAW_SHELL = "exec";
	return env;
}
const ENV_CAPTURE_NODE_SCRIPT = `
const safe = new Set(${JSON.stringify([...SAFE_ENV_NAMES].toSorted())});
const blocked = ${SECRET_ENV_PATTERN.toString()};
const out = {};
for (const [key, value] of Object.entries(process.env)) {
  if (!safe.has(key) || blocked.test(key)) continue;
  out[key] = value;
}
process.stdout.write(JSON.stringify(out));
`.trim();
function buildSnapshotFile(stdout) {
	const captureIndex = stdout.indexOf(CAPTURE_MARKER);
	const envIndex = stdout.indexOf(ENV_MARKER);
	if (captureIndex === -1 || envIndex === -1 || envIndex <= captureIndex) return null;
	const shellState = stdout.slice(captureIndex + 35, envIndex).trim().split(/\r?\n/).filter((line) => !line.includes(CAPTURE_MARKER) && !line.includes(ENV_MARKER)).join("\n");
	if (SECRET_SHELL_STATE_PATTERNS.some((pattern) => pattern.test(shellState))) return null;
	return [
		"# OpenClaw exec shell snapshot. Generated; do not edit.",
		"if [ -n \"${BASH_VERSION:-}\" ]; then shopt -s expand_aliases 2>/dev/null || true; fi",
		"unalias -a 2>/dev/null || true",
		shellState,
		parseSafeEnvExports(stdout.slice(envIndex + 31).trim()),
		""
	].filter((part) => part.trim().length > 0).join("\n");
}
function parseSafeEnvExports(envJson) {
	const parsed = safeParseJsonRecord(envJson);
	if (!parsed) return "";
	return Object.entries(parsed).filter((entry) => SAFE_ENV_NAMES.has(entry[0]) && !SECRET_ENV_PATTERN.test(entry[0]) && typeof entry[1] === "string").toSorted(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `export ${key}=${shQuote(value)}`).join("\n");
}
function buildRuntimeEnvRestoreScript(env) {
	return [...SAFE_ENV_NAMES].toSorted().filter((key) => env[key] !== process.env[key] && !SECRET_ENV_PATTERN.test(key)).map((key) => typeof env[key] === "string" ? `export ${key}=${shQuote(env[key])}` : `unset ${key}`).join("\n");
}
function buildSnapshotWrappedCommand(command, snapshotPath, runtimeEnvRestoreScript) {
	return [
		`if [ -r ${shQuote(snapshotPath)} ]; then . ${shQuote(snapshotPath)}; fi`,
		runtimeEnvRestoreScript,
		`eval ${shQuote(command)}`
	].filter((part) => part.trim().length > 0).join("\n");
}
function shQuote(value) {
	return `'${value.replace(/'/g, `'\\''`)}'`;
}
async function runShell(opts) {
	return await new Promise((resolve) => {
		const child = withChildProcessOperation("shell.snapshot", () => spawnProcess(opts.shell, [...opts.shellArgs, opts.command], {
			cwd: opts.cwd,
			detached: process.platform !== "win32",
			env: opts.env,
			stdio: "ignore",
			windowsHide: true
		}));
		let settled = false;
		const finish = (status) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			if (child.pid) killProcessTree(child.pid, {
				graceMs: 0,
				detached: true
			});
			else child.kill("SIGKILL");
			resolve(status);
		};
		child.once("spawn", () => {
			if (settled && child.pid) killProcessTree(child.pid, {
				graceMs: 0,
				detached: true
			});
		});
		const timeout = setTimeout(() => {
			killProcessTree(child.pid ?? 0, {
				graceMs: 250,
				detached: true
			});
			finish(null);
		}, opts.timeoutMs);
		child.on("error", () => {
			finish(null);
		});
		child.on("exit", (status) => {
			setTimeout(() => finish(status), 250);
		});
		child.on("close", finish);
	});
}
async function cleanupStaleSnapshots(snapshotDir) {
	const cutoff = Date.now() - SNAPSHOT_MAX_AGE_MS;
	let entries;
	try {
		entries = await fs$1.readdir(snapshotDir);
	} catch {
		return;
	}
	await Promise.all(entries.filter((entry) => entry.endsWith(".sh") || entry.endsWith(".tmp")).map(async (entry) => {
		const target = path.join(snapshotDir, entry);
		try {
			if ((await fs$1.stat(target)).mtimeMs < cutoff) await fs$1.rm(target, { force: true });
		} catch {}
	}));
}
//#endregion
//#region src/agents/bash-tools.exec-host-spawn.ts
async function prepareHostExecSpawn(params) {
	const { shell, args: shellArgs } = getShellConfig();
	const env = omitGatewayCredentialEnv(params.env);
	const commandWithPathPrepend = wrapPosixCommandWithPathPrepend(params.execCommand ?? params.command, env, params.pathPrepend);
	const commandWithShellSnapshot = await maybeWrapCommandWithShellSnapshot({
		enabled: params.execCommand === void 0,
		command: commandWithPathPrepend,
		shell,
		shellArgs,
		cwd: params.workdir,
		env
	});
	const shellArgv = [
		shell,
		...shellArgs,
		commandWithShellSnapshot
	];
	return {
		mode: params.usePty ? "pty" : "child",
		argv: params.githubProfileDir ? buildGitHubExecLaunchArgv(shellArgv, params.githubProfileDir) : shellArgv,
		env,
		cwd: params.workdir,
		stdinMode: params.usePty ? "pipe-open" : "pipe-closed"
	};
}
/** Final launch env; host launches re-apply the credential names published right now. */
function resolveExecLaunchEnv(env, sandboxed, grantEnv) {
	const launchEnv = env && !sandboxed ? omitGatewayCredentialEnv(env) : env;
	return grantEnv ? {
		...launchEnv,
		...grantEnv
	} : launchEnv;
}
//#endregion
//#region src/agents/bash-tools.exec-launch.ts
var ExecProcessPreflightError = class ExecProcessPreflightError extends Error {
	constructor(result) {
		super("exec denied by final preflight");
		this.result = result;
	}
	static unwrap(error) {
		if (error instanceof ExecProcessPreflightError) return error.result;
		throw error;
	}
};
/** Retain launch custody separately from process lifetime and proven-no-initiation fallback. */
function createExecLaunchLifecycle(initialInitiation, initialRelease) {
	let initiateSpawn = initialInitiation;
	let releaseSpawn = initialRelease;
	let initiated = false;
	const release = (reason) => releaseSpawn?.(reason);
	return {
		get initiated() {
			return initiated;
		},
		release,
		async prepare(assertSource, beforeSpawn) {
			assertSource?.();
			const denied = await beforeSpawn?.();
			assertSource?.();
			if (denied) throw new ExecProcessPreflightError(denied);
		},
		dispose() {
			release();
			releaseSpawn = void 0;
			initiateSpawn = void 0;
		},
		wrap(assertCurrent, assertPolicy) {
			return (launch, settlement) => {
				assertCurrent();
				assertPolicy?.();
				const initiate = () => {
					initiated = true;
					return launch();
				};
				try {
					return initiateSpawn ? initiateSpawn(initiate, settlement) : initiate();
				} finally {
					if (!settlement) release();
				}
			};
		}
	};
}
//#endregion
//#region src/agents/bash-tools.exec-notify.ts
/** Owns captured destinations and cancellation for background exec completion notifications. */
const DEFAULT_NOTIFY_TAIL_CHARS = 400;
/** Capture the original session before spawning work that may outlive its turn. */
function prepareExecExitNotification(session, subagentSession) {
	if (!session.notifyOnExit || !session.sessionKey || subagentSession || isSubagentSessionKey(session.sessionKey)) return;
	const targetKey = resolveEventSessionKeyForPolicy(session.sessionKey, session.eventRouting ?? {});
	const owner = session.agentId ?? parseAgentSessionKey(targetKey)?.agentId;
	if (!owner) return;
	return captureSessionEventTargetForHost(owner, targetKey).then((target) => {
		session.notifySessionTarget = target;
	}, (error) => {
		session.notifyOnExit = false;
		logWarn(`exec: automatic completion has no destination (${formatErrorMessage$1(error)}); use process poll.`);
	});
}
function maybeNotifyOnExit(session, status, subagentSession) {
	if (!session.backgrounded || !session.notifyOnExit || session.requestCancelled || readExecRequestOwners(session)?.some((owner) => owner.signal.aborted) || session.exitNotified || session.terminalPollObserved) return;
	const sessionKey = session.sessionKey?.trim();
	if (!sessionKey) return;
	session.exitNotified = true;
	if (session.exitReason === "manual-cancel" && session.finalizationFailed !== true) return;
	const exitLabel = renderExecExitLabel(session);
	const output = compactNotifyOutput(tail(session.tail || session.aggregated || "", DEFAULT_NOTIFY_TAIL_CHARS));
	if (status === "completed" && session.exitCode === 0 && !output && session.notifyOnExitEmptySuccess !== true) return;
	const summary = output ? `Exec ${status} (${session.id.slice(0, 8)}, ${exitLabel}) :: ${output}` : `Exec ${status} (${session.id.slice(0, 8)}, ${exitLabel})`;
	const eventText = appendExecTimeoutRetryGuidance(summary, session.exitReason);
	const eventRouting = session.eventRouting ?? {};
	const eventSessionKey = resolveEventSessionKeyForPolicy(sessionKey, eventRouting);
	const eventOptions = withExecRequestOwners({
		sessionKey: eventSessionKey,
		contextKey: `exec:${session.id}`,
		deliveryContext: session.notifyDeliveryContext,
		fromConversationTurn: session.notifyFromConversationTurn
	}, readExecRequestOwners(session));
	if (!subagentSession && !isSubagentSessionKey(sessionKey)) {
		const agentId = session.agentId ?? parseAgentSessionKey(eventSessionKey)?.agentId;
		if (!agentId || !session.notifySessionTarget) {
			logWarn(`exec: completion ${session.id} has no admitted session destination; inspect its process result.`);
			return;
		}
		try {
			const receipt = enqueueSessionEventForHost(eventText, {
				...eventOptions,
				agentId,
				source: "exec",
				sourceTurnId: `exec:${processSessionInstanceId(session)}`,
				expectedTarget: session.notifySessionTarget
			});
			recordNotifyOnExitRemoval(session, receipt.cancel);
			receipt.settled.then((outcome) => {
				if (outcome.status === "failed") logWarn(`exec: completion delivery failed (${outcome.error}); inspect the process result.`);
			});
		} catch (error) {
			logWarn(`exec: completion was not admitted (${formatErrorMessage$1(error)}); inspect the process result.`);
		}
		return;
	}
	const remove = enqueueSystemEventWithReceipt(eventText, session.agentId ? withSystemEventOwner(eventOptions, session.agentId) : eventOptions, { allowDuplicate: true });
	if (remove) recordNotifyOnExitRemoval(session, remove);
}
//#endregion
//#region src/agents/bash-tools.exec-settlement.ts
/** Settle the process owner's ledger and notifications before releasing scope joins. */
async function settleExecProcessExit({ session, outcome, onSettledBeforeNotify, notifyOnExit, failureOutcome }) {
	let finalOutcome = outcome;
	const { exitCode, exitSignal, status: processStatus, exitReason, noOutputTimedOut } = finalOutcome;
	const markProcessExited = () => markExited(session, exitCode, exitSignal, processStatus, exitReason, noOutputTimedOut);
	try {
		const shouldNotify = !session.exited;
		const settlement = onSettledBeforeNotify?.(finalOutcome);
		if (settlement instanceof Promise) await settlement;
		if (shouldNotify) {
			markProcessExited();
			notifyOnExit(session, finalOutcome.status);
		}
	} catch (error) {
		session.finalizationFailed = true;
		finalOutcome = failureOutcome(error);
		const settlement = onSettledBeforeNotify?.(finalOutcome);
		if (settlement instanceof Promise) await settlement;
	} finally {
		try {
			if (!session.exited) markProcessExited();
		} finally {
			delete session.sessionKey;
			delete session.eventRouting;
			delete session.notifyDeliveryContext;
			delete session.notifySessionTarget;
			delete session.notifyFromConversationTurn;
			delete session.notifyOnExit;
			delete session.notifyOnExitEmptySuccess;
			if (session.finalizationFailed || session.cleanupUncertain) for (const owner of readExecRequestOwners(session) ?? []) owner.cleanupUncertain = true;
			settleExecSessionFinalization(session);
		}
	}
	return finalOutcome;
}
//#endregion
//#region src/agents/bash-tools.exec-runtime.ts
/**
* Bash exec runtime.
* Spawns host/sandbox processes, manages session updates/backgrounding,
* approval messaging constants, environment safety, and exit outcome shaping.
*/
function resolveExecTimeoutMs(timeoutSec) {
	if (typeof timeoutSec !== "number" || !Number.isFinite(timeoutSec) || timeoutSec <= 0) return;
	return resolveSafeTimeoutDelayMs(timeoutSec * 1e3);
}
/** Default retained aggregate output cap for exec sessions. */
const DEFAULT_MAX_OUTPUT = clampWithDefault(readEnvInt("OPENCLAW_BASH_MAX_OUTPUT_CHARS", "PI_BASH_MAX_OUTPUT_CHARS"), 2e5, 1e3, 2e5);
/** Default pending output cap for poll/update buffers. */
const DEFAULT_PENDING_MAX_OUTPUT = clampWithDefault(readEnvInt("OPENCLAW_BASH_PENDING_MAX_OUTPUT_CHARS"), 3e4, 1e3, 2e5);
/** Fallback PATH used when the process environment has no PATH. */
const DEFAULT_PATH = process.env.PATH ?? "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
/** Default time an approval can remain pending. */
const DEFAULT_APPROVAL_TIMEOUT_MS = DEFAULT_EXEC_APPROVAL_TIMEOUT_MS;
/** Gateway request timeout for approval registration/wait calls. */
const DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS = DEFAULT_APPROVAL_TIMEOUT_MS + 1e4;
const DEFAULT_APPROVAL_RUNNING_NOTICE_MS = 1e4;
const APPROVAL_SLUG_LENGTH = 8;
/** Renders an exec target label, preserving `auto`. */
function renderExecTargetLabel(target) {
	return target;
}
/** Resolves configured/requested/elevated exec target into an effective host. */
function resolveExecTarget(params) {
	const sandboxRequired = params.sandboxRequired === true;
	if (sandboxRequired && !params.sandboxAvailable) throw markToolExecutionNotStarted(/* @__PURE__ */ new Error("This session requires a sandbox, but its sandbox runtime is unavailable."));
	if (sandboxRequired && params.elevatedRequested) throw markToolExecutionNotStarted(/* @__PURE__ */ new Error("Elevated execution is unavailable because this session requires a sandbox."));
	const configuredTarget = sandboxRequired ? "auto" : params.configuredTarget ?? "auto";
	const requestedTarget = params.requestedTarget === "auto" ? null : params.requestedTarget ?? null;
	if (sandboxRequired && (requestedTarget === "gateway" || requestedTarget === "node")) throw markToolExecutionNotStarted(/* @__PURE__ */ new Error(`exec host not allowed (requested ${renderExecTargetLabel(requestedTarget)}; this session requires a sandbox).`));
	if (requestedTarget && !isRequestedExecTargetAllowed({
		configuredTarget,
		requestedTarget,
		sandboxAvailable: params.sandboxAvailable
	})) {
		const allowedConfig = (configuredTarget === "auto" && params.sandboxAvailable && (requestedTarget === "gateway" || requestedTarget === "node") ? [renderExecTargetLabel(requestedTarget)] : [renderExecTargetLabel(requestedTarget), "auto"]).join(" or ");
		throw markToolExecutionNotStarted(/* @__PURE__ */ new Error(`exec host not allowed (requested ${renderExecTargetLabel(requestedTarget)}; configured host is ${renderExecTargetLabel(configuredTarget)}; set tools.exec.host=${allowedConfig} to allow this override).`));
	}
	const selectedTarget = requestedTarget ?? configuredTarget;
	const resolvedTarget = params.elevatedRequested ? selectedTarget === "node" ? "node" : "gateway" : selectedTarget;
	return {
		configuredTarget,
		requestedTarget,
		selectedTarget: resolvedTarget,
		effectiveHost: resolvedTarget === "auto" ? params.sandboxAvailable ? "sandbox" : "gateway" : resolvedTarget
	};
}
/** Merges shell-discovered PATH entries into an exec environment. */
function applyShellPath(env, shellPath) {
	if (!shellPath) return;
	const entries = normalizeStringEntries(shellPath.split(path.delimiter));
	if (entries.length === 0) return;
	const pathKey = findPathKey(env);
	const merged = mergePathPrepend(env[pathKey], entries);
	if (merged) env[pathKey] = merged;
}
/** Creates the short approval id shown in `/approve` prompts. */
function createApprovalSlug(id) {
	return id.slice(0, APPROVAL_SLUG_LENGTH);
}
/** Builds the user-facing approval-pending message for foreground exec. */
function buildApprovalPendingMessage(params) {
	const commandBlock = formatFencedCodeBlock(params.command, "sh");
	const lines = [];
	const allowedDecisions = params.allowedDecisions ?? resolveExecApprovalAllowedDecisions();
	const decisionText = allowedDecisions.join("|");
	const warningText = params.warningText?.trim();
	if (warningText) lines.push(warningText, "");
	lines.push(`Approval required (id ${params.approvalSlug}, full ${params.approvalId}).`);
	lines.push(`Host: ${params.host}`);
	if (params.nodeId) lines.push(`Node: ${params.nodeId}`);
	lines.push(`CWD: ${params.cwd ?? "(node default)"}`);
	lines.push("Command:");
	lines.push(commandBlock);
	lines.push("Mode: foreground (interactive approvals available).");
	if (params.processContinuationAvailable !== false) lines.push(allowedDecisions.includes("allow-always") ? "Background mode requires pre-approved policy (allow-always or ask=off)." : "Background mode requires an effective policy that allows pre-approval (for example ask=off).");
	lines.push(`Reply with: /approve ${params.approvalSlug} ${decisionText}`);
	if (!allowedDecisions.includes("allow-always")) lines.push("Allow Always is unavailable for this command.");
	lines.push("If the short code is ambiguous, use the full id in /approve.");
	return lines.join("\n");
}
/** Normalizes the delay before showing a running approval notice. */
function resolveApprovalRunningNoticeMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_APPROVAL_RUNNING_NOTICE_MS;
	if (value <= 0) return 0;
	return Math.floor(value);
}
function joinExecFailureOutput(aggregated, reason) {
	return aggregated ? `${aggregated}\n\n${reason}` : reason;
}
function classifyExecFailureKind(params) {
	if (params.isShellFailure) return params.exitCode === 127 ? "shell-command-not-found" : "shell-not-executable";
	if (params.exitReason === "overall-timeout") return "overall-timeout";
	if (params.exitReason === "no-output-timeout") return "no-output-timeout";
	if (params.exitSignal != null) return "signal";
	return "aborted";
}
/** Formats a user-facing reason for a failed exec process exit. */
function formatExecFailureReason(params) {
	switch (params.failureKind) {
		case "shell-command-not-found": return "Command not found";
		case "shell-not-executable": return "Command not executable (permission denied)";
		case "overall-timeout": {
			const timeoutText = typeof params.timeoutSec === "number" && params.timeoutSec > 0 ? `Command timed out after ${params.timeoutSec} seconds.` : "Command timed out.";
			const retryGuidance = appendExecTimeoutRetryGuidance(timeoutText, params.failureKind);
			return params.processContinuationAvailable ? `${retryGuidance}\n\nIf it should keep running, start it with exec background=true or yieldMs so OpenClaw can register a pollable process session. Do not rely on shell backgrounding with a trailing &.` : retryGuidance;
		}
		case "no-output-timeout": return appendExecTimeoutRetryGuidance("Command timed out waiting for output.", params.failureKind);
		case "signal": return `Command aborted by signal ${params.exitSignal}`;
		case "aborted": return "Command aborted before exit code was captured";
	}
	throw new Error("Unsupported exec failure kind");
}
/** Converts a supervisor exit record into a normalized exec process outcome. */
function buildExecExitOutcome(params) {
	const exitCode = params.exit.exitCode ?? 0;
	const isNormalExit = params.exit.reason === "exit";
	const isShellFailure = exitCode === 126 || exitCode === 127;
	if ((isNormalExit && !isShellFailure ? "completed" : "failed") === "completed") {
		const exitMsg = exitCode !== 0 ? `\n\n(Command exited with code ${exitCode})` : "";
		return {
			status: "completed",
			exitCode,
			exitSignal: params.exit.exitSignal,
			exitReason: params.exit.reason,
			durationMs: params.durationMs,
			aggregated: (exitMsg ? renderExecOutputText(params.aggregated) : params.aggregated) + exitMsg,
			timedOut: false,
			noOutputTimedOut: params.exit.noOutputTimedOut
		};
	}
	const failureKind = classifyExecFailureKind({
		exitReason: params.exit.reason,
		exitCode,
		isShellFailure,
		exitSignal: params.exit.exitSignal
	});
	const reason = formatExecFailureReason({
		failureKind,
		exitSignal: params.exit.exitSignal,
		timeoutSec: params.timeoutSec,
		processContinuationAvailable: params.processContinuationAvailable
	});
	return {
		status: "failed",
		exitCode: params.exit.exitCode,
		exitSignal: params.exit.exitSignal,
		exitReason: params.exit.reason,
		durationMs: params.durationMs,
		aggregated: params.aggregated,
		timedOut: params.exit.timedOut,
		noOutputTimedOut: params.exit.noOutputTimedOut,
		failureKind,
		oomScoreWrapperSelected: params.exit.oomScoreWrapperSelected,
		reason: joinExecFailureOutput(params.aggregated, reason)
	};
}
/** Converts spawn/runtime errors into a normalized failed exec outcome. */
function buildExecRuntimeErrorOutcome(params) {
	return {
		status: "failed",
		exitCode: null,
		exitSignal: null,
		durationMs: params.durationMs,
		aggregated: params.aggregated,
		timedOut: false,
		failureKind: "runtime-error",
		reason: joinExecFailureOutput(params.aggregated, String(params.error))
	};
}
/** Starts a host or sandbox exec process and registers it for polling/backgrounding. */
async function runExecProcess({ startupSignal: initialStartupSignal, onUpdate: initialOnUpdate, beforeSpawn: initialBeforeSpawn, assertCurrent: initialAssertCurrent, initiateSpawn: initialInitiateSpawn, releaseSpawn: initialReleaseSpawn, onSettledBeforeNotify: initialOnSettledBeforeNotify, ...opts }) {
	const requestSignal = execRequestAbortSignal(opts.requestOwners);
	const startupSignal = requestSignal && initialStartupSignal ? AbortSignal.any([requestSignal, initialStartupSignal]) : requestSignal ?? initialStartupSignal;
	let assertSourceActive = captureAgentToolSourceExecutionGuard(startupSignal);
	let operatorAuthority = getGatewayToolCallerIdentity()?.operatorAuthority;
	const operatorSignal = operatorAuthority?.signal;
	let releaseOperatorAuthority;
	const startedAt = Date.now();
	const sessionId = createSessionSlug(isProcessSessionIdTaken);
	const execCommand = opts.execCommand ?? opts.command;
	const diagnosticTarget = opts.sandbox ? "sandbox" : "host";
	const supervisor = getProcessSupervisor();
	const shellRuntimeEnv = {
		...opts.env,
		OPENCLAW_SHELL: "exec"
	};
	const session = withExecRequestOwners({
		id: sessionId,
		command: opts.command,
		scopeKey: opts.scopeKey,
		sessionKey: opts.sessionKey,
		cleanupMs: resolveProcessCleanupMs(opts.cleanupMs),
		agentId: opts.agentId,
		eventRouting: opts.eventRouting,
		notifyDeliveryContext: normalizeDeliveryContext(opts.notifyDeliveryContext),
		notifyFromConversationTurn: opts.notifyFromConversationTurn === true,
		notifyOnExit: opts.notifyOnExit,
		notifyOnExitEmptySuccess: opts.notifyOnExitEmptySuccess === true,
		exitNotified: false,
		startedAt,
		cwd: opts.workdir,
		maxOutputChars: opts.maxOutput,
		pendingMaxOutputChars: opts.pendingMaxOutput,
		totalOutputChars: 0,
		pendingOutput: [],
		pendingStdoutChars: 0,
		pendingStderrChars: 0,
		pendingOutputDropped: false,
		aggregated: "",
		tail: "",
		exited: false,
		truncated: false,
		backgrounded: false,
		cursorKeyMode: opts.usePty ? "unknown" : "normal"
	}, opts.requestOwners);
	withoutGatewayToolCallerIdentity(() => addSession(session));
	if (opts.requestOwners?.length) retainExecRequestProcess(opts.requestOwners, waitForExecSession(session));
	const notificationTarget = prepareExecExitNotification(session, opts.subagentSession === true);
	if (notificationTarget) await notificationTarget;
	let onUpdate = initialOnUpdate && AsyncLocalStorage.bind(initialOnUpdate);
	let beforeSpawn = initialBeforeSpawn;
	let assertPolicyCurrent = initialAssertCurrent;
	let onSettledBeforeNotify = initialOnSettledBeforeNotify;
	const emitUpdate = () => {
		if (!onUpdate || session.backgrounded || session.exited) return;
		const tailText = session.tail || session.aggregated;
		onUpdate({
			content: [{
				type: "text",
				text: renderExecUpdateText({
					tailText,
					warnings: opts.warnings
				})
			}],
			details: {
				status: "running",
				sessionId,
				pid: session.pid ?? void 0,
				startedAt,
				cwd: session.cwd,
				tail: session.tail
			}
		});
	};
	const sanitizeStdout = createStreamingBinaryOutputSanitizer((sequence) => {
		if (sequence === "?1h" || sequence === "?1l") session.cursorKeyMode = sequence === "?1h" ? "application" : "normal";
		else if (usingPty && (sequence === "6n" || sequence === "?6n")) managedRun?.stdin?.write("\x1B[1;1R");
	});
	const sanitizeStderr = createStreamingBinaryOutputSanitizer();
	const handleOutput = (stream, sanitize) => (data) => {
		for (const chunk of chunkString(sanitize(data))) {
			appendOutput(session, stream, chunk);
			emitUpdate();
		}
	};
	const timeoutMs = resolveExecTimeoutMs(opts.timeoutSec);
	let sandboxFinalizeToken;
	let assertSandboxCurrent;
	let sandboxPrepared = false;
	let sandboxFinalized = false;
	let terminateSandboxProcess;
	let sandboxTermination;
	let secretEgressGrant;
	const beginSandboxTermination = () => {
		const terminate = terminateSandboxProcess;
		if (!terminate || sandboxTermination || session.exited) return;
		sandboxTermination = withoutGatewayToolCallerIdentity(async () => {
			try {
				await terminate();
				return;
			} catch (error) {
				return { error };
			}
		});
	};
	const finalizeSandboxExec = async (params) => {
		if (!sandboxPrepared || sandboxFinalized || !opts.sandbox?.finalizeExec) return;
		sandboxFinalized = true;
		await opts.sandbox.finalizeExec({
			...params,
			token: sandboxFinalizeToken
		});
	};
	const runtimeErrorOutcome = (error) => buildExecRuntimeErrorOutcome({
		error,
		aggregated: session.aggregated.trim(),
		durationMs: Date.now() - startedAt
	});
	const finalizeAndSettleSession = async (outcome) => {
		secretEgressGrant?.revoke();
		let finalOutcome = outcome;
		session.finalizing = true;
		try {
			if (!opts.sandbox && managedRun?.waitForExtinction) {
				managedRun.cancel();
				const extinction = await managedRun.waitForExtinction();
				session.cleanupUncertain = extinction?.status === "uncertain";
				if (session.requestCancelled && session.cleanupUncertain) throw new Error("Command descendant cleanup could not be confirmed");
			}
			if (outcome.exitReason !== "exit") beginSandboxTermination();
			await sandboxTermination;
			const [artifacts] = await Promise.allSettled([finalizeSandboxExec({
				status: outcome.status,
				exitCode: outcome.exitCode,
				timedOut: outcome.timedOut
			})]);
			const termination = sandboxTermination ? await sandboxTermination : void 0;
			const errors = termination ? [termination.error] : [];
			if (artifacts.status === "rejected") errors.push(artifacts.reason);
			if (errors.length > 0) {
				const message = errors.map((error) => formatErrorMessage(error)).join("\n");
				throw new AggregateError(errors, message);
			}
		} catch (error) {
			session.finalizationFailed = true;
			recordAgentCleanupFailure();
			const detail = redactToolPayloadText(formatErrorMessage(error));
			if (outcome.status === "completed") finalOutcome = runtimeErrorOutcome(detail);
			else {
				finalOutcome = {
					...outcome,
					reason: joinExecFailureOutput(outcome.reason, detail)
				};
				logWarn(`exec: finalization after process failure failed (${detail}).`);
			}
			appendOutput(session, "stderr", `\n${detail}\n`);
			finalOutcome.aggregated = session.aggregated.trim();
		} finally {
			finalOutcome = await settleExecProcessExit({
				session,
				outcome: finalOutcome,
				onSettledBeforeNotify,
				notifyOnExit: (settledSession, status) => maybeNotifyOnExit(settledSession, status, opts.subagentSession === true),
				failureOutcome: runtimeErrorOutcome
			});
		}
		return finalOutcome;
	};
	const prepareSpawnSpec = async () => {
		if (opts.sandbox) {
			if (!opts.sandbox.buildExecSpec) throw new Error("sandbox backend does not provide buildExecSpec");
			const cleanup = opts.sandbox.prepareProcessCleanup?.(shellRuntimeEnv);
			terminateSandboxProcess = cleanup?.terminate.bind(cleanup);
			const backendExecSpec = await opts.sandbox.buildExecSpec({
				command: execCommand,
				workdir: opts.containerWorkdir ?? opts.sandbox.containerWorkdir,
				env: cleanup?.env ?? shellRuntimeEnv,
				usePty: opts.usePty
			});
			sandboxFinalizeToken = backendExecSpec.finalizeToken;
			assertSandboxCurrent = backendExecSpec.assertCurrent;
			sandboxPrepared = true;
			return {
				mode: "child",
				argv: backendExecSpec.argv,
				env: backendExecSpec.env,
				cwd: backendExecSpec.cwd,
				stdinMode: backendExecSpec.stdinMode
			};
		}
		return prepareHostExecSpawn({
			...opts,
			env: shellRuntimeEnv
		});
	};
	let managedRun = null;
	const onRequestCancelled = () => {
		session.requestCancelled = true;
		session.cancellationRequested = true;
		onUpdate = void 0;
		if (managedRun) managedRun.cancel("manual-cancel");
		else supervisor.cancel(sessionId, "manual-cancel");
		beginSandboxTermination();
	};
	requestSignal?.addEventListener("abort", onRequestCancelled, { once: true });
	if (requestSignal?.aborted) onRequestCancelled();
	const launchLifecycle = createExecLaunchLifecycle(initialInitiateSpawn, initialReleaseSpawn);
	const onOperatorRevoked = () => managedRun?.cancel("manual-cancel");
	const releaseExecutionContext = () => {
		onSettledBeforeNotify = void 0;
		operatorSignal?.removeEventListener("abort", onOperatorRevoked);
		releaseOperatorAuthority?.();
		releaseOperatorAuthority = void 0;
		requestSignal?.removeEventListener("abort", onRequestCancelled);
	};
	let usingPty = opts.usePty && !opts.sandbox;
	const emitCompleted = (outcome) => emitExecProcessCompleted({
		command: opts.command,
		mode: usingPty ? "pty" : "child",
		outcome,
		sessionKey: opts.sessionKey,
		target: diagnosticTarget
	});
	const assertPreSpawnAuthorized = () => launchLifecycle.prepare(assertSourceActive, beforeSpawn);
	const spawn = (input) => runWithAgentToolSourceExecutionScope(assertSourceActive, async () => {
		const assertSourceCurrent = assertSourceActive;
		const assertOperatorCurrent = operatorAuthority?.assertCurrent;
		const assertRuntimeCurrent = assertSandboxCurrent;
		const assertHostPolicyCurrent = assertPolicyCurrent;
		const assertCurrent = () => {
			assertSourceCurrent?.();
			assertOperatorCurrent?.();
			assertRuntimeCurrent?.();
		};
		assertCurrent();
		assertHostPolicyCurrent?.();
		const grant = opts.secretEgressBindings ? await registerSecretEgressProxyProcess(opts.secretEgressBindings) : void 0;
		secretEgressGrant = grant;
		try {
			return await withChildProcessOperation("agent.exec", () => withoutGatewayToolCallerIdentity(() => supervisor.spawn({
				...input,
				env: resolveExecLaunchEnv(input.env, Boolean(opts.sandbox), grant?.env),
				onCancel: () => {
					beginSandboxTermination();
					grant?.revoke();
				},
				assertCurrent,
				beforeSpawn: assertHostPolicyCurrent,
				initiateSpawn: launchLifecycle.wrap(assertCurrent, assertHostPolicyCurrent)
			})));
		} catch (error) {
			grant?.revoke();
			throw error;
		}
	});
	try {
		assertSourceActive?.();
		operatorAuthority?.assertCurrent();
		releaseOperatorAuthority = operatorAuthority?.retain?.();
		const spawnSpec = await prepareSpawnSpec();
		usingPty = spawnSpec.mode === "pty";
		const spawnBase = {
			runId: sessionId,
			...opts.sandbox ? {
				cleanupOwnership: "external",
				exactEnv: true
			} : {},
			scopeKey: opts.scopeKey,
			cwd: spawnSpec.cwd ?? opts.workdir,
			env: spawnSpec.env,
			timeoutMs,
			captureOutput: false,
			onStdout: handleOutput("stdout", sanitizeStdout),
			onStderr: handleOutput("stderr", sanitizeStderr)
		};
		await assertPreSpawnAuthorized();
		if (spawnSpec.mode === "pty") try {
			managedRun = await spawn({
				...spawnBase,
				mode: "pty",
				argv: spawnSpec.argv
			});
		} catch (err) {
			if (launchLifecycle.initiated) {
				launchLifecycle.release();
				throw err;
			}
			launchLifecycle.release("retry");
			assertSourceActive?.();
			const warning = `Warning: PTY spawn failed (${String(err)}); retrying without PTY for \`${opts.command}\`.`;
			logWarn(`exec: PTY spawn failed (${String(err)}); retrying without PTY for "${opts.command}".`);
			opts.warnings.push(warning);
			usingPty = false;
			await assertPreSpawnAuthorized();
		}
		if (!managedRun) managedRun = await spawn({
			...spawnBase,
			mode: "child",
			argv: spawnSpec.argv,
			stdinMode: spawnSpec.stdinMode
		});
		operatorSignal?.addEventListener("abort", onOperatorRevoked, { once: true });
		if (operatorSignal?.aborted) onOperatorRevoked();
	} catch (error) {
		launchLifecycle.release();
		onUpdate = void 0;
		emitCompleted(await finalizeAndSettleSession(runtimeErrorOutcome(error)).finally(releaseExecutionContext));
		throw error;
	} finally {
		launchLifecycle.dispose();
		beforeSpawn = void 0;
		assertPolicyCurrent = void 0;
		assertSourceActive = void 0;
		operatorAuthority = void 0;
		assertSandboxCurrent = void 0;
	}
	session.processActivity = managedRun.activity;
	recordDiagnosticToolExecutionDeadline(managedRun.activity.deadlineAtMs);
	session.stdin = managedRun.stdin;
	session.pid = managedRun.pid;
	const startedRun = managedRun;
	const promise = withoutGatewayToolCallerIdentity(async () => {
		try {
			let outcome;
			try {
				outcome = buildExecExitOutcome({
					exit: await startedRun.wait(),
					aggregated: session.aggregated.trim(),
					durationMs: Date.now() - startedAt,
					timeoutSec: opts.timeoutSec,
					processContinuationAvailable: opts.processContinuationAvailable !== false
				});
			} catch (error) {
				outcome = runtimeErrorOutcome(error);
			} finally {
				onUpdate = void 0;
			}
			const finalOutcome = await finalizeAndSettleSession(outcome);
			emitCompleted(finalOutcome);
			return finalOutcome;
		} finally {
			releaseExecutionContext();
		}
	});
	return {
		session,
		startedAt,
		pid: session.pid ?? void 0,
		promise,
		kill: () => {
			managedRun?.cancel("manual-cancel");
		},
		disableUpdates: () => {
			onUpdate = void 0;
		}
	};
}
//#endregion
export { DEFAULT_PENDING_MAX_OUTPUT as a, buildExecRuntimeErrorOutcome as c, resolveApprovalRunningNoticeMs as d, resolveExecTarget as f, DEFAULT_PATH as i, createApprovalSlug as l, ExecProcessPreflightError as m, DEFAULT_APPROVAL_TIMEOUT_MS as n, applyShellPath as o, runExecProcess as p, DEFAULT_MAX_OUTPUT as r, buildApprovalPendingMessage as s, DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS as t, renderExecTargetLabel as u };
