import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-JTQRB4fe.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT } from "./control-ui-contract-IX_0OA0h.mjs";
import { n as prepareControlUiSessionPrServiceTarget } from "./control-ui-session-pr-read-CfmRdkBJ.mjs";
import { t as withControlUiSessionPrSource } from "./control-ui-session-pr-source-BLg5MhE6.mjs";
import pLimit from "p-limit";
//#region src/gateway/control-ui-session-pr-prepared-read.ts
async function loadSessionPullRequests(params, cacheSignal, read) {
	read.assertCurrent();
	const { loadControlUiSessionPullRequests } = await import("./control-ui-session-prs-B45RvsMZ.mjs");
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
/** Background readers publish into the subscription owner's existing cells and concurrency. */
function createControlUiSessionPrPreparedRead(deps) {
	const { scope, limit, withSource, load, keyStates, stateForTarget } = deps;
	const spawnBroker = getSpawnBroker();
	const preparing = /* @__PURE__ */ new Map();
	const publishSnapshot = (state, snapshot) => {
		const changed = JSON.stringify(state.snapshot) !== JSON.stringify(snapshot);
		state.snapshot = snapshot;
		if (changed && state.prepared) sessionChanges.emit({
			...state.target.params,
			scope: "runtime"
		});
	};
	const read = (target, assertCurrent, projection) => {
		const state = keyStates.get(target.params.sessionKey);
		const previous = state?.snapshot;
		const assertActive = () => {
			if (scope.isClosing) throw new Error("Session pull-request owner is closed");
			assertCurrent();
			target.assertCurrent?.();
		};
		const publish = (snapshot) => {
			if (projection !== "publication" && state?.prepared && keyStates.get(target.params.sessionKey) === state && state.snapshot === previous && state.target.identity === target.identity) publishSnapshot(state, snapshot);
		};
		assertActive();
		return scope.track(() => limit(async () => {
			assertActive();
			return await withSource(target, async (assertSourceCurrent, sourceIdentity) => {
				const assertReadCurrent = () => {
					assertActive();
					assertSourceCurrent();
				};
				assertReadCurrent();
				try {
					const result = await load(target.params, void 0, {
						target,
						sourceIdentity,
						projection,
						assertCurrent: assertReadCurrent
					});
					assertReadCurrent();
					const snapshot = pushedSnapshot(result);
					publish(snapshot);
					return snapshot;
				} catch {
					assertReadCurrent();
					publish(UNAVAILABLE_SNAPSHOT);
					return { ...UNAVAILABLE_SNAPSHOT };
				}
			});
		}));
	};
	const readPrepared = (target, admitLoad) => {
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
		if ((!state.snapshot || state.snapshot.status !== "ready" || state.snapshot.rateLimited) && !preparing.has(state) && getProjection && (!admitLoad || admitLoad())) {
			const promise = runInDetachedAsyncContext(() => runWithSpawnBroker(spawnBroker, () => scope.track(async () => {
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
			}))).catch(() => {}).finally(() => preparing.delete(state));
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
	const keyStates = /* @__PURE__ */ new Map();
	const inflight = /* @__PURE__ */ new Map();
	const scheduler = deps.scheduler.scope();
	const limit = pLimit(CONTROL_UI_SESSION_PR_LOAD_CONCURRENCY);
	const limitReads = pLimit(CONTROL_UI_SESSION_PR_LOAD_CONCURRENCY);
	const customLoad = deps.load;
	const load = customLoad ?? loadSessionPullRequests;
	const withSource = (target, operation) => customLoad ? operation(() => {}, target.identity) : withControlUiSessionPrSource(target.readSource, operation);
	let pollJob;
	const scope = new AsyncWorkScope();
	let stopPromise;
	const retireKeyStateIfUnused = (sessionKey, state) => {
		if (!state || state.prepared || state.connIds.size > 0) return;
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
		const target = deps.isConnectionActive?.(connId) === false ? void 0 : await limitReads(() => watched?.readCurrent());
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
	const loadSnapshot = async (sessionKey, refresh = false) => {
		const targetState = await currentKeyState(sessionKey);
		if (scope.isClosing || !targetState?.connIds.size) return UNAVAILABLE_SNAPSHOT;
		return withSource(targetState.target, async (assertSourceCurrent, sourceIdentity) => {
			const state = stateForTarget(sessionKey, targetState.target, sourceIdentity);
			const pending = inflight.get(sessionKey);
			if (pending) {
				if (pending.state === state && (!refresh || pending.refresh)) return pending.promise;
				await pending.promise;
				assertSourceCurrent();
				return await currentKeyState(sessionKey) === state ? loadSnapshot(sessionKey, refresh) : UNAVAILABLE_SNAPSHOT;
			}
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
					if (await currentKeyState(sessionKey) !== state || state.connIds.size === 0) return UNAVAILABLE_SNAPSHOT;
					if (refresh) state.refreshedAt = scheduler.now();
					const snapshot = await load({
						...state.target.params,
						...refresh ? { refresh: true } : {}
					}, state.cacheLifetime.signal, {
						target: state.target,
						sourceIdentity,
						assertCurrent: () => {
							assertSourceCurrent();
							if (scope.isClosing || keyStates.get(sessionKey) !== state) throw new Error("Session pull-request watchers changed");
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
						await push(new Set(state.connIds), sessionKey, state, snapshot, assertSourceCurrent, refresh);
					}
					return snapshot;
				});
			}).catch(() => UNAVAILABLE_SNAPSHOT).finally(() => {
				if (inflight.get(sessionKey)?.promise === promise) inflight.delete(sessionKey);
			});
			inflight.set(sessionKey, {
				promise,
				refresh,
				state
			});
			return promise;
		}).catch(() => UNAVAILABLE_SNAPSHOT);
	};
	const enqueueDelivery = (owner, deliver) => {
		const delivery = (owner.delivery ?? Promise.resolve()).then(deliver).finally(() => {
			if (owner.delivery === delivery) delete owner.delivery;
		});
		owner.delivery = delivery;
		return delivery;
	};
	const push = (connIds, sessionKey, state, snapshot, assertSourceCurrent, refresh = false) => {
		if (connIds.size === 0) return Promise.resolve();
		const hash = JSON.stringify(snapshot);
		const isDelivered = (watched) => !(refresh && watched.refreshPending) && watched.deliveredHash === hash;
		return enqueueDelivery(state, async () => {
			const sessions = Object.create(null);
			sessions[sessionKey] = snapshot;
			for (const connId of connIds) {
				const watched = subscriptions.get(connId)?.get(sessionKey);
				if (!watched || isDelivered(watched)) continue;
				const current = await currentWatcher(connId, sessionKey);
				if (!current || scope.isClosing || current.watched !== watched || subscriptions.get(connId)?.get(sessionKey) !== watched || deps.isConnectionActive?.(connId) === false || keyStates.get(sessionKey) !== state || isDelivered(watched)) continue;
				assertSourceCurrent();
				try {
					current.target.assertCurrent?.();
				} catch {
					continue;
				}
				deps.broadcastToConnIds(CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT, { sessions }, /* @__PURE__ */ new Set([connId]), {
					sessionKeys: [state.target.params.sessionKey],
					agentId: state.target.params.agentId
				});
				if (subscriptions.get(connId)?.get(sessionKey) === watched) {
					watched.deliveredHash = hash;
					if (refresh) delete watched.refreshPending;
				}
			}
		});
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
			for (const [sessionKey, state] of keyStates) if (state.connIds.size > 0) loads.push(loadSnapshot(sessionKey));
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
		const generation = {};
		replacementGenerations.set(normalizedConnId, generation);
		for (const key of sessionKeys) {
			const watched = subscriptions.get(normalizedConnId)?.get(key);
			if (watched && refreshSessionKeys.has(key)) watched.refreshPending = true;
		}
		const isCurrentReplacement = () => !scope.isClosing && replacementGenerations.get(normalizedConnId) === generation;
		const replacement = scope.track(async () => {
			try {
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
					if (next !== previous && refreshSessionKeys.has(key)) next.refreshPending = true;
					subscription.set(key, next);
				}
				const currentReplacement = isCurrentReplacement();
				if (!currentReplacement) {
					const current = subscriptions.get(normalizedConnId);
					for (const [key, watched] of subscription) if (!refreshSessionKeys.has(key) || current?.get(key) !== watched || !watched.refreshPending) subscription.delete(key);
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
						const snapshot = await loadSnapshot(sessionKey, refresh);
						assertSourceCurrent();
						if (isCurrent() && (refresh ? watched.refreshPending : !watched.deliveredHash)) await push(/* @__PURE__ */ new Set([normalizedConnId]), sessionKey, state, snapshot, assertSourceCurrent, refresh);
					}).catch(() => {});
				}));
			} finally {
				admit();
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
		replacementGenerations.delete(normalizedConnId);
		removeMemberships(normalizedConnId, subscriptions.get(normalizedConnId));
		subscriptions.delete(normalizedConnId);
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
export { parseControlUiSessionPullRequestsSubscribeParams as n, createControlUiSessionPullRequestSubscriptions as t };
