import { t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as readDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./operator-scopes-D-CL26h0.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { s as registerOpenClawAgentDatabaseSyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { d as isIncognitoOpenClawAgentDatabase, g as retainAgentDatabase, n as cache } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { R as readUserProfileAliasRevision } from "./user-profiles-internal-BxQLnWfo.mjs";
import { s as resolveUserProfileId } from "./user-profiles-BA6bh7Le.mjs";
import { t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BNrKHiJ3.mjs";
import { i as hasCurrentGatewayOperatorAccess } from "./operator-access-policy-Dh1MoHMy.mjs";
import { u as captureSessionStoreReadCandidate } from "./session-sqlite-target-Dcog4O-M.mjs";
import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { t as CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT } from "./control-ui-contract-Dup6xL62.mjs";
import { E as createSessionListEntryFilter, tt as isGatewayClientProfilePending } from "./session-sharing-C4w_but1.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-CloOx2kv.mjs";
import path from "node:path";
import pLimit from "p-limit";
//#region src/gateway/control-ui-session-pr-read.ts
/** Git facts and cached snapshots belong to the recorded session and workspace source. */
function resolveControlUiSessionPrTarget(selected, preparedRepository) {
	const { cfg, agentId, canonicalKey, storePath, readSource, entry } = selected;
	if (!entry?.sessionId || !storePath || !readSource) return;
	let source;
	if (entry.repositoryWorkspaceId) {
		let repository = preparedRepository;
		if (repository === void 0) {
			const workspace = getSessionRepositoryWorkspaceStore().get(entry.repositoryWorkspaceId);
			repository = workspace?.agentId === agentId && workspace.sessionKey === canonicalKey ? workspace : null;
		}
		const remote = repository ? parseGitHubRemoteUrl(repository.url) : null;
		source = remote && repository ? {
			...remote,
			branch: repository.branch
		} : null;
	} else source = normalizeOptionalString(entry.spawnedCwd) ?? normalizeOptionalString(entry.spawnedWorkspaceDir) ?? normalizeOptionalString(resolveAgentWorkspaceDir(cfg, agentId)) ?? null;
	return {
		params: {
			sessionKey: canonicalKey,
			agentId
		},
		readSource,
		identity: JSON.stringify([
			agentId,
			canonicalKey,
			storePath,
			readSource?.agentId,
			readSource?.path,
			entry.sessionId,
			entry.lifecycleRevision,
			entry.repositoryWorkspaceId,
			entry.worktree?.id,
			source
		]),
		source
	};
}
/** A watcher may follow a replaced target, but never a replacement person or access grant. */
function prepareControlUiSessionPrRead(params) {
	const { client, sessionKey, agentId, getRuntimeConfig, getSessionRowProjection, isCurrentClient } = params;
	const actor = resolveGatewayOperatorRoleActor(client);
	const actorKind = actor?.kind;
	const actorProfile = actor?.kind === "operator" ? actor.profileId : void 0;
	const profileInput = client.authenticatedUserProfile?.profileId;
	const userInput = client.authenticatedUserId;
	const scopes = [...client.connect.scopes ?? []].toSorted().join("\0");
	const access = client.internal?.operatorAccessAuthority;
	const connectionSignal = client.connectionSignal;
	let aliasRevision = -1;
	const readCurrent = () => {
		try {
			const currentActor = resolveGatewayOperatorRoleActor(client);
			if (!isCurrentClient() || client.invalidated || (client.connect.role ?? "operator") !== "operator" || client.connectionSignal !== connectionSignal || connectionSignal?.aborted || isGatewayClientProfilePending(client) || client.authenticatedUserProfile?.profileId !== profileInput || client.authenticatedUserId !== userInput || currentActor?.kind !== actorKind || (currentActor?.kind === "operator" ? currentActor.profileId : void 0) !== actorProfile || [...client.connect.scopes ?? []].toSorted().join("\0") !== scopes || client.internal?.operatorAccessAuthority !== access || !hasCurrentGatewayOperatorAccess(access)) return;
			const currentAliasRevision = readUserProfileAliasRevision();
			if (currentAliasRevision !== aliasRevision) {
				if (actorProfile && resolveUserProfileId(actorProfile) !== actorProfile) return;
				aliasRevision = currentAliasRevision;
			}
			const cfg = getRuntimeConfig();
			if (authorizeCurrentOperatorRoleScopes(client, cfg) || !roleScopesAllow({
				role: "operator",
				requestedScopes: ["operator.read"],
				allowedScopes: client.connect.scopes ?? []
			})) return;
			const requested = resolveRequestedSessionAgentId(cfg, sessionKey, agentId);
			if (!requested.ok) return;
			const projection = getSessionRowProjection();
			if (!projection) return;
			const query = {
				key: sessionKey,
				agentId: requested.agentId
			};
			const selected = projection.capture(query);
			if (!selected?.entry || !projection.isCurrent(selected) || createSessionListEntryFilter({
				cfg,
				client
			})?.(selected.key, selected.entry) === false) return;
			const current = projection.describe(query, selected);
			const storePath = current?.storeTarget.storePath;
			if (!current || !storePath) return;
			return resolveControlUiSessionPrTarget({
				cfg,
				agentId: current.agentId,
				canonicalKey: current.key,
				storePath,
				readSource: {
					agentId: current.storeTarget.agentId,
					path: storePath
				},
				entry: current.entry
			}, current.materialized.row.repository ?? null);
		} catch {
			return;
		}
	};
	return readCurrent() ? readCurrent : void 0;
}
//#endregion
//#region src/gateway/control-ui-session-pr-source.ts
/** Retain source lifetime through the caller's last assertion and publication. */
async function withControlUiSessionPrSource(source, operation) {
	const target = {
		agentId: normalizeAgentId(source.agentId),
		path: path.resolve(source.path)
	};
	const unregister = [];
	let active = true;
	let releaseNative = () => {};
	const changed = () => /* @__PURE__ */ new Error("Session PR source changed or closed. Retry the request.");
	try {
		let paths;
		let assertSource;
		let sourceIdentity;
		if (isIncognitoOpenClawAgentSqlitePath(target.path, target)) {
			const database = cache.databases.get(target.path);
			if (!database?.db.isOpen || database.agentId !== target.agentId || !isIncognitoOpenClawAgentDatabase(database)) throw changed();
			releaseNative = retainAgentDatabase(database.db);
			const claim = createOpenClawAgentDatabaseClaim(database, releaseNative);
			releaseNative = claim.release;
			sourceIdentity = `incognito:${claim.incarnation}`;
			paths = [target.path];
			assertSource = () => {
				claim.assertCurrent();
				if (cache.databases.get(target.path) !== database || !isIncognitoOpenClawAgentDatabase(database)) throw changed();
			};
		} else {
			const candidate = captureSessionStoreReadCandidate(target.path);
			const identity = readDatabasePathIdentitySync(candidate.path);
			if (!identity.key.startsWith("file:") || identity.canonicalPath !== candidate.physicalPath) throw changed();
			sourceIdentity = identity.key;
			paths = [.../* @__PURE__ */ new Set([candidate.path, candidate.physicalPath])];
			assertSource = () => {
				const current = readDatabasePathIdentitySync(candidate.path);
				if (current.key !== identity.key || current.canonicalPath !== candidate.physicalPath) throw changed();
			};
		}
		for (const pathname of paths) unregister.push(registerOpenClawAgentDatabaseSyncResource({
			agentId: target.agentId,
			path: pathname,
			revoke: () => {
				active = false;
			},
			close: () => releaseNative()
		}));
		const assertCurrent = () => {
			if (!active) throw changed();
			assertSource();
		};
		assertCurrent();
		return await operation(assertCurrent, sourceIdentity);
	} finally {
		active = false;
		for (const release of unregister.toReversed()) release();
		releaseNative();
	}
}
//#endregion
//#region src/gateway/control-ui-session-pr-subscriptions.ts
const CONTROL_UI_SESSION_PR_POLL_INTERVAL_MS = 6e4;
const CONTROL_UI_SESSION_PR_REFRESH_INTERVAL_MS = 1e4;
const CONTROL_UI_SESSION_PR_LOAD_CONCURRENCY = 4;
async function loadSessionPullRequests(params, cacheSignal, read) {
	read.assertCurrent();
	const { loadControlUiSessionPullRequests } = await import("./control-ui-session-prs-B3R1fmSR.mjs");
	return loadControlUiSessionPullRequests(params, {
		cacheSignal,
		read
	});
}
function pushedSnapshot(result) {
	return {
		...result,
		status: result.status ?? (result.rateLimited ? "rate-limited" : "ready")
	};
}
const UNAVAILABLE_SNAPSHOT = {
	pullRequests: [],
	rateLimited: false,
	status: "unavailable"
};
function parseSessionKeys(value) {
	if (!Array.isArray(value) || value.length > 200) return null;
	const keys = /* @__PURE__ */ new Set();
	for (const entry of value) {
		if (typeof entry !== "string") return null;
		const key = entry.trim();
		if (!key || key.length > 512) return null;
		keys.add(key);
	}
	return [...keys];
}
function parseControlUiSessionPullRequestsSubscribeParams(value) {
	if (!value || typeof value !== "object" || !("sessionKeys" in value)) return null;
	const raw = value;
	const sessionKeys = parseSessionKeys(raw.sessionKeys);
	const refreshSessionKeys = raw.refreshSessionKeys === void 0 ? [] : parseSessionKeys(raw.refreshSessionKeys);
	if (!sessionKeys || !refreshSessionKeys) return null;
	const watched = new Set(sessionKeys);
	for (const key of refreshSessionKeys) if (!watched.has(key)) return null;
	return {
		sessionKeys,
		refreshSessionKeys
	};
}
/**
* Owns the union of connection replace-sets. Only this union drives GitHub
* refreshes, so hidden/disconnected clients cannot leave orphan polling work.
*/
function createControlUiSessionPullRequestSubscriptions(deps) {
	const subscriptions = /* @__PURE__ */ new Map();
	const keyStates = /* @__PURE__ */ new Map();
	const inflight = /* @__PURE__ */ new Map();
	const setTimer = deps.setTimer ?? globalThis.setTimeout;
	const clearTimer = deps.clearTimer ?? globalThis.clearTimeout;
	const limit = pLimit(CONTROL_UI_SESSION_PR_LOAD_CONCURRENCY);
	const customLoad = deps.load;
	const load = customLoad ?? loadSessionPullRequests;
	const withSource = (target, operation) => customLoad ? operation(() => {}, target.identity) : withControlUiSessionPrSource(target.readSource, operation);
	let timer = null;
	const scope = new AsyncWorkScope();
	let stopPromise;
	const removeMemberships = (connId, previous, retained) => {
		for (const key of previous?.keys() ?? []) if (!retained?.has(key)) {
			const state = keyStates.get(key);
			state?.connIds.delete(connId);
			if (state?.connIds.size === 0) {
				state.cancelRefresh?.();
				state.cacheLifetime.abort(null);
				keyStates.delete(key);
			}
		}
	};
	const stateForTarget = (sessionKey, target, sourceIdentity) => {
		const previous = keyStates.get(sessionKey);
		if (previous?.target.identity === target.identity && (sourceIdentity === void 0 || previous.sourceIdentity === void 0 || previous.sourceIdentity === sourceIdentity)) {
			previous.sourceIdentity ??= sourceIdentity;
			return previous;
		}
		previous?.cancelRefresh?.();
		previous?.cacheLifetime.abort(null);
		const state = {
			connIds: new Set(previous?.connIds),
			target,
			sourceIdentity,
			cacheLifetime: new AbortController()
		};
		keyStates.set(sessionKey, state);
		return state;
	};
	const currentWatcher = (connId, sessionKey) => {
		const subscription = subscriptions.get(connId);
		const watched = subscription?.get(sessionKey);
		const target = deps.isConnectionActive?.(connId) === false ? void 0 : watched?.readCurrent();
		if (!watched || !target) {
			subscription?.delete(sessionKey);
			const state = keyStates.get(sessionKey);
			state?.connIds.delete(connId);
			if (state?.connIds.size === 0) {
				state.cancelRefresh?.();
				state.cacheLifetime.abort(null);
				keyStates.delete(sessionKey);
			}
			if (subscription?.size === 0) unsubscribe(connId);
			return;
		}
		if (watched.target.identity !== target.identity) {
			watched.target = target;
			watched.delivered = void 0;
		}
		stateForTarget(sessionKey, target).connIds.add(connId);
		return watched;
	};
	const currentKeyState = (sessionKey) => {
		for (const connId of keyStates.get(sessionKey)?.connIds ?? []) currentWatcher(connId, sessionKey);
		return keyStates.get(sessionKey);
	};
	const loadSnapshot = (sessionKey, isCurrent, refresh = false) => {
		const targetState = currentKeyState(sessionKey);
		if (scope.isClosing || !targetState || !isCurrent()) return Promise.resolve(UNAVAILABLE_SNAPSHOT);
		return withSource(targetState.target, async (assertSourceCurrent, sourceIdentity) => {
			const state = stateForTarget(sessionKey, targetState.target, sourceIdentity);
			const pending = inflight.get(sessionKey);
			if (pending) {
				if (pending.state === state && (!refresh || pending.refresh)) {
					pending.demands.add(isCurrent);
					return pending.promise;
				}
				await pending.promise;
				assertSourceCurrent();
				return currentKeyState(sessionKey) === state && isCurrent() ? loadSnapshot(sessionKey, isCurrent, refresh) : UNAVAILABLE_SNAPSHOT;
			}
			const demands = /* @__PURE__ */ new Set([isCurrent]);
			const promise = scope.track(async () => {
				const delay = refresh ? (state.refreshedAt ?? -Infinity) + CONTROL_UI_SESSION_PR_REFRESH_INTERVAL_MS - Date.now() : 0;
				if (delay > 0) {
					await new Promise((resolve) => {
						const refreshTimer = setTimer(resolve, delay);
						refreshTimer.unref?.();
						state.cancelRefresh = () => {
							clearTimer(refreshTimer);
							resolve();
						};
					});
					state.cancelRefresh = void 0;
				}
				return await limit(async () => {
					if (!Array.from(demands).some((current) => current()) || currentKeyState(sessionKey) !== state) return UNAVAILABLE_SNAPSHOT;
					if (refresh) state.refreshedAt = Date.now();
					const snapshot = await load({
						...state.target.params,
						...refresh ? { refresh: true } : {}
					}, state.cacheLifetime.signal, {
						target: state.target,
						sourceIdentity,
						assertCurrent: () => {
							assertSourceCurrent();
							if (scope.isClosing || !Array.from(demands).some((current) => current()) || currentKeyState(sessionKey) !== state) throw new Error("Session pull-request watchers changed");
						}
					}).then(pushedSnapshot).catch(() => ({ ...UNAVAILABLE_SNAPSHOT }));
					if (currentKeyState(sessionKey) === state) {
						assertSourceCurrent();
						const hash = JSON.stringify(snapshot);
						const changed = state.hash !== hash;
						Object.assign(state, {
							hash,
							snapshot
						});
						if (changed) push(new Set(state.connIds), sessionKey, state, snapshot, assertSourceCurrent);
					}
					return snapshot;
				});
			}).catch(() => UNAVAILABLE_SNAPSHOT).finally(() => {
				if (inflight.get(sessionKey)?.promise === promise) inflight.delete(sessionKey);
			});
			inflight.set(sessionKey, {
				promise,
				refresh,
				state,
				demands
			});
			return promise;
		}).catch(() => UNAVAILABLE_SNAPSHOT);
	};
	const push = (connIds, sessionKey, state, snapshot, assertSourceCurrent) => {
		if (connIds.size === 0) return;
		const sessions = Object.create(null);
		sessions[sessionKey] = snapshot;
		for (const connId of connIds) {
			const watched = currentWatcher(connId, sessionKey);
			if (!watched || keyStates.get(sessionKey) !== state) continue;
			assertSourceCurrent();
			deps.broadcastToConnIds(CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT, { sessions }, /* @__PURE__ */ new Set([connId]), {
				sessionKeys: [state.target.params.sessionKey],
				agentId: state.target.params.agentId
			});
			if (subscriptions.get(connId)?.get(sessionKey) === watched) watched.delivered = snapshot;
		}
	};
	const schedulePoll = () => {
		if (scope.isClosing || timer !== null || subscriptions.size === 0) return;
		timer = setTimer(() => {
			timer = null;
			pollNow().finally(schedulePoll);
		}, CONTROL_UI_SESSION_PR_POLL_INTERVAL_MS);
		timer.unref?.();
	};
	const pollNow = () => {
		if (scope.isClosing) return Promise.resolve();
		return scope.track(async () => {
			await Promise.all(Array.from(keyStates.keys(), (sessionKey) => loadSnapshot(sessionKey, () => keyStates.has(sessionKey))));
		});
	};
	const replace = (connId, sessionKeys, refreshSessionKeys = /* @__PURE__ */ new Set()) => {
		if (scope.isClosing) return Promise.resolve();
		return scope.track(async () => {
			const normalizedConnId = connId.trim();
			if (!normalizedConnId || deps.isConnectionActive?.(normalizedConnId) === false) return;
			const previousSubscription = subscriptions.get(normalizedConnId);
			const subscription = /* @__PURE__ */ new Map();
			for (const key of sessionKeys) {
				const parsed = parseAgentSessionKey(key);
				const session = parsed?.rest === "global" ? {
					sessionKey: "global",
					agentId: parsed.agentId
				} : { sessionKey: key };
				const previous = previousSubscription?.get(key);
				const readCurrent = previous?.readCurrent() ? previous.readCurrent : deps.prepareRead(normalizedConnId, session);
				const target = readCurrent?.();
				if (!readCurrent || !target) continue;
				subscription.set(key, previous?.target.identity === target.identity && readCurrent === previous.readCurrent ? previous : {
					readCurrent,
					target
				});
			}
			if (subscription.size === 0) {
				unsubscribe(normalizedConnId);
				return;
			}
			subscriptions.set(normalizedConnId, subscription);
			removeMemberships(normalizedConnId, previousSubscription, subscription);
			for (const [key, watched] of subscription) stateForTarget(key, watched.target).connIds.add(normalizedConnId);
			schedulePoll();
			await Promise.all(Array.from(subscription, async ([sessionKey, watched]) => {
				const targetState = currentKeyState(sessionKey);
				if (!targetState) return;
				return withSource(targetState.target, async (assertSourceCurrent, sourceIdentity) => {
					const state = stateForTarget(sessionKey, targetState.target, sourceIdentity);
					const isCurrent = () => subscriptions.get(normalizedConnId)?.get(sessionKey) === watched;
					const refresh = refreshSessionKeys.has(sessionKey);
					const cached = refresh ? void 0 : state.snapshot;
					if (cached) {
						if (!watched.delivered) push(/* @__PURE__ */ new Set([normalizedConnId]), sessionKey, state, cached, assertSourceCurrent);
						return;
					}
					const snapshot = await loadSnapshot(sessionKey, isCurrent, refresh);
					assertSourceCurrent();
					if (isCurrent() && (refresh ? watched.delivered !== snapshot : !watched.delivered)) push(/* @__PURE__ */ new Set([normalizedConnId]), sessionKey, state, snapshot, assertSourceCurrent);
				}).catch(() => {});
			}));
		});
	};
	const unsubscribe = (connId) => {
		const normalizedConnId = connId.trim();
		if (!normalizedConnId) return;
		removeMemberships(normalizedConnId, subscriptions.get(normalizedConnId));
		subscriptions.delete(normalizedConnId);
		if (subscriptions.size === 0 && timer !== null) {
			clearTimer(timer);
			timer = null;
		}
	};
	const stop = () => {
		if (stopPromise) return stopPromise;
		scope.beginClose();
		if (timer !== null) {
			clearTimer(timer);
			timer = null;
		}
		subscriptions.clear();
		for (const state of keyStates.values()) {
			state.cancelRefresh?.();
			state.cacheLifetime.abort(null);
		}
		keyStates.clear();
		stopPromise = scope.drain().then(() => {
			inflight.clear();
		});
		return stopPromise;
	};
	return {
		replace,
		unsubscribe,
		pollNow,
		stop
	};
}
//#endregion
export { resolveControlUiSessionPrTarget as a, prepareControlUiSessionPrRead as i, parseControlUiSessionPullRequestsSubscribeParams as n, withControlUiSessionPrSource as r, createControlUiSessionPullRequestSubscriptions as t };
