import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import "./errors-DnjwnOju.mjs";
import { a as emitInternalDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as getSpawnBroker } from "./context-5XyHo0If.mjs";
import { n as brokerSpawnOptions } from "./host-S-RnY5QX.mjs";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
//#region src/process/spawn-utils.ts
const spawnCounts = resolveGlobalSingleton(Symbol.for("openclaw.childProcessSpawnCounts"), () => ({
	counts: /* @__PURE__ */ new Map(),
	sampledAt: performance.now()
}));
let spawnLog;
const COMMAND_FAMILIES = /^(node|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/;
/** Count admitted local and broker launches, without recording paths or arguments. */
function recordChildProcessSpawn(command, child) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const name = path.win32.basename(command).toLowerCase().replace(/\.(exe|cmd)$/, "");
	const family = COMMAND_FAMILIES.test(name) ? name : "other";
	child.once("spawn", () => {
		if (areDiagnosticsEnabledForProcess()) spawnCounts.counts.set(family, (spawnCounts.counts.get(family) ?? 0) + 1);
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
	for (const [family, count] of spawnCounts.counts) {
		emitInternalDiagnosticEvent({
			type: "diagnostic.child_process.spawn",
			family,
			count,
			intervalMs
		});
		(spawnLog ??= createSubsystemLogger("gateway/diagnostics/process")).debug(`child process spawns: family=${family} count=${count} ratePerMinute=${(count * 6e4 / intervalMs).toFixed(2)}`);
	}
	spawnCounts.counts.clear();
	spawnCounts.sampledAt = now;
}
/** Select the process-scoped native spawn transport without changing launch options. */
function spawnProcess(command, args, options) {
	const broker = getSpawnBroker();
	const child = broker && brokerSpawnOptions(options) ? broker.spawn(command, args, options) : spawn(command, args, options);
	recordChildProcessSpawn(command, child);
	return child;
}
function shouldRetry(err) {
	return (err && typeof err === "object" && "code" in err ? String(err.code) : "") === "EBADF";
}
async function spawnAndWaitForSpawn(spawnImpl, argv, options) {
	const child = spawnImpl(expectDefined(argv[0], "argv entry at 0"), argv.slice(1), options);
	try {
		await once(child, "spawn");
	} catch (err) {
		throw toErrorObject(err, "Non-Error rejection");
	}
	return child;
}
async function spawnWithFallback(params) {
	const spawnImpl = params.spawnImpl ?? spawnProcess;
	const baseOptions = { ...params.options };
	const fallbacks = params.fallbacks ?? [];
	const attempts = [baseOptions, ...fallbacks.map((options) => ({
		...baseOptions,
		...options
	}))];
	let lastError;
	for (const [index, attempt] of attempts.entries()) {
		params.assertCurrent?.();
		try {
			return {
				child: await spawnAndWaitForSpawn(spawnImpl, params.argv, attempt),
				usedFallback: index > 0
			};
		} catch (err) {
			lastError = err;
			if (!fallbacks[index] || !shouldRetry(err)) throw err;
		}
	}
	throw lastError;
}
//#endregion
export { spawnWithFallback as i, recordChildProcessSpawn as n, spawnProcess as r, emitChildProcessSpawnSample as t };
