import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import "./utils-aKqR_F_U.mjs";
import { u as wrapCurrentPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { d as isOperatorScope } from "./operator-scopes-D-CL26h0.mjs";
import { B as getPluginCommandExecutionCount, m as getPluginRegistrationContext, y as requireActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { t as listRegisteredPluginCommands } from "./plugin-command-registry-3YOixkIa.mjs";
//#region src/plugins/agent-prompt-surface-kind.ts
/** Normalizes legacy prompt surface names to current OpenClaw surface names. */
function normalizeAgentPromptSurfaceKind(surface) {
	return surface === "pi_main" ? "openclaw_main" : surface;
}
/** True when a prompt surface targets the main OpenClaw prompt. */
function isOpenClawMainPromptSurface(surface) {
	return normalizeAgentPromptSurfaceKind(surface) === "openclaw_main";
}
//#endregion
//#region src/plugins/command-registry-state.ts
function clearPluginCommands() {
	requireActivePluginRegistry().commands.length = 0;
}
function isTrustedReservedCommandOwner(command) {
	return command.ownership === "reserved";
}
function canExposeSenderIsOwner(command) {
	return Array.isArray(command.requiredScopes) && command.requiredScopes.length > 0 || command.trustedOwnerStatusExposure === true;
}
function listRegisteredPluginAgentPromptGuidance(params) {
	const lines = [];
	const seen = /* @__PURE__ */ new Set();
	const commands = listRegisteredPluginCommands(requireActivePluginRegistry()).toSorted((left, right) => {
		if (left.pluginId !== right.pluginId) return left.pluginId < right.pluginId ? -1 : 1;
		return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
	});
	for (const command of commands) for (const entry of command.agentPromptGuidance ?? []) {
		const trimmed = resolveAgentPromptGuidanceTextForSurface(entry, {
			surface: params?.surface ? normalizeAgentPromptSurfaceKind(params.surface) : void 0,
			includeLegacyGlobalGuidance: params?.includeLegacyGlobalGuidance ?? true
		});
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		lines.push(trimmed);
	}
	return lines;
}
function resolveAgentPromptGuidanceTextForSurface(entry, params) {
	if (typeof entry === "string") return params.includeLegacyGlobalGuidance ? entry.trim() : void 0;
	const text = entry.text.trim();
	if (!params.surface) return text;
	if (!entry.surfaces || entry.surfaces.length === 0) return params.includeLegacyGlobalGuidance ? text : void 0;
	return entry.surfaces.includes(params.surface) ? text : void 0;
}
//#endregion
//#region src/plugins/plugin-command.types.ts
/**
* Definition for a plugin-registered command.
*/
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
function getAgentPromptSurfaces() {
	agentPromptSurfaces ??= new Set(AGENT_PROMPT_SURFACE_KINDS);
	return agentPromptSurfaces;
}
/** Returns true when a command name is owned by built-in OpenClaw command handling. */
function isReservedCommandName(name) {
	const trimmed = normalizeOptionalLowercaseString(name) ?? "";
	return Boolean(trimmed && getReservedCommands().has(trimmed));
}
/** Validates user-visible command names before plugin registration accepts them. */
function validateCommandName(name, opts) {
	const trimmed = normalizeOptionalLowercaseString(name) ?? "";
	if (!trimmed) return "Command name cannot be empty";
	if (!/^[a-z][a-z0-9_-]*$/.test(trimmed)) return "Command name must start with a letter and contain only letters, numbers, hyphens, and underscores";
	if (!opts?.allowReservedCommandNames && getReservedCommands().has(trimmed)) return `Command name "${trimmed}" is reserved by a built-in command`;
	return null;
}
/**
* Validate a plugin command definition without registering it.
* Returns an error message if invalid, or null if valid.
* Shared by both the global registration path and snapshot (non-activating) loads.
*/
function validatePluginCommandDefinition(command, opts) {
	if (typeof command.handler !== "function") return "Command handler must be a function";
	if (typeof command.name !== "string") return "Command name must be a string";
	if (typeof command.description !== "string") return "Command description must be a string";
	if (!command.description.trim()) return "Command description cannot be empty";
	if (command.ownership === "reserved") {
		if (!opts?.allowReservedCommandNames) return "Reserved command ownership is only available to bundled reserved commands";
		if (!isReservedCommandName(command.name)) return `Reserved command ownership requires a reserved command name: ${normalizeOptionalLowercaseString(command.name) ?? ""}`;
	}
	if (command.agentPromptGuidance !== void 0 && !Array.isArray(command.agentPromptGuidance)) return "Agent prompt guidance must be an array of strings or objects";
	for (const [index, guidance] of (command.agentPromptGuidance ?? []).entries()) {
		const guidanceError = validateAgentPromptGuidance(index, guidance);
		if (guidanceError) return guidanceError;
	}
	if (command.requiredScopes !== void 0) {
		if (!Array.isArray(command.requiredScopes)) return "Command requiredScopes must be an array of operator scopes";
		const unknownScope = command.requiredScopes.find((scope) => !isOperatorScope(scope));
		if (unknownScope) return typeof unknownScope === "string" ? `Command requiredScopes contains unknown operator scope: ${unknownScope}` : "Command requiredScopes contains unknown operator scope";
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
			if (typeof channel !== "string") return `Command channel ${index + 1} must be a string`;
			if (!channel.trim()) return `Command channel ${index + 1} cannot be empty`;
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
	if (command.nativeProgressMessages !== void 0 && !isRecord(command.nativeProgressMessages)) return "Command nativeProgressMessages must be an object";
	for (const [label, message] of Object.entries(command.nativeProgressMessages ?? {})) {
		if (typeof message !== "string") return `Native progress message "${label}" must be a string`;
		if (!message.trim()) return `Native progress message "${label}" cannot be empty`;
	}
	if (command.descriptionLocalizations !== void 0 && !isRecord(command.descriptionLocalizations)) return "Command descriptionLocalizations must be an object";
	for (const [locale, description] of Object.entries(command.descriptionLocalizations ?? {})) {
		if (typeof description !== "string") return `Description localization "${locale}" must be a string`;
		if (!description.trim()) return `Description localization "${locale}" cannot be empty`;
	}
	return null;
}
function validateAgentPromptGuidance(index, guidance) {
	const label = `Agent prompt guidance ${index + 1}`;
	if (typeof guidance === "string") return guidance.trim() ? null : `${label} cannot be empty`;
	if (!isRecord(guidance)) return `${label} must be a string or object`;
	if (typeof guidance.text !== "string") return `${label} text must be a string`;
	if (!guidance.text.trim()) return `${label} text cannot be empty`;
	if (guidance.surfaces === void 0) return null;
	if (!Array.isArray(guidance.surfaces)) return `${label} surfaces must be an array of prompt surface ids`;
	if (guidance.surfaces.length === 0) return `${label} surfaces cannot be empty`;
	for (const [surfaceIndex, surface] of guidance.surfaces.entries()) {
		const normalizedSurface = typeof surface === "string" ? surface.trim() : "";
		if (!getAgentPromptSurfaces().has(normalizedSurface)) {
			const surfaces = AGENT_PROMPT_SURFACE_KINDS.join(", ");
			return `${label} surface ${surfaceIndex + 1} must be one of: ${surfaces}`;
		}
	}
	return null;
}
function normalizeAgentPromptGuidance(guidance) {
	if (!guidance) return;
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
export { clearPluginCommands as a, isOpenClawMainPromptSurface as c, canExposeSenderIsOwner as i, registerPluginCommand as n, isTrustedReservedCommandOwner as o, registerPluginCommandInRegistry as r, listRegisteredPluginAgentPromptGuidance as s, isReservedCommandName as t };
