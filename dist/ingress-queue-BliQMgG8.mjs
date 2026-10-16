import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { t as resolveChannelIngressStateEnv } from "./ingress-queue-client-BTyDwm0g.mjs";
import { a as corruptClaimRecord, i as completedRecord, l as selectChannelIngressClaim, n as baseRecord, o as decodeClaimColumns, r as claimedRecord, s as failedRecord } from "./ingress-queue.codec-BSYlAVif.mjs";
//#region src/channels/message/ingress-queue.ts
var ChannelIngressClaimPolicyConflict = class extends Error {
	constructor(settled) {
		super("Channel ingress lane policy changed before claim commit");
		this.settled = settled;
	}
};
function normalizePart(value, fallback) {
	return value?.trim() || fallback;
}
function idFrom(value) {
	const id = normalizePart(typeof value === "string" ? value : value.id, "");
	if (!id) throw new Error("Channel ingress event id cannot be empty");
	return id;
}
function tokenFrom(value) {
	return typeof value === "string" ? null : value.claim?.token ?? null;
}
function requiredRecord(row) {
	const record = baseRecord(row);
	if (!record) throw new Error(`Corrupt payload_json in channel ingress event ${row.queue_name}/${row.event_id}`);
	return record;
}
/** Account discovery never creates or migrates a missing database. */
async function listChannelIngressQueueAccountIdsReadOnly(params) {
	const reply = await executeExistingOpenClawStateRead({ env: resolveChannelIngressStateEnv(params.stateDir) }, {
		type: "channelIngress.accounts",
		input: { channelId: normalizePart(params.channelId, "unknown") }
	});
	if (!reply) return [];
	if (!reply.ok || reply.type !== "channelIngress.accounts") throw new Error("Channel ingress account reader returned an unexpected result");
	return reply.result;
}
/** Durable ingress decisions commit in the shared-state worker; channels retain payload policy. */
function createChannelIngressQueue(options, assertCurrent) {
	assertCurrent?.();
	const channelId = normalizePart(options.channelId, "unknown");
	const accountId = normalizePart(options.accountId, "default");
	const queueName = JSON.stringify([channelId, accountId]);
	const scope = {
		channelId,
		accountId,
		queueName
	};
	const env = resolveChannelIngressStateEnv(options.stateDir);
	const readOnly = options.access === "read-only";
	const clock = options.now;
	const now = clock ?? Date.now;
	const assertQueueCurrent = (context) => {
		context.admission.assertCurrent();
		assertCurrent?.();
	};
	const capture = () => {
		assertCurrent?.();
		return captureOpenClawStateWorkerContext({ env });
	};
	const execute = async (type, input, context = capture(), signal, isClaimSelectionCurrent) => {
		const assertActive = () => {
			assertQueueCurrent(context);
			signal?.throwIfAborted();
		};
		const claimClock = type === "channelIngress.claim" || type === "channelIngress.claimNext" ? clock : void 0;
		const result = await runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
			type,
			input
		}, { signal }), {
			assertCurrent: assertActive,
			createAdmission: claimClock || isClaimSelectionCurrent ? (operation) => {
				const transitionClock = claimClock ? new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT)) : void 0;
				let stage = "transaction";
				return {
					nativeLocations: [context.admission.databasePath],
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						if (request.stage !== stage) throw new Error("Channel ingress claim authority requested out of order");
						assertActive();
						if (stage === "transaction" && claimClock && transitionClock) transitionClock[0] = claimClock();
						const selectionCurrent = isClaimSelectionCurrent?.() ?? true;
						assertActive();
						if (!selectionCurrent) throw new ChannelIngressClaimPolicyConflict(operation.settled);
						if (!grant()) throw new Error("Channel ingress claim authority expired");
						stage = stage === "transaction" ? "commit" : "settled";
					}, transitionClock)
				};
			} : createSqliteWorkerWriteAdmission(assertActive, [context.admission.databasePath])
		});
		if (type === "channelIngress.list" || type === "channelIngress.claimSnapshot" || type === "channelIngress.staleClaims") assertQueueCurrent(context);
		return result;
	};
	const readRows = async (input) => {
		const context = capture();
		const rows = await runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
			type: "channelIngress.list",
			input: {
				...input,
				queueName,
				readOnly
			}
		}), {
			existingOnly: readOnly,
			assertCurrent
		});
		assertQueueCurrent(context);
		return rows ?? [];
	};
	const mutation = (value, at) => ({
		queueName,
		id: idFrom(value),
		token: tokenFrom(value),
		now: at
	});
	const recoverStaleClaims = async (recoverOptions) => {
		const context = capture();
		const shouldRecover = recoverOptions?.shouldRecover;
		const shouldRecoverCorrupt = recoverOptions?.shouldRecoverCorrupt;
		const current = recoverOptions?.now ?? now();
		const cutoff = current - Math.max(0, Math.floor(recoverOptions?.staleMs ?? 0));
		const rows = await execute("channelIngress.staleClaims", {
			queueName,
			cutoff
		}, context);
		let recovered = 0;
		for (const row of rows) {
			assertQueueCurrent(context);
			const columns = decodeClaimColumns(row);
			const record = columns === null ? null : claimedRecord(row);
			if (record) {
				if (shouldRecover) {
					const recover = await shouldRecover(record);
					assertQueueCurrent(context);
					if (!recover) continue;
				}
			} else if (columns !== null) {
				if (shouldRecoverCorrupt) {
					const recover = await shouldRecoverCorrupt(corruptClaimRecord(row, columns));
					assertQueueCurrent(context);
					if (!recover) continue;
				} else if (shouldRecover) continue;
			}
			assertQueueCurrent(context);
			if (await execute("channelIngress.recover", {
				row,
				cutoff,
				now: current
			}, context)) recovered++;
		}
		return recovered;
	};
	const claimNext = async (claimOptions) => {
		const context = capture();
		const deriveLaneKey = claimOptions?.deriveLaneKey;
		const reconcileStoredLaneKey = claimOptions?.reconcileStoredLaneKey;
		const ownerId = normalizePart(claimOptions?.ownerId, `${process.pid}`);
		if (claimOptions?.staleMs !== void 0) await recoverStaleClaims({ staleMs: claimOptions.staleMs });
		const candidateIds = claimOptions?.candidateIds === void 0 ? void 0 : [...claimOptions.candidateIds].map((id) => id.trim()).filter(Boolean);
		if (candidateIds?.length === 0) return null;
		const request = {
			queueName,
			candidateIds,
			blockedLaneKeys: [...claimOptions?.blockedLaneKeys ?? []].map((key) => key.trim()).filter(Boolean),
			deriveLaneKey: Boolean(deriveLaneKey),
			orderBy: claimOptions?.orderBy,
			scanLimit: claimOptions?.scanLimit
		};
		const resolveLane = (row) => {
			if (row.status === "claimed" && row.lane_key && !reconcileStoredLaneKey) return row.lane_key;
			const record = baseRecord(row);
			if (!record) return row.lane_key ?? void 0;
			const stored = record.laneKey;
			if (stored === void 0) return deriveLaneKey?.(record);
			if (!deriveLaneKey || !reconcileStoredLaneKey) return stored;
			const derived = deriveLaneKey(record);
			return derived && derived !== stored && reconcileStoredLaneKey(record, stored, derived) ? derived : stored;
		};
		while (true) {
			const snapshot = await execute("channelIngress.claimSnapshot", request, context);
			const preparedLanes = [];
			const selection = selectChannelIngressClaim(snapshot, request, deriveLaneKey ? (row) => {
				const laneKey = resolveLane(row);
				preparedLanes.push({
					row,
					laneKey
				});
				return laneKey;
			} : resolveLane);
			try {
				const result = await execute("channelIngress.claimNext", {
					request,
					snapshot,
					selection,
					ownerId,
					customClock: clock ? true : void 0
				}, context, void 0, deriveLaneKey ? () => preparedLanes.every(({ row, laneKey }) => resolveLane(row) === laneKey) : void 0);
				if (result.kind === "conflict") continue;
				return result.row ? claimedRecord(result.row) : null;
			} catch (error) {
				if (error instanceof ChannelIngressClaimPolicyConflict && (await error.settled).kind === "completed") continue;
				throw error;
			}
		}
	};
	return {
		async enqueue(id, payload, enqueueOptions) {
			const eventId = idFrom(id);
			const receivedAt = enqueueOptions?.receivedAt ?? now();
			const result = await execute("channelIngress.enqueue", {
				...scope,
				id: eventId,
				payloadJson: JSON.stringify(payload),
				metadataJson: enqueueOptions?.metadata === void 0 ? null : JSON.stringify(enqueueOptions.metadata),
				receivedAt,
				now: now(),
				laneKey: enqueueOptions?.laneKey
			});
			const row = result.row;
			if (result.accepted) return {
				kind: "accepted",
				duplicate: false,
				record: requiredRecord(row)
			};
			if (row.status === "completed") return {
				kind: "completed",
				duplicate: true,
				record: completedRecord(row)
			};
			if (row.status === "failed") return {
				kind: "failed",
				duplicate: true,
				record: failedRecord(row)
			};
			if (row.status === "claimed") {
				const record = claimedRecord(row);
				if (!record) throw new Error(`Corrupt claimed channel ingress event ${queueName}/${eventId}`);
				return {
					kind: "claimed",
					duplicate: true,
					record
				};
			}
			return {
				kind: "pending",
				duplicate: true,
				record: requiredRecord(row)
			};
		},
		async listPending(listOptions) {
			return (await readRows({
				status: "pending",
				...listOptions
			})).map((row) => requiredRecord(row));
		},
		async listClaims() {
			return (await readRows({ status: "claimed" })).map((row) => claimedRecord(row)).filter((row) => row !== null);
		},
		async listUnsettled(listOptions) {
			const rows = await readRows({
				status: "unsettled",
				...listOptions
			});
			const pending = [];
			const claims = [];
			for (const row of rows) if (row.status === "claimed") {
				const claim = claimedRecord(row);
				if (claim) claims.push(claim);
			} else {
				const record = baseRecord(row);
				if (record) pending.push(record);
			}
			return {
				pending,
				claims
			};
		},
		async listFailed(listOptions) {
			return (await readRows({
				status: "failed",
				...listOptions
			})).map((row) => failedRecord(row));
		},
		claimNext,
		async claim(id, claimOptions) {
			const row = await execute("channelIngress.claim", {
				queueName,
				id: idFrom(id),
				ownerId: normalizePart(claimOptions?.ownerId, `${process.pid}`),
				customClock: clock ? true : void 0
			});
			return row ? claimedRecord(row) : null;
		},
		refreshClaim: async (claim, refreshOptions) => await execute("channelIngress.refresh", mutation(claim, refreshOptions?.refreshedAt ?? now())),
		complete: async (value, completeOptions) => await execute("channelIngress.complete", {
			...scope,
			...mutation(value, completeOptions?.completedAt ?? now()),
			metadataJson: completeOptions?.metadata === void 0 ? null : JSON.stringify(completeOptions.metadata)
		}),
		release: async (value, releaseOptions) => await execute("channelIngress.release", {
			...mutation(value, releaseOptions?.releasedAt ?? now()),
			recordAttempt: releaseOptions?.recordAttempt,
			lastError: releaseOptions?.lastError
		}),
		fail: async (value, failOptions) => await execute("channelIngress.fail", {
			...mutation(value, failOptions.failedAt ?? now()),
			reason: failOptions.reason,
			message: failOptions.message
		}),
		async resubmit(id, resubmitOptions) {
			const result = await execute("channelIngress.resubmit", {
				queueName,
				id: idFrom(id),
				now: resubmitOptions?.resubmittedAt ?? now()
			});
			switch (result.kind) {
				case "not-found":
				case "active": return result;
				case "completed": return {
					kind: result.kind,
					record: completedRecord(result.row)
				};
				case "unrecoverable": return {
					kind: result.kind,
					record: failedRecord(result.row)
				};
				case "resubmitted": return {
					kind: result.kind,
					record: requiredRecord(result.row),
					previous: failedRecord(result.previous)
				};
			}
			return result;
		},
		delete: async (value) => await execute("channelIngress.delete", mutation(value, now())),
		recoverStaleClaims,
		purge: async (purgeOptions) => await execute("channelIngress.purge", { queueName }, capture(), purgeOptions?.signal),
		async prune(pruneOptions) {
			assertCurrent?.();
			if (!pruneOptions || pruneOptions.pendingTtlMs === void 0 && pruneOptions.completedTtlMs === void 0 && pruneOptions.failedTtlMs === void 0 && pruneOptions.pendingMaxEntries === void 0 && pruneOptions.completedMaxEntries === void 0 && pruneOptions.failedMaxEntries === void 0) return 0;
			return execute("channelIngress.prune", {
				queueName,
				options: {
					...pruneOptions,
					protectIds: pruneOptions.protectIds === void 0 ? void 0 : [...pruneOptions.protectIds]
				},
				now: pruneOptions.now ?? now()
			});
		}
	};
}
//#endregion
export { listChannelIngressQueueAccountIdsReadOnly as n, createChannelIngressQueue as t };
