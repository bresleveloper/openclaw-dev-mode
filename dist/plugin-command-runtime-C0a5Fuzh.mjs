import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { x as redactToolPayloadTextWithConfig } from "./redact-B5EGyLvV.mjs";
import { n as resolveManifestCommandAliasOwnerInRegistry } from "./manifest-command-aliases-Cfg0xASJ.mjs";
import { h as isPluginRegistryRetired } from "./registry-lifecycle-xdpzLZzd.mjs";
import { n as resolveSelectedPluginCommandRegistry, t as listRegisteredPluginCommands } from "./plugin-command-registry-3YOixkIa.mjs";
import { n as projectPluginCommandNativeMetadata, t as pluginCommandSupportsChannel } from "./plugin-command-metadata-DBJKw3Pr.mjs";
import { n as parsePluginInvocation, t as matchRegisteredPluginCommand } from "./plugin-command-matcher-i3F4y8pY.mjs";
//#region src/plugins/plugin-command-dispatch-contract.ts
/** Lightweight reply-option contract for prepared plugin command ownership. */
const PLUGIN_COMMAND_DISPATCH = Symbol.for("openclaw.pluginCommandDispatch");
//#endregion
//#region src/plugins/plugin-command-runtime.ts
/** Registry-bound plugin command selection and execution for native/channel surfaces. */
const dispatchSelections = /* @__PURE__ */ new WeakMap();
const runtimeStates = /* @__PURE__ */ new WeakMap();
const INVALID_SELECTION_REPLY = { text: "⚠️ This command selection is no longer valid. Please try again." };
const RETIRED_SELECTION_REPLY = { text: "⚠️ This command is no longer available after the plugin registry changed. Please try again." };
function createSelectedPluginCommandDispatch(runtime, state, selection, channel) {
	const dispatch = Object.freeze({
		kind: "plugin",
		async execute(context) {
			if (this !== dispatch) return { ...INVALID_SELECTION_REPLY };
			return await executeSelectedPluginCommand(runtime, dispatch, context);
		}
	});
	dispatchSelections.set(dispatch, {
		runtime,
		registry: state.registry,
		selection,
		channel: normalizeOptionalLowercaseString(channel) ?? ""
	});
	return dispatch;
}
async function executeSelectedPluginCommand(runtime, dispatch, input) {
	const context = { ...input };
	const selected = dispatchSelections.get(dispatch);
	if (!selected || runtime && selected.runtime !== runtime) return { ...INVALID_SELECTION_REPLY };
	if (isPluginRegistryRetired(selected.registry)) return { ...RETIRED_SELECTION_REPLY };
	const channel = normalizeOptionalLowercaseString(context.channel) ?? "";
	if (selected.channel !== channel) return { ...INVALID_SELECTION_REPLY };
	const { selection } = selected;
	if (selection.availability === "manifest-only") {
		if (!context.isAuthorizedSender) return { text: "⚠️ This command requires authorization." };
		const reason = truncateUtf16Safe(redactToolPayloadTextWithConfig(selection.plugin.error?.split(/[\r\n]/, 1)[0]?.trim() || "reason not recorded", context.config.logging), 240);
		return { text: `⚠️ Plugin "${selection.plugin.id}" failed to load: ${reason}. Run \`openclaw doctor\` and check the gateway logs.` };
	}
	const { executeRegisteredPluginCommand } = await import("./plugin-command-execution-CfEiko-r.mjs");
	if (isPluginRegistryRetired(selected.registry)) return { ...RETIRED_SELECTION_REPLY };
	return await executeRegisteredPluginCommand(selected.registry, {
		...context,
		args: selection.args,
		command: selection.command
	});
}
/** Validates and executes a dispatch carried through the core reply pipeline. */
async function executePluginCommandDispatch(dispatch, context) {
	return await executeSelectedPluginCommand(void 0, dispatch, context);
}
/** Creates one command runtime bound permanently to the current scoped registry generation. */
function createPluginCommandRuntime() {
	const registry = resolveSelectedPluginCommandRegistry();
	if (!registry) throw new Error("Plugin command runtime requires an active or request-scoped registry.");
	const state = Object.freeze({
		registry,
		commands: Object.freeze(listRegisteredPluginCommands(registry))
	});
	const assertCurrent = () => {
		if (isPluginRegistryRetired(state.registry)) throw new Error("Plugin command runtime is bound to a retired registry generation.");
	};
	const runtime = Object.freeze({
		listNativeCandidates(provider) {
			assertCurrent();
			const channel = normalizeOptionalLowercaseString(provider) ?? "";
			return Object.freeze(state.commands.filter((command) => pluginCommandSupportsChannel(command, channel)).map((command) => {
				const metadata = projectPluginCommandNativeMetadata(command, channel);
				return Object.freeze({
					...metadata,
					prepareDispatch(rawArgs) {
						const args = rawArgs?.trim();
						if (args && !command.acceptsArgs) return Object.freeze({ kind: "non-plugin" });
						return createSelectedPluginCommandDispatch(runtime, state, {
							availability: "loaded",
							command,
							args
						}, channel);
					}
				});
			}));
		},
		retainNativeCatalog: assertCurrent
	});
	runtimeStates.set(runtime, state);
	return runtime;
}
/** Core-only text matcher that returns a dispatch from the same bound runtime. */
function matchPluginCommandInvocation(runtime, commandBody, options) {
	const state = runtimeStates.get(runtime);
	if (!state) return null;
	if (isPluginRegistryRetired(state.registry)) throw new Error("Plugin command runtime is bound to a retired registry generation.");
	const channel = normalizeOptionalLowercaseString(options.channel) ?? "";
	const provider = normalizeOptionalLowercaseString(options.provider) ?? channel;
	const match = matchRegisteredPluginCommand({
		commands: state.commands,
		commandBody,
		channel,
		aliasScope: {
			kind: "provider",
			provider
		}
	});
	if (!match) {
		const owner = parsePluginInvocation(commandBody)?.keys.map((key) => resolveManifestCommandAliasOwnerInRegistry({
			command: key.slice(1),
			registry: state.registry
		})).find((candidate) => candidate !== void 0);
		const plugin = owner?.kind === "runtime-slash" ? state.registry.plugins.find((entry) => entry.id === owner.pluginId) : void 0;
		if (plugin?.status !== "error" || !plugin.enabled) return null;
		return Object.freeze({
			dispatch: createSelectedPluginCommandDispatch(runtime, state, {
				availability: "manifest-only",
				plugin
			}, channel),
			acceptsArgs: true,
			requireAuth: true
		});
	}
	const metadata = projectPluginCommandNativeMetadata(match.command, provider);
	return Object.freeze({
		dispatch: createSelectedPluginCommandDispatch(runtime, state, {
			availability: "loaded",
			command: match.command,
			args: match.args
		}, channel),
		acceptsArgs: metadata.acceptsArgs,
		requireAuth: metadata.requireAuth,
		...metadata.progressMessage ? { progressMessage: metadata.progressMessage } : {}
	});
}
//#endregion
export { PLUGIN_COMMAND_DISPATCH as i, executePluginCommandDispatch as n, matchPluginCommandInvocation as r, createPluginCommandRuntime as t };
