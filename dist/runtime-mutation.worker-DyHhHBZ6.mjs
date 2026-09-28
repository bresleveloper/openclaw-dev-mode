import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
import { serialize } from "node:v8";
//#region src/cron/store/runtime-mutation.worker.ts
/** Host policy is prepared only after this worker has read authoritative transaction rows. */
function prepareCronRuntimeMutation(_type, nonce, facts) {
	const { port1, port2 } = new MessageChannel();
	try {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: {
				nonce,
				preparation: facts,
				preparationPort: port2
			}
		}, [port2]);
		const preparation = receiveMessageOnPort(port1)?.message;
		if (!preparation) throw new Error("Cron mutation has no admitted policy preparation");
		return preparation;
	} finally {
		port1.close();
		port2.close();
	}
}
/** Retain the outcome before commit; only the compact nonce enters the native receipt. */
function retainCronRuntimeMutationOutcome(_type, db, nonce, outcome) {
	const bytes = ownedWorkerBytes(serialize(outcome));
	deferSqliteWorkerCommitReceipt(db, { nonce });
	requestSqliteWorkerOperationAdmission({
		stage: "commit",
		facts: {
			nonce,
			bytes
		}
	}, [bytes.buffer]);
	return { nonce };
}
//#endregion
export { retainCronRuntimeMutationOutcome as n, prepareCronRuntimeMutation as t };
