//#region src/plugins/bundle-capability-support.ts
function isBundleCapabilitySupported(format, capability) {
	if (capability === "skills" || capability === "mcpServers" || capability === "settings") return true;
	if ((capability === "commands" || capability === "outputStyles" || capability === "lspServers") && (format === "claude" || format === "cursor")) return true;
	if (capability === "agents") return format === "claude";
	return capability === "hooks" && (format === "codex" || format === "claude");
}
//#endregion
export { isBundleCapabilitySupported as t };
