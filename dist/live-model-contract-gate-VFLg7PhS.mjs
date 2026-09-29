import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as supportsClaudeAdaptiveThinking, v as supportsClaudeNativeMaxEffort, y as supportsClaudeNativeXhighEffort } from "./anthropic-Cy4mTngV.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./provider-model-shared-DwrT_ZjA.mjs";
//#region extensions/anthropic/live-model-contract-gate.ts
/**
* Contract gate for live-discovered Anthropic models the manifest does not
* publish. Claude request shaping is selected by model-version predicates, so a
* model those predicates do not recognize is shaped like a pre-4.6 model:
* manual `budget_tokens` thinking plus caller sampling parameters. Current
* Claude models reject both, so surfacing an unrecognized model would offer a
* selectable entry whose every request 400s.
*
* Rather than hand-maintaining a family allowlist that rots on each launch,
* accept a discovered model only when Anthropic's advertised capabilities agree
* with what our contracts would apply. Disagreement means our shaping is stale
* for that model, so it stays hidden until the contracts are updated.
*/
function readCapabilityFlag(root, path) {
	let current = root;
	for (const key of path) {
		if (!isRecord(current)) return;
		current = current[key];
	}
	return typeof current === "boolean" ? current : void 0;
}
/**
* Anthropic publishes a capability tree on `/v1/models`. Each entry pairs a
* capability we can read from that tree with the contract predicate that must
* agree, so a mismatch on any axis rejects the model.
*/
const CLAUDE_CONTRACT_CAPABILITY_CHECKS = [
	{
		path: [
			"thinking",
			"types",
			"adaptive",
			"supported"
		],
		matches: supportsClaudeAdaptiveThinking
	},
	{
		path: [
			"effort",
			"xhigh",
			"supported"
		],
		matches: supportsClaudeNativeXhighEffort
	},
	{
		path: [
			"effort",
			"max",
			"supported"
		],
		matches: supportsClaudeNativeMaxEffort
	}
];
/**
* Return whether a live-discovered Claude model can be shaped by the current
* contracts. Fails closed: a model without a readable capability tree is
* rejected, because we cannot prove our shaping matches it.
*/
function acceptsAnthropicLiveModelContract(params) {
	const capabilities = params.record.capabilities;
	if (!isRecord(capabilities)) return false;
	const ref = { id: params.id };
	return CLAUDE_CONTRACT_CAPABILITY_CHECKS.every((check) => {
		const advertised = readCapabilityFlag(capabilities, check.path);
		return advertised !== void 0 && advertised === check.matches(ref);
	});
}
//#endregion
export { acceptsAnthropicLiveModelContract as t };
