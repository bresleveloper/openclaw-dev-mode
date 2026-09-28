import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as throwSqliteLifecycleErrors } from "./sqlite-coordinator-z2lO0ops.mjs";
import { r as readDatabasePathIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { d as runSqliteWorkerStoreOperation } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { r as openOpenClawStateWorkerCleanupStore } from "./openclaw-state-worker-store-YAl4mP45.mjs";
//#region src/skills/lifecycle/upload-store-install-owner.ts
/** Installation owns its exact lease until the callback and accepted worker work settle. */
async function withSkillUploadInstallOwner(context, lease, operation) {
	const producer = createDeferredCore();
	let identity;
	let active = true;
	let released = false;
	let cleanup;
	let store;
	const cleanupContext = {
		environment: context.environment,
		coordinatorRuntime: {
			...context.coordinatorRuntime,
			keepAlive: false
		},
		existingSchemaPath: context.existingSchemaPath
	};
	const assertOwned = () => {
		if (!active || !identity) throw new Error("Skill upload install cleanup owner has settled");
	};
	const close = () => !active ? Promise.resolve() : cleanup ??= (async () => {
		await producer.promise;
		if (store) {
			await store.close();
			store = void 0;
		}
		if (identity && !released) {
			assertOwned();
			if ((await readDatabasePathIdentity(context.admission.databasePath)).key !== identity) throw new Error("Skill upload cleanup cannot adopt a replacement shared database");
			store ??= await openOpenClawStateWorkerCleanupStore(context.admission.databasePath, cleanupContext, assertOwned);
			if (!store) throw new Error("Skill upload cleanup lost its original shared database");
			const errors = [];
			try {
				if (!released) {
					const input = {
						...lease,
						sharedStateIdentity: identity
					};
					await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
						type: "skillUploads.release",
						input
					}), cleanupContext, assertOwned);
					released = true;
				}
			} catch (error) {
				errors.push(error);
			}
			try {
				await store.close();
				store = void 0;
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Skill upload lease release and worker cleanup failed");
		}
		active = false;
		unregister();
	})().finally(() => {
		cleanup = void 0;
	});
	const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(target) {
		if (!target || target.key === context.admission.identity.key) await close();
	} });
	context.maintenanceScope?.own(producer, "shared-resources", close);
	try {
		return await operation(() => {
			context.admission.assertCurrent();
			identity = context.admission.identity.key;
		});
	} finally {
		producer.resolve();
		await close();
	}
}
//#endregion
export { withSkillUploadInstallOwner };
