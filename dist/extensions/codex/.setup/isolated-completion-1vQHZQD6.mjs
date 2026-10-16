import { d as readCodexPluginConfig } from "./config-parsing-BQq-CHTF.mjs";
import { i as resolveCodexAppServerHomeScope } from "./config-options-HG_Rr3W_.mjs";
import "./config-0Gxk3_eq.mjs";
import { nt as resolveCodexAppServerPreparedAuthHandoff } from "./shared-client-r9NcV_GJ.mjs";
import { f as assertCodexPassiveTurnItems } from "./client-BM1XpAkE.mjs";
import { runBoundedCodexAppServerTurn } from "./bounded-turn-DUVJcTLW.mjs";
import { t as resolveCodexBoundedTurnIsolation } from "./bounded-turn-isolation-DklXNk3k.mjs";
import { a as createAttributedCodexAssistantMessage } from "./event-projector-assistant-message-Brq4SDS4.mjs";
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
