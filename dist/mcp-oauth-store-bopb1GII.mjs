import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { t as AuthProfileAuthorizationError } from "./authorization-contract-BOF8YHOo.mjs";
import { i as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { r as withOpenClawStateLeaseWorkerAdmission } from "./openclaw-state-lease-worker-owner-kokQJCiD.mjs";
import { n as runWithOpenClawStateLeaseWorker } from "./openclaw-state-lease-worker-operation-DL82kt2g.mjs";
import { n as isMcpOAuthAuthorizationReceipt } from "./mcp-oauth-authorization-facts-DCaTnoCO.mjs";
//#region src/agents/mcp-oauth-store.authorization.ts
const databases = /* @__PURE__ */ new Map();
let observingLifecycle = false;
function retainMcpOAuthAuthorizationState(admission, storeKey) {
	if (!observingLifecycle) {
		observingLifecycle = true;
		registerOpenClawStateDatabaseLifecycleListener((event) => {
			if (event.kind !== "opened" && event.identity) databases.delete(event.identity.key);
		});
	}
	admission.assertCurrent();
	const databaseKey = admission.identity.key;
	let stores = databases.get(databaseKey);
	if (!stores) {
		stores = /* @__PURE__ */ new Map();
		databases.set(databaseKey, stores);
	}
	let state = stores.get(storeKey);
	if (!state) {
		state = {
			revision: {},
			fact: { authorizationId: null },
			pending: 0,
			uncertain: false,
			references: 0
		};
		stores.set(storeKey, state);
	}
	const owner = state;
	owner.references++;
	let released = false;
	const assertCurrent = () => {
		try {
			admission.assertCurrent();
		} catch {
			throw new AuthProfileAuthorizationError("retired");
		}
		if (released || databases.get(databaseKey)?.get(storeKey) !== owner) throw new AuthProfileAuthorizationError("retired");
	};
	const assertSettled = () => {
		assertCurrent();
		if (owner.uncertain || owner.pending) throw new AuthProfileAuthorizationError("unavailable");
	};
	return {
		assertSettled,
		assertAuthorization(authorizationId) {
			assertSettled();
			if (owner.fact.authorizationId !== authorizationId || owner.fact.expiresAt !== void 0 && owner.fact.expiresAt <= Date.now()) throw new AuthProfileAuthorizationError("retired");
		},
		prepareRead() {
			assertSettled();
			const revision = owner.revision;
			return (fact) => {
				assertSettled();
				if (owner.revision !== revision) throw new AuthProfileAuthorizationError("unavailable");
				if (owner.fact.authorizationId !== fact.authorizationId || owner.fact.expiresAt !== fact.expiresAt) {
					owner.revision = {};
					owner.fact = fact;
				}
			};
		},
		/** Called synchronously before the native lease owner can grant COMMIT. */
		fence() {
			assertCurrent();
			owner.revision = {};
			owner.pending++;
			let settled = false;
			return (known, fact) => {
				if (settled) return;
				settled = true;
				if (!known) owner.uncertain = true;
				else if (fact) owner.fact = fact;
				owner.revision = {};
				owner.pending--;
			};
		},
		release() {
			if (released) return;
			released = true;
			owner.references--;
			if (!owner.references && !owner.pending && !owner.uncertain && databases.get(databaseKey)?.get(storeKey) === owner) {
				stores.delete(storeKey);
				if (!stores.size) databases.delete(databaseKey);
			}
		}
	};
}
//#endregion
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
function readExisting(context, command) {
	return executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, command, { context });
}
/** Read canonical state, opening the writable lifecycle when runtime owns it. */
async function readMcpOAuthStore(storeKey, context = captureOpenClawStateWorkerContext()) {
	return executeOpenClawStateWorker(context, {
		type: "mcpOAuth.read",
		input: storeKey
	});
}
/** Read status state without creating or repairing the shared database. */
async function readMcpOAuthStoreReadOnly(storeKey, context = captureOpenClawStateWorkerContext()) {
	const result = await readExisting(context, {
		type: "mcpOAuth.readOnly",
		input: storeKey
	});
	if (result === void 0) return {};
	if (result.ok && result.type === "mcpOAuth.readOnly") return result.value;
	throw new Error("Unexpected MCP OAuth store read result");
}
async function readMcpOAuthStoreStatuses(storeKeys, context = captureOpenClawStateWorkerContext()) {
	if (storeKeys.length === 0) return [];
	const result = await readExisting(context, {
		type: "mcpOAuth.statuses",
		input: storeKeys
	});
	if (result === void 0) return storeKeys.map(() => projectMcpOAuthCredentialsStatus({}));
	if (result.ok && result.type === "mcpOAuth.statuses") return result.value;
	throw new Error("Unexpected MCP OAuth status batch result");
}
/** List canonical store keys matching one server/principal prefix without creating state. */
async function listMcpOAuthStoreKeysByPrefix(prefix, context = captureOpenClawStateWorkerContext()) {
	const result = await readExisting(context, {
		type: "mcpOAuth.keys",
		input: prefix
	});
	if (result === void 0) return [];
	if (result.ok && result.type === "mcpOAuth.keys") return result.value;
	throw new Error("Unexpected MCP OAuth keys read result");
}
async function countMcpOAuthStorePrincipals(prefix) {
	const result = await readExisting(captureOpenClawStateWorkerContext(), {
		type: "mcpOAuth.countPrincipals",
		input: prefix
	});
	if (result === void 0) return 0;
	if (result.ok && result.type === "mcpOAuth.countPrincipals") return result.value;
	throw new Error("Unexpected MCP OAuth principal count result");
}
/** Resolve one unexpired callback state without creating state or scanning credential JSON. */
async function readMcpOAuthPendingAuthorization(state, context = captureOpenClawStateWorkerContext()) {
	const result = await readExisting(context, {
		type: "mcpOAuth.pending",
		input: state
	});
	if (result === void 0) return;
	if (result.ok && result.type === "mcpOAuth.pending") return result.value;
	throw new Error("Unexpected MCP OAuth pending state read result");
}
/** Apply a bounded mutation under its original live store lease. */
function mutateMcpOAuthStore({ storeKey, lease, context }, mutation, authority) {
	const captured = structuredClone(mutation);
	return runMcpOAuthCredentialWrite({
		storeKey,
		lease,
		context
	}, (scope, identity) => scope.execute({
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
	return runMcpOAuthCredentialWrite({
		storeKey,
		lease,
		context
	}, (scope, identity) => scope.execute({
		type: "mcpOAuth.clear",
		input: {
			storeKey,
			identity
		}
	}, { signal: lease.signal }));
}
/** The lease owns admission; the credential owner fences and publishes its authorization fact. */
async function runMcpOAuthCredentialWrite({ storeKey, lease, context }, operation, authority) {
	let owner;
	let settle;
	let publicationSettled;
	const beforeCommit = authority?.beforeCommit;
	try {
		return await withOpenClawStateLeaseWorkerAdmission(lease, context.admission.databasePath, (leaseScope) => runOpenClawStateWorkerOperation(context, (scope) => operation(scope, leaseScope.identity), {
			assertCurrent: leaseScope.assertCurrent,
			createAdmission(retained) {
				const binding = leaseScope.createAdmission(retained);
				publicationSettled = retained.settled.then((outcome) => {
					if (!settle) return;
					let known = false;
					try {
						const receipt = binding.admission.committed?.facts;
						if (receipt !== void 0 && (!isMcpOAuthAuthorizationReceipt(receipt) || receipt.storeKey !== storeKey)) throw new Error("MCP OAuth mutation returned an invalid commit receipt");
						known = outcome.kind !== "unknown";
						settle(known, receipt?.authorization);
					} finally {
						settle(known);
					}
				});
				publicationSettled.catch(() => void 0);
				return binding;
			}
		}), {
			...authority,
			assertCurrent: authority?.assertCurrent ?? (() => {}),
			beforeCommit() {
				beforeCommit?.();
				owner = retainMcpOAuthAuthorizationState(context.admission, storeKey);
				settle = owner.fence();
			}
		});
	} finally {
		try {
			await publicationSettled;
		} finally {
			owner?.release();
		}
	}
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
export { deleteMcpOAuthPendingAuthorizationsByPrefix as a, readMcpOAuthPendingAuthorization as c, readMcpOAuthStoreStatuses as d, writeMcpOAuthPendingAuthorization as f, deleteMcpOAuthPendingAuthorization as i, readMcpOAuthStore as l, retainMcpOAuthAuthorizationState as m, consumeOAuthState as n, listMcpOAuthStoreKeysByPrefix as o, projectMcpOAuthCredentialsStatus as p, countMcpOAuthStorePrincipals as r, mutateMcpOAuthStore as s, clearMcpOAuthStore as t, readMcpOAuthStoreReadOnly as u };
