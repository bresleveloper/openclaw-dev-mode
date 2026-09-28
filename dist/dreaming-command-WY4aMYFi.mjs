import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { S as resolveMemoryDreamingConfig } from "./dreaming-Rnb_FGdU.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./memory-core-host-status-CWOM9o6Y.mjs";
//#region extensions/memory-core/src/dreaming-command.ts
function resolveDreamingPluginConfig(cfg) {
	const entry = asNullableRecord(cfg.plugins?.entries?.["memory-core"]);
	return asNullableRecord(entry?.config) ?? {};
}
function updateDreamingEnabledInConfig(cfg, enabled) {
	const entries = { ...cfg.plugins?.entries };
	const existingEntry = asNullableRecord(entries["memory-core"]) ?? {};
	const existingConfig = asNullableRecord(existingEntry.config) ?? {};
	const existingSleep = asNullableRecord(existingConfig.dreaming) ?? {};
	entries["memory-core"] = {
		...existingEntry,
		config: {
			...existingConfig,
			dreaming: {
				...existingSleep,
				enabled
			}
		}
	};
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			entries
		}
	};
}
function formatEnabled(value) {
	return value ? "on" : "off";
}
function formatPhaseGuide() {
	return [
		"- implementation detail: each sweep runs light -> REM -> deep.",
		"- deep is the only stage that writes durable entries to MEMORY.md.",
		"- DREAMS.md is for human-readable dreaming summaries and diary entries."
	].join("\n");
}
function formatStatus(cfg) {
	const pluginConfig = resolveDreamingPluginConfig(cfg);
	const dreaming = resolveMemoryDreamingConfig({
		pluginConfig,
		cfg
	});
	const deep = dreaming.phases.deep;
	const timezone = dreaming.timezone ? ` (${dreaming.timezone})` : "";
	return [
		"Dreaming status:",
		`- enabled: ${formatEnabled(dreaming.enabled)}${timezone}`,
		`- sweep cadence: ${dreaming.frequency}`,
		`- promotion policy: score>=${deep.minScore}, recalls>=${deep.minRecallCount}, uniqueQueries>=${deep.minUniqueQueries}`
	].join("\n");
}
function formatUsage(includeStatus) {
	return [
		"Usage: /dreaming status",
		"Usage: /dreaming on|off",
		"",
		includeStatus,
		"",
		"Phases:",
		formatPhaseGuide()
	].join("\n");
}
function lacksAdminOrOwnerForDreamingMutation(params) {
	if (Array.isArray(params.gatewayClientScopes)) return !params.gatewayClientScopes.includes("operator.admin");
	return params.senderIsOwner !== true;
}
async function handleDreamingCommand(api, ctx) {
	const [firstToken = ""] = (ctx.args?.trim() ?? "").split(/\s+/).filter(Boolean).map((token) => normalizeLowercaseStringOrEmpty(token));
	const currentConfig = ctx.config;
	if (!firstToken || firstToken === "help" || firstToken === "options" || firstToken === "phases") return { text: formatUsage(formatStatus(currentConfig)) };
	if (firstToken === "status") return { text: formatStatus(currentConfig) };
	if (firstToken === "on" || firstToken === "off") {
		if (lacksAdminOrOwnerForDreamingMutation({
			gatewayClientScopes: ctx.gatewayClientScopes,
			senderIsOwner: ctx.senderIsOwner
		})) return { text: "⚠️ /dreaming on|off requires owner status for channel callers or operator.admin for gateway clients." };
		const enabled = firstToken === "on";
		const committed = await api.runtime.config.mutateConfigFile({
			afterWrite: { mode: "auto" },
			writeOptions: { assertCurrent: Array.isArray(ctx.gatewayClientScopes) ? void 0 : ctx.assertOwnerCurrent },
			mutate: (draft) => {
				const nextConfig = updateDreamingEnabledInConfig(draft, enabled);
				Object.assign(draft, nextConfig);
			}
		});
		return { text: [
			`Dreaming ${enabled ? "enabled" : "disabled"}.`,
			"",
			formatStatus(committed.nextConfig)
		].join("\n") };
	}
	return { text: formatUsage(formatStatus(currentConfig)) };
}
//#endregion
export { handleDreamingCommand };
