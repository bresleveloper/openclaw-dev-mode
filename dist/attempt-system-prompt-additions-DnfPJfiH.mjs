import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { _ as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-h1ULFETN.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-nsnbR10X.mjs";
import { r as hasPairedCardRenderer } from "./device-pairing-_Xo0MHGf.mjs";
import { m as prepareProgressCardToolForOpenClawTools } from "./openclaw-tools-lor9xxfh.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-BarAnCx4.mjs";
import { r as measureEmbeddedAgentPreparation } from "./attempt-system-prompt-prepare-D8zKFv2e.mjs";
import { t as resolveSessionGitCoauthorPrompt } from "./git-coauthor-prompt-1BKiEZdL.mjs";
import { t as beginContextEngineLogicalTurn } from "./context-engine-turn-begin-BnNzqIXZ.mjs";
import { t as createContextEngineLogicalTurnLease } from "./context-engine-logical-turn-9Vm5a-Dl.mjs";
//#region src/agents/embedded-agent-runner/run/blocked-run-result.ts
function buildEmbeddedRunBlockedResult(input) {
	return {
		payloads: [{
			text: input.text,
			isError: true
		}],
		meta: {
			durationMs: input.durationMs,
			agentMeta: input.agentMeta,
			systemPromptReport: input.attempt?.systemPromptReport,
			finalAssistantVisibleText: input.text,
			finalAssistantRawText: input.text,
			finalPromptText: input.finalPromptText,
			replayInvalid: input.replayInvalid,
			livenessState: "blocked",
			error: {
				kind: input.errorKind,
				message: input.errorMessage
			}
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/context-engine-admission.ts
/** Selects the admitted harness host and settles prior context work before beginning its turn. */
async function admitEmbeddedContextEngine(input, harness) {
	const params = input.runParams;
	const assertCurrent = params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal) : void 0;
	const ownsContextEngineLogicalTurnLease = params.contextEngineLogicalTurnLease === void 0;
	const contextEngineLogicalTurnLease = params.contextEngineLogicalTurnLease ?? await measureEmbeddedAgentPreparation("context-engine", () => createContextEngineLogicalTurnLease({
		identity: params,
		config: params.config,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		awaitSessionDiffBaseline: params.awaitSessionDiffBaseline ? async () => {
			await params.awaitSessionDiffBaseline?.();
			params.abortSignal?.throwIfAborted();
			assertCurrent?.();
		} : void 0
	}), { config: params.config });
	try {
		return {
			contextEngine: (await beginContextEngineLogicalTurn({
				lease: contextEngineLogicalTurnLease,
				host: {
					id: `agent-harness:${harness.id}`,
					label: `agent harness "${harness.id}"`,
					capabilities: harness.contextEngineHostCapabilities ?? []
				},
				recorder: params.userTurnTranscriptRecorder,
				isHeartbeat: isHeartbeatLifecycleRunKind(params.bootstrapContextRunKind),
				sessionTarget: params.sessionTarget
			})).engine,
			contextEngineLogicalTurnLease,
			ownsContextEngineLogicalTurnLease,
			[Symbol.asyncDispose]: () => ownsContextEngineLogicalTurnLease ? contextEngineLogicalTurnLease.dispose() : Promise.resolve()
		};
	} catch (error) {
		if (ownsContextEngineLogicalTurnLease) await contextEngineLogicalTurnLease.dispose();
		throw error;
	}
}
//#endregion
//#region src/agents/incognito-system-prompt.ts
const INCOGNITO_SYSTEM_PROMPT = "This chat is incognito; do not store its conversation content in memory files or long-term notes.";
function appendIncognitoSystemPrompt(params) {
	if (!(isIncognitoSessionKey(params.sessionKey) || params.storePath && isIncognitoOpenClawAgentSqlitePath(params.storePath, { agentId: params.agentId }))) return params.extraSystemPrompt;
	const existing = params.extraSystemPrompt;
	return existing ? `${existing}\n\n${INCOGNITO_SYSTEM_PROMPT}` : INCOGNITO_SYSTEM_PROMPT;
}
//#endregion
//#region src/agents/progress-card-system-prompt.ts
const PROGRESS_CARD_SYSTEM_PROMPT = "Create a card with progress_card only for substantial work with at least two meaningful sequential steps, never for greetings, quick questions, or single-step requests. For measurable work with a known total, prefer a leading progress bar labeled with what is measured and observed completed/total counts; never invent percentages. Update or clear existing cards as needed.";
function isAgentMainSession(params) {
	if (!params.sessionKey) return true;
	return canonicalizeMainSessionAlias({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) === canonicalizeMainSessionAlias({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: resolveAgentMainSessionKey({
			cfg: params.config,
			agentId: params.agentId
		})
	});
}
/**
* Pairing may change between sessions and embedded attempts because this fragment
* sits below the prompt-cache boundary. Codex pins developer instructions at
* thread creation, so a mid-session pairing change reaches its next thread.
*/
async function appendProgressCardSystemPrompt(params) {
	if (isAgentMainSession(params)) return params.extraSystemPrompt;
	if (!await prepareProgressCardToolForOpenClawTools({
		agentId: params.agentId,
		agentSessionKey: params.sessionKey,
		config: params.config,
		modelId: params.modelId,
		modelProvider: params.provider,
		runtimeToolAllowlist: params.toolsAllow
	}) || !await hasPairedCardRenderer()) return params.extraSystemPrompt;
	const provider = params.provider.trim().toLowerCase();
	const modelId = params.modelId.trim();
	const authProfileId = params.authProfileId?.trim();
	const modelRef = `${provider}/${modelId}${authProfileId ? `@${authProfileId}` : ""}`;
	if (resolveUtilityModelRefForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId,
		primaryProvider: provider,
		primaryModelRef: modelRef
	}) === modelRef) return params.extraSystemPrompt;
	const existing = params.extraSystemPrompt;
	return existing ? `${existing}\n\n${PROGRESS_CARD_SYSTEM_PROMPT}` : PROGRESS_CARD_SYSTEM_PROMPT;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-system-prompt-additions.ts
/** Prepares host-owned additions before either embedded or plugin harness dispatch. */
async function prepareAttemptSystemPromptAdditions(params) {
	return {
		extraSystemPrompt: await appendProgressCardSystemPrompt({
			...params,
			extraSystemPrompt: appendIncognitoSystemPrompt(params)
		}),
		gitCoauthorPrompt: await resolveSessionGitCoauthorPrompt({
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			storePath: params.storePath
		})
	};
}
//#endregion
export { admitEmbeddedContextEngine as n, buildEmbeddedRunBlockedResult as r, prepareAttemptSystemPromptAdditions as t };
