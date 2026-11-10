import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { t as resolveSessionLifecycleTimestampsWithHeader } from "./lifecycle-timestamps-DuPaTaAj.mjs";
import "./session-transcript-read-fence-CgUG4J4j.mjs";
import { n as readSessionTranscriptAnchorsAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { n as resolveTerminalMainSessionTranscriptRegistryCheck } from "./lifecycle-CKc8qk3B.mjs";
//#region src/config/sessions/lifecycle-read.ts
async function hasTerminalMainSessionTranscriptNewerThanRegistryAsync(params) {
	const check = resolveTerminalMainSessionTranscriptRegistryCheck(params);
	if (!check || !params.sessionKey) return false;
	try {
		const { metadata } = await readSessionTranscriptAnchorsAsync({
			...params,
			sessionKey: params.sessionKey,
			sessionId: check.sessionId
		}, {
			entryIds: [],
			includeMetadata: true
		}, params.signal);
		if (metadata?.updatedAt == null) return false;
		const transcriptMutationAtMs = Math.floor(metadata.updatedAt);
		const registryTimestampMs = Math.floor(metadata.observedAt ?? check.registryTimestampMs);
		return Number.isFinite(transcriptMutationAtMs) && transcriptMutationAtMs > registryTimestampMs;
	} catch {
		return false;
	}
}
/** Recover missing lifecycle metadata while the transcript reader retains its original owner. */
async function resolveSessionLifecycleTimestampsAsync(params) {
	params.signal?.throwIfAborted();
	const entry = params.entry && { ...params.entry };
	const timestamps = resolveSessionLifecycleTimestampsWithHeader({
		...params,
		entry,
		readHeader: () => void 0
	});
	const sessionId = entry?.sessionId?.trim();
	if (!sessionId || timestamps.sessionStartedAt !== void 0) return timestamps;
	let accepted;
	await readSessionTranscriptAnchorsAsync({
		...params,
		sessionId
	}, {
		entryIds: [],
		includeHeader: true
	}, params.signal, ({ header }) => {
		accepted = resolveSessionLifecycleTimestampsWithHeader({
			...params,
			entry,
			readHeader: () => header
		});
	});
	if (!accepted) throw new SessionTranscriptReadFenceError("Session transcript changed during lifecycle read");
	return accepted;
}
//#endregion
export { resolveSessionLifecycleTimestampsAsync as n, hasTerminalMainSessionTranscriptNewerThanRegistryAsync as t };
