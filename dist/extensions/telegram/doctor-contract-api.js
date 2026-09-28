import { t as definePluginDoctorMigrationFromPlans } from "../../doctor-migration-plan-adapter-TVpF1vTR.mjs";
import "../../runtime-doctor-migrations-_pMXigSc.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "../../doctor-contract-DSD3-dEk.mjs";
//#region extensions/telegram/doctor-contract-api.ts
const stateMigrations = [definePluginDoctorMigrationFromPlans({
	id: "telegram-legacy-state",
	label: "Telegram legacy state",
	resolvePlans: async (params) => {
		const { detectTelegramLegacyStateMigrations } = await import("../../state-migrations-hgxXvEus.mjs");
		return detectTelegramLegacyStateMigrations(params);
	}
})];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
