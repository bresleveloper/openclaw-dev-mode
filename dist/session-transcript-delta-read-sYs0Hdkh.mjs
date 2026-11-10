import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { n as readRestoredSessionTranscriptInWorker } from "./session-cold-storage-read-DxurMT4l.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
//#region src/config/sessions/session-transcript-delta-read.ts
/** Retain one physical reader across delta pages, cold restoration, and consumption. */
async function withSessionTranscriptDeltaReader(scope, consume, signal) {
	const receipt = resolveSessionTranscriptReadFence({
		agentId: normalizeAgentId(scope.agentId ?? parseAgentSessionKey(scope.sessionKey)?.agentId ?? scope.defaultAgentId),
		sessionId: scope.sessionId
	});
	const admission = receipt && structuredClone(receipt);
	const memory = captureSessionActorTranscriptRead(scope, signal);
	if (memory) {
		let active = true;
		const assertActive = () => {
			signal?.throwIfAborted();
			if (!active) throw new Error("Transcript delta reader is no longer active");
		};
		try {
			const result = await consume({
				raw: async (limits) => {
					assertActive();
					if (memory.missing) {
						memory.assertCurrent();
						return { kind: "missing" };
					}
					return memory.read("session.history.raw-delta", { limits });
				},
				visible: async (limits) => {
					assertActive();
					if (memory.missing) {
						memory.assertCurrent();
						return { kind: "missing" };
					}
					return memory.read("session.history.visible-delta", { limits });
				}
			});
			assertActive();
			return result;
		} finally {
			active = false;
		}
	}
	let active = true;
	const assertActive = () => {
		signal?.throwIfAborted();
		if (!active) throw new Error("Transcript delta reader is no longer active");
	};
	try {
		return await withSessionTranscriptReadSource(scope, async (source) => {
			const reader = source.preparedReads ?? source.owner;
			const assertCurrent = () => {
				assertActive();
				source.assertCurrent();
			};
			const read = async (operation) => {
				assertCurrent();
				const value = await readRestoredSessionTranscriptInWorker({
					...source,
					owner: reader,
					assertCurrent
				}, operation);
				assertCurrent();
				return value;
			};
			if (!source.expectedIdentity) return consume({
				raw: async () => {
					assertCurrent();
					return { kind: "missing" };
				},
				visible: async () => {
					assertCurrent();
					return { kind: "missing" };
				}
			});
			const request = {
				scope: source.scope,
				resolved: source.resolved,
				admission,
				expectedIdentity: source.expectedIdentity
			};
			return consume({
				raw: (limits) => read(() => reader.readRawDelta({
					...request,
					limits: { ...limits }
				}, signal)),
				visible: (limits) => read(async () => {
					try {
						return await reader.readVisibleDelta({
							...request,
							limits: { ...limits }
						}, signal);
					} catch (error) {
						if (isSessionTranscriptProjectionUnavailableError(error)) {
							assertCurrent();
							startSessionTranscriptIndexReconcile({
								...toDatabaseOptions(source.resolved),
								preferredSessionId: source.resolved.sessionId
							});
						}
						throw error;
					}
				})
			});
		}, signal);
	} finally {
		active = false;
	}
}
//#endregion
export { withSessionTranscriptDeltaReader as t };
