import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { s as resolveSessionEntryCandidates, t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { a as captureSessionEntryReadScope } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { _ as recordPreparedToolAuthorityRead, u as isToolAuthorityReadCaptureActive } from "./host-private-capabilities-eTr803c9.mjs";
import { r as MessageInjectionTargetUnavailableError } from "./message-injection-authority-Mu3hgByB.mjs";
import { i as resolveRestartRecoverySteeringBlockReason } from "./restart-recovery-receipt-yGbLdybC.mjs";
//#region src/auto-reply/reply/steering-delivery-preparation.ts
function prepareCurrentSteeringRead(assertCurrent) {
	return {
		assertCurrent,
		release() {},
		prepareCurrent: async () => {
			assertCurrent();
			if (isToolAuthorityReadCaptureActive()) recordPreparedToolAuthorityRead({
				reads: [],
				assertPrepared: assertCurrent,
				assertLegacyCurrent: assertCurrent
			});
		}
	};
}
/** Carry terminal-delivery eligibility into the target's final prepared admission. */
function prepareSteeringDelivery(params) {
	const fallbackEntry = params.entry ? structuredClone(params.entry) : void 0;
	const assertEntry = (current) => {
		params.assertCurrent();
		const entry = current ?? fallbackEntry;
		const reason = resolveRestartRecoverySteeringBlockReason(entry, params.sessionId ?? entry?.sessionId ?? "", params.sourceTurnId ?? normalizeOptionalString(entry?.restartRecoveryDeliverySourceRunId) ?? "");
		if (reason) throw new MessageInjectionTargetUnavailableError(`Terminal source-reply delivery is closed (${reason})`);
	};
	if (!params.sessionKey || !params.storePath) return prepareCurrentSteeringRead(() => assertEntry(fallbackEntry));
	const memory = captureSessionActorStorageOwner(params, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const sessionKey = params.sessionKey;
		return prepareCurrentSteeringRead(() => {
			const current = memory.binding?.actor.target.sessionKey === sessionKey ? memory.binding.actor.snapshot(memory.authority) : memory.owner?.readSession(sessionKey, memory.authority);
			if (!current?.entry) throw new MessageInjectionTargetUnavailableError("Steering target session was closed");
			assertEntry(current.entry);
		});
	}
	const { scope } = captureSessionEntryReadScope({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const sessionKey = resolveSqliteSessionKey(scope.sessionKey, params.agentId);
	let active = true;
	let retained;
	let unregister;
	let preparation;
	const release = () => {
		if (!active) return;
		active = false;
		retained?.release();
		unregister?.();
	};
	const assertCurrent = () => {
		params.assertCurrent();
		if (!active || !retained?.isCurrent()) throw new MessageInjectionTargetUnavailableError("Terminal delivery eligibility changed");
	};
	const prepare = async () => {
		params.assertCurrent();
		await withSessionEntriesFromStoresInWorker([{
			agentId: params.agentId,
			storePath: scope.storePath,
			env: scope.env,
			projection: "exact",
			snapshotFields: [],
			sessionKeys: [.../* @__PURE__ */ new Set([sessionKey, ...collectSessionEntryLookupKeys(sessionKey)])]
		}], ([read]) => {
			params.assertCurrent();
			if (!active || !read) throw new MessageInjectionTargetUnavailableError("Steering preparation was released");
			const selected = resolveSessionEntryCandidates({
				entries: read.result.entries,
				sessionKey,
				canonicalKeys: true
			}).existing;
			assertEntry(selected?.entry);
			const identity = read.result.source?.databaseIdentity ?? read.result.databaseIdentity?.identity;
			if (!identity) throw new MessageInjectionTargetUnavailableError("Steering session source is unavailable");
			retained = retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${identity}`,
				sessionKey: selected?.sessionKey ?? sessionKey,
				entry: selected?.entry,
				matches: (before, after) => before?.sessionId === after?.sessionId && before?.lifecycleRevision === after?.lifecycleRevision && !resolveRestartRecoverySteeringBlockReason(after ?? fallbackEntry, params.sessionId ?? after?.sessionId ?? "", params.sourceTurnId ?? normalizeOptionalString(after?.restartRecoveryDeliverySourceRunId) ?? "")
			});
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				agentId: read.database.agentId,
				path: read.database.path,
				revoke: release,
				close: async () => release()
			});
		}, { ordered: true });
		assertCurrent();
	};
	const descriptor = {
		reads: [],
		assertPrepared: assertCurrent,
		assertLegacyCurrent: assertCurrent
	};
	return {
		assertCurrent,
		release,
		prepareCurrent: async () => {
			preparation ??= prepare();
			await preparation;
			assertCurrent();
			if (isToolAuthorityReadCaptureActive()) recordPreparedToolAuthorityRead(descriptor);
		}
	};
}
//#endregion
export { prepareSteeringDelivery as t };
