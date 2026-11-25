// extensions/copilot/doctor-contract-api.ts
const legacyConfigRules = [];
function normalizeCompatibilityConfig({ cfg }) {
	return {
		config: cfg,
		changes: []
	};
}
export { legacyConfigRules, normalizeCompatibilityConfig };
