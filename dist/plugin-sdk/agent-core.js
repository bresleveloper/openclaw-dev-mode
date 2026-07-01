import { n as signalProcessTree, t as killProcessTree } from "../kill-tree-kSm0C74g.js";
import { n as validateToolCall, t as validateToolArguments } from "../src-M7TBQdDX.js";
import { i as streamSimple, n as completeSimple } from "../stream-Bs1DzXcN.js";
import { $ as err, A as getLastAssistantUsage, B as asAgentMessage, C as calculateContextTokens, D as findCutPoint, E as estimateTokens, F as buildSessionContext, G as createCustomMessage, H as convertToLlm, I as BRANCH_SUMMARY_PREFIX, J as BranchSummaryError, K as NodeExecutionEnv, L as BRANCH_SUMMARY_SUFFIX, M as shouldCompact, N as serializeConversation, O as findTurnStartIndex, P as Session, Q as SessionError, R as COMPACTION_SUMMARY_PREFIX, S as DEFAULT_COMPACTION_SETTINGS, T as estimateContextTokens, U as createBranchSummaryMessage, V as bashExecutionToText, W as createCompactionSummaryMessage, X as ExecutionError, Y as CompactionError, Z as FileError, _ as substituteArgs, a as formatSize, at as runAgentLoop, b as generateBranchSummary, c as truncateTail, ct as resolveAgentCoreStreamFn, d as loadJsonlSessionMetadata, et as ok, f as uuidv7, g as parseCommandArgs, h as formatPromptTemplateInvocation, i as GREP_MAX_LINE_LENGTH, it as agentLoopContinue, j as prepareCompaction, k as generateSummary, l as InMemorySessionStorage, m as formatSkillInvocation, n as DEFAULT_MAX_BYTES, nt as Agent$1, o as truncateHead, ot as runAgentLoopContinue, p as CoreAgentHarness, q as AgentHarnessError, r as DEFAULT_MAX_LINES, rt as agentLoop, s as truncateLine, st as resolveAgentCoreCompleteFn, t as streamProxy, tt as toError, u as JsonlSessionStorage, v as collectEntriesForBranchSummary, w as compact, x as prepareBranchEntries, y as collectEntriesForBranchSummaryFromBranches, z as COMPACTION_SUMMARY_SUFFIX } from "../proxy-CoylXPU6.js";
import "../llm-CezOo0-6.js";
//#region src/plugin-sdk/agent-core.ts
/** Runtime adapter that lets the package agent-core use OpenClaw LLM helpers. */
const openClawAgentCoreRuntime = {
	completeSimple,
	streamSimple
};
/** Agent-core class preconfigured with OpenClaw runtime dependencies. */
var Agent = class extends Agent$1 {
	constructor(options = {}) {
		super({
			runtime: openClawAgentCoreRuntime,
			...options
		});
	}
};
//#endregion
export { Agent, CoreAgentHarness as AgentHarness, CoreAgentHarness, AgentHarnessError, BRANCH_SUMMARY_PREFIX, BRANCH_SUMMARY_SUFFIX, BranchSummaryError, COMPACTION_SUMMARY_PREFIX, COMPACTION_SUMMARY_SUFFIX, CompactionError, DEFAULT_COMPACTION_SETTINGS, DEFAULT_MAX_BYTES, DEFAULT_MAX_LINES, ExecutionError, FileError, GREP_MAX_LINE_LENGTH, InMemorySessionStorage, JsonlSessionStorage, NodeExecutionEnv, Session, SessionError, agentLoop, agentLoopContinue, asAgentMessage, bashExecutionToText, buildSessionContext, calculateContextTokens, collectEntriesForBranchSummary, collectEntriesForBranchSummaryFromBranches, compact, convertToLlm, createBranchSummaryMessage, createCompactionSummaryMessage, createCustomMessage, err, estimateContextTokens, estimateTokens, findCutPoint, findTurnStartIndex, formatPromptTemplateInvocation, formatSize, formatSkillInvocation, generateBranchSummary, generateSummary, getLastAssistantUsage, killProcessTree, loadJsonlSessionMetadata, ok, openClawAgentCoreRuntime, parseCommandArgs, prepareBranchEntries, prepareCompaction, resolveAgentCoreCompleteFn, resolveAgentCoreStreamFn, runAgentLoop, runAgentLoopContinue, serializeConversation, shouldCompact, signalProcessTree, streamProxy, substituteArgs, toError, truncateHead, truncateLine, truncateTail, uuidv7, validateToolArguments, validateToolCall };
