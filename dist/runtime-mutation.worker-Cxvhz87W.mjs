import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { serialize } from "node:v8";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
//#region src/cron/store/runtime-mutation.worker.ts
function createCronMutationLogger(logs) {
	const record = (level) => (fields, message) => {
		logs.push({
			level,
			fields,
			message
		});
	};
	return {
		debug: record("debug"),
		info: record("info"),
		warn: record("warn"),
		error: record("error")
	};
}
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
export { prepareCronRuntimeMutation as n, retainCronRuntimeMutationOutcome as r, createCronMutationLogger as t };
