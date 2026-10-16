import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { n as startOpenClawStateLeaseTimer } from "./openclaw-state-lease-heartbeat-C_t8XxLa.mjs";
import { i as leaseHeartbeatState } from "./openclaw-state-lease-heartbeat-shared-BczGehzh.mjs";
import { o as resolveLeaseDatabasePath } from "./openclaw-state-lease-storage-CWBFhswN.mjs";
//#region src/state/openclaw-state-lease-worker-storage.ts
async function acquireLease(database, input, assertCurrent, signal) {
	if (database.options?.readOnly) throw new Error("State lease acquisition requires writable storage");
	if (database.schemaPolicy === "existing" && database.options?.database) throw new Error("Existing-state writes require their own tracked writable connection.");
	const opened = database.schemaPolicy === "existing" ? void 0 : openOpenClawStateDatabase(database.options);
	const context = captureOpenClawStateWorkerContext({
		...database.options,
		path: opened?.path ?? resolveLeaseDatabasePath(database)
	});
	const assertAdmission = () => {
		context.admission.assertCurrent();
		assertCurrent();
		if (opened?.db.isTransaction) throw new OpenClawStateLeaseError("State lease acquisition requires no active transaction", { code: "OPENCLAW_STATE_LEASE_INVALID_INPUT" });
	};
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	assertAdmission();
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "stateLease.acquire",
		input: {
			...input,
			schemaPolicy: database.schemaPolicy
		}
	}, { signal }), {
		existingOnly: database.schemaPolicy === "existing",
		assertCurrent: assertAdmission,
		createAdmission: createSqliteWorkerWriteAdmission(assertAdmission, [context.admission.databasePath])
	});
	if (!result) throw new Error("State lease acquisition requires an existing database");
	return result;
}
/** Keep this importer's admission and release code available across package replacement. */
async function prepareOpenClawStateLeaseStorageRuntime() {
	await Promise.all([
		import("./openclaw-state-worker-store-RW5P1VzC.mjs"),
		import("./sqlite-worker-identity-C1DLLNmX.mjs"),
		import("./sqlite-worker-store-d0f4y8qR.mjs")
	]);
}
function admittedWorkerOperation(context, operation) {
	return async (admission) => {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
		return runOpenClawStateWorkerOperation(context, (scope) => operation(scope, admission.identity), {
			assertCurrent: admission.assertCurrent,
			createAdmission: admission.createAdmission
		});
	};
}
/** Preserve the original admission, maintenance scope and coordinator runtime. */
function createOpenClawStateLeaseWorkerStorage(context, processBound = false) {
	const storage = {
		path: context.admission.databasePath,
		assertCurrent() {
			context.maintenanceScope?.assertAdmission();
			context.admission.assertCurrent();
		},
		async withRetainedStartup(operation, assertCurrent) {
			assertCurrent();
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
			return runOpenClawStateWorkerOperation(context, () => operation(context), { assertCurrent });
		},
		acquire(owner, leaseMs, operationLabel, signal, observeExpiry = false) {
			return owner.runLifecycle("acquire", admittedWorkerOperation(context, (scope, identity) => scope.execute({
				type: "stateLease.acquire",
				input: {
					identity,
					leaseMs,
					operationLabel,
					processBound,
					...observeExpiry ? { observeExpiry: true } : {}
				}
			}, { signal })));
		},
		verify(owner, signal) {
			return owner.runLifecycle("verify", admittedWorkerOperation(context, (scope, identity) => scope.execute({
				type: "stateLease.verify",
				input: { identity }
			}, { signal })));
		},
		renew(owner, leaseMs, operationLabel, signal) {
			return owner.runLifecycle("renew", admittedWorkerOperation(context, (scope, identity) => scope.execute({
				type: "stateLease.renew",
				input: {
					identity,
					leaseMs,
					operationLabel
				}
			}, { signal })));
		},
		startTimer(owner, params) {
			const renew = () => storage.renew(owner, params.leaseMs, params.operationLabel, params.signal);
			return {
				...startOpenClawStateLeaseTimer({
					observation: params.observation,
					heartbeatMs: params.heartbeatMs,
					async renew() {
						await renew();
					},
					onRenewError(error) {
						try {
							owner.rethrowIfUncertain(error, void 0);
						} catch (uncertainty) {
							params.onLost(uncertainty);
							return;
						}
						if (error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_LOST" || Number(Atomics.load(params.observation, leaseHeartbeatState.expiresAt)) <= Date.now()) params.onLost(error);
					},
					onLost: (error) => params.onLost(error)
				}),
				verify: () => storage.verify(owner, params.signal),
				renew
			};
		},
		release(owner, operationLabel) {
			return owner.runLifecycle("release", async (admission) => {
				const { readDatabasePathIdentity } = await import("./sqlite-worker-identity-C1DLLNmX.mjs");
				const { runSqliteWorkerStoreOperation } = await import("./sqlite-worker-store-d0f4y8qR.mjs");
				const { openOpenClawStateWorkerCleanupStore } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
				admission.assertCurrent();
				const expectedIdentity = context.admission.identity.key;
				const observed = await readDatabasePathIdentity(storage.path);
				if (observed.key !== expectedIdentity) throw new Error("State lease cleanup cannot adopt a replacement shared database");
				admission.assertCurrent();
				const cleanupContext = {
					environment: context.environment,
					existingSchemaPath: context.existingSchemaPath
				};
				const store = await openOpenClawStateWorkerCleanupStore(storage.path, cleanupContext, admission.assertCurrent, observed);
				if (!store) throw new Error("State lease cleanup lost its original database");
				const errors = [];
				try {
					await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
						type: "stateLease.release",
						input: {
							identity: admission.identity,
							operationLabel,
							databaseIdentity: expectedIdentity
						}
					}), cleanupContext, admission.assertCurrent, admission.createAdmission);
				} catch (error) {
					errors.push(error);
				}
				try {
					await store.close();
				} catch (error) {
					errors.push(error);
				}
				throwSqliteLifecycleErrors(errors, "State lease release and worker close failed");
			});
		}
	};
	return storage;
}
//#endregion
export { createOpenClawStateLeaseWorkerStorage as n, prepareOpenClawStateLeaseStorageRuntime as r, acquireLease as t };
