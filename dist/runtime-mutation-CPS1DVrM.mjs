import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { deserialize } from "node:v8";
import { randomUUID } from "node:crypto";
import { MessagePort } from "node:worker_threads";
//#region src/cron/service/runtime-mutation.ts
/** One settlement owner serves typed cron mutations; callbacks and database handles stay local. */
async function runCronRuntimeMutation(params) {
	const nonce = randomUUID();
	let settlement;
	let native;
	let bytes;
	let published = false;
	let conflict;
	let receiptRevision;
	let mutationRefusal;
	const assertCurrent = () => {
		params.context.admission.assertCurrent();
		params.assertCurrent();
	};
	const publishCommitted = () => {
		const committed = native?.committed?.facts;
		if (published || !isRecord(committed) || committed.nonce !== nonce) return;
		if (!bytes) throw new Error("Committed cron mutation lost its retained outcome");
		const outcome = deserialize(bytes);
		published = true;
		bytes = void 0;
		params.publish(outcome);
	};
	try {
		await runOpenClawStateWorkerOperation(params.context, async (scope) => {
			try {
				const command = {
					type: params.type,
					input: {
						...params.input,
						nonce
					}
				};
				const result = await scope.execute(command);
				if (result.nonce !== nonce) throw new Error("Cron mutation returned a different operation nonce");
				if ("conflict" in result) {
					if (params.type !== "cron.reserveRuns" || !params.onRolledBackConflict) throw new Error("Cron mutation returned an unexpected reservation conflict");
					conflict = result.conflict;
				}
				if ("receiptRevision" in result) {
					if (params.type !== "cron.finalizeRuns" || !params.onRolledBackReceiptRevision) throw new Error("Cron mutation returned an unexpected receipt revision refusal");
					receiptRevision = result.receiptRevision;
				}
				if ("mutationRefusal" in result) {
					if (params.type !== "cron.mutateJobs" || !params.onRolledBackMutation) throw new Error("Cron mutation returned an unexpected job mutation refusal");
					mutationRefusal = result.mutationRefusal;
				}
			} finally {
				await settlement;
				publishCommitted();
			}
		}, {
			assertCurrent,
			createAdmission(retained) {
				settlement = retained.settled;
				let phase = "transaction";
				let preparation;
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					const facts = request.facts;
					const port = isRecord(facts) && facts.preparationPort instanceof MessagePort ? facts.preparationPort : void 0;
					try {
						assertCurrent();
						if (!isRecord(facts) || facts.nonce !== nonce || request.stage !== phase) throw new Error("Cron mutation differs from its retained transaction owner");
						if (request.stage === "transaction") {
							if (!port) throw new Error("Cron mutation has no policy preparation port");
							preparation = params.prepare(facts.preparation);
							port.postMessage(preparation.value, []);
							phase = "commit";
						} else {
							if (!(facts.bytes instanceof Uint8Array) || !preparation) throw new Error("Cron mutation has no prepared outcome");
							preparation.assertCurrent();
							bytes = facts.bytes;
							phase = "settling";
						}
					} finally {
						port?.close();
					}
					if (!grant()) throw new Error("Cron mutation admission expired");
				});
				native = admission;
				return {
					nativeLocations: [params.context.admission.databasePath],
					admission
				};
			}
		});
		if (conflict) {
			const settled = await settlement;
			if (native?.committed || native?.settlement?.kind !== "completed" || settled?.kind !== "completed") throw new Error("Cron reservation conflict has no confirmed native rollback");
			params.onRolledBackConflict(conflict);
		} else if (receiptRevision) {
			const settled = await settlement;
			if (native?.committed || native?.settlement?.kind !== "completed" || settled?.kind !== "completed") throw new Error("Cron receipt revision refusal has no confirmed native rollback");
			params.onRolledBackReceiptRevision(receiptRevision);
		} else if (mutationRefusal) {
			const settled = await settlement;
			if (native?.committed || native?.settlement?.kind !== "completed" || settled?.kind !== "completed") throw new Error("Cron job mutation refusal has no confirmed native rollback");
			params.onRolledBackMutation(mutationRefusal);
		} else if (!published) throw new Error("Cron mutation did not publish a committed outcome");
	} finally {
		const settled = await settlement;
		try {
			publishCommitted();
		} finally {
			params.onSettled?.(native?.committed ? "committed" : settled === void 0 || settled.kind === "not-entered" || native?.settlement?.kind === "completed" ? "not-committed" : "unknown");
			bytes = void 0;
		}
	}
}
//#endregion
export { runCronRuntimeMutation as t };
