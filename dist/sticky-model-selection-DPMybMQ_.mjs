import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { b as resolveIsConfigReadOnly, x as resolveIsNixMode } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { w as setAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
//#region src/agents/sticky-model-selection.ts
const log = createSubsystemLogger("agents/sticky-model-selection");
let warnedImmutableConfig = false;
/** Resolve preference only; callers must separately authorize config writes. */
function resolveStickyModelSelectionScope(params) {
	return params.scope ?? params.cfg.agents?.defaults?.modelSelectionScope ?? "session";
}
/** Resolve the exact layer a selection may update before presenting or applying it. */
function resolveStickyModelSelectionPolicy(params) {
	const scope = resolveStickyModelSelectionScope(params);
	return {
		scope,
		target: params.canPersistConfig ? scope : "session"
	};
}
/** Persists a validated model selection at its explicitly requested config layer. */
async function persistStickyModelSelection(params) {
	const model = normalizeOptionalString(params.model);
	if (!model) throw new Error("Sticky model selection must be non-empty.");
	const agentId = normalizeAgentId(params.agentId);
	const committed = await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => setAgentEffectiveModelPrimary(draft, agentId, model, params.target === "effective" ? {} : { target: params.target })
	});
	if (!committed.result) throw new Error("Sticky model config mutation did not return its write target.");
	log.info(`persisted sticky model selection agentId=${agentId} model=${model} target=${committed.result}`);
	return committed.result;
}
/** Starts a best-effort sticky write without delaying or failing the session mutation. */
function persistStickyModelSelectionBestEffort(params) {
	if (resolveIsConfigReadOnly()) {
		if (!warnedImmutableConfig) {
			warnedImmutableConfig = true;
			const reason = resolveIsNixMode() ? "config is immutable in OPENCLAW_NIX_MODE" : "config is externally managed and immutable";
			log.warn(`skipped sticky model persistence agentId=${params.agentId} model=${params.model} reason=${reason}`);
		}
		return "skipped-immutable";
	}
	persistStickyModelSelection(params).catch((error) => {
		log.warn(`failed sticky model persistence agentId=${params.agentId} model=${params.model} reason=${formatErrorMessage(error)}`);
	});
	return "requested";
}
//#endregion
export { resolveStickyModelSelectionPolicy as n, resolveStickyModelSelectionScope as r, persistStickyModelSelectionBestEffort as t };
