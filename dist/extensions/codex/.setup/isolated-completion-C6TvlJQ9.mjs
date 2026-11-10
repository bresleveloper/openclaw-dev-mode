import { d as readCodexPluginConfig } from "./config-parsing-DsWSCPHO.mjs";
import { i as resolveCodexAppServerHomeScope } from "./config-options-l737cwJB.mjs";
import "./config-DEC5R1wk.mjs";
import { it as resolveCodexAppServerPreparedAuthHandoff } from "./shared-client-BEHXwqz5.mjs";
import { d as assertCodexPassiveTurnItems } from "./client-CKexde4_.mjs";
import { runBoundedCodexAppServerTurn } from "./bounded-turn-0Siz1u82.mjs";
import { t as resolveCodexBoundedTurnIsolation } from "./bounded-turn-isolation-XNNo50Sy.mjs";
import { a as createAttributedCodexAssistantMessage } from "./event-projector-assistant-message-ChOAY7rW.mjs";
//#region extensions/codex/src/app-server/isolated-completion.ts
/** Runs prompt-only Codex inference on an ephemeral, ring-zero native thread. */
async function runCodexIsolatedCompletion(params, options) {
	params.assertCurrent?.();
	const authorization = params.authorization;
	if (authorization.owner !== "harness") throw new Error("Codex native isolated completion requires harness-owned authorization.");
	const pluginConfig = readCodexPluginConfig(options.pluginConfig);
	const homeScope = resolveCodexAppServerHomeScope({ appServer: pluginConfig.appServer });
	const authRequirement = authorization.plan.modelRoute?.authRequirement;
	const authHandoff = await resolveCodexAppServerPreparedAuthHandoff({
		authRequirement,
		authProfileId: authorization.plan.forwardedAuthProfileId,
		authProfileStore: authorization.authProfileStore,
		agentDir: params.agentDir,
		homeScope,
		config: params.config,
		subscriptionProfileRequiredError: "Prepared Codex subscription route requires a scoped native OAuth or token profile.",
		subscriptionProfileUnusableError: `Prepared Codex auth profile "${authorization.plan.forwardedAuthProfileId}" is unusable.`
	});
	params.assertCurrent?.();
	const authSelection = authHandoff.preparedAuth ? { preparedAuth: authHandoff.preparedAuth } : { profile: authHandoff.authProfileId };
	const result = await runBoundedCodexAppServerTurn({
		config: params.config,
		model: {
			mode: "required",
			id: params.modelId
		},
		...authSelection,
		authRequirement,
		timeoutMs: params.timeoutMs,
		thinkLevel: params.thinkLevel,
		signal: params.abortSignal,
		assertCurrent: params.assertCurrent,
		agentDir: params.agentDir,
		authProfileStore: authorization.authProfileStore,
		options,
		taskLabel: "isolated completion",
		developerInstructions: params.systemPrompt,
		input: [{
			type: "text",
			text: params.prompt,
			text_elements: []
		}],
		requiredModalities: ["text"],
		isolation: resolveCodexBoundedTurnIsolation(options),
		requireNoExternalCapabilities: true,
		allowEmptyText: params.outputTextPolicy === "strict-visible"
	});
	params.assertCurrent?.();
	assertCodexPassiveTurnItems(result.items, params.prompt, "isolated completion", { allowManagedHookPrompts: result.managedHooksEnabled });
	return { assistant: createAttributedCodexAssistantMessage({
		api: "openai-chatgpt-responses",
		provider: params.provider,
		modelId: result.model
	}, result.text, {
		tokenUsage: result.usage,
		aborted: false,
		promptError: null
	}) };
}
//#endregion
export { runCodexIsolatedCompletion };
