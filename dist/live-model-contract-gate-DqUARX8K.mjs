import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { C as supportsClaudeNativeMaxEffort, b as supportsClaudeAdaptiveThinking, w as supportsClaudeNativeXhighEffort } from "./anthropic-D-i5CCnY.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./provider-model-shared-BZZnLgoM.mjs";
//#region extensions/anthropic/live-model-contract-gate.ts
function readCapabilityFlag(root, path) {
	let current = root;
	for (const key of path) {
		if (!isRecord(current)) return;
		current = current[key];
	}
	return typeof current === "boolean" ? current : void 0;
}
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
