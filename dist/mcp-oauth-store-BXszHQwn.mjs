import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { i as runOpenClawStateWorkerOperation, t as executeOpenClawStateWorker } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { n as runWithOpenClawStateLeaseWorker } from "./openclaw-state-lease-worker-storage-B5FJo3te.mjs";
import "./mcp-oauth-store.kernel-C5WU4FAG.mjs";
//#region src/agents/mcp-oauth-status.ts
function projectMcpOAuthCredentialsStatus(store) {
	if (store.pendingAuthorizationChallenge?.requiresAuthorization === true) return { state: "requires-authorization" };
	if (store.tokens) return {
		state: "authorized",
		...store.tokenExpiresAt === void 0 ? {} : { expiresAt: store.tokenExpiresAt }
	};
	if (store.clientInformation || store.codeVerifier || store.discoveryState || store.lastAuthorizationUrl || store.redirectUrl || store.pendingAuthorizationChallenge) return { state: "pending-authorization" };
	return { state: "unauthenticated" };
}
//#endregion
//#region src/agents/mcp-oauth-store.ts
/** Read canonical state, opening the writable lifecycle when runtime owns it. */
async function readMcpOAuthStore(storeKey, context = captureOpenClawStateWorkerContext()) {
	return executeOpenClawStateWorker(context, {
		type: "mcpOAuth.read",
		input: storeKey
	});
}
/** Read status state without creating or repairing the shared database. */
async function readMcpOAuthStoreReadOnly(storeKey, context = captureOpenClawStateWorkerContext()) {
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.readOnly",
		input: storeKey
	}, { context });
	if (result === void 0) return {};
	if (result.ok && result.type === "mcpOAuth.readOnly") return result.value;
	throw new Error("Unexpected MCP OAuth store read result");
}
async function readMcpOAuthStoreStatuses(storeKeys, context = captureOpenClawStateWorkerContext()) {
	if (storeKeys.length === 0) return [];
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.statuses",
		input: storeKeys
	}, { context });
	if (result === void 0) return storeKeys.map(() => projectMcpOAuthCredentialsStatus({}));
	if (result.ok && result.type === "mcpOAuth.statuses") return result.value;
	throw new Error("Unexpected MCP OAuth status batch result");
}
/** List canonical store keys matching one server/principal prefix without creating state. */
async function listMcpOAuthStoreKeysByPrefix(prefix, context = captureOpenClawStateWorkerContext()) {
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.keys",
		input: prefix
	}, { context });
	if (result === void 0) return [];
	if (result.ok && result.type === "mcpOAuth.keys") return result.value;
	throw new Error("Unexpected MCP OAuth keys read result");
}
async function countMcpOAuthStorePrincipals(prefix) {
	const context = captureOpenClawStateWorkerContext();
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.countPrincipals",
		input: prefix
	}, { context });
	if (result === void 0) return 0;
	if (result.ok && result.type === "mcpOAuth.countPrincipals") return result.value;
	throw new Error("Unexpected MCP OAuth principal count result");
}
/** Resolve one unexpired callback state without creating state or scanning credential JSON. */
async function readMcpOAuthPendingAuthorization(state, context = captureOpenClawStateWorkerContext()) {
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.pending",
		input: state
	}, { context });
	if (result === void 0) return;
	if (result.ok && result.type === "mcpOAuth.pending") return result.value;
	throw new Error("Unexpected MCP OAuth pending state read result");
}
/** Apply a bounded mutation under its original live store lease. */
function mutateMcpOAuthStore({ storeKey, lease, context }, mutation, authority) {
	const captured = structuredClone(mutation);
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.mutate",
		input: {
			storeKey,
			identity,
			mutation: captured
		}
	}, { signal: lease.signal }), authority);
}
/** Claim one exact unexpired callback state while its store lease is still owned. */
function consumeOAuthState({ storeKey, lease, context }, state, authority) {
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.consumePending",
		input: {
			storeKey,
			identity,
			state
		}
	}, { signal: lease.signal }), authority);
}
/** Replace one store's callback state after OAuth persisted its session. */
function writeMcpOAuthPendingAuthorization({ storeKey, lease, context }, state, authority) {
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.writePending",
		input: {
			storeKey,
			identity,
			state
		}
	}, { signal: lease.signal }), authority);
}
/** Delete callback correlation for one settled or cleared OAuth store. */
function deleteMcpOAuthPendingAuthorization({ storeKey, lease, context }, authority) {
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.deletePending",
		input: {
			storeKey,
			identity
		}
	}, { signal: lease.signal }), authority);
}
/** Clear one OAuth session while retaining explicit logout provenance. */
function clearMcpOAuthStore({ storeKey, lease, context }) {
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.clear",
		input: {
			storeKey,
			identity
		}
	}, { signal: lease.signal }));
}
/** Remove orphan callback rows for a removed server's requester prefix. */
function deleteMcpOAuthPendingAuthorizationsByPrefix(prefix, context = captureOpenClawStateWorkerContext()) {
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "mcpOAuth.clearPendingPrefix",
		input: prefix
	}), {
		assertCurrent: context.admission.assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(context.admission.assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
export { deleteMcpOAuthPendingAuthorizationsByPrefix as a, readMcpOAuthPendingAuthorization as c, readMcpOAuthStoreStatuses as d, writeMcpOAuthPendingAuthorization as f, deleteMcpOAuthPendingAuthorization as i, readMcpOAuthStore as l, consumeOAuthState as n, listMcpOAuthStoreKeysByPrefix as o, projectMcpOAuthCredentialsStatus as p, countMcpOAuthStorePrincipals as r, mutateMcpOAuthStore as s, clearMcpOAuthStore as t, readMcpOAuthStoreReadOnly as u };
