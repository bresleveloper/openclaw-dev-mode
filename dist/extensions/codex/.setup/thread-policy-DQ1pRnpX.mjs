import { i as CodexAppServerScopedRequestRejectedError, o as isCodexAppServerOverloadError } from "./rpc-error-hmWM21RB.mjs";
import { n as requestCodexAppServerClientJson } from "./request-CB7T766a.mjs";
import { S as CodexAdoptedThreadActiveError } from "./shared-client-r9NcV_GJ.mjs";
import { p as assertCodexThreadAcceptsDirectInput, s as isCodexAppServerPrewriteRequestCancellationError } from "./client-BM1XpAkE.mjs";
import { AgentHarnessPreflightError, embeddedAgentLog, formatErrorMessage } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/thread-policy.ts
/** A refusal, not a failed native write: the ephemeral conversation must stay alive. */
var CodexIncognitoPolicyChangeError = class extends AgentHarnessPreflightError {
	constructor() {
		super("Codex cannot change generic instructions in a live incognito conversation. No turn was sent and the conversation is preserved. Restore the previous instructions to continue it, or start a new incognito conversation for the changed policy.");
		this.name = "CodexIncognitoPolicyChangeError";
	}
};
/** Never replay a handoff: native persistence can precede an unsuccessful RPC response. */
var CodexThreadPolicyHandoffError = class extends AgentHarnessPreflightError {
	constructor(outcome, cause) {
		super(`Codex session policy handoff failed: ${cause instanceof Error ? cause.message : String(cause)}. The conversation is preserved; reconnect before retrying.`, { cause });
		this.outcome = outcome;
		this.name = "CodexThreadPolicyHandoffError";
	}
};
/** The complete body remains generic configuration for compaction and native child inheritance. */
async function refreshCodexThreadPolicy(params) {
	await injectCodexThreadDeveloperHandoff(params, "The following is the complete current OpenClaw-supplied generic instruction policy. It replaces earlier OpenClaw-supplied generic policy, including sections removed from that generic policy. Parent-local instructions supplied for the current inference request are outside this policy replacement. Independently supplied native managed, guardian, security, collaboration, and project instructions retain their authority. User requests retain their own authority.\n\n" + (params.developerInstructions === "" ? "The current OpenClaw generic policy is empty; earlier OpenClaw generic policy is withdrawn." : params.developerInstructions));
}
/**
* Refreshes skills, persona, and memory instructions on a live thread whose generic policy cannot
* change (ephemeral threads have no resume source). The refresh is a client-authored
* developer message, so it must be re-delivered after every compaction.
*/
async function refreshCodexThreadInstructions(params) {
	await injectCodexThreadDeveloperHandoff(params, "The following is the complete current OpenClaw refreshable thread instructions. It replaces earlier OpenClaw-supplied skills, persona, and memory instructions in this conversation.\n\n" + (params.refreshableInstructions ?? "The current OpenClaw refreshable thread instructions are empty; earlier OpenClaw-supplied skills, persona, and memory instructions are withdrawn."));
}
/**
* Compaction rebuilds initial context from the thread's creation-time developer
* instructions and can drop client-authored developer messages (including local
* compaction regardless of `retain_client_developer_messages`). Restore the current
* section for subsequent requests. The immediate native continuation can still
* precede this handoff and see creation-time instructions.
*/
async function restoreCodexThreadInstructionsAfterCompaction(params) {
	const policy = params.ephemeralPolicy;
	if (!policy || policy.refreshableInstructions === policy.nativeRefreshableInstructions) return policy;
	try {
		await refreshCodexThreadInstructions({
			...params,
			refreshableInstructions: policy.refreshableInstructions
		});
		return policy;
	} catch (error) {
		embeddedAgentLog.warn("failed to restore Codex thread instructions after compaction", {
			threadId: params.threadId,
			error: formatErrorMessage(error)
		});
		return {
			...policy,
			refreshableInstructions: policy.nativeRefreshableInstructions
		};
	}
}
async function injectCodexThreadDeveloperHandoff(params, text) {
	let outcome = "unknown";
	try {
		await requestCodexAppServerClientJson({
			...params,
			method: "thread/inject_items",
			requestParams: {
				threadId: params.threadId,
				items: [{
					type: "message",
					role: "developer",
					content: [{
						type: "input_text",
						text
					}]
				}]
			}
		});
		outcome = "acknowledged";
		if (params.withCurrent) await params.withCurrent(() => params.assertCurrent?.());
		else params.assertCurrent?.();
		params.signal?.throwIfAborted();
	} catch (cause) {
		if (outcome !== "acknowledged" && (cause instanceof CodexAppServerScopedRequestRejectedError || isCodexAppServerPrewriteRequestCancellationError(cause) || isCodexAppServerOverloadError(cause))) outcome = "not-written";
		throw new CodexThreadPolicyHandoffError(outcome, cause);
	}
}
/** Native lineage classifies the exact bound thread; it never grants session authority. */
function assertCodexSupervisionThreadLineage(binding, thread) {
	if (binding.connectionScope !== "supervision" || binding.pendingSupervisionBranch) return;
	if (thread.id !== binding.threadId || !binding.supervisionSourceThreadId || thread.forkedFromId !== null && (typeof thread.forkedFromId !== "string" || !thread.forkedFromId.trim() || thread.forkedFromId === thread.id)) throw new Error("Codex supervision lineage could not be verified; reconnect before continuing.");
}
/** Passive refusal must precede releasing or acquiring any native subscription. */
async function assertAdoptedCodexThreadResumeAllowed(params, threadId, context, assertCurrent) {
	const { thread } = await context.lifecycleTiming.measure("thread-read-adoption-status", () => params.client.request("thread/read", {
		threadId,
		includeTurns: false
	}, {
		signal: params.signal,
		assertCurrent,
		withCurrent: params.authority?.withCurrent
	}));
	context.throwIfAborted();
	if (thread.id !== threadId) throw new Error("Codex returned another thread during adoption status read");
	assertCodexThreadAcceptsDirectInput(thread);
	if (thread.status?.type === "active") throw new CodexAdoptedThreadActiveError();
	return thread;
}
//#endregion
export { refreshCodexThreadInstructions as a, assertCodexSupervisionThreadLineage as i, CodexThreadPolicyHandoffError as n, refreshCodexThreadPolicy as o, assertAdoptedCodexThreadResumeAllowed as r, restoreCodexThreadInstructionsAfterCompaction as s, CodexIncognitoPolicyChangeError as t };
