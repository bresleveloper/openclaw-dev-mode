import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { a as captureAgentDatabasePreparationDeletionForIdentity } from "./agent-database-admission-CeDA0ojh.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { i as captureActiveCronJobAgentDeletion } from "./active-jobs-CqHAjCGh.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as digestClawValue } from "./digest-CI8Suvd7.mjs";
import { n as prepareAgentSessionStoreDeletionSafety, t as assertAgentSessionStoreDeletionTargetsCurrent } from "./agent-delete-session-store-safety.targets-CZCCiYwJ.mjs";
import { n as clawRemovalJournalResultSchema, t as clawRemovalJournalRequestSchema } from "./removal-journal-contract-BwY0ztCU.mjs";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-IJCEUt7F.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/claws/removal-journal.ts
/** Native settlement precedes the journal mutation's publication and reply. */
async function mutateClawRemovalJournal(input, assertRequestCurrent) {
	const context = captureOpenClawStateWorkerContext();
	const assertSourceCurrent = () => {
		context.admission.assertCurrent();
		if (!isDeepStrictEqual(context.admission.identity, input.request.sourceIdentity)) throw new Error("Claw journal mutation no longer owns its original physical database.");
	};
	assertSourceCurrent();
	const command = {
		...structuredClone(input),
		nonce: randomUUID(),
		sessionStoreSafety: input.request.phase === "begin" ? prepareAgentSessionStoreDeletionSafety(input.config, input.request.agentId, context.environment) : null
	};
	const cancel = captureActiveCronJobAgentDeletion(input.request.agentId, context.admission.identity.key);
	const invalidatePreparation = captureAgentDatabasePreparationDeletionForIdentity(input.request.agentId, {
		databasePath: context.admission.databasePath,
		identityKey: context.admission.identity.key
	});
	const assertCurrent = () => {
		assertSourceCurrent();
		assertRequestCurrent();
		if (command.sessionStoreSafety) assertAgentSessionStoreDeletionTargetsCurrent(command.sessionStoreSafety.targets);
	};
	let native;
	let settlement;
	let failure;
	try {
		await runOpenClawStateWorkerOperation(context, async (scope) => {
			if ((await scope.execute({
				type: "clawProvenance.removalJournal",
				input: command
			})).nonce !== command.nonce) throw new Error("Claw journal mutation returned a different operation nonce");
		}, {
			assertCurrent,
			createAdmission(retained) {
				settlement = retained.settled;
				let phase = "transaction";
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					assertCurrent();
					if (!isRecord(request.facts) || request.facts.nonce !== command.nonce || request.stage !== phase) throw new Error("Claw journal mutation lost its transaction owner");
					if (!grant()) throw new Error("Claw journal mutation admission expired");
					phase = phase === "transaction" ? "commit" : "settling";
				});
				native = admission;
				return {
					admission,
					nativeLocations: [context.admission.databasePath]
				};
			}
		});
	} catch (error) {
		failure = error;
	}
	const settled = await settlement;
	const facts = native?.committed?.facts;
	if (isRecord(facts) && facts.nonce === command.nonce) {
		const result = clawRemovalJournalResultSchema.parse({
			ok: true,
			journal: facts.journal
		});
		if (input.request.phase === "begin") {
			invalidatePreparation();
			cancel();
		}
		try {
			(context.assertPublicationCurrent ?? context.admission.assertCurrent)();
			sessionChanges.emit({
				all: true,
				scope: "stores"
			});
		} catch (error) {
			if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
		}
		return result;
	}
	if (native?.committed || settled?.kind === "unknown" || native?.settlement?.kind === "unknown") throw new SqliteWorkerError("Claw journal mutation has an unknown durable outcome; inspect claws status before retrying.", "outcome-unknown");
	return {
		ok: false,
		error: failure instanceof Error ? failure.message : "Claw journal mutation did not commit."
	};
}
//#endregion
//#region src/gateway/server-methods/claws-removal-journal.ts
const clawsRemovalJournalHandlers = { "claws.removalJournal": async (options) => {
	const { params, context, respond } = options;
	const parsed = clawRemovalJournalRequestSchema.safeParse(params);
	if (!parsed.success) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid Claw removal journal parameters."));
		return;
	}
	const request = parsed.data;
	const config = context.getRuntimeConfig();
	const assertCurrent = () => {
		options.signal?.throwIfAborted();
		options.sessionMutationCommitGuard?.();
		if (options.hasCurrentClientAuthority?.() === false || !isDeepStrictEqual(request.binding, resolveClawMonitorCleanupBinding(context.cronStorePath)) || context.getRuntimeConfig() !== config || digestClawValue(config) !== request.configDigest || !context.isConfigReloadSettled()) throw new Error("Claw removal no longer owns the serving Gateway's configuration or request authority.");
	};
	let dispatched = false;
	try {
		assertCurrent();
		dispatched = true;
		respond(true, await mutateClawRemovalJournal({
			request,
			config
		}, assertCurrent));
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error), { details: { outcomeUnknown: dispatched } }));
	}
} };
//#endregion
export { clawsRemovalJournalHandlers };
