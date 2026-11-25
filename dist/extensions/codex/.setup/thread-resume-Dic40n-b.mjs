import { m as assertCodexThreadResumeResponse, o as isCodexAppServerPrewriteRequestCancellationError } from "./client-C7W0Bk1P.mjs";
import { d as publishCodexCatalogResume } from "./auth-cache-key-DS0mnvrR.mjs";
import { d as CodexAppServerRpcError, f as CodexAppServerScopedRequestRejectedError, g as isCodexThreadClosingError, h as isCodexAppServerOverloadError, o as isCodexAppServerStartupError } from "./attempt-timeouts-m7WOwoeF.mjs";
import { B as forgetCodexWorkspaceReferences } from "./shared-client-DhJ31S_8.mjs";
import { f as unsubscribeCodexThreadBestEffort, i as assertCodexThreadResumeSubscription, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-B9YyH0aT.mjs";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
// extensions/codex/src/app-server/thread-resume.ts
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
		if (isCodexAppServerStartupError(error) || error instanceof CodexAppServerScopedRequestRejectedError || isCodexAppServerPrewriteRequestCancellationError(error) || isCodexAppServerOverloadError(error) || isCodexThreadClosingError(error, threadId)) throw error;
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
export { resumeCodexAppServerThread as t };
