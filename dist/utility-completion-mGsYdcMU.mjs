import { i as resolveSimpleCompletionSelectionForAgent } from "./simple-completion-runtime-B7YSNxmE.mjs";
//#region src/agents/utility-completion.ts
/** Keep visible-text retry/fallback in callers; the runtime owns authentication. */
async function prepareUtilityCompletionForAgent(params) {
	const selection = resolveSimpleCompletionSelectionForAgent(params);
	if (!selection) throw new Error(`No utility model configured for agent ${params.agentId}.`);
	return {
		config: params.cfg,
		provider: selection.provider,
		model: selection.modelId,
		authProfileId: selection.profileId ?? params.preferredProfile,
		outputTextPolicy: "strict-visible",
		agentId: params.agentId,
		agentDir: selection.agentDir
	};
}
//#endregion
export { prepareUtilityCompletionForAgent as t };
