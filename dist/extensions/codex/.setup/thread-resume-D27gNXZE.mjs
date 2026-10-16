import { i as CodexAppServerScopedRequestRejectedError, o as isCodexAppServerOverloadError, r as CodexAppServerRpcError } from "./rpc-error-hmWM21RB.mjs";
import { r as publishCodexCatalogResume } from "./session-catalog-events-Bh9Q5R40.mjs";
import { L as forgetCodexWorkspaceReferences, pt as isCodexAppServerStartupError, u as isCodexAppServerStartSelectionChangedError } from "./shared-client-r9NcV_GJ.mjs";
import { h as assertCodexThreadResumeResponse, s as isCodexAppServerPrewriteRequestCancellationError } from "./client-BM1XpAkE.mjs";
import { f as unsubscribeCodexThreadBestEffort, i as assertCodexThreadResumeSubscription, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-DNfVb5SC.mjs";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
//#region extensions/codex/src/app-server/thread-resume.ts
/** Owns Codex thread/resume subscription safety. */
/** Resumes one thread, releasing or isolating every possible native subscription. */
async function resumeCodexAppServerThread(params) {
	const threadId = params.request.threadId;
	let response;
	try {
		response = assertCodexThreadResumeResponse(await (params.requestResume ? params.requestResume(params.request) : params.client.request("thread/resume", params.request, {
			...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
			...params.signal ? { signal: params.signal } : {},
			assertCurrent: params.assertCurrent,
			withCurrent: params.withCurrent
		})));
		assertCodexThreadResumeSubscription(threadId, response.thread.id);
		forgetCodexWorkspaceReferences(params.client, threadId);
	} catch (error) {
		if (isCodexAppServerStartSelectionChangedError(error) || isCodexAppServerStartupError(error) || error instanceof CodexAppServerScopedRequestRejectedError || isCodexAppServerPrewriteRequestCancellationError(error) || isCodexAppServerOverloadError(error)) throw error;
		if (error instanceof CodexAppServerRpcError) {
			if (await unsubscribeCodexThreadBestEffort(params.client, {
				threadId,
				timeoutMs: 5e3,
				assertCurrent: params.assertCurrent,
				withCurrent: params.withCurrent
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
