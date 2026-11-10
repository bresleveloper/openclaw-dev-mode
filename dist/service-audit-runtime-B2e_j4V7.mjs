import { n as isNodeRuntime, t as isBunRuntime } from "./runtime-binary-GM6c0Hou.mjs";
import { r as SUPPORTED_NODE_VERSIONS } from "./node-version-BfT-yCVT.mjs";
import { a as resolveBunRuntimeInfo, f as resolveSystemNodePath, h as normalizeServicePathEntry, n as isSystemNodePath, o as resolveNodeRuntimeInfo, r as isVersionManagedNodePath } from "./runtime-paths-v6m7qRRF.mjs";
import { a as readDaemonRuntimePin } from "./runtime-pin-state-_Q5AuEC0.mjs";
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
	const bun = isBunRuntime(execPath);
	if (!bun && !isNodeRuntime(execPath)) return;
	const runtime = bun ? await resolveBunRuntimeInfo(execPath) : await resolveNodeRuntimeInfo(execPath, env, timeoutMs);
	if (runtime.status !== "supported") issues.push({
		code: runtime.status === "probe-failed" ? SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeProbeFailed : bun ? SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeBun : SERVICE_RUNTIME_AUDIT_CODES.gatewayRuntimeNode,
		message: runtime.status === "probe-failed" ? `Gateway service ${bun ? "Bun" : "Node"} runtime check failed.` : bun ? "Gateway service uses an unsupported Bun runtime; Bun 1.4.4+ with WAL-reset-safe node:sqlite is required." : runtime.capabilityError ?? "Gateway service Node failed its capability check.",
		detail: runtime.status === "probe-failed" ? runtime.error.message : bun && runtime.sqliteSelectionError ? `${execPath}: ${runtime.sqliteSelectionError}` : execPath,
		level: "recommended"
	});
	if (bun) return;
	const pinnedPath = readDaemonRuntimePin({
		kind: "gateway",
		env
	}, command).pin?.path;
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
}
//#endregion
export { auditGatewayRuntime as n, SERVICE_RUNTIME_AUDIT_CODES as t };
