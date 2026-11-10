import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/gateway/worker-environments/node-bootstrap-artifact-worker.ts
async function prepareNodeBootstrapArtifactInWorker(options, temporaryRoot) {
	const pool = new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.nodeBootstrapArtifact),
		workerClass: "writer"
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
	return {
		async prepare(signal) {
			signal?.throwIfAborted();
			if (closed) throw new Error("Node bootstrap artifact provider is closed");
			prepared ??= Promise.resolve().then(async () => {
				try {
					temporaryRoot = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-node-runtime-"));
					return await prepareNodeBootstrapArtifactInWorker(options, temporaryRoot);
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
			return racePromiseWithAbortSignal(prepared, signal);
		},
		async close() {
			closed = true;
			await prepared?.catch(() => void 0);
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
