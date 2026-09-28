import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { h as resolveConfiguredModelRef, r as buildConfiguredModelCatalog } from "./model-selection-shared-0uvJbX1M.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { t as getChatCommands } from "./commands-registry.data-C5Im7bOZ.mjs";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-dv4qVJuy.mjs";
import { i as resolveTextCommand, r as normalizeCommandBody } from "./commands-registry-normalize-DJeLLZwD.mjs";
import "./commands-text-routing-BAYDrHHM.mjs";
//#region src/auto-reply/commands-registry.ts
/** Command-registry facade for native specs, text aliases, argument parsing, and menus. */
function createNativeCommandNameMapper(provider, options) {
	const resolveNativeCommandName = !provider ? void 0 : (options?.includeBundledChannelFallback === false ? getLoadedChannelPlugin(provider) : getChannelPlugin(provider))?.commands?.resolveNativeCommandName;
	return (command) => {
		return [command.nativeName ? resolveNativeCommandName?.({
			commandKey: command.key,
			defaultName: command.nativeName
		}) ?? command.nativeName : void 0, ...command.nativeAliases ?? []].filter((name) => Boolean(name)).map((name) => ({
			name,
			normalizedName: normalizeOptionalLowercaseString(name)
		}));
	};
}
function supportsNativeProvider(command, provider) {
	if (!command.nativeProviders?.length) return true;
	const normalizedProvider = normalizeOptionalLowercaseString(provider);
	if (!normalizedProvider) return false;
	return command.nativeProviders.some((candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProvider);
}
function listNativeSpecsFromCommands(commands, provider, options) {
	const mapNativeCommandNames = createNativeCommandNameMapper(provider, options);
	return commands.filter((command) => command.scope !== "text" && command.nativeName && supportsNativeProvider(command, provider)).flatMap((command) => {
		return mapNativeCommandNames(command).map(({ name }, index) => {
			const nativeSpec = {
				name,
				description: command.description,
				acceptsArgs: Boolean(command.acceptsArgs)
			};
			if (index > 0) nativeSpec.isAlias = true;
			if (command.args) nativeSpec.args = command.args;
			if (command.descriptionLocalizations) nativeSpec.descriptionLocalizations = command.descriptionLocalizations;
			return nativeSpec;
		});
	});
}
/** Lists native command specs registered for a provider, including skill commands. */
function listNativeCommandSpecs(params) {
	return listNativeSpecsFromCommands(listChatCommands({ skillCommands: params?.skillCommands }), params?.provider, params);
}
/** Lists native command specs that are enabled for the provided config. */
function listNativeCommandSpecsForConfig(cfg, params) {
	return listNativeSpecsFromCommands(listChatCommandsForConfig(cfg, params), params?.provider, params);
}
function mergeNativeCommandSpecs(params) {
	const merged = [];
	const names = /* @__PURE__ */ new Set();
	const append = (spec, reportCollision) => {
		const normalizedName = normalizeOptionalLowercaseString(spec.name);
		if (!normalizedName) return;
		if (names.has(normalizedName)) {
			if (reportCollision) params.onCollision?.(normalizedName);
			return;
		}
		names.add(normalizedName);
		merged.push(spec);
	};
	for (const spec of params.primary) append(spec, false);
	for (const spec of params.secondary) append(spec, true);
	return merged;
}
/** Finds a command definition by provider-native command name or native alias. */
function findCommandByNativeName(name, provider, options) {
	const normalized = normalizeOptionalLowercaseString(name);
	if (!normalized) return;
	const mapNativeCommandNames = createNativeCommandNameMapper(provider, options);
	return getChatCommands().find((command) => command.scope !== "text" && supportsNativeProvider(command, provider) && mapNativeCommandNames(command).some(({ normalizedName }) => normalizedName === normalized));
}
/** Returns true only when the command owner permits handler work beside an active run. */
function isActiveRunSafeCommandTurn(params) {
	const { commandTurn } = params;
	if (commandTurn.kind !== "native" && commandTurn.kind !== "text-slash" || !commandTurn.authorized) return false;
	const command = commandTurn.kind === "native" ? commandTurn.commandName ? findCommandByNativeName(commandTurn.commandName, params.provider, { includeBundledChannelFallback: false }) : void 0 : (resolveTextCommand(commandTurn.body ?? "", params.cfg) ?? (commandTurn.commandName ? resolveTextCommand(`/${commandTurn.commandName}`, params.cfg) : null))?.command;
	return command?.activeRunSafe === true || command?.key === "login" && /^\/login\s+cancel$/iu.test(commandTurn.body?.trim() ?? "");
}
/** Formats a command and optional raw argument string as slash-command text. */
function buildCommandText(commandName, args) {
	const trimmedArgs = args?.trim();
	return trimmedArgs ? `/${commandName} ${trimmedArgs}` : `/${commandName}`;
}
function parsePositionalArgs(definitions, raw) {
	const values = {};
	const trimmed = raw.trim();
	if (!trimmed) return values;
	const tokens = trimmed.split(/\s+/).filter(Boolean);
	let index = 0;
	for (const definition of definitions) {
		if (index >= tokens.length) break;
		if (definition.captureRemaining) {
			values[definition.name] = tokens.slice(index).join(" ");
			break;
		}
		values[definition.name] = expectDefined(tokens[index], "command argument token");
		index += 1;
	}
	return values;
}
function formatPositionalArgs(definitions, values) {
	const parts = [];
	for (const definition of definitions) {
		const value = values[definition.name];
		if (value == null) continue;
		let rendered;
		if (typeof value === "string") rendered = value.trim();
		else rendered = String(value);
		if (!rendered) continue;
		parts.push(rendered);
		if (definition.captureRemaining) break;
	}
	return parts.length > 0 ? parts.join(" ") : void 0;
}
/** Parses raw command arguments according to the command definition. */
function parseCommandArgs(command, raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	if (!command.args || command.argsParsing === "none") return { raw: trimmed };
	return {
		raw: trimmed,
		values: parsePositionalArgs(command.args, trimmed)
	};
}
/** Serializes parsed command arguments back into a raw argument string. */
function serializeCommandArgs(command, args) {
	if (!args) return;
	const raw = args.raw?.trim();
	if (raw) return raw;
	if (!args.values || !command.args) return;
	if (command.formatArgs) return command.formatArgs(args.values);
	return formatPositionalArgs(command.args, args.values);
}
/** Builds slash-command text from a command definition and parsed args. */
function buildCommandTextFromArgs(command, args) {
	return buildCommandText(command.nativeName ?? command.key, serializeCommandArgs(command, args));
}
function resolveDefaultCommandContext(cfg) {
	const resolved = resolveConfiguredModelRef({
		cfg: cfg ?? {},
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	return {
		provider: resolved.provider ?? "openai",
		model: resolved.model ?? "gpt-6-astra"
	};
}
/** Resolves static or context-aware choices for one command argument. */
function resolveCommandArgChoices(params) {
	const { command, arg, cfg } = params;
	if (!arg.choices) return [];
	const provided = arg.choices;
	return (Array.isArray(provided) ? provided : (() => {
		const defaults = resolveDefaultCommandContext(cfg);
		const context = {
			cfg,
			provider: params.provider ?? defaults.provider,
			model: params.model ?? defaults.model,
			agentRuntime: params.agentRuntime,
			catalog: params.catalog ?? (cfg ? buildConfiguredModelCatalog({ cfg }) : void 0),
			command,
			arg
		};
		return provided(context);
	})()).map((choice) => typeof choice === "string" ? {
		value: choice,
		label: choice
	} : choice);
}
/** Argument-only check for whether a command can still offer an argument menu. */
function canResolveCommandArgMenu(params) {
	const { command, args } = params;
	if (!command.args || !command.argsMenu || command.argsParsing === "none") return false;
	if (args?.raw && !args.values) return false;
	return command.argsMenu === "auto" ? command.args.some((arg) => args?.values?.[arg.name] == null) : args?.values?.[command.argsMenu.arg] == null;
}
/** Resolves the next argument menu to show for commands with selectable choices. */
function resolveCommandArgMenu(params) {
	if (!canResolveCommandArgMenu(params)) return null;
	const { command, args, cfg, provider, model, agentRuntime, catalog } = params;
	const resolvedCatalog = catalog ?? (cfg ? buildConfiguredModelCatalog({ cfg }) : void 0);
	const argSpec = command.argsMenu;
	const argName = argSpec === "auto" ? command.args.find((arg) => resolveCommandArgChoices({
		command,
		arg,
		cfg,
		provider,
		model,
		agentRuntime,
		catalog: resolvedCatalog
	}).length > 0)?.name : argSpec.arg;
	if (!argName) return null;
	if (args?.values && args.values[argName] != null) return null;
	const arg = command.args.find((entry) => entry.name === argName);
	if (!arg) return null;
	const choices = resolveCommandArgChoices({
		command,
		arg,
		cfg,
		provider,
		model,
		agentRuntime,
		catalog: resolvedCatalog
	});
	if (choices.length === 0) return null;
	const menu = {
		arg,
		choices,
		title: argSpec !== "auto" ? argSpec.title : void 0
	};
	if (command.key === "verbose" && cfg && params.session) {
		const { agentId, sessionKey } = params.session;
		menu.title = `Current verbose level: ${loadSessionEntryReadOnly({
			agentId,
			storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId }),
			sessionKey
		})?.verboseLevel ?? resolveAgentConfig(cfg, agentId)?.verboseDefault ?? "off"}.\n${formatCommandArgMenuTitle({
			command,
			menu
		})}`;
	}
	return menu;
}
/** Formats the prompt title shown before an argument-choice menu. */
function formatCommandArgMenuTitle(params) {
	const { command, menu } = params;
	if (menu.title) return menu.title;
	const commandLabel = command.nativeName ?? command.key;
	if (typeof menu.arg.choices === "function") {
		const options = menu.choices.map((choice) => choice.label.trim()).filter(Boolean).join(", ");
		if (options.length > 0 && options.length <= 160) return `Choose ${menu.arg.name} for /${commandLabel}.\nOptions: ${options}.`;
		return `Choose ${menu.arg.name} for /${commandLabel}.`;
	}
	return `Choose ${menu.arg.description || menu.arg.name} for /${commandLabel}.`;
}
/** Returns true for normalized slash-command text. */
function isCommandMessage(raw) {
	return normalizeCommandBody(raw).startsWith("/");
}
//#endregion
export { formatCommandArgMenuTitle as a, listNativeCommandSpecs as c, parseCommandArgs as d, resolveCommandArgChoices as f, findCommandByNativeName as i, listNativeCommandSpecsForConfig as l, serializeCommandArgs as m, buildCommandTextFromArgs as n, isActiveRunSafeCommandTurn as o, resolveCommandArgMenu as p, canResolveCommandArgMenu as r, isCommandMessage as s, buildCommandText as t, mergeNativeCommandSpecs as u };
