import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-ByV7kR1W.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { n as mcpConfigInternal } from "./mcp-config-DDcOp4Ta.mjs";
//#region src/agents/mcp-lifecycle-lease.ts
const MCP_LIFECYCLE_LEASE_SCOPE = "core:claw-mcp-lifecycle";
const MCP_LIFECYCLE_LEASE_MS = 3e5;
const MCP_LIFECYCLE_WAIT_MS = 6e5;
/** Serialize ownership decisions and global config mutations for one MCP server. */
async function withMcpLifecycleLease(name, options, run) {
	return await withOpenClawStateLease({
		scope: MCP_LIFECYCLE_LEASE_SCOPE,
		key: name.trim(),
		database: {
			scope: "shared",
			options: {
				...options.env ? { env: options.env } : {},
				...options.path ? { path: options.path } : {},
				...options.database ? { database: options.database } : {}
			}
		},
		leaseMs: MCP_LIFECYCLE_LEASE_MS,
		waitMs: MCP_LIFECYCLE_WAIT_MS,
		...options.signal ? { signal: options.signal } : {},
		leaseLabel: "Claw MCP lifecycle lease",
		operationLabel: "claws.mcp.lifecycle.lease"
	}, async (lease) => {
		lease.assertOwned();
		const result = await run(() => lease.assertOwned());
		lease.assertOwned();
		return result;
	});
}
const withClawMcpLifecycleLease = withMcpLifecycleLease;
//#endregion
//#region src/agents/mcp-config-mutation.ts
/** Canonical configured-MCP mutations with OAuth credential lifecycle cleanup. */
function hasOAuthAuth(server) {
	return asNullableRecord(server)?.auth === "oauth";
}
function hasRequesterIdentity(server) {
	return hasOAuthAuth(server) && asNullableRecord(asNullableRecord(server)?.oauth)?.identity === "per-requester";
}
async function clearReplacedMcpOAuth(mutation) {
	if (!hasOAuthAuth(mutation.previous)) return;
	const previous = resolveMcpTransportConfig(mutation.name, mutation.previous);
	if (previous?.kind !== "http") return;
	const next = hasOAuthAuth(mutation.next) ? resolveMcpTransportConfig(mutation.name, mutation.next) : void 0;
	const sameServerUrl = next?.kind === "http" && next.url === previous.url;
	const wasRequester = hasRequesterIdentity(mutation.previous);
	if (sameServerUrl && wasRequester === hasRequesterIdentity(mutation.next)) return;
	const [{ operatorMcpOAuthIdentity }, { clearMcpOAuthRequesters, clearMcpOAuthServer }] = await Promise.all([import("./mcp-oauth-identity-DB8Q-p21.mjs"), import("./mcp-oauth-Dt9_5Q12.mjs")]);
	const identity = operatorMcpOAuthIdentity(mutation.name, previous.url);
	if (sameServerUrl && wasRequester) {
		await clearMcpOAuthRequesters(identity);
		return;
	}
	await clearMcpOAuthServer(identity);
}
async function withMcpOwnershipCoordination(params, run) {
	const name = params.name.trim();
	if (!name || params.recordIndependentOwner === false) return run();
	return withMcpLifecycleLease(name, {}, run);
}
function setConfiguredMcpServer(params) {
	return withMcpOwnershipCoordination(params, () => mcpConfigInternal.set(params, clearReplacedMcpOAuth));
}
function unsetConfiguredMcpServer(params) {
	return withMcpOwnershipCoordination(params, () => mcpConfigInternal.unset(params, clearReplacedMcpOAuth));
}
function updateConfiguredMcpServer(params) {
	return withMcpOwnershipCoordination(params, () => mcpConfigInternal.update(params, clearReplacedMcpOAuth));
}
function updateConfiguredMcpServerTools(params) {
	return withMcpOwnershipCoordination(params, () => mcpConfigInternal.updateTools(params, clearReplacedMcpOAuth));
}
//#endregion
export { withClawMcpLifecycleLease as a, updateConfiguredMcpServerTools as i, unsetConfiguredMcpServer as n, updateConfiguredMcpServer as r, setConfiguredMcpServer as t };
