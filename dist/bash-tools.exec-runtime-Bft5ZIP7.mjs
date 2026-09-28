import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { S as isSubagentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { I as recordDiagnosticToolExecutionDeadline, r as emitDiagnosticEventWithTrustedTraceContext } from "./diagnostic-events-CVabF32H.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { t as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { r as withTempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { r as spawnProcess } from "./spawn-utils-BqNqLiIK.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-D2XMKe-X.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { a as removePathPrepend, n as findPathKey, r as mergePathPrepend } from "./path-prepend-CRp372y2.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { o as enqueueSystemEventWithReceipt } from "./system-events-ANKIkU0W.mjs";
import { n as createStreamingBinaryOutputSanitizer, o as getShellConfig } from "./shell-utils-D_gDHHBQ.mjs";
import { E as resolveExecApprovalAllowedDecisions } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { a as renderExecOutputText, i as renderExecExitLabel, o as renderExecUpdateText, r as appendExecTimeoutRetryGuidance } from "./bash-tools.exec-output-Cei3R_ZV.mjs";
import { s as withoutGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { T as clampWithDefault, _ as markExited, b as resolveProcessCleanupMs, k as readEnvInt, n as addSession, p as isProcessSessionIdTaken, r as appendOutput, w as chunkString, x as tail, y as recordNotifyOnExitRemoval } from "./bash-process-registry-CkYBcnWR.mjs";
import { t as getProcessSupervisor } from "./supervisor-Dye57EtO.mjs";
import { c as registerTrustedToolNoStartError } from "./tool-result-error-CWadvCKd.mjs";
import { r as captureAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-CEFulHpI.mjs";
import { i as scopedHeartbeatWakeOptionsForPolicy, t as resolveEventSessionKeyForPolicy } from "./event-session-routing-Dc7D6ZvV.mjs";
import { a as registerSecretEgressProxyProcess } from "./registry-DGG6-ieI.mjs";
import { n as createSessionSlug } from "./session-slug-CfIG4XbR.mjs";
import "./bash-tools.schemas-O2t-ZZ0a.mjs";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
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
	env.OPENCLAW_PREPEND_PATH = pathPrepend.join(path.delimiter);
	return `export PATH="\${OPENCLAW_PREPEND_PATH}\${PATH:+:$PATH}"; unset OPENCLAW_PREPEND_PATH; ${command}`;
}
//#endregion
//#region src/agents/github-exec-launch.ts
function quotePowerShellLiteral(value) {
	return `'${value.replaceAll("'", "''")}'`;
}
/** Carry only a selected profile path through supervision; resolve its token in the child. */
function buildGitHubExecLaunchArgv(argv, profileDir) {
	const workerUrl = resolveRuntimeProcessEntrypointUrl("githubExec");
	const launcher = [
		process.execPath,
		...resolveRuntimeWorkerArgv(workerUrl),
		profileDir
	];
	if (process.platform === "win32") {
		const command = argv.at(-1);
		if (command === void 0) throw new Error("Managed GitHub execution requires a shell command.");
		const bootstrap = [
			`Push-Location -LiteralPath ${quotePowerShellLiteral(fileURLToPath(new URL(".", workerUrl)))} -ErrorAction Stop;`,
			`try { $env:GH_TOKEN = & ${launcher.map(quotePowerShellLiteral).join(" ")};`,
			"if (-not $? -or $LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($env:GH_TOKEN)) { exit 1 }",
			"} finally { Pop-Location };",
			"$env:GITHUB_TOKEN = ''; $LASTEXITCODE = $null;",
			`& ([scriptblock]::Create(${quotePowerShellLiteral(command)}))`
		].join(" ");
		return [...argv.slice(0, -1), bootstrap];
	}
	return [
		"/bin/sh",
		"-c",
		`set +x; GH_TOKEN="$(${`cd ${quoteCliArg(fileURLToPath(new URL(".", workerUrl)))} 2>/dev/null || { printf '%s\\n' 'GitHub Identity launcher is unavailable. Restart OpenClaw, then retry.' >&2; exit 1; }`}; exec ${launcher.map(quoteCliArg).join(" ")})" || exit $?; export GH_TOKEN; GITHUB_TOKEN=; export GITHUB_TOKEN; exec "$@"`,
		"openclaw-github-exec",
		...argv
	];
}
//#endregion
//#region src/agents/shell-snapshot.ts
/**
* Login-shell environment snapshot capture.
*
* Caches safe shell-derived environment variables while filtering secrets and stale snapshots.
*/
const SNAPSHOT_VERSION = 1;
const SNAPSHOT_REFRESH_MS = 3e5;
const SNAPSHOT_MAX_AGE_MS = 2592e5;
const CAPTURE_MARKER = "__OPENCLAW_SHELL_SNAPSHOT_CAPTURE__";
const ENV_MARKER = "__OPENCLAW_SHELL_SNAPSHOT_ENV__";
const EXEC_SHELL_SNAPSHOT_ENV = "OPENCLAW_EXEC_SHELL_SNAPSHOT";
const VALID_ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
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
const snapshotCache = /* @__PURE__ */ new Map();
let cleanupPromise = null;
async function maybeWrapCommandWithShellSnapshot(opts) {
	if (opts.enabled === false || process.platform === "win32" || isExecShellSnapshotDisabled(process.env) || !isSupportedSnapshotShell(opts.shell, opts.shellArgs)) return opts.command;
	try {
		const snapshot = await getOrCreateShellSnapshot(opts);
		return snapshot ? buildSnapshotWrappedCommand(opts.command, snapshot.path, buildRuntimeEnvRestoreScript(opts.env)) : opts.command;
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
	const created = createShellSnapshot(opts, key, { forceRefresh: Boolean(cached) });
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
async function createShellSnapshot(opts, key, options) {
	const snapshotDir = resolveShellSnapshotDir(process.env);
	await fs$1.mkdir(snapshotDir, {
		recursive: true,
		mode: 448
	});
	cleanupPromise ??= cleanupStaleSnapshots(snapshotDir);
	const snapshotPath = path.join(snapshotDir, `${key}.sh`);
	if (options?.forceRefresh !== true && await isFreshSnapshot(snapshotPath) && await validateSnapshot(opts, snapshotPath)) return { path: snapshotPath };
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
	return { path: snapshotPath };
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
	try {
		await fs$1.access(snapshotPath);
	} catch {
		return false;
	}
	return (await runShell({
		shell: opts.shell,
		shellArgs: opts.shellArgs,
		cwd: opts.cwd,
		env: buildTrustedSnapshotCaptureEnv(opts.env),
		command: `. ${shQuote(snapshotPath)} >/dev/null 2>&1`,
		timeoutMs: 2e3
	})).status === 0;
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
			buildStartupSourceScript(shellName),
			`printf '\\n%s\\n' ${shQuote(CAPTURE_MARKER)}`,
			buildAliasCaptureScript(shellName),
			"(typeset -f 2>/dev/null || declare -f 2>/dev/null || true)",
			`printf '\\n%s\\n' ${shQuote(ENV_MARKER)}`,
			`${shQuote(process.execPath)} -e ${shQuote(ENV_CAPTURE_NODE_SCRIPT)}`,
			`} > ${shQuote(captureOutputPath)}`
		].join("\n");
		if ((await runShell({
			shell: opts.shell,
			shellArgs: buildCaptureShellArgs(shellName, opts.shellArgs),
			cwd: opts.cwd,
			env: buildTrustedSnapshotCaptureEnv(opts.env),
			command: captureCommand,
			timeoutMs: 5e3
		})).status !== 0) return null;
		return buildSnapshotFile(await fs$1.readFile(captureOutputPath, "utf8"));
	});
}
function buildCaptureShellArgs(shellName, shellArgs) {
	if (shellName === "bash") return ["-i", "-c"];
	if (shellName === "zsh") return [
		"-f",
		"-i",
		"-c"
	];
	return shellArgs;
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
function buildStartupSourceScript(shellName) {
	if (shellName === "zsh") return `if [ -r "\${ZDOTDIR:-$HOME}/.zshrc" ]; then . "\${ZDOTDIR:-$HOME}/.zshrc"; fi`;
	if (shellName === "bash") return ":";
	return ":";
}
function buildAliasCaptureScript(shellName) {
	return shellName === "zsh" ? "alias -L 2>/dev/null || true" : "alias 2>/dev/null || true";
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
	if (containsSecretLikeShellState(shellState)) return null;
	return [
		"# OpenClaw exec shell snapshot. Generated; do not edit.",
		"if [ -n \"${BASH_VERSION:-}\" ]; then shopt -s expand_aliases 2>/dev/null || true; fi",
		"unalias -a 2>/dev/null || true",
		shellState,
		parseSafeEnvExports(stdout.slice(envIndex + 31).trim()),
		""
	].filter((part) => part.trim().length > 0).join("\n");
}
function containsSecretLikeShellState(shellState) {
	return SECRET_SHELL_STATE_PATTERNS.some((pattern) => pattern.test(shellState));
}
function parseSafeEnvExports(envJson) {
	let parsed;
	try {
		parsed = JSON.parse(envJson);
	} catch {
		return "";
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "";
	return Object.entries(parsed).filter((entry) => VALID_ENV_NAME.test(entry[0]) && SAFE_ENV_NAMES.has(entry[0]) && !SECRET_ENV_PATTERN.test(entry[0]) && typeof entry[1] === "string").toSorted(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `export ${key}=${shQuote(value)}`).join("\n");
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
		const child = spawnProcess(opts.shell, [...opts.shellArgs, opts.command], {
			cwd: opts.cwd,
			detached: process.platform !== "win32",
			env: opts.env,
			stdio: "ignore",
			windowsHide: true
		});
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
			resolve({ status });
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
		child.on("close", (status) => {
			finish(status);
		});
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
	const commandWithPathPrepend = wrapPosixCommandWithPathPrepend(params.execCommand ?? params.command, params.env, params.pathPrepend);
	const commandWithShellSnapshot = await maybeWrapCommandWithShellSnapshot({
		enabled: params.execCommand === void 0,
		command: commandWithPathPrepend,
		shell,
		shellArgs,
		cwd: params.workdir,
		env: params.env
	});
	const shellArgv = [
		shell,
		...shellArgs,
		commandWithShellSnapshot
	];
	return {
		mode: params.usePty ? "pty" : "child",
		argv: params.githubProfileDir ? buildGitHubExecLaunchArgv(shellArgv, params.githubProfileDir) : shellArgv,
		env: params.env,
		cwd: params.workdir,
		stdinMode: params.usePty ? "pipe-open" : "pipe-closed"
	};
}
//#endregion
//#region src/agents/bash-tools.exec-runtime.ts
/**
* Bash exec runtime.
* Spawns host/sandbox processes, manages session updates/backgrounding,
* approval messaging constants, environment safety, and exit outcome shaping.
*/
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
/** Tail length used in background completion notifications. */
const DEFAULT_NOTIFY_TAIL_CHARS = 400;
const DEFAULT_NOTIFY_SNIPPET_CHARS = 180;
/** Default time an approval can remain pending. */
const DEFAULT_APPROVAL_TIMEOUT_MS = DEFAULT_EXEC_APPROVAL_TIMEOUT_MS;
/** Gateway request timeout for approval registration/wait calls. */
const DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS = DEFAULT_APPROVAL_TIMEOUT_MS + 1e4;
const DEFAULT_APPROVAL_RUNNING_NOTICE_MS = 1e4;
const APPROVAL_SLUG_LENGTH = 8;
function normalizeExecExitSignal(signal) {
	if (signal === null) return;
	return String(signal);
}
function emitExecProcessCompleted(params) {
	const exitSignal = normalizeExecExitSignal(params.outcome.exitSignal);
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
/** Renders a host label for user-facing exec policy messages. */
function renderExecHostLabel(host) {
	return host === "sandbox" ? "sandbox" : host === "gateway" ? "gateway" : "node";
}
/** Renders an exec target label, preserving `auto`. */
function renderExecTargetLabel(target) {
	return target === "auto" ? "auto" : renderExecHostLabel(target);
}
/** Returns true when a per-call target override is allowed by configured policy. */
function isRequestedExecTargetAllowed(params) {
	if (params.requestedTarget === params.configuredTarget) return true;
	if (params.configuredTarget === "auto") {
		if (params.sandboxAvailable && (params.requestedTarget === "gateway" || params.requestedTarget === "node")) return false;
		return true;
	}
	return false;
}
/** Resolves configured/requested/elevated exec target into an effective host. */
function resolveExecTarget(params) {
	const sandboxRequired = params.sandboxRequired === true;
	if (sandboxRequired && !params.sandboxAvailable) throw registerTrustedToolNoStartError(/* @__PURE__ */ new Error("This session requires a sandbox, but its sandbox runtime is unavailable."));
	if (sandboxRequired && params.elevatedRequested) throw registerTrustedToolNoStartError(/* @__PURE__ */ new Error("Elevated execution is unavailable because this session requires a sandbox."));
	const configuredTarget = sandboxRequired ? "auto" : params.configuredTarget ?? "auto";
	const requestedTarget = params.requestedTarget === "auto" ? null : params.requestedTarget ?? null;
	if (sandboxRequired && (requestedTarget === "gateway" || requestedTarget === "node")) throw registerTrustedToolNoStartError(/* @__PURE__ */ new Error(`exec host not allowed (requested ${renderExecTargetLabel(requestedTarget)}; this session requires a sandbox).`));
	if (requestedTarget && !isRequestedExecTargetAllowed({
		configuredTarget,
		requestedTarget,
		sandboxAvailable: params.sandboxAvailable
	})) {
		const allowedConfig = Array.from(new Set(configuredTarget === "auto" && params.sandboxAvailable && (requestedTarget === "gateway" || requestedTarget === "node") ? [renderExecTargetLabel(requestedTarget)] : requestedTarget === "gateway" && !params.sandboxAvailable ? ["gateway", "auto"] : [renderExecTargetLabel(requestedTarget), "auto"])).join(" or ");
		throw registerTrustedToolNoStartError(/* @__PURE__ */ new Error(`exec host not allowed (requested ${renderExecTargetLabel(requestedTarget)}; configured host is ${renderExecTargetLabel(configuredTarget)}; set tools.exec.host=${allowedConfig} to allow this override).`));
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
/** Normalizes notification snippets to a compact single-line form. */
function normalizeNotifyOutput(value) {
	return value.replace(/\s+/g, " ").trim();
}
function compactNotifyOutput(value, maxChars = DEFAULT_NOTIFY_SNIPPET_CHARS) {
	const normalized = normalizeNotifyOutput(value);
	if (!normalized) return "";
	if (normalized.length <= maxChars) return normalized;
	const safe = Math.max(1, maxChars - 1);
	return `${truncateUtf16Safe(normalized, safe)}…`;
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
function maybeNotifyOnExit(session, status) {
	if (!session.backgrounded || !session.notifyOnExit || session.exitNotified || session.terminalPollObserved) return;
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
	const eventOptions = {
		sessionKey: resolveEventSessionKeyForPolicy(sessionKey, eventRouting),
		contextKey: `exec:${session.id}`,
		deliveryContext: session.notifyDeliveryContext
	};
	const remove = enqueueSystemEventWithReceipt(eventText, session.agentId ? withSystemEventOwner(eventOptions, session.agentId) : eventOptions, { allowDuplicate: true });
	if (remove) recordNotifyOnExitRemoval(session, remove);
	if (!isSubagentSessionKey(sessionKey)) {
		const wakeOptions = scopedHeartbeatWakeOptionsForPolicy(sessionKey, {
			source: "exec-event",
			intent: "event",
			reason: "exec-event",
			coalesceMs: 0
		}, eventRouting);
		requestSessionEventWake(sessionKey === "global" && session.agentId ? {
			...wakeOptions,
			agentId: session.agentId
		} : wakeOptions);
	}
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
async function runExecProcess({ startupSignal: initialStartupSignal, onUpdate: initialOnUpdate, beforeSpawn: initialBeforeSpawn, assertCurrent: initialAssertCurrent, onSettledBeforeNotify: initialOnSettledBeforeNotify, onActivity: initialOnActivity, ...opts }) {
	let assertSourceActive = captureAgentToolSourceExecutionGuard(initialStartupSignal);
	const startedAt = Date.now();
	const sessionId = createSessionSlug(isProcessSessionIdTaken);
	const execCommand = opts.execCommand ?? opts.command;
	const diagnosticTarget = opts.sandbox ? "sandbox" : "host";
	const supervisor = getProcessSupervisor();
	const shellRuntimeEnv = {
		...opts.env,
		OPENCLAW_SHELL: "exec"
	};
	const session = {
		id: sessionId,
		command: opts.command,
		scopeKey: opts.scopeKey,
		sessionKey: opts.sessionKey,
		cleanupMs: resolveProcessCleanupMs(opts.cleanupMs),
		agentId: opts.agentId,
		eventRouting: opts.eventRouting,
		notifyDeliveryContext: normalizeDeliveryContext(opts.notifyDeliveryContext),
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
	};
	withoutGatewayToolCallerIdentity(() => addSession(session));
	let onUpdate = initialOnUpdate && AsyncLocalStorage.bind(initialOnUpdate);
	let beforeSpawn = initialBeforeSpawn;
	let assertPolicyCurrent = initialAssertCurrent;
	let onSettledBeforeNotify = initialOnSettledBeforeNotify;
	let onActivity = initialOnActivity;
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
	const handleStdout = (data) => {
		onActivity?.(session.processActivity?.lastOutputAtMs ?? Date.now());
		const str = sanitizeStdout(data);
		for (const chunk of chunkString(str)) {
			appendOutput(session, "stdout", chunk);
			emitUpdate();
		}
	};
	const handleStderr = (data) => {
		onActivity?.(session.processActivity?.lastOutputAtMs ?? Date.now());
		const str = sanitizeStderr(data);
		for (const chunk of chunkString(str)) {
			appendOutput(session, "stderr", chunk);
			emitUpdate();
		}
	};
	const timeoutMs = resolveExecTimeoutMs(opts.timeoutSec);
	let sandboxFinalizeToken;
	let assertSandboxCurrent;
	let sandboxPrepared = false;
	let sandboxFinalized = false;
	let secretEgressGrant;
	const finalizeSandboxExec = async (params) => {
		if (!sandboxPrepared || sandboxFinalized || !opts.sandbox?.finalizeExec) return;
		sandboxFinalized = true;
		await opts.sandbox.finalizeExec({
			...params,
			token: sandboxFinalizeToken
		});
	};
	const finalizeAndSettleSession = async (outcome) => {
		secretEgressGrant?.revoke();
		let finalOutcome = outcome;
		session.finalizing = true;
		onActivity?.(Date.now());
		try {
			if (!opts.sandbox && managedRun?.waitForExtinction) {
				managedRun.cancel();
				await managedRun.waitForExtinction();
			}
			await finalizeSandboxExec({
				status: outcome.status,
				exitCode: outcome.exitCode,
				timedOut: outcome.timedOut
			});
		} catch (error) {
			session.finalizationFailed = true;
			recordAgentCleanupFailure();
			if (outcome.status === "completed") {
				finalOutcome = buildExecRuntimeErrorOutcome({
					error,
					aggregated: session.aggregated.trim(),
					durationMs: Date.now() - startedAt
				});
				appendOutput(session, "stderr", `\n${redactToolPayloadText(formatErrorMessage(error))}\n`);
			} else logWarn(`exec: finalization after process failure failed (${String(error)}).`);
		} finally {
			session.finalizing = false;
			try {
				const shouldNotify = !session.exited;
				if (shouldNotify) markExited(session, finalOutcome.exitCode, finalOutcome.exitSignal, finalOutcome.status, finalOutcome.exitReason, finalOutcome.noOutputTimedOut);
				onSettledBeforeNotify?.(finalOutcome);
				if (shouldNotify) maybeNotifyOnExit(session, finalOutcome.status);
			} catch (error) {
				session.finalizationFailed = true;
				finalOutcome = buildExecRuntimeErrorOutcome({
					error,
					aggregated: session.aggregated.trim(),
					durationMs: Date.now() - startedAt
				});
				onSettledBeforeNotify?.(finalOutcome);
			} finally {
				delete session.sessionKey;
				delete session.agentId;
				delete session.eventRouting;
				delete session.notifyDeliveryContext;
				delete session.notifyOnExit;
				delete session.notifyOnExitEmptySuccess;
			}
		}
		return finalOutcome;
	};
	const prepareSpawnSpec = async () => {
		if (opts.sandbox) {
			if (!opts.sandbox.buildExecSpec) throw new Error("sandbox backend does not provide buildExecSpec");
			const backendExecSpec = await opts.sandbox.buildExecSpec({
				command: execCommand,
				workdir: opts.containerWorkdir ?? opts.sandbox.containerWorkdir,
				env: shellRuntimeEnv,
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
	let usingPty = opts.usePty && !opts.sandbox;
	const assertPreSpawnAuthorized = async () => {
		assertSourceActive?.();
		const denied = await beforeSpawn?.();
		assertSourceActive?.();
		if (denied) throw new ExecProcessPreflightError(denied);
	};
	const spawn = async (input) => {
		const assertSourceCurrent = assertSourceActive;
		const assertRuntimeCurrent = assertSandboxCurrent;
		const assertHostPolicyCurrent = assertPolicyCurrent;
		const assertCurrent = () => {
			assertSourceCurrent?.();
			assertRuntimeCurrent?.();
		};
		assertCurrent();
		assertHostPolicyCurrent?.();
		const grant = opts.secretEgressBindings ? registerSecretEgressProxyProcess(opts.secretEgressBindings) : void 0;
		secretEgressGrant = grant;
		try {
			return await withoutGatewayToolCallerIdentity(() => supervisor.spawn({
				...input,
				...grant ? {
					env: {
						...input.env,
						...grant.env
					},
					onCancel: grant.revoke
				} : {},
				assertCurrent,
				beforeSpawn: assertHostPolicyCurrent
			}));
		} catch (error) {
			grant?.revoke();
			throw error;
		}
	};
	try {
		assertSourceActive?.();
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
			onStdout: handleStdout,
			onStderr: handleStderr
		};
		await assertPreSpawnAuthorized();
		if (spawnSpec.mode === "pty") try {
			managedRun = await spawn({
				...spawnBase,
				mode: "pty",
				argv: spawnSpec.argv
			});
		} catch (err) {
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
	} catch (error) {
		onUpdate = void 0;
		const outcome = await finalizeAndSettleSession(buildExecRuntimeErrorOutcome({
			error,
			aggregated: session.aggregated.trim(),
			durationMs: Date.now() - startedAt
		})).finally(() => {
			onSettledBeforeNotify = void 0;
			onActivity = void 0;
		});
		emitExecProcessCompleted({
			command: opts.command,
			mode: usingPty ? "pty" : "child",
			outcome,
			sessionKey: opts.sessionKey,
			target: diagnosticTarget
		});
		throw error;
	} finally {
		beforeSpawn = void 0;
		assertPolicyCurrent = void 0;
		assertSourceActive = void 0;
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
				outcome = buildExecRuntimeErrorOutcome({
					error,
					aggregated: session.aggregated.trim(),
					durationMs: Date.now() - startedAt
				});
			} finally {
				onUpdate = void 0;
			}
			const finalOutcome = await finalizeAndSettleSession(outcome);
			emitExecProcessCompleted({
				command: opts.command,
				mode: usingPty ? "pty" : "child",
				outcome: finalOutcome,
				sessionKey: opts.sessionKey,
				target: diagnosticTarget
			});
			return finalOutcome;
		} finally {
			onSettledBeforeNotify = void 0;
			onActivity = void 0;
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
export { DEFAULT_PENDING_MAX_OUTPUT as a, buildApprovalPendingMessage as c, isRequestedExecTargetAllowed as d, normalizeNotifyOutput as f, runExecProcess as g, resolveExecTarget as h, DEFAULT_PATH as i, buildExecRuntimeErrorOutcome as l, resolveApprovalRunningNoticeMs as m, DEFAULT_APPROVAL_TIMEOUT_MS as n, ExecProcessPreflightError as o, renderExecTargetLabel as p, DEFAULT_MAX_OUTPUT as r, applyShellPath as s, DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS as t, createApprovalSlug as u };
