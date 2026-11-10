import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as brokerSpawnOptions } from "./host-lcL0oJAA.mjs";
import { t as getSpawnBroker } from "./context-JTQRB4fe.mjs";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-BCVNjaDp.mjs";
import { r as recordChildProcessSpawn } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { n as assertAppContainerSpawnSupported } from "./windows-appcontainer-spawn-CK6NM058.mjs";
import { spawn } from "node:child_process";
import { once } from "node:events";
//#region src/process/spawn-utils.ts
/** Select the process-scoped native spawn transport without changing launch options. */
function spawnProcess(command, args, options, initiateSpawn) {
	assertAppContainerSpawnSupported(options.stdio);
	const broker = getSpawnBroker();
	const child = broker && brokerSpawnOptions(options) ? broker.spawn(command, args, options, initiateSpawn) : initiateSpawn ? initiateSpawn(() => spawn(command, args, options)) : spawn(command, args, options);
	if (!options.shell && options.argv0 !== void 0) prepareOomScoreAdjustedSpawn(command, args, options).afterSpawn?.(child.pid);
	recordChildProcessSpawn(command, child, void 0, args);
	return child;
}
function shouldRetry(err) {
	return (err && typeof err === "object" && "code" in err ? String(err.code) : "") === "EBADF";
}
async function spawnWithFallback(params) {
	assertAppContainerSpawnSupported(params.spawnImpl ? void 0 : params.options.stdio);
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
			const child = spawnImpl(expectDefined(params.argv[0], "argv entry at 0"), params.argv.slice(1), attempt, params.initiateSpawn);
			await once(child, "spawn").catch((err) => {
				throw toErrorObject(err, "Non-Error rejection");
			});
			return {
				child,
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
export { spawnWithFallback as n, spawnProcess as t };
