//#region src/config/sessions/session-transcript-hydration-read.worker.ts
/** Read each hydrated view under the same worker-owned quarantine and snapshot admission. */
async function readSessionTranscriptHydrationRequest(request, channel, control) {
	if (request.kind === "transcript-maintenance") {
		const { withOpenClawAgentDatabaseReadOnly } = await import("./openclaw-agent-db-readonly-CaIroy8A.mjs");
		const { readSessionTranscriptMaintenance } = await import("./session-transcript-maintenance-read-CSc2TAKl.mjs");
		const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionTranscriptMaintenance(database, request.target, request.request), {
			...request.database,
			env: request.target.env
		});
		if (!result.found) throw new Error("Session transcript is unavailable for maintenance planning");
		return result.value;
	}
	const { readOpenClawDatabaseQuarantineFailure } = await import("./openclaw-quarantine-store-BbbhhBHk.mjs");
	const quarantine = readOpenClawDatabaseQuarantineFailure("agent", request.database.path, { env: request.target.env });
	if (quarantine) throw quarantine;
	if (request.kind === "latest-active-message") {
		const { readLatestSessionTranscriptMessageEvent } = await import("./session-accessor.sqlite-active-events-Cy_5lBGP.mjs");
		return {
			kind: "latest-active-message",
			message: readLatestSessionTranscriptMessageEvent(request.target, {
				readOnly: true,
				resolvedScope: request.resolvedScope
			})
		};
	}
	if (request.kind === "recent-active-events") {
		const { readRecentSessionTranscriptActiveEvents } = await import("./session-accessor.sqlite-active-events-Cy_5lBGP.mjs");
		return {
			kind: "recent-active-events",
			events: readRecentSessionTranscriptActiveEvents(request.target, request.maxEvents, {
				readOnly: true,
				resolvedScope: request.resolvedScope
			})
		};
	}
	if (request.kind === "current-turn-entry") {
		const { readSessionTranscriptCurrentTurnEntry } = await import("./session-accessor.sqlite-current-turn-C6OXAFp9.mjs");
		return readSessionTranscriptCurrentTurnEntry(request.target, {
			entryId: request.entryId,
			version: request.version,
			includeEntry: request.includeEntry,
			readOnly: true,
			resolvedScope: request.resolvedScope
		});
	}
	const { readSessionTranscriptBoundedActiveContextCore } = await import("./session-accessor.sqlite-active-context-C3Vuh76-.mjs");
	const { streamSessionTranscriptHydration } = await import("./session-transcript-hydration.worker-DOGq9TCp.mjs");
	if (request.limits) return {
		kind: "bounded",
		snapshot: readSessionTranscriptBoundedActiveContextCore(request.target, {
			...request.limits,
			readOnly: true,
			resolvedScope: request.resolvedScope
		})
	};
	if (!channel) throw new Error("Full transcript hydration requires its host channel");
	return streamSessionTranscriptHydration(request, channel, control);
}
//#endregion
export { readSessionTranscriptHydrationRequest };
