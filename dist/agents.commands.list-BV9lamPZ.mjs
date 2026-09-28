import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { s as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-C83ks5im.mjs";
import { n as isChannelVisibleInConfiguredLists } from "./channel-meta-BgTks57p.mjs";
import { a as evaluateAgentDatabaseAdmissions, f as recordAgentDatabaseAdmissions, s as hasAgentDatabaseAdmissions } from "./agent-database-admission-BFwcs62N.mjs";
import { d as listAgentProvenance, p as readAgentProvenanceForDisplay } from "./agent-deletion-journal-CZw0kGMX.mjs";
import "./channel-plugin-ids-5hZDJEQZ.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-B2sBFVIg.mjs";
import { i as normalizeChannelId } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-BvrVstXM.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { n as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { i as resolveChannelAccountState, n as projectChannelAccountDisplayState, r as resolveChannelAccountLinked } from "./account-state-Bap6_YQI.mjs";
import { n as buildAgentSummaries } from "./agents.config-BnlRDoFW.mjs";
import { t as describeBinding } from "./agents.binding-format-BRYI5aWJ.mjs";
import "./agents.bindings-BDLKxy0x.mjs";
import { t as requireValidConfig } from "./config-validation-rQwHnF_v.mjs";
//#region src/commands/agents.providers.ts
function providerAccountKey(provider, accountId) {
	return `${provider}:${normalizeAccountId(accountId)}`;
}
function recordProviderAccountStatus(index, entry) {
	const key = providerAccountKey(entry.provider, entry.accountId);
	if (!index.has(key) || entry.accountId === normalizeAccountId(entry.accountId)) index.set(key, entry);
}
function resolveProviderChannelId(params) {
	const resolved = normalizeChannelId(params.rawChannelId);
	if (resolved) return resolved;
	const fallback = normalizeOptionalLowercaseString(params.rawChannelId);
	if (!fallback) return null;
	return params.metadataByProvider.has(fallback) ? fallback : null;
}
/** Build stable provider labels/default accounts without resolving live account state. */
function buildProviderSummaryMetadataIndex(cfg) {
	const metadata = new Map(listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: false }).map((plugin) => [plugin.id, {
		label: plugin.meta.label,
		defaultAccountId: resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds: plugin.config.listAccountIds(cfg)
		}),
		visibleInConfiguredLists: isChannelVisibleInConfiguredLists(plugin.meta)
	}]));
	const missingChannelIds = listExplicitConfiguredChannelIdsForConfig(cfg).filter((channelId) => !metadata.has(channelId));
	const missingHints = resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		channelIds: missingChannelIds
	});
	for (const hint of missingHints) metadata.set(hint.channelId, {
		label: hint.label,
		defaultAccountId: DEFAULT_ACCOUNT_ID,
		visibleInConfiguredLists: true,
		repairHint: hint.repairHint
	});
	return metadata;
}
function isUnresolvedSecretRefResolutionError(error) {
	return error instanceof Error && typeof error.message === "string" && /unresolved SecretRef/i.test(error.message);
}
function formatChannelAccountLabel(params) {
	return `${params.providerLabel ?? params.provider} ${params.name?.trim() ? `${params.accountId} (${params.name.trim()})` : params.accountId}`;
}
function formatProviderState(entry) {
	const parts = [entry.state];
	if (entry.enabled === false && entry.state !== "disabled") parts.push("disabled");
	return parts.join(", ");
}
async function resolveReadOnlyAccount(params) {
	if (params.plugin.config.inspectAccount) return await Promise.resolve(params.plugin.config.inspectAccount(params.cfg, params.accountId));
	return params.plugin.config.resolveAccount(params.cfg, params.accountId);
}
/** Inspect configured provider accounts and classify their display state. */
async function buildProviderStatusIndex(cfg) {
	const map = /* @__PURE__ */ new Map();
	for (const plugin of listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: false })) {
		const accountIds = plugin.config.listAccountIds(cfg);
		for (const accountId of accountIds) {
			let account;
			try {
				account = await resolveReadOnlyAccount({
					plugin,
					cfg,
					accountId
				});
			} catch (error) {
				if (!isUnresolvedSecretRefResolutionError(error)) throw error;
				recordProviderAccountStatus(map, {
					provider: plugin.id,
					providerLabel: plugin.meta.label,
					accountId,
					state: "configured unavailable",
					configured: true,
					visibleInConfiguredLists: isChannelVisibleInConfiguredLists(plugin.meta)
				});
				continue;
			}
			if (!account) continue;
			const snapshot = plugin.config.describeAccount?.(account, cfg);
			const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : typeof snapshot?.enabled === "boolean" ? snapshot.enabled : account.enabled;
			const configured = plugin.config.isConfigured ? await plugin.config.isConfigured(account, cfg) : snapshot?.configured;
			const resolvedEnabled = typeof enabled === "boolean" ? enabled : true;
			const resolvedConfigured = typeof configured === "boolean" ? configured : true;
			const inspectedConfigured = account.configured;
			const configuredIntent = typeof inspectedConfigured === "boolean" ? inspectedConfigured : snapshot?.configured === true;
			const configuredUnavailable = !resolvedConfigured && configuredIntent && (hasConfiguredUnavailableCredentialStatus(snapshot) || hasConfiguredUnavailableCredentialStatus(account));
			const linkState = resolvedConfigured && plugin.config.isLinked ? await plugin.config.isLinked(account, cfg) : void 0;
			const linked = resolveChannelAccountLinked(linkState, snapshot?.linked);
			const fallbackState = plugin.status?.resolveAccountState?.({
				account,
				cfg,
				configured: resolvedConfigured,
				enabled: resolvedEnabled
			});
			const state = configuredUnavailable ? "configured unavailable" : projectChannelAccountDisplayState(resolveChannelAccountState({
				enabled: resolvedEnabled,
				configured: resolvedConfigured,
				linked
			}), fallbackState);
			const name = snapshot?.name ?? account.name;
			recordProviderAccountStatus(map, {
				provider: plugin.id,
				providerLabel: plugin.meta.label,
				accountId,
				name,
				state,
				enabled,
				configured: configuredUnavailable || configured,
				visibleInConfiguredLists: isChannelVisibleInConfiguredLists(plugin.meta)
			});
		}
	}
	return map;
}
function resolveBindingAccountId(binding) {
	const accountId = binding.match.accountId?.trim();
	return accountId === "*" ? accountId : normalizeAccountId(accountId);
}
function shouldShowProviderEntry(params) {
	if ((params.entry.visibleInConfiguredLists ?? params.metadataByProvider.get(params.entry.provider)?.visibleInConfiguredLists) === false) {
		const providerConfig = params.cfg[params.entry.provider];
		return Boolean(params.entry.configured) || Boolean(providerConfig);
	}
	return Boolean(params.entry.configured);
}
function formatProviderEntry(entry) {
	return `${formatChannelAccountLabel({
		provider: entry.provider,
		providerLabel: entry.providerLabel,
		accountId: entry.accountId,
		name: entry.name
	})}: ${formatProviderState(entry)}`;
}
function formatMissingProviderEntry(params) {
	const label = formatChannelAccountLabel({
		provider: params.provider,
		providerLabel: params.metadata?.label,
		accountId: params.accountId
	});
	if (params.metadata?.repairHint) return `${label}: missing plugin - ${params.metadata.repairHint}`;
	return `${label}: unknown`;
}
/** Render the provider/account routes implied by an agent's route bindings. */
function summarizeBindings(cfg, bindings, metadataByProvider = buildProviderSummaryMetadataIndex(cfg)) {
	if (bindings.length === 0) return [];
	const seen = /* @__PURE__ */ new Map();
	for (const binding of bindings) {
		const channel = resolveProviderChannelId({
			rawChannelId: binding.match.channel,
			metadataByProvider
		});
		if (!channel) continue;
		const accountId = resolveBindingAccountId(binding);
		const key = `${channel}:${accountId}`;
		if (!seen.has(key)) {
			const label = formatChannelAccountLabel({
				provider: channel,
				providerLabel: metadataByProvider.get(channel)?.label,
				accountId
			});
			seen.set(key, label);
		}
	}
	return [...seen.values()];
}
/** Render provider status lines relevant to a specific agent summary. */
function listProvidersForAgent(params) {
	let allProviderEntries;
	const metadataByProvider = params.providerMetadata ?? buildProviderSummaryMetadataIndex(params.cfg);
	if (params.bindings.length > 0) {
		const linesByAccount = /* @__PURE__ */ new Map();
		for (const binding of params.bindings) {
			const channel = resolveProviderChannelId({
				rawChannelId: binding.match.channel,
				metadataByProvider
			});
			if (!channel) continue;
			const accountId = resolveBindingAccountId(binding);
			const statuses = accountId === "*" ? (allProviderEntries ??= [...params.providerStatus.values()]).filter((entry) => entry.provider === channel) : [params.providerStatus.get(providerAccountKey(channel, accountId))];
			for (const status of statuses.length > 0 ? statuses : [void 0]) linesByAccount.set(status ? providerAccountKey(channel, status.accountId) : `${channel}:${accountId}`, status ? formatProviderEntry(status) : formatMissingProviderEntry({
				provider: channel,
				accountId,
				metadata: metadataByProvider.get(channel)
			}));
		}
		return [...linesByAccount.values()];
	}
	const providerLines = [];
	if (params.summaryIsDefault) {
		const seenProviders = /* @__PURE__ */ new Set();
		for (const entry of params.providerStatus.values()) if (shouldShowProviderEntry({
			entry,
			cfg: params.cfg,
			metadataByProvider
		})) {
			providerLines.push(formatProviderEntry(entry));
			seenProviders.add(entry.provider);
		}
		for (const [provider, metadata] of metadataByProvider.entries()) {
			if (!metadata.repairHint || seenProviders.has(provider)) continue;
			providerLines.push(formatMissingProviderEntry({
				provider,
				accountId: metadata.defaultAccountId,
				metadata
			}));
		}
	}
	return providerLines;
}
//#endregion
//#region src/commands/agents.commands.list.ts
function formatSummaryHeader(summary) {
	const safe = sanitizeTerminalText;
	const defaultTag = `${summary.isDefault ? " (default)" : ""}${summary.status === "degraded" ? " (degraded)" : ""}`;
	return summary.name && summary.name !== summary.id ? `${safe(summary.id)}${defaultTag} (${safe(summary.name)})` : `${safe(summary.id)}${defaultTag}`;
}
function formatSummary(summary) {
	const safe = sanitizeTerminalText;
	const header = formatSummaryHeader(summary);
	const identityParts = [];
	if (summary.identityEmoji) identityParts.push(safe(summary.identityEmoji));
	if (summary.identityName) identityParts.push(safe(summary.identityName));
	const identityLine = identityParts.length > 0 ? identityParts.join(" ") : null;
	const identitySource = summary.identitySource === "identity" ? "IDENTITY.md" : summary.identitySource === "config" ? "config" : null;
	const lines = [`- ${header}`];
	if (summary.admissionRefusal) {
		lines.push(`  Refused: ${safe(summary.admissionRefusal.reason)}`);
		lines.push(`  Repair: ${safe(summary.admissionRefusal.repairHint)}`);
	}
	if (identityLine) lines.push(`  Identity: ${identityLine}${identitySource ? ` (${identitySource})` : ""}`);
	lines.push(`  Workspace: ${safe(shortenHomePath(summary.workspace))}`);
	lines.push(`  Agent dir: ${safe(shortenHomePath(summary.agentDir))}`);
	if (summary.model) lines.push(`  Model: ${safe(summary.model)}`);
	lines.push(`  Routing rules: ${summary.bindings}`);
	if (summary.routes?.length) lines.push(`  Routing: ${summary.routes.map(safe).join(", ")}`);
	if (summary.providers?.length) {
		lines.push("  Providers:");
		for (const provider of summary.providers) lines.push(`    - ${safe(provider)}`);
	}
	if (summary.bindingDetails?.length) {
		lines.push("  Routing rules:");
		for (const binding of summary.bindingDetails) lines.push(`    - ${safe(binding)}`);
	}
	return lines.join("\n");
}
function formatAgentTree(summaries, provenance) {
	const summaryById = new Map(summaries.map((summary) => [summary.id, summary]));
	const provenanceById = new Map(provenance.map((record) => [record.agentId, record]));
	const childrenById = /* @__PURE__ */ new Map();
	const roots = [];
	for (const summary of summaries) {
		const creatorAgentId = provenanceById.get(summary.id)?.creatorAgentId;
		if (creatorAgentId && creatorAgentId !== summary.id && summaryById.has(creatorAgentId)) {
			const children = childrenById.get(creatorAgentId) ?? [];
			children.push(summary);
			childrenById.set(creatorAgentId, children);
		} else roots.push(summary);
	}
	const lines = [];
	const visited = /* @__PURE__ */ new Set();
	const append = (summary, depth) => {
		if (visited.has(summary.id)) return;
		visited.add(summary.id);
		lines.push(`${"  ".repeat(depth)}- ${formatSummaryHeader(summary)}`);
		for (const child of childrenById.get(summary.id) ?? []) append(child, depth + 1);
	};
	roots.forEach((summary) => append(summary, 0));
	summaries.forEach((summary) => append(summary, 0));
	return lines;
}
/** Print configured agent summaries with optional binding/provider detail enrichment. */
async function agentsListCommand(opts, runtime = defaultRuntime) {
	const cfg = await requireValidConfig(runtime, { adoptPluginMetadata: true });
	if (!cfg) return;
	if (!hasAgentDatabaseAdmissions()) recordAgentDatabaseAdmissions(await evaluateAgentDatabaseAdmissions(cfg));
	const summaries = buildAgentSummaries(cfg);
	const provenance = opts.tree ? await listAgentProvenance() : [];
	if (opts.json) {
		const records = await readAgentProvenanceForDisplay(summaries.map((summary) => summary.id));
		const recordsById = new Map(records.map((record) => [record.agentId, record]));
		for (const summary of summaries) {
			const record = recordsById.get(summary.id);
			if (record) {
				summary.createdVia = record.createdVia;
				summary.creatorAgentId = record.creatorAgentId;
				summary.createdAt = record.createdAtMs;
			}
		}
	}
	const bindingMap = /* @__PURE__ */ new Map();
	for (const binding of listRouteBindings(cfg)) {
		const agentId = normalizeAgentId(binding.agentId);
		const list = bindingMap.get(agentId) ?? [];
		list.push(binding);
		bindingMap.set(agentId, list);
	}
	if (opts.bindings) for (const summary of summaries) {
		const bindings = bindingMap.get(summary.id) ?? [];
		if (bindings.length > 0) summary.bindingDetails = bindings.map((binding) => describeBinding(binding));
	}
	const includeProviderDetails = !opts.json && !opts.tree || opts.bindings === true;
	const providerStatus = includeProviderDetails ? await buildProviderStatusIndex(cfg) : null;
	const providerMetadata = includeProviderDetails ? buildProviderSummaryMetadataIndex(cfg) : null;
	for (const summary of summaries) {
		const bindings = bindingMap.get(summary.id) ?? [];
		if (includeProviderDetails && providerStatus && providerMetadata) {
			const routes = summarizeBindings(cfg, bindings, providerMetadata);
			if (routes.length > 0) summary.routes = routes;
			else if (summary.isDefault) summary.routes = ["default (no explicit rules)"];
			const providerLines = listProvidersForAgent({
				summaryIsDefault: summary.isDefault,
				cfg,
				bindings,
				providerStatus,
				providerMetadata
			});
			if (providerLines.length > 0) summary.providers = providerLines;
		}
	}
	if (opts.json) {
		writeRuntimeJson(runtime, summaries);
		return;
	}
	if (opts.tree) {
		runtime.log(["Agents:", ...formatAgentTree(summaries, provenance)].join("\n"));
		return;
	}
	const lines = ["Agents:", ...summaries.map(formatSummary)];
	lines.push("Routing rules map channel/account/peer to an agent. Use --bindings for full rules.");
	lines.push(`Channel status reflects local config/creds. For live health: ${formatCliCommand("openclaw channels status --probe")}.`);
	runtime.log(lines.join("\n"));
}
//#endregion
export { agentsListCommand };
