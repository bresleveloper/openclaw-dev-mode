import { r as asNullableRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../runtime-doctor-migrations-BuGkvNDu.mjs";
import { i as normalizeHistoricalWebhookConfig, n as legacyConfigRules, r as normalizeCompatibilityConfig, t as historicalWebhookListener } from "../../doctor-contract-DHRfhHp7.mjs";
//#region extensions/telegram/doctor-contract-api.ts
const offsetNamespace = "telegram.update-offsets";
function* legacyOffsets(context) {
	const read = context.readPluginStateEntriesInKeyRange;
	if (!read) throw new Error("Update OpenClaw before inspecting Telegram SQLite offsets, then run openclaw doctor --fix.");
	let after;
	while (true) {
		const rows = read(offsetNamespace, {
			prefix: "",
			after,
			limit: 512
		});
		const legacy = rows.flatMap((entry) => {
			const value = asNullableRecord(entry.value);
			if (!value || value.version !== 1 && value.version !== 2) return [];
			const updateId = value.lastUpdateId;
			if (updateId !== null && !(typeof updateId === "number" && Number.isSafeInteger(updateId) && updateId >= 0) || value.version === 2 && value.botId !== null && typeof value.botId !== "string") throw new Error(`Telegram offset for account "${entry.key}" is malformed; restore its known-good state backup, then run openclaw doctor --fix.`);
			return [{
				entry,
				value: {
					...value,
					version: 3,
					botId: value.version === 1 ? null : value.botId,
					tokenFingerprint: null
				}
			}];
		});
		if (legacy.length) yield legacy;
		const last = rows.at(-1);
		if (rows.length < 512 || !last) return;
		after = last.key;
	}
}
async function loadTelegramIngressSpoolMigration() {
	return (await import("../../telegram-ingress-spool-migration-rN3_m46P.mjs")).telegramIngressSpoolMigration;
}
const stateMigrations = [{
	id: "telegram-update-offsets",
	label: "Telegram SQLite update offsets",
	phase: "after-session-repair",
	collectBackupResources: () => [],
	detectLegacyState({ context }) {
		return legacyOffsets(context).next().done ? null : { preview: ["Normalize Telegram SQLite update offsets before account startup."] };
	},
	async migrateLegacyState({ context }) {
		const result = {
			changes: [],
			warnings: []
		};
		const batches = [...legacyOffsets(context)];
		for (const rows of batches) {
			if (!context.repairPluginStateEntries) throw new Error("Update OpenClaw to repair Telegram SQLite offsets.");
			const repaired = await context.repairPluginStateEntries(offsetNamespace, rows);
			result.changes.push(...repaired.changes, `Normalized ${rows.length} Telegram SQLite update offsets.`);
			result.warnings.push(...repaired.warnings);
		}
		return result;
	}
}, {
	id: "telegram-json-ingress-spool",
	label: "Telegram JSON ingress spool",
	collectBackupResources: async (params) => (await loadTelegramIngressSpoolMigration()).collectBackupResources(params),
	detectLegacyState: async (params) => (await loadTelegramIngressSpoolMigration()).detectLegacyState(params),
	migrateLegacyState: async (params) => (await loadTelegramIngressSpoolMigration()).migrateLegacyState(params)
}];
//#endregion
export { historicalWebhookListener, legacyConfigRules, normalizeCompatibilityConfig, normalizeHistoricalWebhookConfig, stateMigrations };
