import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/nostr/doctor-contract-api.ts
function retiredNostrStateMigration(namespace, label) {
	const warning = `${label} JSON imports were retired. Upgrade to OpenClaw 2026.9.5 and run openclaw doctor --fix before upgrading to the latest version. Legacy files were left untouched.`;
	const hasLegacyState = async (stateDir) => {
		try {
			return (await fs.readdir(path.join(stateDir, "nostr"))).some((name) => name.startsWith(`${namespace}-`) && name.endsWith(".json"));
		} catch (error) {
			if (extractErrorCode(error) === "ENOENT") return false;
			throw error;
		}
	};
	return {
		id: `nostr-${namespace}-json-to-plugin-state`,
		label,
		collectBackupResources: () => [],
		async detectLegacyState({ stateDir }) {
			return await hasLegacyState(stateDir) ? { preview: [warning] } : null;
		},
		async migrateLegacyState({ stateDir }) {
			return {
				changes: [],
				warnings: await hasLegacyState(stateDir) ? [warning] : []
			};
		}
	};
}
const stateMigrations = [retiredNostrStateMigration("bus-state", "Nostr bus state"), retiredNostrStateMigration("profile-state", "Nostr profile state")];
//#endregion
export { stateMigrations };
