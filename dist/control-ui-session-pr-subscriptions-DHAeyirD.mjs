import { a as runInDetachedAsyncContext, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { h as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { s as registerOpenClawAgentDatabaseSyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { p as isIncognitoOpenClawAgentDatabase, t as cache, y as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { c as captureSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { t as CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT } from "./control-ui-contract-B_YMMx3J.mjs";
import { n as prepareControlUiSessionPrServiceTarget } from "./control-ui-session-pr-read-Bt_DBpus.mjs";
import path from "node:path";
import pLimit from "p-limit";
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
//#region src/gateway/control-ui-session-pr-snapshot-read.ts
async function loadSessionPullRequests(params, cacheSignal, read) {
	read.assertCurrent();
	const { loadControlUiSessionPullRequests } = await import("./control-ui-session-prs-C43MoyEq.mjs");
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
/** One-shot reads reuse the subscription owner's lifetime, loader and concurrency. */
function createControlUiSessionPrSnapshotRead(deps) {
	return (target, assertCurrent, projection) => {
		const assertActive = () => {
			if (deps.scope.isClosing) throw new Error("Session pull-request owner is closed");
			assertCurrent();
			target.assertCurrent?.();
		};
		assertActive();
		return deps.scope.track(() => deps.limit(async () => {
			assertActive();
			return await deps.withSource(target, async (assertSourceCurrent, sourceIdentity) => {
				const assertReadCurrent = () => {
					assertActive();
					assertSourceCurrent();
				};
				assertReadCurrent();
				try {
					const result = await deps.load(target.params, void 0, {
						target,
						sourceIdentity,
						projection,
						assertCurrent: assertReadCurrent
					});
					assertReadCurrent();
					const snapshot = pushedSnapshot(result);
					if (projection !== "publication") deps.publish?.(target, snapshot);
					return snapshot;
				} catch {
					assertReadCurrent();
					if (projection !== "publication") deps.publish?.(target, UNAVAILABLE_SNAPSHOT);
					return { ...UNAVAILABLE_SNAPSHOT };
				}
			});
		}));
	};
}
//#endregion
//#region src/gateway/control-ui-session-pr-prepared-read.ts
/** Background readers publish into the subscription owner's existing cells and concurrency. */
function createControlUiSessionPrPreparedRead(deps) {
	const { scope, limit, withSource, load, keyStates, stateForTarget } = deps;
	const preparing = /* @__PURE__ */ new Map();
	const publishSnapshot = (state, snapshot) => {
		const changed = JSON.stringify(state.snapshot) !== JSON.stringify(snapshot);
		state.snapshot = snapshot;
		if (changed && state.prepared) sessionChanges.emit({
			...state.target.params,
			scope: "runtime"
		});
	};
	const read = createControlUiSessionPrSnapshotRead({
		scope,
		limit,
		withSource,
		load,
		publish: (target, snapshot) => {
			const state = keyStates.get(target.params.sessionKey);
			if (state?.prepared && state.snapshot === void 0 && state.target.identity === target.identity) publishSnapshot(state, snapshot);
		}
	});
	const readPrepared = (target) => {
		if (scope.isClosing) return;
		const state = stateForTarget(target.params.sessionKey, target);
		const preparedTarget = state.target;
		state.prepared = true;
		if (target.source === null) state.snapshot ??= {
			pullRequests: [],
			rateLimited: false,
			status: "ready"
		};
		const getProjection = deps.getSessionRowProjection;
		if (!state.snapshot && !preparing.has(state) && getProjection) {
			const promise = runInDetachedAsyncContext(() => scope.track(async () => {
				const current = await limit(async () => {
					if (scope.isClosing || keyStates.get(preparedTarget.params.sessionKey) !== state) return;
					return await prepareControlUiSessionPrServiceTarget(getProjection, preparedTarget.params);
				});
				if (!current) return;
				const assertCurrent = () => {
					if (scope.isClosing || keyStates.get(preparedTarget.params.sessionKey) !== state || current.identity !== preparedTarget.identity) throw new Error("Prepared session pull-request target changed");
					current.assertCurrent?.();
				};
				assertCurrent();
				await read(current, assertCurrent);
			})).catch(() => {}).finally(() => preparing.delete(state));
			preparing.set(state, promise);
		}
		return state.snapshot;
	};
	return {
		read,
		readPrepared,
		publishSnapshot,
		settle: () => Promise.allSettled(preparing.values()),
		stop: sessionChanges.subscribeFacts((change) => {
			if ("sessionKey" in change && (change.facts?.kind === "unchanged" || change.scope === "runtime" && !change.facts && !change.factsInvalidated)) return;
			const affected = "sessionKey" in change ? [[change.sessionKey, keyStates.get(change.sessionKey)]] : keyStates;
			const invalidated = [];
			for (const [key, state] of affected) if (state?.prepared) {
				state.snapshot = void 0;
				if (state.connIds.size === 0) {
					state.cacheLifetime.abort(null);
					keyStates.delete(key);
				}
				invalidated.push(state.target.params);
			}
			if (!("sessionKey" in change)) sessionChanges.emitBatch(invalidated.map(({ sessionKey, agentId }) => ({
				sessionKey,
				agentId,
				scope: "runtime"
			})));
		})
	};
}
//#endregion
//#region src/gateway/control-ui-session-pr-subscriptions.ts
const CONTROL_UI_SESSION_PR_POLL_INTERVAL_MS = 6e4;
const CONTROL_UI_SESSION_PR_REFRESH_INTERVAL_MS = 1e4;
const CONTROL_UI_SESSION_PR_LOAD_CONCURRENCY = 4;
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
	const replacements = /* @__PURE__ */ new Set();
	const replacementGenerations = /* @__PURE__ */ new Map();
	const pendingAdmissions = /* @__PURE__ */ new Map();
	const keyStates = /* @__PURE__ */ new Map();
	const inflight = /* @__PURE__ */ new Map();
	const scheduler = deps.scheduler.scope();
	const limit = pLimit(CONTROL_UI_SESSION_PR_LOAD_CONCURRENCY);
	const customLoad = deps.load;
	const load = customLoad ?? loadSessionPullRequests;
	const withSource = (target, operation) => customLoad ? operation(() => {}, target.identity) : withControlUiSessionPrSource(target.readSource, operation);
	let pollJob;
	const scope = new AsyncWorkScope();
	let stopPromise;
	const retireKeyStateIfUnused = (sessionKey, state) => {
		if (!state || state.prepared || state.connIds.size > 0 || [...pendingAdmissions.get(sessionKey) ?? []].some((isCurrent) => isCurrent())) return;
		state.cancelRefresh?.();
		state.cacheLifetime.abort(null);
		if (keyStates.get(sessionKey) === state) keyStates.delete(sessionKey);
	};
	const removeMemberships = (connId, previous, retained) => {
		for (const key of previous?.keys() ?? []) if (!retained?.has(key)) {
			const state = keyStates.get(key);
			state?.connIds.delete(connId);
			retireKeyStateIfUnused(key, state);
		}
	};
	const stateForTarget = (sessionKey, target, sourceIdentity) => {
		const { assertCurrent: _assertCurrent, ...preparedTarget } = target;
		const previous = keyStates.get(sessionKey);
		if (previous?.target.identity === target.identity && (sourceIdentity === void 0 || previous.sourceIdentity === void 0 || previous.sourceIdentity === sourceIdentity)) {
			previous.target = preparedTarget;
			previous.sourceIdentity ??= sourceIdentity;
			return previous;
		}
		previous?.cancelRefresh?.();
		previous?.cacheLifetime.abort(null);
		const state = {
			connIds: new Set(previous?.connIds),
			target: preparedTarget,
			watchLifetime: previous?.watchLifetime ?? {},
			prepared: previous?.prepared,
			sourceIdentity,
			cacheLifetime: new AbortController()
		};
		keyStates.set(sessionKey, state);
		return state;
	};
	const prepared = createControlUiSessionPrPreparedRead({
		scope,
		limit,
		withSource,
		load,
		keyStates,
		stateForTarget,
		getSessionRowProjection: deps.getSessionRowProjection
	});
	const currentWatcher = async (connId, sessionKey) => {
		const watched = subscriptions.get(connId)?.get(sessionKey);
		const target = deps.isConnectionActive?.(connId) === false ? void 0 : await watched?.readCurrent();
		const subscription = subscriptions.get(connId);
		if (scope.isClosing || subscription?.get(sessionKey) !== watched) return;
		if (deps.isConnectionActive?.(connId) === false) {
			unsubscribe(connId);
			return;
		}
		if (!watched || !target) {
			subscription?.delete(sessionKey);
			const state = keyStates.get(sessionKey);
			state?.connIds.delete(connId);
			retireKeyStateIfUnused(sessionKey, state);
			if (subscription?.size === 0) {
				subscriptions.delete(connId);
				if (subscriptions.size === 0) {
					pollJob?.cancel();
					pollJob = void 0;
				}
			}
			return;
		}
		if (watched.target.identity !== target.identity) watched.deliveredHash = void 0;
		watched.target = target;
		stateForTarget(sessionKey, target).connIds.add(connId);
		return {
			watched,
			target
		};
	};
	const currentKeyState = async (sessionKey) => {
		for (const connId of keyStates.get(sessionKey)?.connIds ?? []) await currentWatcher(connId, sessionKey);
		return keyStates.get(sessionKey);
	};
	const loadSnapshot = async (sessionKey, isCurrent, refresh) => {
		const targetState = await currentKeyState(sessionKey);
		if (scope.isClosing || !targetState || !isCurrent()) return UNAVAILABLE_SNAPSHOT;
		return withSource(targetState.target, async (assertSourceCurrent, sourceIdentity) => {
			const state = stateForTarget(sessionKey, targetState.target, sourceIdentity);
			const pending = inflight.get(sessionKey);
			if (pending) {
				if (pending.state === state && (!refresh || pending.refresh)) {
					pending.demands.add(isCurrent);
					if (refresh && refresh.watched.refreshPending === refresh.generation) pending.refreshRequests.set(refresh.watched, refresh.generation);
					return pending.promise;
				}
				await pending.promise;
				assertSourceCurrent();
				return await currentKeyState(sessionKey) === state && isCurrent() ? loadSnapshot(sessionKey, isCurrent, refresh) : UNAVAILABLE_SNAPSHOT;
			}
			const demands = /* @__PURE__ */ new Set([isCurrent]);
			const refreshRequests = /* @__PURE__ */ new Map();
			if (refresh && refresh.watched.refreshPending === refresh.generation) refreshRequests.set(refresh.watched, refresh.generation);
			const promise = scope.track(async () => {
				const delay = refresh ? (state.refreshedAt ?? -Infinity) + CONTROL_UI_SESSION_PR_REFRESH_INTERVAL_MS - scheduler.now() : 0;
				if (delay > 0) {
					await new Promise((resolve) => {
						const refreshJob = scheduler.schedule({
							id: `control-ui-session-pr-refresh:${sessionKey}`,
							delayMs: delay,
							run: resolve
						});
						state.cancelRefresh = () => {
							refreshJob.cancel();
							resolve();
						};
					});
					state.cancelRefresh = void 0;
				}
				return await limit(async () => {
					if (!Array.from(demands).some((current) => current()) || await currentKeyState(sessionKey) !== state) return UNAVAILABLE_SNAPSHOT;
					if (refresh) state.refreshedAt = scheduler.now();
					const snapshot = await load({
						...state.target.params,
						...refresh ? { refresh: true } : {}
					}, state.cacheLifetime.signal, {
						target: state.target,
						sourceIdentity,
						assertCurrent: () => {
							assertSourceCurrent();
							if (scope.isClosing || !Array.from(demands).some((current) => current()) || keyStates.get(sessionKey) !== state) throw new Error("Session pull-request watchers changed");
							for (const connId of state.connIds) {
								const watched = subscriptions.get(connId)?.get(sessionKey);
								if (!watched || watched.target.identity !== state.target.identity || deps.isConnectionActive?.(connId) === false) continue;
								try {
									watched.target.assertCurrent?.();
									return;
								} catch {}
							}
							throw new Error("Session pull-request watchers changed");
						}
					}).then(pushedSnapshot).catch(() => ({ ...UNAVAILABLE_SNAPSHOT }));
					if (await currentKeyState(sessionKey) === state) {
						assertSourceCurrent();
						prepared.publishSnapshot(state, snapshot);
						await push(new Set(state.connIds), sessionKey, state, snapshot, assertSourceCurrent, refreshRequests);
					}
					return snapshot;
				});
			}).catch(() => UNAVAILABLE_SNAPSHOT).finally(() => {
				if (inflight.get(sessionKey)?.promise === promise) inflight.delete(sessionKey);
			});
			inflight.set(sessionKey, {
				promise,
				refresh: Boolean(refresh),
				refreshRequests,
				state,
				demands
			});
			return promise;
		}).catch(() => UNAVAILABLE_SNAPSHOT);
	};
	const push = (connIds, sessionKey, state, snapshot, assertSourceCurrent, refreshRequests) => {
		if (connIds.size === 0) return Promise.resolve();
		const hash = JSON.stringify(snapshot);
		const isDelivered = (watched) => {
			const request = refreshRequests?.get(watched);
			return (!request || watched.refreshPending !== request) && watched.deliveredHash === hash;
		};
		const stateDelivery = (state.delivery ?? Promise.resolve()).then(async () => {
			const sessions = Object.create(null);
			sessions[sessionKey] = snapshot;
			for (const connId of connIds) {
				const watched = subscriptions.get(connId)?.get(sessionKey);
				if (!watched || isDelivered(watched)) continue;
				const delivery = (watched.delivery ?? Promise.resolve()).then(async () => {
					const current = await currentWatcher(connId, sessionKey);
					if (!current || scope.isClosing || current.watched !== watched || subscriptions.get(connId)?.get(sessionKey) !== watched || deps.isConnectionActive?.(connId) === false || keyStates.get(sessionKey) !== state || isDelivered(watched)) return;
					assertSourceCurrent();
					try {
						current.target.assertCurrent?.();
					} catch {
						return;
					}
					const refreshRequest = refreshRequests?.get(watched);
					deps.broadcastToConnIds(CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT, { sessions }, /* @__PURE__ */ new Set([connId]), {
						sessionKeys: [state.target.params.sessionKey],
						agentId: state.target.params.agentId
					});
					if (subscriptions.get(connId)?.get(sessionKey) === watched) {
						watched.deliveredHash = hash;
						if (refreshRequest && watched.refreshPending === refreshRequest) delete watched.refreshPending;
					}
				}).finally(() => {
					if (watched.delivery === delivery) delete watched.delivery;
				});
				watched.delivery = delivery;
				await delivery;
			}
		}).finally(() => {
			if (state.delivery === stateDelivery) delete state.delivery;
		});
		state.delivery = stateDelivery;
		return stateDelivery;
	};
	const schedulePoll = () => {
		if (scope.isClosing || pollJob || subscriptions.size === 0) return;
		pollJob = scheduler.schedule({
			id: "control-ui-session-pr-poll",
			atMs: scheduler.now() + CONTROL_UI_SESSION_PR_POLL_INTERVAL_MS,
			everyMs: CONTROL_UI_SESSION_PR_POLL_INTERVAL_MS,
			run: pollNow
		});
	};
	const pollNow = () => {
		if (scope.isClosing) return Promise.resolve();
		return scope.track(async () => {
			const loads = [];
			for (const [sessionKey, state] of keyStates) if (state.connIds.size > 0) {
				const watchLifetime = state.watchLifetime;
				loads.push(loadSnapshot(sessionKey, () => keyStates.get(sessionKey)?.watchLifetime === watchLifetime));
			}
			await Promise.all([
				Promise.allSettled(replacements),
				prepared.settle(),
				...loads
			]);
		});
	};
	const replace = (connId, sessionKeys, refreshSessionKeys = /* @__PURE__ */ new Set(), onAdmitted) => {
		let admitted = false;
		const admit = () => {
			if (!admitted) {
				admitted = true;
				onAdmitted?.();
			}
		};
		if (scope.isClosing) {
			admit();
			return Promise.resolve();
		}
		const normalizedConnId = connId.trim();
		if (!normalizedConnId || deps.isConnectionActive?.(normalizedConnId) === false) {
			unsubscribe(normalizedConnId);
			admit();
			return Promise.resolve();
		}
		const previousGeneration = replacementGenerations.get(normalizedConnId);
		const retainedKeys = new Set(sessionKeys.filter((key) => keyStates.has(key)));
		const generation = { retainedKeys };
		replacementGenerations.set(normalizedConnId, generation);
		for (const key of sessionKeys) {
			const watched = subscriptions.get(normalizedConnId)?.get(key);
			if (watched && refreshSessionKeys.has(key)) watched.refreshPending = generation;
		}
		const isCurrentReplacement = () => !scope.isClosing && replacementGenerations.get(normalizedConnId) === generation;
		const replacement = scope.track(async () => {
			for (const key of retainedKeys) {
				const admissions = pendingAdmissions.get(key) ?? /* @__PURE__ */ new Set();
				admissions.add(isCurrentReplacement);
				pendingAdmissions.set(key, admissions);
			}
			try {
				for (const key of previousGeneration?.retainedKeys ?? []) retireKeyStateIfUnused(key, keyStates.get(key));
				const previousSubscription = subscriptions.get(normalizedConnId);
				const subscription = /* @__PURE__ */ new Map();
				for (const key of sessionKeys) {
					const parsed = parseAgentSessionKey(key);
					const session = parsed?.rest === "global" ? {
						sessionKey: "global",
						agentId: parsed.agentId
					} : { sessionKey: key };
					const previous = previousSubscription?.get(key);
					const readCurrent = previous && await previous.readCurrent() ? previous.readCurrent : await deps.prepareRead(normalizedConnId, session);
					const target = await readCurrent?.();
					if (!readCurrent || !target) continue;
					const next = previous?.target.identity === target.identity && readCurrent === previous.readCurrent ? previous : {
						readCurrent,
						target
					};
					if (next !== previous && refreshSessionKeys.has(key)) next.refreshPending = generation;
					subscription.set(key, next);
				}
				const currentReplacement = isCurrentReplacement();
				if (!currentReplacement) {
					const current = subscriptions.get(normalizedConnId);
					for (const [key, watched] of subscription) if (!refreshSessionKeys.has(key) || current?.get(key) !== watched || watched.refreshPending !== generation) subscription.delete(key);
				}
				if (subscription.size === 0) {
					if (currentReplacement) unsubscribe(normalizedConnId);
					admit();
					return;
				}
				if (currentReplacement) {
					subscriptions.set(normalizedConnId, subscription);
					removeMemberships(normalizedConnId, previousSubscription, subscription);
					for (const [key, watched] of subscription) stateForTarget(key, watched.target).connIds.add(normalizedConnId);
					schedulePoll();
				}
				admit();
				await Promise.all(Array.from(subscription, async ([sessionKey, watched]) => {
					const targetState = await currentKeyState(sessionKey);
					if (!targetState) return;
					return withSource(targetState.target, async (assertSourceCurrent, sourceIdentity) => {
						const state = stateForTarget(sessionKey, targetState.target, sourceIdentity);
						const isCurrent = () => subscriptions.get(normalizedConnId)?.get(sessionKey) === watched;
						const refresh = refreshSessionKeys.has(sessionKey);
						const cached = refresh ? void 0 : state.snapshot;
						if (cached) {
							if (!watched.deliveredHash) await push(/* @__PURE__ */ new Set([normalizedConnId]), sessionKey, state, cached, assertSourceCurrent);
							return;
						}
						const snapshot = await loadSnapshot(sessionKey, isCurrent, refresh ? {
							watched,
							generation
						} : void 0);
						assertSourceCurrent();
						if (isCurrent() && (refresh ? watched.refreshPending === generation : !watched.deliveredHash)) await push(/* @__PURE__ */ new Set([normalizedConnId]), sessionKey, state, snapshot, assertSourceCurrent, refresh ? /* @__PURE__ */ new Map([[watched, generation]]) : void 0);
					}).catch(() => {});
				}));
			} finally {
				admit();
				for (const key of retainedKeys) {
					const admissions = pendingAdmissions.get(key);
					admissions?.delete(isCurrentReplacement);
					if (admissions?.size === 0) pendingAdmissions.delete(key);
					retireKeyStateIfUnused(key, keyStates.get(key));
				}
			}
		});
		replacements.add(replacement);
		const releaseReplacement = () => {
			replacements.delete(replacement);
			if (replacementGenerations.get(normalizedConnId) === generation) replacementGenerations.delete(normalizedConnId);
		};
		replacement.then(releaseReplacement, releaseReplacement);
		return replacement;
	};
	const unsubscribe = (connId) => {
		const normalizedConnId = connId.trim();
		if (!normalizedConnId) return;
		const generation = replacementGenerations.get(normalizedConnId);
		replacementGenerations.delete(normalizedConnId);
		removeMemberships(normalizedConnId, subscriptions.get(normalizedConnId));
		subscriptions.delete(normalizedConnId);
		for (const key of generation?.retainedKeys ?? []) retireKeyStateIfUnused(key, keyStates.get(key));
		if (subscriptions.size === 0) {
			pollJob?.cancel();
			pollJob = void 0;
		}
	};
	const stop = () => {
		if (stopPromise) return stopPromise;
		scope.beginClose();
		scheduler.beginClose();
		prepared.stop();
		subscriptions.clear();
		replacementGenerations.clear();
		replacements.clear();
		for (const state of keyStates.values()) {
			state.cancelRefresh?.();
			state.cacheLifetime.abort(null);
		}
		keyStates.clear();
		stopPromise = Promise.all([scope.drain(), scheduler.stop()]).then(() => {
			inflight.clear();
		});
		return stopPromise;
	};
	return {
		read: prepared.read,
		readPrepared: prepared.readPrepared,
		replace,
		unsubscribe,
		pollNow,
		stop
	};
}
//#endregion
export { parseControlUiSessionPullRequestsSubscribeParams as n, withControlUiSessionPrSource as r, createControlUiSessionPullRequestSubscriptions as t };
