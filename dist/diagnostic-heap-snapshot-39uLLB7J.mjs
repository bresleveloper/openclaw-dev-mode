import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { writeHeapSnapshot } from "node:v8";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/logging/diagnostic-heap-snapshot.ts
const MAX_HEAP_BYTES = 6 * 1024 ** 3;
const COOLDOWN_MS = 6e4;
const log = createSubsystemLogger("gateway").child("diagnostics/heap-snapshot");
let capturing = false;
let nextCaptureAt = 0;
/** Owns opt-in main-isolate snapshots; native capture cannot be interrupted. */
async function captureDiagnosticHeapSnapshot(options) {
	const unavailable = (reason) => ({
		status: "unavailable",
		reason,
		cleanupFailed: false
	});
	const active = () => !options.signal.aborted && options.hasAuthority();
	if (!active()) return unavailable("cancelled");
	if (process.versions.bun) return unavailable("unsupported");
	if (capturing) return unavailable("busy");
	if (performance.now() < nextCaptureAt) return unavailable("cooldown");
	if (process.memoryUsage().heapUsed > MAX_HEAP_BYTES) return unavailable("heap-too-large");
	capturing = true;
	let ownedPath;
	try {
		const directory = path.join(resolveStateDir(), "diagnostics");
		await fs.mkdir(directory, {
			recursive: true,
			mode: 448
		});
		if (!active()) return unavailable("cancelled");
		const filename = path.join(directory, `heap-${(/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-")}.heapsnapshot`);
		const file = await fs.open(filename, "wx", 384);
		ownedPath = filename;
		await file.close();
		const heapUsedBefore = process.memoryUsage().heapUsed;
		if (!active() || heapUsedBefore > MAX_HEAP_BYTES) {
			await fs.unlink(filename);
			ownedPath = void 0;
			return unavailable(active() ? "heap-too-large" : "cancelled");
		}
		log.warn("Writing heap snapshot: the main thread will block until V8 finishes", {
			heapUsedBefore,
			reason: options.reason
		});
		const startedAt = performance.now();
		try {
			writeHeapSnapshot(filename);
		} finally {
			nextCaptureAt = performance.now() + COOLDOWN_MS;
		}
		const elapsedMs = performance.now() - startedAt;
		const heapUsedAfter = process.memoryUsage().heapUsed;
		const { size: sizeBytes } = await fs.stat(filename);
		return {
			status: "complete",
			result: {
				path: filename,
				sizeBytes,
				heapUsedBefore,
				heapUsedAfter,
				elapsedMs
			}
		};
	} catch {
		return {
			status: "unavailable",
			reason: "capture-failed",
			cleanupFailed: ownedPath ? await fs.unlink(ownedPath).then(() => false, () => true) : false
		};
	} finally {
		capturing = false;
	}
}
//#endregion
export { captureDiagnosticHeapSnapshot };
