import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as assertSessionEntriesCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { r as isSystemEventStoreCurrent, t as captureSystemEventStoreCurrentCheck } from "./system-event-ownership-DAgHWXZ1.mjs";
import { t as isSessionStateWatchAddress } from "./session-state-events.watch-address-B3UBo-NE.mjs";
import { t as createInboundDebouncer } from "./inbound-debounce-BeTuTnO0.mjs";
import { n as channelRouteDedupeKey } from "./channel-route-2bD3dZs2.mjs";
import { c as enqueueSystemEventEntry, g as peekSystemEventEntries } from "./system-events-Bf4ozS7L.mjs";
import { i as combineSessionEventTargetsForHost, n as assertSessionEventTargetCurrent, r as captureSessionEventTargetForHost, t as enqueueSessionEventForHost } from "./session-event-handoff-BLWR3ywE.mjs";
//#region src/sessions/session-state-events.operation.ts
function runSessionWatchOperation(context, operation, assertCurrent, sessionEntriesCurrent) {
	return runOpenClawStateWorkerOperation(context, operation, {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "prepare" && request.stage !== "transaction" && request.stage !== "commit") throw new Error("Session watch operation requires worker admission");
				context.admission.assertCurrent();
				assertSessionEntriesCurrentAdmission(request, sessionEntriesCurrent);
				assertCurrent();
				grant();
			})
		})
	});
}
//#endregion
//#region src/sessions/session-state-notice-acknowledgment.ts
const log$1 = createSubsystemLogger("sessions/state-events");
/** Publish committed followups while their original worker and watcher authority remains current. */
async function acknowledgeSessionStateNoticesInWorker(watcherSessionKey, notices, publishNotice, options = {}) {
	try {
		const context = captureOpenClawStateWorkerContext(options);
		const now = options.now ?? Date.now();
		const isStoreCurrent = captureSystemEventStoreCurrentCheck(watcherSessionKey);
		const cursors = [...new Map(notices.filter((notice) => isStoreCurrent(notice.watcherStorePath)).map((notice) => [notice.targetSessionKey, { ...notice }])).values()];
		const assertCurrent = () => {
			options.assertCurrent?.();
			for (const cursor of cursors) if (!isStoreCurrent(cursor.watcherStorePath)) throw new Error("Session watch acknowledgment lost its system-event store");
		};
		await runSessionWatchOperation(context, async (scope) => {
			if (cursors.length === 0) return;
			const followups = await scope.execute({
				type: "sessionState.acknowledge",
				input: {
					watcherSessionKey,
					cursors,
					now,
					sessionEntryCurrentSources: options.sessionEntriesCurrent?.sources
				}
			});
			context.admission.assertCurrent();
			assertCurrent();
			for (const followup of followups) publishNotice(followup);
		}, assertCurrent, options.sessionEntriesCurrent);
	} catch (error) {
		log$1.warn(`failed to acknowledge session state notices: ${String(error)}`);
	}
}
//#endregion
//#region src/sessions/session-state-notices.ts
/** Stale-state notice text, coalescing keys, and watcher eligibility. */
const SESSION_STATE_CONTEXT_PREFIX = "session-state:";
const log = createSubsystemLogger("sessions/state-notices");
function noticeKey(notice) {
	return JSON.stringify([
		notice.sessionKey,
		notice.target.storePath,
		notice.target.sessionId,
		notice.target.lifecycleRevision,
		notice.target.generation,
		notice.target.chatType,
		channelRouteDedupeKey(notice.target.deliveryContext)
	]);
}
const notices = resolveGlobalSingleton(Symbol.for("openclaw.sessionStateNotices"), () => {
	const pendingNotices = /* @__PURE__ */ new Set();
	const debouncer = createInboundDebouncer({
		debounceMs: 2e4,
		maxWaitMs: 2e4,
		buildKey: noticeKey,
		onCancel: (items) => {
			for (const item of items) pendingNotices.delete(item);
		},
		onFlush: (items, createFlush) => {
			for (const item of items) pendingNotices.delete(item);
			return createFlush({ dispatch: async (lifecycle) => {
				const latest = items.at(-1);
				if (!latest) return;
				const pending = peekSystemEventEntries(latest.sessionKey);
				const selected = items.filter((item) => pending.some((event) => event.id === item.occurrence.id));
				if (selected.length > 0) {
					const target = combineSessionEventTargetsForHost(selected.map((item) => item.target));
					const occurrences = selected.map((item) => item.occurrence);
					const outcome = await enqueueSessionEventForHost(occurrences.map((event) => event.text).join("\n"), {
						agentId: latest.agentId,
						sessionKey: latest.sessionKey,
						source: "session",
						expectedTarget: target,
						occurrences,
						preserveOccurrenceOnRejection: true,
						onAdopted: async () => {
							await lifecycle.onAdopted();
							await acknowledgeSessionStateNoticesInWorker(latest.sessionKey, selected.map((item) => ({
								targetSessionKey: item.changedSessionKey,
								watcherStorePath: item.occurrence.sessionStorePath ?? null
							})), enqueueSessionStateNotice, { assertCurrent: () => assertSessionEventTargetCurrent(target) });
						}
					}).settled;
					if (outcome.status === "failed") throw new Error(outcome.error ?? "Session state notice failed");
				}
			} });
		},
		onError: (error) => log.warn(`Session state notice was not delivered: ${String(error)}`)
	});
	return {
		enqueue(notice) {
			pendingNotices.add(notice);
			return runInDetachedAsyncContext(() => debouncer.enqueue(notice));
		},
		async close() {
			for (const key of new Set([...pendingNotices].map(noticeKey))) debouncer.cancelKey(key);
			pendingNotices.clear();
			await debouncer.drain();
		}
	};
}, (owner) => owner.close());
function decodeSessionStateNoticeContextKey(contextKey) {
	if (!contextKey.startsWith(SESSION_STATE_CONTEXT_PREFIX)) return;
	const encoded = contextKey.slice(14);
	if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) return;
	try {
		return new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(Buffer.from(encoded, "hex"));
	} catch {
		return;
	}
}
function sessionStateNoticeText(targetSessionKey, lastSeenSequence) {
	return `Session "${targetSessionKey}" changed (other actor). Reconcile before acting: session_status sessionKey "${targetSessionKey}" changesSince ${lastSeenSequence}.`;
}
function enqueueSessionStateNotice(params) {
	const agentId = parseAgentSessionKey(params.watcherSessionKey)?.agentId;
	if (!agentId || !isSessionStateWatchAddress(params)) return;
	const storePath = params.watcherStorePath ?? null;
	const occurrence = enqueueSystemEventEntry(sessionStateNoticeText(params.targetSessionKey, params.lastSeenSequence), {
		sessionKey: params.watcherSessionKey,
		sessionStorePath: storePath,
		contextKey: `${SESSION_STATE_CONTEXT_PREFIX}${Buffer.from(params.targetSessionKey, "utf8").toString("hex")}`,
		...params.queueOnly ? { replace: true } : {}
	});
	if (!occurrence || params.queueOnly || isSubagentSessionKey(params.watcherSessionKey)) return;
	const assertCurrent = () => {
		if (!isSystemEventStoreCurrent(params.watcherSessionKey, storePath)) throw new Error("Session state notice watcher store was replaced");
	};
	captureSessionEventTargetForHost(agentId, params.watcherSessionKey, { assertCurrent }).then((target) => {
		assertCurrent();
		if (peekSystemEventEntries(params.watcherSessionKey).some((event) => event.id === occurrence.id)) return notices.enqueue({
			sessionKey: params.watcherSessionKey,
			changedSessionKey: params.targetSessionKey,
			agentId,
			target,
			occurrence
		});
	}).catch((error) => log.warn(`Session state notice was not admitted: ${String(error)}`));
}
//#endregion
export { runSessionWatchOperation as i, enqueueSessionStateNotice as n, acknowledgeSessionStateNoticesInWorker as r, decodeSessionStateNoticeContextKey as t };
