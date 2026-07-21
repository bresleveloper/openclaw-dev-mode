import "./agent-scope-B2Pk_xhT.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-BxAUeF6t.js";
import { u as readConfigFileSnapshot } from "./io-DxnOT4sF.js";
import "./config-Cc93keN1.js";
import { r as extractAssistantText } from "./embedded-agent-utils-CjKqpAOm.js";
import { r as prepareSimpleCompletionModelForAgent, t as completeWithPreparedSimpleCompletionModel } from "./simple-completion-runtime-DqsS2UxT.js";
import { r as selectCrestodianLocalPlannerBackends } from "./assistant-backends-C96KpxKv.js";
import { a as parseCrestodianAssistantPlanText, i as buildCrestodianAssistantUserPrompt, n as CRESTODIAN_ASSISTANT_SYSTEM_PROMPT, r as CRESTODIAN_ASSISTANT_TIMEOUT_MS } from "./assistant-prompts-C2-exuV_.js";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
//#region src/crestodian/assistant.ts
async function planCrestodianCommand(params) {
	const configured = await planCrestodianCommandWithConfiguredModel(params);
	if (configured) return configured;
	return await planCrestodianCommandWithLocalRuntime(params);
}
async function planCrestodianCommandWithConfiguredModel(params) {
	const input = params.input.trim();
	if (!input) return null;
	const snapshot = await (params.deps?.readConfigFileSnapshot ?? readConfigFileSnapshot)();
	if (!snapshot.exists || !snapshot.valid) return null;
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const agentId = resolveDefaultAgentId(cfg);
	const prepared = await (params.deps?.prepareSimpleCompletionModelForAgent ?? prepareSimpleCompletionModelForAgent)({
		cfg,
		agentId,
		allowMissingApiKeyModes: ["aws-sdk"]
	});
	if ("error" in prepared) return null;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), CRESTODIAN_ASSISTANT_TIMEOUT_MS);
	try {
		const parsed = parseCrestodianAssistantPlanText(extractAssistantText(await (params.deps?.completeWithPreparedSimpleCompletionModel ?? completeWithPreparedSimpleCompletionModel)({
			model: prepared.model,
			auth: prepared.auth,
			context: {
				systemPrompt: CRESTODIAN_ASSISTANT_SYSTEM_PROMPT,
				messages: [{
					role: "user",
					content: buildCrestodianAssistantUserPrompt({
						input,
						overview: params.overview,
						...params.history ? { history: params.history } : {},
						...params.pendingOperation ? { pendingOperation: params.pendingOperation } : {}
					}),
					timestamp: Date.now()
				}]
			},
			options: {
				maxTokens: 700,
				signal: controller.signal
			}
		})));
		if (!parsed) return null;
		return {
			...parsed,
			modelLabel: `${prepared.selection.provider}/${prepared.selection.modelId}`
		};
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
async function planCrestodianCommandWithLocalRuntime(params) {
	const input = params.input.trim();
	if (!input) return null;
	const backends = selectCrestodianLocalPlannerBackends(params.overview);
	if (backends.length === 0) return null;
	const prompt = buildCrestodianAssistantUserPrompt({
		input,
		overview: params.overview,
		...params.history ? { history: params.history } : {},
		...params.pendingOperation ? { pendingOperation: params.pendingOperation } : {}
	});
	for (const backend of backends) try {
		const parsed = parseCrestodianAssistantPlanText(await runLocalRuntimePlanner(backend, {
			prompt,
			deps: params.deps
		}));
		if (parsed) return {
			...parsed,
			modelLabel: backend.label
		};
	} catch {}
	return null;
}
async function runLocalRuntimePlanner(backend, params) {
	const tempDir = await (params.deps?.createTempDir ?? createTempPlannerDir)();
	try {
		const runId = `crestodian-planner-${randomUUID()}`;
		const sessionFile = path.join(tempDir, "session.jsonl");
		const sessionId = `${runId}-session`;
		const sessionKey = `temp:crestodian-planner:${runId}`;
		switch (backend.runner) {
			case "cli": return extractPlannerResultText(await (params.deps?.runCliAgent ?? await loadRunCliAgent())({
				sessionId,
				sessionKey,
				agentId: "crestodian",
				trigger: "manual",
				sessionFile,
				workspaceDir: tempDir,
				config: backend.buildConfig(tempDir),
				prompt: params.prompt,
				provider: backend.provider,
				model: backend.model,
				timeoutMs: CRESTODIAN_ASSISTANT_TIMEOUT_MS,
				runId,
				extraSystemPrompt: CRESTODIAN_ASSISTANT_SYSTEM_PROMPT,
				extraSystemPromptStatic: CRESTODIAN_ASSISTANT_SYSTEM_PROMPT,
				messageChannel: "crestodian",
				messageProvider: "crestodian",
				cleanupCliLiveSessionOnRunEnd: true
			}));
			case "embedded": return extractPlannerResultText(await (params.deps?.runEmbeddedAgent ?? await loadRunEmbeddedAgent())({
				sessionId,
				sessionKey,
				agentId: "crestodian",
				trigger: "manual",
				sessionFile,
				workspaceDir: tempDir,
				config: backend.buildConfig(tempDir),
				prompt: params.prompt,
				provider: backend.provider,
				model: backend.model,
				agentHarnessId: "codex",
				disableTools: true,
				toolsAllow: [],
				timeoutMs: CRESTODIAN_ASSISTANT_TIMEOUT_MS,
				runId,
				extraSystemPrompt: CRESTODIAN_ASSISTANT_SYSTEM_PROMPT,
				messageChannel: "crestodian",
				messageProvider: "crestodian",
				cleanupBundleMcpOnRunEnd: true
			}));
		}
		return;
	} finally {
		await (params.deps?.removeTempDir ?? removeTempPlannerDir)(tempDir);
	}
}
async function createTempPlannerDir() {
	return await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-crestodian-planner-"));
}
async function removeTempPlannerDir(dir) {
	await fs.rm(dir, {
		recursive: true,
		force: true
	});
}
async function loadRunCliAgent() {
	return (await import("./cli-runner-BK2Mhugs.js")).runCliAgent;
}
async function loadRunEmbeddedAgent() {
	return (await import("./embedded-agent-75K82y9l.js")).runEmbeddedAgent;
}
function extractPlannerResultText(result) {
	return result.meta?.finalAssistantVisibleText ?? result.meta?.finalAssistantRawText ?? result.payloads?.map((payload) => payload.text?.trim()).filter(Boolean).join("\n");
}
//#endregion
export { planCrestodianCommand };
