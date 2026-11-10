import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
//#region src/config/sessions/session-cold-storage-read.ts
/** Keep metadata and restored reads on the caller's already-retained history owner. */
function readRestoredSessionTranscriptInWorker(source, read) {
	return readRestoredSessionTranscript(source.scope, read, {
		assertCurrent: source.assertCurrent,
		coldRead: {
			target: source.resolved,
			readMetadata: async () => {
				const metadata = await source.owner.readColdMetadata({
					sessionId: source.resolved.sessionId,
					env: source.scope.env ?? {}
				});
				source.assertCurrent();
				return metadata.archive;
			}
		}
	});
}
/** Restore a cold transcript once; the owner keeps restored history hot for subsequent reads. */
async function readRestoredSessionTranscript(scope, read, options) {
	options?.assertCurrent?.();
	if (options?.readOnly) return read();
	try {
		return await read();
	} catch (error) {
		if (!(error instanceof SessionTranscriptColdError) || error.sessionId !== scope.sessionId) throw error;
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		await restoreSessionColdTranscript(scope, options?.assertCurrent, options?.coldRead);
	}
	options?.assertCurrent?.();
	return read();
}
//#endregion
export { readRestoredSessionTranscriptInWorker as n, readRestoredSessionTranscript as t };
