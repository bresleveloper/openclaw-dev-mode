import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/node-bootstrap-artifact-worker.ts
async function prepareNodeBootstrapArtifactInWorker(options, temporaryRoot) {
	const pool = new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.nodeBootstrapArtifact),
		maxWorkers: 1
	});
	try {
		const artifact = await pool.run({
			options,
			temporaryRoot
		}, {});
		return Object.freeze({
			...artifact,
			enabledPluginIds: Object.freeze(artifact.enabledPluginIds)
		});
	} finally {
		await pool.close();
	}
}
//#endregion
//#region src/gateway/worker-environments/node-bootstrap-artifact.ts
/** Owns one immutable deployment artifact for this Gateway process, never the live installation. */
function createNodeBootstrapArtifactProvider(options) {
	let prepared;
	let temporaryRoot;
	let closed = false;
	const consumers = /* @__PURE__ */ new Map();
	return {
		async prepare(signal) {
			signal?.throwIfAborted();
			if (closed) throw new Error("Node bootstrap artifact provider is closed");
			prepared ??= Promise.resolve().then(async () => {
				try {
					temporaryRoot = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-node-runtime-"));
					if (closed) throw new Error("Node bootstrap artifact provider is closed");
					const artifact = await prepareNodeBootstrapArtifactInWorker(options, temporaryRoot);
					if (closed) throw new Error("Node bootstrap artifact provider is closed");
					return artifact;
				} catch (error) {
					if (temporaryRoot) await fs.rm(temporaryRoot, {
						recursive: true,
						force: true
					});
					temporaryRoot = void 0;
					prepared = void 0;
					throw error;
				}
			});
			const artifact = await racePromiseWithAbortSignal(prepared, signal);
			signal?.throwIfAborted();
			if (closed) throw new Error("Node bootstrap artifact provider is closed");
			if (signal && !consumers.has(signal)) consumers.set(signal, new Promise((resolve) => {
				signal.addEventListener("abort", () => {
					consumers.delete(signal);
					resolve();
				}, { once: true });
			}));
			return artifact;
		},
		async close() {
			closed = true;
			await prepared?.catch(() => void 0);
			await Promise.all(consumers.values());
			if (temporaryRoot) {
				await fs.rm(temporaryRoot, {
					recursive: true,
					force: true
				});
				temporaryRoot = void 0;
			}
		}
	};
}
//#endregion
export { createNodeBootstrapArtifactProvider };
