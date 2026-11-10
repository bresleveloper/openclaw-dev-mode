import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { y as registerRuntimeConfigWriteListener } from "./runtime-snapshot-BBYDJbw9.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { O as withAgentRosterFactsBatch, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as captureUserProfileAuthorityRead } from "./user-profile-events-CXjmX5Qy.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B69mLcu_.mjs";
import { a as matchesAgentLifecycleBinding, i as captureAgentLifecycleBinding, o as matchesAgentLifecycleBindingAsync } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { o as publishSecretStoreChange, s as subscribeSecretStoreChanges } from "./secret-store-hidden-github-BnB_SZXU.mjs";
import { r as clearNativeGitHubTokenCache } from "./github-read-identity-BB6UxasN.mjs";
import { A as readGitHubDeviceAuthorizationRecord, C as deleteGitHubOAuthRecord, D as listGitHubDeviceAuthorizationRecords, E as inspectGitHubOAuthRecord, F as refreshGitHubOAuthToken, I as requestGitHubOAuthDeviceCode, M as writeGitHubOAuthRecord, N as clearGitHubCredentialVerificationCache, O as listGitHubOAuthRecords, P as pollGitHubOAuthDeviceToken, S as deleteGitHubDeviceAuthorizationRecord, T as githubOAuthRecordName, d as removeManagedGitHubProfile, f as resolveConfiguredGitHubToolIdentity, g as resolveManagedGitHubProfileRoot, h as resolveManagedGitHubProfileDir, j as writeGitHubDeviceAuthorizationRecord, k as parseGitHubDeviceAuthorizationRecord, l as preparePersonalGitHubPublicationIdentity, n as createManagedGitHubProfileId, p as resolveGitHubToolIdentityStatus, r as installManagedGitHubProfile, t as GitHubAccountMismatchError, u as refreshManagedGitHubProfile, w as githubDeviceRecordName, x as createGitHubOAuthRecord } from "./github-tool-identity-BEdbceu6.mjs";
import { i as readHiddenGitHubSecretInDatabase, n as deleteHiddenGitHubSecretInDatabase } from "./secret-store-hidden-github.kernel-oq1fy2PW.mjs";
import { r as assertGitHubCliAvailable, t as updateGitHubToolIdentityConfig } from "./github-tool-identity-config-fur8LsB3.mjs";
import { i as publishUserGitHubConnectionCommit, n as observeUserGitHubConnectionAuthority, r as observeUserGitHubProfileRetirement, t as invalidateUserGitHubConnectionAuthority } from "./user-github-connection-events-CptgDKbj.mjs";
import { a as parseUserGitHubConnection, n as disconnectUserGitHubConnectionInDatabase, t as cancelUserGitHubAuthorizationInDatabase, u as isUserGitHubConnectionCommit } from "./user-github-connections.kernel-BAl3kDQK.mjs";
import { randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/github-oauth-records.native.ts
/** Retained only for the deprecated synchronous Gateway Plugin SDK service. */
function readGitHubDeviceAuthorizationRecordNative(requestId) {
	const name = githubDeviceRecordName(requestId);
	const raw = withExistingOpenClawStateDatabaseReadOnly(({ db }) => readHiddenGitHubSecretInDatabase(db, name, Date.now()));
	if (raw !== void 0) registerSecretValueForRedaction(raw);
	return parseGitHubDeviceAuthorizationRecord(raw, requestId);
}
function remove(name) {
	try {
		runOpenClawStateWriteTransaction(({ db }) => deleteHiddenGitHubSecretInDatabase(db, name), void 0, { operationLabel: "secrets.store.delete-hidden-github" });
	} finally {
		publishSecretStoreChange(resolveOpenClawStateSqlitePath(), [name]);
	}
}
/** Retained only for the deprecated synchronous Gateway Plugin SDK service. */
function deleteGitHubDeviceAuthorizationRecordNative(requestId) {
	remove(githubDeviceRecordName(requestId));
}
/** Retained only for the deprecated synchronous Gateway Plugin SDK service. */
function deleteGitHubOAuthRecordNative(profileId) {
	remove(githubOAuthRecordName(profileId));
}
//#endregion
//#region src/gateway/github-oauth-device-flow.ts
/** Transport and scheduling are shared; the caller owns identity, TTL/CAS, and installation. */
async function startGitHubDeviceFlow(signal) {
	const startedAt = Date.now();
	const authorization = await requestGitHubOAuthDeviceCode({ signal });
	if (authorization.expiresInSeconds > 900 || authorization.intervalSeconds > 60) throw new Error("GitHub device authorization timing is outside the supported bounds.");
	const pollIntervalMs = authorization.intervalSeconds * 1e3;
	return {
		deviceCode: authorization.deviceCode,
		userCode: authorization.userCode,
		verificationUri: authorization.verificationUri,
		createdAtMs: startedAt,
		expiresAtMs: startedAt + authorization.expiresInSeconds * 1e3,
		pollIntervalMs,
		nextPollAtMs: startedAt + pollIntervalMs
	};
}
async function pollGitHubDeviceFlow(record, signal) {
	const now = Date.now();
	if (record.expiresAtMs <= now) return {
		kind: "terminal",
		result: { status: "expired" }
	};
	if (now < record.nextPollAtMs) return {
		kind: "waiting",
		result: {
			status: "pending",
			retryAfterMs: record.nextPollAtMs - now
		},
		pollIntervalMs: record.pollIntervalMs,
		nextPollAtMs: record.nextPollAtMs
	};
	let result;
	try {
		result = await pollGitHubOAuthDeviceToken({
			deviceCode: record.deviceCode,
			signal
		});
	} catch {
		const nextPollAtMs = Math.min(record.expiresAtMs, Date.now() + record.pollIntervalMs);
		return {
			kind: "waiting",
			result: {
				status: "network_error",
				retryAfterMs: Math.max(1, nextPollAtMs - Date.now())
			},
			pollIntervalMs: record.pollIntervalMs,
			nextPollAtMs
		};
	}
	if (result.status === "authorized") return {
		kind: "authorized",
		tokens: result.tokens
	};
	if (result.status === "authorization_pending" || result.status === "slow_down") {
		const pollIntervalMs = result.status === "slow_down" ? Math.min(6e4, Math.max(record.pollIntervalMs + 5e3, (result.intervalSeconds ?? 0) * 1e3)) : record.pollIntervalMs;
		const nextPollAtMs = Math.min(record.expiresAtMs, Date.now() + pollIntervalMs);
		return {
			kind: "waiting",
			pollIntervalMs,
			nextPollAtMs,
			result: {
				status: result.status === "slow_down" ? "slow_down" : "pending",
				retryAfterMs: Math.max(1, nextPollAtMs - Date.now())
			}
		};
	}
	if (result.status === "access_denied") return {
		kind: "terminal",
		result: { status: "access_denied" }
	};
	if (result.status === "expired_token") return {
		kind: "terminal",
		result: { status: "expired" }
	};
	return {
		kind: "terminal",
		result: result.code === "incorrect_device_code" || result.code === "bad_verification_code" ? { status: "incorrect_device_code" } : {
			status: "failed",
			reason: "setup_failed"
		}
	};
}
//#endregion
//#region src/gateway/github-oauth-lifecycle-helpers.ts
const REFRESH_SKEW_MS = 6e5;
const MAINTENANCE_INTERVAL_MS = 6e4;
const SHUTDOWN_DRAIN_TIMEOUT_MS = 31e3;
function createGitHubOAuthInventoryReader(onChange) {
	let dirty = true;
	let databasePath;
	let snapshot;
	const invalidate = () => {
		dirty = true;
		onChange();
	};
	const unsubscribe = subscribeSecretStoreChanges((change) => {
		if (change.githubOAuth && change.databasePath === resolveOpenClawStateSqlitePath()) invalidate();
	});
	const unregisterResource = registerOpenClawStateDatabaseAsyncResource({ async close() {
		snapshot = void 0;
		invalidate();
	} });
	const unsubscribeLifecycle = registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened" && event.path === resolveOpenClawStateSqlitePath()) {
			snapshot = void 0;
			invalidate();
		}
	});
	return {
		async read() {
			const path = resolveOpenClawStateSqlitePath();
			if (snapshot && !dirty && databasePath === path) return snapshot;
			databasePath = path;
			dirty = false;
			try {
				snapshot = {
					deviceRecords: await listGitHubDeviceAuthorizationRecords(),
					oauthRecords: await listGitHubOAuthRecords()
				};
				return snapshot;
			} catch (error) {
				dirty = true;
				throw error;
			}
		},
		get dirty() {
			return dirty;
		},
		close() {
			unsubscribe();
			unsubscribeLifecycle();
			unregisterResource();
			snapshot = void 0;
		}
	};
}
function identityStillSelected(config, location, expected) {
	const current = resolveConfiguredGitHubToolIdentity({
		config,
		...location
	});
	return isDeepStrictEqual(current ?? null, expected);
}
function authorizationStillOwned(config, record) {
	return identityStillSelected(config, record, record.expectedIdentity) && (record.scope === "system" || record.agentLifecycleBinding !== void 0 && matchesAgentLifecycleBinding(config, record.agentLifecycleBinding));
}
async function authorizationStillOwnedAsync(getConfig, record) {
	if (record.scope !== "system" && (!record.agentLifecycleBinding || !await matchesAgentLifecycleBindingAsync(getConfig, record.agentLifecycleBinding))) return false;
	return identityStillSelected(getConfig(), record, record.expectedIdentity);
}
function configuredOAuthIdentities(config) {
	return withAgentRosterFactsBatch(config, () => {
		const identities = [];
		const system = config.tools?.github;
		if (system?.kind === "oauth") identities.push({
			scope: "system",
			agentId: "system",
			identity: {
				...system,
				kind: "oauth"
			}
		});
		for (const agentId of listAgentIds(config).toSorted()) {
			const identity = resolveAgentConfig(config, agentId)?.tools?.github;
			if (identity?.kind === "oauth") identities.push({
				scope: "agent",
				agentId,
				identity: {
					...identity,
					kind: "oauth"
				}
			});
		}
		return identities;
	});
}
function nextGitHubOAuthMaintenanceAtMs(inventory, now) {
	const retryAtMs = now + MAINTENANCE_INTERVAL_MS;
	let next = Number.POSITIVE_INFINITY;
	for (const { record } of inventory.deviceRecords) if (record) next = Math.min(next, record.expiresAtMs > now ? record.expiresAtMs : retryAtMs);
	for (const { record } of inventory.oauthRecords) {
		if (!record) continue;
		if (record.pendingInitial || record.pendingRefresh || record.refreshFailure === "failed") next = Math.min(next, retryAtMs);
		else if (record.refreshFailure !== "expired" && record.refreshExpiresAtMs > now) next = Math.min(next, Math.max(retryAtMs, record.accessExpiresAtMs - REFRESH_SKEW_MS));
	}
	return next;
}
async function assertInitialOAuthRecordCurrent(getConfig, expected, runtimeConfig, runtimeConfigValue) {
	const current = await inspectGitHubOAuthRecord(expected.profileId);
	if (getConfig() !== runtimeConfig || !isDeepStrictEqual(runtimeConfig, runtimeConfigValue) || current.state !== "valid" || !isDeepStrictEqual(current.record, expected)) throw new Error("GitHub OAuth initial reconciliation was superseded.");
}
async function pendingInitialOAuthIdentitySelected(config, record) {
	const identity = resolveConfiguredGitHubToolIdentity({
		config,
		...record
	});
	const binding = record.pendingInitial?.agentLifecycleBinding;
	return (record.scope === "system" || binding !== void 0 && await matchesAgentLifecycleBindingAsync(() => config, binding)) && identity?.profileId === record.profileId && identity.kind === "oauth";
}
//#endregion
//#region src/state/user-github-connections.ts
var UserGitHubConnectionAuthorityChangedError = class extends Error {
	constructor() {
		super("My GitHub connection changed; reload its status.");
	}
};
/** Native adapter for the released synchronous personal OAuth service contract. */
function cancelUserGitHubAuthorizationSync(owner, requestId, assertCurrent) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		return Boolean(cancelUserGitHubAuthorizationInDatabase(db, owner, requestId));
	}, void 0, { operationLabel: "users.github.cancel" });
}
/** Native adapter for the released synchronous personal OAuth service contract. */
function disconnectUserGitHubConnectionSync(owner, assertCurrent) {
	runOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		disconnectUserGitHubConnectionInDatabase(db, owner);
	}, void 0, { operationLabel: "users.github.disconnect" });
}
async function readUserGitHubConnectionAsync(owner) {
	return (await prepareUserGitHubConnection(owner)).read();
}
async function readCanonicalUserGitHubConnectionAsync(profile) {
	const context = captureOpenClawStateReadWorkerContext();
	return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "userGitHubConnections.readCanonical",
		input: { profile }
	}), { existingOnly: true });
}
const connectionReads = /* @__PURE__ */ new Map();
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind === "opened") return;
	for (const [key, entry] of connectionReads) if (entry.databasePath === event.path) {
		entry.valid = false;
		connectionReads.delete(key);
	}
});
observeUserGitHubConnectionAuthority(({ databasePath, changedOwners }) => {
	for (const [key, entry] of connectionReads) if (entry.databasePath === databasePath && changedOwners.includes(entry.owner)) {
		entry.valid = false;
		connectionReads.delete(key);
	}
});
/** Retained effect guards consume the same worker snapshot until its owner publishes a write. */
async function prepareUserGitHubConnection(owner) {
	const context = captureOpenClawStateReadWorkerContext();
	const key = JSON.stringify([context.admission.identity.key, owner]);
	const existing = connectionReads.get(key);
	if (existing) {
		const prepared = await existing.prepared;
		try {
			prepared.read();
			return prepared;
		} catch {
			existing.valid = false;
			connectionReads.delete(key);
		}
	}
	const entry = {
		databasePath: context.admission.databasePath,
		owner,
		valid: true,
		prepared: Promise.resolve({ read: () => void 0 })
	};
	connectionReads.set(key, entry);
	entry.prepared = (async () => {
		const authority = await captureUserProfileAuthorityRead(context.admission);
		const connection = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "userGitHubConnections.read",
			input: { owner }
		}), { existingOnly: true });
		const profileIsCurrent = authority.bind(owner);
		const parsed = connection ? parseUserGitHubConnection(JSON.stringify(connection)) : void 0;
		const read = () => {
			context.admission.assertCurrent();
			if (!entry.valid || !profileIsCurrent?.()) throw new UserGitHubConnectionAuthorityChangedError();
			return parsed ? structuredClone(parsed) : void 0;
		};
		read();
		return { read };
	})();
	try {
		return await entry.prepared;
	} catch (error) {
		if (connectionReads.get(key) === entry) connectionReads.delete(key);
		throw error;
	}
}
async function listUserGitHubConnectionsAsync() {
	const context = captureOpenClawStateReadWorkerContext();
	const connections = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "userGitHubConnections.list",
		input: void 0
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return (connections ?? []).map(({ owner, connection }) => ({
		owner,
		connection: parseUserGitHubConnection(JSON.stringify(connection))
	}));
}
async function write(type, input, assertCurrent) {
	const context = captureOpenClawStateWorkerContext();
	const captured = structuredClone(input);
	const affectedOwners = /* @__PURE__ */ new Set([captured.owner]);
	try {
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type,
			input: captured
		}), {
			assertCurrent,
			createAdmission: () => {
				const admission = createSqliteWorkerOperationAdmission((_request, grant) => {
					context.admission.assertCurrent();
					assertCurrent();
					if (_request.stage === "commit") {
						if (!isUserGitHubConnectionCommit(_request.facts)) throw new Error("Personal GitHub connection returned invalid commit facts");
						for (const owner of _request.facts.changedOwners) affectedOwners.add(owner);
					}
					grant();
				});
				observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
					if (!isUserGitHubConnectionCommit(facts)) throw new Error("Personal GitHub connection returned an invalid commit receipt");
					publishUserGitHubConnectionCommit(context.admission.databasePath, facts);
				});
				return {
					admission,
					nativeLocations: [context.admission.databasePath]
				};
			}
		});
	} catch (error) {
		invalidateUserGitHubConnectionAuthority(context.admission.databasePath, [...affectedOwners]);
		throw error;
	}
}
async function mutateUserGitHubConnection(owner, mutation, assertCurrent) {
	const connection = await write("userGitHubConnections.mutate", {
		owner,
		mutation
	}, assertCurrent);
	return connection ? parseUserGitHubConnection(JSON.stringify(connection)) : void 0;
}
/** An exact remote rotation follows profile transfer; its receipt grants no external authority. */
async function updateUserGitHubRefreshAsync(input, assertCurrent) {
	return await write("userGitHubConnections.refresh", input, assertCurrent);
}
//#endregion
//#region src/gateway/github-personal-status.ts
function projectPending(pending) {
	return {
		requestId: pending.requestId,
		userCode: pending.userCode,
		verificationUri: pending.verificationUri,
		expiresInMs: Math.max(0, pending.expiresAtMs - Date.now()),
		pollAfterMs: Math.max(1, Math.min(6e4, pending.nextPollAtMs - Date.now()))
	};
}
const statusAuthorities = /* @__PURE__ */ new WeakMap();
function unavailablePersonalGitHubStatus() {
	return {
		state: "unavailable",
		generation: null,
		account: null,
		accessExpiresAtMs: null,
		refreshState: "failed",
		pending: null
	};
}
async function personalGitHubStatusAsync(action) {
	action.assertCurrent();
	try {
		const prepared = await prepareUserGitHubConnection(action.owner);
		action.assertCurrent();
		const status = projectPersonalGitHubStatus(prepared.read());
		statusAuthorities.set(status, prepared.read);
		return status;
	} catch {
		action.assertCurrent();
		return unavailablePersonalGitHubStatus();
	}
}
function projectPersonalGitHubStatus(record) {
	const selection = record?.selection;
	const connected = selection?.kind === "connected" ? selection : void 0;
	return {
		state: connected ? "connected" : "disconnected",
		generation: record?.generation ?? null,
		account: connected ? {
			accountId: connected.accountId,
			login: connected.login
		} : null,
		accessExpiresAtMs: connected?.accessExpiresAtMs ?? null,
		refreshState: !connected ? "not_applicable" : connected.refresh ? "refreshing" : connected.refreshFailure ?? (connected.refreshExpiresAtMs <= Date.now() ? "expired" : "available"),
		pending: record?.pending?.kind === "device" && record.pending.expiresAtMs > Date.now() ? projectPending(record.pending) : null
	};
}
function revalidatePersonalGitHubStatus(action, prepared) {
	action.assertCurrent();
	statusAuthorities.get(prepared)?.();
	return prepared;
}
async function resolvePersonalGitHubStatus(action) {
	action.assertCurrent();
	let prepared;
	try {
		prepared = await prepareUserGitHubConnection(action.owner);
	} catch {
		action.assertCurrent();
		return unavailablePersonalGitHubStatus();
	}
	action.assertCurrent();
	const record = prepared.read();
	const status = projectPersonalGitHubStatus(record);
	statusAuthorities.set(status, prepared.read);
	if (record?.selection.kind !== "connected") return status;
	const assertCurrent = () => {
		revalidatePersonalGitHubStatus(action, status);
	};
	try {
		const identity = await preparePersonalGitHubPublicationIdentity({
			profileId: record.selection.profileId,
			accountId: record.selection.accountId,
			assertCurrent,
			forDisplay: true
		});
		const result = {
			...revalidatePersonalGitHubStatus(action, status),
			...identity.stale ? { stale: true } : {}
		};
		statusAuthorities.set(result, prepared.read);
		return result;
	} catch {
		const result = {
			...revalidatePersonalGitHubStatus(action, status),
			state: "unavailable"
		};
		statusAuthorities.set(result, prepared.read);
		return result;
	}
}
//#endregion
//#region src/gateway/github-publication-deprecation.ts
const replacements = {
	confirmPersonal: "confirmPersonalV2",
	deferClaimPreparation: "deferClaimPreparationAsync",
	deferOrphanedRequests: "deferOrphanedRequestsAsync",
	listUnreportedResults: "listUnreportedResultsAsync",
	markReported: "markReportedAsync",
	"personal.cancelAuthorization": "personal.cancelAuthorizationAsync",
	"personal.disconnect": "personal.disconnectAsync",
	personalStatus: "personalStatusAsync",
	requestForClaim: "requestForClaimV2",
	requestForSession: "requestForSessionV2",
	requestPersonalForSession: "requestPersonalForSessionV2"
};
/** Keep the shared publication compatibility family and replacement pairs in one place. */
function warnGitHubPublicationDeprecation(method) {
	warnPluginSdkDeprecation({
		family: "github-publication",
		method,
		replacement: replacements[method]
	});
}
//#endregion
//#region src/gateway/github-personal-oauth.ts
const profileDir = (profileId) => resolveManagedGitHubProfileDir({
	agentId: "",
	scope: "personal",
	profileId
});
const withProfileLease = (profileId, run) => withOpenClawStateLease({
	scope: "personal-github-profile",
	key: profileId,
	database: { scope: "shared" },
	leaseMs: 6e4,
	waitMs: 3e4
}, async (lease) => await run(() => lease.assertOwned()));
function requirePending(record, generation, requestId) {
	if (!record?.pending || record.generation !== generation || record.pending.requestId !== requestId || record.pending.expiresAtMs <= Date.now()) throw new Error("My GitHub authorization changed or expired; start again.");
	return {
		...record,
		pending: record.pending
	};
}
function needsRefresh(selection) {
	return Boolean(selection.refresh?.tokens) || selection.refreshFailure !== "expired" && selection.refreshExpiresAtMs > Date.now() && (Boolean(selection.refresh) || selection.accessExpiresAtMs <= Date.now() + 6e5);
}
/** Personal adapters share device transport and profile materialization with System/agent OAuth. */
function createPersonalGitHubOAuthLifecycle() {
	const abort = new AbortController();
	const polls = /* @__PURE__ */ new Map();
	const refreshes = /* @__PURE__ */ new Map();
	const rotated = /* @__PURE__ */ new Map();
	const writes = /* @__PURE__ */ new Set();
	const retainWrite = (work) => {
		writes.add(work);
		work.then(() => writes.delete(work), () => writes.delete(work));
		return work;
	};
	const mutateUserGitHubConnection$1 = (...args) => retainWrite(mutateUserGitHubConnection(...args));
	const updateUserGitHubRefreshAsync$1 = (...args) => retainWrite(updateUserGitHubRefreshAsync(...args));
	const retirements = /* @__PURE__ */ new Set();
	const cleanups = /* @__PURE__ */ new Map();
	let stopped = false;
	let inspectedProfiles = false;
	let connectionScan;
	const unobserveConnections = observeUserGitHubConnectionAuthority(({ databasePath }) => {
		if (connectionScan?.databasePath === databasePath) connectionScan.current = false;
	});
	const profileIsReferenced = async (id) => (await listUserGitHubConnectionsAsync()).some(({ connection }) => connection.selection.kind === "connected" && connection.selection.profileId === id || connection.pending?.kind === "device" && connection.pending.candidate?.profileId === id);
	const assertRunning = () => {
		if (stopped) throw new Error("GitHub authorization is stopping.");
	};
	const retire = async (id) => {
		await getOrCreatePromise(cleanups, id, () => withProfileLease(id, async (assertOwned) => {
			assertOwned();
			if (await profileIsReferenced(id)) return;
			assertOwned();
			await removeManagedGitHubProfile(profileDir(id));
		}).then(() => {
			retirements.delete(id);
		}, () => {
			retirements.add(id);
		}), { evictOnSettled: true });
	};
	const unobserve = observeUserGitHubProfileRetirement((ids) => {
		for (const id of ids) {
			retirements.add(id);
			retire(id);
		}
	});
	const guard = (action) => {
		assertRunning();
		action.assertCurrent();
	};
	const install = async (action, generation, pending) => {
		const candidate = pending.candidate;
		if (!candidate) throw new Error("My GitHub authorization has no candidate.");
		try {
			const prepared = await prepareUserGitHubConnection(action.owner);
			const assertCurrent = () => {
				guard(action);
				const record = requirePending(prepared.read(), generation, pending.requestId);
				if (record.pending.kind !== "device" || record.pending.candidate?.profileId !== candidate.profileId) throw new Error("My GitHub authorization changed.");
			};
			await withProfileLease(candidate.profileId, async (assertOwned) => {
				const assertInstall = () => {
					assertOwned();
					assertCurrent();
				};
				assertInstall();
				await removeManagedGitHubProfile(profileDir(candidate.profileId));
				assertInstall();
				await installManagedGitHubProfile({
					profileDir: profileDir(candidate.profileId),
					token: candidate.tokens.accessToken,
					assertCurrent: assertInstall,
					commitConfig: async (account) => {
						await mutateUserGitHubConnection$1(action.owner, {
							kind: "connect",
							generation,
							requestId: pending.requestId,
							profileId: candidate.profileId,
							accountId: account.accountId,
							login: account.login
						}, () => {
							assertOwned();
							guard(action);
						});
					}
				});
			});
			guard(action);
			return {
				status: "success",
				personal: await personalGitHubStatusAsync(action)
			};
		} catch {
			guard(action);
			return {
				status: "failed",
				reason: "setup_failed"
			};
		}
	};
	const pollOnce = async (action, initial, requestId) => {
		const pending = initial.pending;
		if (!pending || pending.requestId !== requestId || pending.expiresAtMs <= Date.now()) return { status: "expired" };
		if (pending.kind === "starting") return {
			status: "pending",
			retryAfterMs: 1e3
		};
		if (pending.candidate) return await install(action, initial.generation, pending);
		const polled = await pollGitHubDeviceFlow(pending, abort.signal);
		guard(action);
		let next;
		try {
			const connection = await mutateUserGitHubConnection$1(action.owner, {
				kind: "poll",
				generation: initial.generation,
				requestId,
				deviceCode: pending.deviceCode,
				result: polled.kind === "terminal" ? { kind: "terminal" } : polled.kind === "authorized" ? {
					kind: "candidate",
					candidate: {
						receivedAtMs: Date.now(),
						profileId: createManagedGitHubProfileId(),
						tokens: polled.tokens
					}
				} : {
					kind: "pending",
					pollIntervalMs: polled.pollIntervalMs,
					nextPollAtMs: polled.nextPollAtMs
				}
			}, () => guard(action));
			if (!connection) throw new Error("My GitHub authorization changed.");
			next = connection;
		} catch {
			guard(action);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		if (polled.kind !== "authorized") return polled.result;
		if (next.pending?.kind !== "device") throw new Error("My GitHub authorization changed.");
		return await install(action, next.generation, next.pending);
	};
	const persistRotation = (pending) => updateUserGitHubRefreshAsync$1({
		owner: pending.owner,
		profileId: pending.profileId,
		operationId: pending.operationId,
		result: {
			kind: "rotated",
			tokens: pending.tokens,
			receivedAtMs: pending.receivedAtMs
		}
	}, () => {});
	const materializeRefresh = async (owner, id, operationId, assertOwned) => {
		const canonical = await readCanonicalUserGitHubConnectionAsync(owner);
		if (!canonical) throw new Error("My GitHub refresh ownership changed.");
		const prepared = await prepareUserGitHubConnection(canonical.owner);
		const readExact = () => {
			assertOwned();
			const selection = prepared.read()?.selection;
			if (selection?.kind !== "connected" || selection.profileId !== id || selection.refresh?.operationId !== operationId || !selection.refresh.tokens) throw new Error("My GitHub refresh ownership changed.");
			return selection;
		};
		const current = readExact();
		const account = await refreshManagedGitHubProfile({
			profileDir: profileDir(id),
			token: current.refresh.tokens.accessToken,
			expectedAccountId: current.accountId,
			assertCurrent: () => {
				readExact();
			}
		});
		assertOwned();
		await updateUserGitHubRefreshAsync$1({
			owner,
			profileId: id,
			operationId,
			result: {
				kind: "materialized",
				login: account.login
			}
		}, assertOwned);
	};
	const refresh = async (owner) => {
		assertRunning();
		const initial = (await readUserGitHubConnectionAsync(owner))?.selection;
		assertRunning();
		if (initial?.kind !== "connected") return;
		const id = initial.profileId;
		if (!rotated.has(id) && !needsRefresh(initial)) return;
		await getOrCreatePromise(refreshes, id, () => withProfileLease(id, async (assertOwned) => {
			const memory = rotated.get(id);
			if (memory) {
				if (!await persistRotation(memory)) {
					rotated.delete(id);
					return;
				}
				rotated.delete(id);
			}
			const record = await readUserGitHubConnectionAsync(owner);
			const selection = record?.selection;
			if (!record || selection?.kind !== "connected" || selection.profileId !== id || !needsRefresh(selection)) return;
			if (selection.refresh?.tokens) {
				await materializeRefresh(owner, id, selection.refresh.operationId, assertOwned);
				return;
			}
			const operationId = selection.refresh?.operationId ?? randomUUID();
			await mutateUserGitHubConnection$1(owner, {
				kind: "beginRefresh",
				generation: record.generation,
				profileId: id,
				operationId
			}, assertOwned);
			assertOwned();
			let result;
			try {
				result = await refreshGitHubOAuthToken({ refreshToken: selection.refreshToken });
			} catch {
				await updateUserGitHubRefreshAsync$1({
					owner,
					profileId: id,
					operationId,
					result: {
						kind: "failed",
						failure: "failed"
					}
				}, assertOwned);
				return;
			}
			if (result.status === "error") {
				await updateUserGitHubRefreshAsync$1({
					owner,
					profileId: id,
					operationId,
					result: {
						kind: "failed",
						failure: result.code === "bad_refresh_token" ? "expired" : "failed"
					}
				}, assertOwned);
				return;
			}
			const pending = {
				owner,
				profileId: id,
				operationId,
				tokens: result.tokens,
				receivedAtMs: Date.now()
			};
			rotated.set(id, pending);
			if (!await persistRotation(pending)) {
				rotated.delete(id);
				return;
			}
			rotated.delete(id);
			await materializeRefresh(owner, id, operationId, assertOwned);
		}), { evictOnSettled: true });
	};
	let maintenance;
	const runMaintenance = async () => {
		if (!inspectedProfiles) {
			const root = resolveManagedGitHubProfileRoot({
				agentId: "",
				scope: "personal"
			});
			const entries = await fs.readdir(root, { withFileTypes: true }).catch((error) => {
				if (hasErrnoCode(error, "ENOENT")) return [];
				throw error;
			});
			for (const entry of entries) if (entry.isDirectory() && /^ghp_[a-f0-9]{32}$/u.test(entry.name) && !await profileIsReferenced(entry.name)) retirements.add(entry.name);
			inspectedProfiles = true;
		}
		for (const pending of rotated.values()) try {
			await persistRotation(pending);
			rotated.delete(pending.profileId);
		} catch {}
		for (const id of retirements) await retire(id);
		const databasePath = resolveOpenClawStateSqlitePath();
		if (connectionScan?.databasePath === databasePath && connectionScan.current && connectionScan.empty) return;
		const scan = {
			databasePath,
			current: true,
			empty: false
		};
		connectionScan = scan;
		const connections = await listUserGitHubConnectionsAsync();
		scan.empty = connections.length === 0;
		for (const { owner, connection } of connections) {
			if (stopped) break;
			if (connection.pending && connection.pending.expiresAtMs <= Date.now()) await mutateUserGitHubConnection$1(owner, {
				kind: "expire",
				nowMs: Date.now()
			}, assertRunning);
			try {
				await refresh(owner);
			} catch {}
		}
	};
	return {
		status: resolvePersonalGitHubStatus,
		revalidateStatus: revalidatePersonalGitHubStatus,
		async startAuthorization(action) {
			guard(action);
			assertGitHubCliAvailable();
			const requestId = randomUUID();
			const createdAtMs = Date.now();
			const initial = await mutateUserGitHubConnection$1(action.owner, {
				kind: "start",
				requestId,
				createdAtMs,
				expiresAtMs: createdAtMs + 9e5
			}, () => guard(action));
			if (!initial) throw new Error("My GitHub authorization changed.");
			guard(action);
			const authorization = await startGitHubDeviceFlow(abort.signal);
			guard(action);
			if (authorization.expiresAtMs <= Date.now()) throw new Error("My GitHub authorization expired while starting; start again.");
			const next = await mutateUserGitHubConnection$1(action.owner, {
				kind: "device",
				generation: initial.generation,
				requestId,
				device: {
					...authorization,
					kind: "device",
					requestId
				}
			}, () => guard(action));
			if (next?.pending?.kind !== "device") throw new Error("My GitHub authorization changed.");
			return projectPending(next.pending);
		},
		async pollAuthorization(action, requestId) {
			guard(action);
			const current = await readUserGitHubConnectionAsync(action.owner);
			guard(action);
			if (current?.pending?.requestId !== requestId) return { status: "expired" };
			const key = `${action.owner}\0${requestId}`;
			const result = await getOrCreatePromise(polls, key, () => pollOnce(action, current, requestId), { evictOnSettled: true });
			guard(action);
			return result;
		},
		/** @deprecated Use cancelAuthorizationAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		cancelAuthorization(action, requestId) {
			warnGitHubPublicationDeprecation("personal.cancelAuthorization");
			return cancelUserGitHubAuthorizationSync(action.owner, requestId, () => guard(action));
		},
		async cancelAuthorizationAsync(action, requestId) {
			guard(action);
			return Boolean(await mutateUserGitHubConnection$1(action.owner, {
				kind: "cancel",
				requestId
			}, () => guard(action)));
		},
		/** @deprecated Use disconnectAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		disconnect(action) {
			warnGitHubPublicationDeprecation("personal.disconnect");
			disconnectUserGitHubConnectionSync(action.owner, () => guard(action));
			clearNativeGitHubTokenCache();
		},
		async disconnectAsync(action) {
			guard(action);
			await mutateUserGitHubConnection$1(action.owner, { kind: "disconnect" }, () => guard(action));
			clearNativeGitHubTokenCache();
		},
		refresh,
		maintain() {
			if (stopped) return Promise.resolve();
			maintenance ??= runMaintenance().finally(() => {
				maintenance = void 0;
			});
			return maintenance;
		},
		async stop() {
			stopped = true;
			abort.abort();
			unobserve();
			unobserveConnections();
			await Promise.allSettled([
				...maintenance ? [maintenance] : [],
				...writes,
				...polls.values(),
				...refreshes.values(),
				...cleanups.values()
			]);
			for (const pending of rotated.values()) try {
				await persistRotation(pending);
			} catch {}
		}
	};
}
//#endregion
//#region src/gateway/github-oauth-lifecycle.ts
let activeLifecycle;
function installActiveGitHubOAuthLifecycle(lifecycle) {
	activeLifecycle = lifecycle;
	return () => {
		if (activeLifecycle === lifecycle) activeLifecycle = void 0;
	};
}
async function requestCurrentGitHubOAuthRefresh(agentId) {
	await activeLifecycle?.refreshEffectiveIdentity(agentId);
}
async function requestCurrentPersonalGitHubRefresh(owner) {
	if (!activeLifecycle) throw new Error("My GitHub lifecycle is unavailable; retry after Gateway startup.");
	await activeLifecycle.personal.refresh(owner);
}
function createGitHubOAuthLifecycle(params) {
	const personal = createPersonalGitHubOAuthLifecycle();
	const deviceController = new AbortController();
	const devicePolls = /* @__PURE__ */ new Map();
	const committingRequests = /* @__PURE__ */ new Set();
	const refreshes = /* @__PURE__ */ new Map();
	const pendingRefreshes = /* @__PURE__ */ new Map();
	const pendingCleanup = /* @__PURE__ */ new Set();
	let maintenance;
	let maintenanceScope;
	let stopping = false;
	let nextMaintenanceAtMs = Number.POSITIVE_INFINITY;
	const oauthInventory = createGitHubOAuthInventoryReader(() => {
		scheduleMaintenance(Date.now() + MAINTENANCE_INTERVAL_MS);
	});
	const unsubscribeConfig = registerRuntimeConfigWriteListener(() => {
		scheduleMaintenance(Date.now());
	});
	function scheduleMaintenance(atMs) {
		if (!stopping && Number.isFinite(atMs)) maintenanceScope?.schedule({
			id: "maintenance:github-oauth",
			atMs,
			mode: "earliest",
			run: maintain
		});
	}
	const warnMaintenanceError = (error) => params.warn(`GitHub OAuth maintenance failed; will retry: ${formatErrorMessage(error)}`);
	const queueDeviceCleanup = async (requestId) => {
		try {
			await deleteGitHubDeviceAuthorizationRecord(requestId);
			pendingCleanup.delete(requestId);
		} catch {
			pendingCleanup.add(requestId);
		}
	};
	const queueOAuthCleanup = async (profileId) => {
		clearNativeGitHubTokenCache();
		try {
			await deleteGitHubOAuthRecord(profileId);
		} catch {}
	};
	const status = (agentId, selectedScope) => resolveGitHubToolIdentityStatus({
		config: params.getConfig(),
		agentId,
		selectedScope
	});
	const installDeviceTokens = async (record, tokens) => {
		if (!await authorizationStillOwnedAsync(params.getConfig, record)) {
			await queueDeviceCleanup(record.requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		const current = params.getConfig();
		const profileId = createManagedGitHubProfileId();
		const profileDir = resolveManagedGitHubProfileDir({
			agentId: record.agentId,
			scope: record.scope,
			profileId
		});
		let nextConfig = current;
		let initialRecord;
		const completeAuthorization = async (config) => {
			await queueDeviceCleanup(record.requestId);
			if (record.expectedIdentity?.kind === "oauth") await queueOAuthCleanup(record.expectedIdentity.profileId);
			return {
				status: "success",
				githubStatus: await resolveGitHubToolIdentityStatus({
					config,
					agentId: record.agentId,
					selectedScope: record.scope
				})
			};
		};
		try {
			await installManagedGitHubProfile({
				profileDir,
				token: tokens.accessToken,
				retainProfileOnCommitFailure: true,
				commitConfig: async (account) => {
					const pending = await readGitHubDeviceAuthorizationRecord(record.requestId);
					if (!pending || pending.createdAtMs !== record.createdAtMs || pending.deviceCode !== record.deviceCode || !isDeepStrictEqual(pending.expectedIdentity, record.expectedIdentity) || !authorizationStillOwned(params.getConfig(), record)) throw new Error("GitHub authorization is no longer pending.");
					committingRequests.add(record.requestId);
					const pendingInitial = {
						requestId: record.requestId,
						scope: record.scope,
						agentId: record.agentId,
						expectedIdentity: record.expectedIdentity,
						...record.agentLifecycleBinding ? { agentLifecycleBinding: record.agentLifecycleBinding } : {}
					};
					const nextRecord = createGitHubOAuthRecord({
						profileId,
						scope: record.scope,
						agentId: record.agentId,
						account,
						tokens,
						now: Date.now(),
						pendingInitial
					});
					await writeGitHubOAuthRecord(nextRecord);
					initialRecord = nextRecord;
					const identity = {
						profileId,
						kind: "oauth",
						gitAuthor: record.expectedIdentity?.gitAuthor ? structuredClone(record.expectedIdentity.gitAuthor) : {
							name: account.login,
							email: `${account.accountId}+${account.login}@users.noreply.github.com`
						}
					};
					nextConfig = await updateGitHubToolIdentityConfig({
						scope: record.scope,
						agentId: record.agentId,
						identity,
						expectedIdentity: record.expectedIdentity,
						...record.agentLifecycleBinding ? { agentLifecycleBinding: record.agentLifecycleBinding } : {}
					});
					const inspected = await inspectGitHubOAuthRecord(profileId);
					if (inspected.state !== "valid" || !inspected.record.pendingInitial) throw new Error("GitHub OAuth initial record is unavailable.");
					const { pendingInitial: _pendingInitial, ...settledRecord } = inspected.record;
					await writeGitHubOAuthRecord(settledRecord);
					initialRecord = settledRecord;
				}
			});
		} catch {
			if (initialRecord) try {
				const runtimeConfig = params.getConfig();
				const runtimeConfigValue = structuredClone(runtimeConfig);
				const persistedConfig = await params.getPersistedConfig?.();
				if (!persistedConfig) throw new Error("Authoritative persisted config is unavailable.");
				await assertInitialOAuthRecordCurrent(params.getConfig, initialRecord, runtimeConfig, runtimeConfigValue);
				const persistedIdentity = resolveConfiguredGitHubToolIdentity({
					config: persistedConfig,
					scope: record.scope,
					agentId: record.agentId
				});
				if (persistedIdentity?.profileId === profileId && persistedIdentity.kind === "oauth") {
					if (initialRecord.pendingInitial) await writeGitHubOAuthRecord({
						...initialRecord,
						pendingInitial: void 0
					});
					return await completeAuthorization(persistedConfig);
				}
			} catch {
				await queueDeviceCleanup(record.requestId);
				return {
					status: "failed",
					reason: "setup_failed"
				};
			}
			if (initialRecord) await queueOAuthCleanup(profileId);
			await removeManagedGitHubProfile(profileDir).catch(() => void 0);
			await queueDeviceCleanup(record.requestId);
			return {
				status: "failed",
				reason: "setup_failed"
			};
		} finally {
			committingRequests.delete(record.requestId);
		}
		return await completeAuthorization(nextConfig);
	};
	const pollOnce = async (requestId) => {
		const record = await readGitHubDeviceAuthorizationRecord(requestId);
		const now = Date.now();
		if (!record || record.expiresAtMs <= now) {
			await queueDeviceCleanup(requestId);
			return { status: "expired" };
		}
		if (!await authorizationStillOwnedAsync(params.getConfig, record)) {
			await queueDeviceCleanup(requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		const result = await pollGitHubDeviceFlow(record, deviceController.signal);
		const currentRecord = await readGitHubDeviceAuthorizationRecord(requestId);
		if (!currentRecord) return { status: "expired" };
		if (currentRecord.deviceCode !== record.deviceCode || currentRecord.createdAtMs !== record.createdAtMs || !isDeepStrictEqual(currentRecord.expectedIdentity, record.expectedIdentity)) {
			await queueDeviceCleanup(requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		if (result.kind === "authorized") return await installDeviceTokens(currentRecord, result.tokens);
		if (result.kind === "waiting") await writeGitHubDeviceAuthorizationRecord({
			...currentRecord,
			pollIntervalMs: result.pollIntervalMs,
			nextPollAtMs: result.nextPollAtMs
		});
		else await queueDeviceCleanup(requestId);
		return result.result;
	};
	const applyPendingRefresh = async (record, accessToken) => {
		const profileDir = resolveManagedGitHubProfileDir({
			agentId: record.agentId,
			scope: record.scope,
			profileId: record.profileId
		});
		let account;
		try {
			account = await refreshManagedGitHubProfile({
				profileDir,
				token: accessToken,
				expectedAccountId: record.accountId
			});
		} catch (error) {
			if (error instanceof GitHubAccountMismatchError) await writeGitHubOAuthRecord({
				...record,
				pendingRefresh: void 0,
				refreshFailure: "expired"
			});
			return;
		}
		await writeGitHubOAuthRecord({
			...record,
			login: account.login,
			pendingRefresh: void 0,
			refreshFailure: void 0
		});
	};
	const refreshOne = async (configured) => {
		const profileId = configured.identity.profileId;
		const inspected = await inspectGitHubOAuthRecord(profileId);
		if (inspected.state !== "valid") return;
		const currentRecord = inspected.record;
		if (currentRecord.pendingInitial) return;
		const now = Date.now();
		if (currentRecord.refreshFailure === "expired" || currentRecord.refreshExpiresAtMs <= now) return;
		if (!currentRecord.pendingRefresh && currentRecord.accessExpiresAtMs > now + 6e5) return;
		const currentIdentity = resolveConfiguredGitHubToolIdentity({
			config: params.getConfig(),
			...currentRecord
		});
		if (currentIdentity?.kind !== "oauth" || currentIdentity.profileId !== profileId) return;
		let refreshed;
		try {
			refreshed = await refreshGitHubOAuthToken({ refreshToken: currentRecord.refreshToken });
		} catch {
			if (!currentRecord.pendingRefresh) await writeGitHubOAuthRecord({
				...currentRecord,
				refreshFailure: "failed"
			});
			return;
		}
		if (refreshed.status === "error") {
			const refreshFailure = refreshed.code === "bad_refresh_token" ? "expired" : "failed";
			await writeGitHubOAuthRecord({
				...currentRecord,
				pendingRefresh: void 0,
				refreshFailure
			});
			return;
		}
		const rotatedRecord = {
			...currentRecord,
			refreshToken: refreshed.tokens.refreshToken,
			accessExpiresAtMs: now + refreshed.tokens.expiresInSeconds * 1e3,
			refreshExpiresAtMs: now + refreshed.tokens.refreshTokenExpiresInSeconds * 1e3,
			scopes: refreshed.tokens.scopes,
			pendingRefresh: true,
			pendingInitial: void 0,
			refreshFailure: void 0
		};
		pendingRefreshes.set(profileId, {
			record: rotatedRecord,
			accessToken: refreshed.tokens.accessToken
		});
		try {
			await writeGitHubOAuthRecord(rotatedRecord);
		} catch {
			return;
		}
		pendingRefreshes.delete(profileId);
		await applyPendingRefresh(rotatedRecord, refreshed.tokens.accessToken);
	};
	const requestRefresh = (configured) => getOrCreatePromise(refreshes, configured.identity.profileId, () => refreshOne(configured).catch((error) => {
		params.warn(`GitHub OAuth refresh failed; will retry: ${formatErrorMessage(error)}`);
	}), { evictOnSettled: true });
	const reconcileRecords = async () => {
		const inventory = await oauthInventory.read();
		const { deviceRecords, oauthRecords } = inventory;
		nextMaintenanceAtMs = nextGitHubOAuthMaintenanceAtMs(inventory, Date.now());
		for (const { requestId, record } of deviceRecords) if (!record || record.expiresAtMs <= Date.now()) await queueDeviceCleanup(requestId);
		for (const { profileId, record } of oauthRecords) {
			if (!record) {
				await queueOAuthCleanup(profileId);
				continue;
			}
			if (record.pendingInitial) {
				if (committingRequests.has(record.pendingInitial.requestId)) continue;
				let persistedConfig;
				try {
					const runtimeConfig = params.getConfig();
					const runtimeConfigValue = structuredClone(runtimeConfig);
					const persisted = await params.getPersistedConfig?.();
					if (!persisted) continue;
					await assertInitialOAuthRecordCurrent(params.getConfig, record, runtimeConfig, runtimeConfigValue);
					if (committingRequests.has(record.pendingInitial.requestId)) continue;
					persistedConfig = persisted;
				} catch {
					continue;
				}
				if (await pendingInitialOAuthIdentitySelected(persistedConfig, record)) {
					await writeGitHubOAuthRecord({
						...record,
						pendingInitial: void 0
					});
					if (record.pendingInitial.expectedIdentity?.kind === "oauth") await queueOAuthCleanup(record.pendingInitial.expectedIdentity.profileId);
					continue;
				}
				await queueOAuthCleanup(profileId);
				await removeManagedGitHubProfile(resolveManagedGitHubProfileDir({
					agentId: record.agentId,
					scope: record.scope,
					profileId
				})).catch(() => void 0);
				continue;
			}
			const current = resolveConfiguredGitHubToolIdentity({
				config: params.getConfig(),
				...record
			});
			if (current?.profileId !== profileId || current.kind !== "oauth") {
				await queueOAuthCleanup(profileId);
				continue;
			}
			if (record.pendingRefresh && !stopping) await requestRefresh({
				scope: record.scope,
				agentId: record.agentId,
				identity: {
					...current,
					kind: "oauth"
				}
			});
		}
	};
	const runMaintenance = async () => {
		for (const requestId of pendingCleanup) await queueDeviceCleanup(requestId);
		for (const [profileId, pending] of [...pendingRefreshes].toSorted(([left], [right]) => left.localeCompare(right))) try {
			await writeGitHubOAuthRecord(pending.record);
			pendingRefreshes.delete(profileId);
			await applyPendingRefresh(pending.record, pending.accessToken);
		} catch {}
		await reconcileRecords();
		for (const configured of configuredOAuthIdentities(params.getConfig())) {
			if (stopping) break;
			await requestRefresh(configured);
		}
	};
	const maintain = () => {
		if (stopping && !maintenance) return Promise.resolve();
		maintenance ??= runMaintenance().catch((error) => {
			nextMaintenanceAtMs = Date.now() + MAINTENANCE_INTERVAL_MS;
			warnMaintenanceError(error);
		}).finally(() => {
			maintenance = void 0;
			if (oauthInventory.dirty || pendingCleanup.size > 0 || pendingRefreshes.size > 0) nextMaintenanceAtMs = Math.min(nextMaintenanceAtMs, Date.now() + MAINTENANCE_INTERVAL_MS);
			scheduleMaintenance(Math.max(Date.now() + 1, nextMaintenanceAtMs));
		});
		return maintenance;
	};
	return {
		personal,
		startAuthorization: async (input) => {
			if (stopping) throw new Error("GitHub authorization lifecycle is stopping.");
			assertGitHubCliAvailable();
			const expectedIdentity = structuredClone(resolveConfiguredGitHubToolIdentity({
				config: params.getConfig(),
				...input
			}) ?? null);
			const agentLifecycleBinding = input.scope === "agent" ? await captureAgentLifecycleBinding(params.getConfig, input.agentId) : void 0;
			if (input.scope === "agent" && !agentLifecycleBinding) throw new Error("GitHub authorization requires an active agent.");
			if (!identityStillSelected(params.getConfig(), input, expectedIdentity)) throw new Error("GitHub identity changed while authorization was starting.");
			deviceController.signal.throwIfAborted();
			const authorization = await startGitHubDeviceFlow(deviceController.signal);
			if (!identityStillSelected(params.getConfig(), input, expectedIdentity) || agentLifecycleBinding !== void 0 && !await matchesAgentLifecycleBindingAsync(params.getConfig, agentLifecycleBinding)) throw new Error("GitHub identity changed while authorization was starting.");
			for (const existing of await listGitHubDeviceAuthorizationRecords()) if (existing.record?.scope === input.scope && existing.record.agentId === input.agentId) await queueDeviceCleanup(existing.requestId);
			const requestId = `github-device-${randomBytes(16).toString("hex")}`;
			await writeGitHubDeviceAuthorizationRecord({
				version: 1,
				requestId,
				...authorization,
				agentId: input.agentId,
				scope: input.scope,
				expectedIdentity,
				...agentLifecycleBinding ? { agentLifecycleBinding } : {}
			});
			return {
				requestId,
				userCode: authorization.userCode,
				verificationUri: authorization.verificationUri,
				expiresInMs: Math.max(0, authorization.expiresAtMs - Date.now()),
				pollAfterMs: authorization.pollIntervalMs
			};
		},
		pollAuthorization: (requestId) => getOrCreatePromise(devicePolls, requestId, () => pollOnce(requestId), { evictOnSettled: true }),
		/** @deprecated Use cancelAuthorizationAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		cancelAuthorization(requestId) {
			warnPluginSdkDeprecation({
				family: "github-publication",
				method: "cancelAuthorization",
				replacement: "cancelAuthorizationAsync"
			});
			if (committingRequests.has(requestId)) return false;
			const existed = readGitHubDeviceAuthorizationRecordNative(requestId) !== void 0;
			try {
				deleteGitHubDeviceAuthorizationRecordNative(requestId);
				pendingCleanup.delete(requestId);
			} catch {
				pendingCleanup.add(requestId);
			}
			return existed;
		},
		cancelAuthorizationAsync: async (requestId) => {
			const existed = await readGitHubDeviceAuthorizationRecord(requestId) !== void 0;
			if (committingRequests.has(requestId)) return false;
			await queueDeviceCleanup(requestId);
			return existed;
		},
		status,
		/** @deprecated Use retireProfileAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		retireProfile(profileId) {
			warnPluginSdkDeprecation({
				family: "github-publication",
				method: "retireProfile",
				replacement: "retireProfileAsync"
			});
			clearNativeGitHubTokenCache();
			try {
				deleteGitHubOAuthRecordNative(profileId);
			} catch {}
		},
		retireProfileAsync: queueOAuthCleanup,
		refreshEffectiveIdentity: async (agentId) => {
			if (stopping) return;
			const config = params.getConfig();
			const agent = resolveAgentConfig(config, agentId)?.tools?.github;
			const identity = agent ?? config.tools?.github;
			if (identity?.kind !== "oauth") return;
			await requestRefresh({
				scope: agent ? "agent" : "system",
				agentId,
				identity: {
					...identity,
					kind: "oauth"
				}
			});
		},
		maintain: async () => {
			await Promise.all([maintain(), personal.maintain()]).catch(warnMaintenanceError);
		},
		start: () => {
			if (stopping || maintenanceScope) return;
			maintenanceScope = params.scheduler.scope();
			scheduleMaintenance(Date.now());
			maintenanceScope.schedule({
				id: "maintenance:github-personal-oauth",
				delayMs: 0,
				everyMs: MAINTENANCE_INTERVAL_MS,
				run: () => personal.maintain().catch(warnMaintenanceError)
			});
		},
		stop: async () => {
			clearGitHubCredentialVerificationCache();
			stopping = true;
			oauthInventory.close();
			unsubscribeConfig();
			maintenanceScope?.beginClose();
			deviceController.abort();
			const drain = (async () => {
				await Promise.allSettled([
					personal.stop(),
					maintenanceScope?.stop(),
					maintenance,
					...devicePolls.values(),
					...refreshes.values()
				]);
				if (pendingRefreshes.size > 0) await runMaintenance();
			})();
			await settlesWithin(drain, SHUTDOWN_DRAIN_TIMEOUT_MS);
		}
	};
}
//#endregion
export { personalGitHubStatusAsync as a, requestCurrentPersonalGitHubRefresh as i, installActiveGitHubOAuthLifecycle as n, UserGitHubConnectionAuthorityChangedError as o, requestCurrentGitHubOAuthRefresh as r, prepareUserGitHubConnection as s, createGitHubOAuthLifecycle as t };
