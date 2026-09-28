import { n as isNodeRuntime, t as isBunRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { n as SUPPORTED_NODE_VERSIONS } from "./node-version-DdJ6cN09.mjs";
import { a as resolveNodeRuntimeInfo, f as normalizeServicePathEntry, i as resolveBunRuntimeInfo, n as isVersionManagedNodePath, t as isSystemNodePath, u as resolveSystemNodePath } from "./runtime-paths-DifTYoyV.mjs";
import { a as readDaemonRuntimePin } from "./runtime-pin-state-Bz2yXWLQ.mjs";
//#region src/daemon/service-audit-runtime.ts
/** Checks the executable recorded in a Gateway service against the runtime contract. */
const SERVICE_RUNTIME_AUDIT_CODES = {
	gatewayRuntimeBun: "gateway-runtime-bun",
	gatewayRuntimeNode: "gateway-runtime-node",
	gatewayRuntimeProbeFailed: "gateway-runtime-probe-failed",
	gatewayRuntimeNodeVersionManager: "gateway-runtime-node-version-manager",
	gatewayRuntimeNodeSystemMissing: "gateway-runtime-node-system-missing"
};
async function auditGatewayRuntime(env, command, issues, platform, timeoutMs) {
	const execPath = command?.programArguments?.[0];
	if (!execPath) return;
	if (isBunRuntime(execPath)) {
		const runtime = await resolveBunRuntimeInfo(execPath);
		if (runtime.status !== "supported") issues.push({
			code: runtime.status === "probe-failed" ? SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeProbeFailed : SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeBun,
			message: runtime.status === "probe-failed" ? "Gateway service Bun runtime probe failed." : "Gateway service uses an unsupported Bun runtime; Bun 1.4+ with WAL-reset-safe node:sqlite is required.",
			detail: runtime.status === "probe-failed" ? runtime.error.message : runtime.sqliteSelectionError ? `${execPath}: ${runtime.sqliteSelectionError}` : execPath,
			level: "recommended"
		});
		return;
	}
	if (!isNodeRuntime(execPath)) return;
	const runtime = await resolveNodeRuntimeInfo(execPath, env, timeoutMs);
	if (runtime.status !== "supported") issues.push({
		code: runtime.status === "probe-failed" ? SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeProbeFailed : SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeNode,
		message: runtime.status === "probe-failed" ? "Gateway service Node runtime probe failed." : runtime.capabilityError ?? "Gateway service Node failed its capability probe.",
		detail: runtime.status === "probe-failed" ? runtime.error.message : execPath,
		level: "recommended"
	});
	const pinnedPath = command ? readDaemonRuntimePin({
		kind: "gateway",
		env
	}, command).pin?.path : void 0;
	if (!(pinnedPath && normalizeServicePathEntry(pinnedPath, platform) === normalizeServicePathEntry(execPath, platform)) && isVersionManagedNodePath(execPath, platform)) {
		issues.push({
			code: SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeNodeVersionManager,
			message: "Gateway service uses Node from a version manager; it can break after upgrades.",
			detail: execPath,
			level: "recommended"
		});
		if (!isSystemNodePath(execPath, env, platform)) {
			if (!await resolveSystemNodePath(env, platform)) issues.push({
				code: SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeNodeSystemMissing,
				message: `System Node ${SUPPORTED_NODE_VERSIONS} not found; install it before migrating away from version managers.`,
				level: "recommended"
			});
		}
	}
	return runtime.status === "supported" ? runtime.note : void 0;
}
//#endregion
export { auditGatewayRuntime as n, SERVICE_RUNTIME_AUDIT_CODES as t };
