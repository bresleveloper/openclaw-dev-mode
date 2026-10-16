import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { m as wrapCurrentPluginInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { _ as requireActivePluginChannelRegistry, p as getPluginRegistrationContext, s as getActivePluginChannelRegistry } from "./runtime-D4MkflNJ.mjs";
//#region src/plugins/session-discussion-registry.ts
const log = createSubsystemLogger("plugins/session-discussion");
function registerSessionDiscussionProvider(provider) {
	const context = getPluginRegistrationContext();
	const registry = context?.registry ?? requireActivePluginChannelRegistry();
	const pluginId = context?.pluginId ?? provider.id;
	const existing = registry.sessionDiscussionProviders.get(pluginId);
	if (existing) log.warn(`replacing session discussion provider ${existing.provider.id} with ${provider.id}`);
	else {
		const selected = registry.sessionDiscussionProviders.values().next().value;
		if (selected) log.warn(`session discussion provider ${provider.id} registered alongside ${selected.provider.id}; retaining ${selected.provider.id} as the default`);
	}
	registry.sessionDiscussionProviders.set(pluginId, {
		pluginId,
		provider: wrapCurrentPluginInstance(provider)
	});
}
function getSessionDiscussionProvider() {
	return getActivePluginChannelRegistry()?.sessionDiscussionProviders.values().next().value?.provider;
}
//#endregion
export { registerSessionDiscussionProvider as n, getSessionDiscussionProvider as t };
