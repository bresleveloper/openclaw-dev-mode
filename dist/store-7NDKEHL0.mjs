import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { l as normalizeCredentialHash, m as requireWorkerEnvironmentString, r as workerEnvironmentProjections } from "./store-native-publication-DNMm5oc5.mjs";
import { a as preparedCapacityFromReservations, i as isPreparedReservationWithinCapacity, s as selectPreparedEnvironmentReservations } from "./prepared-environment-store-OTAww-4q.mjs";
//#region src/gateway/worker-environments/store.ts
function isInventoryFacts(value) {
	return isRecord(value) && Array.isArray(value.ids) && value.ids.every((id) => typeof id === "string") && Array.isArray(value.environments) && Array.isArray(value.credentials) && Array.isArray(value.attachments);
}
function isCommitAdmission(value) {
	return Array.isArray(value) && value.every((fact) => isRecord(fact) && typeof fact.environmentId === "string" && typeof fact.recordAuthority === "string" && typeof fact.transferAuthority === "string");
}
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") workerEnvironmentProjections.invalidate(event.identity, event.path);
});
async function createWorkerEnvironmentStore(options = {}) {
	const context = captureOpenClawStateWorkerContext(options.database ? { path: options.database.path } : {});
	const pathname = context.admission.databasePath;
	const now = options.now ?? Date.now;
	const owner = workerEnvironmentProjections.acquire(() => context.admission.identity);
	const releaseOwner = owner.retain();
	const revocationSubscriptions = /* @__PURE__ */ new Set();
	const operations = /* @__PURE__ */ new Set();
	let closed = false;
	let closing;
	const assertActive = () => {
		if (closed || !owner.active) throw new Error("Worker environment inventory has closed");
		context.admission.assertCurrent();
	};
	const read = (operation) => {
		assertActive();
		return operation();
	};
	async function snapshot(ids) {
		const reply = await executeExistingOpenClawStateRead({ path: pathname }, {
			type: "workerEnvironments.snapshot",
			ids
		});
		assertActive();
		if (!reply || !reply.ok || reply.type !== "workerEnvironments.snapshot") throw new Error("Worker environment inventory could not be read");
		return reply.facts;
	}
	function track(operation) {
		operations.add(operation);
		operation.then(() => operations.delete(operation), () => operations.delete(operation));
		return operation;
	}
	async function reconcilePending() {
		for (const recovery of owner.pendingReconciliations()) try {
			assertActive();
			const revision = owner.nextSequence();
			const facts = await snapshot(recovery.ids);
			owner.install(facts, revision, false);
			owner.release(recovery.token);
			if (recovery.revocationId && !facts.credentials.some((credential) => credential.environmentId === recovery.revocationId)) owner.publishCredentialRevoked(recovery.revocationId);
			sessionChanges.emit({
				all: true,
				scope: "worker-environments"
			});
		} catch (error) {
			throw new AggregateError([recovery.error, error], "Worker environment mutation failed and inventory reconciliation failed", { cause: error });
		}
	}
	function mutate(type, input, ids, assertCurrent = () => {}, revocationId) {
		assertActive();
		if (closing) throw new Error("Worker environment inventory is closing");
		const captured = structuredClone(input);
		return track(owner.enqueue(async () => {
			await reconcilePending();
			const token = {};
			let admission;
			let commitSequence;
			let committedIds = ids;
			let revocationPublished = false;
			const publishRevocation = () => {
				if (revocationId === void 0 || revocationPublished) return;
				revocationPublished = true;
				owner.publishCredentialRevoked(revocationId);
			};
			const check = () => owner.withAdmission(token, () => {
				assertActive();
				assertCurrent();
			});
			check();
			try {
				return await runOpenClawStateWorkerOperation(context, async (scope) => {
					const receipt = await scope.execute({
						type,
						input: captured
					});
					if (commitSequence === void 0) throw new Error("Worker environment mutation has no commit admission");
					owner.install(receipt.facts, commitSequence, false);
					owner.release(token);
					publishRevocation();
					if (receipt.changed) sessionChanges.emit({
						all: true,
						scope: "worker-environments"
					});
					return receipt.result;
				}, {
					assertCurrent: check,
					requireStateLifecycle: true,
					createAdmission: () => {
						let stage = "transaction";
						admission = createSqliteWorkerOperationAdmission((request, grant) => {
							if (request.stage !== stage) throw new Error("Worker environment write admission is out of order");
							check();
							if (request.stage === "commit") {
								if (!isCommitAdmission(request.facts)) throw new Error("Worker inventory commit lacks affected authority facts");
								committedIds = request.facts.map((fact) => fact.environmentId);
								owner.fence(request.facts, token);
							}
							if (!grant()) throw new Error("Worker environment mutation admission expired");
							if (request.stage === "commit") commitSequence = owner.nextSequence();
							stage = "commit";
						});
						return {
							nativeLocations: [pathname],
							admission
						};
					}
				});
			} catch (error) {
				const nativeCommit = admission?.committed;
				const settlement = admission?.settlement;
				const committedReceipt = nativeCommit ?? settlement?.committed;
				const committed = committedReceipt?.facts;
				if (isRecord(committed) && isInventoryFacts(committed.facts) && commitSequence !== void 0) {
					owner.install(committed.facts, commitSequence, false);
					owner.release(token);
					publishRevocation();
					if (committed.changed === true) sessionChanges.emit({
						all: true,
						scope: "worker-environments"
					});
				} else if (commitSequence !== void 0 && !(settlement?.kind === "completed" && !committedReceipt)) {
					owner.retainReconciliation(token, committedIds, error, revocationPublished ? void 0 : revocationId);
					await reconcilePending();
				}
				owner.release(token);
				throw error;
			} finally {
				if (commitSequence === void 0) owner.release(token);
			}
		}));
	}
	const close = () => closing ??= (async () => {
		await Promise.allSettled(operations);
		closed = true;
		for (const unsubscribe of revocationSubscriptions) unsubscribe();
		revocationSubscriptions.clear();
		unregister();
		if (releaseOwner()) workerEnvironmentProjections.remove(owner);
	})();
	const unregister = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
		if (!identity || identity.key === context.admission.identity.key) await close();
	} });
	try {
		await mutate("workerEnvironments.initialize", { nowMs: options.now?.() }, []);
		workerEnvironmentProjections.get(context.admission.identity);
		await owner.enqueue(async () => {
			for (;;) {
				const version = owner.version();
				const facts = await snapshot();
				if (owner.version() !== version) continue;
				owner.install(facts, owner.nextSequence(), false);
				break;
			}
		});
	} catch (error) {
		await close();
		throw error;
	}
	let reservationVersion = -1;
	let reservations = [];
	const prepared = () => {
		if (reservationVersion !== owner.version()) {
			reservations = selectPreparedEnvironmentReservations(owner.preparedRecords());
			reservationVersion = owner.version();
		}
		return reservations;
	};
	const ready = async () => {
		assertActive();
		for (;;) {
			await owner.ready();
			assertActive();
			if (!owner.hasPendingReconciliation()) return;
			await track(owner.enqueue(reconcilePending));
		}
	};
	return {
		close,
		ready,
		async hasSessionAttachment(environmentId) {
			await ready();
			return read(() => owner.hasSessionAttachment(requireWorkerEnvironmentString(environmentId, "id")));
		},
		inventoryVersion: () => read(owner.version),
		get: (id) => read(() => owner.get(requireWorkerEnvironmentString(id, "id"))),
		list: () => read(() => owner.list()),
		listForReconcile: () => read(() => owner.list(true)),
		getCredential: (id) => read(() => owner.credential(requireWorkerEnvironmentString(id, "id"))),
		findCredentialByHash: (hash) => read(() => owner.credentialByHash(normalizeCredentialHash(hash))),
		getTransferOwner: (id) => read(() => owner.transferOwner(requireWorkerEnvironmentString(id, "id"))),
		hasNodeEnrollmentOwner: (nodeId) => read(() => owner.hasNodeEnrollmentOwner(nodeId)),
		hasPendingNodeEnrollmentSetup: (setup, device) => read(() => owner.hasPendingNodeEnrollmentSetup(setup, device)),
		preparedCapacity: (input) => read(() => preparedCapacityFromReservations(prepared(), input)),
		isPreparedIntentWithinCapacity: (input) => read(() => {
			owner.get(input.environmentId);
			return isPreparedReservationWithinCapacity(prepared(), input);
		}),
		getSessionAttachmentRecord: (id) => read(() => owner.attachment(id)),
		listSessionAttachmentRecords: () => read(() => owner.attachments()),
		findSessionAttachmentRecord(input) {
			assertActive();
			const rows = owner.attachments().filter((row) => row.agentId === input.agentId && row.sessionKey === input.sessionKey && row.closedAtMs === null);
			return rows.length === 1 ? owner.attachment(rows[0].sessionId) : void 0;
		},
		onCredentialRevoked(listener) {
			assertActive();
			const unsubscribe = owner.onCredentialRevoked(listener);
			revocationSubscriptions.add(unsubscribe);
			return () => {
				unsubscribe();
				revocationSubscriptions.delete(unsubscribe);
			};
		},
		createIntent: (input, assertCurrent) => mutate("workerEnvironments.createIntent", {
			input,
			nowMs: options.now?.()
		}, [input.environmentId], assertCurrent),
		ensureNodeEnrollment: (input) => mutate("workerEnvironments.ensureNodeEnrollment", {
			input,
			nowMs: options.now?.()
		}, [input]),
		async revokeEnvironmentCredential(input, opts = {}) {
			const environmentId = requireWorkerEnvironmentString(input, "id");
			await mutate("workerEnvironments.revokeEnvironmentCredential", {
				input: {
					environmentId,
					expectedOwnerEpoch: opts.expectedOwnerEpoch
				},
				nowMs: options.now?.()
			}, [environmentId], opts.assertCurrent, opts.fenceWorkspaceTransfers ? environmentId : void 0);
		},
		reconcileSharedHost: (input) => mutate("workerEnvironments.reconcileSharedHost", {
			input,
			nowMs: options.now?.()
		}, [input.environmentId]),
		adoptProvisionCleanupFailure: (input) => mutate("workerEnvironments.adoptProvisionCleanupFailure", {
			input,
			nowMs: options.now?.()
		}, [input.environmentId]),
		requestDestroy({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.requestDestroy", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId], assertCurrent);
		},
		refreshBootstrapReceipt({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.refreshBootstrapReceipt", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId], assertCurrent);
		},
		transition({ assertCurrent, placementBinding, ...input }) {
			const binding = placementBinding ? (({ assertCurrent: _guard, ...facts }) => facts)(placementBinding) : void 0;
			return mutate("workerEnvironments.transition", {
				input: {
					...input,
					placementBinding: binding
				},
				nowMs: options.now?.()
			}, [input.environmentId], () => {
				assertCurrent?.();
				placementBinding?.assertCurrent();
			});
		},
		renewCredential({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.renewCredential", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId], assertCurrent);
		},
		markCredentialDelivered({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.markCredentialDelivered", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId], assertCurrent);
		},
		recordError({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.recordError", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId], assertCurrent);
		},
		ensurePreparedIntent({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.ensurePreparedIntent", {
				input,
				nowMs: options.now?.()
			}, owner.list().filter((row) => row.preparation !== null).map((row) => row.environmentId).concat(input.intent.environmentId), assertCurrent);
		},
		requestPreparedDestroy({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.requestPreparedDestroy", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId], assertCurrent);
		},
		createSessionAttachmentIntent(input, assertCurrent) {
			return mutate("workerEnvironments.createSessionAttachmentIntent", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId], assertCurrent);
		},
		closeSessionAttachment(input, assertCurrent = () => {}) {
			return mutate("workerEnvironments.closeSessionAttachment", {
				input,
				nowMs: options.now?.()
			}, [], assertCurrent);
		},
		cancelSessionAttachmentReservation(input) {
			return mutate("workerEnvironments.cancelSessionAttachmentReservation", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId]);
		},
		touchSessionAttachment(input, assertCurrent) {
			return mutate("workerEnvironments.touchSessionAttachment", {
				input,
				nowMs: options.now?.()
			}, [input.environmentId], assertCurrent);
		},
		async pruneTerminalEnvironments(input = {}) {
			assertActive();
			const nowMs = input.nowMs ?? now();
			const canPruneDemand = input.canPruneDemand;
			const approved = [];
			let cursor;
			for (;;) {
				const reply = await executeExistingOpenClawStateRead({ path: pathname }, {
					type: "workerEnvironments.pruneCandidates",
					input: {
						nowMs,
						limit: input.limit,
						cursor
					}
				});
				assertActive();
				if (!reply || !reply.ok || reply.type !== "workerEnvironments.pruneCandidates") throw new Error("Worker environment retention candidates could not be read");
				const page = reply.page;
				for (const candidate of page.candidates) {
					if (canPruneDemand?.(candidate.record, nowMs) ?? true) approved.push(candidate);
					if (approved.length === page.limit) break;
				}
				if (approved.length === page.limit || !page.nextCursor) break;
				cursor = page.nextCursor;
			}
			if (!approved.length) return 0;
			const demandChanged = /* @__PURE__ */ new Error("Worker environment demand changed during retention");
			try {
				return await mutate("workerEnvironments.pruneTerminalEnvironments", {
					input: { approved: approved.map((candidate) => candidate.observed) },
					nowMs: options.now?.()
				}, approved.map((candidate) => candidate.observed.environment_id), () => {
					for (const candidate of approved) if (!(canPruneDemand?.(candidate.record, nowMs) ?? true)) throw demandChanged;
				});
			} catch (error) {
				if (error === demandChanged) return 0;
				throw error;
			}
		}
	};
}
//#endregion
export { createWorkerEnvironmentStore as t };
