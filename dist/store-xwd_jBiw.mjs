import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { a as publishSqliteCommittedState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, t as assertPublishedOpenClawStateDatabaseLifecycle, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { r as workerEnvironmentProjections } from "./store-native-publication-BmUHu_Dk.mjs";
import { t as WorkerEnvironmentInventoryClosedError } from "./store-errors-kA3tiw7L.mjs";
import { N as stagePlacementTurnClaimWorkerPublication } from "./placement-row-codec-DhdW6tSs.mjs";
import { a as preparedCapacityFromReservations, i as isPreparedReservationWithinCapacity, s as selectPreparedEnvironmentReservations } from "./prepared-environment-store-BAIUv_7G.mjs";
import { a as normalizeCredentialHash, u as requireWorkerEnvironmentString } from "./store-validation-BTwB_X05.mjs";
import { n as readWorkerEnvironmentReceipt } from "./store-receipt-DJp31XV1.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/worker-environments/store.ts
function isCommitAdmission(value) {
	return Array.isArray(value) && value.every((fact) => isRecord(fact) && typeof fact.environmentId === "string" && typeof fact.environmentAuthority === "string" && typeof fact.credentialAuthority === "string" && typeof fact.transferAuthority === "string" && typeof fact.attachmentAuthority === "string");
}
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened" && event.kind !== "open-error") workerEnvironmentProjections.invalidate(event.identity, event.path);
});
async function createWorkerEnvironmentStore(options = {}) {
	const inCreationScope = AsyncLocalStorage.snapshot();
	let context = captureOpenClawStateWorkerContext(options.database ? { path: options.database.path } : {});
	const pathname = context.admission.databasePath;
	const now = options.now ?? Date.now;
	let owner = workerEnvironmentProjections.acquire(() => context.admission.identity);
	let releaseOwner = owner.retain();
	const revocationSubscriptions = /* @__PURE__ */ new Set();
	const operations = /* @__PURE__ */ new Set();
	let closed = false;
	let closing;
	let retiring;
	let recovering;
	let versionOffset = 0;
	const assertActive = () => {
		if (closed || !owner.active) throw new WorkerEnvironmentInventoryClosedError();
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
	function mutate(type, input, assertCurrent = () => {}, revocationId) {
		assertActive();
		if (closing) throw new Error("Worker environment inventory is closing");
		const captured = structuredClone({
			...input,
			nowMs: options.now?.(),
			publicationIncarnation: owner.incarnation
		});
		return track(owner.enqueue(async () => {
			const token = {};
			let admission;
			let commitSequence;
			let committedIds = [];
			let revocationPublished = false;
			let installed = false;
			const publishRevocation = () => {
				if (revocationId === void 0 || revocationPublished) return;
				revocationPublished = true;
				owner.publishCredentialRevoked(revocationId);
			};
			const check = () => owner.withAdmission(token, () => {
				assertActive();
				assertCurrent();
			});
			const install = (receipt) => {
				if (installed) return;
				if (!isRecord(receipt) || commitSequence === void 0) throw new Error("Worker environment mutation has no commit admission");
				context.admission.assertCurrent();
				const facts = readWorkerEnvironmentReceipt(receipt.publication, {
					identity: context.admission.identity.key,
					incarnation: owner.incarnation
				}, committedIds);
				const revision = commitSequence;
				publishSqliteCommittedState({
					installFacts() {
						owner.install(facts, revision, false);
						for (const placement of facts.placements ?? []) stagePlacementTurnClaimWorkerPublication(context.admission.identity, placement, void 0, void 0, placement).commit();
						owner.release(token);
						installed = true;
					},
					invalidate() {
						owner.close();
						installed = true;
					},
					installProjection: publishRevocation,
					notify() {
						if (receipt.changed === true) sessionChanges.emit({
							all: true,
							scope: "worker-environments"
						});
					}
				});
			};
			check();
			try {
				return await runOpenClawStateWorkerOperation(context, async (scope) => {
					const receipt = await scope.execute({
						type,
						input: captured
					});
					install(receipt);
					return receipt.result;
				}, {
					assertCurrent: check,
					createAdmission: () => {
						admission = createSqliteWorkerOperationAdmission((request, grant) => {
							check();
							if (request.stage === "commit") {
								if (!isCommitAdmission(request.facts)) throw new Error("Worker inventory commit lacks affected authority facts");
								committedIds = request.facts.map((fact) => fact.environmentId);
								owner.fence(request.facts, token);
							}
							if (!grant()) throw new Error("Worker environment mutation admission expired");
							if (request.stage === "commit") commitSequence = owner.nextSequence();
						});
						observeSqliteWorkerCommittedFacts(admission, ({ facts }) => install(facts));
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
				if (!installed && committed) try {
					install(committed);
				} catch {}
				if (!installed && commitSequence !== void 0 && !(settlement?.kind === "completed" && !committedReceipt)) try {
					const revision = owner.nextSequence();
					const facts = await snapshot(committedIds);
					publishSqliteCommittedState({
						installFacts() {
							owner.install(facts, revision, false);
							owner.release(token);
						},
						installProjection() {
							if (revocationId && !facts.credentials.some((credential) => credential.environmentId === revocationId)) publishRevocation();
						},
						invalidate: () => owner.close(),
						notify: () => sessionChanges.emit({
							all: true,
							scope: "worker-environments"
						})
					});
				} catch {
					owner.close();
				}
				owner.release(token);
				throw error;
			} finally {
				if (commitSequence === void 0) owner.release(token);
			}
		}));
	}
	const retire = (retireInventory = true) => retiring ??= (async () => {
		await Promise.allSettled(operations);
		if (retireInventory) owner.close();
		if (releaseOwner() && !retireInventory) workerEnvironmentProjections.remove(owner);
	})();
	const close = () => closing ??= (async () => {
		await retire(false);
		await Promise.allSettled(recovering ? [recovering] : []);
		closed = true;
		for (const unsubscribe of revocationSubscriptions) unsubscribe();
		revocationSubscriptions.clear();
		unregister();
	})();
	const unregister = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
		if (!identity) await close();
		else if (identity.key === context.admission.identity.key) await retire();
	} });
	try {
		await mutate("workerEnvironments.initialize", {});
		workerEnvironmentProjections.get(context.admission.identity);
		await owner.enqueue(async () => {
			const facts = await snapshot();
			owner.install(facts, owner.nextSequence(), false);
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
		if (closing) throw new WorkerEnvironmentInventoryClosedError();
		try {
			assertActive();
		} catch (error) {
			if (closed || closing || !(error instanceof WorkerEnvironmentInventoryClosedError) && !isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
			await (recovering ??= (async () => {
				await retire();
				if (closing) throw new WorkerEnvironmentInventoryClosedError();
				assertPublishedOpenClawStateDatabaseLifecycle();
				const previous = context.admission.identity;
				const next = inCreationScope(() => captureOpenClawStateWorkerContext({
					path: pathname,
					env: context.initializationEnvironment
				}));
				if (next.admission.identity.key !== previous.key || next.admission.identity.birthtime !== previous.birthtime) throw new Error("Worker environment inventory database identity changed", { cause: error });
				versionOffset += owner.version() + 1;
				context = next;
				owner = workerEnvironmentProjections.acquire(() => context.admission.identity);
				releaseOwner = owner.retain();
				retiring = void 0;
				reservationVersion = -1;
				try {
					await owner.enqueue(async () => {
						const facts = await inCreationScope(() => snapshot());
						owner.install(facts, owner.nextSequence(), false);
					});
					sessionChanges.emit({
						all: true,
						scope: "worker-environments"
					});
				} catch (recoveryError) {
					await retire();
					throw recoveryError;
				}
			})().finally(() => {
				recovering = void 0;
			}));
		}
		await owner.ready();
		assertActive();
	};
	return {
		close,
		ready,
		async hasSessionAttachment(environmentId) {
			await ready();
			return read(() => owner.hasSessionAttachment(requireWorkerEnvironmentString(environmentId, "id")));
		},
		inventoryVersion: () => read(() => versionOffset + owner.version()),
		get: (id) => read(() => owner.get(requireWorkerEnvironmentString(id, "id"))),
		list: () => read(() => owner.list()),
		listForReconcile: () => read(() => owner.list(true)),
		getCredential: (id) => read(() => owner.credential(requireWorkerEnvironmentString(id, "id"))),
		findCredentialByHash: (hash) => read(() => owner.credentialByHash(normalizeCredentialHash(hash))),
		getTransferOwner: (id) => read(() => owner.transferOwner(requireWorkerEnvironmentString(id, "id"))),
		hasNodeEnrollmentOwner: (nodeId) => read(() => owner.hasNodeEnrollmentOwner(nodeId)),
		hasPendingNodeEnrollmentSetup: (setup, device) => read(() => owner.hasPendingNodeEnrollmentSetup(setup, device)),
		preparedCapacity: (input) => read(() => preparedCapacityFromReservations(prepared(), input)),
		preparedReservationEnvironmentIds: () => read(() => prepared().map((record) => record.environmentId)),
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
		createIntent: (input, assertCurrent) => mutate("workerEnvironments.createIntent", { input }, assertCurrent),
		ensureNodeEnrollment: (input) => mutate("workerEnvironments.ensureNodeEnrollment", { input }),
		async revokeEnvironmentCredential(input, opts = {}) {
			const environmentId = requireWorkerEnvironmentString(input, "id");
			await mutate("workerEnvironments.revokeEnvironmentCredential", { input: {
				environmentId,
				expectedOwnerEpoch: opts.expectedOwnerEpoch
			} }, opts.assertCurrent, opts.fenceWorkspaceTransfers ? environmentId : void 0);
		},
		reconcileSharedHost: (input) => mutate("workerEnvironments.reconcileSharedHost", { input }),
		adoptProvisionCleanupFailure: (input) => mutate("workerEnvironments.adoptProvisionCleanupFailure", { input }),
		requestDestroy({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.requestDestroy", { input }, assertCurrent);
		},
		refreshBootstrapReceipt({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.refreshBootstrapReceipt", { input }, assertCurrent);
		},
		transition({ assertCurrent, placementBinding, ...input }) {
			const binding = placementBinding ? (({ assertCurrent: _guard, ...facts }) => facts)(placementBinding) : void 0;
			return mutate("workerEnvironments.transition", { input: {
				...input,
				placementBinding: binding
			} }, () => {
				assertCurrent?.();
				placementBinding?.assertCurrent();
			});
		},
		renewCredential({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.renewCredential", { input }, assertCurrent);
		},
		markCredentialDelivered({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.markCredentialDelivered", { input }, assertCurrent);
		},
		recordError({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.recordError", { input }, assertCurrent);
		},
		ensurePreparedIntent({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.ensurePreparedIntent", { input }, assertCurrent);
		},
		requestPreparedDestroy({ assertCurrent, ...input }) {
			return mutate("workerEnvironments.requestPreparedDestroy", { input }, assertCurrent);
		},
		createSessionAttachmentIntent(input, assertCurrent) {
			return mutate("workerEnvironments.createSessionAttachmentIntent", { input }, assertCurrent);
		},
		closeSessionAttachment(input, assertCurrent = () => {}) {
			return mutate("workerEnvironments.closeSessionAttachment", { input }, assertCurrent);
		},
		cancelSessionAttachmentReservation(input) {
			return mutate("workerEnvironments.cancelSessionAttachmentReservation", { input });
		},
		touchSessionAttachment(input, assertCurrent) {
			return mutate("workerEnvironments.touchSessionAttachment", { input }, assertCurrent);
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
				return await mutate("workerEnvironments.pruneTerminalEnvironments", { input: { approved: approved.map((candidate) => candidate.observed) } }, () => {
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
export { createWorkerEnvironmentStore };
