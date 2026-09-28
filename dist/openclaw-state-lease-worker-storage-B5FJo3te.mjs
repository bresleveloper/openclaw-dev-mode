import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BXipLxiQ.mjs";
import { n as startOpenClawStateLeaseTimer } from "./openclaw-state-lease-heartbeat-Bx8MXIzo.mjs";
import { r as leaseHeartbeatState } from "./openclaw-state-lease-heartbeat-shared-D-D6j71P.mjs";
import { n as withOpenClawStateLeaseWorkerAdmission } from "./openclaw-state-lease-worker-owner-BTTWFunC.mjs";
//#region src/state/openclaw-state-lease-worker-storage.ts
/** Preserve the original admission, maintenance scope and coordinator runtime. */
function createOpenClawStateLeaseWorkerStorage(context) {
	const storage = {
		path: context.admission.databasePath,
		assertCurrent() {
			context.maintenanceScope?.assertAdmission();
			context.admission.assertCurrent();
		},
		async withRetainedStartup(operation, assertCurrent) {
			assertCurrent();
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
			return runOpenClawStateWorkerOperation(context, () => operation(context), { assertCurrent });
		},
		acquire(owner, leaseMs, operationLabel, signal, observeExpiry = false) {
			return owner.runLifecycle("acquire", async (admission) => {
				const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
				return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
					type: "stateLease.acquire",
					input: {
						identity: admission.identity,
						leaseMs,
						operationLabel,
						...observeExpiry ? { observeExpiry: true } : {}
					}
				}, { signal }), {
					assertCurrent: admission.assertCurrent,
					createAdmission: admission.createAdmission
				});
			});
		},
		verify(owner, signal) {
			return owner.runLifecycle("verify", async (admission) => {
				const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
				return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
					type: "stateLease.verify",
					input: { identity: admission.identity }
				}, { signal }), {
					assertCurrent: admission.assertCurrent,
					createAdmission: admission.createAdmission
				});
			});
		},
		renew(owner, leaseMs, operationLabel, signal) {
			return owner.runLifecycle("renew", async (admission) => {
				const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
				return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
					type: "stateLease.renew",
					input: {
						identity: admission.identity,
						leaseMs,
						operationLabel
					}
				}, { signal }), {
					assertCurrent: admission.assertCurrent,
					createAdmission: admission.createAdmission
				});
			});
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
				const { readDatabasePathIdentity } = await import("./sqlite-worker-identity-VF4WgweV.mjs");
				const { runSqliteWorkerStoreOperation } = await import("./sqlite-worker-store-ID7IGMTW.mjs");
				const { openOpenClawStateWorkerCleanupStore } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
				admission.assertCurrent();
				const expectedIdentity = context.admission.identity.key;
				if ((await readDatabasePathIdentity(storage.path)).key !== expectedIdentity) throw new Error("State lease cleanup cannot adopt a replacement shared database");
				admission.assertCurrent();
				const cleanupContext = {
					environment: context.environment,
					coordinatorRuntime: {
						...context.coordinatorRuntime,
						keepAlive: false
					},
					existingSchemaPath: context.existingSchemaPath
				};
				const store = await openOpenClawStateWorkerCleanupStore(storage.path, cleanupContext, admission.assertCurrent);
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
					}), cleanupContext, admission.assertCurrent, admission.createAdmission, true);
				} catch (error) {
					errors.push(error);
				}
				try {
					await store.close();
				} catch (error) {
					errors.push(error);
				}
				if (errors.length === 1) throw errors[0];
				if (errors.length > 1) throw new AggregateError(errors, "State lease release and worker close failed", { cause: errors[0] });
			});
		}
	};
	return storage;
}
/** Retain the actual lease until every admitted worker transaction has settled. */
function runWithOpenClawStateLeaseWorker(lease, context, operation, authority) {
	return withOpenClawStateLeaseWorkerAdmission(lease, context.admission.databasePath, async (admission) => {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
		return runOpenClawStateWorkerOperation(context, (scope) => operation(scope, admission.identity), {
			assertCurrent: admission.assertCurrent,
			createAdmission: admission.createAdmission
		});
	}, authority);
}
//#endregion
export { runWithOpenClawStateLeaseWorker as n, createOpenClawStateLeaseWorkerStorage as t };
