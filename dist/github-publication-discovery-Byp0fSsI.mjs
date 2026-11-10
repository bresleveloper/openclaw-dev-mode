import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { u as subscribeGitHubIdentityChanges } from "./github-read-identity-BB6UxasN.mjs";
import { t as prepareGitHubPublicationFact } from "./worker-github-binding-BYK7FikM.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/github-publication-discovery.ts
const unavailable = { available: false };
const PUBLICATION_FACT_MAX_AGE_MS = 6e4;
let readPublished;
/** Discovery can lag a refresh; publication and process launch still validate at the effect. */
function readGitHubPublicationFact(session) {
	return readPublished?.(session) ?? unavailable;
}
function startGitHubPublicationDiscovery(params) {
	const inOwner = AsyncLocalStorage.snapshot();
	const scheduler = params.scheduler.scope();
	const sessions = new LruCache(256);
	const keyOf = (session) => `${session.agentId}\0${session.sessionKey}`;
	const refresh = (key, retireCredentials = false) => {
		const previous = sessions.peek(key);
		if (!previous || scheduler.signal.aborted) return;
		const current = {
			...previous,
			fact: retireCredentials ? { available: previous.fact.available } : previous.fact,
			refreshAfterMs: scheduler.now() + PUBLICATION_FACT_MAX_AGE_MS
		};
		sessions.set(key, current);
		inOwner(() => scheduler.schedule({
			id: `github-publication:${key}`,
			delayMs: 0,
			run: async () => {
				const prepare = () => prepareGitHubPublicationFact({
					...current.session,
					assertCurrent: () => !scheduler.signal.aborted && sessions.peek(key) === current
				});
				let fact;
				if (current.incognito) {
					const assertCurrent = () => scheduler.signal.throwIfAborted();
					try {
						const actor = await current.incognito.owner?.acquireExisting(current.session.sessionKey, {
							assertCurrent,
							assertReadable: assertCurrent
						});
						if (actor) try {
							fact = await runWithSessionActorStorage({
								actor,
								agentId: current.incognito.agentId,
								path: current.incognito.path,
								authority: {
									assertCurrent,
									authorize: assertCurrent
								}
							}, prepare);
						} finally {
							await actor.release();
						}
					} catch {
						fact = void 0;
					}
				} else fact = await prepare();
				if (!scheduler.signal.aborted && sessions.peek(key) === current) current.fact = fact ?? unavailable;
			}
		}));
		return current;
	};
	const read = (session) => {
		const key = keyOf(session);
		let current = sessions.get(key);
		if (!current || current.session.sessionId !== session.sessionId) {
			current = {
				session: { ...session },
				incognito: captureSessionActorStorageOwner(session, {
					assertCurrent: () => scheduler.signal.throwIfAborted(),
					authorize() {}
				}),
				fact: unavailable,
				refreshAfterMs: 0
			};
			sessions.set(key, current);
			refresh(key);
		} else if (current.refreshAfterMs <= scheduler.now()) current = refresh(key, true) ?? current;
		return current.fact;
	};
	readPublished = read;
	const refreshAll = (retireCredentials = false) => {
		const keys = [...sessions.keys()];
		for (const key of keys) refresh(key, retireCredentials);
	};
	const stopIdentity = subscribeGitHubIdentityChanges(() => refreshAll(true));
	const stopConfig = sessionChanges.subscribe((change) => {
		if ("all" in change && change.scope === "config") refreshAll(true);
	});
	const observe = (row) => {
		if (scheduler.signal.aborted) return;
		const session = {
			agentId: row.agentId,
			sessionKey: row.key,
			sessionId: row.entry.sessionId
		};
		const key = keyOf(session);
		const binding = JSON.stringify([
			row.entry.lifecycleRevision,
			row.entry.worktree,
			row.entry.repositoryWorkspaceId
		]);
		const previous = sessions.peek(key);
		if (previous?.session.sessionId !== session.sessionId || previous.binding !== binding) {
			sessions.set(key, {
				session,
				binding,
				fact: unavailable,
				refreshAfterMs: 0
			});
			refresh(key);
		}
	};
	params.projection?.onSelectionChange((change) => {
		if (change.kind === "row" && change.row) observe(change.row);
	});
	scheduler.schedule({
		id: "github-publication-startup",
		delayMs: 0,
		run: async () => {
			await params.projection?.ensureMaterialized();
			for (const row of params.projection?.selectEntries() ?? []) observe(row);
		}
	});
	return { stop: async () => {
		scheduler.beginClose();
		stopIdentity();
		stopConfig();
		if (readPublished === read) readPublished = void 0;
		sessions.clear();
		await scheduler.stop();
	} };
}
//#endregion
export { startGitHubPublicationDiscovery as n, readGitHubPublicationFact as t };
