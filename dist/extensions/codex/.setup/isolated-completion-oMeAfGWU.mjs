import { d as assertCodexPassiveTurnItems } from "./client-C7W0Bk1P.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { i as resolveCodexAppServerHomeScope } from "./config-options-ZyoXdPOW.mjs";
import "./config-B-xRmWRi.mjs";
import { ht as resolveCodexAppServerPreparedAuthHandoff } from "./shared-client-DhJ31S_8.mjs";
import { r as isCodexResponsesOAuth } from "./responses-oauth-Cocl-M9v.mjs";
import { runBoundedCodexAppServerTurn } from "./bounded-turn-DwSU7K39.mjs";
import { t as resolveCodexBoundedTurnIsolation } from "./bounded-turn-isolation-Xouhn-A7.mjs";
import { o as createAttributedCodexAssistantMessage } from "./event-projector-assistant-message-DS4L_1NI.mjs";
// extensions/codex/src/app-server/isolated-completion.ts
/** Runs prompt-only Codex inference on an ephemeral, ring-zero native thread. */
async function runCodexIsolatedCompletion(params, options) {
	params.assertCurrent?.();
	const authorization = params.authorization;
	const pluginConfig = options.pluginConfig ?? {};
	const homeScope = resolveCodexAppServerHomeScope({ appServer: pluginConfig.appServer });
	let preparedAuth;
	let profile;
	let baseUrl;
	let authRequirement;
	let modelId = params.modelId;
	if (authorization.owner === "host") {
		const { model, auth } = authorization;
		if (model.api !== "openai-responses" || auth.mode !== "api-key" || !auth.apiKey) throw new Error("Codex native isolated completion requires prepared Responses API-key auth or a harness-owned OAuth profile.");
		if (Object.keys(model.headers ?? {}).length > 0) throw new Error("Codex native isolated completion cannot preserve prepared custom headers.");
		baseUrl = model.baseUrl;
		if (!baseUrl) throw new Error("Codex native isolated completion requires its prepared Responses endpoint.");
		modelId = model.id;
		authRequirement = "api-key";
		preparedAuth = {
			kind: "api-key",
			apiKey: auth.apiKey
		};
	} else {
		authRequirement = authorization.plan.modelRoute?.authRequirement;
		const handoff = await resolveCodexAppServerPreparedAuthHandoff({
			authRequirement,
			authProfileId: authorization.plan.forwardedAuthProfileId,
			authProfileStore: authorization.authProfileStore,
			agentDir: params.agentDir,
			homeScope,
			config: params.config,
			subscriptionProfileRequiredError: "Prepared Codex subscription route requires a scoped native OAuth or token profile.",
			subscriptionProfileUnusableError: `Prepared Codex auth profile "${authorization.plan.forwardedAuthProfileId}" is unusable.`
		});
		preparedAuth = handoff.preparedAuth;
		profile = preparedAuth ? void 0 : handoff.authProfileId;
		if (homeScope === "agent") baseUrl = authorization.plan.modelRoute?.baseUrl;
	}
	params.assertCurrent?.();
	const outputSchema = isJsonObject(params.outputSchema) ? params.outputSchema : void 0;
	const hasStreamParams = params.streamParams?.maxTokens !== void 0 || params.streamParams?.temperature !== void 0;
	if (hasStreamParams && isCodexResponsesOAuth(preparedAuth)) throw new Error("ChatGPT token sharing does not support explicit token or temperature limits; select an API-key model.");
	const isolation = resolveCodexBoundedTurnIsolation(options);
	if (authRequirement === "api-key" && !baseUrl) throw new Error("Codex native isolated completion requires its prepared Responses endpoint.");
	if (authRequirement === "api-key" && isolation !== "private-stdio") throw new Error("Prepared Codex API routes require a private stdio app-server; no direct fallback was attempted.");
	const result = await runBoundedCodexAppServerTurn({
		config: params.config,
		model: {
			mode: "required",
			id: modelId
		},
		...preparedAuth ? { preparedAuth } : { profile },
		...baseUrl ? {
			modelProvider: "openai",
			threadConfig: { openai_base_url: baseUrl }
		} : {},
		authRequirement,
		requireInferenceRoute: authRequirement === "api-key" || hasStreamParams,
		timeoutMs: params.timeoutMs,
		thinkLevel: params.thinkLevel,
		streamParams: params.streamParams,
		signal: params.abortSignal,
		assertCurrent: params.assertCurrent,
		agentDir: params.agentDir,
		authProfileStore: authorization.owner === "harness" ? authorization.authProfileStore : void 0,
		options,
		taskLabel: "isolated completion",
		developerInstructions: params.systemPrompt,
		input: [{
			type: "text",
			text: params.prompt,
			text_elements: []
		}],
		...outputSchema ? { outputSchema } : {},
		requiredModalities: ["text"],
		isolation,
		requireNoExternalCapabilities: true,
		allowEmptyText: params.outputTextPolicy === "strict-visible"
	});
	params.assertCurrent?.();
	assertCodexPassiveTurnItems(result.items, result.submittedInput, "isolated completion", { allowManagedHookPrompts: result.managedHooksEnabled });
	return { assistant: createAttributedCodexAssistantMessage({
		api: authRequirement === "api-key" ? "openai-responses" : "openai-chatgpt-responses",
		provider: params.provider,
		modelId: result.model
	}, result.text, {
		tokenUsage: result.usage,
		aborted: false,
		promptError: null
	}) };
}
export { runCodexIsolatedCompletion };
