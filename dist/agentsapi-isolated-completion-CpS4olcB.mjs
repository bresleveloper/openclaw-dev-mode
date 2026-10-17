import { u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import "./agent-harness-runtime-C7pYQoeO.mjs";
import { n as createAgentHarnessAssistantMessage } from "./agent-harness-attempt-runtime-CuLbs8yz.mjs";
import { t as AgentsApiClient } from "./agentsapi-client-BrHNqiHF.mjs";
import { t as readAgentsApiFinalText } from "./agentsapi-text-6tGD83zZ.mjs";
import { t as aggregateAgentsApiUsage } from "./agentsapi-usage-C2BXnbjE.mjs";
import { t as resolveAgentsApiReasoningEffort } from "./agentsapi-reasoning-Vt0C6-qq.mjs";
import { t as createAgentsApiSession } from "./agentsapi-session-BAGkoMuZ.mjs";
//#region extensions/agentsapi/agentsapi-isolated-completion.ts
/** Fresh native inference without an executor, supplied functions, or attached credentials. */
async function runAgentsApiIsolatedCompletion(params, assertHarnessCurrent) {
	assertHarnessCurrent();
	params.assertCurrent?.();
	const authorization = params.authorization;
	const apiKey = authorization.owner === "host" ? authorization.auth.apiKey : void 0;
	if (authorization.owner !== "host" || authorization.auth.mode !== "api-key" || !apiKey) throw new Error("Agents API isolated completion requires the host-prepared API key");
	const { model } = authorization;
	if (params.provider !== "openai" || model.provider !== "openai" || model.api !== "openai-responses" || model.baseUrl !== "https://api.openai.com/v1" || Object.keys(model.headers ?? {}).length > 0) throw new Error("Agents API isolated completion requires the official OpenAI API-key route");
	const timeout = AbortSignal.timeout(params.timeoutMs);
	const signal = params.abortSignal ? AbortSignal.any([params.abortSignal, timeout]) : timeout;
	const assertCurrent = () => {
		assertHarnessCurrent();
		params.assertCurrent?.();
		signal.throwIfAborted();
	};
	const client = new AgentsApiClient(apiKey, assertCurrent);
	const cleanupClient = new AgentsApiClient(apiKey, assertHarnessCurrent);
	const creationClient = new AgentsApiClient(apiKey, assertHarnessCurrent, assertCurrent);
	let sessionId;
	let native;
	try {
		assertCurrent();
		const session = await creationClient.createIsolated(AbortSignal.any([timeout, AbortSignal.timeout(6e4)]), params.systemPrompt, params.prompt, model.id, params.thinkLevel === void 0 ? {} : { effort: resolveAgentsApiReasoningEffort({
			model,
			thinkLevel: params.thinkLevel
		}) });
		sessionId = session.id;
		native = createAgentsApiSession({
			client,
			cleanupClient,
			sessionId,
			signal,
			assertCurrent,
			initialInputSubmitted: true,
			onEvent: (event) => {
				if (event.item) assertRestrictedItem(event.item);
			}
		});
		assertCurrent();
		if (session.environment.type !== "none" || session.agent.tools.some((tool) => tool.type !== "programmatic_tool_calling") || session.agent.multi_agent.enabled) throw new Error("Agents API did not create the requested restricted completion session");
		const result = await native.run(params.prompt, async () => {}, () => {});
		assertCurrent();
		if (result.cancelled) throw new Error("Agents API isolated completion was cancelled");
		const items = await client.items(sessionId, result.turn.id, signal);
		for (const item of items) assertRestrictedItem(item);
		const inputs = items.filter((item) => item.type === "message" && item.role === "user");
		if (inputs.length !== 1 || inputs[0]?.content?.length !== 1 || inputs[0].content[0]?.text !== params.prompt) throw new Error("Agents API isolated completion returned unexpected input");
		const turns = await native.readUsageTurns();
		assertCurrent();
		const { usage, assistantUsage } = aggregateAgentsApiUsage(model, turns.flatMap((turn) => {
			const normalized = normalizeUsage(turn.usage);
			return normalized ? [normalized] : [];
		}));
		const assistant = createAgentHarnessAssistantMessage({
			api: "openai-agents",
			provider: params.provider,
			modelId: model.id
		}, readAgentsApiFinalText(params.outputTextPolicy === "strict-visible" ? items.filter((item) => item.phase === "final_answer") : items), {
			tokenUsage: usage,
			aborted: false
		});
		assistant.usage = assistantUsage;
		return { assistant };
	} finally {
		try {
			await native?.close();
		} finally {
			if (sessionId && (!native || !native.wasSubmitted() || native.isSettled())) await cleanupClient.deleteSession(sessionId, AbortSignal.timeout(3e4));
		}
	}
}
function assertRestrictedItem(item) {
	if (item.type === "reasoning") return;
	if (item.type === "message" && (item.role === "user" || item.role === "assistant")) return;
	throw new Error(`Agents API isolated completion returned unexpected native item: ${item.type}`);
}
//#endregion
export { runAgentsApiIsolatedCompletion as t };
