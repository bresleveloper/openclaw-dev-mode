import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as readDatabasePathIdentitySync, n as assertDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { u as withAgentDatabaseCloseFence } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as captureOpenClawAgentDatabaseRegistration, u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { m as invalidateOpenClawAgentDatabaseValidation } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { a as closeOpenClawAgentDatabaseByPathAsync, t as cache, y as revokePendingAgentDatabaseOpen } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import path from "node:path";
//#region src/state/openclaw-agent-db-disposal.ts
/** Join one unambiguous transient owner before removing its durable registration. */
async function disposeOpenClawAgentDatabaseByPath(databasePath, options = {}) {
	const resolvedPath = path.resolve(databasePath);
	const pending = [...cache.activePending].filter((owner) => isSameOpenClawAgentDatabasePath(owner.path, resolvedPath));
	const retained = [...cache.retainedCloses].filter((owner) => isSameOpenClawAgentDatabasePath(owner.path, resolvedPath));
	const native = [...cache.databases.values()].filter((database) => isSameOpenClawAgentDatabasePath(database.path, resolvedPath));
	const database = native[0];
	const identity = readDatabasePathIdentitySync(resolvedPath);
	const context = native.length <= 1 && (identity.key.startsWith("file:") || database) ? captureOpenClawStateWorkerContext({ env: options.env ?? (database && cache.leases.get(database.path)?.env) }) : void 0;
	const paths = [.../* @__PURE__ */ new Set([
		resolvedPath,
		identity.canonicalPath,
		...pending.map((owner) => owner.path),
		...retained.map((owner) => owner.path),
		...native.map((owner) => owner.path)
	])];
	const assertCurrent = () => {
		context?.admission.assertCurrent();
		context?.maintenanceScope?.assertAdmission();
		for (const pathname of paths) assertDatabasePathIdentity(pathname, identity);
	};
	const dispose = async () => {
		for (const pathname of paths) invalidateOpenClawAgentDatabaseValidation(pathname);
		for (const owner of pending) revokePendingAgentDatabaseOpen(owner.path, owner.agentId);
		for (const owner of retained) owner.close();
		await Promise.allSettled(pending.map((owner) => owner.promise));
		assertCurrent();
		if (native.length > 1) throw new Error(`Agent database disposal has multiple native owners: ${resolvedPath}`);
		const closeCapturedPaths = async (additionalPath) => {
			assertCurrent();
			const closePaths = additionalPath ? [.../* @__PURE__ */ new Set([...paths, additionalPath])] : paths;
			const results = await Promise.allSettled(closePaths.map((pathname) => closeOpenClawAgentDatabaseByPathAsync(pathname)));
			assertCurrent();
			throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Agent disposal resource drainage failed");
			return results.some((result) => result.status === "fulfilled" && result.value);
		};
		if (!context) {
			await closeCapturedPaths();
			return false;
		}
		let target = database && {
			agentId: database.agentId,
			path: database.path
		};
		if (!target) {
			const snapshot = await prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env: context.environment }).read();
			assertCurrent();
			snapshot.assertCurrent();
			if (snapshot.result.status !== "available") throw new Error("Transient agent disposal cannot read its shared registry");
			const [match, ...ambiguous] = snapshot.result.entries.filter((entry) => isSameOpenClawAgentDatabasePath(entry.path, resolvedPath));
			if (ambiguous.length) throw new Error(`Agent database disposal has multiple registered owners: ${resolvedPath}`);
			if (!match) {
				await closeCapturedPaths();
				return false;
			}
			target = match;
		}
		const owned = target;
		const assertOwned = () => {
			assertCurrent();
			assertDatabasePathIdentity(owned.path, identity);
		};
		return withAgentDatabaseCloseFence({ path: owned.path }, async () => {
			assertOwned();
			invalidateOpenClawAgentDatabaseValidation(owned.path);
			await closeCapturedPaths(owned.path);
			assertOwned();
			const publication = captureOpenClawAgentDatabaseRegistration({
				kind: "remove",
				agentId: owned.agentId,
				agentPath: owned.path,
				admission: context.admission,
				assertPublicationCurrent: context.assertPublicationCurrent
			});
			let settlement;
			let committed = false;
			const record = (receipt) => {
				publication.recordCommitted(receipt);
				committed = true;
			};
			const errors = [];
			try {
				const receipt = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
					type: "agentDatabaseRegistry.remove",
					input: {
						agentId: owned.agentId,
						agentPath: owned.path,
						identity
					}
				}), {
					assertCurrent: assertOwned,
					createAdmission(operation) {
						settlement = operation.settled;
						const admission = createSqliteWorkerWriteAdmission((request) => {
							assertOwned();
							if (request.stage === "transaction") publication.begin();
						}, [
							context.admission.databasePath,
							owned.path,
							...paths
						])(operation);
						observeSqliteWorkerCommittedFacts(admission.admission, ({ facts }) => {
							if (!isRecord(facts) || typeof facts.agentId !== "string" || typeof facts.agentPath !== "string" || typeof facts.stateDatabasePath !== "string" || typeof facts.stateDatabaseIdentity !== "string") throw new Error("Agent disposal returned an invalid registry receipt");
							record({
								agentId: facts.agentId,
								agentPath: facts.agentPath,
								stateDatabasePath: facts.stateDatabasePath,
								stateDatabaseIdentity: facts.stateDatabaseIdentity
							});
						});
						return admission;
					}
				});
				if (!committed) record(receipt);
			} catch (error) {
				errors.push(error);
			}
			try {
				publication.finish(await settlement);
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Agent disposal and registry publication failed");
			assertOwned();
			return true;
		});
	};
	const fence = (index) => index === paths.length ? dispose() : withAgentDatabaseCloseFence({ path: paths[index] }, () => fence(index + 1));
	return fence(0);
}
//#endregion
export { disposeOpenClawAgentDatabaseByPath as t };
