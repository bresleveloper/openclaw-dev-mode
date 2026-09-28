import { r as publishCodexCatalogResume } from "./session-catalog-events-Bj6j94E_.mjs";
import { o as CodexAppServerRpcError } from "./timeout-C910MdAB.mjs";
import { t as CodexAppServerScopedRequestRejectedError } from "./request-D2L0zMrq.mjs";
import { F as forgetCodexWorkspaceReferences, rt as isCodexAppServerStartupError, u as isCodexAppServerStartSelectionChangedError } from "./shared-client-DA4VR4Eb.mjs";
import { b as assertCodexThreadResumeResponse, l as isCodexAppServerOverloadError, u as isCodexAppServerPrewriteRequestCancellationError } from "./client-Cs08OXVQ.mjs";
import { i as assertCodexThreadResumeSubscription, p as unsubscribeCodexThreadBestEffort, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
//#region extensions/codex/src/app-server/thread-resume.ts
/** Owns Codex thread/resume subscription safety. */
/** Resumes one thread, releasing or isolating every possible native subscription. */
async function resumeCodexAppServerThread(params) {
	const threadId = params.request.threadId;
	let response;
	let ownershipRejected = false;
	const assertCurrent = params.assertCurrent && (() => {
		try {
			params.assertCurrent?.();
		} catch (error) {
			ownershipRejected = true;
			throw error;
		}
	});
	try {
		response = assertCodexThreadResumeResponse(await (params.requestResume ? params.requestResume(params.request) : params.client.request("thread/resume", params.request, {
			...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
			...params.signal ? { signal: params.signal } : {},
			assertCurrent
		})));
		assertCodexThreadResumeSubscription(threadId, response.thread.id);
		forgetCodexWorkspaceReferences(params.client, threadId);
	} catch (error) {
		if (ownershipRejected || isCodexAppServerStartSelectionChangedError(error) || isCodexAppServerStartupError(error) || error instanceof CodexAppServerScopedRequestRejectedError || isCodexAppServerPrewriteRequestCancellationError(error) || isCodexAppServerOverloadError(error)) throw error;
		if (error instanceof CodexAppServerRpcError) {
			if (await unsubscribeCodexThreadBestEffort(params.client, {
				threadId,
				timeoutMs: 5e3,
				assertCurrent: params.assertCurrent
			}).catch(() => false)) {
				params.onSubscriptionReleased?.();
				throw error;
			}
		}
		try {
			await params.abandonClient();
		} catch (abandonError) {
			throw new CodexAppServerUnsafeSubscriptionError(`Codex thread/resume client could not be retired for ${threadId}`, { cause: abandonError });
		}
		if (error instanceof CodexAppServerUnsafeSubscriptionError) throw error;
		throw new CodexAppServerUnsafeSubscriptionError(error instanceof Error ? error.message : `Codex thread/resume outcome is indeterminate for ${threadId}`, { cause: error });
	}
	await publishCodexCatalogResume(params.client, response, sanitizeTerminalText);
	return response;
}
//#endregion
export { resumeCodexAppServerThread as t };
