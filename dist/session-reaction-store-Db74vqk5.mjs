import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { o as SessionWorkStartInvalidatedError } from "./work-start-error-Dh9d0ImY.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { d as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import "./lifecycle-DdaXH8bC.mjs";
import { t as listSessionReactionsInDatabase } from "./session-reaction-store.read-T2ans2sm.mjs";
import { n as SessionReactionMessageMissingError, r as setSessionReactionInDatabase, t as SessionReactionLimitError } from "./session-reaction-store.kernel-joXWzfME.mjs";
//#region src/config/sessions/session-reaction-store.ts
async function setSessionReactionAsync(scope, params) {
	const { assertCurrent = () => void 0, ...reaction } = params;
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
	if (isIncognitoOpenClawAgentSqlitePath(storePath, toDatabaseOptions(logical))) {
		const resolved = resolveSqliteScope({
			...scope,
			env
		});
		const options = toDatabaseOptions(resolved);
		return runOpenClawAgentWriteAdmission(options, () => {
			assertCurrent();
			return runOpenClawAgentWriteTransaction((database) => setSessionReactionInDatabase(database, resolved.sessionKey, input), options, { operationLabel: "session.reaction.set" });
		}, true);
	}
	const candidates = captureSessionStoreReadCandidates(storePath);
	const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env });
	try {
		return await withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
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
				assertCurrent();
				selected = await discovery.readStoreTarget({
					...request,
					registeredDatabases: registry.result.status === "available" ? registry.result.entries : { status: "unavailable" }
				});
			}
			if (selected.kind !== "session-store-target") throw new Error("Reaction store could not resolve its database owner");
			assertRegistryCurrent?.();
			const sourcePath = selected.sourcePath;
			const options = {
				...selected.database,
				env
			};
			const execution = captureOpenClawAgentDatabaseExecution(options);
			const assertHeld = () => {
				execution.assertCurrent();
				discovery.assertCurrent();
				assertSessionStoreReadCandidate(sourcePath, candidates);
				assertCurrent();
			};
			try {
				assertHeld();
				const result = await runOpenClawAgentWorkerWrite(options, () => execution.runExisting({
					assertCurrent: assertHeld,
					createAdmission(binding) {
						return () => ({
							nativeLocations: binding.nativeLocations,
							admission: createSqliteWorkerOperationAdmission((admissionRequest, grant) => {
								binding.authorize(admissionRequest);
								assertHeld();
								if (!grant()) throw new Error("Reaction authority expired");
							}, binding.attachment)
						});
					}
				}, (worker) => worker.execute({
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
		});
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === "SessionReactionLimitError") throw new SessionReactionLimitError();
			if (error.name === "SessionReactionMessageMissingError") throw new SessionReactionMessageMissingError();
			if (error.name === "SessionWorkStartInvalidatedError") throw new SessionWorkStartInvalidatedError(error.message);
		}
		throw error;
	}
}
function listSessionReactions(scope, params) {
	const resolved = resolveSqliteScope(scope);
	return listSessionReactionsInDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionKey, params);
}
//#endregion
export { setSessionReactionAsync as n, listSessionReactions as t };
