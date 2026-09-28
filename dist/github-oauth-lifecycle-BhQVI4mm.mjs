import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { O as listAgentIds, r as resolveAgentConfig, w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { a as observeUserGitHubProfileRetirement, c as updateUserGitHubConnection, l as updateUserGitHubRefresh, n as disconnectedUserGitHubConnection, o as readUserGitHubConnection, r as listUserGitHubConnections, s as resolvePersonalGitHubOwner, t as disconnectUserGitHubConnection } from "./user-github-connections-Bepgzp4W.mjs";
import { o as matchesAgentLifecycleBinding, r as captureAgentLifecycleBinding } from "./agent-lifecycle-registry-D47RUurT.mjs";
import { A as pollGitHubOAuthDeviceToken, C as inspectGitHubOAuthRecord, D as writeGitHubDeviceAuthorizationRecord, E as readGitHubDeviceAuthorizationRecord, M as requestGitHubOAuthDeviceCode, O as writeGitHubOAuthRecord, P as clearNativeGitHubTokenCache, S as deleteGitHubOAuthRecord, T as listGitHubOAuthRecords, _ as resolveManagedGitHubProfileRoot, b as createGitHubOAuthRecord, d as refreshManagedGitHubProfile, f as removeManagedGitHubProfile, g as resolveManagedGitHubProfileDir, j as refreshGitHubOAuthToken, k as clearGitHubCredentialVerificationCache, m as resolveGitHubToolIdentityStatus, n as createManagedGitHubProfileId, p as resolveConfiguredGitHubToolIdentity, r as installManagedGitHubProfile, t as GitHubAccountMismatchError, u as preparePersonalGitHubPublicationIdentity, w as listGitHubDeviceAuthorizationRecords, x as deleteGitHubDeviceAuthorizationRecord } from "./github-tool-identity-BOF32-1s.mjs";
import { r as assertGitHubCliAvailable, t as updateGitHubToolIdentityConfig } from "./github-tool-identity-config-C0TghCXZ.mjs";
import { isDeepStrictEqual } from "node:util";
import fs from "node:fs/promises";
import { randomBytes, randomUUID } from "node:crypto";
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
const MAINTENANCE_INTERVAL_MS = 6e4;
const SHUTDOWN_DRAIN_TIMEOUT_MS = 31e3;
const defaultGitAuthor = (account) => ({
	name: account.login,
	email: `${account.accountId}+${account.login}@users.noreply.github.com`
});
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
function currentIdentityForRecord(config, record) {
	return resolveConfiguredGitHubToolIdentity({
		config,
		...record
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
function projectPending(pending) {
	return {
		requestId: pending.requestId,
		userCode: pending.userCode,
		verificationUri: pending.verificationUri,
		expiresInMs: Math.max(0, pending.expiresAtMs - Date.now()),
		pollAfterMs: Math.max(1, Math.min(6e4, pending.nextPollAtMs - Date.now()))
	};
}
function personalGitHubStatus(action) {
	action.assertCurrent();
	let record;
	try {
		record = readUserGitHubConnection(action.owner);
	} catch {
		action.assertCurrent();
		return {
			state: "unavailable",
			generation: null,
			account: null,
			accessExpiresAtMs: null,
			refreshState: "failed",
			pending: null
		};
	}
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
	const current = personalGitHubStatus(action);
	if (current.generation !== prepared.generation || current.account?.accountId !== prepared.account?.accountId || current.account?.login.toLowerCase() !== prepared.account?.login.toLowerCase()) throw new Error("My GitHub connection changed; reload its status.");
	return prepared.state === "unavailable" ? {
		...current,
		state: "unavailable"
	} : current;
}
async function resolvePersonalGitHubStatus(action) {
	const status = personalGitHubStatus(action);
	if (status.state !== "connected") return status;
	const record = readUserGitHubConnection(action.owner);
	if (record?.selection.kind !== "connected") return {
		...status,
		state: "unavailable"
	};
	const assertCurrent = () => {
		revalidatePersonalGitHubStatus(action, status);
	};
	try {
		await preparePersonalGitHubPublicationIdentity({
			profileId: record.selection.profileId,
			accountId: record.selection.accountId,
			assertCurrent
		});
		return revalidatePersonalGitHubStatus(action, status);
	} catch {
		return {
			...revalidatePersonalGitHubStatus(action, status),
			state: "unavailable"
		};
	}
}
function requirePending(record, generation, requestId) {
	if (!record?.pending || record.generation !== generation || record.pending.requestId !== requestId || record.pending.expiresAtMs <= Date.now()) throw new Error("My GitHub authorization changed or expired; start again.");
	return {
		...record,
		pending: record.pending
	};
}
function rotatedSelection(selection, tokens, receivedAtMs) {
	return {
		...selection,
		refreshToken: tokens.refreshToken,
		scopes: tokens.scopes,
		accessExpiresAtMs: receivedAtMs + tokens.expiresInSeconds * 1e3,
		refreshExpiresAtMs: receivedAtMs + tokens.refreshTokenExpiresInSeconds * 1e3,
		refreshFailure: void 0
	};
}
/** Personal adapters share device transport and profile materialization with System/agent OAuth. */
function createPersonalGitHubOAuthLifecycle() {
	const abort = new AbortController();
	const polls = /* @__PURE__ */ new Map();
	const refreshes = /* @__PURE__ */ new Map();
	const rotated = /* @__PURE__ */ new Map();
	const retirements = /* @__PURE__ */ new Set();
	const cleanups = /* @__PURE__ */ new Map();
	let stopped = false;
	let inspectedProfiles = false;
	const profileIsReferenced = (id) => listUserGitHubConnections().some(({ connection }) => connection.selection.kind === "connected" && connection.selection.profileId === id || connection.pending?.kind === "device" && connection.pending.candidate?.profileId === id);
	const assertRunning = () => {
		if (stopped) throw new Error("GitHub authorization is stopping.");
	};
	const retire = async (id) => {
		await getOrCreatePromise(cleanups, id, () => withProfileLease(id, async (assertOwned) => {
			assertOwned();
			if (profileIsReferenced(id)) return;
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
		const assertCurrent = () => {
			guard(action);
			const record = requirePending(readUserGitHubConnection(action.owner), generation, pending.requestId);
			if (record.pending.kind !== "device" || record.pending.candidate?.profileId !== candidate.profileId) throw new Error("My GitHub authorization changed.");
		};
		try {
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
						updateUserGitHubConnection(action.owner, (current) => {
							return {
								...requirePending(current, generation, pending.requestId),
								generation: randomUUID(),
								pending: void 0,
								selection: {
									kind: "connected",
									profileId: candidate.profileId,
									accountId: account.accountId,
									login: account.login,
									refreshToken: candidate.tokens.refreshToken,
									scopes: candidate.tokens.scopes,
									accessExpiresAtMs: candidate.receivedAtMs + candidate.tokens.expiresInSeconds * 1e3,
									refreshExpiresAtMs: candidate.receivedAtMs + candidate.tokens.refreshTokenExpiresInSeconds * 1e3
								}
							};
						}, assertInstall);
					}
				});
			});
			guard(action);
			return {
				status: "success",
				personal: personalGitHubStatus(action)
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
			next = updateUserGitHubConnection(action.owner, (current) => {
				const owned = requirePending(current, initial.generation, requestId);
				if (owned.pending.kind !== "device" || owned.pending.deviceCode !== pending.deviceCode) throw new Error("My GitHub authorization changed.");
				return {
					...owned,
					pending: polled.kind === "terminal" ? void 0 : {
						...owned.pending,
						...polled.kind === "authorized" ? { candidate: {
							receivedAtMs: Date.now(),
							profileId: createManagedGitHubProfileId(),
							tokens: polled.tokens
						} } : {
							pollIntervalMs: polled.pollIntervalMs,
							nextPollAtMs: polled.nextPollAtMs
						}
					}
				};
			}, () => guard(action));
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
	const persistRotation = (pending) => updateUserGitHubRefresh({
		...pending,
		update: (selection) => ({
			...rotatedSelection(selection, pending.tokens, pending.receivedAtMs),
			refresh: {
				operationId: pending.operationId,
				tokens: pending.tokens,
				receivedAtMs: pending.receivedAtMs
			}
		})
	});
	const materializeRefresh = async (owner, id, operationId, assertOwned) => {
		const readExact = () => {
			assertOwned();
			const canonical = resolvePersonalGitHubOwner(owner);
			const selection = canonical ? readUserGitHubConnection(canonical)?.selection : void 0;
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
		updateUserGitHubRefresh({
			owner,
			profileId: id,
			operationId,
			update: (selection) => ({
				...selection,
				login: account.login,
				refresh: void 0,
				refreshFailure: void 0
			})
		});
	};
	const refresh = async (owner) => {
		assertRunning();
		const initial = readUserGitHubConnection(owner)?.selection;
		if (initial?.kind !== "connected") return;
		const id = initial.profileId;
		await getOrCreatePromise(refreshes, id, () => withProfileLease(id, async (assertOwned) => {
			const memory = rotated.get(id);
			if (memory) {
				if (!persistRotation(memory)) {
					rotated.delete(id);
					return;
				}
				rotated.delete(id);
			}
			const record = readUserGitHubConnection(owner);
			const selection = record?.selection;
			if (!record || selection?.kind !== "connected" || selection.profileId !== id) return;
			if (selection.refresh?.tokens) {
				await materializeRefresh(owner, id, selection.refresh.operationId, assertOwned);
				return;
			}
			if (selection.refreshFailure === "expired" || selection.refreshExpiresAtMs <= Date.now() || !selection.refresh && selection.accessExpiresAtMs > Date.now() + 6e5) return;
			const operationId = selection.refresh?.operationId ?? randomUUID();
			updateUserGitHubConnection(owner, (current) => {
				if (current?.generation !== record.generation || current.selection.kind !== "connected" || current.selection.profileId !== id) throw new Error("My GitHub selection changed.");
				return {
					...current,
					selection: {
						...current.selection,
						refresh: { operationId }
					}
				};
			}, assertOwned);
			let result;
			try {
				result = await refreshGitHubOAuthToken({ refreshToken: selection.refreshToken });
			} catch {
				updateUserGitHubRefresh({
					owner,
					profileId: id,
					operationId,
					update: (current) => ({
						...current,
						refresh: void 0,
						refreshFailure: "failed"
					})
				});
				return;
			}
			if (result.status === "error") {
				updateUserGitHubRefresh({
					owner,
					profileId: id,
					operationId,
					update: (current) => ({
						...current,
						refresh: void 0,
						refreshFailure: result.code === "bad_refresh_token" ? "expired" : "failed"
					})
				});
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
			if (!persistRotation(pending)) {
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
			for (const entry of entries) if (entry.isDirectory() && /^ghp_[a-f0-9]{32}$/u.test(entry.name) && !profileIsReferenced(entry.name)) retirements.add(entry.name);
			inspectedProfiles = true;
		}
		for (const pending of rotated.values()) try {
			persistRotation(pending);
			rotated.delete(pending.profileId);
		} catch {}
		for (const id of retirements) await retire(id);
		for (const { owner, connection } of listUserGitHubConnections()) {
			if (stopped) break;
			if (connection.pending && connection.pending.expiresAtMs <= Date.now()) updateUserGitHubConnection(owner, (current) => {
				if (!current) return disconnectedUserGitHubConnection();
				return current.pending && current.pending.expiresAtMs <= Date.now() ? {
					...current,
					pending: void 0
				} : current;
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
			const initial = updateUserGitHubConnection(action.owner, (current) => ({
				...current ?? disconnectedUserGitHubConnection(),
				pending: {
					kind: "starting",
					requestId,
					createdAtMs,
					expiresAtMs: createdAtMs + 9e5
				}
			}), () => guard(action));
			const authorization = await startGitHubDeviceFlow(abort.signal);
			guard(action);
			if (authorization.expiresAtMs <= Date.now()) throw new Error("My GitHub authorization expired while starting; start again.");
			const next = updateUserGitHubConnection(action.owner, (current) => ({
				...requirePending(current, initial.generation, requestId),
				pending: {
					...authorization,
					kind: "device",
					requestId
				}
			}), () => guard(action));
			if (next.pending?.kind !== "device") throw new Error("My GitHub authorization changed.");
			return projectPending(next.pending);
		},
		async pollAuthorization(action, requestId) {
			guard(action);
			const current = readUserGitHubConnection(action.owner);
			if (current?.pending?.requestId !== requestId) return { status: "expired" };
			const key = `${action.owner}\0${requestId}`;
			const result = await getOrCreatePromise(polls, key, () => pollOnce(action, current, requestId), { evictOnSettled: true });
			guard(action);
			return result;
		},
		cancelAuthorization(action, requestId) {
			guard(action);
			if (readUserGitHubConnection(action.owner)?.pending?.requestId !== requestId) return false;
			updateUserGitHubConnection(action.owner, (record) => {
				if (!record || record.pending?.requestId !== requestId) throw new Error("My GitHub authorization changed.");
				return {
					...record,
					pending: void 0
				};
			}, () => guard(action));
			return true;
		},
		disconnect(action) {
			guard(action);
			disconnectUserGitHubConnection(action.owner, () => guard(action));
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
			await Promise.allSettled([
				...maintenance ? [maintenance] : [],
				...polls.values(),
				...refreshes.values(),
				...cleanups.values()
			]);
			for (const pending of rotated.values()) try {
				persistRotation(pending);
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
	let interval;
	let stopping = false;
	const queueDeviceCleanup = (requestId) => {
		try {
			deleteGitHubDeviceAuthorizationRecord(requestId);
			pendingCleanup.delete(requestId);
		} catch {
			pendingCleanup.add(requestId);
		}
	};
	const queueOAuthCleanup = (profileId) => {
		clearNativeGitHubTokenCache();
		try {
			deleteGitHubOAuthRecord(profileId);
		} catch {}
	};
	const status = (agentId, selectedScope) => resolveGitHubToolIdentityStatus({
		config: params.getConfig(),
		agentId,
		selectedScope
	});
	const installDeviceTokens = async (record, tokens) => {
		const current = params.getConfig();
		if (!authorizationStillOwned(current, record)) {
			queueDeviceCleanup(record.requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		const profileId = createManagedGitHubProfileId();
		const profileDir = resolveManagedGitHubProfileDir({
			agentId: record.agentId,
			scope: record.scope,
			profileId
		});
		let nextConfig = current;
		let metadataWritten = false;
		try {
			await installManagedGitHubProfile({
				profileDir,
				token: tokens.accessToken,
				retainProfileOnCommitFailure: true,
				commitConfig: async (account) => {
					const pending = readGitHubDeviceAuthorizationRecord(record.requestId);
					if (!pending || pending.createdAtMs !== record.createdAtMs || pending.deviceCode !== record.deviceCode || !isDeepStrictEqual(pending.expectedIdentity, record.expectedIdentity) || !authorizationStillOwned(params.getConfig(), record)) throw new Error("GitHub authorization is no longer pending.");
					committingRequests.add(record.requestId);
					const pendingInitial = {
						requestId: record.requestId,
						scope: record.scope,
						agentId: record.agentId,
						expectedIdentity: record.expectedIdentity,
						...record.agentLifecycleBinding ? { agentLifecycleBinding: record.agentLifecycleBinding } : {}
					};
					writeGitHubOAuthRecord(createGitHubOAuthRecord({
						profileId,
						scope: record.scope,
						agentId: record.agentId,
						account,
						tokens,
						now: Date.now(),
						pendingInitial
					}));
					metadataWritten = true;
					const identity = {
						profileId,
						kind: "oauth",
						gitAuthor: record.expectedIdentity?.gitAuthor ? structuredClone(record.expectedIdentity.gitAuthor) : defaultGitAuthor(account)
					};
					nextConfig = await updateGitHubToolIdentityConfig({
						scope: record.scope,
						agentId: record.agentId,
						identity,
						expectedIdentity: record.expectedIdentity,
						...record.agentLifecycleBinding ? { agentLifecycleBinding: record.agentLifecycleBinding } : {}
					});
					const inspected = inspectGitHubOAuthRecord(profileId);
					if (inspected.state !== "valid" || !inspected.record.pendingInitial) throw new Error("GitHub OAuth initial record is unavailable.");
					writeGitHubOAuthRecord({
						...inspected.record,
						pendingInitial: void 0
					});
				}
			});
		} catch {
			if (metadataWritten) try {
				const persistedConfig = params.getPersistedConfig?.();
				if (!persistedConfig) throw new Error("Authoritative persisted config is unavailable.");
				const persistedIdentity = resolveConfiguredGitHubToolIdentity({
					config: persistedConfig,
					scope: record.scope,
					agentId: record.agentId
				});
				if (persistedIdentity?.profileId === profileId && persistedIdentity.kind === "oauth") {
					const inspected = inspectGitHubOAuthRecord(profileId);
					if (inspected.state === "valid" && inspected.record.pendingInitial) writeGitHubOAuthRecord({
						...inspected.record,
						pendingInitial: void 0
					});
					queueDeviceCleanup(record.requestId);
					if (record.expectedIdentity?.kind === "oauth") queueOAuthCleanup(record.expectedIdentity.profileId);
					return {
						status: "success",
						githubStatus: await resolveGitHubToolIdentityStatus({
							config: persistedConfig,
							agentId: record.agentId,
							selectedScope: record.scope
						})
					};
				}
			} catch {
				queueDeviceCleanup(record.requestId);
				return {
					status: "failed",
					reason: "setup_failed"
				};
			}
			if (metadataWritten) queueOAuthCleanup(profileId);
			await removeManagedGitHubProfile(profileDir).catch(() => void 0);
			queueDeviceCleanup(record.requestId);
			return {
				status: "failed",
				reason: "setup_failed"
			};
		} finally {
			committingRequests.delete(record.requestId);
		}
		queueDeviceCleanup(record.requestId);
		if (record.expectedIdentity?.kind === "oauth") queueOAuthCleanup(record.expectedIdentity.profileId);
		return {
			status: "success",
			githubStatus: await resolveGitHubToolIdentityStatus({
				config: nextConfig,
				agentId: record.agentId,
				selectedScope: record.scope
			})
		};
	};
	const pollOnce = async (requestId) => {
		const record = readGitHubDeviceAuthorizationRecord(requestId);
		const now = Date.now();
		if (!record || record.expiresAtMs <= now) {
			queueDeviceCleanup(requestId);
			return { status: "expired" };
		}
		if (!authorizationStillOwned(params.getConfig(), record)) {
			queueDeviceCleanup(requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		const result = await pollGitHubDeviceFlow(record, deviceController.signal);
		const currentRecord = readGitHubDeviceAuthorizationRecord(requestId);
		if (!currentRecord) return { status: "expired" };
		if (currentRecord.deviceCode !== record.deviceCode || currentRecord.createdAtMs !== record.createdAtMs || !isDeepStrictEqual(currentRecord.expectedIdentity, record.expectedIdentity)) {
			queueDeviceCleanup(requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		const activeRecord = currentRecord;
		if (result.kind === "authorized") return await installDeviceTokens(activeRecord, result.tokens);
		if (result.kind === "waiting") writeGitHubDeviceAuthorizationRecord({
			...activeRecord,
			pollIntervalMs: result.pollIntervalMs,
			nextPollAtMs: result.nextPollAtMs
		});
		else queueDeviceCleanup(requestId);
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
			if (error instanceof GitHubAccountMismatchError) writeGitHubOAuthRecord({
				...record,
				pendingRefresh: void 0,
				refreshFailure: "expired"
			});
			return;
		}
		writeGitHubOAuthRecord({
			...record,
			login: account.login,
			pendingRefresh: void 0,
			refreshFailure: void 0
		});
	};
	const refreshOne = async (configured) => {
		const profileId = configured.identity.profileId;
		const inspected = inspectGitHubOAuthRecord(profileId);
		if (inspected.state !== "valid") return;
		const currentRecord = inspected.record;
		if (currentRecord.pendingInitial) return;
		const now = Date.now();
		if (currentRecord.refreshFailure === "expired" || currentRecord.refreshExpiresAtMs <= now) return;
		if (!currentRecord.pendingRefresh && currentRecord.accessExpiresAtMs > now + 6e5) return;
		const currentIdentity = currentIdentityForRecord(params.getConfig(), currentRecord);
		if (currentIdentity?.kind !== "oauth" || currentIdentity.profileId !== profileId) return;
		let refreshed;
		try {
			refreshed = await refreshGitHubOAuthToken({ refreshToken: currentRecord.refreshToken });
		} catch {
			if (!currentRecord.pendingRefresh) writeGitHubOAuthRecord({
				...currentRecord,
				refreshFailure: "failed"
			});
			return;
		}
		if (refreshed.status === "error") {
			const refreshFailure = refreshed.code === "bad_refresh_token" ? "expired" : "failed";
			writeGitHubOAuthRecord({
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
			writeGitHubOAuthRecord(rotatedRecord);
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
		for (const { requestId, record } of listGitHubDeviceAuthorizationRecords()) if (!record || record.expiresAtMs <= Date.now()) queueDeviceCleanup(requestId);
		for (const { profileId, record } of listGitHubOAuthRecords()) {
			if (!record) {
				queueOAuthCleanup(profileId);
				continue;
			}
			if (record.pendingInitial) {
				if (committingRequests.has(record.pendingInitial.requestId)) continue;
				let persistedConfig;
				try {
					const persisted = params.getPersistedConfig?.();
					if (!persisted) continue;
					persistedConfig = persisted;
				} catch {
					continue;
				}
				const persistedIdentity = currentIdentityForRecord(persistedConfig, record);
				if ((record.scope === "system" || record.pendingInitial.agentLifecycleBinding !== void 0 && matchesAgentLifecycleBinding(persistedConfig, record.pendingInitial.agentLifecycleBinding)) && persistedIdentity?.profileId === profileId && persistedIdentity.kind === "oauth") {
					writeGitHubOAuthRecord({
						...record,
						pendingInitial: void 0
					});
					if (record.pendingInitial.expectedIdentity?.kind === "oauth") queueOAuthCleanup(record.pendingInitial.expectedIdentity.profileId);
					continue;
				}
				queueOAuthCleanup(profileId);
				await removeManagedGitHubProfile(resolveManagedGitHubProfileDir({
					agentId: record.agentId,
					scope: record.scope,
					profileId
				})).catch(() => void 0);
				continue;
			}
			const current = currentIdentityForRecord(params.getConfig(), record);
			if (current?.profileId !== profileId || current.kind !== "oauth") {
				queueOAuthCleanup(profileId);
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
		for (const requestId of pendingCleanup) queueDeviceCleanup(requestId);
		for (const [profileId, pending] of [...pendingRefreshes].toSorted(([left], [right]) => left.localeCompare(right))) try {
			writeGitHubOAuthRecord(pending.record);
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
		if (maintenance) return maintenance;
		maintenance = runMaintenance().catch((error) => {
			params.warn(`GitHub OAuth maintenance failed; will retry: ${formatErrorMessage(error)}`);
		}).finally(() => {
			maintenance = void 0;
		});
		return maintenance;
	};
	const maintainAll = async () => {
		await Promise.all([maintain(), personal.maintain()]).catch((error) => {
			params.warn(`GitHub OAuth maintenance failed; will retry: ${formatErrorMessage(error)}`);
		});
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
			const agentLifecycleBinding = input.scope === "agent" ? captureAgentLifecycleBinding(params.getConfig(), input.agentId) : void 0;
			if (input.scope === "agent" && !agentLifecycleBinding) throw new Error("GitHub authorization requires an active agent.");
			const authorization = await startGitHubDeviceFlow(deviceController.signal);
			if (!identityStillSelected(params.getConfig(), input, expectedIdentity) || agentLifecycleBinding !== void 0 && !matchesAgentLifecycleBinding(params.getConfig(), agentLifecycleBinding)) throw new Error("GitHub identity changed while authorization was starting.");
			for (const existing of listGitHubDeviceAuthorizationRecords()) if (existing.record?.scope === input.scope && existing.record.agentId === input.agentId) queueDeviceCleanup(existing.requestId);
			const requestId = `github-device-${randomBytes(16).toString("hex")}`;
			const { createdAtMs, expiresAtMs, pollIntervalMs, nextPollAtMs } = authorization;
			writeGitHubDeviceAuthorizationRecord({
				version: 1,
				requestId,
				deviceCode: authorization.deviceCode,
				userCode: authorization.userCode,
				verificationUri: authorization.verificationUri,
				createdAtMs,
				expiresAtMs,
				pollIntervalMs,
				nextPollAtMs,
				agentId: input.agentId,
				scope: input.scope,
				expectedIdentity,
				...agentLifecycleBinding ? { agentLifecycleBinding } : {}
			});
			return {
				requestId,
				userCode: authorization.userCode,
				verificationUri: authorization.verificationUri,
				expiresInMs: Math.max(0, expiresAtMs - Date.now()),
				pollAfterMs: pollIntervalMs
			};
		},
		pollAuthorization: (requestId) => getOrCreatePromise(devicePolls, requestId, () => pollOnce(requestId), { evictOnSettled: true }),
		cancelAuthorization: (requestId) => {
			if (committingRequests.has(requestId)) return false;
			const existed = readGitHubDeviceAuthorizationRecord(requestId) !== void 0;
			queueDeviceCleanup(requestId);
			return existed;
		},
		status,
		retireProfile: (profileId) => queueOAuthCleanup(profileId),
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
		maintain: maintainAll,
		start: () => {
			if (stopping) return;
			maintainAll();
			interval ??= setInterval(() => void maintainAll(), MAINTENANCE_INTERVAL_MS);
			interval.unref?.();
		},
		stop: async () => {
			clearGitHubCredentialVerificationCache();
			stopping = true;
			if (interval) {
				clearInterval(interval);
				interval = void 0;
			}
			deviceController.abort();
			const drain = (async () => {
				await Promise.allSettled([
					personal.stop(),
					...maintenance ? [maintenance] : [],
					...devicePolls.values(),
					...refreshes.values()
				]);
				if (pendingRefreshes.size > 0) await runMaintenance();
			})();
			let timeout;
			try {
				await Promise.race([drain, new Promise((resolve) => {
					timeout = setTimeout(resolve, SHUTDOWN_DRAIN_TIMEOUT_MS);
					timeout.unref?.();
				})]);
			} finally {
				if (timeout) clearTimeout(timeout);
			}
		}
	};
}
//#endregion
export { personalGitHubStatus as a, requestCurrentPersonalGitHubRefresh as i, installActiveGitHubOAuthLifecycle as n, requestCurrentGitHubOAuthRefresh as r, createGitHubOAuthLifecycle as t };
