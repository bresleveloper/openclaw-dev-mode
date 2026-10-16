import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolveManifestCommandAliasOwnerInRegistry, r as resolveManifestToolOwnerInRegistry } from "./manifest-command-aliases-Cpq7hdR9.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-C14NFDc3.mjs";
import { c as loadManifestMetadataSnapshot, n as isManifestPluginAvailableForControlPlane, s as loadManifestMetadataRegistry } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { t as hasManifestToolAvailability } from "./manifest-tool-availability-DjZeJiM7.mjs";
//#region src/plugins/manifest-command-aliases.runtime.ts
/** Resolves manifest-declared command and tool ownership at runtime. */
/** Resolves the manifest owner for a CLI command alias when one is declared. */
function resolveManifestCommandAliasOwner(params) {
	const registry = params.registry ?? loadManifestMetadataRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}).manifestRegistry;
	return resolveManifestCommandAliasOwnerInRegistry({
		command: params.command,
		registry
	});
}
/** Resolves the plugin id that should be activated for a CLI command surface. */
function resolveManifestCliCommandSurfaceOwner(params) {
	const normalizedCommand = normalizeOptionalLowercaseString(params.command);
	if (!normalizedCommand) return;
	if (params.registry) return resolveManifestCommandAliasOwnerInRegistry({
		command: normalizedCommand,
		registry: params.registry
	})?.pluginId;
	return resolveManifestActivationPluginIds({
		trigger: {
			kind: "command",
			command: normalizedCommand
		},
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	})[0];
}
/** Applies control-plane availability unless the caller supplies its own registry selection. */
function resolveManifestToolOwner(params) {
	if (params.registry) return resolveManifestToolOwnerInRegistry({
		toolName: params.toolName,
		registry: params.registry
	});
	const normalizedToolName = normalizeOptionalLowercaseString(params.toolName);
	if (!normalizedToolName) return;
	const snapshot = loadManifestMetadataSnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const env = params.env ?? process.env;
	for (const plugin of snapshot.plugins) {
		const tools = plugin.contracts?.tools;
		if (!tools || tools.length === 0) continue;
		const match = tools.find((entry) => normalizeOptionalLowercaseString(entry) === normalizedToolName);
		if (!match) continue;
		if (!isManifestPluginAvailableForControlPlane({
			snapshot,
			plugin,
			config: params.config
		})) continue;
		const toolAvailable = hasManifestToolAvailability({
			plugin,
			toolNames: [match],
			config: params.config,
			env
		});
		return {
			toolName: match,
			pluginId: plugin.id,
			availability: toolAvailable ? "loaded" : "manifest-only"
		};
	}
}
//#endregion
export { resolveManifestCliCommandSurfaceOwner, resolveManifestCommandAliasOwner, resolveManifestToolOwner };
