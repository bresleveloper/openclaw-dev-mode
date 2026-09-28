import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { l as prepareSystemAgentRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
import { t as SessionManager } from "./session-manager-Bb7qQp5M.mjs";
import { t as SystemAgentInferenceUnavailableError } from "./inference-error-C-Vf2B5Y.mjs";
import { a as resolveSystemAgentVerifiedInferenceRoute, i as resolveSystemAgentExpectedAgentHarnessRuntimeArtifact } from "./verified-inference-zRMzI01B.mjs";
import { i as extractAgentRunText, r as extractAgentRunTerminalError } from "./agent-run-result-ecnMVuqT.mjs";
import { a as buildSystemAgentAssistantUserPrompt, c as parseSystemAgentAssistantPlanText, i as SYSTEM_AGENT_GREETING_SYSTEM_PROMPT, n as SYSTEM_AGENT_ASSISTANT_SYSTEM_PROMPT, o as buildSystemAgentGreetingUserPrompt, r as SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS, t as SYSTEM_AGENT_ASSISTANT_LOCAL_TIMEOUT_MS } from "./assistant-prompts-Cdty3imr.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
//#region src/system-agent/assistant-timeout.ts
function resolveSystemAgentAssistantTimeoutMs(route) {
	try {
		const workspaceDir = resolveAgentWorkspaceDir(route.runConfig, route.agentId);
		const plugins = resolvePluginMetadataSnapshot({
			config: route.runConfig,
			workspaceDir,
			env: process.env,
			allowWorkspaceScopedCurrent: true
		}).plugins;
		const providers = /* @__PURE__ */ new Set([normalizeProviderId(route.provider), normalizeProviderId(route.modelLabel.split("/", 1)[0] ?? "")]);
		return plugins.some((plugin) => Object.entries(plugin.modelPricing?.providers ?? {}).some(([provider, pricing]) => providers.has(normalizeProviderId(provider)) && pricing.external === false)) ? SYSTEM_AGENT_ASSISTANT_LOCAL_TIMEOUT_MS : SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS;
	} catch {
		return SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS;
	}
}
//#endregion
//#region src/system-agent/assistant.ts
const SYSTEM_AGENT_PLANNER_RESPONSE_SCHEMA = {
	type: "object",
	properties: {
		reply: { type: "string" },
		command: { type: "string" }
	},
	required: ["reply"],
	additionalProperties: false
};
async function planSystemAgentCommand(params) {
	return await planSystemAgentCommandWithConfiguredModel(params);
}
/** Plan only through the configured default agent's verified route. */
async function planSystemAgentCommandWithConfiguredModel(params) {
	const input = params.input.trim();
	if (!input) return null;
	const result = await runConfiguredSystemAgentText({
		prompt: buildSystemAgentAssistantUserPrompt({
			input,
			overview: params.overview,
			...params.history ? { history: params.history } : {},
			...params.pendingOperation ? { pendingOperation: params.pendingOperation } : {}
		}),
		systemPrompt: SYSTEM_AGENT_ASSISTANT_SYSTEM_PROMPT,
		runIdPrefix: "openclaw-planner",
		verifiedInference: params.verifiedInference,
		deps: params.deps,
		responseFormat: SYSTEM_AGENT_PLANNER_RESPONSE_SCHEMA
	});
	const parsed = parseSystemAgentAssistantPlanText(result?.text);
	return parsed && result ? {
		...parsed,
		modelLabel: result.modelLabel
	} : null;
}
/** One tool-free, verified inference turn for the cached caretaker greeting. */
async function planSystemAgentGreetingWithConfiguredModel(params) {
	const result = await runConfiguredSystemAgentText({
		prompt: buildSystemAgentGreetingUserPrompt(params),
		systemPrompt: SYSTEM_AGENT_GREETING_SYSTEM_PROMPT,
		runIdPrefix: "openclaw-greeting",
		verifiedInference: params.verifiedInference,
		deps: params.deps,
		timeoutMs: params.timeoutMs
	});
	return result ? {
		text: result.text,
		modelRef: result.modelLabel
	} : null;
}
async function runConfiguredSystemAgentText(params) {
	const route = await requireVerifiedPlannerRoute(params.verifiedInference, params.deps);
	let expectedAgentHarnessRuntimeArtifact;
	try {
		expectedAgentHarnessRuntimeArtifact = resolveSystemAgentExpectedAgentHarnessRuntimeArtifact(params.verifiedInference);
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("planner", [error]);
	}
	const responseFormat = expectedAgentHarnessRuntimeArtifact ? void 0 : params.responseFormat;
	const tempDir = await (params.deps?.createTempDir ?? createTempPlannerDir)();
	let text;
	let preparedRunAdmission;
	try {
		const runId = `${params.runIdPrefix}-${randomUUID()}`;
		const timeoutMs = params.timeoutMs ?? (params.deps?.resolveAssistantTimeoutMs ?? resolveSystemAgentAssistantTimeoutMs)(route);
		preparedRunAdmission = prepareSystemAgentRunAdmission(route.runConfig, runId, route.agentId, "system-agent.assistant");
		const shared = {
			sessionId: `${runId}-session`,
			agentId: route.agentId,
			trigger: "manual",
			sessionFile: `in-memory:${runId}`,
			sessionManager: SessionManager.inMemory(tempDir),
			workspaceDir: tempDir,
			cwd: tempDir,
			agentDir: route.agentDir,
			config: route.runConfig,
			prompt: params.prompt,
			provider: route.provider,
			model: route.model,
			timeoutMs,
			thinkLevel: "off",
			runId,
			extraSystemPrompt: params.systemPrompt,
			extraSystemPromptStatic: params.systemPrompt,
			messageChannel: "openclaw",
			messageProvider: "openclaw",
			disableTools: true,
			disableTrajectory: true,
			...responseFormat ? { streamParams: { responseFormat } } : {},
			...route.authProfileId ? { authProfileId: route.authProfileId } : {}
		};
		const result = route.runner === "cli" ? await (params.deps?.runCliAgent ?? (await import("./cli-runner-Cdn3Hc4D.mjs")).runCliAgent)({
			...shared,
			preparedRunAdmission,
			executionMode: "side-question",
			cleanupCliLiveSessionOnRunEnd: true
		}) : await (params.deps?.runEmbeddedAgent ?? (await import("./embedded-agent-UPcfDsvn.mjs")).runEmbeddedAgent)({
			...shared,
			lane: "system-agent-inference",
			preparedRunAdmission,
			toolsAllow: [],
			agentHarnessRuntimeOverride: route.agentHarnessRuntimeOverride,
			...expectedAgentHarnessRuntimeArtifact ? { expectedAgentHarnessRuntimeArtifact } : {},
			cleanupBundleMcpOnRunEnd: true,
			...route.authProfileId ? { authProfileIdSource: "user" } : {}
		});
		const terminalError = extractAgentRunTerminalError(result);
		if (terminalError) throw new SystemAgentInferenceUnavailableError("planner", [new Error(terminalError)]);
		text = extractAgentRunText(result)?.trim();
	} catch (error) {
		if (error instanceof SystemAgentInferenceUnavailableError) throw error;
		text = void 0;
	} finally {
		preparedRunAdmission?.close();
		await (params.deps?.removeTempDir ?? removeTempPlannerDir)(tempDir);
	}
	if (!text) return null;
	await requireVerifiedPlannerRoute(params.verifiedInference, params.deps);
	return {
		text,
		modelLabel: route.modelLabel
	};
}
async function requireVerifiedPlannerRoute(binding, deps) {
	if (!binding) throw new SystemAgentInferenceUnavailableError("planner");
	try {
		const route = await resolveSystemAgentVerifiedInferenceRoute(binding, deps);
		if (route) return route;
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("planner", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("planner");
}
async function createTempPlannerDir() {
	return await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-planner-"));
}
async function removeTempPlannerDir(dir) {
	await fs.rm(dir, {
		recursive: true,
		force: true
	});
}
//#endregion
export { planSystemAgentCommand, planSystemAgentGreetingWithConfiguredModel };
