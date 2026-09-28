import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { y as describeAgentsWaitTool } from "./tool-description-presets-CT4WhVkI.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import "./common-XfKigJno.mjs";
import { O as onSubagentRegistryPersisted } from "./subagent-registry-read-C2SIiLpb.mjs";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DdiIlFMt.mjs";
import { _ as prepareSubagentRunsByRunIds } from "./subagent-registry-CM5uFXla.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-C7Yo0FcH.mjs";
import { a as markCollectorReaderTool } from "./swarm-collector-capability-BUvTLaKn.mjs";
import { setImmediate } from "node:timers/promises";
import { Type } from "typebox";
//#region src/agents/tools/agents-wait-tool.ts
const MAX_WAIT_IDS = 1e3;
const AgentsWaitToolSchema = Type.Object({
	ids: Type.Array(Type.String({ minLength: 1 }), {
		minItems: 1,
		maxItems: MAX_WAIT_IDS
	}),
	timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 }))
});
const CollectorCompletionSchema = Type.Object({
	runId: Type.String(),
	status: Type.Union([
		Type.Literal("done"),
		Type.Literal("failed"),
		Type.Literal("killed"),
		Type.Literal("timeout")
	]),
	result: Type.String(),
	structured: Type.Optional(Type.Unknown()),
	error: Type.Optional(Type.String()),
	schemaError: Type.Optional(Type.String()),
	sessionKey: Type.String(),
	label: Type.Optional(Type.String()),
	usage: Type.Optional(Type.Object({
		inputTokens: Type.Number(),
		outputTokens: Type.Number()
	}, { additionalProperties: false }))
}, { additionalProperties: false });
const AgentsWaitOutputSchema = Type.Object({
	completed: Type.Array(CollectorCompletionSchema),
	pending: Type.Array(Type.String()),
	errors: Type.Optional(Type.Array(Type.Object({
		runId: Type.String(),
		error: Type.Union([Type.Literal("not_found"), Type.Literal("not_owner")])
	}, { additionalProperties: false }))),
	success: Type.Optional(Type.Literal(false))
}, { additionalProperties: false });
function ownsRun(entry, currentSessionKeys, currentAgentId, config) {
	const owner = entry.swarmRequesterSessionKey?.trim();
	if (!owner) return false;
	return (entry.swarmWaitOwnerSessionKeys && entry.swarmWaitOwnerSessionKeys.length > 0 ? entry.swarmWaitOwnerSessionKeys : [owner]).some((sessionKey) => {
		if (!currentSessionKeys.has(sessionKey)) return false;
		const ownerAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? entry.requesterAgentId ?? paramsOwner(config, sessionKey);
		return Boolean(ownerAgentId && (!currentAgentId || ownerAgentId === currentAgentId));
	});
}
function paramsOwner(config, sessionKey) {
	if (!config) return;
	const persisted = resolvePersistedSessionStoreOwnerForKey(config, sessionKey);
	return persisted.kind === "configured" ? persisted.agentId : persisted.kind === "none" ? tryResolveLegacyCompatibilityAgentId(config) : void 0;
}
function completionResult(entry) {
	const completion = entry.collectorCompletion;
	if (!completion) return;
	return {
		runId: entry.swarmRunId ?? entry.runId,
		status: completion.status,
		result: resolveSubagentCompletionResultText(entry) ?? "",
		...completion.structured !== void 0 ? { structured: completion.structured } : {},
		...entry.execution.outcome?.status === "error" ? { error: entry.execution.outcome.error } : {},
		...completion.schemaError ? { schemaError: completion.schemaError } : {},
		sessionKey: entry.childSessionKey,
		...entry.label ? { label: entry.label } : {},
		...completion.usage ? { usage: completion.usage } : {}
	};
}
/** Park one host bridge until its collector completes; registry writes wake it without polling. */
async function waitForCollectorCompletion(params) {
	const state = await waitForCollector({
		...params,
		ids: [params.runId],
		abortError: () => new ToolInputError("agents.run wait aborted.")
	});
	const error = state.errors?.[0];
	if (error) throw new ToolInputError(`agents.run ${error.error}: ${error.runId}`);
	return expectDefined(state.completed[0], "collector completion");
}
function readWaitState(entries, ids, currentSessionKeys, currentAgentId, config) {
	const errors = [];
	const completed = [];
	const pending = [];
	for (const [inputIndex, runId] of ids.entries()) {
		const entry = entries.get(runId);
		if (!entry?.collect) {
			errors.push({
				runId,
				error: "not_found"
			});
			continue;
		}
		if (!ownsRun(entry, currentSessionKeys, currentAgentId, config)) {
			errors.push({
				runId,
				error: "not_owner"
			});
			continue;
		}
		const result = completionResult(entry);
		if (result) completed.push({
			result,
			completedAt: entry.completion?.capturedAt ?? entry.execution.endedAt ?? Number.MAX_SAFE_INTEGER,
			inputIndex
		});
		else pending.push(runId);
	}
	completed.sort((left, right) => left.completedAt - right.completedAt || left.inputIndex - right.inputIndex);
	return {
		completed: completed.map((entry) => entry.result),
		pending,
		...errors.length > 0 ? { errors } : {}
	};
}
async function waitForCollector(params) {
	const deadline = params.timeoutMs === void 0 ? void 0 : performance.now() + params.timeoutMs;
	let changed;
	let resume;
	let timer;
	const wake = () => {
		changed = true;
		resume?.();
	};
	const assertNotAborted = () => {
		if (params.signal?.aborted) throw params.abortError();
	};
	const unsubscribe = onSubagentRegistryPersisted(wake);
	params.signal?.addEventListener("abort", wake, { once: true });
	try {
		for (;;) {
			assertNotAborted();
			changed = false;
			let read;
			let callbackAbort;
			try {
				read = (await prepareSubagentRunsByRunIds(params.ids)).consume((entries) => {
					if (params.signal?.aborted) {
						callbackAbort = params.abortError();
						throw callbackAbort;
					}
					return readWaitState(entries, params.ids, params.currentSessionKeys, params.currentAgentId, params.config);
				});
			} catch (error) {
				if (params.signal?.aborted && error !== callbackAbort) {
					const aborted = params.abortError();
					aborted.cause = error;
					throw aborted;
				}
				throw error;
			}
			assertNotAborted();
			if (!read.ready) {
				await setImmediate();
				continue;
			}
			const state = read.value;
			if (state.completed.length > 0 || state.pending.length === 0 || deadline !== void 0 && performance.now() >= deadline) return state;
			if (changed) {
				await setImmediate();
				continue;
			}
			await new Promise((resolve) => {
				resume = resolve;
				if (deadline !== void 0) timer = setTimeout(resolve, Math.max(0, deadline - performance.now()));
			});
			clearTimeout(timer);
			timer = void 0;
			resume = void 0;
		}
	} finally {
		clearTimeout(timer);
		unsubscribe();
		params.signal?.removeEventListener("abort", wake);
	}
}
function createAgentsWaitTool(opts) {
	const swarm = resolveSwarmConfig(opts.config, opts.agentId);
	return markCollectorReaderTool({
		label: "Wait for Agents",
		name: "agents_wait",
		displaySummary: "Wait for collector children.",
		description: describeAgentsWaitTool(false),
		parameters: AgentsWaitToolSchema,
		outputSchema: AgentsWaitOutputSchema,
		execute: async (_toolCallId, args, signal) => {
			const params = args;
			if (params.ids.length > MAX_WAIT_IDS) throw new ToolInputError(`agents_wait supports at most ${MAX_WAIT_IDS} ids.`);
			const ids = [...new Set(params.ids.map((id) => id.trim()).filter(Boolean))];
			if (ids.length === 0) throw new ToolInputError("agents_wait requires at least one non-empty run id.");
			const currentSessionKeys = new Set([opts.runSessionKey, opts.agentSessionKey].filter((key) => Boolean(key?.trim())));
			const requestedTimeout = typeof params.timeoutSeconds === "number" && Number.isFinite(params.timeoutSeconds) ? params.timeoutSeconds : 30;
			const timeoutSeconds = Math.min(Math.max(0, requestedTimeout), swarm.waitTimeoutSecondsMax);
			const result = await waitForCollector({
				ids,
				currentSessionKeys,
				currentAgentId: opts.agentId,
				config: opts.config,
				timeoutMs: timeoutSeconds * 1e3,
				signal,
				abortError: () => createAbortError("agents_wait aborted.")
			});
			const noAuthorizedTargets = result.completed.length === 0 && result.pending.length === 0 && Boolean(result.errors?.length);
			return jsonResult(noAuthorizedTargets ? {
				...result,
				success: false
			} : result);
		}
	});
}
//#endregion
export { waitForCollectorCompletion as n, createAgentsWaitTool as t };
