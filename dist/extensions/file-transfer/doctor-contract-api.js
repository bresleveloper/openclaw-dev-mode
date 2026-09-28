import { r as asNullableRecord } from "../../record-coerce-DItp3I4t.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/file-transfer/doctor-contract-api.ts
function hasLegacyPositivePolicy(value) {
	const config = asNullableRecord(value);
	if (!config || config.policyVersion === 2) return false;
	const nodes = asNullableRecord(config.nodes);
	if (!nodes) return false;
	return Object.values(nodes).some((rawNode) => {
		const node = asNullableRecord(rawNode);
		return Boolean(node && (Array.isArray(node.allowReadPaths) && node.allowReadPaths.length > 0 || Array.isArray(node.allowWritePaths) && node.allowWritePaths.length > 0));
	});
}
const legacyConfigRules = [{
	path: [
		"plugins",
		"entries",
		"file-transfer",
		"config"
	],
	message: "File-transfer permissions need review and remain inactive. Run \"openclaw file-transfer approvals migrate\".",
	match: hasLegacyPositivePolicy
}];
//#endregion
export { legacyConfigRules };
