import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { o as emitInternalDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { d as isPowerShellInlineFileCommandFlag, m as resolvePowerShellInlineCommandMatch, n as POSIX_INLINE_COMMAND_FLAGS, p as resolveInlineCommandMatch } from "./shell-inline-command-DKNYBguD.mjs";
import { r as resolveOomScoreWrappedCommand } from "./linux-oom-score-BCVNjaDp.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/spawn-diagnostics.ts
const spawnCounts = resolveGlobalSingleton(Symbol.for("openclaw.childProcessSpawnCounts"), () => ({
	counts: /* @__PURE__ */ new Map(),
	sampledAt: performance.now()
}));
let spawnLog;
const COMMAND_FAMILIES = /^(node|bun|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/;
const gitOperations = /* @__PURE__ */ new Set([
	"repository.identities",
	"repository.branches",
	"checkout.revision",
	"checkout.context",
	"checkout.diff",
	"checkout.baseline",
	"pull-request.branch-facts",
	"worktree.snapshot",
	"worktree.cleanup",
	"worktree.provision",
	"worktree.inspect",
	"worktree.recovery",
	"workspace.inventory",
	"workspace.manifest",
	"workspace.result-cleanup",
	"project.clone",
	"session.materialize",
	"publication",
	"github.identity",
	"project.checkout",
	"update.inspect",
	"worktree.config",
	"worktree.maintenance",
	"workspace.sync",
	"workspace.result"
]);
const gitOperation = resolveGlobalSingleton(Symbol.for("openclaw.gitSpawnOperation"), () => new AsyncLocalStorage());
const childOperations = /* @__PURE__ */ new Set([
	"agent.exec",
	"agent.cli",
	"agent.file-read",
	"shell.snapshot",
	"service.relay",
	"service.manager",
	"worktree.filesystem",
	"worktree.cleanup",
	"worktree.maintenance"
]);
const childOperation = resolveGlobalSingleton(Symbol.for("openclaw.childSpawnOperation"), () => new AsyncLocalStorage());
/** Attribute asynchronous launch preparation to a bounded owner, without command content. */
function withChildProcessOperation(operation, run, mode = "override") {
	return mode === "default" && childOperation.getStore() !== void 0 ? run() : childOperation.run(childOperations.has(operation) ? operation : "unknown", run);
}
function unscopedProcessOperation(family, name, args) {
	if (args[0] === "--version" || args[0] === "-v" && (family === "node" || family === "bun" || name === "gh")) return "unscoped.version";
	if (family === "powershell" || family === "pwsh") {
		const argv = [name, ...args];
		const { command, valueTokenIndex } = resolvePowerShellInlineCommandMatch(argv);
		return command !== null && valueTokenIndex !== null && !isPowerShellInlineFileCommandFlag(argv[valueTokenIndex - 1] ?? "") ? "unscoped.shell-command" : "unscoped.shell";
	}
	if (/^(sh|bash|zsh)$/.test(family)) return resolveInlineCommandMatch([name, ...args], POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).command !== null ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "cmd") return args.some((arg) => /^-[a-z]*c$/.test(arg) || /^\/(?:c|k)$/i.test(arg)) ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "node" || family === "bun") return "unscoped.runtime";
	if (family === "other" && /^(gh|docker|podman|which|uname|sw_vers|sysctl|curl|tar)$/.test(name)) return `unscoped.${name}`;
	return "unscoped.command";
}
function unscopedGitOperation(args) {
	let i = 0;
	while (i < args.length) {
		const arg = args[i];
		if ([
			"-C",
			"-c",
			"--git-dir",
			"--work-tree",
			"--namespace",
			"--config-env"
		].includes(arg)) i += 2;
		else if (/^--(?:git-dir|work-tree|namespace|config-env|attr-source)=/u.test(arg)) i++;
		else if ([
			"--no-pager",
			"--no-optional-locks",
			"--no-lazy-fetch",
			"--literal-pathspecs",
			"--bare"
		].includes(arg)) i++;
		else break;
	}
	const command = args[i] ?? "";
	return /^(config|rev-parse|status|diff|ls-files|rev-list|merge-base|cat-file|symbolic-ref|for-each-ref|show-ref|remote|log|show|hash-object|update-ref|worktree|branch|fetch|clone|init|checkout|read-tree|write-tree|commit-tree|pack-objects|index-pack|maintenance|multi-pack-index|gc|fast-import|add|commit|push|reset|clean|merge|tag|describe|switch|ls-tree|update-index|check-ref-format|diff-tree|diff-index|diff-files|sparse-checkout|checkout-index|check-attr|mktree|var|apply|fsck|ls-remote|rebase|reflog)$/u.test(command) ? `unscoped.${command}` : command === "--version" || command === "version" ? "unscoped.version" : "unscoped.other";
}
/** Preserve the admitted owner across retries, ref admission, and asynchronous spawn events. */
function withGitProcessOperation(operation, run, mode = "override") {
	return operation === void 0 || mode === "default" && gitOperation.getStore() !== void 0 ? run() : gitOperation.run(gitOperations.has(operation) ? operation : "unknown", run);
}
/** Capture attribution before native preparation; record only after a successful launch. */
function prepareChildProcessSpawnRecorder(command, args = [], sqliteOperation) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const wrappedCommand = resolveOomScoreWrappedCommand(command, args);
	const commandArgs = wrappedCommand ? args.slice(3) : args;
	const name = path.win32.basename(wrappedCommand ?? command).toLowerCase().replace(/\.(exe|cmd)$/, "");
	const family = COMMAND_FAMILIES.test(name) ? name : "other";
	const operation = family === "git" ? gitOperation.getStore() ?? childOperation.getStore() ?? unscopedGitOperation(commandArgs) : sqliteOperation ?? childOperation.getStore() ?? unscopedProcessOperation(family, name, commandArgs);
	const key = `${family}:${operation}`;
	return () => {
		if (areDiagnosticsEnabledForProcess()) {
			const previous = spawnCounts.counts.get(key);
			spawnCounts.counts.set(key, {
				family,
				operation,
				count: (previous?.count ?? 0) + 1
			});
		}
	};
}
/** Count admitted local and broker launches, excluding failed spawn attempts. */
function recordChildProcessSpawn(command, child, sqliteOperation, args = []) {
	const record = prepareChildProcessSpawnRecorder(command, args, sqliteOperation);
	if (record) child.once("spawn", record);
}
/** The existing diagnostics heartbeat owns sampling; rates use actual elapsed time. */
function emitChildProcessSpawnSample() {
	const now = performance.now();
	if (!areDiagnosticsEnabledForProcess()) {
		spawnCounts.counts.clear();
		spawnCounts.sampledAt = now;
		return;
	}
	const intervalMs = now - spawnCounts.sampledAt;
	if (intervalMs < 6e4) return;
	for (const { family, operation, count } of spawnCounts.counts.values()) {
		emitInternalDiagnosticEvent({
			type: "diagnostic.child_process.spawn",
			family,
			operation,
			count,
			intervalMs
		});
		(spawnLog ??= createSubsystemLogger("gateway/diagnostics/process")).debug(`child process spawns: family=${family} operation=${operation} count=${count} ratePerMinute=${(count * 6e4 / intervalMs).toFixed(2)}`);
	}
	spawnCounts.counts.clear();
	spawnCounts.sampledAt = now;
}
//#endregion
export { withGitProcessOperation as a, withChildProcessOperation as i, prepareChildProcessSpawnRecorder as n, recordChildProcessSpawn as r, emitChildProcessSpawnSample as t };
