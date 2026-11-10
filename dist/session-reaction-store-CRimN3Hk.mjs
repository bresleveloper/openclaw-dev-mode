import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as SessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import { n as captureSessionActorStorageOwner, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { t as createSessionWorkerExecutionSource } from "./session-worker-execution-source-CQwDQ8va.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { n as withSessionStoreTarget } from "./session-store-target-runtime-D11id0W-.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { n as SessionReactionMessageMissingError, t as SessionReactionLimitError } from "./session-reaction-errors-857xqNjc.mjs";
//#region src/config/sessions/session-reaction-store.ts
function restoreReactionError(error) {
	if (error instanceof Error) {
		if (error.name === "SessionReactionLimitError") throw new SessionReactionLimitError();
		if (error.name === "SessionReactionMessageMissingError") throw new SessionReactionMessageMissingError();
		if (error.name === "SessionWorkStartInvalidatedError") throw new SessionWorkStartInvalidatedError(error.message);
	}
	throw error;
}
async function setSessionReactionAsync(scope, params) {
	const { assertCurrent = () => void 0, ...reaction } = params;
	const authority = {
		assertCurrent,
		authorize: assertCurrent
	};
	if (captureSessionActorStorageOwner(scope, authority)) {
		const memory = await acquireSessionActorStorage(scope, {
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			},
			authority
		});
		if (!memory) throw new SessionWorkStartInvalidatedError("session changed before reaction mutation");
		try {
			const outcome = await memory.actor.storage.mutate({
				type: "session.reaction.set",
				input: { params: reaction }
			}, memory.authority);
			if (outcome.kind === "committed") return readSessionActorStorageResult(outcome);
			const error = new Error(outcome.error.message);
			error.name = outcome.error.name;
			return restoreReactionError(error);
		} finally {
			await memory.actor.release();
		}
	}
	assertCurrent();
	const input = structuredClone(reaction);
	const env = cloneEnvWithPlatformSemantics(scope.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const logical = resolveSqliteScope({
		...scope,
		storePath: void 0,
		env
	});
	const storePath = logical.path ?? scope.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(logical));
	const candidates = captureSessionStoreReadCandidates(storePath);
	try {
		return await withSessionStoreTarget({
			agentId: logical.agentId,
			storePath,
			env,
			candidates
		}, async (selected, owner) => {
			const options = {
				...selected.database,
				env
			};
			const execution = captureOpenClawAgentDatabaseExecution(options);
			const assertHeld = () => {
				execution.assertCurrent();
				owner.assertCurrent();
			};
			try {
				assertHeld();
				const result = await runOpenClawAgentWorkerWrite(options, () => execution.runExisting(createSessionWorkerExecutionSource(assertHeld, "Reaction authority expired"), (worker) => worker.execute({
					type: "session.reaction.set",
					input: {
						sessionKey: logical.sessionKey,
						params: input
					}
				})));
				if (!result) throw new SessionWorkStartInvalidatedError("session changed before reaction mutation");
				return result;
			} finally {
				await execution.release();
			}
		}, assertCurrent);
	} catch (error) {
		return restoreReactionError(error);
	}
}
//#endregion
export { setSessionReactionAsync as t };
