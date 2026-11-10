import { l as writeVoiceSessionRecordInTransaction, n as assertVoiceSessionOwnership, s as readVoiceSessionRecordInTransaction } from "./client-voice-session-store-CxbQv7Yf.mjs";
//#region src/talk/client-voice-session-write.kernel.ts
/** The caller owns the transaction; all predicates use its current canonical row. */
function mutateVoiceSessionInDatabase(database, input) {
	if (input.kind === "effect" && !input.event.runId) return;
	let record = readVoiceSessionRecordInTransaction(database, input.voiceSessionId);
	if (!record) {
		if (input.kind === "delivered" || input.kind === "effect") return;
		if (input.kind !== "create") throw new Error("voice session not found");
		record = {
			version: 1,
			voiceSessionId: input.voiceSessionId,
			agentId: input.agentId,
			sessionKey: input.sessionKey,
			...input.provider ? { provider: input.provider } : {},
			origin: input.origin,
			...input.transcriptCapable === true ? { transcriptCapable: true } : {},
			status: "open",
			createdAt: input.now,
			updatedAt: input.now,
			consultRunIds: [],
			effects: [],
			transcriptFailureKeys: []
		};
	}
	assertVoiceSessionOwnership(record, input);
	switch (input.kind) {
		case "consult":
			if (record.consultRunIds.includes(input.runId)) return record;
			record.consultRunIds.push(input.runId);
			break;
		case "effect": {
			const { event } = input;
			const runId = event.runId;
			const existing = event.toolCallId ? record.effects.find((effect) => effect.runId === runId && effect.toolCallId === event.toolCallId) : record.effects.findLast((effect) => effect.runId === runId && effect.toolName === event.toolName && effect.status === "started");
			if (event.type !== "tool.execution.started" && !existing) return record;
			if (event.type !== "tool.execution.started" && existing) {
				existing.status = event.type === "tool.execution.completed" ? "succeeded" : event.type === "tool.execution.blocked" ? "blocked" : event.terminalReason === "cancelled" ? "cancelled" : "failed";
				existing.finishedAt = event.ts;
			} else if (event.mutatingAction === true && (!event.toolCallId || !existing)) record.effects.push({
				runId,
				...event.toolCallId ? { toolCallId: event.toolCallId } : {},
				toolName: event.toolName,
				startedAt: event.ts,
				status: "started"
			});
			break;
		}
		case "create":
			if (record.origin !== input.origin) throw new Error("voice session origin does not match");
			if (record.status !== "open") throw new Error("voice session is already closed");
			if (record.provider && input.provider && record.provider !== input.provider) throw new Error("voice session provider does not match");
			record.provider ??= input.provider;
			if (input.transcriptCapable === true) record.transcriptCapable = true;
			break;
		case "reserve":
			if (record.status !== "open") throw new Error("voice session is closed");
			if (record.origin !== input.origin) throw new Error("voice session origin does not allow this transcript source");
			if (!record.transcriptFailureKeys.includes(input.failureKey)) {
				if (record.transcriptFailureKeys.length >= 41) throw new Error("voice transcript persistence has too many unresolved entries");
				record.transcriptFailureKeys.push(input.failureKey);
			}
			break;
		case "confirm":
			if (input.role === "user") record.hasUserTranscript = true;
			record.transcriptFailureKeys = record.transcriptFailureKeys.filter((key) => key !== input.failureKey);
			break;
		case "close":
			if (input.expectedOrigin && record.origin !== input.expectedOrigin) throw new Error("relay-owned voice sessions close through talk.session.close");
			if (input.staleBefore !== void 0 && (record.status !== "open" || record.updatedAt > input.staleBefore)) return;
			if (record.transcriptFailureKeys.length > 0 && input.transcriptFailurePolicy === "require-success") throw new Error("voice transcript persistence must be retried before close");
			if (input.transcriptFailurePolicy === "retain-and-close" && record.origin !== "relay") throw new Error("only relay voice sessions may close with unresolved transcripts");
			if (record.status === "closed") return record;
			record.status = "closed";
			record.closedAt = input.now;
			break;
		case "delivered":
			if (record.digestDeliveredAt) return record;
			record.digestDeliveredAt = input.deliveredAt;
	}
	record.updatedAt = input.now;
	writeVoiceSessionRecordInTransaction(database, record);
	return record;
}
//#endregion
export { mutateVoiceSessionInDatabase };
