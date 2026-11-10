import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-CP5xMNf9.mjs";
import { t as captureChannelReadAuthority } from "./channel-read-authority-DeXfvJjt.mjs";
import "./managed-image-record-store.kernel-BpNTg-pb.mjs";
//#region src/gateway/managed-image-record-store.ts
const MANAGED_OUTGOING_ORIGINALS_SUBDIR = "outgoing/originals";
const mutations = createKeyedFifoLeaseRegistry(Symbol.for("openclaw.managedImageRecordMutations"));
function captureManagedImageContext(stateDir) {
	const env = cloneEnvWithPlatformSemantics(process.env);
	if (stateDir) env.OPENCLAW_STATE_DIR = stateDir;
	return captureOpenClawStateWorkerContext({ env });
}
async function readManagedImageRecord(attachmentId, stateDir, context = captureManagedImageContext(stateDir)) {
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "managedImages.read",
		input: { attachmentId }
	});
}
async function listManagedImageRecordEntries(params) {
	const context = captureManagedImageContext(params.stateDir);
	const sessionKey = params.sessionKey;
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "managedImages.entries",
		input: { sessionKey }
	});
}
async function listManagedImageOriginalMediaIds(stateDir) {
	const context = captureManagedImageContext(stateDir);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "managedImages.originalMediaIds",
		input: void 0
	});
}
function mutateManagedImageRecords(commands, context, assertCurrent) {
	const prepared = structuredClone(commands);
	return trackAsyncWork(async () => {
		const lease = mutations.reserve(prepared.map(({ input }) => JSON.stringify([context.admission.coordinationKey, input.attachmentId])));
		try {
			await lease?.wait();
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
			let result = true;
			for (const command of prepared) {
				let admission;
				const check = () => {
					context.admission.assertCurrent();
					assertCurrent?.();
				};
				let applied;
				try {
					applied = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command), {
						assertCurrent: check,
						createAdmission: () => {
							admission = createSqliteWorkerOperationAdmission((_request, grant) => {
								check();
								if (!grant()) throw new Error("Managed media write admission expired");
							});
							return {
								admission,
								nativeLocations: [context.admission.databasePath]
							};
						}
					});
				} catch (error) {
					const committed = admission?.committed ?? admission?.settlement?.committed;
					if (!committed || !isRecord(committed.facts) || committed.facts.type !== command.type || typeof committed.facts.result !== "boolean") throw error;
					applied = committed.facts.result;
				}
				result = applied && result;
			}
			return result;
		} finally {
			lease?.release();
		}
	});
}
/** The file owner records this commit before separately fencing result disclosure. */
async function insertManagedImageRecord(record, stateDir, context = captureManagedImageContext(stateDir)) {
	await mutateManagedImageRecords([{
		type: "managedImages.insert",
		input: record
	}], context, captureChannelReadAuthority());
}
/** Reserve every referenced record before yielding; each promotion keeps its own transaction. */
async function attachManagedImageRecordsToMessage(params) {
	const context = captureManagedImageContext(params.stateDir);
	const result = await mutateManagedImageRecords(params.attachments.map((attachment) => ({
		type: "managedImages.attach",
		input: {
			...attachment,
			messageId: params.messageId,
			updatedAt: params.updatedAt
		}
	})), context);
	context.admission.assertCurrent();
	return result;
}
function createManagedImageCleanup(type) {
	return async (planned, stateDir, context = captureManagedImageContext(stateDir)) => {
		const result = await mutateManagedImageRecords([{
			type,
			input: planned
		}], context);
		context.admission.assertCurrent();
		return result;
	};
}
const claimManagedImageRecordCleanupIfCurrent = createManagedImageCleanup("managedImages.claimCleanup");
const deleteClaimedManagedImageRecord = createManagedImageCleanup("managedImages.deleteClaimed");
//#endregion
export { deleteClaimedManagedImageRecord as a, listManagedImageRecordEntries as c, claimManagedImageRecordCleanupIfCurrent as i, readManagedImageRecord as l, attachManagedImageRecordsToMessage as n, insertManagedImageRecord as o, captureManagedImageContext as r, listManagedImageOriginalMediaIds as s, MANAGED_OUTGOING_ORIGINALS_SUBDIR as t };
