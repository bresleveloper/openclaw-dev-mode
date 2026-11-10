import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as createInspectorProfileCapture, i as captureDiagnosticProfile, n as ProfileFailure } from "./diagnostic-profile-DB4AK5tF.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { writeHeapSnapshot } from "node:v8";
//#region src/logging/diagnostic-heap-snapshot.ts
const MAX_HEAP_BYTES = 6 * 1024 ** 3;
const COOLDOWN_MS = 6e4;
const log = createSubsystemLogger("gateway").child("diagnostics/heap-snapshot");
let nextCaptureAt = 0;
/** Owns opt-in main-isolate snapshots; native capture cannot be interrupted. */
async function captureDiagnosticHeapSnapshot(options) {
	let ownedPath;
	let elapsedMs = 0;
	let heapUsedAfter = 0;
	const outcome = await captureDiagnosticProfile({
		...options,
		durationMs: 0,
		create: (inspector) => createInspectorProfileCapture(inspector, {
			setup: async (session) => {
				if (performance.now() < nextCaptureAt) throw new ProfileFailure("cooldown");
				if (process.memoryUsage().heapUsed > MAX_HEAP_BYTES) throw new ProfileFailure("heap-too-large");
				const directory = path.join(resolveStateDir(), "diagnostics");
				await fs.mkdir(directory, {
					recursive: true,
					mode: 448
				});
				if (options.signal.aborted || !options.hasAuthority()) throw new ProfileFailure("cancelled");
				const filename = path.join(directory, `heap-${(/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-")}.heapsnapshot`);
				const file = await fs.open(filename, "wx", 384);
				ownedPath = filename;
				await file.close();
				await session.post("HeapProfiler.enable");
			},
			start: async () => {
				const heapUsedBefore = process.memoryUsage().heapUsed;
				if (heapUsedBefore > MAX_HEAP_BYTES) throw new ProfileFailure("heap-too-large");
				log.warn("Writing heap snapshot: the main thread will block until capture finishes", {
					heapUsedBefore,
					reason: options.reason
				});
				const startedAt = performance.now();
				try {
					writeHeapSnapshot(ownedPath);
				} finally {
					nextCaptureAt = performance.now() + COOLDOWN_MS;
				}
				elapsedMs = performance.now() - startedAt;
				heapUsedAfter = process.memoryUsage().heapUsed;
			},
			stop: async () => ({ profile: {
				path: ownedPath,
				sizeBytes: (await fs.stat(ownedPath)).size
			} }),
			disable: (session) => session.post("HeapProfiler.disable")
		}),
		sanitize: (profile, _packageRoot, measurement) => ({
			...profile,
			heapUsedBefore: measurement.before.heapUsed,
			heapUsedAfter,
			elapsedMs
		})
	});
	if (outcome.status === "unavailable" && ownedPath) {
		const removalFailed = await fs.unlink(ownedPath).then(() => false, () => true);
		outcome.cleanupFailed ||= removalFailed;
	}
	return outcome;
}
//#endregion
export { captureDiagnosticHeapSnapshot };
