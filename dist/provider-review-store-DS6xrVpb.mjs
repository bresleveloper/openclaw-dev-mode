import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { n as withSessionStoreTarget } from "./session-store-target-runtime-D11id0W-.mjs";
import { i as runSessionEntryWorkerMutation } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
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
	return withSessionStoreTarget({
		agentId: logical.agentId,
		storePath,
		env,
		candidates
	}, (selected, owner) => operation({
		...selected.database,
		env
	}, logical.sessionKey, owner.assertCurrent), assertCallerCurrent);
}
async function readSessionProviderReview(target, assertCurrent) {
	assertCurrent();
	const { sessionId, lifecycleRevision } = target;
	return withProviderReviewDatabase(target, assertCurrent, async (options, sessionKey, assertHeld) => {
		const result = await withSessionHistoryWorkerDatabase(options, (owner) => owner.readExactEntries({
			sessionKeys: [sessionKey],
			snapshotFields: [],
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
		return runSessionEntryWorkerMutation({
			...options,
			path: resolveOpenClawAgentSqlitePath(options)
		}, void 0, assertHeld, async (worker) => {
			const result = await worker.execute({
				type: "session.providerReview.compare",
				input
			});
			return {
				kind: "committed",
				value: result.entry,
				publication: result.publication
			};
		}, { identityAgentId: options.agentId }, { errors: {
			identity: "Provider review has no prepared native database identity",
			unknown: "Provider review has no confirmed native completion and commit receipt",
			missing: "Session disappeared before provider review update",
			publication: "Provider review commit omitted its publication receipt"
		} });
	});
}
//#endregion
export { compareSessionProviderReview, readSessionProviderReview };
