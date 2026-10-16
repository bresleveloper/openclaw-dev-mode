import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { o as emitInternalDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
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
	"publication"
]);
const gitOperation = resolveGlobalSingleton(Symbol.for("openclaw.gitSpawnOperation"), () => new AsyncLocalStorage());
/** Preserve the admitted owner across retries, ref admission, and asynchronous spawn events. */
function withGitProcessOperation(operation, run) {
	return operation === void 0 ? run() : gitOperation.run(gitOperations.has(operation) ? operation : "unknown", run);
}
/** Count admitted local and broker launches, without recording paths or arguments. */
function recordChildProcessSpawn(command, child) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const name = path.win32.basename(command).toLowerCase().replace(/\.(exe|cmd)$/, "");
	const family = COMMAND_FAMILIES.test(name) ? name : "other";
	const operation = family === "git" ? gitOperation.getStore() ?? "unknown" : "none";
	const key = `${family}:${operation}`;
	child.once("spawn", () => {
		if (areDiagnosticsEnabledForProcess()) {
			const previous = spawnCounts.counts.get(key);
			spawnCounts.counts.set(key, {
				family,
				operation,
				count: (previous?.count ?? 0) + 1
			});
		}
	});
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
export { recordChildProcessSpawn as n, withGitProcessOperation as r, emitChildProcessSpawnSample as t };
