import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { S as resolveMemoryDreamingConfig } from "./dreaming-D1wokp9N.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./memory-core-host-status-Dr95_6D1.mjs";
//#region extensions/memory-core/src/dreaming-command.ts
function formatStatus(cfg) {
	const entry = asNullableRecord(cfg.plugins?.entries?.["memory-core"]);
	const dreaming = resolveMemoryDreamingConfig({
		pluginConfig: asNullableRecord(entry?.config) ?? {},
		cfg
	});
	const deep = dreaming.phases.deep;
	const timezone = dreaming.timezone ? ` (${dreaming.timezone})` : "";
	return [
		"Dreaming status:",
		`- enabled: ${dreaming.enabled ? "on" : "off"}${timezone}`,
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
		"- implementation detail: each sweep runs light -> REM -> deep.",
		"- deep is the only stage that writes durable entries to MEMORY.md.",
		"- DREAMS.md is for human-readable dreaming summaries and diary entries."
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
		if (lacksAdminOrOwnerForDreamingMutation(ctx)) return { text: "⚠️ /dreaming on|off requires owner status for channel callers or operator.admin for gateway clients." };
		const enabled = firstToken === "on";
		const committed = await api.runtime.config.mutateConfigFile({
			afterWrite: { mode: "auto" },
			writeOptions: { assertCurrent: Array.isArray(ctx.gatewayClientScopes) ? void 0 : ctx.assertOwnerCurrent },
			mutate: (draft) => {
				const entries = { ...draft.plugins?.entries };
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
				draft.plugins = {
					...draft.plugins,
					entries
				};
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
