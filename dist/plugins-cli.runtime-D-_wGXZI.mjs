import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { f as shortenHomeInString, p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { c as tracePluginLifecyclePhaseAsync } from "./discovery-Dma3bVNk.mjs";
import { A as resolvePluginInstallSources } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-DxQ8TaVy.mjs";
import { c as readConfigFileSnapshot, r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { i as resolveConfiguredRuntimePluginInstallCandidate } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { t as collectConfiguredRuntimePluginIds } from "./configured-runtime-plugin-owners-CG58HYQG.mjs";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-C9XqXUw9.mjs";
import { a as formatMissingPluginMessage } from "./error-format-BaRMqGR7.mjs";
//#region src/cli/plugins-cli.runtime.ts
function countEnabledPlugins(plugins) {
	return plugins.filter((plugin) => plugin.enabled).length;
}
function reportMissingPlugin(id) {
	defaultRuntime.error(formatMissingPluginMessage({
		id,
		includeSearch: true
	}));
	return defaultRuntime.exit(1);
}
function isConfigSelectedShadowDiagnostic(entry) {
	return (entry.level === "info" || entry.level === "warn") && typeof entry.message === "string" && entry.message.includes("duplicate plugin id resolved by explicit config-selected plugin");
}
function collectConfiguredRuntimePluginWarnings(params) {
	const enabledPluginIds = new Set(params.plugins.filter((plugin) => plugin.enabled !== false && plugin.status !== "disabled").map((plugin) => plugin.id));
	return collectConfiguredRuntimePluginIds(params.cfg, { includeImplicitRuntimePreferences: false }).flatMap((pluginId) => {
		const candidate = resolveConfiguredRuntimePluginInstallCandidate(pluginId);
		if (!candidate || enabledPluginIds.has(pluginId)) return [];
		const disabledPluginRecord = params.plugins.find((plugin) => plugin.id === pluginId);
		const policy = params.cfg.plugins;
		const prefix = `- Configured runtime "${pluginId}" requires the ${candidate.label} plugin`;
		const alternative = pluginId === "acpx" ? "disable ACP/acpx in acp config" : "change the runtime policy to \"openclaw\"";
		let blockedGuidance;
		if (policy?.enabled === false) blockedGuidance = `Enable plugin loading and the "${pluginId}" plugin, or ${alternative}.`;
		else if (Array.isArray(policy?.deny) && policy.deny.some((entry) => entry.trim() === pluginId)) blockedGuidance = `Remove "${pluginId}" from plugins.deny and enable the "${pluginId}" plugin, or ${alternative}.`;
		else if (policy?.entries?.[pluginId]?.enabled === false) blockedGuidance = `Set plugins.entries.${pluginId}.enabled=true or remove that disabled entry, or ${alternative}.`;
		if (blockedGuidance) return [`${prefix}, but "${pluginId}" is blocked by plugin configuration. ${blockedGuidance}`];
		if (disabledPluginRecord) {
			const allow = policy?.allow;
			return [`${prefix}, but "${pluginId}" is disabled. ${Array.isArray(allow) && allow.length > 0 && !allow.includes(pluginId) ? `Add "${pluginId}" to plugins.allow and enable the plugin, or ${alternative}.` : `Enable the "${pluginId}" plugin, or ${alternative}.`}`];
		}
		const installSpec = resolvePluginInstallSources(candidate)[0]?.spec ?? candidate.pluginId;
		return [`${prefix}, but no enabled "${pluginId}" plugin was found. Run "openclaw doctor --fix" to install ${installSpec}, or install it manually with "openclaw plugins install ${installSpec}".`];
	});
}
async function applyPluginEnabledThroughGateway(pluginId, enabled, opts = {}) {
	const { resolvePluginLifecycleGateway } = await import("./plugins-lifecycle-client-CR_sTVsX.mjs");
	const gateway = await resolvePluginLifecycleGateway();
	if (!gateway) return false;
	const consent = resolvePluginCapabilityConsentCliOptions({
		...opts,
		action: "enable"
	});
	const result = await gateway("plugins.setEnabled", {
		pluginId,
		enabled,
		...enabled ? { allowlistPolicy: "preserve" } : {}
	}, consent.onCapabilityConsent);
	for (const warning of result.warnings ?? []) defaultRuntime.log(theme.warn(warning));
	defaultRuntime.log(`${enabled ? "Enabled" : "Disabled"} plugin "${result.plugin.id}".`);
	return true;
}
/** Enable a plugin in config and refresh the registry snapshot for the changed policy. */
async function runPluginsEnableCommand(id, opts = {}) {
	await runPluginPolicyCommand(id, true, opts.acceptCapabilities);
}
/** Disable a plugin in config and refresh the registry snapshot for the changed policy. */
async function runPluginsDisableCommand(id) {
	await runPluginPolicyCommand(id, false);
}
async function runPluginPolicyCommand(id, enabled, acceptCapabilities) {
	assertConfigWriteAllowedInCurrentMode();
	if (await applyPluginEnabledThroughGateway(id, enabled, { acceptCapabilities })) return;
	const { mutateManagedPluginEnabled } = await import("./management-mutations-BhilVx9b.mjs");
	const { ManagedPluginLifecycleError } = await import("./management-lifecycle-error-DS4OoRDN.mjs");
	await withPluginLifecycleLease({}, async () => {
		try {
			const result = await mutateManagedPluginEnabled({
				pluginId: id,
				enabled,
				caller: "cli",
				requestCapabilityConsent: acceptCapabilities,
				...resolvePluginCapabilityConsentCliOptions({
					acceptCapabilities,
					action: "enable"
				})
			});
			if (result.status === "missing") return reportMissingPlugin(result.pluginId);
			if (result.status === "blocked") {
				defaultRuntime.error(`Plugin "${result.pluginId}" could not be enabled (${result.reason ?? "unknown reason"}).`);
				return defaultRuntime.exit(1);
			}
			for (const warning of result.warnings) defaultRuntime.log(theme.warn(warning));
			defaultRuntime.log(`${enabled ? "Enabled" : "Disabled"} plugin "${result.pluginId}". Saved for the next Gateway start.`);
		} catch (error) {
			if (!(error instanceof ManagedPluginLifecycleError) || !error.capabilityConsent) throw error;
			defaultRuntime.error(error.message);
			return defaultRuntime.exit(1);
		}
	});
}
async function runPluginsInstallAction(raw, opts) {
	await tracePluginLifecyclePhaseAsync("install command", async () => {
		const { runPluginInstallCommand } = await import("./plugins-install-command-BzqGHsQ1.mjs");
		await runPluginInstallCommand({
			raw,
			opts,
			allowInstallPolicyWarningPrompt: true,
			invalidateRuntimeCache: false
		});
	}, { command: "install" });
}
/** Inspect or refresh the persisted plugin registry index. */
async function runPluginsRegistryCommand(opts) {
	const { inspectPluginRegistry } = await import("./plugin-registry-CZKgaOrF.mjs");
	const formatDifferences = (differences) => {
		const formatSource = (source) => source ? sanitizeTerminalText(shortenHomePath(source)) : "missing";
		return differences.map((difference) => `${sanitizeTerminalText(difference.pluginId)}: ${difference.changed.join("+")} changed; persisted ${formatSource(difference.persistedSource)}; derived ${formatSource(difference.derivedSource)}`);
	};
	if (opts.refresh) {
		const { refreshPluginRegistry } = await import("./plugin-registry-refresh-BgEChwY4.mjs");
		return await withPluginLifecycleLease({}, async () => {
			const config = getRuntimeConfig();
			const index = await refreshPluginRegistry({
				config,
				reason: "manual"
			});
			const inspection = await inspectPluginRegistry({ config });
			if (inspection.state !== "fresh") {
				const message = [
					"Plugin registry refresh could not verify the persisted replacement.",
					...formatDifferences(inspection.differences).map((difference) => `- ${difference}`),
					"Stop plugin package changes, then run `openclaw plugins registry --refresh` again."
				].join("\n");
				if (opts.json) {
					defaultRuntime.writeJson({
						...formatCliJsonFailure(message),
						refreshed: false,
						state: inspection.state,
						refreshReasons: inspection.refreshReasons,
						differences: inspection.differences
					});
					exitCliAfterOutput(defaultRuntime, 1);
				}
				throw new Error(message);
			}
			if (opts.json) {
				defaultRuntime.writeJson({
					refreshed: true,
					state: inspection.state,
					refreshReasons: inspection.refreshReasons,
					differences: inspection.differences,
					registry: index
				});
				return;
			}
			const total = index.plugins.length;
			const enabled = countEnabledPlugins(index.plugins);
			defaultRuntime.log(`Plugin registry refreshed: ${enabled}/${total} enabled plugins indexed.`);
		});
	}
	const inspection = await inspectPluginRegistry({ config: getRuntimeConfig() });
	if (opts.json) {
		defaultRuntime.writeJson({
			state: inspection.state,
			refreshReasons: inspection.refreshReasons,
			differences: inspection.differences,
			persisted: inspection.persisted,
			current: inspection.current
		});
		return;
	}
	const currentTotal = inspection.current.plugins.length;
	const currentEnabled = countEnabledPlugins(inspection.current.plugins);
	const persistedTotal = inspection.persisted?.plugins.length ?? 0;
	const persistedEnabled = inspection.persisted ? countEnabledPlugins(inspection.persisted.plugins) : 0;
	const lines = [
		`${theme.muted("State:")} ${inspection.state === "fresh" ? theme.success(inspection.state) : theme.warn(inspection.state)}`,
		`${theme.muted("Current:")} ${currentEnabled}/${currentTotal} enabled plugins`,
		`${theme.muted("Persisted:")} ${persistedEnabled}/${persistedTotal} enabled plugins`
	];
	if (inspection.refreshReasons.length > 0) {
		lines.push(`${theme.muted("Refresh reasons:")} ${inspection.refreshReasons.join(", ")}`);
		lines.push(...formatDifferences(inspection.differences).map((difference) => `- ${difference}`));
		lines.push(`${theme.muted("Repair:")} ${theme.command("openclaw plugins registry --refresh")}`);
	}
	defaultRuntime.log(lines.join("\n"));
}
/** Print plugin install-tree, compatibility, and plugin-owned config diagnostics. */
async function runPluginsDoctorCommand(opts = {}) {
	const { buildPluginCompatibilityNotices, withPluginDiagnosticsReportForInspection, formatPluginCompatibilityNotice } = await import("./status-Cka81dom.mjs");
	const { collectStalePluginConfigWarnings, isStalePluginAutoRepairBlocked, scanStalePluginConfig } = await import("./stale-plugin-config-OTqEcQOA.mjs");
	const cfg = getRuntimeConfig();
	const configSnapshot = await readConfigFileSnapshot().catch(() => null);
	const sourceCfg = configSnapshot?.sourceConfig ?? configSnapshot?.config ?? cfg;
	let exitCode = 1;
	const output = await withPluginDiagnosticsReportForInspection({
		config: cfg,
		effectiveOnly: true
	}, (report) => {
		const errors = report.plugins.filter((p) => p.status === "error");
		const diags = report.diagnostics.filter((entry) => !isConfigSelectedShadowDiagnostic(entry));
		const shadowed = report.diagnostics.filter((entry) => entry.pluginId && isConfigSelectedShadowDiagnostic(entry) && report.plugins.some((plugin) => plugin.id === entry.pluginId && plugin.origin === "config" && plugin.status === "error"));
		const compatibility = buildPluginCompatibilityNotices({ report });
		const pluginConfigWarnings = /* @__PURE__ */ new Set([
			...formatConfigIssueLines((configSnapshot?.warnings ?? []).filter(({ path }) => path === "plugins" || path.startsWith("plugins."))),
			...collectStalePluginConfigWarnings({
				hits: scanStalePluginConfig(sourceCfg, process.env),
				doctorFixCommand: "openclaw doctor --fix",
				autoRepairBlocked: isStalePluginAutoRepairBlocked(sourceCfg, process.env)
			}),
			...collectConfiguredRuntimePluginWarnings({
				cfg: sourceCfg,
				plugins: report.plugins
			})
		]);
		const hasInstallTreeIssues = [
			errors,
			diags,
			shadowed
		].some(({ length }) => length > 0) || compatibility.some(({ severity }) => severity === "warn");
		const doctorOk = !hasInstallTreeIssues && pluginConfigWarnings.size === 0;
		exitCode = doctorOk ? 0 : 1;
		if (opts.json) return JSON.stringify({
			ok: doctorOk,
			pluginErrors: errors.map((entry) => ({
				id: entry.id,
				...entry.failurePhase ? { failurePhase: entry.failurePhase } : {},
				error: shortenHomeInString(entry.error ?? "failed to load"),
				source: shortenHomePath(entry.source)
			})),
			diagnostics: diags.map(({ message, source, ...diagnostic }) => ({
				...diagnostic,
				message: shortenHomeInString(message),
				...source ? { source: shortenHomePath(source) } : {}
			})),
			sourceShadowing: shadowed.map((entry) => {
				const active = report.plugins.find((plugin) => plugin.id === entry.pluginId);
				return {
					...entry.pluginId ? { pluginId: entry.pluginId } : {},
					message: shortenHomeInString(entry.message),
					...active ? { active: {
						source: shortenHomePath(active.source),
						origin: active.origin,
						status: active.status,
						...active.error ? { error: shortenHomeInString(active.error) } : {}
					} } : {},
					...entry.source ? { shadowedSource: shortenHomePath(entry.source) } : {},
					repair: [
						`openclaw plugins inspect ${entry.pluginId ?? "<plugin-id>"}`,
						"edit or remove the config-selected plugin source",
						"openclaw plugins registry --refresh",
						`openclaw plugins reload ${entry.pluginId ?? "<plugin-id>"}`
					]
				};
			}),
			compatibility: compatibility.map((notice) => ({
				...notice,
				message: shortenHomeInString(notice.message)
			})),
			configurationWarnings: Array.from(pluginConfigWarnings, shortenHomeInString)
		}, null, 2);
		const healthyMessage = "Plugin discovery, module loading, compatibility, and configuration checks passed. Run \"openclaw health\" to check the running Gateway, including runtime quarantines and fallbacks.";
		if (!hasInstallTreeIssues && pluginConfigWarnings.size === 0 && compatibility.length === 0) return healthyMessage;
		const lines = [];
		const appendSection = (title, content) => {
			if (content.length > 0) {
				if (lines.length > 0) lines.push("");
				lines.push(title, ...content);
			}
		};
		appendSection(theme.error("Plugin errors:"), errors.map((entry) => {
			const phase = entry.failurePhase ? ` [${entry.failurePhase}]` : "";
			return `- ${entry.id}${phase}: ${entry.error ?? "failed to load"} (${entry.source})`;
		}));
		appendSection(theme.warn("Diagnostics:"), diags.map((diag) => {
			return `- ${diag.pluginId ? `${diag.pluginId}: ` : ""}${diag.message}`;
		}));
		appendSection(theme.warn("Plugin source shadowing:"), shadowed.flatMap((diag) => {
			const active = report.plugins.find((plugin) => plugin.id === diag.pluginId);
			const details = [`- ${diag.pluginId ? `${diag.pluginId}: ` : ""}${diag.message}`];
			if (active) {
				details.push(`  active: ${shortenHomePath(active.source)} (${active.origin})`);
				if (active.status === "error") details.push(`  active status: error${active.error ? `: ${active.error}` : ""}`);
			}
			if (diag.source) details.push(`  shadowed: ${shortenHomePath(diag.source)}`);
			details.push("  repair:", "    openclaw plugins inspect " + (diag.pluginId ?? "<plugin-id>"), "    edit or remove the config-selected plugin source", "    openclaw plugins registry --refresh", "    openclaw plugins reload " + (diag.pluginId ?? "<plugin-id>"));
			return details;
		}));
		appendSection(theme.warn("Compatibility:"), compatibility.map((notice) => {
			const marker = notice.severity === "warn" ? theme.warn("warn") : theme.muted("info");
			return `- ${formatPluginCompatibilityNotice(notice)} [${marker}]`;
		}));
		appendSection(theme.warn("Plugin configuration:"), [...pluginConfigWarnings]);
		if (!hasInstallTreeIssues) {
			const summary = pluginConfigWarnings.size ? "No plugin install-tree issues detected; configuration warnings remain." : healthyMessage;
			lines.push("", summary);
		}
		const docs = formatDocsLink("/plugin", "docs.openclaw.ai/plugin");
		lines.push("");
		lines.push(`${theme.muted("Docs:")} ${docs}`);
		return lines.join("\n");
	});
	process.exitCode = exitCode;
	if (opts.json) defaultRuntime.writeStdout(output);
	else defaultRuntime.log(output);
}
function classifyMarketplaceFeedFallback(error) {
	const text = error?.toLowerCase();
	if (!text) return;
	return [
		[/offline mode/u, "offline"],
		[/checksum mismatch/u, "checksum_mismatch"],
		[/schema/u, "schema"],
		[/http\s+304/u, "not_modified"],
		[/http\s+\d{3}/u, "http_error"],
		[/timed out|timeout/u, "timeout"]
	].find(([pattern]) => pattern.test(text))?.[1] ?? "error";
}
function emitMarketplaceFeedTelemetry(params) {
	const attributes = {
		command: params.command,
		entries: params.entryCount ?? params.payload.entries,
		source: params.payload.source
	};
	if (params.opts.feedProfile?.trim()) attributes.feedProfileProvided = true;
	if (params.opts.feedUrl?.trim()) attributes.feedUrlOverride = true;
	if (params.opts.offline === true) attributes.offline = true;
	if (params.opts.expectedSha256?.trim()) attributes.expectedSha256Provided = true;
	if (params.payload.feed) {
		attributes.feedIdPresent = true;
		attributes.feedSequence = params.payload.feed.sequence;
	}
	if (params.payload.metadata) {
		attributes.httpStatus = params.payload.metadata.status;
		if (params.payload.metadata.checksum) attributes.payloadChecksumPresent = true;
		attributes.hasEtag = Boolean(params.payload.metadata.etag);
		attributes.hasLastModified = Boolean(params.payload.metadata.lastModified);
	}
	if (params.payload.snapshot) attributes.snapshotUsed = true;
	if (params.payload.trust) {
		attributes.feedTrustVerified = true;
		attributes.feedTrustMode = params.payload.trust.mode;
		attributes.feedTrustSignatureCount = params.payload.trust.signatureCount;
		attributes.feedTrustThreshold = params.payload.trust.threshold;
	}
	const fallbackCategory = classifyMarketplaceFeedFallback(params.payload.error);
	if (fallbackCategory) attributes.fallbackCategory = fallbackCategory;
	if (params.failedPinnedRefresh === true) attributes.pinnedRefreshFailed = true;
	emitDiagnosticsTimelineEvent({
		type: "mark",
		name: `plugins.marketplace.feed.${params.command}`,
		phase: "plugin-marketplace",
		attributes
	}, { config: params.config });
}
function buildMarketplaceRefreshPayload(result, feedUrl) {
	const payload = {
		source: result.source,
		entries: result.entries.length,
		...result.metadata ? { metadata: result.metadata } : {}
	};
	if (result.source === "hosted" || result.source === "hosted-snapshot") {
		payload.feed = {
			id: result.feed.id,
			generatedAt: result.feed.generatedAt,
			sequence: result.feed.sequence
		};
		if (result.trust) payload.trust = {
			mode: result.trust.mode,
			signedBy: result.trust.signedBy,
			signatureCount: result.trust.signatureCount,
			threshold: result.trust.threshold,
			verifiedAt: result.trust.verifiedAt
		};
	}
	if (result.source === "hosted-snapshot") {
		payload.snapshot = { savedAt: result.snapshot.savedAt };
		payload.error = result.error;
	}
	if (result.source === "bundled-fallback") payload.error = result.error;
	const rawMetadataUrl = payload.metadata?.url;
	if (payload.metadata) payload.metadata = {
		...payload.metadata,
		url: redactMarketplaceFeedUrl(payload.metadata.url)
	};
	if (payload.error) payload.error = redactMarketplaceOutputText(payload.error, [feedUrl, rawMetadataUrl]);
	return payload;
}
function redactMarketplaceFeedUrl(value) {
	try {
		const url = new URL(value);
		url.username = "";
		url.password = "";
		url.search = "";
		url.hash = "";
		return url.href;
	} catch {
		return value;
	}
}
function redactMarketplaceOutputText(value, rawUrls) {
	let redacted = value;
	for (const rawUrl of rawUrls) {
		if (!rawUrl) continue;
		redacted = redacted.replaceAll(rawUrl, () => redactMarketplaceFeedUrl(rawUrl));
	}
	return redacted;
}
function formatMarketplaceEntryLine(entry) {
	const id = entry.id ?? entry.name ?? entry.label;
	const install = resolvePluginInstallSources(entry.install ?? {})[0]?.spec ?? entry.install?.localPath;
	const suffix = install ? " " + theme.muted(install) : "";
	const label = entry.label !== id ? " " + theme.muted(entry.label) : "";
	return theme.command(id) + label + suffix;
}
function formatMarketplaceRefreshSource(source) {
	if (source === "hosted") return theme.success("hosted");
	if (source === "hosted-snapshot") return theme.warn("hosted snapshot");
	return theme.warn("bundled fallback");
}
function formatMarketplaceFeedTrust(trust) {
	return `${trust.mode} by ${trust.signedBy} (${trust.signatureCount}/${trust.threshold}) verified ${trust.verifiedAt}`;
}
function formatMarketplaceFeedLines(payload, options = {}) {
	const lines = [`${theme.muted("Source:")} ${formatMarketplaceRefreshSource(payload.source)}`, `${theme.muted("Entries:")} ${payload.entries}`];
	if (payload.feed) lines.push(`${theme.muted("Feed:")} ${payload.feed.id} ${theme.muted(`sequence ${payload.feed.sequence}`)}`);
	if (payload.metadata?.url) lines.push(`${theme.muted("URL:")} ${payload.metadata.url}`);
	if (options.includeChecksum && payload.metadata?.checksum) lines.push(`${theme.muted("SHA-256:")} ${payload.metadata.checksum}`);
	if (payload.snapshot?.savedAt) lines.push(`${theme.muted("Snapshot:")} ${payload.snapshot.savedAt}`);
	if (payload.trust) lines.push(`${theme.muted("Trust:")} ${formatMarketplaceFeedTrust(payload.trust)}`);
	if (payload.error) lines.push(`${theme.muted("Fallback reason:")} ${payload.error}`);
	return lines;
}
function normalizeMarketplaceExpectedSha256(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	const hash = /^(?:sha256:)?([0-9a-f]{64})$/iu.exec(trimmed)?.[1];
	return hash ? `sha256:${hash.toLowerCase()}` : trimmed;
}
/** List entries from the configured OpenClaw marketplace feed. */
async function runPluginMarketplaceEntriesCommand(opts) {
	const catalog = await import("./official-external-plugin-catalog-CcypjqKN.mjs");
	const cfg = getRuntimeConfig();
	const result = await catalog.loadConfiguredHostedOfficialExternalPluginCatalogEntries({
		...opts.feedProfile ? { feedProfile: opts.feedProfile } : {},
		...opts.feedUrl ? { feedUrl: opts.feedUrl } : {},
		...opts.offline ? { offline: true } : {}
	});
	const summary = buildMarketplaceRefreshPayload(result, opts.feedUrl);
	const entries = result.entries.map((entry) => {
		const id = catalog.resolveOfficialExternalPluginId(entry);
		const install = catalog.resolveOfficialExternalPluginInstall(entry) ?? void 0;
		const payload = { label: catalog.resolveOfficialExternalPluginLabel(entry) };
		if (id) payload.id = id;
		if (entry.kind) payload.kind = entry.kind;
		if (entry.name) payload.name = entry.name;
		if (entry.version) payload.version = entry.version;
		if (install) payload.install = install;
		return payload;
	});
	emitMarketplaceFeedTelemetry({
		command: "entries",
		entryCount: entries.length,
		opts,
		config: cfg,
		payload: summary
	});
	if (opts.json) {
		defaultRuntime.writeJson({
			...summary,
			entries,
			entryCount: entries.length
		});
		return;
	}
	const lines = formatMarketplaceFeedLines(summary);
	if (entries.length > 0) {
		lines.push("");
		lines.push(...entries.map(formatMarketplaceEntryLine));
	}
	defaultRuntime.log(lines.join("\n"));
}
/** Refresh the configured OpenClaw marketplace feed snapshot. */
async function runPluginMarketplaceRefreshCommand(opts) {
	const { resolvePluginLifecycleGateway } = await import("./plugins-lifecycle-client-CR_sTVsX.mjs");
	const gateway = await resolvePluginLifecycleGateway();
	const { loadConfiguredHostedOfficialExternalPluginCatalogEntries } = await import("./official-external-plugin-catalog-CcypjqKN.mjs");
	const cfg = getRuntimeConfig();
	const expectedSha256 = normalizeMarketplaceExpectedSha256(opts.expectedSha256);
	const result = await loadConfiguredHostedOfficialExternalPluginCatalogEntries({
		...opts.feedProfile ? { feedProfile: opts.feedProfile } : {},
		...opts.feedUrl ? { feedUrl: opts.feedUrl } : {},
		...expectedSha256 ? { expectedSha256 } : {},
		requireSnapshotWrite: true
	});
	const { clearManagedPluginCatalogCache } = await import("./management-catalog-C1TXNPb5.mjs");
	clearManagedPluginCatalogCache();
	let runtimeNotice;
	let applicationFailure;
	if (result.source !== "bundled-fallback") {
		if (gateway) try {
			const applied = await gateway("plugins.refresh", {});
			if (!applied.runtime) throw new Error("Marketplace refresh did not return a runtime application receipt.");
			for (const warning of applied.warnings ?? []) (opts.json ? defaultRuntime.error : defaultRuntime.log)(theme.warn(warning));
			runtimeNotice = `Marketplace catalog applied in Gateway generation ${applied.runtime.generation}.`;
		} catch (error) {
			applicationFailure = `Marketplace catalog saved, but Gateway runtime application failed: ${sanitizeTerminalText(error instanceof Error ? error.message : String(error))}. Repair the reported problem, then rerun this refresh.`;
		}
		else runtimeNotice = "Marketplace catalog saved for the next Gateway start.";
	}
	const payload = buildMarketplaceRefreshPayload(result, opts.feedUrl);
	const failedPinnedRefresh = Boolean(expectedSha256?.trim()) && payload.source !== "hosted";
	emitMarketplaceFeedTelemetry({
		command: "refresh",
		failedPinnedRefresh,
		opts,
		config: cfg,
		payload
	});
	if (opts.json) {
		defaultRuntime.writeJson(payload);
		if (!gateway && runtimeNotice) defaultRuntime.error(runtimeNotice);
	} else {
		const lines = formatMarketplaceFeedLines(payload, { includeChecksum: true });
		if (runtimeNotice) lines.push("", runtimeNotice);
		defaultRuntime.log(lines.join("\n"));
	}
	if (applicationFailure) defaultRuntime.error(applicationFailure);
	if (failedPinnedRefresh) defaultRuntime.error(`Pinned marketplace feed refresh did not accept a fresh hosted payload (source: ${payload.source}).`);
	if (applicationFailure || failedPinnedRefresh) return defaultRuntime.exit(1);
}
//#endregion
export { runPluginMarketplaceEntriesCommand, runPluginMarketplaceRefreshCommand, runPluginsDisableCommand, runPluginsDoctorCommand, runPluginsEnableCommand, runPluginsInstallAction, runPluginsRegistryCommand };
