import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { d as withSessionHistoryWorkerReadCandidates, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { y as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
//#region src/config/sessions/provider-review-store.ts
async function withProviderReviewDatabase(target, assertCallerCurrent, operation) {
	assertCallerCurrent();
	const env = cloneEnvWithPlatformSemantics(target.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const logical = resolveSqliteScope({
		...target,
		storePath: void 0,
		env
	});
	const storePath = logical.path ?? target.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(logical));
	const candidates = captureSessionStoreReadCandidates(storePath);
	const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env });
	return withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
		const request = {
			agentId: logical.agentId,
			storePath,
			env
		};
		let selected = await discovery.readStoreTarget({
			...request,
			registeredDatabases: { status: "deferred" }
		});
		let assertRegistryCurrent;
		if (selected.kind === "session-target-registry-required") {
			const registry = await registryRead.read();
			assertRegistryCurrent = registry.assertCurrent;
			registry.assertCurrent();
			discovery.assertCurrent();
			assertCallerCurrent();
			selected = await discovery.readStoreTarget({
				...request,
				registeredDatabases: registry.result.status === "available" ? registry.result.entries : { status: "unavailable" }
			});
		}
		if (selected.kind !== "session-store-target") throw new Error("Provider review store could not resolve its database owner");
		assertRegistryCurrent?.();
		const sourcePath = selected.sourcePath;
		const assertCurrent = () => {
			discovery.assertCurrent();
			assertSessionStoreReadCandidate(sourcePath, candidates);
			assertCallerCurrent();
		};
		assertCurrent();
		return operation({
			...selected.database,
			env
		}, logical.sessionKey, assertCurrent);
	});
}
async function readSessionProviderReview(target, assertCurrent) {
	assertCurrent();
	const { sessionId, lifecycleRevision } = target;
	return withProviderReviewDatabase(target, assertCurrent, async (options, sessionKey, assertHeld) => {
		const result = await withSessionHistoryWorkerDatabase(options, (owner) => owner.readExactEntries({
			sessionKeys: [sessionKey],
			env: options.env ?? {}
		}));
		assertHeld();
		const entry = result.entries.find((row) => row.sessionKey === sessionKey)?.entry;
		return entry?.sessionId === sessionId && entry.lifecycleRevision === lifecycleRevision ? entry : void 0;
	});
}
/** A review clear can consume only the exact refusal the human acknowledged. */
async function compareSessionProviderReview(target, params) {
	params.assertCurrent();
	const capturedTarget = { ...target };
	const input = structuredClone({
		sessionKey: target.sessionKey,
		sessionId: target.sessionId,
		lifecycleRevision: target.lifecycleRevision,
		expectedReview: params.expectedReview,
		nextReview: params.nextReview
	});
	return withProviderReviewDatabase(capturedTarget, params.assertCurrent, async (options, sessionKey, assertHeld) => {
		input.sessionKey = sessionKey;
		let publication;
		let admitted;
		return withSessionEntryWorker({
			...options,
			path: resolveOpenClawAgentSqlitePath(options)
		}, void 0, assertHeld, async (execution, source) => {
			const result = await execution.runExisting(source, async (worker) => {
				const databaseIdentity = execution.fileIdentity?.physicalIdentity;
				if (!databaseIdentity) throw new Error("Provider review has no prepared native database identity");
				publication = retainSessionEntryWorkerPublication({
					agentId: execution.agentId,
					storePath: execution.path,
					databaseIdentity
				});
				const outcome = await worker.execute({
					type: "session.providerReview.compare",
					input
				}).then((value) => ({
					ok: true,
					value
				}), (error) => ({
					ok: false,
					error
				}));
				let unknown = outcome.ok;
				if (admitted) {
					await admitted.retained.settled;
					const facts = admitted.admission.committed?.facts;
					let receipt = outcome.ok ? outcome.value.publication : void 0;
					if (isRecord(facts) && facts.kind === "session-entry-replacements") receipt = facts;
					unknown = admitted.admission.settlement?.kind !== "completed" || !receipt;
					publication.settle(receipt, unknown);
				}
				if (unknown) {
					const error = new SqliteWorkerError("Provider review has no confirmed native completion and commit receipt", "outcome-unknown");
					error.cause = outcome.ok ? void 0 : outcome.error;
					throw error;
				}
				if (!outcome.ok) throw outcome.error;
				return outcome.value.entry;
			});
			if (!result) throw new Error("Session disappeared before provider review update");
			return result;
		}, (admission, retained, facts) => {
			if (!isRecord(facts) || !isRecord(facts.publication) || facts.publication.kind !== "session-entry-replacements" || !publication) throw new Error("Provider review commit omitted its publication receipt");
			admitted = {
				admission,
				retained
			};
			publication.begin([sessionKey], []);
		});
	});
}
//#endregion
export { compareSessionProviderReview, readSessionProviderReview };
