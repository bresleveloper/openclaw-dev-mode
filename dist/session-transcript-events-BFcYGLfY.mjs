import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { n as runLockedSessionTranscriptRead } from "./session-transcript-execution-read-Cv-mpCgi.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as readRestoredSessionTranscriptInWorker } from "./session-cold-storage-read-DxurMT4l.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import path from "node:path";
//#region src/config/sessions/session-transcript-events.ts
/** Load durable raw events through the existing full-transcript hydration owner. */
async function loadSessionTranscriptEvents(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		if (memory.missing) {
			memory.assertCurrent();
			return [];
		}
		const result = await memory.read("session.history.hydrate", { maxEventBytes: scope.maxEventBytes });
		if (result.kind !== "full") throw new Error("Transcript events received a bounded hydration result");
		return result.snapshot.events;
	}
	const captured = {
		agentId: scope.agentId,
		clone: scope.clone,
		defaultAgentId: scope.defaultAgentId,
		hydrateSkillPromptRefs: scope.hydrateSkillPromptRefs,
		readConsistency: scope.readConsistency,
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey,
		sessionFile: scope.sessionFile,
		threadId: scope.threadId,
		maxEventBytes: scope.maxEventBytes,
		sessionEntry: scope.sessionEntry ? { sessionId: scope.sessionEntry.sessionId } : void 0,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	return withSessionTranscriptReadSource(captured, async (durableSource) => {
		const { resolved: target, expectedIdentity: identity } = durableSource;
		if (!identity) return [];
		const options = toDatabaseOptions(target);
		const receipt = resolveSessionTranscriptReadFence(target);
		const admission = receipt ? { ...receipt } : void 0;
		const read = async (owner) => {
			const assertCurrent = () => {
				durableSource.assertCurrent();
				owner.assertCurrent();
			};
			try {
				return await readRestoredSessionTranscriptInWorker({
					scope: captured,
					resolved: target,
					owner,
					assertCurrent
				}, async () => {
					const result = await owner.readTranscript({
						target: captured,
						resolvedScope: target,
						admission,
						expectedIdentity: identity
					});
					assertCurrent();
					if (result.kind !== "full") throw new Error("Transcript events received a bounded hydration result");
					return result.snapshot.events;
				});
			} finally {
				assertCurrent();
			}
		};
		return runLockedSessionTranscriptRead(options, () => withSessionHistoryWorkerDatabase(options, read, targetDiscoveryLane)) ?? read(durableSource.owner);
	});
}
//#endregion
export { loadSessionTranscriptEvents as t };
