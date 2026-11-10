import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import "./transcript-write-context-C02sC3zd.mjs";
import { t as captureSessionMessageAdmission } from "./session-manager-message-admission-EoHliJb3.mjs";
import { t as prepareSessionManagerMetadataCommand } from "./session-manager-metadata-command-Bw_fFCAq.mjs";
import { t as createSessionManagerPublicationHooks } from "./session-manager-publication-vZ305gn3.mjs";
//#region src/agents/sessions/session-manager-metadata-runtime.ts
const moduleUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionManagerMetadata);
const log = createSubsystemLogger("agents/session-metadata");
/** Each command settles and unbinds before the next; the enclosing manager keeps its FIFO turn. */
async function withSessionMetadataWorker(options, database, assertCurrent, operation, controls) {
	if ("withMetadata" in database) return await database.withMetadata(assertCurrent, operation, controls);
	let cliWriter;
	const assertMetadataCurrent = () => {
		assertCurrent();
		cliWriter?.assertCurrent();
	};
	const admission = captureSessionMessageAdmission(assertMetadataCurrent, controls);
	await runOpenClawAgentWorkerWrite(options, () => database.prepare({
		assertCurrent: assertMetadataCurrent,
		createAdmission: (binding) => () => ({
			nativeLocations: binding.nativeLocations,
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				binding.authorize(request);
				assertMetadataCurrent();
				if (!grant()) throw new Error("Session metadata preparation admission expired");
			}, binding.attachment)
		})
	}));
	const transcriptPublication = createSessionManagerPublicationHooks({
		agentId: database.agentId,
		storePath: database.path,
		databaseIdentity: () => database.fileIdentity?.physicalIdentity,
		initialWriter: controls?.initialWriter,
		beforeIdentityPublication: controls?.beforeIdentityPublication
	});
	const worker = await openOpenClawAgentSqliteWorkerStore(options, { execution: database }, {
		moduleUrl,
		input: void 0,
		assertAdmission: (request) => admission.assertAdmission(transcriptPublication.unwrap(request)),
		onAdmitted: transcriptPublication.onAdmitted,
		observeAdmission: transcriptPublication.observeAdmission
	});
	let result;
	try {
		result = {
			ok: true,
			value: await operation({ execute: async (command, commandOptions) => {
				cliWriter = prepareSessionManagerMetadataCommand(command, database.path, admission.control);
				assertMetadataCurrent();
				const reply = await worker.execute(command, assertMetadataCurrent, commandOptions);
				if (!reply.ok) throw new SessionTranscriptWriterClaimReboundError(reply.refusal);
				if (reply.value && typeof reply.value === "object" && "pendingInputReceipt" in reply.value && reply.value.pendingInputReceipt) admission.publish(reply.value.pendingInputReceipt);
				return reply.value;
			} })
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	try {
		await worker.close();
	} catch (error) {
		if (!result.ok) throw createSqliteLifecycleAggregateError([result.error, error], "Session metadata operation and cleanup failed", result.error);
		try {
			log.warn(`Session metadata completed before cleanup failed: ${formatErrorMessage(error)}`);
		} catch {}
	}
	if (!result.ok) throw result.error;
	return result.value;
}
//#endregion
export { withSessionMetadataWorker };
