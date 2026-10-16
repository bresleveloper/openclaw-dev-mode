import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { n as resolveGatewayDiscoveryEndpoint } from "./bonjour-discovery-DnM1ztCd.mjs";
//#region src/infra/gateway-discovery-targets.ts
function buildGatewayDiscoveryTarget(beacon, opts) {
	const endpoint = resolveGatewayDiscoveryEndpoint(beacon);
	const sshPort = asPositiveFiniteNumber(beacon.sshPort) ?? null;
	const sshUser = normalizeOptionalString(opts?.sshUser) ?? "";
	const baseSshTarget = endpoint ? sshUser ? `${sshUser}@${endpoint.host}` : endpoint.host : null;
	const sshTarget = baseSshTarget && sshPort && sshPort !== 22 ? `${baseSshTarget}:${sshPort}` : baseSshTarget;
	return {
		title: normalizeOptionalString(beacon.displayName || beacon.instanceName || "Gateway") ?? "Gateway",
		domain: normalizeOptionalString(beacon.domain || "local.") ?? "local.",
		endpoint,
		wsUrl: endpoint?.wsUrl ?? null,
		sshPort,
		sshTarget
	};
}
function buildGatewayDiscoveryLabel(beacon) {
	const target = buildGatewayDiscoveryTarget(beacon);
	const hint = target.endpoint ? `${target.endpoint.host}:${target.endpoint.port}` : "host unknown";
	return `${target.title} (${hint})`;
}
function serializeGatewayDiscoveryBeacon(beacon) {
	const target = buildGatewayDiscoveryTarget(beacon);
	return {
		instanceName: beacon.instanceName,
		displayName: beacon.displayName ?? null,
		domain: beacon.domain ?? null,
		host: beacon.host ?? null,
		lanHost: beacon.lanHost ?? null,
		tailnetDns: beacon.tailnetDns ?? null,
		gatewayPort: beacon.gatewayPort ?? null,
		sshPort: beacon.sshPort ?? null,
		wsUrl: target.wsUrl
	};
}
//#endregion
export { buildGatewayDiscoveryTarget as n, serializeGatewayDiscoveryBeacon as r, buildGatewayDiscoveryLabel as t };
