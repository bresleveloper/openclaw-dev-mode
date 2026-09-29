import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { _ as resolvePrimaryStringValue } from "./string-coerce-CIXf7egm.mjs";
import { l as logConfigWarningsOnce } from "./io.snapshot-BXuGbHpS.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import "./includes-CaaCq-XN.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { D as listAgentEntriesWithSource, E as listAgentEntries, S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as CONFIG_PATH } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-DKxKaZGG.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { t as OpenClawSchema } from "./zod-schema-B-u3AXjg.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { t as resolveCliModelEntry } from "./resolve-P9fG0vPg.mjs";
import { n as sanitizeDoctorNote } from "./emit-notes-BF8NdCNQ.mjs";
import path from "node:path";
//#region src/commands/doctor-config-analysis.ts
/** Doctor analysis helpers for config schema cleanup and ambiguous model fallback shapes. */
const configLog = createSubsystemLogger("config");
function noteMediaCliModelWarnings(cfg) {
	const models = cfg.tools?.media?.models;
	if (!Array.isArray(models)) return;
	const warnings = [];
	models.forEach((entry, index) => {
		if (!entry || (entry.type ?? (entry.command ? "cli" : "provider")) !== "cli") return;
		const resolved = resolveCliModelEntry(entry);
		if (!resolved.ok) {
			const field = resolved.error.reason === "cli-missing-command" ? "command" : "args";
			warnings.push(`- tools.media.models[${index}].${field}: Invalid CLI media model. ${resolved.error.message} Doctor cannot choose a command or attachment arguments; edit this entry.`);
		}
	});
	if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
}
function noteDoctorConfigPreflightIssues(snapshot, options) {
	const invalidConfigNote = options.invalidConfigNote ?? "Config invalid; doctor will run with best-effort config.";
	if (invalidConfigNote && snapshot.exists && !snapshot.valid && !options.activeRepair && snapshot.legacyIssues.length === 0) {
		note(invalidConfigNote, "Config");
		noteIncludeConfinementWarning(snapshot);
	}
	const warnings = snapshot.warnings ?? [];
	if (warnings.length > 0) {
		if (process.stdout.isTTY) note(formatConfigIssueLines(warnings, "-").join("\n"), "Config warnings");
		else logConfigWarningsOnce({
			configPath: snapshot.path,
			warnings,
			logger: configLog
		});
	}
}
function collectInvalidHookTransformsDirWarnings(cfg, configPath) {
	const transformsDir = cfg.hooks?.transformsDir?.trim();
	if (!transformsDir) return [];
	const configDir = path.dirname(configPath);
	const transformsRoot = path.join(configDir, "hooks", "transforms");
	const resolved = path.isAbsolute(transformsDir) ? path.resolve(transformsDir) : path.resolve(transformsRoot, transformsDir);
	if (isPathInside(transformsRoot, resolved)) return [];
	return [`- hooks.transformsDir: ${transformsDir} is outside ${transformsRoot}. Hook transform modules must live under ${transformsRoot}; move custom transforms there or remove hooks.transformsDir.`];
}
function collectUnsupportedInternalHookEntryWarnings(cfg) {
	const unsupportedKeysByEntry = Object.entries(cfg.hooks?.internal?.entries ?? {}).filter(([, entry]) => entry && typeof entry === "object" && !Array.isArray(entry)).map(([hookKey, entry]) => {
		return {
			hookKey,
			unsupportedKeys: [
				"handler",
				"module",
				"extraDirs",
				"installs"
			].filter((key) => Object.hasOwn(entry, key))
		};
	}).filter(({ unsupportedKeys }) => unsupportedKeys.length > 0);
	if (unsupportedKeysByEntry.length === 0) return [];
	return unsupportedKeysByEntry.map(({ hookKey, unsupportedKeys }) => `- hooks.internal.entries.${hookKey}: unsupported loader key${unsupportedKeys.length === 1 ? "" : "s"} ${unsupportedKeys.join(", ")} will not load hook modules. Use bootstrap-extra-files for session bootstrap content, or create a managed/workspace hook directory with HOOK.md + handler.js. Doctor cannot rewrite this automatically because per-hook entry keys are open-ended hook configuration.`);
}
function noteDoctorHookConfigWarnings(cfg, configPath) {
	const hookTransformsDirWarnings = collectInvalidHookTransformsDirWarnings(cfg, configPath);
	if (hookTransformsDirWarnings.length > 0) note(sanitizeDoctorNote(hookTransformsDirWarnings.join("\n")), "Doctor warnings");
	const unsupportedInternalHookEntryWarnings = collectUnsupportedInternalHookEntryWarnings(cfg);
	if (unsupportedInternalHookEntryWarnings.length > 0) note(sanitizeDoctorNote(unsupportedInternalHookEntryWarnings.join("\n")), "Doctor warnings");
}
function noteMissingDefaultAgentOwner(cfg) {
	if (cfg.agents?.ownership === "explicit" && listAgentEntries(cfg).length > 1 && !tryResolveLegacyCompatibilityAgentId(cfg)) note(`No default agent is designated. Set a configured agent with "${formatCliCommand("openclaw config set agents.defaults.systemAgent.agentId <id>")}".`, "Agent ownership");
}
function normalizeIssuePath(pathValue) {
	return pathValue.filter((part) => typeof part !== "symbol");
}
function isUnrecognizedKeysIssue(issue) {
	return issue.code === "unrecognized_keys";
}
/** Formats a parsed config issue path into a user-facing dotted path. */
function formatConfigKeyPath(parts) {
	if (parts.length === 0) return "<root>";
	let out = "";
	for (const part of parts) {
		if (typeof part === "number") {
			out += `[${part}]`;
			continue;
		}
		out = out ? `${out}.${part}` : part;
	}
	return out || "<root>";
}
/** Resolves a config path against a loose config tree, returning null for invalid traversal. */
function resolveConfigPathTarget(root, pathLocal) {
	let current = root;
	for (const part of pathLocal) {
		if (typeof part === "number") {
			if (!Array.isArray(current)) return null;
			if (part < 0 || part >= current.length) return null;
			current = current[part];
			continue;
		}
		if (!current || typeof current !== "object" || Array.isArray(current)) return null;
		const record = current;
		if (!(part in record)) return null;
		current = record[part];
	}
	return current;
}
function isUpdateInProgress() {
	const value = process.env.OPENCLAW_UPDATE_IN_PROGRESS;
	return value === "1" || value === "true";
}
const STRIP_PROTECTED_KEYS = { plugins: /* @__PURE__ */ new Set(["installs"]) };
/**
* Removes unknown config keys reported by schema validation, except protected migration keys.
*
* Doctor skips this while an update is in progress so partially written upgrade state is not
* stripped before its migration can finish.
*/
function stripUnknownConfigKeys(config) {
	if (isUpdateInProgress()) return {
		config,
		removed: []
	};
	const parsed = OpenClawSchema.safeParse(config);
	if (parsed.success) return {
		config,
		removed: []
	};
	const next = structuredClone(config);
	const removed = [];
	for (const issue of parsed.error.issues) {
		if (!isUnrecognizedKeysIssue(issue)) continue;
		const issuePath = normalizeIssuePath(issue.path);
		const target = resolveConfigPathTarget(next, issuePath);
		if (!target || typeof target !== "object" || Array.isArray(target)) continue;
		const record = target;
		const parentKey = issuePath.length === 1 && typeof issuePath[0] === "string" ? issuePath[0] : void 0;
		const protectedSet = issuePath.length === 0 ? void 0 : parentKey ? STRIP_PROTECTED_KEYS[parentKey] : void 0;
		for (const key of issue.keys) {
			if (typeof key !== "string" || !(key in record)) continue;
			if (key === "$include") continue;
			if (protectedSet?.has(key)) continue;
			delete record[key];
			removed.push(formatConfigKeyPath([...issuePath, key]));
		}
	}
	return {
		config: next,
		removed
	};
}
/** Warns when legacy OpenCode overrides shadow an active plugin-provided catalog. */
function noteOpencodeProviderOverrides(cfg, options = {}) {
	const providers = cfg.models?.providers;
	if (!providers) return;
	const overrides = [];
	if (options.opencodePluginActive === true && providers.opencode) overrides.push("opencode");
	if (options.opencodePluginActive === true && providers["opencode-zen"]) overrides.push("opencode-zen");
	if (options.opencodeGoPluginActive === true && providers["opencode-go"]) overrides.push("opencode-go");
	if (overrides.length === 0) return;
	const lines = overrides.flatMap((id) => {
		const providerLabel = id === "opencode-go" ? "OpenCode Go" : "OpenCode Zen";
		const providerEntry = providers[id];
		const api = isRecord(providerEntry) && typeof providerEntry.api === "string" ? providerEntry.api : void 0;
		return [`- models.providers.${id} is set; this overrides the plugin-provided ${providerLabel} catalog.`, api ? `- models.providers.${id}.api=${api}` : null].filter((line) => Boolean(line));
	});
	lines.push("- Remove these entries to restore per-model API routing + costs (then re-run setup if needed).");
	note(lines.join("\n"), "OpenCode");
}
function isImplicitFallbackClobber(model) {
	const primary = resolvePrimaryStringValue(model);
	if (typeof model === "string") return primary !== void 0;
	if (model !== null && typeof model === "object" && !Array.isArray(model)) {
		const obj = model;
		return Object.hasOwn(obj, "primary") && !Object.hasOwn(obj, "fallbacks") && primary !== void 0;
	}
	return false;
}
/** Collects warnings for agent model shapes that unintentionally drop default fallbacks. */
function collectImplicitFallbackClobberWarnings(cfg) {
	const defaultFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
	if (defaultFallbacks.length === 0) return [];
	const warnings = [];
	for (const { entry: agent, source } of listAgentEntriesWithSource(cfg)) {
		if (!agent || !isImplicitFallbackClobber(agent.model)) continue;
		const id = agent.id?.trim() || (source.kind === "list" ? String(source.index) : source.key);
		const primary = resolvePrimaryStringValue(agent.model);
		const location = source.kind === "entries" ? `agents.entries.${source.key}.model` : `agents.list[${source.index}].model (id=${id})`;
		const modelStr = typeof agent.model === "string" ? `"${agent.model}"` : `{ primary: "${primary}" }`;
		const shape = typeof agent.model === "string" ? "bare string with no fallbacks" : "object with no explicit \"fallbacks\" key";
		warnings.push([`- ${location} is ${modelStr}, a ${shape}. At runtime this clobbers agents.defaults.model.fallbacks (${defaultFallbacks.join(", ")}), leaving the agent with no fallbacks.`, `  Fix: add "fallbacks": [...] to inherit or override, or "fallbacks": [] to explicitly disable.`].join("\n"));
	}
	return warnings;
}
/** Emits doctor notes for model fallback clobber warnings. */
function noteImplicitFallbackClobberWarnings(cfg) {
	const warnings = collectImplicitFallbackClobberWarnings(cfg);
	if (warnings.length === 0) return;
	note(warnings.join("\n"), "Doctor warnings");
}
/** Emits a config include warning when an include path escapes the config directory. */
function noteIncludeConfinementWarning(snapshot) {
	const includeIssue = (snapshot.issues ?? []).find((issue) => issue.message.includes("Include path escapes config directory") || issue.message.includes("Include path resolves outside config directory"));
	if (!includeIssue) return;
	const configRoot = path.dirname(snapshot.path ?? CONFIG_PATH);
	note([
		`- $include paths must stay under: ${configRoot}`,
		"- Move shared include files under that directory and update to relative paths like \"./shared/common.json\".",
		`- Error: ${includeIssue.message}`
	].join("\n"), "Doctor warnings");
}
/** Warns when a trusted-proxy gateway has no public sandbox origin for widget/MCP-app frames. */
function noteSandboxOriginProxyWarning(cfg) {
	if (cfg.gateway?.auth?.mode !== "trusted-proxy" || cfg.mcp?.apps?.sandboxOrigin) return;
	note([
		"- gateway.auth.mode is \"trusted-proxy\" but mcp.apps.sandboxOrigin is not set.",
		"  Dashboard widgets and MCP apps render from a separate sandbox listener (gateway port + 1). If your proxy or tunnel does not also route that port, widget frames cannot load.",
		"  Check: either route the sandbox port through your proxy, or set mcp.apps.sandboxOrigin to a dedicated public origin routed to the sandbox listener (see docs/cli/mcp/apps.md)."
	].join("\n"), "Doctor warnings");
}
/** Warns when per-requester MCP OAuth cannot build a public callback URL. */
function noteMcpOriginWarning(cfg) {
	if (!Object.values(cfg.mcp?.servers ?? {}).some((server) => server.oauth?.identity === "per-requester") || cfg.gateway?.publicOrigin) return;
	note(["- An MCP server uses oauth.identity \"per-requester\", but gateway.publicOrigin is not set.", "  Set gateway.publicOrigin to the externally reachable Gateway origin so senders can complete MCP sign-in."].join("\n"), "Doctor warnings");
}
//#endregion
export { noteMcpOriginWarning as a, noteOpencodeProviderOverrides as c, stripUnknownConfigKeys as d, noteImplicitFallbackClobberWarnings as i, noteSandboxOriginProxyWarning as l, noteDoctorConfigPreflightIssues as n, noteMediaCliModelWarnings as o, noteDoctorHookConfigWarnings as r, noteMissingDefaultAgentOwner as s, formatConfigKeyPath as t, resolveConfigPathTarget as u };
