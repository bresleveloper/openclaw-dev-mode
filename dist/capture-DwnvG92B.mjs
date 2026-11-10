import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import { t as resolveHookConfig } from "./policy-EID_8KAw.mjs";
import { m as formatHookErrorForLog } from "./hooks-CU2qx9-T.mjs";
import "./config-DqsKkEU8.mjs";
//#region src/hooks/bundled/session-memory/capture.ts
/** Capture while the caller still owns the departing session's active window. */
async function captureSessionMemoryTranscript(scope, cfg) {
	const hookConfig = resolveHookConfig(cfg, "session-memory");
	const messageCount = typeof hookConfig?.messages === "number" && hookConfig.messages > 0 ? hookConfig.messages : 15;
	try {
		return await withSessionTranscriptReadSource(scope, async (source) => {
			const transcript = await (source.preparedReads ?? source.owner).readSessionMemoryCapture({
				scope: source.scope,
				resolved: source.resolved,
				messageCount,
				admission: resolveSessionTranscriptReadFence(source.resolved),
				expectedIdentity: source.expectedIdentity
			});
			source.assertCurrent();
			return transcript;
		});
	} catch (error) {
		return {
			status: "unavailable",
			reason: formatHookErrorForLog(error)
		};
	}
}
//#endregion
export { captureSessionMemoryTranscript as t };
