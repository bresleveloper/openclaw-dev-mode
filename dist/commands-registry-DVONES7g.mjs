import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { h as resolveConfiguredModelRef, r as buildConfiguredModelCatalog } from "./model-selection-shared-DKlQ1p0S.mjs";
import "./model-selection-D3_rVb38.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { t as getChatCommands } from "./commands-registry.data-BiPUfkcQ.mjs";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-BBsEgVPc.mjs";
import { r as resolveTextCommand } from "./commands-registry-normalize-D_Y82wvp.mjs";
import "./commands-text-routing-BF0-50wB.mjs";
//#region src/auto-reply/commands-registry.ts
/** Command-registry facade for native specs, text aliases, argument parsing, and menus. */
function createNativeCommandNameMapper(provider, options) {
	const resolveNativeCommandName = !provider ? void 0 : (options?.includeBundledChannelFallback === false ? getLoadedChannelPlugin(provider) : getChannelPlugin(provider))?.commands?.resolveNativeCommandName;
	return (command) => {
		return [command.nativeName ? resolveNativeCommandName?.({
			commandKey: command.key,
			defaultName: command.nativeName
		}) ?? command.nativeName : void 0, ...command.nativeAliases ?? []].filter((name) => Boolean(name));
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
	return commands.filter((command) => command.scope !== "text" && command.nativeName && supportsNativeProvider(command, provider)).flatMap((command) => mapNativeCommandNames(command).map((name, index) => {
		const nativeSpec = {
			name,
			description: command.description,
			acceptsArgs: Boolean(command.acceptsArgs)
		};
		if (index > 0) nativeSpec.isAlias = true;
		if (command.args) nativeSpec.args = command.args;
		if (command.descriptionLocalizations) nativeSpec.descriptionLocalizations = command.descriptionLocalizations;
		return nativeSpec;
	}));
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
	return getChatCommands().find((command) => command.scope !== "text" && supportsNativeProvider(command, provider) && mapNativeCommandNames(command).some((nativeName) => normalizeOptionalLowercaseString(nativeName) === normalized));
}
/** Returns true only when the command owner permits handler work beside an active run. */
function isActiveRunSafeCommandTurn(params) {
	const { commandTurn } = params;
	if (commandTurn.kind !== "native" && commandTurn.kind !== "text-slash" || !commandTurn.authorized) return false;
	const command = commandTurn.kind === "native" ? commandTurn.commandName ? findCommandByNativeName(commandTurn.commandName, params.provider, { includeBundledChannelFallback: false }) : void 0 : (resolveTextCommand(commandTurn.body ?? "", params.cfg) ?? (commandTurn.commandName ? resolveTextCommand(`/${commandTurn.commandName}`, params.cfg) : null))?.command;
	return command?.activeRunSafe === true || command?.key === "login" && /^\/login\s+cancel$/iu.test(commandTurn.body?.trim() ?? "");
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
		const rendered = typeof value === "string" ? value.trim() : String(value);
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
	const commandName = command.nativeName ?? command.key;
	const raw = serializeCommandArgs(command, args)?.trim();
	return raw ? `/${commandName} ${raw}` : `/${commandName}`;
}
/** Resolves static or context-aware choices for one command argument. */
function resolveCommandArgChoices(params) {
	const { arg, cfg } = params;
	let choices = arg.choices;
	if (!choices) return [];
	if (typeof choices === "function") {
		const defaults = resolveConfiguredModelRef({
			cfg: cfg ?? {},
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: DEFAULT_MODEL
		});
		choices = choices({
			cfg,
			command: params.command,
			arg,
			provider: params.provider ?? defaults.provider ?? "openai",
			model: params.model ?? defaults.model ?? "gpt-6-astra",
			agentRuntime: params.agentRuntime,
			catalog: params.catalog ?? (cfg ? buildConfiguredModelCatalog({ cfg }) : void 0)
		});
	}
	return choices.map((choice) => typeof choice === "string" ? {
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
	const resolveChoices = (arg) => resolveCommandArgChoices({
		command,
		arg,
		cfg,
		provider,
		model,
		agentRuntime,
		catalog: resolvedCatalog
	});
	const argSpec = command.argsMenu;
	const argName = argSpec === "auto" ? command.args.find((arg) => resolveChoices(arg).length > 0)?.name : argSpec.arg;
	const arg = command.args.find((entry) => entry.name === argName);
	if (!argName || !arg || args?.values?.[argName] != null) return null;
	const choices = resolveChoices(arg);
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
//#endregion
export { isActiveRunSafeCommandTurn as a, mergeNativeCommandSpecs as c, resolveCommandArgMenu as d, serializeCommandArgs as f, formatCommandArgMenuTitle as i, parseCommandArgs as l, canResolveCommandArgMenu as n, listNativeCommandSpecs as o, supportsNativeProvider as p, findCommandByNativeName as r, listNativeCommandSpecsForConfig as s, buildCommandTextFromArgs as t, resolveCommandArgChoices as u };
