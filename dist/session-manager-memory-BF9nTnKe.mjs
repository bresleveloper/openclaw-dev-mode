import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { t as captureSessionMessageAdmission } from "./session-manager-message-admission-EoHliJb3.mjs";
import { t as prepareSessionManagerMetadataCommand } from "./session-manager-metadata-command-Bw_fFCAq.mjs";
import { n as SessionManagerActorCommittedError } from "./session-manager-persistence-error-uXrnbG-q.mjs";
//#region src/agents/sessions/session-manager-memory.ts
/** Adapts the existing manager contract to its selected actor, without opening a database. */
function createSessionManagerMemoryDatabase(binding) {
	const { actor, storage, database } = binding;
	if (actor.target.database.kind !== "memory") throw new Error("Session manager memory binding requires a memory actor");
	return {
		path: database.path,
		identity: { incarnation: actor.target.database.incarnation },
		async withMetadata(assertCurrent, operation, controls) {
			let cliWriter;
			let commandSignal;
			const assertMetadataCurrent = () => {
				commandSignal?.throwIfAborted();
				assertCurrent();
				binding.authority.assertCurrent();
				cliWriter?.assertCurrent();
				controls?.initialWriter?.assertActive();
			};
			const admission = captureSessionMessageAdmission(assertMetadataCurrent, controls);
			const authority = {
				assertCurrent: assertMetadataCurrent,
				authorize(stage, facts, publication) {
					binding.authority.authorize(stage, facts, publication);
					admission.assertAdmission({
						stage,
						facts: publication
					});
				}
			};
			const execute = async (command) => {
				cliWriter = prepareSessionManagerMetadataCommand(command, database.path, admission.control);
				if (command.type === "session.metadata.mutation") return storage.read(command, authority);
				const initialWriterRunId = "initialWriterRunId" in command.input ? command.input.initialWriterRunId : void 0;
				if (initialWriterRunId !== void 0 && initialWriterRunId !== controls?.initialWriter?.writerRunId) throw new SessionTranscriptWriterClaimReboundError();
				const outcome = await storage.mutate(command, authority, { committed(receipt) {
					const value = receipt.value;
					const initial = value && ("owned" in value ? value : "initialEntry" in value ? value.initialEntry : void 0);
					if (initial?.fence && !controls?.initialWriter?.committedFence) controls?.initialWriter?.recordCommitted(initial.fence);
					if (value && "pendingInputReceipt" in value) admission.publish(value.pendingInputReceipt);
				} });
				if (outcome.kind === "rolled-back") {
					if (outcome.error.name === "SessionTranscriptWriterClaimReboundError") throw new SessionTranscriptWriterClaimReboundError();
					if (outcome.error.name === "SqliteTranscriptMutationConflictError") throw new SqliteTranscriptMutationConflictError(command.input.scope.sessionId);
					throw Object.assign(new Error(outcome.error.message), { name: outcome.error.name });
				}
				if (outcome.failure) throw new SessionManagerActorCommittedError(command.type, {
					ok: true,
					value: outcome.value
				}, Object.assign(new Error(outcome.failure.message), { name: outcome.failure.name }));
				return outcome.value;
			};
			return operation({ async execute(command, options) {
				commandSignal = options?.signal;
				commandSignal?.throwIfAborted();
				return execute(command);
			} });
		}
	};
}
//#endregion
export { createSessionManagerMemoryDatabase as t };
