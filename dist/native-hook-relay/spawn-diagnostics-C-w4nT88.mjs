import { S as resolveGlobalSingleton } from "./number-coercion-CmpLVzZ6.mjs";
import { c as areDiagnosticsEnabledForProcess } from "./subsystem-M2sQt_up.mjs";
import "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import "./host-BpNtvl4K.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/spawn-broker/context.ts
const context = new AsyncLocalStorage();
function getSpawnBroker() {
	return context.getStore();
}
//#endregion
//#region src/process/spawn-diagnostics.ts
const spawnCounts = resolveGlobalSingleton(Symbol.for("openclaw.childProcessSpawnCounts"), () => ({
	counts: /* @__PURE__ */ new Map(),
	sampledAt: performance.now()
}));
const COMMAND_FAMILIES = /^(node|bun|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/;
const gitOperation = resolveGlobalSingleton(Symbol.for("openclaw.gitSpawnOperation"), () => new AsyncLocalStorage());
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
//#endregion
export { getSpawnBroker as n, recordChildProcessSpawn as t };
