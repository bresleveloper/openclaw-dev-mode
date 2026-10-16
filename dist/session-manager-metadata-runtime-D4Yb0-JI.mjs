import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { t as captureSessionMessageAdmission } from "./session-manager-message-admission-BHdwfpGy.mjs";
//#region src/agents/sessions/session-manager-metadata-runtime.ts
const moduleUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionManagerMetadata);
const log = createSubsystemLogger("agents/session-metadata");
/** Each command settles and unbinds before the next; the enclosing manager keeps its FIFO turn. */
async function withSessionMetadataWorker(options, database, assertCurrent, operation, controls) {
	const admission = captureSessionMessageAdmission(assertCurrent, controls);
	const worker = await openOpenClawAgentSqliteWorkerStore(options, database.db, {
		moduleUrl,
		input: void 0,
		assertAdmission: admission.assertAdmission
	});
	let result;
	try {
		result = {
			ok: true,
			value: await operation({ execute: async (command, commandOptions) => {
				if (command.type === "session.transcript.rewrite" && "entries" in command.input && admission.control.pendingInput) command.input.pendingInput = admission.control.pendingInput;
				if ("event" in command.input && typeof command.input.event !== "string" && command.input.message) command.input.message = {
					...command.input.message,
					...admission.control
				};
				const reply = await worker.execute(command, assertCurrent, commandOptions);
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
