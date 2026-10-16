import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import "./errors-O33D01XW.mjs";
import { t as brokerSpawnOptions } from "./host-Dqu6qHYf.mjs";
import { t as getSpawnBroker } from "./context-BGWzAY3i.mjs";
import { n as recordChildProcessSpawn } from "./spawn-diagnostics-BltWCplw.mjs";
import { spawn } from "node:child_process";
import { once } from "node:events";
//#region src/process/spawn-utils.ts
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
export { spawnWithFallback as n, spawnProcess as t };
