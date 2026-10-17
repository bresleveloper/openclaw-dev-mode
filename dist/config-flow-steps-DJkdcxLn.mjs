import { _ as resolvePrimaryStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import "./includes-BkzfmxST.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as CONFIG_PATH } from "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { a as readAgentRosterProperty, n as listAgentEntries, r as listAgentEntriesWithSource } from "./agent-roster-BXD1uMJD.mjs";
import { a as copyConfigResolutionFactsThroughRewrite, t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { t as coerceConfig } from "./io.read-helpers-Bvdjf9tk.mjs";
import { t as discoverConfiguredPluginLoadPaths, u as findUninspectedPluginDiagnostic } from "./discovery-Dma3bVNk.mjs";
import { t as logConfigWarningsOnce } from "./io.warnings-Dz_nq5SM.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { i as isPluginSourceModulePath, u as tryNativeRequireModule } from "./native-module-require-BX9Ubdbu.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CUtYxPiw.mjs";
import { o as preparePluginLoaderAliases } from "./sdk-alias-A9rXLURS.mjs";
import { n as getDeferredPluginMigrationConfigFacts, o as setDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-Db8uALnk.mjs";
import { a as migrateLegacyContextBudgetConfig, c as collectToolPolicyConflictWarnings, i as removeLegacyCopilotDiscovery, r as LEGACY_CONFIG_MIGRATIONS } from "./legacy-Ccc1pb1u.mjs";
import { i as tryGetLegacyDefaultAgentId, t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import "./legacy-config-record-shared-C4da1YWQ.mjs";
import { n as containsAuthoredInclude, t as classifyOtelGrpcMigrationOwnership } from "./include-migration-ownership-jJubBWXv.mjs";
import { t as OpenClawSchema } from "./zod-schema-B-D6bTAy.mjs";
import { n as validateConfigObjectRawWithPlugins, t as materializeLegacyAgentOwnershipForActiveChannelsResult } from "./validation-BeAnc62d.mjs";
import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-DlD4zNx-.mjs";
import { o as restoreEnvVarRefsFromResolved } from "./io.types-E3Nszhk8.mjs";
import { r as projectAuthoredAgentRosterForWrite } from "./io.write-prepare-DWaupA4w.mjs";
import { n as createMergePatch } from "./merge-patch-C4XTCka4.mjs";
import "./config-9720xhC5.mjs";
import { t as applyPluginDoctorCompatibilitySequence } from "./doctor-compatibility-migration-CB42oRDE.mjs";
import { o as migratePluginConfigId } from "./update-config-AMVPAwMY.mjs";
import { n as protectActiveAuthProfileConfig } from "./doctor-auth-profile-config-GX4pYfLQ.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as resolveCliModelEntry } from "./resolve-EGBbRe3L.mjs";
import { n as sanitizeDoctorNote } from "./emit-notes-CPyL1dzc.mjs";
import { t as loadBundledChannelDoctorContractApi } from "./doctor-contract-api-DJ9wcLLt.mjs";
import { t as HISTORICAL_WEBHOOK_CHANNELS } from "./legacy-webhook-pins-BYmC7aTb.mjs";
import { i as isPluginDoctorMigrationDeferred, n as applyPluginDoctorCompatibilityMigrations, r as collectDoctorConfigRepairPluginIds } from "./doctor-contract-registry-BSHZeoyM.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-Ce74V-mJ.mjs";
import { t as resolveChannelAccountBindingRepairInput } from "./legacy-config-binding-repair-input-B7BS9DK2.mjs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
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
	return Object.entries(cfg.hooks?.internal?.entries ?? {}).flatMap(([hookKey, entry]) => {
		if (!isRecord(entry)) return [];
		const keys = [
			"handler",
			"module",
			"extraDirs",
			"installs"
		].filter((key) => Object.hasOwn(entry, key));
		return keys.length > 0 ? [`- hooks.internal.entries.${hookKey}: unsupported loader key${keys.length === 1 ? "" : "s"} ${keys.join(", ")} will not load hook modules. Use bootstrap-extra-files for session bootstrap content, or create a managed/workspace hook directory with HOOK.md + handler.js. Doctor cannot rewrite this automatically because per-hook entry keys are open-ended hook configuration.`] : [];
	});
}
function noteDoctorHookConfigWarnings(cfg, configPath) {
	for (const warnings of [collectInvalidHookTransformsDirWarnings(cfg, configPath), collectUnsupportedInternalHookEntryWarnings(cfg)]) if (warnings.length > 0) note(sanitizeDoctorNote(warnings.join("\n")), "Doctor warnings");
}
function noteMissingDefaultAgentOwner(cfg) {
	if (cfg.agents?.ownership === "explicit" && listAgentEntries(cfg).length > 1 && !tryResolveLegacyCompatibilityAgentId(cfg)) note(`No default agent is designated. Set a configured agent with "${formatCliCommand("openclaw config set agents.defaults.systemAgent.agentId <id>")}".`, "Agent ownership");
}
function formatConfigKeyPath(parts) {
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
		if (!isRecord(current) || !(part in current)) return null;
		current = current[part];
	}
	return current;
}
/**
* Removes unknown config keys reported by schema validation.
*
* Doctor skips this while an update is in progress so partially written upgrade state is not
* stripped before its migration can finish.
*/
function stripUnknownConfigKeys(config) {
	const updating = process.env.OPENCLAW_UPDATE_IN_PROGRESS;
	if (updating === "1" || updating === "true") return {
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
		if (issue.code !== "unrecognized_keys") continue;
		const issuePath = issue.path.filter((part) => typeof part !== "symbol");
		const target = resolveConfigPathTarget(next, issuePath);
		if (!isRecord(target)) continue;
		for (const key of issue.keys) {
			if (!(key in target)) continue;
			if (key === "$include") continue;
			delete target[key];
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
	if (isRecord(model)) return Object.hasOwn(model, "primary") && !Object.hasOwn(model, "fallbacks") && primary !== void 0;
	return false;
}
function noteImplicitFallbackClobberWarnings(cfg) {
	const agents = isRecord(cfg) && isRecord(cfg.agents) ? cfg.agents : void 0;
	const model = (isRecord(agents?.defaults) ? agents.defaults : void 0)?.model;
	const defaultFallbacks = isRecord(model) && Array.isArray(model.fallbacks) ? model.fallbacks : [];
	if (defaultFallbacks.length === 0) return;
	const roster = readAgentRosterProperty(cfg);
	const rosterConfig = roster?.kind === "entries" && isRecord(roster.value) ? { agents: { entries: roster.value } } : roster?.kind === "list" && Array.isArray(roster.value) ? { agents: { list: roster.value } } : void 0;
	if (!rosterConfig) return;
	const warnings = [];
	for (const { entry: agent, source } of listAgentEntriesWithSource(rosterConfig)) {
		if (!agent || !isImplicitFallbackClobber(agent.model)) continue;
		const id = agent.id?.trim() || (source.kind === "list" ? String(source.index) : source.key);
		const primary = resolvePrimaryStringValue(agent.model);
		const location = source.kind === "entries" ? `agents.entries.${source.key}.model` : `agents.list[${source.index}].model (id=${id})`;
		const modelStr = typeof agent.model === "string" ? `"${agent.model}"` : `{ primary: "${primary}" }`;
		const shape = typeof agent.model === "string" ? "bare string with no fallbacks" : "object with no explicit \"fallbacks\" key";
		warnings.push([`- ${location} is ${modelStr}, a ${shape}. At runtime this clobbers agents.defaults.model.fallbacks (${defaultFallbacks.join(", ")}), leaving the agent with no fallbacks.`, `  Fix: add "fallbacks": [...] to inherit or override, or "fallbacks": [] to explicitly disable.`].join("\n"));
	}
	if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
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
//#region src/commands/doctor/shared/channel-legacy-config-migrate.ts
const log = createSubsystemLogger("plugins/doctor-contracts");
function migrateHeartbeatVisibility(raw, changes) {
	const channels = isRecord(raw.channels) ? raw.channels : null;
	if (!channels) return;
	const migrateEntry = (entry, path, preserveEmptyPluginBlock = false) => {
		const heartbeat = isRecord(entry.heartbeat) ? entry.heartbeat : null;
		const keys = heartbeat ? Object.keys(heartbeat) : [];
		if (!heartbeat || preserveEmptyPluginBlock && keys.length === 0 || keys.some((key) => key !== "showOk" && key !== "showAlerts" && key !== "useIndicator")) return;
		if (entry.heartbeatVisibility === void 0) {
			entry.heartbeatVisibility = entry.heartbeat;
			changes.push(`Moved ${path}.heartbeat → ${path}.heartbeatVisibility.`);
		} else changes.push(`Removed ${path}.heartbeat (${path}.heartbeatVisibility already set).`);
		delete entry.heartbeat;
	};
	const defaults = isRecord(channels.defaults) ? channels.defaults : null;
	if (defaults) migrateEntry(defaults, "channels.defaults");
	for (const [channelId, value] of Object.entries(channels)) {
		if (!channelId.trim() || isChannelConfigMetadataKey(channelId) || !isRecord(value)) continue;
		const preserveEmptyPluginBlock = channelId === "feishu";
		migrateEntry(value, `channels.${channelId}`, preserveEmptyPluginBlock);
		const accounts = isRecord(value.accounts) ? value.accounts : null;
		if (!accounts) continue;
		for (const [accountId, account] of Object.entries(accounts)) if (isRecord(account)) migrateEntry(account, `channels.${channelId}.accounts.${accountId}`, preserveEmptyPluginBlock);
	}
}
function resolveBundledChannelCompatibilityNormalizer(channelId) {
	if (isPluginDoctorMigrationDeferred(channelId)) return;
	const contractNormalizer = loadBundledChannelDoctorContractApi(channelId)?.normalizeCompatibilityConfig;
	if (typeof contractNormalizer === "function") return contractNormalizer;
	return getBootstrapChannelPlugin(channelId)?.doctor?.normalizeCompatibilityConfig;
}
/** Apply bundled and plugin channel compatibility migrations to a legacy config object. */
function applyChannelDoctorCompatibilityMigrations(cfg, options) {
	const config = cfg;
	const loadPaths = config.plugins?.load?.paths ?? [];
	if (loadPaths.length > 0) {
		const warning = findUninspectedPluginDiagnostic(discoverConfiguredPluginLoadPaths({ loadPaths }).diagnostics);
		if (warning) {
			log.warn(warning.message);
			return {
				next: cfg,
				changes: []
			};
		}
	}
	const changes = [];
	migrateHeartbeatVisibility(cfg, changes);
	const unresolvedChannelIds = [];
	const bundled = applyPluginDoctorCompatibilitySequence(config, listDoctorConfiguredChannelIds(cfg, {
		configEntryPolicy: "raw",
		sort: "codepoint"
	}).map((channelId) => {
		const normalizeCompatibilityConfig = resolveBundledChannelCompatibilityNormalizer(channelId);
		if (!normalizeCompatibilityConfig) unresolvedChannelIds.push(channelId);
		return {
			pluginId: channelId,
			normalizeCompatibilityConfig
		};
	}));
	const pluginIds = options?.pluginContracts === false ? [] : [.../* @__PURE__ */ new Set([...unresolvedChannelIds, ...collectDoctorConfigRepairPluginIds(cfg)])].toSorted();
	const plugins = pluginIds.length || options?.historicalWebhookListeners ? applyPluginDoctorCompatibilityMigrations(bundled.config, {
		config,
		pluginIds: options?.historicalWebhookListeners ? [.../* @__PURE__ */ new Set([...pluginIds, ...HISTORICAL_WEBHOOK_CHANNELS])] : pluginIds,
		historicalWebhookListeners: options?.historicalWebhookListeners
	}) : {
		config: bundled.config,
		changes: []
	};
	const warnings = [.../* @__PURE__ */ new Set([...bundled.warnings ?? [], ...plugins.warnings ?? []])];
	return {
		next: plugins.config,
		changes: [
			...changes,
			...bundled.changes,
			...plugins.changes
		],
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-compat.ts
const require = createRequire(import.meta.url);
function loadBindingRepair() {
	const source = isPluginSourceModulePath(fileURLToPath(import.meta.url));
	const modulePath = fileURLToPath(new URL(source ? "./legacy-config-binding-repair.runtime.ts" : "./legacy-config-binding-repair.runtime.js", import.meta.url));
	const native = source ? tryNativeRequireModule(modulePath, { aliasMap: preparePluginLoaderAliases({
		modulePath,
		moduleUrl: import.meta.url
	}).resolveAlias }) : void 0;
	return native?.ok ? native.moduleExport : source ? getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url,
		tryNative: false
	})(modulePath) : require(modulePath);
}
/** Apply all legacy doctor migrations to raw config, returning null when nothing changed. */
function applyLegacyDoctorMigrations(raw, options) {
	if (!isRecord(raw)) return {
		next: null,
		changes: []
	};
	const original = raw;
	const copilotConfig = removeLegacyCopilotDiscovery(original);
	const contextBudget = migrateLegacyContextBudgetConfig(copilotConfig);
	const next = inheritLegacyDefaultAgentId(original, cloneConfigWithResolutionFacts(contextBudget.config));
	const changes = contextBudget.changes.map(({ message }) => message);
	if (copilotConfig !== original) changes.push("The GitHub Copilot discovery switch was retired and has been removed. Configured Copilot access now refreshes its model list automatically. Use the model allow list (agents.defaults.modelPolicy.allow) to hide Copilot models; it does not stop discovery requests.");
	for (const migration of LEGACY_CONFIG_MIGRATIONS) migration.apply(next, changes, options.context);
	const compat = applyChannelDoctorCompatibilityMigrations(next, { pluginContracts: options.pluginContracts !== false });
	changes.push(...compat.changes);
	const legacyOwner = tryGetLegacyDefaultAgentId(next);
	if (legacyOwner && options.pluginContracts !== false) {
		const materialized = materializeLegacyAgentOwnershipForActiveChannelsResult(compat.next, legacyOwner);
		if (materialized.insertedPaths.length > 0) {
			Object.assign(compat.next, materialized.config);
			changes.push("Preserved legacy ownership for enabled channels.");
		}
	}
	const ownership = options.pluginContracts !== false && resolveChannelAccountBindingRepairInput(compat.next) ? loadBindingRepair().repairUnownedChannelAccountBindings({
		config: compat.next,
		sourceConfigBeforeMigrations: options.sourceConfigBeforeMigrations
	}) : {
		config: compat.next,
		changes: []
	};
	changes.push(...ownership.changes);
	const warnings = [
		...contextBudget.warnings.map(({ message }) => message),
		...compat.warnings ?? [],
		...ownership.warnings ?? [],
		...collectToolPolicyConflictWarnings(ownership.config)
	];
	copyConfigResolutionFactsThroughRewrite(original, ownership.config);
	return {
		next: changes.length > 0 ? inheritLegacyDefaultAgentId(next, ownership.config) : null,
		changes,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrate.ts
/** Apply legacy migrations and validate the resulting OpenClaw config shape when possible. */
function migrateLegacyConfig(raw, options) {
	const { context } = options;
	const { next, changes, warnings } = applyLegacyDoctorMigrations(raw, options);
	const diagnostics = {
		changes,
		...warnings?.length ? { warnings } : {}
	};
	if (!next) return {
		config: null,
		...diagnostics
	};
	const resolvedCandidate = context ? applyLegacyDoctorMigrations(context.resolvedRaw, options).next ?? context.resolvedRaw : next;
	const validated = validateConfigObjectRawWithPlugins(resolvedCandidate, { deferredPluginMigrations: getDeferredPluginMigrationConfigFacts(context?.resolvedRaw ?? raw) });
	if (!validated.ok) {
		changes.push("Migration applied; other validation issues remain — run doctor to review.");
		return {
			config: next,
			...diagnostics,
			partiallyValid: true
		};
	}
	return {
		config: inheritLegacyDefaultAgentId(resolvedCandidate, validated.config),
		sourceConfig: next,
		...diagnostics
	};
}
//#endregion
//#region src/commands/doctor/shared/config-flow-steps.ts
/** Apply legacy config migrations and update preview/fix state for doctor config flow. */
function applyLegacyCompatibilityStep(params) {
	if (params.snapshot.legacyIssues.length === 0) return {
		state: params.state,
		issueLines: [],
		changeLines: []
	};
	const issueLines = formatConfigIssueLines(params.snapshot.legacyIssues, "-");
	const otelOwnership = classifyOtelGrpcMigrationOwnership({
		snapshot: params.snapshot,
		authoredConfig: params.snapshot.parsed,
		resolvedConfig: params.snapshot.sourceConfig
	});
	if (otelOwnership?.kind === "manual") {
		const otelPath = "diagnostics.otel.protocol";
		const targets = otelOwnership.targetPaths.length > 0 ? ` Inspect these candidate source files and remove or replace ${otelPath} = "grpc" from every definition: ${otelOwnership.targetPaths.join(", ")}.` : ` Remove or replace ${otelPath} = "grpc" in the owning $include directive or included file.`;
		return {
			state: params.state,
			issueLines: [...issueLines, `- ${otelPath}: Doctor cannot safely rewrite this $include ownership.${targets} No config files were changed.`],
			changeLines: [],
			blocksWrite: true
		};
	}
	const hasAuthoredIncludes = containsAuthoredInclude(params.snapshot.parsed);
	const { config: migrated, sourceConfig: migratedSource, changes, warnings, partiallyValid } = migrateLegacyConfig(params.snapshot.sourceConfig, {
		sourceConfigBeforeMigrations: params.snapshot.sourceConfigBeforeMigrations,
		context: {
			authoredRaw: params.snapshot.parsed,
			resolvedRaw: params.snapshot.sourceConfig
		}
	});
	const migrationCandidate = migratedSource ?? migrated;
	const hasLegacyChanges = changes.length > 0 || !isDeepStrictEqual(params.snapshot.sourceConfigBeforeMigrations ?? (hasAuthoredIncludes ? params.snapshot.sourceConfig : params.snapshot.parsed), params.snapshot.sourceConfig);
	return {
		state: {
			...params.state,
			...migrationCandidate ? {
				cfg: migrationCandidate,
				candidate: migrationCandidate
			} : {},
			pendingChanges: params.state.pendingChanges || hasLegacyChanges,
			fixHints: params.shouldRepair || !hasLegacyChanges ? params.state.fixHints : [...params.state.fixHints, `Run "${params.doctorFixCommand}" to ${partiallyValid ? "finish fixing" : "migrate"} legacy config keys.`]
		},
		issueLines: [...issueLines, ...warnings ?? []],
		changeLines: changes,
		partiallyValid: partiallyValid === true ? true : void 0
	};
}
/** Strip unknown config keys while preserving active auth profile settings. */
function applyUnknownConfigKeyStep(params) {
	const unknown = stripUnknownConfigKeys(params.state.candidate);
	if (unknown.removed.length === 0) return {
		state: params.state,
		removed: [],
		repairs: [],
		warnings: []
	};
	const protectedAuth = protectActiveAuthProfileConfig({
		before: params.state.candidate,
		after: unknown.config
	});
	return {
		state: {
			cfg: params.shouldRepair ? protectedAuth.config : params.state.cfg,
			candidate: protectedAuth.config,
			pendingChanges: true,
			fixHints: params.shouldRepair ? params.state.fixHints : [...params.state.fixHints, `Run "${params.doctorFixCommand}" to remove these keys.`]
		},
		removed: unknown.removed,
		repairs: protectedAuth.repairs,
		warnings: protectedAuth.warnings
	};
}
/** Keep the matched planning read independent of later write receipts and environment changes. */
function prepareDoctorConfigReferenceSource(snapshot) {
	if (!snapshot.authoredConfig || !snapshot.sourceConfigBeforeMigrations) return;
	return {
		authored: structuredClone(snapshot.authoredConfig),
		resolved: cloneConfigWithResolutionFacts(snapshot.sourceConfigBeforeMigrations),
		parsed: structuredClone(snapshot.parsed)
	};
}
/** A moved template must still have its original read-time value after migration. */
function retainValuePreservingMigrationRefs(template, migratedResolved, source) {
	const values = /* @__PURE__ */ new Map();
	const ambiguous = /* @__PURE__ */ new Set();
	const collect = (authored, resolved) => {
		if (typeof authored === "string" && /\$\{[A-Z_][A-Z0-9_]*\}/.test(authored)) {
			if (values.has(authored) && !isDeepStrictEqual(values.get(authored), resolved)) ambiguous.add(authored);
			values.set(authored, resolved);
		} else if (authored && typeof authored === "object") for (const [key, value] of Object.entries(authored)) collect(value, resolved && typeof resolved === "object" ? resolved[key] : void 0);
	};
	collect(source.authored, source.resolved);
	const retain = (authored, resolved) => {
		if (typeof authored === "string" && /\$\{[A-Z_][A-Z0-9_]*\}/.test(authored)) return values.has(authored) && !ambiguous.has(authored) && isDeepStrictEqual(values.get(authored), resolved) ? authored : void 0;
		if (Array.isArray(authored)) return authored.map((value, index) => retain(value, Array.isArray(resolved) ? resolved[index] : void 0));
		if (authored && typeof authored === "object") return Object.fromEntries(Object.entries(authored).map(([key, value]) => [key, retain(value, resolved && typeof resolved === "object" ? resolved[key] : void 0)]));
		return authored;
	};
	return retain(template, migratedResolved);
}
/** Restore unchanged and moved references without substituting a later environment. */
function restoreDoctorConfigEnvRefs(candidate, source, explicitSetPaths, migrationOptions = {}) {
	if (!source) return candidate;
	const canonicalAuthored = projectAuthoredAgentRosterForWrite({
		rootAuthoredConfig: source.authored,
		sourceConfigBeforeMigrations: source.resolved
	});
	const canonicalResolved = projectAuthoredAgentRosterForWrite({
		rootAuthoredConfig: source.resolved,
		sourceConfigBeforeMigrations: source.resolved
	});
	const unchanged = restoreEnvVarRefsFromResolved(candidate, canonicalAuthored, canonicalResolved, explicitSetPaths);
	const options = {
		sourceConfigBeforeMigrations: source.resolved,
		context: {
			authoredRaw: source.parsed,
			resolvedRaw: source.resolved
		}
	};
	const migratedAuthored = applyLegacyDoctorMigrations(canonicalAuthored, options);
	const migratedResolved = applyLegacyDoctorMigrations(canonicalResolved, options);
	const authoredView = migratedAuthored.next ?? canonicalAuthored;
	const resolvedView = migratedResolved.next ?? canonicalResolved;
	if (!isRecord(authoredView) || !isRecord(resolvedView)) throw new Error("Doctor reference migrations must preserve config object roots.");
	const migratedAuthoredConfig = coerceConfig(authoredView);
	const migratedResolvedConfig = coerceConfig(resolvedView);
	const referenceTemplate = createMergePatch(canonicalAuthored, migratedAuthoredConfig);
	const resolvedTemplate = createMergePatch(canonicalResolved, migratedResolvedConfig);
	const restored = restoreEnvVarRefsFromResolved(unchanged, retainValuePreservingMigrationRefs(referenceTemplate, resolvedTemplate, source), resolvedTemplate, explicitSetPaths);
	let movedAuthored = migratedAuthoredConfig;
	let movedResolved = migratedResolvedConfig;
	const pluginIdMigrations = new Map(Object.entries(migrationOptions.appliedPluginIdMigrations ?? {}));
	for (const [legacyId, owner] of source.installedPluginIdRecovery ?? []) pluginIdMigrations.set(legacyId, owner.pluginId);
	for (const [legacyId, pluginId] of pluginIdMigrations) {
		movedAuthored = migratePluginConfigId(movedAuthored, legacyId, pluginId);
		movedResolved = migratePluginConfigId(movedResolved, legacyId, pluginId);
	}
	const pluginReferences = createMergePatch(migratedAuthoredConfig.plugins?.entries ?? {}, movedAuthored.plugins?.entries ?? {});
	const pluginValues = createMergePatch(migratedResolvedConfig.plugins?.entries ?? {}, movedResolved.plugins?.entries ?? {});
	const recovered = restoreEnvVarRefsFromResolved(restored, { plugins: { entries: pluginReferences } }, { plugins: { entries: pluginValues } }, explicitSetPaths);
	if (!isRecord(recovered)) throw new Error("Doctor reference restoration must preserve the config object root.");
	const recoveredConfig = coerceConfig(recovered);
	setDeferredPluginMigrationConfigFacts(recoveredConfig, getDeferredPluginMigrationConfigFacts(candidate));
	return recoveredConfig;
}
//#endregion
export { migrateLegacyConfig as a, noteDoctorConfigPreflightIssues as c, noteMcpOriginWarning as d, noteMediaCliModelWarnings as f, noteSandboxOriginProxyWarning as h, restoreDoctorConfigEnvRefs as i, noteDoctorHookConfigWarnings as l, noteOpencodeProviderOverrides as m, applyUnknownConfigKeyStep as n, applyLegacyDoctorMigrations as o, noteMissingDefaultAgentOwner as p, prepareDoctorConfigReferenceSource as r, applyChannelDoctorCompatibilityMigrations as s, applyLegacyCompatibilityStep as t, noteImplicitFallbackClobberWarnings as u };
