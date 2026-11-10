import { Jn as string, Un as record, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { t as NativeRuntimeConfigSchema } from "./native-runtime-config-D6_xgoOl.mjs";
import { closeSync, readSync, realpathSync } from "node:fs";
//#region src/worker/native-inference-startup.ts
/** Private node-to-worker startup carrier, never part of a Gateway turn envelope. */
const WORKER_NATIVE_INFERENCE_STARTUP_ARG = "--internal-worker-native-inference";
const WORKER_NATIVE_INFERENCE_STARTUP_MAX_BYTES = 2097152;
const NativeInferenceStartupSchema = strictObject({
	config: NativeRuntimeConfigSchema,
	credentials: record(string(), string().min(1))
});
/** Drain the private pipe before the start gate, then close it before any tools can run. */
function takeNativeInferenceStartup(args = process.argv) {
	const marker = args.indexOf(WORKER_NATIVE_INFERENCE_STARTUP_ARG);
	if (marker < 0) return;
	args.splice(marker, 1);
	try {
		const data = Buffer.alloc(2097153);
		try {
			let length = 0;
			for (;;) {
				const count = readSync(3, data, length, data.length - length, null);
				length += count;
				if (length > 2097152) throw new Error("Startup payload exceeds limit");
				if (count === 0) return NativeInferenceStartupSchema.parse(JSON.parse(data.toString("utf8", 0, length)));
			}
		} finally {
			data.fill(0);
			closeSync(3);
		}
	} catch {
		throw new Error("Invalid node-local inference startup configuration");
	}
}
function assertNativeInferenceAssignment(startup, descriptor) {
	const assignment = descriptor.assignment;
	const modelRef = `${assignment.modelRef.provider}/${assignment.modelRef.model}`;
	const configuredWorkspace = realpathSync(startup.config.workspace);
	const assignedWorkspace = realpathSync(assignment.workspaceDir);
	if (assignment.inference !== "runtime-local" || !startup.config.models.some((model) => `${model.provider}/${model.id}` === modelRef && startup.credentials[modelRef]) || configuredWorkspace !== assignedWorkspace) throw new Error("Node-local inference startup does not match the admitted workspace or model");
}
//#endregion
export { takeNativeInferenceStartup as i, WORKER_NATIVE_INFERENCE_STARTUP_MAX_BYTES as n, assertNativeInferenceAssignment as r, WORKER_NATIVE_INFERENCE_STARTUP_ARG as t };
