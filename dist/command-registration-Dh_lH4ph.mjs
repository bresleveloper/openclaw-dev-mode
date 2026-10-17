import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { m as wrapCurrentPluginInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { et as getPluginCommandExecutionCount, p as getPluginRegistrationContext, v as requireActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { f as isOperatorScope } from "./operator-scopes-DsrPoRc4.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { n as normalizeAgentPromptSurfaceKind } from "./agent-prompt-surface-kind-BvH6Xj9U.mjs";
import "./command-registry-state-BssLGv4I.mjs";
//#region src/plugins/plugin-command.types.ts
const AGENT_PROMPT_SURFACE_KINDS = [
	"openclaw_main",
	"pi_main",
	"codex_app_server",
	"cli_backend",
	"acp_backend",
	"subagent"
];
//#endregion
//#region src/plugins/command-registration.ts
/**
* Reserved command names that plugins cannot override (built-in commands).
*
* Constructed lazily inside validateCommandName to avoid TDZ errors: the
* bundler can place this module's body after call sites within the same
* output chunk, so any module-level const/let would be uninitialized when
* first accessed during plugin registration.
*/
let reservedCommands;
let agentPromptSurfaces;
function hasExactKeys(value, keys) {
	const actual = Object.keys(value);
	return actual.length === keys.length && actual.every((key) => keys.includes(key));
}
function validateNonemptyString(value, label) {
	if (typeof value !== "string") return `${label} must be a string`;
	return value.trim() ? null : `${label} cannot be empty`;
}
function getReservedCommands() {
	reservedCommands ??= /* @__PURE__ */ new Set([
		"help",
		"commands",
		"status",
		"diagnostics",
		"codex",
		"whoami",
		"context",
		"btw",
		"stop",
		"restart",
		"reset",
		"new",
		"compact",
		"config",
		"debug",
		"allowlist",
		"activation",
		"skill",
		"learn",
		"loop",
		"subagents",
		"kill",
		"steer",
		"tell",
		"model",
		"models",
		"queue",
		"send",
		"bash",
		"exec",
		"think",
		"verbose",
		"reasoning",
		"elevated",
		"usage"
	]);
	return reservedCommands;
}
function isReservedCommandName(name) {
	const trimmed = normalizeOptionalLowercaseString(name) ?? "";
	return Boolean(trimmed && getReservedCommands().has(trimmed));
}
function validateCommandName(name, opts) {
	const trimmed = normalizeOptionalLowercaseString(name) ?? "";
	if (!trimmed) return "Command name cannot be empty";
	if (!/^[a-z][a-z0-9_-]*$/.test(trimmed)) return "Command name must start with a letter and contain only letters, numbers, hyphens, and underscores";
	if (!opts?.allowReservedCommandNames && getReservedCommands().has(trimmed)) return `Command name "${trimmed}" is reserved by a built-in command`;
	return null;
}
function validatePluginCommandDefinition(command, opts) {
	if (typeof command.handler !== "function") return "Command handler must be a function";
	if (typeof command.name !== "string") return "Command name must be a string";
	const descriptionError = validateNonemptyString(command.description, "Command description");
	if (descriptionError) return descriptionError;
	if (command.agentPromptGuidance !== void 0 && !Array.isArray(command.agentPromptGuidance)) return "Agent prompt guidance must be an array of strings or objects";
	for (const [index, guidance] of (command.agentPromptGuidance ?? []).entries()) {
		const guidanceError = validateAgentPromptGuidance(index, guidance);
		if (guidanceError) return guidanceError;
	}
	if (command.requiredScopes !== void 0) {
		if (!Array.isArray(command.requiredScopes)) return "Command requiredScopes must be an array of operator scopes";
		const unknownScopeIndex = command.requiredScopes.findIndex((scope) => !isOperatorScope(scope));
		if (unknownScopeIndex !== -1) {
			const unknownScope = command.requiredScopes[unknownScopeIndex];
			return typeof unknownScope === "string" ? `Command requiredScopes contains unknown operator scope: ${unknownScope}` : "Command requiredScopes contains unknown operator scope";
		}
	}
	if (command.clientPresentation !== void 0) {
		if (!isRecord(command.clientPresentation)) return "Command clientPresentation must be an object";
		if (!hasExactKeys(command.clientPresentation, ["when", "action"])) return "Command clientPresentation must contain only when and action";
		if (command.clientPresentation.when !== "no-arguments") return "Command clientPresentation when must be \"no-arguments\"";
		if (!isRecord(command.clientPresentation.action)) return "Command clientPresentation action must be an object";
		if (!hasExactKeys(command.clientPresentation.action, ["kind"])) return "Command clientPresentation action must contain only kind";
		if (command.clientPresentation.action.kind !== "device-pairing") return "Command clientPresentation action kind is not supported";
	}
	if (command.exposeSenderIsOwner !== void 0 && typeof command.exposeSenderIsOwner !== "boolean") return "Command exposeSenderIsOwner must be a boolean";
	if (command.channels !== void 0) {
		if (!Array.isArray(command.channels)) return "Command channels must be an array of channel ids";
		for (const [index, channel] of command.channels.entries()) {
			const error = validateNonemptyString(channel, `Command channel ${index + 1}`);
			if (error) return error;
		}
	}
	const nameError = validateCommandName(command.name.trim(), opts);
	if (nameError) return nameError;
	if (command.nativeNames !== void 0 && !isRecord(command.nativeNames)) return "Command nativeNames must be an object";
	for (const [label, alias] of Object.entries(command.nativeNames ?? {})) {
		if (typeof alias !== "string") continue;
		const aliasError = validateCommandName(alias.trim());
		if (aliasError) return `Native command alias "${label}" invalid: ${aliasError}`;
	}
	for (const [property, label] of [["nativeProgressMessages", "Native progress message"], ["descriptionLocalizations", "Description localization"]]) {
		const values = command[property];
		if (values !== void 0 && !isRecord(values)) return `Command ${property} must be an object`;
		for (const [key, value] of Object.entries(values ?? {})) {
			const error = validateNonemptyString(value, `${label} "${key}"`);
			if (error) return error;
		}
	}
	return null;
}
function validateAgentPromptGuidance(index, guidance) {
	const label = `Agent prompt guidance ${index + 1}`;
	if (typeof guidance === "string") return guidance.trim() ? null : `${label} cannot be empty`;
	if (!isRecord(guidance)) return `${label} must be a string or object`;
	const textError = validateNonemptyString(guidance.text, `${label} text`);
	if (textError) return textError;
	if (guidance.surfaces === void 0) return null;
	if (!Array.isArray(guidance.surfaces)) return `${label} surfaces must be an array of prompt surface ids`;
	if (guidance.surfaces.length === 0) return `${label} surfaces cannot be empty`;
	for (const [surfaceIndex, surface] of guidance.surfaces.entries()) {
		const normalizedSurface = typeof surface === "string" ? surface.trim() : "";
		if (!(agentPromptSurfaces ??= new Set(AGENT_PROMPT_SURFACE_KINDS)).has(normalizedSurface)) {
			const surfaces = AGENT_PROMPT_SURFACE_KINDS.join(", ");
			return `${label} surface ${surfaceIndex + 1} must be one of: ${surfaces}`;
		}
	}
	return null;
}
function normalizeAgentPromptGuidance(guidance) {
	return guidance.map((entry) => {
		if (typeof entry === "string") return entry.trim();
		const normalized = { text: entry.text.trim() };
		if (entry.surfaces) normalized.surfaces = entry.surfaces.map((surface) => normalizeAgentPromptSurfaceKind(surface.trim()));
		return normalized;
	});
}
function listPluginInvocationKeys(command) {
	const keys = /* @__PURE__ */ new Set();
	const push = (value) => {
		const normalized = normalizeOptionalLowercaseString(value);
		if (!normalized) return;
		keys.add(`/${normalized}`);
	};
	push(command.name);
	for (const alias of Object.values(command.nativeNames ?? {})) if (typeof alias === "string") push(alias);
	return [...keys];
}
function registerPluginCommand(pluginId, command, opts) {
	const context = getPluginRegistrationContext();
	return registerPluginCommandInRegistry(context?.registry ?? requireActivePluginRegistry(), context?.pluginId ?? pluginId, command, opts);
}
function registerPluginCommandInRegistry(registry, pluginId, command, opts) {
	if (getPluginCommandExecutionCount(registry) > 0) return {
		ok: false,
		error: "Cannot register commands while processing is in progress"
	};
	if (command.ownership === "reserved") return {
		ok: false,
		error: "Reserved command ownership is only available to bundled reserved commands"
	};
	const definitionError = validatePluginCommandDefinition(command, opts);
	if (definitionError) return {
		ok: false,
		error: definitionError
	};
	const name = command.name.trim();
	const normalizedName = normalizeLowercaseStringOrEmpty(name);
	const description = command.description.trim();
	const normalizedCommand = {
		...command,
		handler: wrapCurrentPluginInstance(command.handler, (handler) => (ctx) => withPluginRuntimeRegistryScope(registry, () => handler(ctx))),
		name,
		description,
		...command.channels ? { channels: command.channels.map((channel) => normalizeLowercaseStringOrEmpty(channel)) } : {},
		...command.agentPromptGuidance ? { agentPromptGuidance: normalizeAgentPromptGuidance(command.agentPromptGuidance) } : {},
		...command.clientPresentation ? { clientPresentation: {
			when: "no-arguments",
			action: { kind: "device-pairing" }
		} } : {}
	};
	const invocationKeys = listPluginInvocationKeys(normalizedCommand);
	const key = `/${normalizedName}`;
	for (const invocationKey of invocationKeys) {
		const existing = registry.commands.find((entry) => listPluginInvocationKeys(entry.command).includes(invocationKey));
		if (existing) return {
			ok: false,
			error: `Command "${invocationKey.slice(1)}" already registered by plugin "${existing.pluginId}"`
		};
	}
	registry.commands.push({
		pluginId,
		pluginName: opts?.pluginName,
		rootDir: opts?.pluginRoot,
		source: opts?.pluginRoot ?? "runtime",
		command: normalizedCommand,
		...opts?.allowOwnerStatusExposure === true && normalizedCommand.exposeSenderIsOwner === true ? { trustedOwnerStatusExposure: true } : {}
	});
	logVerbose(`Registered plugin command: ${key} (plugin: ${pluginId})`);
	return { ok: true };
}
//#endregion
export { registerPluginCommand as n, registerPluginCommandInRegistry as r, isReservedCommandName as t };
