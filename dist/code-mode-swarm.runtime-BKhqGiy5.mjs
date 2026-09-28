import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { s as isToolExecutionAllowed } from "./tool-policy-shared-auQCQEhM.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-DiXxneBV.mjs";
import "./common-XfKigJno.mjs";
import { o as runAgentToolSourceExecutionGuard, r as captureAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-CEFulHpI.mjs";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-0nPieSUh.mjs";
import { d as initSubagentRegistry, u as getSwarmRunByLaunchReplayKey } from "./subagent-registry-CM5uFXla.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-C7Yo0FcH.mjs";
import { i as isCollectorSpawnTool, o as runWithJoinedCollectorSpawn } from "./swarm-collector-capability-BUvTLaKn.mjs";
import { n as waitForCollectorCompletion } from "./agents-wait-tool-DXWf5ct_.mjs";
import { n as SWARM_CODE_MODE_REQUEST_FINGERPRINT, t as SWARM_CODE_MODE_IDEMPOTENCY_KEY } from "./swarm-code-mode-DXtHU4JN.mjs";
import { createHash } from "node:crypto";
//#region src/agents/code-mode-swarm.runtime.ts
function resolveCodeModeRequesterSessionKey(ctx) {
	const sessionKey = ctx.sessionKey?.trim();
	if (!sessionKey) throw new ToolInputError("code mode swarm globals require session and run identity.");
	const { mainKey, alias } = resolveMainSessionAlias(ctx.runtimeConfig ?? ctx.config ?? {});
	return resolveInternalSessionKey({
		key: sessionKey,
		alias,
		mainKey
	});
}
function resolveCodeModeSwarmGroupId(ctx) {
	const sessionKey = resolveCodeModeRequesterSessionKey(ctx);
	const runId = ctx.runId?.trim();
	if (!runId) throw new ToolInputError("code mode swarm globals require session and run identity.");
	return `swarm:${sessionKey}:${runId}`;
}
function replayedSpawnResult(entry) {
	return {
		status: "accepted",
		runId: entry.swarmRunId ?? entry.runId,
		sessionKey: entry.childSessionKey,
		...entry.label ? { label: entry.label } : {}
	};
}
function readOptionalStringOption(options, key) {
	const value = options[key];
	if (value === void 0) return;
	if (typeof value !== "string" || !value.trim()) throw new ToolInputError(`agents.run ${key} must be a non-empty string.`);
	return value.trim();
}
async function runAgentSpawnBridge(params) {
	const prompt = params.request.args[0];
	const options = isRecord(params.request.args[1]) ? params.request.args[1] : {};
	if (typeof prompt !== "string" || !prompt.trim()) throw new ToolInputError("agents.run prompt must be a non-empty string.");
	const fastMode = options.fastMode;
	if (fastMode !== void 0 && fastMode !== true && fastMode !== false && fastMode !== "auto") throw new ToolInputError("agents.run fastMode must be boolean or \"auto\".");
	const schema = options.schema;
	if (schema !== void 0 && !isRecord(schema)) throw new ToolInputError("agents.run schema must be a JSON schema object.");
	const label = readOptionalStringOption(options, "label");
	const model = readOptionalStringOption(options, "model");
	const thinking = readOptionalStringOption(options, "thinking");
	const agentId = readOptionalStringOption(options, "agentId");
	const catalog = params.ctx.catalogRef?.current;
	const spawnEntry = catalog?.entries.find((entry) => entry.name === "sessions_spawn" && isCollectorSpawnTool(entry.tool));
	if (!catalog || !spawnEntry || !isCollectorSpawnTool(spawnEntry.tool)) throw new ToolInputError("agents.run requires the native sessions_spawn tool.");
	const spawnTool = spawnEntry.tool;
	const assertSourceActive = captureAgentToolSourceExecutionGuard(params.signal);
	const assertCurrent = () => {
		assertSourceActive();
		params.ctx.abortSignal?.throwIfAborted();
		if (params.ctx.catalogRef?.current !== catalog || !catalog.entries.includes(spawnEntry) || !resolveSwarmConfig(params.ctx.runtimeConfig ?? params.ctx.config, params.ctx.agentId).enabled || params.ctx.toolExecutionAllow && !isToolExecutionAllowed(params.ctx.toolExecutionAllow, "sessions_spawn")) throw new ToolInputError("Joined collector spawn catalog is no longer active.");
		runAgentToolSourceExecutionGuard(spawnTool);
	};
	assertCurrent();
	const spawnInput = {
		task: prompt.trim(),
		collect: true,
		groupId: resolveCodeModeSwarmGroupId(params.ctx),
		...label ? { label } : {},
		...model ? { model } : {},
		...thinking ? { thinking } : {},
		...agentId ? { agentId } : {},
		...fastMode !== void 0 ? { fastMode } : {},
		...schema ? { outputSchema: schema } : {}
	};
	const requestFingerprint = `sha256:${createHash("sha256").update(stableStringify(spawnInput)).digest("hex")}`;
	const idempotencyKey = `${params.codeModeRunId}:${params.request.id}`;
	const requesterSessionKey = resolveCodeModeRequesterSessionKey(params.ctx);
	let existing = getSwarmRunByLaunchReplayKey(idempotencyKey, requesterSessionKey, params.ctx.agentId);
	if (existing) {
		if (existing.swarmLaunchRequestFingerprint !== requestFingerprint) throw new ToolInputError("agents.run replay request does not match the persisted collector.");
		if (existing.swarmLaunchPending === true) {
			if (!existing.queuedLaunch) throw new ToolInputError("agents.run persisted launch reservation cannot be recovered.");
			initSubagentRegistry();
			existing = getSwarmRunByLaunchReplayKey(idempotencyKey, requesterSessionKey, params.ctx.agentId) ?? existing;
			if (existing.swarmLaunchPending === true && !existing.queuedLaunch) throw new ToolInputError("agents.run persisted launch reservation cannot be recovered.");
		}
		assertCurrent();
		return replayedSpawnResult(existing);
	}
	Object.defineProperty(spawnInput, SWARM_CODE_MODE_IDEMPOTENCY_KEY, { value: idempotencyKey });
	Object.defineProperty(spawnInput, SWARM_CODE_MODE_REQUEST_FINGERPRINT, { value: requestFingerprint });
	const called = await runWithJoinedCollectorSpawn(spawnEntry.tool, assertCurrent, () => params.runtime.callExactId(spawnEntry.id, spawnInput, {
		parentToolCallId: params.parentToolCallId,
		signal: params.signal,
		onUpdate: params.onUpdate
	}));
	assertCurrent();
	const value = isRecord(called.result) && "details" in called.result ? called.result.details : called.result;
	if (!isRecord(value) || value.status !== "accepted" || typeof value.runId !== "string") {
		const detail = isRecord(value) && typeof value.error === "string" ? value.error : "collector spawn was not accepted";
		throw new ToolInputError(`agents.run spawn failed: ${detail}`);
	}
	return value;
}
async function runAgentWaitBridge(params) {
	const runId = params.request.args[0];
	if (typeof runId !== "string" || !runId.trim()) throw new ToolInputError("agentWait run id must be a non-empty string.");
	const rawSessionKey = params.ctx.sessionKey?.trim();
	if (!rawSessionKey) throw new ToolInputError("agents.run wait requires session identity.");
	const requesterSessionKey = resolveCodeModeRequesterSessionKey(params.ctx);
	return await waitForCollectorCompletion({
		runId: runId.trim(),
		currentSessionKeys: /* @__PURE__ */ new Set([rawSessionKey, requesterSessionKey]),
		currentAgentId: params.ctx.agentId,
		config: params.ctx.runtimeConfig ?? params.ctx.config,
		signal: params.signal
	});
}
function runSwarmNoteBridge(params) {
	const note = isRecord(params.request.args[0]) ? params.request.args[0] : void 0;
	const kind = note?.kind;
	const text = note?.text;
	if (kind !== "phase" && kind !== "log" || typeof text !== "string" || !text.trim()) throw new ToolInputError("swarmNote requires phase/log kind and non-empty text.");
	const sessionKey = params.ctx.sessionKey?.trim();
	if (!sessionKey) throw new ToolInputError("swarmNote requires session identity.");
	emitSessionLifecycleEvent({
		sessionKey,
		reason: "swarm-note",
		scope: "runtime",
		swarmGroupId: resolveCodeModeSwarmGroupId(params.ctx),
		kind,
		text: text.trim()
	});
	return { ok: true };
}
const codeModeSwarmHandlers = {
	agentSpawn: runAgentSpawnBridge,
	agentWait: runAgentWaitBridge,
	swarmNote: runSwarmNoteBridge
};
//#endregion
export { codeModeSwarmHandlers };
