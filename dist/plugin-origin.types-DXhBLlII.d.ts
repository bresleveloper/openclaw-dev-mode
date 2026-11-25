/** Origin class for plugin discovery and runtime trust decisions. */
type PluginOrigin = "bundled" | "global" | "workspace" | "config";
export { PluginOrigin as t };