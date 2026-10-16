import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
//#region src/gateway/worker-environments/placement-worker-mutation.ts
/** Admission fences precede the native commit; only its receipt publishes authority. */
function createPlacementWorkerMutation(params) {
	let admission;
	let publication;
	let transactionGranted = false;
	let commitGranted = false;
	const check = () => {
		params.context.admission.assertCurrent();
		params.assertCurrent?.();
	};
	const publish = (receipt) => {
		publication?.commit();
		params.publish?.(receipt);
		return receipt;
	};
	return {
		get transactionGranted() {
			return transactionGranted;
		},
		get commitGranted() {
			return commitGranted;
		},
		get settlement() {
			return admission?.settlement;
		},
		async run(operation) {
			try {
				return await runOpenClawStateWorkerOperation(params.context, async (scope) => publish(await operation(scope)), {
					assertCurrent: check,
					createAdmission: () => {
						let stage = "transaction";
						admission = createSqliteWorkerOperationAdmission((request, grant) => {
							if (params.orderedAdmission && request.stage !== stage) throw new Error(`${params.label} admission is out of order`);
							check();
							const facts = params.admissionFacts ? params.admissionFacts(request) : request.facts;
							if (request.stage === "commit") publication = params.stageCommit(facts) ?? publication;
							if (!grant()) {
								publication?.rollback();
								throw new Error(`${params.label} admission expired`);
							}
							transactionGranted ||= request.stage === "transaction";
							commitGranted ||= request.stage === "commit";
							stage = "commit";
						});
						return {
							nativeLocations: [params.nativeLocation],
							admission
						};
					}
				});
			} catch (error) {
				const committed = admission?.committed ?? admission?.settlement?.committed;
				if (committed) {
					const receipt = params.readReceipt(committed.facts, publication);
					if (receipt !== void 0) return publish(receipt);
				}
				if (!commitGranted || admission?.settlement?.kind === "completed") publication?.rollback();
				else if (params.recoverUnknown) {
					const receipt = await params.recoverUnknown(error, publication);
					if (receipt !== void 0) return publish(receipt);
				} else publication?.invalidate();
				throw error;
			}
		}
	};
}
//#endregion
export { createPlacementWorkerMutation as t };
