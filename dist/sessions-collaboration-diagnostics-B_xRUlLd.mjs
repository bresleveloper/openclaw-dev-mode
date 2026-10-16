import { n as createQueuedDiagnosticPhaseEmitter } from "./diagnostic-events-BADdmgZf.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/sessions-collaboration-diagnostics.ts
/** Attribute worker and provider waits without collecting session or response data. */
async function measureSessionCollaborationPhase(name, run) {
	const emit = createQueuedDiagnosticPhaseEmitter();
	if (!emit) return run();
	const startedAt = Date.now();
	const started = performance.now();
	try {
		return await run();
	} finally {
		try {
			emit({
				name,
				startedAt,
				endedAt: Date.now(),
				durationMs: performance.now() - started
			});
		} catch {}
	}
}
//#endregion
export { measureSessionCollaborationPhase as t };
