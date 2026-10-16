import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-C9XqXUw9.mjs";
import { t as formatSelectedEntry } from "./reload-entry-guidance-B9rFRCk8.mjs";
import { n as resolvePluginLifecycleGateway } from "./plugins-lifecycle-client-BZibQSaQ.mjs";
//#region src/cli/plugins-reload-command.ts
async function runPluginsReloadCommand(ids, opts = {}) {
	const pluginIds = [...new Set(ids)];
	const gateway = await resolvePluginLifecycleGateway();
	if (!gateway) throw new Error("The Gateway is not running. Start it before reloading a plugin.");
	const consent = resolvePluginCapabilityConsentCliOptions({
		...opts,
		action: "reload",
		allowPrompt: !opts.json
	});
	const result = await gateway("plugins.reload", {
		plugins: pluginIds.map((pluginId) => ({ pluginId })),
		...opts.wait ? { waitForDrain: true } : {}
	}, consent.onCapabilityConsent);
	if (opts.json) return defaultRuntime.writeJson(result);
	for (const warning of result.warnings ?? []) defaultRuntime.log(theme.warn(warning));
	for (const [id, entry] of Object.entries(result.runtime.selectedEntries ?? {})) defaultRuntime.log(`${id}: ${formatSelectedEntry(entry)}`);
	defaultRuntime.log(`Reloaded ${result.restartRequired ? "registrations for " : ""}${pluginIds.length === 1 ? "plugin" : "plugins"} ${pluginIds.map((id) => `"${id}"`).join(", ")} (generation ${result.runtime.generation}).${result.restartRequired ? " Gateway restart required to load edited code." : ""}`);
}
//#endregion
export { runPluginsReloadCommand };
