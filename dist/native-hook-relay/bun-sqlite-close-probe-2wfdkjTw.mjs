import { i as raceWithTimeout } from "./src-Dpfm4nnc.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-BOuHXXbo.mjs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { channel } from "node:diagnostics_channel";
import { Worker } from "node:worker_threads";
import { mkdtemp, realpath, rm } from "node:fs/promises";
import { setImmediate } from "node:timers/promises";
//#region src/infra/bun-sqlite-close-probe.ts
async function cleanupProbe(worker, directory, background) {
	try {
		if (worker) {
			if (background) worker.unref();
			await raceWithTimeout(worker.terminate(), 5e3, () => {
				throw new Error("SQLite close check termination timed out after 5000ms");
			}, { ref: !background });
			await setImmediate(void 0, { ref: !background });
		}
		if (directory) await rm(directory, {
			recursive: true,
			force: true
		});
	} catch (error) {
		worker?.unref();
		const reason = `SQLite close check cleanup failed: ${String(error)}; retained ${directory}`;
		process.emitWarning(reason, { code: "SQLITE_CLOSE_PROBE_CLEANUP" });
		return reason;
	}
}
async function probeSqliteNativeClose() {
	let directory;
	let worker;
	let deadline;
	let result;
	try {
		directory = await mkdtemp(join(tmpdir(), "openclaw-sqlite-close-"));
		directory = await realpath(directory);
		channel("openclaw.sqlite.close-probe").publish({ phase: "start" });
		worker = new Worker(resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sqliteCloseProbe), {
			workerData: directory,
			execArgv: []
		});
		const running = worker;
		result = await new Promise((resolve, reject) => {
			running.once("message", (value) => {
				if (typeof value !== "string") {
					reject(/* @__PURE__ */ new Error("Invalid SQLite close check reply"));
					return;
				}
				resolve({
					explicitSqliteCloseReleasesNativeResources: value === "",
					reason: value || "Native close check passed"
				});
			});
			running.once("error", reject);
			running.once("exit", (code) => reject(/* @__PURE__ */ new Error(`SQLite close check exited before its reply (${code})`)));
			deadline = setTimeout(() => reject(/* @__PURE__ */ new Error("SQLite close check timed out after 10000ms")), 1e4);
		});
	} catch (error) {
		result = {
			explicitSqliteCloseReleasesNativeResources: false,
			reason: String(error)
		};
	} finally {
		clearTimeout(deadline);
	}
	const background = !result.explicitSqliteCloseReleasesNativeResources;
	const cleanup = cleanupProbe(worker, directory, background);
	if (background) return result;
	const failure = await cleanup;
	if (failure) return {
		explicitSqliteCloseReleasesNativeResources: false,
		reason: failure
	};
	return result;
}
//#endregion
export { probeSqliteNativeClose };
