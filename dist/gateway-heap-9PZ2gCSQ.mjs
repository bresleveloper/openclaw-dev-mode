import { t as parseNodeOptionsEnvVar } from "./node-options-W869vrJq.mjs";
import { a as resolveManagedGatewayServiceCommand, r as hasGatewayServiceEnvironmentOverride } from "./service-types-d44oynyj.mjs";
import { o as resolveServiceEntrypointIndex } from "./service-layout-DuzmQnH1.mjs";
import os from "node:os";
//#region src/daemon/gateway-heap.ts
/** Adaptive Node heap policy for the managed Gateway service. */
const MEBIBYTE_BYTES = 1048576;
const GATEWAY_HEAP_FLOOR_MIB = 2048;
const GATEWAY_HEAP_CAP_MIB = 8192;
function readAvailableMemory(params) {
	const constrainedMemoryBytes = params.constrainedMemoryBytes ?? process.constrainedMemory();
	const physicalMemoryBytes = params.physicalMemoryBytes ?? os.totalmem();
	const validPhysical = Number.isSafeInteger(physicalMemoryBytes) && physicalMemoryBytes > 0;
	if (Number.isSafeInteger(constrainedMemoryBytes) && constrainedMemoryBytes > 0 && (!validPhysical || constrainedMemoryBytes <= physicalMemoryBytes)) return {
		bytes: constrainedMemoryBytes,
		source: "constrained"
	};
	return {
		bytes: validPhysical ? physicalMemoryBytes : null,
		source: validPhysical ? "physical" : "unknown"
	};
}
function resolveGatewayHeapLimit(params = {}) {
	const memory = readAvailableMemory(params);
	if (memory.bytes === null || memory.bytes < 2 * MEBIBYTE_BYTES) return {
		maxOldSpaceSizeMiB: null,
		availableMemoryMiB: null,
		memorySource: "unknown",
		floorMiB: GATEWAY_HEAP_FLOOR_MIB,
		capMiB: GATEWAY_HEAP_CAP_MIB,
		headroomCapMiB: null
	};
	const availableMemoryMiB = Math.floor(memory.bytes / MEBIBYTE_BYTES);
	const halfMemoryMiB = Math.floor(availableMemoryMiB / 2);
	const capMiB = Math.max(GATEWAY_HEAP_CAP_MIB, Math.floor(availableMemoryMiB / 4));
	const headroomCapMiB = Math.floor(availableMemoryMiB * .75);
	return {
		maxOldSpaceSizeMiB: Math.min(capMiB, Math.max(GATEWAY_HEAP_FLOOR_MIB, halfMemoryMiB), headroomCapMiB),
		availableMemoryMiB,
		memorySource: memory.source,
		floorMiB: GATEWAY_HEAP_FLOOR_MIB,
		capMiB,
		headroomCapMiB
	};
}
function parseHeapControls(tokens) {
	const controls = /* @__PURE__ */ new Map();
	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index] ?? "";
		if (token === "--") break;
		const match = /^(--max(?:[-_]old[-_]space[-_]size(?:[-_]percentage)?|[-_]heap[-_]size))(?:=(.*))?$/u.exec(token);
		if (!match) continue;
		const flag = (match[1] ?? "").replaceAll("_", "-");
		const rawValue = match[2] ?? tokens[++index] ?? "";
		const value = Number(rawValue);
		if (flag.endsWith("-percentage") ? Number.isFinite(value) && value > 0 && value <= 100 : /^\+?\d+$/u.test(rawValue) && Number.isSafeInteger(value) && value >= 0) controls.set(flag, value);
	}
	return Array.from(controls, ([flag, value]) => `${flag}=${value}`);
}
function resolveGatewayHeapNodeOptions(existingNodeOptions, runtime = "node") {
	const controls = parseHeapControls(parseNodeOptionsEnvVar(existingNodeOptions) ?? []).join(" ");
	if (controls || runtime !== "bun") return controls;
	const limit = resolveGatewayHeapLimit().maxOldSpaceSizeMiB;
	return limit === null ? "" : `--max-old-space-size=${Math.min(GATEWAY_HEAP_CAP_MIB, limit)}`;
}
function readServiceHeapExecArgv(programArguments) {
	const entrypointIndex = resolveServiceEntrypointIndex(programArguments);
	return parseHeapControls(programArguments.slice(1, entrypointIndex ?? 1));
}
function resolveGatewayHeapExecArgv(existingCommand) {
	const managed = resolveManagedGatewayServiceCommand(existingCommand);
	const existing = readServiceHeapExecArgv(managed?.programArguments ?? []);
	if (existing.length || resolveGatewayHeapNodeOptions(managed?.environment?.NODE_OPTIONS) || hasGatewayServiceEnvironmentOverride(existingCommand, ["NODE_OPTIONS"])) return existing;
	const limit = resolveGatewayHeapLimit().maxOldSpaceSizeMiB;
	return limit === null ? [] : [`--max-old-space-size=${limit}`];
}
function inspectGatewayHeapLimit(nodeOptions, memory = {}, programArguments = []) {
	return {
		...resolveGatewayHeapLimit(memory),
		nodeOptions: resolveGatewayHeapNodeOptions(nodeOptions),
		execArgv: readServiceHeapExecArgv(programArguments)
	};
}
function formatGatewayHeapLimitReport(report) {
	return `${[report.nodeOptions ? `service NODE_OPTIONS: ${report.nodeOptions}` : "", report.execArgv.length ? `service argv: ${report.execArgv.join(" ")}` : ""].filter(Boolean).join("; ") || "no service heap control"}; installer recommendation: ${report.maxOldSpaceSizeMiB === null ? "unavailable (unknown capacity; use Node default)" : `${report.maxOldSpaceSizeMiB} MiB old space (${report.availableMemoryMiB} MiB ${report.memorySource} capacity; adaptive cap ${report.capMiB} MiB; native headroom cap ${report.headroomCapMiB} MiB)`}; runtime V8 ceiling: not measured`;
}
//#endregion
export { resolveGatewayHeapNodeOptions as a, resolveGatewayHeapExecArgv as i, inspectGatewayHeapLimit as n, readServiceHeapExecArgv as r, formatGatewayHeapLimitReport as t };
