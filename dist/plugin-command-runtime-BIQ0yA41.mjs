import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { x as redactToolPayloadTextWithConfig } from "./redact-DJ8j6ADa.mjs";
import { n as resolveManifestCommandAliasOwnerInRegistry } from "./manifest-command-aliases-Cpq7hdR9.mjs";
import { b as isPluginRegistryRetired } from "./registry-lifecycle-CnhlPo20.mjs";
import { n as resolveSelectedPluginCommandRegistry, t as listRegisteredPluginCommands } from "./plugin-command-registry-DJl3dxiE.mjs";
import { n as projectPluginCommandNativeMetadata, t as pluginCommandSupportsChannel } from "./plugin-command-metadata-BOq2c1ES.mjs";
import { n as parsePluginInvocation, t as matchRegisteredPluginCommand } from "./plugin-command-matcher-BAtE_6-D.mjs";
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
function createSelectedPluginCommandDispatch(state, selection, channel) {
	const dispatch = Object.freeze({
		kind: "plugin",
		async execute(context) {
			if (this !== dispatch) return { ...INVALID_SELECTION_REPLY };
			return await executePluginCommandDispatch(dispatch, context);
		}
	});
	dispatchSelections.set(dispatch, {
		registry: state.registry,
		selection,
		channel: normalizeOptionalLowercaseString(channel) ?? ""
	});
	return dispatch;
}
/** Validates and executes a dispatch carried through the core reply pipeline. */
async function executePluginCommandDispatch(dispatch, context) {
	const input = { ...context };
	const selected = dispatchSelections.get(dispatch);
	if (!selected) return { ...INVALID_SELECTION_REPLY };
	if (isPluginRegistryRetired(selected.registry)) return { ...RETIRED_SELECTION_REPLY };
	const channel = normalizeOptionalLowercaseString(input.channel) ?? "";
	if (selected.channel !== channel) return { ...INVALID_SELECTION_REPLY };
	const { selection } = selected;
	if (selection.availability === "manifest-only") {
		if (!input.isAuthorizedSender) return { text: "⚠️ This command requires authorization." };
		const reason = truncateUtf16Safe(redactToolPayloadTextWithConfig(selection.plugin.error?.split(/[\r\n]/, 1)[0]?.trim() || "reason not recorded", input.config.logging), 240);
		return { text: `⚠️ Plugin "${selection.plugin.id}" failed to load: ${reason}. Run \`openclaw doctor\` and check the gateway logs.` };
	}
	const { executeRegisteredPluginCommand } = await import("./plugin-command-execution-8W9nKd-N.mjs");
	if (isPluginRegistryRetired(selected.registry)) return { ...RETIRED_SELECTION_REPLY };
	return await executeRegisteredPluginCommand(selected.registry, {
		...input,
		args: selection.args,
		command: selection.command
	});
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
						return createSelectedPluginCommandDispatch(state, {
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
			dispatch: createSelectedPluginCommandDispatch(state, {
				availability: "manifest-only",
				plugin
			}, channel),
			acceptsArgs: true,
			requireAuth: true
		});
	}
	const metadata = projectPluginCommandNativeMetadata(match.command, provider);
	return Object.freeze({
		dispatch: createSelectedPluginCommandDispatch(state, {
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
