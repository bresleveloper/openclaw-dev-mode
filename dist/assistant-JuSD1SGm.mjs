import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { p as prepareSystemAgentRunAdmission } from "./admitted-run-context-h1ULFETN.mjs";
import "./lanes-D7a4ntDu.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { r as SystemAgentInferenceUnavailableError, t as requireSystemAgentInferenceRoute } from "./inference-guard-dpnxA1_N.mjs";
import { i as resolveSystemAgentExpectedAgentHarnessRuntimeArtifact } from "./verified-inference-DGxbE23j.mjs";
import { n as extractAgentRunTerminalError, r as extractAgentRunText } from "./agent-run-result-C69jhuXu.mjs";
import { a as SYSTEM_AGENT_ASSISTANT_TIMEOUT_MS, c as buildSystemAgentGreetingUserPrompt, i as SYSTEM_AGENT_ASSISTANT_SYSTEM_PROMPT, n as systemAgentTerminalFailureGuidance, o as SYSTEM_AGENT_GREETING_SYSTEM_PROMPT, r as SYSTEM_AGENT_ASSISTANT_LOCAL_TIMEOUT_MS, s as buildSystemAgentAssistantUserPrompt, t as systemAgentRuntimeFailureGuidance, u as parseSystemAgentAssistantPlanText } from "./inference-run-errors-bPrHzfMC.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
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
/** Plan only through the configured default agent's verified route. */
async function planSystemAgentCommand(params) {
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
	const route = await requireSystemAgentInferenceRoute(params.verifiedInference, params.deps, "planner");
	let expectedAgentHarnessRuntimeArtifact;
	try {
		expectedAgentHarnessRuntimeArtifact = resolveSystemAgentExpectedAgentHarnessRuntimeArtifact(params.verifiedInference);
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("planner", [error]);
	}
	const responseFormat = expectedAgentHarnessRuntimeArtifact ? void 0 : params.responseFormat;
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-planner-"));
	let text;
	let preparedRunAdmission;
	try {
		const runId = `${params.runIdPrefix}-${randomUUID()}`;
		const timeoutMs = params.timeoutMs ?? resolveSystemAgentAssistantTimeoutMs(route);
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
		const result = route.runner === "cli" ? await (await import("./cli-runner-BRyY4weM.mjs")).runCliAgent({
			...shared,
			preparedRunAdmission,
			executionMode: "side-question",
			cleanupCliLiveSessionOnRunEnd: true
		}) : await (await import("./embedded-agent-DyhWQz5W.mjs")).runEmbeddedAgent({
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
		if (terminalError) throw new SystemAgentInferenceUnavailableError("planner", [new Error(terminalError)], systemAgentTerminalFailureGuidance(result));
		text = extractAgentRunText(result);
	} catch (error) {
		if (error instanceof SystemAgentInferenceUnavailableError) throw error;
		const guidance = systemAgentRuntimeFailureGuidance(error);
		if (guidance) throw new SystemAgentInferenceUnavailableError("planner", [error], guidance);
		text = void 0;
	} finally {
		preparedRunAdmission?.close();
		await fs.rm(tempDir, {
			recursive: true,
			force: true
		});
	}
	if (!text) return null;
	await requireSystemAgentInferenceRoute(params.verifiedInference, params.deps, "planner");
	return {
		text,
		modelLabel: route.modelLabel
	};
}
//#endregion
export { planSystemAgentCommand, planSystemAgentGreetingWithConfiguredModel };
