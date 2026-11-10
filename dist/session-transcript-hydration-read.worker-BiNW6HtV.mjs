//#region src/config/sessions/session-transcript-hydration-read.worker.ts
async function readSessionEntrySnapshotRequest(request) {
	const { readTranscriptExportSnapshotReadOnlySync } = await import("./session-accessor.sqlite-read-BXqH1XwZ.mjs");
	const { projectSessionEntryRecord } = await import("./session-entry-projection-fbjkCZBI.mjs");
	return { snapshot: readTranscriptExportSnapshotReadOnlySync(request.options, { projectEvent: request.includeOriginalMessages ? void 0 : projectSessionEntryRecord }) };
}
/** Read each hydrated view under the same worker-owned quarantine and snapshot admission. */
async function readSessionTranscriptHydrationRequest(request, channel, control) {
	if (request.kind === "transcript-maintenance") {
		const { withOpenClawAgentDatabaseReadOnly } = await import("./openclaw-agent-db-readonly-_dhEf4ci.mjs");
		const { readSessionTranscriptMaintenance } = await import("./session-transcript-maintenance-read-B4PC4gOK.mjs");
		const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionTranscriptMaintenance(database, request.target, request.request), {
			...request.database,
			env: request.target.env
		});
		if (!result.found) throw new Error("Session transcript is unavailable for maintenance planning");
		return result.value;
	}
	if (request.kind === "latest-active-message") {
		const { readLatestSessionTranscriptMessageEvent } = await import("./session-accessor.sqlite-active-events-CL963ovG.mjs");
		return {
			kind: "latest-active-message",
			message: readLatestSessionTranscriptMessageEvent(request.target, {
				readOnly: true,
				resolvedScope: request.resolvedScope
			})
		};
	}
	if (request.kind === "recent-active-events") {
		const { readRecentSessionTranscriptActiveEvents } = await import("./session-accessor.sqlite-active-events-CL963ovG.mjs");
		return {
			kind: "recent-active-events",
			events: readRecentSessionTranscriptActiveEvents(request.target, request.maxEvents, {
				readOnly: true,
				resolvedScope: request.resolvedScope
			})
		};
	}
	if (request.kind === "current-turn-entry") {
		const { readSessionTranscriptCurrentTurnEntry } = await import("./session-accessor.sqlite-current-turn-C8y3ZHqZ.mjs");
		return readSessionTranscriptCurrentTurnEntry(request.target, {
			entryId: request.entryId,
			version: request.version,
			includeEntry: request.includeEntry,
			readOnly: true,
			resolvedScope: request.resolvedScope
		});
	}
	const { readSessionTranscriptBoundedActiveContextCore } = await import("./session-accessor.sqlite-active-context-ChEr41ON.mjs");
	const { streamSessionTranscriptHydration } = await import("./session-transcript-hydration.worker-CLScZxoO.mjs");
	if (request.limits) {
		const selection = request.transcript;
		if (selection && (selection.sessionKey !== request.resolvedScope.sessionKey || selection.entryIds.length > 64)) throw new Error("Transcript hydration cohort must select its own bounded session");
		const { readSessionTranscriptAnchorFactsInDatabase } = await import("./session-transcript-anchor-read.kernel-BYxbiERy.mjs");
		const { assertOpenClawAgentDatabaseIdentity } = await import("./openclaw-agent-db-identity-DAfxZOOh.mjs");
		let transcript;
		let residentRows;
		return {
			kind: "bounded",
			snapshot: readSessionTranscriptBoundedActiveContextCore(request.target, {
				...request.limits,
				readOnly: true,
				resolvedScope: request.resolvedScope,
				onRead: (projection, rows, messagePresence) => {
					if (!projection.hasUnindexedPrefix) residentRows = rows;
					const { database, resolved } = projection;
					if (request.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, request.expectedIdentity);
					if (selection) transcript = readSessionTranscriptAnchorFactsInDatabase(database, {
						...resolved,
						sessionKey: selection.sessionKey
					}, selection, void 0, projection, request.preparedEntry, messagePresence);
				}
			}),
			residentRows,
			...selection ? { transcript } : {}
		};
	}
	if (!channel) throw new Error("Full transcript hydration requires its host channel");
	return streamSessionTranscriptHydration(request, channel, control);
}
//#endregion
export { readSessionEntrySnapshotRequest, readSessionTranscriptHydrationRequest };
