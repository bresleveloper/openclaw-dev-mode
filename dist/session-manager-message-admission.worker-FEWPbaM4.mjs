import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { a as isReadableSessionMessage } from "./session-entry-codec-DSMJ1XFN.mjs";
import { a as prepareTranscriptPayloadForReuse } from "./transcript-payload-Cu49oQKq.mjs";
import { F as decodeMetadataAppendEvent } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { g as runWithSessionPendingInputWorkerCustody } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { O as canRebasePreparedAssistantInTransaction } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { i as appendTranscriptMessageSnapshotSync, n as appendTranscriptEventSnapshotSync } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { t as readSessionPendingInputAuthorityFacts } from "./session-pending-input-authority.kernel-Cz8X54WZ.mjs";
//#region src/agents/sessions/session-manager-append.kernel.ts
function prepareSessionMetadataAppend(database, input) {
	const event = decodeMetadataAppendEvent(input);
	if (event.type !== "message") return { event };
	const { message } = input;
	if (!message) throw new Error("Session message append requires prepared storage bytes");
	const { message: _message, ...envelope } = event;
	const eventJson = `${JSON.stringify(envelope).slice(0, -1)},"message":${message.messageJson}}`;
	return {
		event,
		message: {
			messageJson: message.messageJson,
			persistedMessage: event.message,
			physicalPayload: prepareTranscriptPayloadForReuse(database, eventJson, event)
		}
	};
}
/** Both SessionManager adapters lend their exact transaction to this append owner. */
function applySessionMetadataAppendInTransaction(database, input, beforeFreshMessageCommit, preparation = prepareSessionMetadataAppend(database.db, input)) {
	const { event } = preparation;
	let projectionNeedsReconcile = false;
	const projection = {
		scheduleProjectionReconcile: false,
		onProjectionReconcileNeeded: () => {
			projectionNeedsReconcile = true;
		}
	};
	const { message } = input;
	if (event.type === "message" && message) {
		const prepared = preparation.message;
		if (!prepared) throw new Error("Session message append lost its prepared storage bytes");
		const options = { ...input.options };
		if (message.validateTurn) {
			if (!canRebasePreparedAssistantInTransaction(database, input.scope.sessionId, event.parentId, input.view?.admission?.entryId, input.view?.questionAnswers)) throw new SqliteTranscriptMutationConflictError(input.scope.sessionId);
			options.expectedMutationAt = void 0;
		}
		const snapshot = appendTranscriptMessageSnapshotSync(input.scope, {
			...options,
			message: event.message,
			eventId: event.id,
			parentId: event.parentId,
			now: Date.parse(event.timestamp),
			cwd: message.cwd,
			idempotencyLookup: message.idempotencyLookup,
			...message.freshMessageCheck ? { beforeFreshMessageCommit } : {}
		}, prepared, projection, void 0, database);
		if (snapshot.ok && snapshot.value.result?.message === prepared.persistedMessage) snapshot.value.result.message = void 0;
		return {
			snapshot,
			projectionNeedsReconcile
		};
	}
	return {
		snapshot: appendTranscriptEventSnapshotSync(input.scope, event, input.options, {
			...projection,
			eventJson: typeof input.event === "string" ? input.event : void 0
		}, void 0, database),
		projectionNeedsReconcile
	};
}
function applySessionDirectMessageInTransaction(database, input, beforeFreshMessageCommit) {
	const message = JSON.parse(input.messageJson);
	if (!isReadableSessionMessage(message)) throw new Error("Invalid serialized session transcript message");
	let projectionNeedsReconcile = false;
	const snapshot = appendTranscriptMessageSnapshotSync(input.scope, {
		message,
		cwd: input.cwd,
		...input.freshMessageCheck && beforeFreshMessageCommit ? { beforeFreshMessageCommit } : {}
	}, {
		messageJson: input.messageJson,
		persistedMessage: message
	}, {
		scheduleProjectionReconcile: false,
		onProjectionReconcileNeeded: () => {
			projectionNeedsReconcile = true;
		}
	}, void 0, database);
	if (snapshot.ok && snapshot.value.result?.message === message) snapshot.value.result.message = void 0;
	return {
		snapshot,
		projectionNeedsReconcile
	};
}
//#endregion
//#region src/agents/sessions/session-manager-message-admission.worker.ts
function runWithMetadataMessageAdmission(context, controls, run) {
	let transactionFacts;
	let pendingAuthorityChecked = false;
	const readAuthority = () => {
		const source = controls?.pendingInput?.facts;
		if (source?.preparedAuthority && source.databasePath !== context.databasePath) return null;
		return source?.preparedAuthority && source.agentId && source.databaseAgentId ? readSessionPendingInputAuthorityFacts({
			db: context.database,
			path: context.databasePath,
			agentId: source.databaseAgentId
		}, source.sessionKey, source.agentId) : void 0;
	};
	const requestMessageCheck = (check) => {
		context.checkMessage({
			kind: "session-message",
			domainFacts: transactionFacts,
			check,
			authority: check === "pending" ? readAuthority() : void 0
		});
		if (check === "pending") pendingAuthorityChecked = true;
	};
	const admit = (stage) => context.admit(stage, (request, dispatch) => {
		transactionFacts = request.facts;
		dispatch({
			...request,
			facts: {
				kind: "session-message",
				domainFacts: request.facts,
				...stage === "commit" && pendingAuthorityChecked ? { check: "pending" } : {},
				...stage === "commit" && pendingAuthorityChecked ? { authority: readAuthority() } : {}
			}
		});
	});
	const write = () => run(admit, () => requestMessageCheck("fresh"));
	const pending = controls?.pendingInput;
	if (!pending) return { value: write() };
	const result = runWithSessionPendingInputWorkerCustody(pending.facts, pending.relocation, () => requestMessageCheck("pending"), write);
	return {
		value: result.value,
		pendingInputReceipt: result.receipt
	};
}
//#endregion
export { prepareSessionMetadataAppend as i, applySessionDirectMessageInTransaction as n, applySessionMetadataAppendInTransaction as r, runWithMetadataMessageAdmission as t };
