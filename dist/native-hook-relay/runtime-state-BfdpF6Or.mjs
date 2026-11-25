//!src/plugins/runtime-state-key.ts
const PLUGIN_REGISTRY_STATE=Symbol.for(`openclaw.pluginRegistryState`);
//!src/plugins/runtime-state.ts
function getPluginRegistryState(){return globalThis[PLUGIN_REGISTRY_STATE]}export{getPluginRegistryState as t};