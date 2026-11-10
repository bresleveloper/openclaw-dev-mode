import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { g as sessionBindingIdentity, n as assertCodexBindingMayBeReplaced, r as bindingStoreKey } from "./session-binding-record-BXXjih0v.mjs";
import { r as isCodexFastServiceTier } from "./config-utils-DN_YT7dE.mjs";
import { c as resolveCodexAppServerPreparedApiKeyCacheKey, s as resolveCodexAppServerFallbackApiKeyCacheKey } from "./auth-cache-key-aTVcxfbh.mjs";
import { n as withCodexConversationThreadActivity } from "./thread-ownership-queue-CeyYScUC.mjs";
import { a as canMutateCodexHost, i as assertCodexHostOwnerCurrent, n as CODEX_HOST_INSPECTION_AUTH_ERROR, o as hasCodexAdminScope, r as CODEX_NATIVE_EXECUTION_AUTH_ERROR, t as CODEX_FULL_PERMISSIONS_AUTH_ERROR } from "./command-authorization-AikPDtcc.mjs";
import { l as formatRelativeDuration, s as summarizeCodexAccountUsage } from "./rate-limits-BpfURnuy.mjs";
import { a as formatCodexAccountLine, c as formatCodexTextForDisplay, d as formatModels, f as formatSkills, i as formatAccount, l as formatComputerUseStatus, m as isLikelyEmailAddress, n as buildHelp, o as formatCodexDisplayText, p as formatThreads, r as escapeCodexChatText, s as formatCodexStatus, t as CODEX_RESUME_SAFE_THREAD_ID_PATTERN, u as formatList } from "./command-formatters-B_7-QZ1c.mjs";
import { i as readCodexConversationBindingData, n as createCodexCliNodeConversationBindingData, o as resolveCodexDefaultWorkspaceDir, r as createCodexConversationBindingData } from "./conversation-binding-data-CyPbwaSw.mjs";
import { r as CodexAppServerRpcError } from "./rpc-error-CrpIS8O9.mjs";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-Cul-h11D.mjs";
import { n as filterCodexMarketplacePlugins, r as parseCodexPluginMarketplaceId, t as discoverCodexMarketplacePlugins } from "./plugin-marketplace-discovery-BblHM3DU.mjs";
import { o as formatCodexCliSessions } from "./node-cli-sessions-CZWIhfp1.mjs";
import { a as defaultCodexAppInventoryCache, r as buildCodexPluginAppCacheKey } from "./plugin-app-cache-key-CKBEird9.mjs";
import { i as resolveCodexBindingAppServerConnection } from "./binding-connection-aU49tL0m.mjs";
import { a as withCodexAppServerJsonClient } from "./request-i8njrYRU.mjs";
import { n as findCodexMarketplacePluginSummary, o as pluginReadParams, r as isOpenAiCuratedMarketplaceName, u as CODEX_PLUGINS_MARKETPLACE_NAME } from "./plugin-inventory-C6tZFyJF.mjs";
import "./config-DEC5R1wk.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
import { a as resolveCodexAppServerAuthProfileStore, i as resolveCodexAppServerAuthProfileIdForAgent, n as normalizeCodexAppServerBindingModelProvider, r as resolveCodexAppServerAuthProfileId } from "./auth-profile-auwzSwwy.mjs";
import { M as hasCodexAppServerLiveThread, k as consumeCodexAppServerLiveThread, o as getLeasedSharedCodexAppServerClient, p as releaseLeasedSharedCodexAppServerClient, rt as resolveCodexAppServerAuthAccountCacheKey } from "./shared-client-BEHXwqz5.mjs";
import { f as assertCodexThreadAcceptsDirectInput, i as isCodexAppServerIndeterminateRequestCancellationError, m as assertCodexThreadResumeResponse, o as isCodexAppServerPrewriteRequestCancellationError } from "./client-CKexde4_.mjs";
import { o as closeCodexStartupClientBestEffort } from "./attempt-client-cleanup-CCBoNjA1.mjs";
import { n as fingerprintCodexAppServerAuthBinding } from "./auth-binding-Dwwmv8gT.mjs";
import { n as listAllCodexAppServerModels } from "./models-DnBclhxY.mjs";
import { n as refreshCodexAppRuntimeState, r as refreshCodexPluginRuntimeState } from "./plugin-activation-DhI5eCzu.mjs";
import { i as resolveCodexSessionBinding, n as createCodexSessionGenerationSupersededError } from "./session-binding-2ihjGcI_.mjs";
import { a as rollbackCodexAppServerBindingSubscription, c as withExclusiveCodexAppServerThread, i as retireCodexConversationThreadBinding, n as releaseCodexAppServerBindingSubscription, r as retainCodexAppServerBindingSubscription, t as isSameCodexAppServerThreadOwner } from "./thread-ownership-D2aUUPS_.mjs";
import { n as prepareCodexNativeExecutionBlock, r as prepareCodexNativeSandboxBlock } from "./sandbox-guard-CM3mdNZp.mjs";
import { i as assertCodexSupervisionThreadLineage } from "./thread-policy-euNesaIC.mjs";
import { t as defaultCodexPluginMetadataCache } from "./plugin-metadata-cache-BqC-a6Fb.mjs";
import { n as installCodexComputerUse, r as readCodexComputerUseStatus } from "./computer-use-DOddS0gH.mjs";
import { t as readCodexExperimentalFeature } from "./experimental-features-uGnVDtp-.mjs";
import { a as requestOptions, i as readCodexStatusProbes, o as safeCodexControlRequest, r as prepareCodexControlSessionAuth, t as codexControlRequest } from "./command-rpc-BOg6pbyx.mjs";
import { a as readCodexConversationActiveTurn, c as setCodexConversationModel, d as stopCodexConversationTurn, i as parseCodexPermissionsModeArg, l as setCodexConversationPermissions, n as formatPermissionsMode, r as parseCodexFastModeArg, s as setCodexConversationFastMode, u as steerCodexConversationTurn } from "./conversation-control-C_wnF5yT.mjs";
import { normalizeOptionalString, normalizeUniqueStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { isIncognitoSessionKey } from "openclaw/plugin-sdk/session-key-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { ensureAuthProfileStoreAsync, resolveAgentDir as resolveAgentDir$1, resolveAgentWorkspaceDir, resolveAuthProfileEligibility, resolveProfileUnusableUntilForDisplay } from "openclaw/plugin-sdk/agent-runtime";
import { getSessionEntryAsync, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { ensureAuthProfileStore, findNormalizedProviderValue, resolveAuthProfileOrder } from "openclaw/plugin-sdk/provider-auth";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { captureSessionEntryCurrentCheckAsync, composeSessionEntryCommitGuards } from "openclaw/plugin-sdk/session-binding-runtime";
import { renderMessagePresentationFallbackText } from "openclaw/plugin-sdk/interactive-runtime";
import { MODEL_SELECTION_LOCKED_MESSAGE, isModelSelectionLocked, resolvePersistedSessionRuntimeId } from "openclaw/plugin-sdk/model-session-runtime";
//#region extensions/codex/src/command-account.ts
const OPENAI_PROVIDER_ID = "openai";
async function readCodexAccountAuthOverview(params) {
	if (!params.account.ok && !params.limits.ok) return;
	const config = params.ctx.config;
	const agentDir = params.agentDir;
	const store = await ensureAuthProfileStoreAsync(agentDir, {
		allowKeychainPrompt: false,
		config
	});
	const order = resolveDisplayAuthOrder({
		config,
		store
	});
	const activeProfileId = params.authProfileId ?? void 0;
	if (activeProfileId && !order.includes(activeProfileId)) order.unshift(activeProfileId);
	if (order.length === 0) return;
	const now = Date.now();
	const activeIsSubscription = activeProfileId !== void 0 && isChatGptSubscriptionProfile(store.profiles[activeProfileId]);
	const subscriptionProfileId = activeIsSubscription ? activeProfileId : activeProfileId ? order.find((profileId) => isChatGptSubscriptionProfile(store.profiles[profileId])) : void 0;
	let subscriptionUsage = activeIsSubscription && params.limits.ok ? summarizeCodexAccountUsage(params.limits.value, now) : void 0;
	if (subscriptionProfileId && !activeIsSubscription) {
		const limits = await params.safeCodexControlRequest(params.pluginConfig, CODEX_CONTROL_METHODS.rateLimits, void 0, {
			config,
			agentDir,
			authProfileId: subscriptionProfileId,
			isolated: true
		});
		subscriptionUsage = limits.ok ? summarizeCodexAccountUsage(limits.value, now) : void 0;
	}
	const rows = order.map((profileId) => {
		const credential = store.profiles[profileId];
		const label = formatProfileLabel(profileId, credential);
		const kind = formatProfileKind(credential);
		const active = profileId === activeProfileId;
		const row = {
			profileId,
			label,
			kind,
			status: active ? "active now" : (profileId === subscriptionProfileId ? subscriptionUsage : void 0)?.blocked ? "rate-limited" : describeInactiveProfileStatus({
				store,
				config,
				profileId,
				credential,
				now
			}),
			active
		};
		if (credential?.type === "api_key" && active) row.billingNote = "billed per token";
		return row;
	});
	const activeRow = rows.find((row) => row.active);
	if (!activeRow) return {
		orderTitle: "Auth order",
		rows
	};
	const activeIsApiKey = store.profiles[activeRow.profileId]?.type === "api_key";
	const subscriptionLabel = subscriptionProfileId ? formatProfileLabel(subscriptionProfileId, store.profiles[subscriptionProfileId]) : void 0;
	const subscriptionUsageLine = formatSubscriptionUsageLine(subscriptionUsage);
	return {
		...activeIsApiKey ? { currentLine: buildApiKeyActiveLine(activeRow, subscriptionUsage) } : {},
		...subscriptionLabel ? { subscriptionLabel } : {},
		...subscriptionUsageLine ? { subscriptionUsage: subscriptionUsageLine } : {},
		orderTitle: "Auth order",
		rows
	};
}
function resolveDisplayAuthOrder(params) {
	const explicitOrder = findNormalizedProviderValue(params.store.order, OPENAI_PROVIDER_ID) ?? findNormalizedProviderValue(params.config?.auth?.order, OPENAI_PROVIDER_ID);
	if (explicitOrder && explicitOrder.length > 0) return normalizeUniqueStringEntries(explicitOrder);
	return resolveAuthProfileOrder({
		cfg: params.config,
		store: params.store,
		provider: OPENAI_PROVIDER_ID
	});
}
function describeInactiveProfileStatus(params) {
	const stats = params.store.usageStats?.[params.profileId];
	const blockedUntil = stats?.blockedUntil;
	if (isActiveUntil(blockedUntil, params.now)) return `rate-limited - resets in ${formatRelativeDuration(Math.max(6e4, blockedUntil - params.now))}`;
	if (isActiveUntil(resolveProfileUnusableUntilForDisplay(params.store, params.profileId) ?? void 0, params.now)) return describeFailureStatus(stats?.disabledReason ?? stats?.cooldownReason, params.credential);
	const eligibility = resolveAuthProfileEligibility({
		cfg: params.config,
		store: params.store,
		provider: OPENAI_PROVIDER_ID,
		profileId: params.profileId,
		now: params.now
	});
	if (!eligibility.eligible) return describeEligibilityStatus(eligibility.reasonCode, params.credential);
	return "available if needed";
}
function buildApiKeyActiveLine(activeRow, subscriptionUsage) {
	if (subscriptionUsage?.blocked) {
		const switchBack = subscriptionUsage.blockedResetRelative ? ` · switches back ${subscriptionUsage.blockedResetRelative}` : " · switches back automatically";
		return `Now using: ${activeRow.label} - subscription rate-limited${switchBack}`;
	}
	return `Now using: ${activeRow.label} - subscription unavailable · switches back automatically`;
}
function formatSubscriptionUsageLine(usage) {
	if (!usage) return;
	const parts = usage.usageLine ? [formatUsageLineForDisplay(usage.usageLine)] : [];
	if (usage.blockedResetRelative) parts.push(`Resets ${usage.blockedResetRelative}`);
	return parts.length > 0 ? parts.join(" · ") : void 0;
}
function formatUsageLineForDisplay(value) {
	return value.replace(/^weekly\b/u, "Weekly").replace(/\bshort-term\b/u, "Short-term");
}
function isChatGptSubscriptionProfile(credential) {
	return credential?.type === "oauth" || credential?.type === "token";
}
function formatProfileKind(credential) {
	if (!credential) return "credential";
	return credential.type === "api_key" ? "API key" : "ChatGPT subscription";
}
function formatProfileLabel(profileId, credential) {
	const tail = profileId.includes(":") ? profileId.slice(profileId.indexOf(":") + 1) : profileId;
	const displayName = credential?.displayName?.trim();
	if (displayName) return credential?.type === "api_key" ? simplifyApiKeyDisplayName(displayName, tail) : displayName;
	const email = credential?.email?.trim() ?? (isLikelyEmailAddress(tail) ? tail : void 0);
	if (email) return email;
	if (credential?.type === "api_key") return tail || "API key";
	return humanizeProfileTail(tail);
}
function simplifyApiKeyDisplayName(value, tail) {
	const stripped = value.replace(/^OpenAI\s+/iu, "").trim();
	if (tail && stripped.toLowerCase() === humanizeApiKeyProfileTail(tail).toLowerCase()) return tail;
	return stripped || value;
}
function humanizeApiKeyProfileTail(tail) {
	const words = splitProfileTail(tail);
	const hasBackup = words.includes("backup");
	return [
		words.filter((word) => word !== "api" && word !== "key" && word !== "backup").map(titleCase).join(" "),
		"API key",
		hasBackup ? "backup" : ""
	].filter(Boolean).join(" ");
}
function humanizeProfileTail(tail) {
	const words = splitProfileTail(tail);
	return words.length > 0 ? words.map(titleCase).join(" ") : tail;
}
function splitProfileTail(tail) {
	return tail.replace(/[_\s]+/gu, "-").split("-").map((word) => word.trim().toLowerCase()).filter(Boolean);
}
function titleCase(value) {
	return value ? `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}` : value;
}
function describeFailureStatus(reason, credential) {
	if (reason === "auth" || reason === "auth_permanent" || reason === "session_expired") return credential?.type === "api_key" ? "auth failed - check key" : "sign-in expired";
	if (reason === "billing") return "billing unavailable";
	if (reason === "rate_limit") return "rate-limited";
	return "temporarily unavailable";
}
const ELIGIBILITY_STATUS = /* @__PURE__ */ new Map([
	["expired", "sign-in expired"],
	["invalid_expires", "sign-in expired"],
	["unresolved_ref", "credential unavailable"],
	["provider_mismatch", "wrong provider"],
	["mode_mismatch", "wrong credential type"]
]);
function describeEligibilityStatus(reason, credential) {
	if (reason === "profile_missing" || reason === "missing_credential") return credential?.type === "api_key" ? "not configured" : "sign-in required";
	return ELIGIBILITY_STATUS.get(reason) ?? "unavailable";
}
function isActiveUntil(value, now) {
	return typeof value === "number" && Number.isFinite(value) && value > now;
}
function buildCodexPluginAppLinks(apps, options = {}) {
	const blocks = apps.slice(0, 5).map((app) => {
		const name = formatCodexDisplayText((app.name.trim() || app.id).slice(0, 80));
		const url = safeCodexAppLink(app.installUrl);
		return url ? {
			type: "buttons",
			buttons: [{
				label: `Open ${name} in ChatGPT`,
				action: {
					type: "url",
					url
				}
			}]
		} : {
			type: "text",
			text: `${name}: ChatGPT setup/manage link unavailable. In Codex CLI, run /apps and select this app to continue.`
		};
	});
	const remaining = apps.length - 5;
	if (remaining > 0) blocks.push({
		type: "text",
		text: `${remaining} more apps are not shown. ${options.continuationCommand ? "Choose More apps to continue." : "In Codex CLI, run /apps to review the remaining apps."}`
	});
	if (options.continuationCommand) blocks.push({
		type: "buttons",
		buttons: [{
			label: "More apps",
			action: {
				type: "command",
				command: options.continuationCommand
			}
		}]
	});
	if (apps.length > 0) blocks.push({
		type: "context",
		text: "Use the same ChatGPT account and workspace as Codex in your browser. Opening an app page does not confirm that it is connected or callable in this conversation. If the app is not shown, in Codex CLI run /apps and select it."
	});
	return blocks;
}
function buildCodexPluginStatusButtons(pluginId, canRefreshHostedApps) {
	return {
		type: "buttons",
		buttons: [...canRefreshHostedApps ? [{
			label: "Refresh hosted apps",
			action: {
				type: "command",
				command: "/codex plugins refresh"
			}
		}] : [], {
			label: "Check status",
			action: {
				type: "command",
				command: `/codex plugins status ${pluginId}`
			}
		}]
	};
}
function safeCodexAppLink(value) {
	if (!value || value.length > 2048 || /[\s\p{Cc}\p{Cf}<>]/u.test(value)) return;
	const url = URL.parse(value);
	if (!url) return;
	const host = url.hostname;
	const hosted = host === "chatgpt.com" || host === "chatgpt-staging.com" || host.endsWith(".chatgpt.com") || host.endsWith(".chatgpt-staging.com");
	return url.protocol === "https:" && !url.username && !url.password && hosted ? value : void 0;
}
//#endregion
//#region extensions/codex/src/command-plugin-config.ts
/** Merge historical curated wire aliases only when they identify the same install source. */
function resolveCuratedMarketplaceAliases(plugins, requestedMarketplaceName) {
	if (!isOpenAiCuratedMarketplaceName(requestedMarketplaceName)) return;
	const sourceIdentities = new Set(plugins.map((plugin) => plugin.marketplacePath ? `local:${plugin.marketplacePath}` : plugin.remotePluginId ? `remote:${plugin.remotePluginId}` : void 0));
	if (sourceIdentities.size !== 1 || sourceIdentities.has(void 0)) return;
	const selected = plugins.find((plugin) => plugin.marketplaceName === requestedMarketplaceName) ?? plugins[0];
	if (!selected) return;
	return {
		...selected,
		installed: plugins.some((plugin) => plugin.installed),
		enabled: plugins.some((plugin) => plugin.installed && plugin.enabled),
		available: plugins.every((plugin) => plugin.available),
		...selected.remotePluginId ? { mustShowInstallationInterstitial: plugins.some((plugin) => plugin.mustShowInstallationInterstitial === true) ? true : plugins.every((plugin) => plugin.mustShowInstallationInterstitial === false) ? false : null } : {},
		...plugins.some((plugin) => plugin.installPolicy === "NOT_AVAILABLE") ? { installPolicy: "NOT_AVAILABLE" } : {}
	};
}
function persistedPluginName(plugin) {
	return !plugin.marketplacePath && plugin.summaryId.endsWith(`@${plugin.marketplaceName}`) ? plugin.summaryId : plugin.pluginName;
}
function resolveConfiguredPluginKey(plugins, target) {
	const requested = parseCodexPluginMarketplaceId(target);
	const direct = plugins[target];
	if (!requested) {
		if (!direct) return { status: "missing" };
		const qualifiedName = direct.pluginName ? parseCodexPluginMarketplaceId(direct.pluginName) : void 0;
		if (qualifiedName && direct.marketplaceName && !marketplaceNamesRepresentSameCatalog(qualifiedName.marketplaceName, direct.marketplaceName)) return { status: "mismatched" };
		const identity = resolveConfiguredPluginIdentity(direct);
		if (!identity) return {
			status: "matched",
			configKey: target
		};
		const marketplaceName = isOpenAiCuratedMarketplaceName(identity.marketplaceName) ? CODEX_PLUGINS_MARKETPLACE_NAME : identity.marketplaceName;
		const canonicalId = `${identity.pluginName}@${marketplaceName}`;
		const canonical = plugins[canonicalId];
		if (canonical && !matchesConfiguredPluginIdentity(canonical, identity, canonicalId)) return { status: "mismatched" };
		return Object.values(plugins).filter((entry) => matchesConfiguredPluginIdentity(entry, identity, canonicalId)).length > 1 ? { status: "ambiguous" } : {
			status: "matched",
			configKey: target
		};
	}
	if (direct && !matchesConfiguredPluginIdentity(direct, requested, target)) return { status: "mismatched" };
	const matching = Object.entries(plugins).filter(([, entry]) => matchesConfiguredPluginIdentity(entry, requested, target));
	if (matching.length > 1) return { status: "ambiguous" };
	const configKey = matching[0]?.[0];
	return configKey ? {
		status: "matched",
		configKey
	} : { status: "missing" };
}
function resolveInstalledPluginKey(plugins, plugin) {
	const discovered = resolveConfiguredPluginKey(plugins, plugin.id);
	if (discovered.status === "ambiguous" || discovered.status === "mismatched") return discovered;
	if (!isOpenAiCuratedMarketplaceName(plugin.marketplaceName)) return discovered;
	const canonical = resolveConfiguredPluginKey(plugins, `${plugin.pluginName}@${CODEX_PLUGINS_MARKETPLACE_NAME}`);
	if (canonical.status === "ambiguous" || canonical.status === "mismatched") return canonical;
	if (discovered.status === "matched" && canonical.status === "matched" && discovered.configKey !== canonical.configKey) return { status: "ambiguous" };
	return canonical.status === "matched" ? canonical : discovered;
}
function resolveConfiguredPluginIdentity(entry) {
	if (!entry.pluginName || !entry.marketplaceName) return;
	const qualified = parseCodexPluginMarketplaceId(entry.pluginName);
	if (qualified) return marketplaceNamesRepresentSameCatalog(qualified.marketplaceName, entry.marketplaceName) ? {
		pluginName: qualified.pluginName,
		marketplaceName: entry.marketplaceName
	} : void 0;
	return parseCodexPluginMarketplaceId(`${entry.pluginName}@${entry.marketplaceName}`);
}
function matchesConfiguredPluginIdentity(entry, requested, target) {
	const configuredName = entry.pluginName ? parseCodexPluginMarketplaceId(entry.pluginName) : void 0;
	return typeof entry.marketplaceName === "string" && marketplaceNamesRepresentSameCatalog(entry.marketplaceName, requested.marketplaceName) && (entry.pluginName === requested.pluginName || entry.pluginName === target || configuredName?.pluginName === requested.pluginName && marketplaceNamesRepresentSameCatalog(configuredName.marketplaceName, requested.marketplaceName));
}
function marketplaceNamesRepresentSameCatalog(left, right) {
	return left === right || isOpenAiCuratedMarketplaceName(left) && isOpenAiCuratedMarketplaceName(right);
}
function describeConfiguredPluginIdentityConflict(target, status) {
	const identity = formatCodexDisplayText(target);
	return status === "ambiguous" ? `Multiple configured Codex plugins match '${identity}'; resolve duplicate plugin policies first.` : `Configured Codex plugin key '${identity}' points to a different plugin identity; resolve the configuration conflict first.`;
}
//#endregion
//#region extensions/codex/src/command-presentation.ts
function buildCodexPresentationReply(presentation) {
	return {
		text: renderMessagePresentationFallbackText({ presentation }),
		presentation,
		presentationTextMode: "fallback"
	};
}
function buildCodexCommandPickerPresentation(title, prompt, buttons) {
	return {
		title,
		blocks: [{
			type: "text",
			text: prompt
		}, {
			type: "buttons",
			buttons: buttons.map((button) => ({
				label: button.label,
				action: {
					type: "command",
					command: button.command
				}
			}))
		}]
	};
}
//#endregion
//#region extensions/codex/src/command-plugins-readiness.ts
/** Runtime support is not account-wide permission to browse, connect or invoke apps. */
async function readCodexHostedAppsSupport(context, account) {
	if (account.status !== "known") return "unknown";
	if (!isJsonObject(account.value.account) || account.value.account.type !== "chatgpt") return "sign_in_required";
	const features = await readEvidence(() => readCodexExperimentalFeature((params) => context.request("experimentalFeature/list", params), "apps", context.threadId));
	if (features.status !== "known") return features.reason === "unsupported" ? "unsupported" : "unknown";
	return features.value === void 0 ? "unknown" : features.value ? "supported" : "disabled";
}
function describeCodexHostedAppsSupport(support) {
	switch (support) {
		case "supported": return "Hosted apps: supported by this runtime; account connections and action permissions are checked separately.";
		case "sign_in_required": return "Hosted apps require ChatGPT sign-in. Check /codex account; local Codex plugins remain available.";
		case "disabled": return "Hosted apps are disabled in this Codex runtime. Check its effective apps feature configuration.";
		case "unsupported": return "Hosted app support is unknown: this Codex version cannot report the required feature state. Update to OpenClaw's supported Codex version.";
		default: return "Hosted app support is unknown. Check /codex account and retry this command.";
	}
}
function pluginCatalogState(summary) {
	if (!summary) return "unknown";
	if (summary.availability === "DISABLED_BY_ADMIN" || summary.installPolicy === "NOT_AVAILABLE") return "blocked";
	return summary.availability === "AVAILABLE" && (summary.installPolicy === "AVAILABLE" || summary.installPolicy === "INSTALLED_BY_DEFAULT") ? "available" : "unknown";
}
function codexPluginAppPageLinks(readiness) {
	if (readiness.hostedSupport !== "supported" || pluginCatalogState(readiness.summary) !== "available" || readiness.metadata.status !== "known") return [];
	const metadata = new Map(readiness.metadata.value.apps.map((app) => [app.id, app]));
	return (readiness.detail?.apps ?? []).flatMap((app) => {
		const authorized = metadata.get(app.id);
		return authorized ? [{
			...app,
			name: authorized.name,
			installUrl: authorized.installUrl
		}] : [];
	});
}
/** Reads existing snapshots only. Neither metadata nor installation proves a live connection. */
async function readCodexPluginReadiness(params) {
	const { context, current, configKey } = params;
	const entry = current.plugins?.[configKey];
	const identity = entry ? resolveConfiguredPluginIdentity(entry) : void 0;
	if (!entry?.marketplaceName || !entry.pluginName || !identity) throw new Error("This configured plugin has no marketplace identity. Check /codex plugins list.");
	const result = {
		configKey,
		commandId: `${identity.pluginName}@${identity.marketplaceName}`,
		openClawEnabled: current.enabled === true && entry.enabled !== false,
		agentId: context.agentId,
		profileId: context.profileId,
		workspaceDir: context.workspaceDir,
		threadId: context.threadId,
		runtime: {
			status: "unavailable",
			reason: "request_failed"
		},
		metadata: {
			status: "unavailable",
			reason: "request_failed"
		},
		account: await readEvidence(() => context.request("account/read", { refreshToken: false })),
		hostedSupport: "unknown"
	};
	const installed = await readEvidence(() => context.request("plugin/installed", { cwds: [context.workspaceDir] }));
	let selected = installed.status === "known" ? findCodexMarketplacePluginSummary(installed.value, entry.marketplaceName, entry.pluginName) : void 0;
	if (!selected) {
		const responses = [];
		const catalog = await readEvidence(() => discoverCodexMarketplacePlugins({
			workspaceDir: context.workspaceDir,
			request: async (requestParams) => {
				const response = await context.request("plugin/list", requestParams);
				responses.push(response);
				return response;
			}
		}));
		if (catalog.status === "known") {
			const matches = catalog.value.plugins.filter((plugin) => {
				const configured = resolveInstalledPluginKey(current.plugins ?? {}, plugin);
				return configured.status === "matched" && configured.configKey === configKey;
			});
			const candidate = matches.length === 1 ? matches[0] : resolveCuratedMarketplaceAliases(matches, entry.marketplaceName);
			if (candidate) for (const response of responses) {
				selected = findCodexMarketplacePluginSummary(response, candidate.marketplaceName, candidate.summaryId);
				if (selected) {
					selected.summary = {
						...selected.summary,
						installed: candidate.installed,
						enabled: candidate.enabled,
						...candidate.available ? {} : { availability: "DISABLED_BY_ADMIN" }
					};
					break;
				}
			}
		} else result.diagnostic = describeUnavailableEvidence(catalog.reason);
	}
	if (!selected) {
		await context.validateCurrent();
		return result;
	}
	result.summary = selected.summary;
	const selectedPlugin = selected;
	const pluginName = selected.marketplace.remoteMarketplaceName ? selected.summary.remotePluginId : entry.pluginName;
	if (!pluginName) return result;
	const detail = await readEvidence(() => context.request("plugin/read", pluginReadParams(selectedPlugin.marketplace, pluginName)));
	if (detail.status !== "known" || detail.value.plugin.summary.id !== selected.summary.id) {
		if (detail.status === "unavailable") result.diagnostic = describeUnavailableEvidence(detail.reason);
		await context.validateCurrent();
		return result;
	}
	result.detail = detail.value.plugin;
	result.summary = detail.value.plugin.summary;
	const appIds = Array.from(new Set(result.detail.apps.map((app) => app.id))).toSorted();
	if (appIds.length > 0) {
		result.hostedSupport = await readCodexHostedAppsSupport(context, result.account);
		const [runtime, metadata] = await Promise.all([readEvidence(() => context.request("app/installed", {
			...context.threadId ? { threadId: context.threadId } : {},
			forceRefresh: false
		})), readEvidence(async () => {
			const responses = [];
			for (let offset = 0; offset < appIds.length; offset += 100) responses.push(await context.request("app/read", {
				appIds: appIds.slice(offset, offset + 100),
				...context.threadId ? { threadId: context.threadId } : {}
			}));
			return {
				apps: responses.flatMap((response) => response.apps),
				missingAppIds: responses.flatMap((response) => response.missingAppIds)
			};
		})]);
		result.runtime = runtime;
		result.metadata = metadata;
	}
	await context.validateCurrent();
	return result;
}
function formatCodexPluginReadiness(readiness, page = 1) {
	const summary = readiness.summary;
	const catalog = pluginCatalogState(summary);
	const hasApps = Boolean(readiness.detail?.apps.length);
	const canRefreshHostedApps = readiness.hostedSupport === "supported";
	const lines = [
		`Plugin: ${display(readiness.commandId)}`,
		`Agent: ${display(readiness.agentId)} · Profile: ${display(readiness.profileId ?? "native Codex account (profile unknown)")}`,
		`Conversation workspace: ${display(readiness.workspaceDir)}`,
		formatBoundAccount(readiness.account),
		`Catalog: ${catalog === "blocked" ? "blocked by marketplace policy" : catalog}`,
		`Bundle: ${summary ? summary.installed ? "installed" : "not installed" : "unknown"}`,
		`Codex plugin: ${summary ? summary.enabled ? "enabled" : "disabled" : "unknown"}`,
		`OpenClaw app access: ${readiness.openClawEnabled ? "enabled" : "disabled"} (shared Codex plugin configuration; takes effect on your next message).`,
		...hasApps ? [describeCodexHostedAppsSupport(readiness.hostedSupport)] : []
	];
	if (catalog === "blocked") lines.push(summary?.disabledReason === "plan_not_eligible" ? "Next: this ChatGPT plan is not eligible for the plugin. Check its plan requirements." : summary?.disabledReason === "required_app_unavailable" ? "Next: a required hosted app is unavailable. Check access with the app or workspace owner." : summary?.disabledReason === "disabled_by_admin" || summary?.availability === "DISABLED_BY_ADMIN" ? "Next: ask the marketplace administrator to restore access." : "Next: check the plugin's marketplace requirements; its policy does not permit installation.");
	else if (!readiness.openClawEnabled) lines.push(`Next: /codex plugins enable ${readiness.commandId}. Takes effect on your next message.`);
	else if (summary && (!summary.installed || !summary.enabled)) lines.push(`Next: /codex plugins install ${readiness.commandId}. Takes effect on your next message.`);
	const blocks = [{
		type: "text",
		text: lines.join("\n")
	}];
	if (readiness.diagnostic) blocks.push({
		type: "text",
		text: readiness.diagnostic
	});
	if (!readiness.detail) blocks.push({
		type: "text",
		text: "App details unavailable. Check the plugin in Codex, then run this status command again."
	});
	else {
		const apps = readiness.detail.apps.toSorted((left, right) => left.id.localeCompare(right.id));
		const pageCount = Math.max(1, Math.ceil(apps.length / 5));
		if (page > pageCount) return { text: `No app page ${page}. Use /codex plugins status ${readiness.commandId} ${pageCount}.` };
		const start = (page - 1) * 5;
		const visible = apps.slice(start, start + 5);
		const runtimeById = new Map(readiness.runtime.status === "known" ? readiness.runtime.value.apps.map((app) => [app.id, app]) : []);
		if (visible.length > 0 && readiness.runtime.status === "unavailable") blocks.push({
			type: "text",
			text: describeUnavailableEvidence(readiness.runtime.reason)
		});
		blocks.push({
			type: "text",
			text: visible.length === 0 ? "No hosted apps declared. Skills and other plugin capabilities are not assessed here." : [
				`Apps (page ${page}/${pageCount}):`,
				`Runtime scope: ${readiness.threadId ? "current Codex thread" : "account (no bound Codex thread)"}.`,
				...visible.map((app) => {
					const runtime = runtimeById.get(app.id);
					const state = runtime ? `enabled: ${runtime.enabled}; callable: ${runtime.callable}` : readiness.runtime.status === "known" ? "not reported by app/installed" : "runtime flags unavailable";
					return `- ${display(app.name)}: ${state}.`;
				})
			].join("\n")
		});
		if (visible.length > 0) {
			const authorized = new Map(codexPluginAppPageLinks(readiness).map((app) => [app.id, app]));
			const links = visible.flatMap((app) => {
				const link = authorized.get(app.id);
				return link ? [link] : [];
			});
			blocks.push(...buildCodexPluginAppLinks(links, page < pageCount ? { continuationCommand: `/codex plugins status ${readiness.commandId} ${page + 1}` } : {}));
			if (links.length < visible.length) blocks.push({
				type: "text",
				text: "Some app-page permissions are unknown or unavailable. A declared app or setup URL does not establish access. Retry this status command after checking the reported restriction."
			});
			blocks.push({
				type: "text",
				text: "Flags reflect Codex's runtime snapshot; status does not refresh hosted tools. After connecting, /codex plugins refresh refreshes hosted inventory for the current Codex account/runtime, across all apps. Use Check status separately to inspect this plugin without refreshing. OpenClaw app-access changes take effect on your next message; use /new or /reset after connecting."
			});
			blocks.push(buildCodexPluginStatusButtons(readiness.commandId, canRefreshHostedApps));
		}
	}
	return buildCodexPresentationReply({
		title: "Codex plugin status",
		blocks
	});
}
async function readEvidence(read) {
	try {
		return {
			status: "known",
			value: await read()
		};
	} catch (error) {
		return {
			status: "unavailable",
			reason: error instanceof CodexAppServerRpcError && error.code === -32601 ? "unsupported" : "request_failed"
		};
	}
}
function describeUnavailableEvidence(reason) {
	return reason === "unsupported" ? "This Codex app-server does not support the required status method. Update to OpenClaw's supported Codex version." : "Codex status could not be read. Check Codex sign-in and connectivity, then run this command again.";
}
function display(value) {
	return formatCodexDisplayText(value.slice(0, 120));
}
function formatBoundAccount(evidence) {
	const account = evidence.status === "known" ? evidence.value.account : void 0;
	if (isJsonObject(account) && account.type === "chatgpt") {
		const email = typeof account.email === "string" ? account.email : "email unknown";
		const plan = typeof account.planType === "string" ? account.planType : "plan unknown";
		return `ChatGPT account: ${formatCodexAccountLine(email.slice(0, 120))} (${display(plan)}).`;
	}
	if (isJsonObject(account) && typeof account.type === "string") return `Account type: ${display(account.type)}; ChatGPT account identity is not available.`;
	return "Codex account: unknown. Check /codex account.";
}
//#endregion
//#region extensions/codex/src/command-apps-refresh.ts
/** Refreshes hosted app inventory for the current account/runtime. */
async function refreshCodexHostedApps(context) {
	let account;
	try {
		account = await context.request("account/read", { refreshToken: false });
		const support = await readCodexHostedAppsSupport({ request: context.request }, {
			status: "known",
			value: account
		});
		if (support !== "supported") return { text: `Hosted app inventory was not refreshed. ${describeCodexHostedAppsSupport(support)}` };
		await refreshCodexAppRuntimeState({
			request: context.request,
			appCache: defaultCodexAppInventoryCache,
			appCacheKey: context.appCacheKey
		});
	} catch (error) {
		await context.validateCurrent();
		return { text: `${error instanceof CodexAppServerRpcError && error.code === -32601 ? "This Codex app-server does not support the required app inventory methods. Update the Codex plugin and retry." : (isCodexAppServerIndeterminateRequestCancellationError(error) || isCodexAppServerPrewriteRequestCancellationError(error)) && "reason" in error && error.reason === "aborted" ? "The hosted app refresh was cancelled." : "Hosted app tools could not be refreshed. Check the Codex connection and try again."} Run /codex plugins refresh to retry for the current Codex account/runtime. Previous inventory was not confirmed; no conversation policy was changed.` };
	}
	return buildCodexPresentationReply({
		title: "Hosted app refresh",
		blocks: [{
			type: "text",
			text: [
				`Agent: ${formatCodexDisplayText(context.agentId.slice(0, 120))} · Profile: ${formatCodexDisplayText((context.profileId ?? "native Codex account (profile unknown)").slice(0, 120))}`,
				formatBoundAccount({
					status: "known",
					value: account
				}),
				"Hosted app refresh request completed for the current Codex account/runtime, across all hosted apps. Codex does not report whether it replaced its snapshot; this does not verify a live connection. No plugin enablement or conversation policy was changed. Use /new or /reset after connecting."
			].join("\n")
		}, {
			type: "text",
			text: "Use /codex plugins list to find configured plugins, then /codex plugins status <name>@<marketplace> to inspect one."
		}]
	});
}
//#endregion
//#region extensions/codex/src/command-diagnostics-state.ts
/** Runtime state for diagnostics upload throttling and confirmation handshakes. */
const codexDiagnosticsFeedbackState = {
	lastUploadByThread: /* @__PURE__ */ new Map(),
	lastUploadByScope: /* @__PURE__ */ new Map(),
	pendingConfirmations: /* @__PURE__ */ new Map(),
	pendingTokensByScope: /* @__PURE__ */ new Map(),
	clear() {
		this.lastUploadByThread.clear();
		this.lastUploadByScope.clear();
		this.pendingConfirmations.clear();
		this.pendingTokensByScope.clear();
	}
};
//#endregion
//#region extensions/codex/src/command-handler-args.ts
const COMPUTER_USE_OPTIONS = [
	["--source", "marketplaceSource"],
	["--marketplace-source", "marketplaceSource"],
	["--marketplace-path", "marketplacePath"],
	["--path", "marketplacePath"],
	["--marketplace", "marketplaceName"],
	["--plugin", "pluginName"],
	["--server", "mcpServerName"],
	["--mcp-server", "mcpServerName"]
];
const CONNECTION_OPTIONS = {
	bind: /* @__PURE__ */ new Map([
		["--cwd", "cwd"],
		["--model", "model"],
		["--provider", "provider"],
		["--model-provider", "provider"]
	]),
	resume: /* @__PURE__ */ new Map([
		["--host", "host"],
		["--node", "host"],
		["--bind", "bind"]
	]),
	sessions: /* @__PURE__ */ new Map([
		["--host", "host"],
		["--node", "host"],
		["--limit", "limit"]
	])
};
function buildCodexSubcommandPickerReply() {
	const verbs = [
		{
			label: "plugins",
			command: "/codex plugins menu"
		},
		{
			label: "permissions",
			command: "/codex permissions menu"
		},
		{
			label: "fast",
			command: "/codex fast menu"
		},
		{
			label: "computer-use",
			command: "/codex computer-use menu"
		},
		{
			label: "account",
			command: "/codex account"
		},
		{
			label: "refresh hosted apps",
			command: "/codex plugins refresh"
		},
		{
			label: "help",
			command: "/codex help"
		}
	];
	return {
		text: [
			"Codex commands. Pick a category or type:",
			"",
			...verbs.map((v, i) => `  ${i + 1}. ${v.command}`),
			"",
			"Tap 'help' (or type /codex help) for the full list of typeable verbs",
			"including threads, mcp, binding, detach, skills, resume, bind, steer,",
			"model, diagnostics, compact, review, computer-use.",
			"",
			"Top-level shortcuts cover everyday operations: /status, /fast, /help, /stop, /models."
		].join("\n"),
		presentation: buildCodexCommandPickerPresentation("Codex commands", "Pick a Codex subcommand:", verbs)
	};
}
function buildCodexChoiceMenuReply(kind) {
	const choices = {
		fast: [
			"on",
			"off",
			"status"
		],
		permissions: [
			"default",
			"yolo",
			"status"
		],
		"computer-use": ["status", "install"]
	}[kind];
	const title = `Codex ${kind === "fast" ? "fast mode" : kind}`;
	const argument = kind === "computer-use" ? "action" : "mode";
	const command = `/codex ${kind}`;
	const buttons = [...choices.map((choice) => ({
		label: choice,
		command: `${command} ${choice}`
	})), {
		label: "back",
		command: "/codex"
	}];
	return {
		text: [
			`${title}. Pick one or type ${command} <${argument}>:`,
			"",
			...choices.map((choice, index) => `  ${index + 1}. ${command} ${choice}`),
			"",
			...kind === "computer-use" ? ["Flag-driven invocations (--source, --marketplace-path, --marketplace) are not in the picker. Type '/codex computer-use' or read '/codex help' for the full surface.", ""] : [],
			"Type '/codex' to go back to the main menu."
		].join("\n"),
		presentation: buildCodexCommandPickerPresentation(title, `Pick a Codex ${kind} ${argument}:`, buttons)
	};
}
function isMenuVerb(rest) {
	return rest.length === 1 && (rest[0] ?? "").trim().toLowerCase() === "menu";
}
function splitArgs(value) {
	const input = value ?? "";
	const args = [];
	let current = "";
	let quote;
	let escaping = false;
	let tokenStarted = false;
	for (const char of input) {
		if (escaping) {
			current += char;
			escaping = false;
		} else if (char === "\\" && quote !== "'") escaping = true;
		else if (quote) {
			if (char === quote) quote = void 0;
			else current += char;
		} else if (char === "\"" || char === "'") quote = char;
		else if (/\s/.test(char)) {
			if (tokenStarted) {
				args.push(current);
				current = "";
				tokenStarted = false;
			}
			continue;
		} else current += char;
		tokenStarted = true;
	}
	if (escaping) current += "\\";
	if (tokenStarted) args.push(current);
	return args;
}
function parseBindArgs(args) {
	const { parsed, values } = parseConnectionArgs(args, "bind");
	return {
		...parsed,
		cwd: normalizeOptionalString(values.get("cwd")),
		model: normalizeOptionalString(values.get("model")),
		provider: normalizeOptionalString(values.get("provider"))
	};
}
function parseCodexCliSessionsArgs(args) {
	const { parsed, values, filter } = parseConnectionArgs(args, "sessions");
	return {
		...parsed,
		host: normalizeOptionalString(values.get("host")),
		filter: filter.join(" ").trim()
	};
}
function parseResumeArgs(args) {
	const { parsed, values } = parseConnectionArgs(args, "resume");
	return {
		...parsed,
		...values.has("bind") ? { bindHere: true } : {},
		host: normalizeOptionalString(values.get("host"))
	};
}
function parseConnectionArgs(args, kind) {
	const parsed = {};
	const values = /* @__PURE__ */ new Map();
	const filter = [];
	for (let index = 0; index < args.length; index += 1) {
		const arg = expectDefined(args[index], `current Codex ${kind === "sessions" ? "sessions" : "thread"} argument`);
		if (arg === "--help" || arg === "-h") {
			parsed.help = true;
			continue;
		}
		const option = CONNECTION_OPTIONS[kind].get(arg);
		if (option) {
			const value = readRequiredOptionValue(args, index);
			if (option === "limit") {
				const limit = parseStrictPositiveInteger(value);
				if (limit === void 0) {
					parsed.help = true;
					continue;
				}
				parsed.limit = limit;
				index += 1;
				continue;
			}
			if (!value || values.has(option) || option === "bind" && value !== "here") {
				parsed.help = true;
				continue;
			}
			values.set(option, value);
			index += 1;
			continue;
		}
		if (kind === "sessions" && !arg.startsWith("-")) {
			filter.push(arg);
			continue;
		}
		if (!arg.startsWith("-") && !parsed.threadId) {
			parsed.threadId = arg;
			continue;
		}
		parsed.help = true;
	}
	if (kind !== "sessions") parsed.threadId = normalizeOptionalString(parsed.threadId);
	return {
		parsed,
		values,
		filter
	};
}
function parseComputerUseArgs(args) {
	const parsed = {
		action: "status",
		overrides: {},
		persistentIdentity: {}
	};
	let sawAction = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg === "--help" || arg === "-h") {
			parsed.help = true;
			continue;
		}
		if (arg === "status" || arg === "install") {
			if (sawAction) {
				parsed.help = true;
				continue;
			}
			sawAction = true;
			parsed.action = arg;
			continue;
		}
		const option = COMPUTER_USE_OPTIONS.find(([flag]) => flag === arg)?.[1];
		if (option) {
			const target = option === "pluginName" || option === "mcpServerName" ? parsed.persistentIdentity : parsed.overrides;
			const value = readRequiredOptionValue(args, index);
			if (!value || target[option] !== void 0) {
				parsed.help = true;
				continue;
			}
			target[option] = value.trim();
			index += 1;
			continue;
		}
		parsed.help = true;
	}
	return parsed;
}
function formatComputerUsePersistentIdentityMigration(parsed) {
	const configPrefix = "plugins.entries.codex.config.computerUse";
	const settings = ["pluginName", "mcpServerName"].flatMap((key) => {
		const value = parsed.persistentIdentity[key];
		return value ? [`${configPrefix}.${key} = ${JSON.stringify(value)}`] : [];
	});
	const retryArgs = [`/codex computer-use ${parsed.action}`, ...[
		["marketplaceSource", "--source"],
		["marketplacePath", "--marketplace-path"],
		["marketplaceName", "--marketplace"]
	].flatMap(([key, flag]) => {
		const value = parsed.overrides[key];
		return value ? [`${flag} ${JSON.stringify(value)}`] : [];
	})];
	return ["One-off Computer Use plugin/server overrides are no longer supported.", `Set ${settings.join(" and ")} persistently, then rerun ${retryArgs.join(" ")}.`].join(" ");
}
function readRequiredOptionValue(args, index) {
	const value = args[index + 1];
	const normalized = value?.trim();
	if (!normalized || normalized.startsWith("-")) return;
	return value;
}
//#endregion
//#region extensions/codex/src/command-diagnostics-support.ts
const CODEX_DIAGNOSTICS_SOURCE = "openclaw-diagnostics";
const CODEX_DIAGNOSTICS_REASON_MAX_CHARS = 2048;
const CODEX_DIAGNOSTICS_COOLDOWN_MS = 6e4;
const CODEX_DIAGNOSTICS_ERROR_MAX_CHARS = 500;
const CODEX_DIAGNOSTICS_COOLDOWN_MAX_THREADS = 100;
const CODEX_DIAGNOSTICS_COOLDOWN_MAX_SCOPES = 100;
const CODEX_DIAGNOSTICS_CONFIRMATION_TTL_MS = 3e5;
const CODEX_DIAGNOSTICS_CONFIRMATION_MAX_REQUESTS_PER_SCOPE = 100;
const CODEX_DIAGNOSTICS_CONFIRMATION_MAX_SCOPES = 100;
const CODEX_DIAGNOSTICS_SCOPE_FIELD_MAX_CHARS = 128;
const { lastUploadByThread: lastCodexDiagnosticsUploadByThread, lastUploadByScope: lastCodexDiagnosticsUploadByScope, pendingConfirmations: pendingCodexDiagnosticsConfirmations, pendingTokensByScope: pendingCodexDiagnosticsConfirmationTokensByScope } = codexDiagnosticsFeedbackState;
function normalizeDiagnosticsReason(note) {
	const normalized = normalizeOptionalString(note);
	return normalized ? truncateUtf16Safe(normalized, CODEX_DIAGNOSTICS_REASON_MAX_CHARS) : void 0;
}
function parseDiagnosticsArgs(args) {
	const [action, token, ...extra] = splitArgs(args);
	const normalizedAction = action?.toLowerCase().replace(/^--/, "");
	if (normalizedAction === "confirm" || normalizedAction === "cancel") return token && extra.length === 0 ? {
		action: normalizedAction,
		token
	} : { action: "usage" };
	return {
		action: "request",
		note: args
	};
}
function createCodexDiagnosticsConfirmation(params) {
	prunePendingCodexDiagnosticsConfirmations(params.now);
	if (!pendingCodexDiagnosticsConfirmationTokensByScope.has(params.scopeKey) && pendingCodexDiagnosticsConfirmationTokensByScope.size >= CODEX_DIAGNOSTICS_CONFIRMATION_MAX_SCOPES) {
		const oldestScopeKey = pendingCodexDiagnosticsConfirmationTokensByScope.keys().next().value;
		if (typeof oldestScopeKey === "string") {
			for (const token of pendingCodexDiagnosticsConfirmationTokensByScope.get(oldestScopeKey) ?? []) pendingCodexDiagnosticsConfirmations.delete(token);
			pendingCodexDiagnosticsConfirmationTokensByScope.delete(oldestScopeKey);
		}
	}
	const scopeTokens = pendingCodexDiagnosticsConfirmationTokensByScope.get(params.scopeKey) ?? [];
	while (scopeTokens.length >= CODEX_DIAGNOSTICS_CONFIRMATION_MAX_REQUESTS_PER_SCOPE) {
		const oldestToken = scopeTokens.shift();
		if (!oldestToken) break;
		pendingCodexDiagnosticsConfirmations.delete(oldestToken);
	}
	const token = crypto.randomBytes(6).toString("hex");
	scopeTokens.push(token);
	pendingCodexDiagnosticsConfirmationTokensByScope.set(params.scopeKey, scopeTokens);
	const { now, ...confirmation } = params;
	pendingCodexDiagnosticsConfirmations.set(token, {
		...confirmation,
		token,
		createdAt: now
	});
	return token;
}
function readCodexDiagnosticsConfirmationScope(ctx) {
	return {
		accountId: normalizeCodexDiagnosticsScopeField(ctx.accountId),
		channelId: normalizeCodexDiagnosticsScopeField(ctx.channelId),
		messageThreadId: typeof ctx.messageThreadId === "string" || typeof ctx.messageThreadId === "number" ? normalizeCodexDiagnosticsScopeField(String(ctx.messageThreadId)) : void 0,
		threadParentId: normalizeCodexDiagnosticsScopeField(ctx.threadParentId),
		sessionKey: normalizeCodexDiagnosticsScopeField(ctx.sessionKey)
	};
}
function readCodexDiagnosticsScopeMismatch(pending, ctx) {
	const current = readCodexDiagnosticsConfirmationScope(ctx);
	if (pending.accountId !== current.accountId) return "This Codex diagnostics confirmation belongs to a different account.";
	if (pending.privateRouted) return;
	for (const [field, label] of [
		["channelId", "channel instance"],
		["messageThreadId", "thread"],
		["threadParentId", "parent thread"],
		["sessionKey", "session"]
	]) if (pending[field] !== current[field]) return `This Codex diagnostics confirmation belongs to a different ${label}.`;
}
function readPendingCodexDiagnosticsConfirmation(token, now) {
	prunePendingCodexDiagnosticsConfirmations(now);
	return pendingCodexDiagnosticsConfirmations.get(token);
}
function deletePendingCodexDiagnosticsConfirmation(token) {
	const pending = pendingCodexDiagnosticsConfirmations.get(token);
	pendingCodexDiagnosticsConfirmations.delete(token);
	if (!pending) return;
	const scopeTokens = pendingCodexDiagnosticsConfirmationTokensByScope.get(pending.scopeKey);
	if (!scopeTokens) return;
	const tokenIndex = scopeTokens.indexOf(token);
	if (tokenIndex >= 0) scopeTokens.splice(tokenIndex, 1);
	if (scopeTokens.length === 0) pendingCodexDiagnosticsConfirmationTokensByScope.delete(pending.scopeKey);
}
function prunePendingCodexDiagnosticsConfirmations(now) {
	for (const [token, pending] of pendingCodexDiagnosticsConfirmations) if (now - pending.createdAt >= CODEX_DIAGNOSTICS_CONFIRMATION_TTL_MS) deletePendingCodexDiagnosticsConfirmation(token);
}
function codexDiagnosticsTargetsMatch(expected, actual) {
	const fingerprint = (target) => JSON.stringify([
		bindingStoreKey(target.identity),
		target.threadId,
		target.connectionScope ?? null,
		target.pendingSupervisionBranch?.connectionFingerprint ?? target.appServerRuntimeFingerprint ?? null,
		target.authProfileId ?? null
	]);
	const expectedTargets = expected.map(fingerprint).toSorted();
	const actualTargets = actual.map(fingerprint).toSorted();
	return expectedTargets.length === actualTargets.length && expectedTargets.every((target, index) => target === actualTargets[index]);
}
function formatCodexDiagnosticsUploadResult(sent, failed) {
	const lines = [];
	if (sent.length > 0) {
		lines.push("Codex diagnostics sent to OpenAI servers:");
		lines.push(...formatCodexDiagnosticsTargetLines(sent));
		lines.push("Included Codex logs and spawned Codex subthreads when available.");
	}
	if (failed.length > 0) {
		if (lines.length > 0) lines.push("");
		lines.push("Could not send Codex diagnostics:");
		lines.push(...failed.map(({ target, error }) => `${formatCodexDiagnosticsTargetLine(target)}: ${formatCodexErrorForDisplay(error)}`));
		lines.push("Inspect locally:");
		lines.push(...failed.map(({ target }) => `- ${formatCodexResumeCommandForDisplay(target.threadId)}`));
	}
	return lines.join("\n");
}
function formatCodexDiagnosticsTargetLines(targets) {
	return targets.flatMap((target, index) => {
		const lines = [`Session ${index + 1}`];
		if (target.channel) lines.push(`Channel: ${formatCodexDisplayText(target.channel)}`);
		if (target.sessionKey) lines.push(`OpenClaw session key: ${formatCodexCopyableValueForDisplay(target.sessionKey)}`);
		if (target.sessionId) lines.push(`OpenClaw session id: ${formatCodexCopyableValueForDisplay(target.sessionId)}`);
		lines.push(`Codex thread id: ${formatCodexCopyableValueForDisplay(target.threadId)}`);
		lines.push(`Inspect locally: ${formatCodexResumeCommandForDisplay(target.threadId)}`);
		return index < targets.length - 1 ? [...lines, ""] : lines;
	});
}
function formatCodexDiagnosticsTargetLine(target) {
	const parts = [];
	if (target.channel) parts.push(`channel ${formatCodexDisplayText(target.channel)}`);
	const sessionLabel = target.sessionId || target.sessionKey;
	if (sessionLabel) parts.push(`OpenClaw session ${formatCodexDisplayText(sessionLabel)}`);
	parts.push(`Codex thread ${formatCodexDisplayText(target.threadId)}`);
	return `- ${parts.join(", ")}`;
}
function readCodexDiagnosticsTargetsCooldownMessage(targets, ctx, now, options = {}) {
	for (const target of targets) {
		const cooldownMs = readCodexDiagnosticsCooldownMs(lastCodexDiagnosticsUploadByThread, target.threadId, now);
		if (cooldownMs > 0) return `Codex diagnostics were already sent for ${options.includeThreadId === false ? "one of these Codex threads" : `thread ${formatCodexDisplayText(target.threadId)}`} recently. Try again in ${Math.ceil(cooldownMs / 1e3)}s.`;
	}
	const scopeCooldownMs = readCodexDiagnosticsCooldownMs(lastCodexDiagnosticsUploadByScope, options.cooldownScope ?? readCodexDiagnosticsCooldownScope(ctx), now);
	if (scopeCooldownMs > 0) return `Codex diagnostics were already sent for this account or channel recently. Try again in ${Math.ceil(scopeCooldownMs / 1e3)}s.`;
}
function recordCodexDiagnosticsUpload(threadId, ctx, now, cooldownScope) {
	for (const map of [lastCodexDiagnosticsUploadByThread, lastCodexDiagnosticsUploadByScope]) for (const [key, lastSentAt] of map) if (now - lastSentAt >= CODEX_DIAGNOSTICS_COOLDOWN_MS) map.delete(key);
	recordBoundedCodexDiagnosticsCooldown(lastCodexDiagnosticsUploadByScope, cooldownScope ?? readCodexDiagnosticsCooldownScope(ctx), CODEX_DIAGNOSTICS_COOLDOWN_MAX_SCOPES, now);
	recordBoundedCodexDiagnosticsCooldown(lastCodexDiagnosticsUploadByThread, threadId, CODEX_DIAGNOSTICS_COOLDOWN_MAX_THREADS, now);
}
function readCodexDiagnosticsCooldownScope(ctx) {
	const scope = readCodexDiagnosticsConfirmationScope(ctx);
	const payload = JSON.stringify({
		accountId: scope.accountId ?? null,
		channelId: scope.channelId ?? null,
		sessionKey: scope.sessionKey ?? null,
		messageThreadId: scope.messageThreadId ?? null,
		threadParentId: scope.threadParentId ?? null,
		senderId: normalizeCodexDiagnosticsScopeField(ctx.senderId) ?? null,
		channel: normalizeCodexDiagnosticsScopeField(ctx.channel) ?? ""
	});
	return crypto.createHash("sha256").update(payload).digest("hex");
}
function buildDiagnosticsTags(ctx) {
	const channel = normalizeOptionalString(ctx.channel);
	return {
		source: CODEX_DIAGNOSTICS_SOURCE,
		...channel ? { channel } : {}
	};
}
function formatCodexCopyableValueForDisplay(value) {
	const safe = formatCodexTextForDisplay(value);
	if (CODEX_RESUME_SAFE_THREAD_ID_PATTERN.test(safe)) return `\`${safe}\``;
	return escapeCodexChatText(safe);
}
function readCodexDiagnosticsCooldownMs(map, key, now) {
	const lastSentAt = map.get(key);
	if (!lastSentAt) return 0;
	const remainingMs = Math.max(0, CODEX_DIAGNOSTICS_COOLDOWN_MS - (now - lastSentAt));
	if (remainingMs === 0) map.delete(key);
	return remainingMs;
}
function recordBoundedCodexDiagnosticsCooldown(map, key, maxSize, now) {
	if (!map.has(key)) pruneMapToMaxSize(map, maxSize - 1);
	map.set(key, now);
}
function formatCodexErrorForDisplay(error) {
	const safe = truncateUtf16Safe(formatCodexTextForDisplay(error), CODEX_DIAGNOSTICS_ERROR_MAX_CHARS);
	return escapeCodexChatText(safe) || "unknown error";
}
function formatCodexResumeCommandForDisplay(threadId) {
	const safeThreadId = formatCodexTextForDisplay(threadId);
	if (!CODEX_RESUME_SAFE_THREAD_ID_PATTERN.test(safeThreadId)) return "run codex resume and paste the thread id shown above";
	return `\`codex resume ${safeThreadId}\``;
}
function normalizeCodexDiagnosticsScopeField(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	if (normalized.length <= CODEX_DIAGNOSTICS_SCOPE_FIELD_MAX_CHARS) return normalized;
	return `sha256:${crypto.createHash("sha256").update(normalized).digest("hex")}`;
}
//#endregion
//#region extensions/codex/src/command-handler-deps.ts
const defaultCodexCommandDeps = {
	codexControlRequest,
	listCodexAppServerModels: listAllCodexAppServerModels,
	readCodexStatusProbes,
	requestOptions,
	safeCodexControlRequest,
	readCodexComputerUseStatus,
	installCodexComputerUse,
	resolveCodexDefaultWorkspaceDir,
	readCodexConversationActiveTurn,
	setCodexConversationFastMode,
	setCodexConversationModel,
	setCodexConversationPermissions,
	steerCodexConversationTurn,
	stopCodexConversationTurn,
	listCodexCliSessionsOnNode: async () => {
		throw new Error("Codex CLI node sessions require Gateway node runtime.");
	},
	resolveCodexCliSessionForBindingOnNode: async () => {
		throw new Error("Codex CLI node sessions require Gateway node runtime.");
	}
};
function resolveCodexCommandDeps(overrides) {
	return {
		...defaultCodexCommandDeps,
		...overrides
	};
}
//#endregion
//#region extensions/codex/src/command-handler-scope.ts
async function resolveControlTarget(ctx) {
	const binding = await ctx.getCurrentConversationBinding();
	const data = readCodexConversationBindingData(binding);
	const scope = resolveCodexConversationControlScope(ctx);
	if (data?.kind === "codex-app-server-session") return {
		identity: conversationBindingIdentity(data.bindingId),
		agentId: data.agentId ?? scope.agentId,
		agentDir: data.agentDir ?? scope.agentDir,
		requestedAuthProfileId: data.start?.authProfileId
	};
	return ctx.sessionId ? {
		identity: sessionBindingIdentity({
			sessionId: ctx.sessionId,
			sessionKey: ctx.sessionKey,
			agentId: scope.agentId,
			config: ctx.config
		}),
		agentId: scope.agentId,
		agentDir: scope.agentDir
	} : void 0;
}
async function resolvePreparedCodexCommandAuthority(deps, ctx) {
	const fallback = resolveCodexConversationControlScope(ctx);
	const sessionId = ctx.sessionId;
	const sessionKey = ctx.sessionKey;
	const sessionAgentId = ctx.sessionTarget?.agentId ?? fallback.agentId;
	const storePath = ctx.sessionTarget?.storePath ?? (sessionKey ? resolveStorePath(ctx.config.session?.store, { agentId: sessionAgentId }) : void 0);
	const target = await resolveControlTarget(ctx);
	const sessionIdentity = sessionId ? sessionBindingIdentity({
		sessionId,
		sessionKey,
		agentId: sessionAgentId,
		config: ctx.config
	}) : void 0;
	const currentSession = sessionIdentity ? await resolveCodexSessionBinding({
		reclaimStale: true,
		bindingStore: deps.bindingStore,
		identity: sessionIdentity,
		config: ctx.config,
		storePath
	}) : void 0;
	let resolvedTarget = currentSession;
	const release = () => {
		if (resolvedTarget !== currentSession) resolvedTarget?.release();
		currentSession?.release();
	};
	try {
		const assertHostCurrent = currentSession?.authority.assertLegacyCurrent ?? composeSessionEntryCommitGuards([]);
		resolvedTarget = target && (!sessionIdentity || !isDeepStrictEqual(target.identity, sessionIdentity)) ? await resolveCodexSessionBinding({
			bindingStore: deps.bindingStore,
			identity: target.identity,
			config: ctx.config,
			storePath,
			assertCurrent: assertHostCurrent
		}) : currentSession;
		const binding = resolvedTarget?.binding;
		const assertCurrent = composeSessionEntryCommitGuards([assertHostCurrent], (assertSource) => {
			assertSource();
			if (target && !isDeepStrictEqual(deps.bindingStore.read(target.identity), binding)) throw new Error("Codex command binding changed before dispatch");
			assertSource();
		});
		assertCurrent();
		const assertCurrentAsync = async () => {
			await ctx.assertNativePolicyCurrent?.();
			await resolvedTarget?.authority.withCurrent(assertCurrent);
			if (!resolvedTarget) assertCurrent();
		};
		return {
			release,
			target,
			binding,
			currentSessionBinding: currentSession?.binding,
			sessionId,
			sessionKey,
			storePath,
			assertHostCurrent,
			assertCurrent,
			assertCurrentAsync,
			mutationSource: composeSessionEntryCommitGuards([assertCurrent, ctx.nativePolicySource]),
			assertMutationCurrent: composeSessionEntryCommitGuards([assertCurrent], (assertSource) => {
				assertCodexHostOwnerCurrent(ctx);
				assertSource();
			}),
			assertHostMutationCurrent: composeSessionEntryCommitGuards([assertHostCurrent], (assertSource) => {
				assertCodexHostOwnerCurrent(ctx);
				assertSource();
			})
		};
	} catch (error) {
		release();
		throw error;
	}
}
async function resolveCommandAppServerContext(deps, ctx, pluginConfig) {
	const authority = await resolvePreparedCodexCommandAuthority(deps, ctx);
	try {
		const { target, binding } = authority;
		const fallback = resolveCodexConversationControlScope(ctx);
		const agentDir = target?.agentDir ?? fallback.agentDir;
		const authProfileId = binding?.connectionScope === "supervision" ? void 0 : await resolveCodexAppServerAuthProfileIdForAgent({
			authProfileId: binding?.authProfileId ?? target?.requestedAuthProfileId,
			agentDir,
			config: ctx.config
		});
		const connection = await resolveCodexBindingAppServerConnection({
			binding,
			authProfileId,
			pluginConfig,
			agentDir,
			config: ctx.config,
			assertCurrent: authority.assertCurrent,
			assertCurrentAsync: authority.assertCurrentAsync
		});
		return {
			scope: {
				agentId: target?.agentId ?? fallback.agentId,
				agentDir,
				...connection.clientAuthProfileId !== void 0 ? { authProfileId: connection.clientAuthProfileId } : {},
				...connection.usesSupervisionConnection ? { startOptions: connection.appServer.start } : {},
				...authority.sessionKey ? { sessionKey: authority.sessionKey } : {},
				...authority.sessionId ? { sessionId: authority.sessionId } : {},
				...authority.storePath ? { storePath: authority.storePath } : {},
				assertCurrent: authority.assertCurrent,
				assertCurrentAsync: authority.assertCurrentAsync,
				release: authority.release
			},
			target,
			binding
		};
	} catch (error) {
		authority.release();
		throw error;
	}
}
async function resolveCommandAppServerScope(deps, ctx, pluginConfig) {
	return (await resolveCommandAppServerContext(deps, ctx, pluginConfig)).scope;
}
function conversationBindingIdentity(bindingId) {
	return {
		kind: "conversation",
		bindingId
	};
}
function resolveCodexConversationControlScope(ctx) {
	const { sessionAgentId } = resolveSessionAgentIdsStrict({
		sessionKey: ctx.sessionKey,
		agentId: ctx.agentId,
		config: ctx.config
	});
	return {
		agentId: sessionAgentId,
		agentDir: resolveAgentDir$1(ctx.config, sessionAgentId)
	};
}
//#endregion
//#region extensions/codex/src/command-diagnostics.ts
const NO_DIAGNOSTICS_THREAD = ["No Codex thread is attached to this OpenClaw session yet.", "Use /codex threads to find a thread, then /codex resume <thread-id> before sending diagnostics."].join("\n");
async function handleCodexDiagnosticsFeedback(deps, context, pluginConfig, args) {
	const ctx = { ...context };
	if (ctx.senderIsOwner !== true) return { text: "Only an owner can send Codex diagnostics." };
	const parsed = parseDiagnosticsArgs(args);
	if (parsed.action === "usage") return { text: [
		"Usage: /codex diagnostics [note]",
		"Usage: /codex diagnostics confirm <token>",
		"Usage: /codex diagnostics cancel <token>"
	].join("\n") };
	if (parsed.action === "confirm") return { text: await confirmCodexDiagnosticsFeedback(deps, ctx, pluginConfig, parsed.token) };
	if (parsed.action === "cancel") return { text: cancelCodexDiagnosticsFeedback(ctx, parsed.token) };
	if (!await hasAnyCodexDiagnosticsIdentity(ctx)) return { text: "Cannot send Codex diagnostics because this command did not include a stable session identity." };
	const targets = await resolveCodexDiagnosticsTargets(deps, ctx);
	if (targets.length === 0) return { text: NO_DIAGNOSTICS_THREAD };
	if (ctx.diagnosticsUploadApproved === true) return { text: await sendCodexDiagnosticsFeedbackForTargets(deps, ctx, pluginConfig, parsed.note, targets) };
	if (ctx.diagnosticsPreviewOnly === true) return { text: previewCodexDiagnosticsFeedbackApproval(targets, ctx, parsed.note) };
	return requestCodexDiagnosticsFeedbackApproval(targets, ctx, parsed.note);
}
function requestCodexDiagnosticsFeedbackApproval(targets, ctx, note) {
	const now = Date.now();
	const cooldownMessage = readCodexDiagnosticsTargetsCooldownMessage(targets, ctx, now);
	if (cooldownMessage) return { text: cooldownMessage };
	if (!ctx.senderId) return { text: "Cannot send Codex diagnostics because this command did not include a sender identity." };
	const reason = normalizeDiagnosticsReason(note);
	const token = createCodexDiagnosticsConfirmation({
		targets,
		note: reason,
		senderId: ctx.senderId,
		channel: ctx.channel,
		scopeKey: readCodexDiagnosticsCooldownScope(ctx),
		privateRouted: ctx.diagnosticsPrivateRouted === true,
		...readCodexDiagnosticsConfirmationScope(ctx),
		now
	});
	const confirmCommand = `/codex diagnostics confirm ${token}`;
	const cancelCommand = `/codex diagnostics cancel ${token}`;
	const displayReason = reason ? formatCodexDisplayText(reason) : void 0;
	return {
		text: [
			targets.length === 1 ? "Codex runtime thread detected." : "Codex runtime threads detected.",
			`Codex diagnostics can send ${targets.length === 1 ? "this thread's feedback bundle" : "these threads' feedback bundles"} to OpenAI servers.`,
			"Codex sessions:",
			...formatCodexDiagnosticsTargetLines(targets),
			...displayReason ? [`Note: ${displayReason}`] : [],
			"Included: Codex logs and spawned Codex subthreads when available.",
			`To send: ${confirmCommand}`,
			`To cancel: ${cancelCommand}`,
			"This request expires in 5 minutes."
		].join("\n"),
		interactive: { blocks: [{
			type: "buttons",
			buttons: [{
				label: "Send diagnostics",
				action: {
					type: "command",
					command: confirmCommand
				},
				value: confirmCommand,
				style: "danger"
			}, {
				label: "Cancel",
				action: {
					type: "command",
					command: cancelCommand
				},
				value: cancelCommand,
				style: "secondary"
			}]
		}] }
	};
}
function previewCodexDiagnosticsFeedbackApproval(targets, ctx, note) {
	const cooldownMessage = readCodexDiagnosticsTargetsCooldownMessage(targets, ctx, Date.now(), { includeThreadId: false });
	if (cooldownMessage) return cooldownMessage;
	const reason = normalizeDiagnosticsReason(note);
	const displayReason = reason ? formatCodexDisplayText(reason) : void 0;
	return [
		targets.length === 1 ? "Codex runtime thread detected." : "Codex runtime threads detected.",
		`Approving diagnostics will also send ${targets.length === 1 ? "this thread's feedback bundle" : "these threads' feedback bundles"} to OpenAI servers.`,
		"The completed diagnostics reply will list the OpenClaw session ids and Codex thread ids that were sent.",
		...displayReason ? [`Note: ${displayReason}`] : [],
		"Included: Codex logs and spawned Codex subthreads when available."
	].join("\n");
}
async function confirmCodexDiagnosticsFeedback(deps, ctx, pluginConfig, token) {
	const pending = consumeCodexDiagnosticsConfirmation(ctx, token, "confirm");
	if (typeof pending === "string") return pending;
	if (!pending.privateRouted && !await hasAnyCodexDiagnosticsIdentity(ctx)) return "Cannot send Codex diagnostics because this command did not include a stable session identity.";
	const currentTargets = pending.privateRouted ? (await Promise.all(pending.targets.map(async (target) => {
		const binding = await deps.bindingStore.readAsync(target.identity);
		return binding?.threadId ? [await resolveCodexDiagnosticsTarget(target, binding, ctx.config)] : [];
	}))).flat() : await resolveCodexDiagnosticsTargets(deps, ctx);
	if (!codexDiagnosticsTargetsMatch(pending.targets, currentTargets)) return "The Codex diagnostics sessions changed before confirmation. Run /diagnostics again for the current threads.";
	return await sendCodexDiagnosticsFeedbackForTargets(deps, ctx, pluginConfig, pending.note ?? "", currentTargets, pending.scopeKey);
}
function cancelCodexDiagnosticsFeedback(ctx, token) {
	const pending = consumeCodexDiagnosticsConfirmation(ctx, token, "cancel");
	if (typeof pending === "string") return pending;
	return [
		"Codex diagnostics upload canceled.",
		"Codex sessions:",
		...formatCodexDiagnosticsTargetLines(pending.targets)
	].join("\n");
}
async function sendCodexDiagnosticsFeedbackForTargets(deps, ctx, pluginConfig, note, targets, cooldownScope) {
	if (targets.length === 0) return NO_DIAGNOSTICS_THREAD;
	const now = Date.now();
	const cooldownMessage = readCodexDiagnosticsTargetsCooldownMessage(targets, ctx, now, { cooldownScope });
	if (cooldownMessage) return cooldownMessage;
	const reason = normalizeDiagnosticsReason(note);
	const sent = [];
	const failed = [];
	for (const target of targets) {
		const assertCurrent = () => {
			ctx.assertOwnerCurrent?.();
			const current = resolvePendingCodexDiagnosticsTargets(deps, [target], ctx.config);
			if (!codexDiagnosticsTargetsMatch([target], current)) throw new Error("The Codex diagnostics session changed before upload; request it again.");
		};
		let connection;
		try {
			connection = await resolveCodexBindingAppServerConnection({
				binding: target,
				authProfileId: target.authProfileId,
				pluginConfig,
				agentDir: target.agentDir,
				config: ctx.config,
				assertCurrent
			});
		} catch (error) {
			failed.push({
				target,
				error: error instanceof Error ? error.message : String(error)
			});
			continue;
		}
		const response = await deps.safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.feedback, {
			classification: "bug",
			threadId: target.threadId,
			includeLogs: true,
			tags: buildDiagnosticsTags(ctx),
			...reason ? { reason } : {}
		}, {
			config: ctx.config,
			agentDir: target.agentDir,
			assertCurrent,
			...connection.clientAuthProfileId !== void 0 ? { authProfileId: connection.clientAuthProfileId } : {},
			...connection.usesSupervisionConnection ? { startOptions: connection.appServer.start } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {}
		});
		if (!response.ok) {
			failed.push({
				target,
				error: response.error
			});
			continue;
		}
		const responseThreadId = isJsonObject(response.value) ? normalizeOptionalString(response.value.threadId) : void 0;
		sent.push({
			...target,
			threadId: responseThreadId ?? target.threadId
		});
		recordCodexDiagnosticsUpload(target.threadId, ctx, now, cooldownScope);
	}
	return formatCodexDiagnosticsUploadResult(sent, failed);
}
function consumeCodexDiagnosticsConfirmation(ctx, token, action) {
	const pending = readPendingCodexDiagnosticsConfirmation(token, Date.now());
	if (!pending) return action === "confirm" ? "No pending Codex diagnostics confirmation was found. Run /diagnostics again to create a fresh request." : "No pending Codex diagnostics confirmation was found.";
	if (!pending.senderId || !ctx.senderId) return `Cannot ${action} Codex diagnostics because this command did not include the original sender identity.`;
	if (pending.senderId !== ctx.senderId) return `Only the user who requested these Codex diagnostics can ${action} the upload.`;
	if (pending.channel !== ctx.channel) return "This Codex diagnostics confirmation belongs to a different channel.";
	const scopeMismatch = readCodexDiagnosticsScopeMismatch(pending, ctx);
	if (scopeMismatch) return scopeMismatch;
	deletePendingCodexDiagnosticsConfirmation(token);
	return pending;
}
async function hasAnyCodexDiagnosticsIdentity(ctx) {
	if (await resolveControlTarget(ctx)) return true;
	return (ctx.diagnosticsSessions ?? []).some((session) => Boolean(session.sessionId));
}
async function resolveCodexDiagnosticsTargets(deps, ctx) {
	const activeTarget = await resolveControlTarget(ctx);
	const candidates = [];
	if (activeTarget) candidates.push({
		identity: activeTarget.identity,
		agentDir: activeTarget.agentDir,
		sessionKey: ctx.sessionKey,
		sessionId: ctx.sessionId,
		channel: ctx.channel,
		channelId: ctx.channelId,
		accountId: ctx.accountId,
		messageThreadId: ctx.messageThreadId,
		threadParentId: ctx.threadParentId
	});
	for (const session of ctx.diagnosticsSessions ?? []) {
		if (!session.sessionId) continue;
		const inventoryAgentId = session.sessionKey ? parseAgentSessionKey(session.sessionKey)?.agentId : void 0;
		const identity = sessionBindingIdentity({
			sessionId: session.sessionId,
			sessionKey: session.sessionKey,
			agentId: inventoryAgentId ?? ctx.agentId,
			config: ctx.config
		});
		candidates.push({
			identity,
			agentDir: resolveAgentDir$1(ctx.config, identity.agentId),
			sessionKey: session.sessionKey,
			sessionId: session.sessionId,
			channel: session.channel,
			channelId: session.channelId,
			accountId: session.accountId,
			messageThreadId: session.messageThreadId,
			threadParentId: session.threadParentId
		});
	}
	const seenBindingKeys = /* @__PURE__ */ new Set();
	const seenThreadIds = /* @__PURE__ */ new Set();
	const targets = [];
	for (const candidate of candidates) {
		const key = bindingStoreKey(candidate.identity);
		if (seenBindingKeys.has(key)) continue;
		seenBindingKeys.add(key);
		const binding = await deps.bindingStore.readAsync(candidate.identity);
		if (!binding?.threadId || seenThreadIds.has(binding.threadId)) continue;
		seenThreadIds.add(binding.threadId);
		targets.push(await resolveCodexDiagnosticsTarget(candidate, binding, ctx.config));
	}
	return targets;
}
function resolvePendingCodexDiagnosticsTargets(deps, targets, config) {
	return targets.flatMap((target) => {
		const binding = deps.bindingStore.read(target.identity);
		if (!binding?.threadId) return [];
		return [createCodexDiagnosticsTarget(target, binding, binding.connectionScope === "supervision" ? void 0 : binding.authProfileId?.trim() || resolveCodexAppServerAuthProfileId({
			authProfileId: binding.authProfileId,
			config,
			store: ensureAuthProfileStore(target.agentDir, {
				profileId: binding.authProfileId,
				allowKeychainPrompt: false,
				config,
				externalCliProviderIds: ["openai"],
				...binding.authProfileId ? { externalCliProfileIds: [binding.authProfileId] } : {}
			})
		}))];
	});
}
async function resolveCodexDiagnosticsTarget(target, binding, config) {
	return createCodexDiagnosticsTarget(target, binding, binding.connectionScope === "supervision" ? void 0 : await resolveCodexAppServerAuthProfileIdForAgent({
		authProfileId: binding.authProfileId,
		agentDir: target.agentDir,
		config
	}));
}
function createCodexDiagnosticsTarget(target, binding, authProfileId) {
	const candidate = {
		identity: target.identity,
		agentDir: target.agentDir,
		sessionKey: target.sessionKey,
		sessionId: target.sessionId,
		channel: target.channel,
		channelId: target.channelId,
		accountId: target.accountId,
		messageThreadId: target.messageThreadId,
		threadParentId: target.threadParentId
	};
	if (binding.connectionScope === "supervision") return {
		...candidate,
		threadId: binding.threadId,
		connectionScope: binding.connectionScope,
		appServerRuntimeFingerprint: binding.appServerRuntimeFingerprint,
		pendingSupervisionBranch: binding.pendingSupervisionBranch
	};
	return {
		...candidate,
		threadId: binding.threadId,
		authProfileId
	};
}
//#endregion
//#region extensions/codex/src/command-handler-bindings.ts
async function isCurrentSessionModelSelectionLocked(ctx) {
	const sessionKey = ctx.sessionKey?.trim();
	if (!sessionKey) return false;
	const { agentId } = resolveCodexConversationControlScope(ctx);
	const storePath = ctx.sessionTarget?.storePath ?? resolveStorePath(ctx.config.session?.store, { agentId });
	return isModelSelectionLocked(await getSessionEntryAsync({
		storePath,
		sessionKey,
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	}));
}
async function bindConversation(deps, ctx, pluginConfig, args) {
	const parsed = parseBindArgs(args);
	if (parsed.help) return { text: "Usage: /codex bind [thread-id] [--cwd <path>] [--model <model>] [--provider <provider>]" };
	if (await isCurrentSessionModelSelectionLocked(ctx)) return { text: MODEL_SELECTION_LOCKED_MESSAGE };
	const scope = resolveCodexConversationControlScope(ctx);
	const workspaceDir = parsed.cwd ?? deps.resolveCodexDefaultWorkspaceDir(pluginConfig);
	const currentConversation = await ctx.getCurrentConversationBinding();
	const currentConversationData = readCodexConversationBindingData(currentConversation);
	const bindingId = currentConversationData?.kind === "codex-app-server-session" ? currentConversationData.bindingId : currentConversation ? `conversation-${currentConversation.bindingId}` : void 0;
	const sessionOwner = ctx.sessionId ? sessionBindingIdentity({
		sessionId: ctx.sessionId,
		sessionKey: ctx.sessionKey,
		agentId: scope.agentId,
		config: ctx.config
	}) : void 0;
	const currentOwner = currentConversationData?.kind === "codex-app-server-session" ? conversationBindingIdentity(currentConversationData.bindingId) : sessionOwner;
	const existingBinding = currentOwner ? await deps.bindingStore.readAsync(currentOwner) : void 0;
	assertCodexBindingMayBeReplaced(existingBinding, "binding this conversation to another thread");
	const sessionSource = sessionOwner && existingBinding ? {
		agentId: sessionOwner.agentId,
		sessionId: sessionOwner.sessionId,
		threadId: existingBinding.threadId,
		storePath: ctx.sessionTarget?.storePath ?? resolveStorePath(ctx.config.session?.store, { agentId: sessionOwner.agentId }),
		...sessionOwner.sessionKey ? { sessionKey: sessionOwner.sessionKey } : {}
	} : void 0;
	const authProfileId = existingBinding?.authProfileId;
	const data = createCodexConversationBindingData({
		bindingId,
		workspaceDir,
		agentId: scope.agentId,
		agentDir: scope.agentDir,
		source: currentConversationData?.kind === "codex-app-server-session" ? currentConversationData.source : sessionSource,
		start: {
			id: crypto.randomUUID(),
			threadId: parsed.threadId,
			model: parsed.model,
			modelProvider: parsed.provider,
			authProfileId
		}
	});
	const threadLabel = parsed.threadId ?? "a new thread";
	await ctx.assertNativePolicyCurrent?.();
	assertCodexHostOwnerCurrent(ctx);
	const request = await ctx.requestConversationBinding({
		summary: `Codex app-server thread ${formatCodexDisplayText(threadLabel)} in ${formatCodexDisplayText(workspaceDir)}`,
		detachHint: "/codex detach",
		data
	});
	if (request.status === "pending") return request.reply;
	if (request.status === "error") return { text: formatCodexDisplayText(request.message) };
	return { text: `Bound this conversation to ${formatCodexDisplayText(threadLabel)} in ${formatCodexDisplayText(workspaceDir)}. The next message will initialize it.` };
}
async function detachConversation(deps, ctx) {
	if (await isCurrentSessionModelSelectionLocked(ctx)) return MODEL_SELECTION_LOCKED_MESSAGE;
	const current = await ctx.getCurrentConversationBinding();
	const data = readCodexConversationBindingData(current);
	const identity = data?.kind === "codex-app-server-session" ? conversationBindingIdentity(data.bindingId) : void 0;
	const sourceSessionKey = data?.kind === "codex-app-server-session" ? data.source?.sessionKey : void 0;
	let expectedThreadId;
	let expectedStartId;
	if (data?.kind === "codex-app-server-session") {
		const binding = await deps.bindingStore.readAsync(identity);
		assertCodexBindingMayBeReplaced(binding, "detaching its conversation binding");
		if (deps.readCodexConversationActiveTurn(identity)) return "This Codex conversation has an active run; use /codex stop before detaching it.";
		expectedThreadId = binding?.threadId;
		expectedStartId = binding?.conversationStartId;
	}
	const detachPublicConversation = async () => {
		return (await ctx.detachConversationBinding()).removed ? "Detached this conversation from Codex." : "No Codex conversation binding was attached.";
	};
	if (identity && expectedThreadId) return await withCodexConversationThreadActivity(identity.bindingId, async () => {
		let detachedPublicConversation;
		if (!await retireCodexConversationThreadBinding({
			bindingStore: deps.bindingStore,
			identity,
			expectedThreadId,
			assertCurrent: () => assertCodexHostOwnerCurrent(ctx),
			...expectedStartId ? { expectedStartId } : {},
			...isIncognitoSessionKey(sourceSessionKey) ? { allowUntracked: true } : {},
			afterClear: async () => {
				detachedPublicConversation = await detachPublicConversation();
			}
		})) return "This Codex conversation binding changed while detaching; try again.";
		return detachedPublicConversation;
	});
	await ctx.assertNativePolicyCurrent?.();
	assertCodexHostOwnerCurrent(ctx);
	return await detachPublicConversation();
}
async function describeConversationBinding(deps, ctx) {
	const current = await ctx.getCurrentConversationBinding();
	const data = readCodexConversationBindingData(current);
	if (!current || !data) return "No Codex conversation binding is attached.";
	if (data.kind === "codex-cli-node-session") return [
		"Codex conversation binding:",
		"- Mode: Codex CLI node session",
		`- Node: ${formatCodexDisplayText(data.nodeId)}`,
		`- Session: ${formatCodexDisplayText(data.sessionId)}`,
		`- Workspace: ${formatCodexDisplayText(data.cwd ?? "unknown")}`,
		"- Active run: not tracked"
	].join("\n");
	const identity = conversationBindingIdentity(data.bindingId);
	const threadBinding = await deps.bindingStore.readAsync(identity);
	const active = deps.readCodexConversationActiveTurn(identity);
	const sessionKey = ctx.sessionKey?.trim();
	const { agentId } = resolveCodexConversationControlScope(ctx);
	const sessionEntry = sessionKey ? await getSessionEntryAsync({
		agentId,
		storePath: ctx.sessionTarget?.storePath ?? resolveStorePath(ctx.config.session?.store, { agentId }),
		sessionKey,
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	}) : void 0;
	const permissionMode = !ctx.sessionId || sessionEntry?.sessionId === ctx.sessionId ? sessionEntry?.permissionMode : void 0;
	return [
		"Codex conversation binding:",
		`- Thread: ${formatCodexDisplayText(threadBinding?.threadId ?? "unknown")}`,
		`- Workspace: ${formatCodexDisplayText(data.workspaceDir)}`,
		`- Model: ${formatCodexDisplayText(threadBinding?.model ?? "default")}`,
		`- Fast: ${isCodexFastServiceTier(threadBinding?.serviceTier) ? "on" : "off"}`,
		`- Permissions: ${formatPermissionsMode(permissionMode)}`,
		`- Active run: ${formatCodexDisplayText(active ? active.turnId : "none")}`,
		`- Binding: ${formatCodexDisplayText(data.bindingId)}`
	].join("\n");
}
async function buildThreads(deps, ctx, pluginConfig, filter) {
	const scope = await resolveCommandAppServerScope(deps, ctx, pluginConfig);
	using _ = { [Symbol.dispose]: scope.release };
	const response = await deps.codexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.listThreads, {
		limit: 10,
		...filter.trim() ? { searchTerm: filter.trim() } : {}
	}, {
		config: ctx.config,
		...scope
	});
	return formatThreads(response);
}
async function buildCodexCliSessions(deps, args) {
	const parsed = parseCodexCliSessionsArgs(args);
	if (parsed.help || !parsed.host) return "Usage: /codex sessions --host <node> [filter] [--limit <n>]";
	return formatCodexCliSessions(await deps.listCodexCliSessionsOnNode({
		requestedNode: parsed.host,
		filter: parsed.filter,
		limit: parsed.limit
	}));
}
async function resumeThread(deps, ctx, pluginConfig, args) {
	const parsed = parseResumeArgs(args);
	const normalizedThreadId = parsed.threadId?.trim();
	if (parsed.help) return args.includes("--help") || args.includes("-h") || parsed.host ? "Usage: /codex resume <thread-id>\nUsage: /codex resume <session-id> --host <node> --bind here" : "Usage: /codex resume <thread-id>";
	if (parsed.host) return await bindCodexCliNodeSession(deps, ctx, parsed);
	if (!normalizedThreadId || args.length !== 1) return "Usage: /codex resume <thread-id>";
	if (await isCurrentSessionModelSelectionLocked(ctx)) return MODEL_SELECTION_LOCKED_MESSAGE;
	if (!ctx.sessionId) return "Cannot attach a Codex thread because this command did not include an OpenClaw session id.";
	const scope = resolveCodexConversationControlScope(ctx);
	const identity = sessionBindingIdentity({
		sessionId: ctx.sessionId,
		sessionKey: ctx.sessionKey,
		agentId: scope.agentId,
		config: ctx.config
	});
	const { authority, release } = await resolveCodexSessionBinding({
		reclaimStale: true,
		bindingStore: deps.bindingStore,
		identity,
		config: ctx.config,
		storePath: ctx.sessionTarget?.storePath
	});
	using _ = { [Symbol.dispose]: release };
	const assertHostGeneration = authority.assertLegacyCurrent;
	return await withExclusiveCodexAppServerThread({
		bindingStore: deps.bindingStore,
		identity,
		threadId: normalizedThreadId,
		run: async () => await deps.bindingStore.withLease(identity, async () => {
			const generation = await deps.bindingStore.prepareSessionGenerationReclaim(identity);
			assertHostGeneration();
			if (generation.kind !== "resolved" || !generation.result) throw createCodexSessionGenerationSupersededError(identity.sessionId);
			const currentBinding = await deps.bindingStore.readAsync(identity);
			assertCodexBindingMayBeReplaced(currentBinding, "attaching a different resumed thread");
			let pendingResumeConfiguration = false;
			const commitResumedThread = async (value, client, { authProfileId, assertCurrent, assertCurrentAsync, source }) => {
				const response = assertCodexThreadResumeResponse(value);
				const effectiveThreadId = response.thread.id;
				if (effectiveThreadId !== normalizedThreadId) throw new Error(`Codex thread/resume returned ${effectiveThreadId} for ${normalizedThreadId}`);
				const resumedCwd = response.thread.cwd;
				if (typeof resumedCwd !== "string") throw new Error(`Codex thread/resume returned no cwd for ${normalizedThreadId}`);
				const modelProvider = await normalizeCodexAppServerBindingModelProvider({
					authProfileId,
					modelProvider: response.modelProvider ?? void 0,
					agentDir: scope.agentDir,
					config: ctx.config
				});
				const clientId = client.getInstanceId();
				let retained = false;
				let sameOwner = false;
				let knownOwnership;
				try {
					const bindingBeforeCommit = await deps.bindingStore.readAsync(identity);
					assertCodexBindingMayBeReplaced(bindingBeforeCommit, "committing a different resumed thread");
					sameOwner = isSameCodexAppServerThreadOwner(bindingBeforeCommit, {
						threadId: effectiveThreadId,
						clientId
					});
					const sameThreadBinding = bindingBeforeCommit?.threadId === effectiveThreadId ? bindingBeforeCommit : void 0;
					pendingResumeConfiguration = sameThreadBinding?.preserveNativeModel !== true && (!sameThreadBinding?.dynamicToolsFingerprint || !sameThreadBinding.webSearchThreadConfigFingerprint || sameThreadBinding.pendingResumeConfiguration === true);
					await assertCurrentAsync?.();
					assertCurrent();
					assertCodexThreadAcceptsDirectInput(response.thread);
					knownOwnership = sameOwner ? await consumeCodexAppServerLiveThread(client, effectiveThreadId) : void 0;
					assertCurrent();
					retained = await retainCodexAppServerBindingSubscription(client, effectiveThreadId, knownOwnership);
					assertCurrent();
					if (!retained) throw new Error("Codex resumed thread lost its native subscription owner.");
					if (bindingBeforeCommit && !sameOwner) await releaseCodexAppServerBindingSubscription(bindingBeforeCommit, {
						assertCurrent,
						withCurrent: async (write) => {
							await assertCurrentAsync?.();
							assertCurrent();
							write();
						},
						retainedClientId: clientId
					});
					assertCurrent();
					if (!await deps.bindingStore.mutate(identity, {
						kind: "set",
						binding: {
							...sameThreadBinding,
							threadId: effectiveThreadId,
							clientId,
							cwd: resumedCwd,
							rolloutPath: response.thread.path ?? sameThreadBinding?.rolloutPath,
							pendingResumeConfiguration: pendingResumeConfiguration ? true : void 0,
							authProfileId,
							model: response.model,
							modelProvider,
							historyCoveredThrough: (/* @__PURE__ */ new Date()).toISOString()
						}
					}, composeSessionEntryCommitGuards([
						assertCurrent,
						source,
						ctx.nativePolicySource
					]))) throw new Error("Codex thread binding changed while attaching the resumed thread.");
				} catch (error) {
					if (sameOwner && knownOwnership && !retained) {
						if (!await retainCodexAppServerBindingSubscription(client, effectiveThreadId, knownOwnership)) await closeCodexStartupClientBestEffort(client);
					} else if (retained && !sameOwner || !hasCodexAppServerLiveThread(client, effectiveThreadId)) await rollbackCodexAppServerBindingSubscription(client, effectiveThreadId, retained);
					throw error;
				}
			};
			await deps.codexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.resumeThread, {
				threadId: normalizedThreadId,
				excludeTurns: true
			}, {
				config: ctx.config,
				agentId: scope.agentId,
				agentDir: scope.agentDir,
				authProfileId: currentBinding?.authProfileId,
				sessionKey: ctx.sessionKey,
				sessionId: ctx.sessionId,
				storePath: ctx.sessionTarget?.storePath,
				assertCurrent: assertHostGeneration,
				assertCurrentAsync: ctx.assertNativePolicyCurrent,
				assertOwnerCurrent: () => assertCodexHostOwnerCurrent(ctx),
				beforeRequest: async (request) => {
					const { thread } = await request({
						method: "thread/read",
						requestParams: {
							threadId: normalizedThreadId,
							includeTurns: false
						}
					});
					assertCodexThreadAcceptsDirectInput(thread);
				},
				onResponse: commitResumedThread
			});
			return `Attached this OpenClaw session to Codex thread ${formatCodexDisplayText(normalizedThreadId)}.${pendingResumeConfiguration ? " The next turn will validate its tools and apply this session's configuration before continuing." : ""}`;
		})
	});
}
async function bindCodexCliNodeSession(deps, ctx, parsed) {
	if (!parsed.threadId || !parsed.host || parsed.bindHere !== true) return "Usage: /codex resume <session-id> --host <node> --bind here";
	if (await isCurrentSessionModelSelectionLocked(ctx)) return MODEL_SELECTION_LOCKED_MESSAGE;
	if (ctx.sessionId) {
		const scope = resolveCodexConversationControlScope(ctx);
		const binding = await deps.bindingStore.readAsync(sessionBindingIdentity({
			sessionId: ctx.sessionId,
			sessionKey: ctx.sessionKey,
			agentId: scope.agentId,
			config: ctx.config
		}));
		assertCodexBindingMayBeReplaced(binding, "binding a Codex CLI node session");
	}
	const resolved = await deps.resolveCodexCliSessionForBindingOnNode({
		requestedNode: parsed.host,
		sessionId: parsed.threadId
	});
	if (!resolved.session) return `No Codex CLI session ${formatCodexDisplayText(parsed.threadId)} was found on ${formatCodexDisplayText(parsed.host)}.`;
	const nodeId = resolved.node.nodeId;
	if (!nodeId) return "Cannot bind Codex CLI session because the selected node did not include a node id.";
	const scope = resolveCodexConversationControlScope(ctx);
	const data = createCodexCliNodeConversationBindingData({
		nodeId,
		sessionId: parsed.threadId,
		agentId: scope.agentId,
		cwd: resolved.session?.cwd
	});
	const summary = `Codex CLI session ${formatCodexDisplayText(parsed.threadId)} on ${formatCodexDisplayText(nodeId)}`;
	await ctx.assertNativePolicyCurrent?.();
	assertCodexHostOwnerCurrent(ctx);
	const request = await ctx.requestConversationBinding({
		summary,
		detachHint: "/codex detach",
		data
	});
	if (request.status === "bound") return `Bound this conversation to Codex CLI session ${formatCodexDisplayText(parsed.threadId)} on ${formatCodexDisplayText(nodeId)}.`;
	if (request.status === "pending") return request.reply.text ?? "Codex CLI session binding is pending approval.";
	return formatCodexDisplayText(request.message);
}
//#endregion
//#region extensions/codex/src/command-handler-actions.ts
const CODEX_NATIVE_EXECUTION_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"bind",
	"resume",
	"steer",
	"model",
	"fast",
	"permissions",
	"compact",
	"review",
	"goal"
]);
const CODEX_NATIVE_CONTROL_SUBCOMMANDS = /* @__PURE__ */ new Set([
	...CODEX_NATIVE_EXECUTION_SUBCOMMANDS,
	"detach",
	"unbind",
	"stop"
]);
async function resolveCodexNativeCommandSandboxBlock(ctx, subcommand, args) {
	if (isReadOnlyCodexGoalCommand(subcommand, args) || returnsBeforeNativeCodexExecution(subcommand, args)) return {
		block: void 0,
		async assertCurrent() {},
		release() {}
	};
	const sessionKey = ctx.sessionTarget?.sessionKey ?? ctx.sessionKey;
	const checksModelLock = [
		"bind",
		"resume",
		"detach",
		"unbind",
		"model"
	].includes(subcommand);
	if (!checksModelLock && !CODEX_NATIVE_EXECUTION_SUBCOMMANDS.has(subcommand)) return {
		block: void 0,
		async assertCurrent() {},
		release() {}
	};
	const agentId = ctx.sessionTarget?.agentId ?? resolveCodexConversationControlScope(ctx).agentId;
	const storePath = ctx.sessionTarget?.storePath ?? resolveStorePath(ctx.config.session?.store, { agentId });
	const modelCurrent = checksModelLock && sessionKey ? await captureSessionEntryCurrentCheckAsync({
		agentId,
		storePath,
		sessionKey,
		fields: ["modelSelectionLocked"]
	}) : void 0;
	if (!CODEX_NATIVE_EXECUTION_SUBCOMMANDS.has(subcommand)) return {
		block: void 0,
		assertCurrent: modelCurrent?.assertCurrent ?? (async () => {}),
		source: modelCurrent?.source,
		release: modelCurrent?.release ?? (() => {})
	};
	let execution;
	try {
		const surface = `/${["codex", subcommand].join(" ")}`;
		execution = isCodexCliNodeResumeBind(subcommand, args) ? await prepareCodexNativeSandboxBlock({
			config: ctx.config,
			sessionKey: ctx.sessionKey,
			sessionId: ctx.sessionId,
			surface
		}) : await prepareCodexNativeExecutionBlock({
			config: ctx.config,
			agentId: ctx.agentId,
			sessionKey,
			sessionId: ctx.sessionId,
			storePath,
			surface
		});
	} catch (error) {
		modelCurrent?.release();
		throw error;
	}
	return {
		block: execution.block,
		source: composeSessionEntryCommitGuards([modelCurrent?.source, execution.source]),
		assertCurrent: async () => {
			await modelCurrent?.assertCurrent();
			await execution.assertCurrent();
		},
		release: () => {
			modelCurrent?.release();
			execution.release();
		}
	};
}
function isReadOnlyCodexGoalCommand(subcommand, args) {
	if (subcommand !== "goal" || args.length > 1) return false;
	const action = (args[0] ?? "status").toLowerCase();
	return action === "status" || action === "get";
}
function returnsBeforeNativeCodexExecution(subcommand, args) {
	switch (subcommand) {
		case "bind": return parseBindArgs([...args]).help === true;
		case "resume": return returnsBeforeNativeCodexResume(args);
		case "steer": return args.join(" ").trim() === "";
		case "model": return args.length === 0 || args.length > 1;
		case "fast": return args.length === 0 || args.length > 1 || parseCodexFastModeArg(args[0]) === void 0;
		case "permissions": return args.length === 0 || args.length > 1 || parseCodexPermissionsModeArg(args[0]) === void 0;
		case "compact":
		case "review":
		case "detach":
		case "unbind":
		case "stop": return args.length > 0;
		default: return false;
	}
}
function isCodexCliNodeResumeBind(subcommand, args) {
	if (subcommand !== "resume") return false;
	const parsed = parseResumeArgs([...args]);
	return Boolean(parsed.host && parsed.threadId && parsed.bindHere === true && !parsed.help);
}
function returnsBeforeNativeCodexResume(args) {
	const parsed = parseResumeArgs([...args]);
	if (parsed.help || !parsed.threadId) return true;
	return parsed.host ? parsed.bindHere !== true : args.length !== 1;
}
async function handleComputerUseCommand(deps, ctx, pluginConfig, args) {
	const parsed = parseComputerUseArgs(args);
	if (parsed.help) return ["Usage: /codex computer-use [status|install] [--source <marketplace-source>] [--marketplace-path <path>] [--marketplace <name>]", "Checks or installs the configured Codex Computer Use plugin through app-server."].join("\n");
	if (Object.keys(parsed.persistentIdentity).length > 0) return formatComputerUsePersistentIdentityMigration(parsed);
	if (parsed.action === "install" && !canMutateCodexHost(ctx)) return "Only an owner or operator.admin gateway client can configure Codex Computer Use.";
	const { agentDir } = resolveCodexConversationControlScope(ctx);
	const params = {
		pluginConfig,
		config: ctx.config,
		agentDir,
		forceEnable: parsed.action === "install" || Object.keys(parsed.overrides).length > 0,
		...Object.keys(parsed.overrides).length > 0 ? { overrides: parsed.overrides } : {}
	};
	if (parsed.action === "install") return formatComputerUseStatus(await deps.installCodexComputerUse({
		...params,
		assertCurrent: () => assertCodexHostOwnerCurrent(ctx)
	}));
	return formatComputerUseStatus(await deps.readCodexComputerUseStatus(params));
}
async function handleNativeGoal(deps, ctx, pluginConfig, args) {
	const action = (args[0] ?? "status").toLowerCase();
	const objective = args.slice(1).join(" ").trim();
	const authority = await resolvePreparedCodexCommandAuthority(deps, ctx);
	using _ = { [Symbol.dispose]: authority.release };
	const { target, binding } = authority;
	if (!target) return "Cannot manage the Codex goal because this command has no stable binding identity.";
	if (!binding?.threadId) return "No Codex thread is attached to this OpenClaw session yet.";
	const connection = await resolveCodexBindingAppServerConnection({
		binding,
		authProfileId: binding.authProfileId,
		pluginConfig,
		agentDir: target.agentDir,
		config: ctx.config,
		assertCurrent: authority.assertCurrent,
		assertCurrentAsync: authority.assertCurrentAsync
	});
	const goalRequestOptions = {
		agentDir: target.agentDir,
		authProfileId: connection.clientAuthProfileId,
		config: ctx.config,
		sessionId: authority.sessionId,
		sessionKey: authority.sessionKey,
		storePath: authority.storePath,
		assertCurrent: authority.assertCurrent,
		assertCurrentAsync: authority.assertCurrentAsync,
		...connection.usesSupervisionConnection ? { startOptions: connection.appServer.start } : {}
	};
	if (action === "status" || action === "get" || action === "clear") {
		const clear = action === "clear";
		if (args.length > 1) return clear ? "Usage: /codex goal clear" : "Usage: /codex goal [status]";
		const response = await deps.codexControlRequest(pluginConfig, clear ? CODEX_CONTROL_METHODS.clearThreadGoal : CODEX_CONTROL_METHODS.getThreadGoal, { threadId: binding.threadId }, clear ? {
			...goalRequestOptions,
			assertOwnerCurrent: () => assertCodexHostOwnerCurrent(ctx)
		} : goalRequestOptions);
		if (clear) return isJsonObject(response) && response.cleared === true ? "Cleared the Codex goal." : "No Codex goal was active.";
		return formatNativeGoal(response);
	}
	const requestedStatus = action === "pause" ? "paused" : action === "resume" ? "active" : action === "block" ? "blocked" : action === "complete" ? "complete" : void 0;
	const isObjectiveUpdate = action === "set";
	if (!requestedStatus && !isObjectiveUpdate || isObjectiveUpdate && !objective) return "Usage: /codex goal [status|set <objective>|pause|resume|block|complete|clear]";
	if (requestedStatus && args.length > 1) return `Usage: /codex goal ${action}`;
	return formatNativeGoal(await deps.bindingStore.withLease(target.identity, () => deps.codexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.setThreadGoal, {
		threadId: binding.threadId,
		...objective ? { objective } : {},
		...requestedStatus ? { status: requestedStatus } : {}
	}, {
		...goalRequestOptions,
		assertOwnerCurrent: () => assertCodexHostOwnerCurrent(ctx),
		...(isObjectiveUpdate || requestedStatus === "active") && connection.usesSupervisionConnection ? { beforeRequest: supervisedCommandGuard(deps, target.identity, binding) } : {}
	})));
}
function formatNativeGoal(response) {
	const goal = isJsonObject(response) && isJsonObject(response.goal) ? response.goal : void 0;
	if (!goal) return "No Codex goal is active.";
	const objective = normalizeOptionalString(goal.objective) ?? "unknown";
	const status = normalizeOptionalString(goal.status) ?? "unknown";
	const tokensUsed = typeof goal.tokensUsed === "number" ? goal.tokensUsed : 0;
	const tokenBudget = typeof goal.tokenBudget === "number" ? goal.tokenBudget : void 0;
	return [
		`Codex goal: ${formatCodexDisplayText(objective)}`,
		`- Status: ${formatCodexDisplayText(status)}`,
		`- Tokens: ${tokensUsed}${tokenBudget === void 0 ? "" : ` / ${tokenBudget}`}`
	].join("\n");
}
async function controlConversationTurn(deps, ctx, command, message) {
	const authority = await resolvePreparedCodexCommandAuthority(deps, ctx);
	using _ = { [Symbol.dispose]: authority.release };
	const { target, binding } = authority;
	if (!target) return `Cannot ${command} Codex because this command did not include a stable binding identity.`;
	const params = {
		identity: target.identity,
		binding,
		assertCurrent: authority.assertMutationCurrent,
		assertCurrentAsync: authority.assertCurrentAsync
	};
	return (command === "stop" ? await deps.stopCodexConversationTurn(params) : await deps.steerCodexConversationTurn({
		...params,
		message
	})).message;
}
async function setConversationModel(deps, ctx, args) {
	if (args.length > 1) return "Usage: /codex model <model>";
	const [model = ""] = args;
	const normalized = model.trim();
	if (normalized && await isCurrentSessionModelSelectionLocked(ctx)) return MODEL_SELECTION_LOCKED_MESSAGE;
	const authority = await resolvePreparedCodexCommandAuthority(deps, ctx);
	using _ = { [Symbol.dispose]: authority.release };
	const { target, binding } = authority;
	if (!target) return "Cannot set Codex model because this command did not include a stable binding identity.";
	if (!normalized) {
		const currentSession = authority.sessionId && authority.sessionKey && authority.storePath ? await getSessionEntryAsync({
			storePath: authority.storePath,
			sessionKey: authority.sessionKey,
			hydrateSkillPromptRefs: false,
			readConsistency: "latest"
		}) : void 0;
		const selectedModel = currentSession && currentSession.sessionId === authority.sessionId ? currentSession.modelOverride ?? currentSession.model : void 0;
		authority.assertCurrent();
		const activeModel = target.identity.kind === "conversation" ? binding?.model : selectedModel ?? binding?.model;
		return activeModel ? `Codex model: ${formatCodexDisplayText(activeModel)}` : "Usage: /codex model <model>";
	}
	return await deps.setCodexConversationModel({
		identity: target.identity,
		bindingStore: deps.bindingStore,
		model: normalized,
		agentDir: target.agentDir,
		config: ctx.config,
		binding,
		storePath: authority.storePath,
		assertCurrent: authority.assertCurrent,
		assertCurrentAsync: authority.assertCurrentAsync,
		assertCommitAllowed: composeSessionEntryCommitGuards([authority.mutationSource, authority.assertMutationCurrent])
	});
}
async function setConversationPreference(deps, ctx, args, kind) {
	const usage = `Usage: /codex ${kind} ${kind === "fast" ? "[on|off|status]" : "[default|yolo|status]"}`;
	if (args.length > 1) return usage;
	const authority = await resolvePreparedCodexCommandAuthority(deps, ctx);
	using _ = { [Symbol.dispose]: authority.release };
	const { target, binding } = authority;
	if (kind === "fast") {
		if (!target) return "Cannot set Codex fast mode because this command did not include a stable binding identity.";
		const value = args[0];
		const parsed = parseCodexFastModeArg(value);
		if (value && parsed == null && value.trim().toLowerCase() !== "status") return usage;
		return await deps.setCodexConversationFastMode({
			identity: target.identity,
			bindingStore: deps.bindingStore,
			binding,
			enabled: parsed,
			assertCurrent: parsed === void 0 ? authority.assertCurrent : composeSessionEntryCommitGuards([authority.mutationSource, authority.assertMutationCurrent])
		});
	}
	if (!target || !ctx.sessionId || !ctx.sessionKey) return "Cannot set Codex permissions because this command did not include a complete session identity.";
	const value = args[0];
	const parsed = parseCodexPermissionsModeArg(value);
	if (value && !parsed && value.trim().toLowerCase() !== "status") return usage;
	if (parsed === "yolo" && !hasCodexAdminScope(ctx)) return CODEX_FULL_PERMISSIONS_AUTH_ERROR;
	return await deps.setCodexConversationPermissions({
		mode: parsed,
		config: ctx.config,
		storePath: authority.storePath,
		assertCurrent: parsed ? authority.assertHostMutationCurrent : authority.assertHostCurrent,
		sourceAuthority: parsed ? composeSessionEntryCommitGuards([authority.mutationSource, authority.assertHostMutationCurrent]) : void 0,
		session: {
			agentId: target.agentId,
			sessionId: ctx.sessionId,
			sessionKey: ctx.sessionKey
		}
	});
}
async function startThreadAction(deps, ctx, pluginConfig, kind, args) {
	if (args.length > 0) return `Usage: /codex ${kind}`;
	const authority = await resolvePreparedCodexCommandAuthority(deps, ctx);
	using _ = { [Symbol.dispose]: authority.release };
	const { target, binding } = authority;
	if (!target) return `Cannot start Codex ${kind === "compact" ? "compaction" : "review"} because this command did not include a stable binding identity.`;
	if (!binding?.threadId) return `No Codex thread is attached to this OpenClaw session yet.`;
	if (kind === "compact") {
		const sessionTarget = ctx.sessionTarget;
		if (!ctx.sessionId || !ctx.sessionKey || !sessionTarget || sessionTarget.sessionId !== ctx.sessionId || sessionTarget.sessionKey !== ctx.sessionKey) return "Codex compaction is unavailable because this command is not bound to a complete session identity.";
		const currentSession = await getSessionEntryAsync({
			storePath: authority.storePath ?? sessionTarget.storePath,
			sessionKey: ctx.sessionKey,
			hydrateSkillPromptRefs: false,
			readConsistency: "latest"
		});
		if (currentSession?.sessionId !== ctx.sessionId || resolvePersistedSessionRuntimeId(currentSession) !== "codex") return "Codex compaction is unavailable because the current OpenClaw session is not using the Codex runtime.";
		if (target.identity.kind === "conversation") {
			if (!isSameCodexAppServerThreadOwner(binding, authority.currentSessionBinding)) return "Codex compaction is unavailable because the conversation-bound thread differs from the current session binding. Resume that thread into the session first.";
		}
		const compactCurrent = ctx.runtimeContext?.compactCurrent;
		if (!compactCurrent) return "Codex compaction is unavailable because this command is not bound to a session.";
		await authority.assertCurrentAsync();
		authority.assertMutationCurrent();
		const result = await compactCurrent();
		return result.compacted ? `Compacted Codex session (${result.tokensAfter ?? "unknown"} tokens after).` : `Codex compaction did not complete: ${formatCodexDisplayText(result.reason ?? "no reason returned")}.`;
	}
	const connection = await resolveCodexBindingAppServerConnection({
		binding,
		authProfileId: binding.authProfileId,
		pluginConfig,
		agentDir: target.agentDir,
		config: ctx.config,
		assertCurrent: authority.assertCurrent,
		assertCurrentAsync: authority.assertCurrentAsync
	});
	await deps.bindingStore.withLease(target.identity, () => deps.codexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.review, {
		threadId: binding.threadId,
		target: { type: "uncommittedChanges" }
	}, {
		agentDir: target.agentDir,
		authProfileId: connection.clientAuthProfileId,
		config: ctx.config,
		sessionId: authority.sessionId,
		sessionKey: authority.sessionKey,
		storePath: authority.storePath,
		assertCurrent: authority.assertCurrent,
		assertCurrentAsync: authority.assertCurrentAsync,
		assertOwnerCurrent: () => assertCodexHostOwnerCurrent(ctx),
		...connection.usesSupervisionConnection ? {
			startOptions: connection.appServer.start,
			beforeRequest: supervisedCommandGuard(deps, target.identity, binding)
		} : {}
	}));
	return `Started Codex review for thread ${formatCodexDisplayText(binding.threadId)}.`;
}
function supervisedCommandGuard(deps, identity, binding) {
	return async (_request, client, scope) => {
		const { thread } = await client.request("thread/read", {
			threadId: binding.threadId,
			includeTurns: false
		});
		scope.assertCurrent();
		if (!isDeepStrictEqual(deps.bindingStore.read(identity), binding)) throw new Error("Codex command binding changed before model execution");
		scope.assertCurrent();
		assertCodexSupervisionThreadLineage(binding, thread);
	};
}
//#endregion
//#region extensions/codex/src/command-plugins-available.ts
const AVAILABLE_PAGE_SIZE = 10;
function formatCodexAvailablePlugins(plugins, warnings, query, page) {
	const filtered = filterCodexMarketplacePlugins(plugins, query);
	const pageCount = Math.max(1, Math.ceil(filtered.length / AVAILABLE_PAGE_SIZE));
	const start = (page - 1) * AVAILABLE_PAGE_SIZE;
	const visible = filtered.slice(start, start + AVAILABLE_PAGE_SIZE);
	const pageCommand = (target) => `/codex plugins available --page ${target}${query ? ` -- '${query.replaceAll("'", "'\\''")}'` : ""}`;
	const buttons = [];
	const lines = [];
	if (filtered.length === 0) lines.push(query ? `No Codex plugins match "${formatCodexDisplayText(query)}" in the returned catalogs. Try a shorter search or browse all plugins.` : "No Codex plugins were discovered for the current workspace.");
	else if (page > pageCount) {
		lines.push(`No plugin page ${page}. There are ${filtered.length} results across ${pageCount} pages.`);
		buttons.push({
			label: "First page",
			command: pageCommand(1)
		});
	} else {
		lines.push(`Showing ${start + 1}–${start + visible.length} of ${filtered.length}${query ? ` matches for "${formatCodexDisplayText(query)}"` : " plugins"} (page ${page}/${pageCount}).`);
		if (page > 1) buttons.push({
			label: "Previous page",
			command: pageCommand(page - 1)
		});
		if (page < pageCount) buttons.push({
			label: "Next page",
			command: pageCommand(page + 1)
		});
		lines.push(...visible.map((plugin) => {
			const state = plugin.installed ? plugin.enabled ? "installed" : "installed, disabled" : plugin.available ? "available" : "unavailable";
			const title = plugin.displayName ? `${formatCodexDisplayText(plugin.displayName)} — ` : "";
			const publisher = plugin.developerName ? formatCodexDisplayText(plugin.developerName) : "Not provided";
			const description = plugin.description ? formatCodexDisplayText(plugin.description) : "No description provided.";
			return `- ${title}${plugin.id} (${state})\n  Publisher: ${publisher}. ${description}`;
		}));
	}
	lines.push(...warnings.map((warning) => `Warning: ${formatCodexDisplayText(warning)}`), "Search names, titles, publishers, marketplaces, or descriptions: /codex plugins available <query>", "To authorize one plugin, an owner or operator.admin must send:", "/codex plugins install <plugin>@<marketplace>");
	if (query) buttons.push({
		label: "Browse all plugins",
		command: "/codex plugins available"
	});
	buttons.push({
		label: "Plugin controls",
		command: "/codex plugins menu"
	});
	return buildCodexPresentationReply(buildCodexCommandPickerPresentation("Discoverable Codex plugins", lines.join("\n"), buttons));
}
//#endregion
//#region extensions/codex/src/command-plugins-management.ts
const POLICY_REFRESH_HINT = "Takes effect on your next message.";
const AVAILABLE_USAGE = "Usage: /codex plugins available [query] [--page <positive integer>]. Search text must be at most 100 characters; use -- before literal query text that contains options.";
async function handleCodexPluginsSubcommand(input, rest, io, runtime) {
	const ctx = {
		...input,
		gatewayClientScopes: input.gatewayClientScopes?.slice()
	};
	const [verb = "list", ...args] = rest;
	const normalized = verb.toLowerCase();
	if ([
		"menu",
		"help",
		"list"
	].includes(normalized) && args.length > 0) return { text: `Usage: /codex plugins ${normalized}` };
	if (normalized === "menu") return buildPluginsMenuReply();
	if (normalized === "help") return { text: buildPluginsHelp() };
	if (normalized === "list") {
		const current = await io.readConfig();
		return { text: formatPluginList(current.plugins ?? {}, current.enabled === true) };
	}
	if (normalized === "available") {
		if (!canMutateCodexHost(ctx)) return { text: "Only an owner or operator.admin gateway client can list available Codex plugins." };
		let page = 1;
		const queryParts = [];
		for (let index = 0; index < args.length; index += 1) {
			const arg = expectDefined(args[index], "current Codex plugin search argument");
			if (arg === "--") {
				queryParts.push(...args.slice(index + 1));
				break;
			}
			if (arg === "--page") {
				const parsedPage = parseStrictPositiveInteger(args[++index]);
				if (parsedPage === void 0) return { text: AVAILABLE_USAGE };
				page = parsedPage;
			} else queryParts.push(arg);
		}
		const query = queryParts.join(" ").trim();
		if (query.length > 100) return { text: AVAILABLE_USAGE };
		if (!runtime) return { text: "Codex plugin discovery is unavailable for this command." };
		try {
			const discovered = await discoverCodexMarketplacePlugins({
				request: runtime.list,
				workspaceDir: await runtime.workspaceDir()
			});
			return formatCodexAvailablePlugins(discovered.plugins, discovered.warnings, query, page);
		} catch (error) {
			return { text: `Could not list Codex plugins: ${formatCodexDisplayText(coerceErrorMessage(error))}` };
		}
	}
	if (normalized === "status") {
		const requestedPlugin = args[0];
		const page = args[1] === void 0 ? 1 : Number(args[1]);
		if (!requestedPlugin || !parseCodexPluginMarketplaceId(requestedPlugin) || args.length > 2 || !Number.isSafeInteger(page) || page < 1) return { text: "Usage: /codex plugins status <name>@<marketplace> [page]. Use /codex plugins list to find a configured plugin." };
		if (!canMutateCodexHost(ctx)) return { text: "Only an owner or operator.admin gateway client can run /codex plugins status." };
		if (!runtime?.withContext) return { text: "Codex plugin status is unavailable. Check the configured Codex app-server, then run this command again." };
		return await runtime.withContext(async (context) => {
			const configured = resolveConfiguredPluginKey(context.current.plugins ?? {}, requestedPlugin);
			if (configured.status === "ambiguous" || configured.status === "mismatched") return { text: describeConfiguredPluginIdentityConflict(requestedPlugin, configured.status) };
			if (configured.status === "missing") return { text: "This plugin is not explicitly configured. Use /codex plugins list, or /codex plugins available to find an install command." };
			return formatCodexPluginReadiness(await readCodexPluginReadiness({
				context,
				current: context.current,
				configKey: configured.configKey
			}), page);
		});
	}
	if (normalized === "install") {
		if (args.length !== 1 || !args[0]) return { text: "Usage: /codex plugins install <plugin>@<marketplace>" };
		if (!canMutateCodexHost(ctx)) return { text: "Only an owner or operator.admin gateway client can run /codex plugins install." };
		if (!runtime) return { text: "Codex plugin installation is unavailable for this command." };
		return await installCodexPlugin(args[0], io, runtime, ctx);
	}
	const target = args[0];
	if (normalized === "enable" || normalized === "disable") {
		if (args.length === 0) return buildPluginNamePickerReply(normalized, await io.readConfig());
		if (!target || args.length > 1) return { text: `Usage: /codex plugins ${normalized} <name>` };
		if (!canMutateCodexHost(ctx)) return { text: `Only an owner or operator.admin gateway client can run /codex plugins ${normalized}.` };
		const wantEnabled = normalized === "enable";
		const current = (await io.readConfig()).plugins ?? {};
		const exact = current[target];
		const requested = parseCodexPluginMarketplaceId(target);
		const configured = exact && requested && !matchesConfiguredPluginIdentity(exact, requested, target) ? {
			status: "matched",
			configKey: target
		} : resolveConfiguredPluginKey(current, target);
		if (configured.status === "ambiguous" || configured.status === "mismatched") return { text: describeConfiguredPluginIdentityConflict(target, configured.status) };
		if (configured.status === "missing") return { text: `Codex sub-plugin '${formatCodexDisplayText(target)}' is not configured. Run '/codex plugins list' to see configured plugins.` };
		const configKey = configured.configKey;
		assertCodexHostOwnerCurrent(ctx);
		await io.mutate((block) => {
			if (wantEnabled) block.enabled = true;
			block.plugins ??= {};
			block.plugins[configKey] = {
				...block.plugins[configKey],
				enabled: wantEnabled
			};
		}, () => assertCodexHostOwnerCurrent(ctx));
		return { text: `${formatCodexDisplayText(configKey)}: ${wantEnabled ? "enabled" : "disabled"} in openclaw.json. ${POLICY_REFRESH_HINT}` };
	}
	return { text: `Unknown /codex plugins subcommand: ${formatCodexDisplayText(verb)}\n\n${buildPluginsHelp()}` };
}
function buildPluginsMenuReply() {
	return {
		text: [
			"Codex sub-plugins. Pick a sub-action or type:",
			"",
			"  1. /codex plugins list",
			"  2. /codex plugins available",
			"  3. /codex plugins status <name>@<marketplace>",
			"  4. /codex plugins refresh — refresh hosted apps",
			"  5. /codex plugins enable",
			"  6. /codex plugins disable",
			"  7. /codex plugins help",
			"",
			"Type '/codex' to go back to the main menu."
		].join("\n"),
		presentation: buildCodexCommandPickerPresentation("Codex sub-plugins", "Pick a Codex sub-plugin action:", [
			{
				label: "list",
				command: "/codex plugins list"
			},
			{
				label: "available",
				command: "/codex plugins available"
			},
			{
				label: "Refresh hosted apps",
				command: "/codex plugins refresh"
			},
			{
				label: "enable",
				command: "/codex plugins enable"
			},
			{
				label: "disable",
				command: "/codex plugins disable"
			},
			{
				label: "help",
				command: "/codex plugins help"
			},
			{
				label: "back",
				command: "/codex"
			}
		])
	};
}
function buildPluginNamePickerReply(verb, current) {
	const globalEnabled = current.enabled === true;
	const eligible = Object.entries(current.plugins ?? {}).toSorted(([left], [right]) => left.localeCompare(right)).filter(([, entry]) => {
		const effectivelyEnabled = globalEnabled && entry.enabled !== false;
		return verb === "disable" ? effectivelyEnabled : !effectivelyEnabled;
	});
	if (eligible.length === 0) return {
		text: [
			`No configured ${verb === "enable" ? "disabled" : "enabled"} Codex sub-plugins found.`,
			"",
			"Type '/codex plugins list' to inspect configured sub-plugins.",
			"Type '/codex plugins menu' to go back to the plugins menu."
		].join("\n"),
		presentation: buildCodexCommandPickerPresentation("Codex sub-plugins", "Pick another Codex sub-plugin action:", [{
			label: "list",
			command: "/codex plugins list"
		}, {
			label: "back",
			command: "/codex plugins menu"
		}])
	};
	const buttons = [...eligible.map(([key]) => ({
		label: formatCodexDisplayText(key),
		command: `/codex plugins ${verb} ${key}`
	})), {
		label: "back",
		command: "/codex plugins menu"
	}];
	return {
		text: [
			`Codex sub-plugins to ${verb}. Pick one or type:`,
			"",
			...eligible.map(([key], index) => `  ${index + 1}. /codex plugins ${verb} ${key}`),
			"",
			...verb === "enable" && !globalEnabled ? ["Global codexPlugins.enabled is off; enabling one configured sub-plugin turns it on.", ""] : [],
			"Type '/codex plugins menu' to go back to the plugins menu."
		].join("\n"),
		presentation: buildCodexCommandPickerPresentation("Codex sub-plugins", `Pick a Codex sub-plugin to ${verb}:`, buttons)
	};
}
function buildPluginsHelp() {
	return [
		"Codex plugin discovery and owner-approved installation:",
		"- /codex plugins                            (alias for list)",
		"- /codex plugins list                       show explicitly configured plugins",
		"- /codex plugins available [query] [--page <n>]  search or browse Codex plugins",
		"- /codex plugins status <name>@<marketplace> [page]  inspect app readiness without refreshing",
		"- /codex plugins refresh                   refresh all hosted apps for the current Codex account/runtime",
		"- /codex plugins install <name>@<marketplace>  install and authorize one plugin",
		"- /codex plugins enable <name>              enable a configured plugin",
		"- /codex plugins disable <name>             disable a configured plugin",
		"Only an owner or operator.admin can discover, inspect, refresh hosted apps, install, enable, or disable plugins."
	].join("\n");
}
async function installCodexPlugin(requestedId, io, runtime, ctx) {
	const requested = parseCodexPluginMarketplaceId(requestedId);
	if (!requested) return { text: "Invalid plugin identifier. Use /codex plugins install <plugin>@<marketplace>. Both names allow ASCII letters, digits, underscores, and hyphens. Plugin names may also contain dots between nonempty segments." };
	let plugin;
	let workspaceDir;
	try {
		workspaceDir = await runtime.workspaceDir();
		const matching = (await discoverCodexMarketplacePlugins({
			request: runtime.list,
			workspaceDir
		})).plugins.filter((candidate) => candidate.pluginName === requested.pluginName && marketplaceNamesRepresentSameCatalog(candidate.marketplaceName, requested.marketplaceName));
		if (matching.length > 1) {
			plugin = resolveCuratedMarketplaceAliases(matching, requested.marketplaceName);
			if (!plugin) return { text: `Multiple available Codex plugins match '${formatCodexDisplayText(requestedId)}'; the marketplace identity must be unique.` };
		} else plugin = matching[0];
	} catch (error) {
		return { text: `Could not verify the requested Codex plugin: ${formatCodexDisplayText(coerceErrorMessage(error))}` };
	}
	if (!plugin) return { text: `${formatCodexDisplayText(requestedId)} was not found. Run /codex plugins available to inspect the current marketplaces.` };
	if (!plugin.available) return { text: `${formatCodexDisplayText(requestedId)} is unavailable or disabled by its marketplace administrator.` };
	const alreadyInstalled = plugin.installed && plugin.enabled;
	if (!alreadyInstalled && !plugin.marketplacePath && plugin.remotePluginId) {
		if (plugin.mustShowInstallationInterstitial === true) return { text: `${formatCodexDisplayText(requestedId)} requires a Codex installation confirmation that OpenClaw cannot display. Install it in Codex first, then rerun this command to authorize it here.` };
		if (plugin.mustShowInstallationInterstitial !== false) return { text: `${formatCodexDisplayText(requestedId)} cannot be installed because Codex did not provide its required installation-confirmation policy. Install it in Codex first, then rerun this command to authorize it here.` };
	}
	try {
		const configured = resolveInstalledPluginKey((await io.readConfig()).plugins ?? {}, plugin);
		if (configured.status === "ambiguous" || configured.status === "mismatched") return { text: describeConfiguredPluginIdentityConflict(requestedId, configured.status) };
	} catch (error) {
		return { text: `Could not verify existing Codex plugin authorization: ${formatCodexDisplayText(coerceErrorMessage(error))}` };
	}
	let result;
	if (!alreadyInstalled) {
		const requestParams = plugin.marketplacePath ? {
			marketplacePath: plugin.marketplacePath,
			pluginName: plugin.pluginName
		} : plugin.remotePluginId ? {
			remoteMarketplaceName: plugin.marketplaceName,
			pluginName: plugin.remotePluginId
		} : void 0;
		if (!requestParams) return { text: `${formatCodexDisplayText(requestedId)} cannot be installed because its marketplace did not provide a trusted local path or remote plugin identifier.` };
		try {
			assertCodexHostOwnerCurrent(ctx);
			result = await runtime.install(requestParams);
		} catch (error) {
			return { text: `Could not install ${formatCodexDisplayText(requestedId)}: ${formatCodexDisplayText(coerceErrorMessage(error))}` };
		}
	}
	const selectedPlugin = plugin;
	try {
		assertCodexHostOwnerCurrent(ctx);
		await io.mutate((block) => {
			block.plugins ??= {};
			const configured = resolveInstalledPluginKey(block.plugins, selectedPlugin);
			if (configured.status === "ambiguous" || configured.status === "mismatched") throw new Error(describeConfiguredPluginIdentityConflict(selectedPlugin.id, configured.status));
			const curated = isOpenAiCuratedMarketplaceName(selectedPlugin.marketplaceName);
			const canonicalId = curated ? `${selectedPlugin.pluginName}@${CODEX_PLUGINS_MARKETPLACE_NAME}` : selectedPlugin.id;
			const configKey = configured.status === "matched" ? configured.configKey : canonicalId;
			const existing = block.plugins[configKey];
			block.enabled = true;
			const updated = {
				...existing,
				enabled: true,
				marketplaceName: existing?.marketplaceName ?? (curated ? "openai-curated" : selectedPlugin.marketplaceName),
				pluginName: existing?.pluginName ?? (curated ? selectedPlugin.pluginName : persistedPluginName(selectedPlugin))
			};
			block.plugins[configKey] = updated;
		}, () => assertCodexHostOwnerCurrent(ctx));
	} catch (error) {
		return { text: `${formatCodexDisplayText(requestedId)} was installed in Codex but could not be authorized in OpenClaw and will not be exposed: ${formatCodexDisplayText(coerceErrorMessage(error))}` };
	}
	let refreshWarning = "";
	if (runtime.refresh) try {
		refreshWarning = (await runtime.refresh(workspaceDir)).diagnostics.map((diagnostic) => ` ${formatCodexDisplayText(diagnostic.message)}`).join("");
	} catch (error) {
		refreshWarning = ` Runtime refresh requires a new conversation: ${formatCodexDisplayText(coerceErrorMessage(error))}`;
	}
	const appsNeedingAuth = result?.appsNeedingAuth ?? [];
	if (appsNeedingAuth.length > 0) {
		let appLinks = [];
		if (runtime.withContext) try {
			appLinks = await runtime.withContext(async (context) => {
				const configured = resolveConfiguredPluginKey(context.current.plugins ?? {}, requestedId);
				if (configured.status !== "matched") return [];
				const readiness = await readCodexPluginReadiness({
					context,
					current: context.current,
					configKey: configured.configKey
				});
				const pendingIds = new Set(appsNeedingAuth.map((app) => app.id));
				return codexPluginAppPageLinks(readiness).filter((app) => pendingIds.has(app.id));
			});
		} catch {}
		const authRequirement = appsNeedingAuth.length === 1 ? "1 app still requires" : `${appsNeedingAuth.length} apps still require`;
		return buildCodexPresentationReply({
			title: "Codex plugin app setup",
			tone: "warning",
			blocks: [
				{
					type: "text",
					text: `${formatCodexDisplayText(requestedId)} bundle was installed in Codex. OpenClaw app access is configured. ${authRequirement} connector authentication in ChatGPT. Installation does not confirm app connections or current-conversation readiness.`
				},
				...buildCodexPluginAppLinks(appLinks),
				...appLinks.length < appsNeedingAuth.length ? [{
					type: "text",
					text: `Some app setup permissions could not be confirmed. Run /codex plugins status ${requestedId} to check the current account and restrictions.`
				}] : [],
				buildCodexPluginStatusButtons(requestedId, appLinks.length > 0),
				{
					type: "context",
					text: `${refreshWarning.trim()} ${POLICY_REFRESH_HINT}`.trim()
				}
			]
		});
	}
	const status = alreadyInstalled ? "bundle was already installed in Codex" : "bundle was installed in Codex";
	return { text: `${formatCodexDisplayText(requestedId)} ${status}. OpenClaw app access is configured.${refreshWarning} ${POLICY_REFRESH_HINT}` };
}
function formatPluginList(plugins, globalEnabled) {
	const keys = Object.keys(plugins).toSorted();
	if (keys.length === 0) return "No Codex sub-plugins configured under plugins.entries.codex.config.codexPlugins.plugins";
	const rows = keys.map((key) => {
		const entry = plugins[key] ?? {};
		const state = globalEnabled && entry.enabled !== false ? "ON " : "OFF";
		return {
			displayKey: formatCodexDisplayText(key),
			state,
			pluginName: formatCodexDisplayText(entry.pluginName ?? key),
			marketplace: formatCodexDisplayText(entry.marketplaceName ?? "?")
		};
	});
	const keyW = Math.max(...rows.map((r) => r.displayKey.length));
	const pluginW = Math.max(...rows.map((r) => r.pluginName.length));
	return [
		"Codex sub-plugins in Openclaw config (~/.openclaw/openclaw.json):",
		"",
		...rows.map((r) => `  ${r.state}  ${r.displayKey.padEnd(keyW)}  ${r.pluginName.padEnd(pluginW)}  [${r.marketplace}]`),
		"",
		...globalEnabled ? [] : ["Global codexPlugins.enabled is off; configured sub-plugins are inactive.", ""],
		"Inspect one configured plugin: /codex plugins status <name>@<marketplace> [page].",
		POLICY_REFRESH_HINT
	].join("\n");
}
//#endregion
//#region extensions/codex/src/command-plugins-runtime.ts
const SCOPE_CHANGED_MESSAGE = "Codex account, conversation, or plugin policy changed. Run the command again.";
async function withCodexPluginCommandContext(params, run) {
	const { deps, pluginConfig } = params;
	const ctx = {
		...params.ctx,
		gatewayClientScopes: params.ctx.gatewayClientScopes?.slice()
	};
	const current = await deps.codexPluginsManagementIo?.readConfig() ?? {};
	const { scope, binding } = await resolveCommandAppServerContext(deps, ctx, pluginConfig);
	using _ = { [Symbol.dispose]: scope.release };
	const conversation = readCodexConversationBindingData(await ctx.getCurrentConversationBinding());
	const workspaceDir = binding?.cwd || (conversation?.kind === "codex-app-server-session" ? conversation.workspaceDir : void 0) || resolveAgentWorkspaceDir(ctx.config, scope.agentId);
	const configuredRuntime = resolveCodexAppServerRuntimeOptions({ pluginConfig });
	const appServer = scope.startOptions ? {
		...configuredRuntime,
		start: scope.startOptions
	} : configuredRuntime;
	const auth = await prepareCodexControlSessionAuth({
		...scope,
		config: ctx.config
	}, appServer.start);
	try {
		const { assertCurrentAsync } = {
			assertCurrentAsync: scope.assertCurrentAsync,
			...auth.clientOptions
		};
		const preparedAuth = "preparedAuth" in auth.clientOptions ? auth.clientOptions.preparedAuth : void 0;
		const usesNativeAuth = scope.authProfileId === null || appServer.start.homeScope === "user";
		const profileId = usesNativeAuth ? void 0 : auth.authProfileId;
		const readAuthBinding = async () => profileId ? fingerprintCodexAppServerAuthBinding({
			authProfileId: profileId,
			authProfileStore: await resolveCodexAppServerAuthProfileStore({
				authProfileId: profileId,
				agentDir: scope.agentDir,
				config: ctx.config
			}),
			agentDir: scope.agentDir,
			config: ctx.config
		}) : Promise.resolve(void 0);
		const authBinding = "authBindingFingerprint" in auth.clientOptions ? auth.clientOptions.authBindingFingerprint : await readAuthBinding();
		const accountId = usesNativeAuth ? void 0 : preparedAuth?.kind === "api-key" ? resolveCodexAppServerPreparedApiKeyCacheKey(preparedAuth.apiKey) : preparedAuth?.kind === "profile" ? preparedAuth.snapshot.secretFreeCacheKey : await resolveCodexAppServerAuthAccountCacheKey({
			authProfileId: profileId,
			agentDir: scope.agentDir,
			config: ctx.config
		});
		if (await readAuthBinding() !== authBinding) throw new Error(SCOPE_CHANGED_MESSAGE);
		return await withCodexAppServerJsonClient({
			startOptions: appServer.start,
			pluginConfig,
			agentDir: scope.agentDir,
			config: ctx.config,
			sessionId: ctx.sessionId,
			sessionKey: ctx.sessionKey,
			timeoutMs: appServer.requestTimeoutMs,
			timeoutMessage: "Codex plugin request timed out. Check the Codex connection and retry.",
			assertCurrent: scope.assertCurrent,
			...auth.clientOptions
		}, async (request, client, requestScope) => {
			const assertCurrent = () => {
				requestScope.assertCurrent();
				if (client.getCloseError()) throw new Error(SCOPE_CHANGED_MESSAGE);
			};
			const validateCurrent = async () => {
				assertCurrent();
				const currentAuthBinding = await readAuthBinding();
				await assertCurrentAsync?.();
				assertCurrent();
				if (currentAuthBinding !== authBinding) throw new Error(SCOPE_CHANGED_MESSAGE);
			};
			try {
				await request({
					method: "account/read",
					requestParams: { refreshToken: false },
					assertCurrent
				});
			} catch {
				requestScope.assertCurrent();
				throw new Error("Codex account startup could not be confirmed. Check /codex account and retry.");
			}
			const unsubscribe = client.addNotificationHandler((notification) => {
				if (notification.method === "account/updated") requestScope.abort(/* @__PURE__ */ new Error(SCOPE_CHANGED_MESSAGE));
			});
			try {
				await validateCurrent();
				const result = await run({
					request: async (method, requestParams) => {
						await validateCurrent();
						const response = await request({
							method,
							requestParams,
							assertCurrent: () => {
								assertCurrent();
								assertCodexHostOwnerCurrent(ctx);
							}
						});
						await validateCurrent();
						return response;
					},
					workspaceDir,
					agentId: scope.agentId,
					current,
					...profileId ? { profileId } : {},
					...binding?.clientId === client.getInstanceId() ? { threadId: binding.threadId } : {},
					appCacheKey: buildCodexPluginAppCacheKey({
						appServer,
						agentDir: scope.agentDir,
						authProfileId: profileId,
						accountId,
						envApiKeyFingerprint: usesNativeAuth || preparedAuth || profileId ? void 0 : resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: appServer.start }),
						appServerVersion: client.getServerVersion(),
						runtimeIdentity: client.getRuntimeIdentity()
					}),
					validateCurrent
				});
				await validateCurrent();
				return result;
			} finally {
				unsubscribe();
			}
		});
	} finally {
		auth.release();
	}
}
//#endregion
//#region extensions/codex/src/command-handlers.ts
const CODEX_HOST_INSPECTION_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"account",
	"mcp",
	"sessions",
	"skills",
	"status",
	"threads"
]);
async function handleCodexSubcommand(inputCtx, options) {
	const deps = resolveCodexCommandDeps(options.deps);
	const args = splitArgs(inputCtx.args);
	if (args.length === 0) return buildCodexSubcommandPickerReply();
	const [subcommand = "status", ...rest] = args;
	const normalized = subcommand.toLowerCase();
	if (normalized === "help") return { text: buildHelp() };
	if (CODEX_HOST_INSPECTION_SUBCOMMANDS.has(normalized) && !canMutateCodexHost(inputCtx)) return { text: CODEX_HOST_INSPECTION_AUTH_ERROR };
	if (CODEX_NATIVE_CONTROL_SUBCOMMANDS.has(normalized) && !returnsBeforeNativeCodexExecution(normalized, rest) && !isReadOnlyCodexGoalCommand(normalized, rest) && !canMutateCodexHost(inputCtx)) return { text: CODEX_NATIVE_EXECUTION_AUTH_ERROR };
	const nativePolicy = await resolveCodexNativeCommandSandboxBlock(inputCtx, normalized, rest);
	try {
		if (nativePolicy.block) return { text: nativePolicy.block };
		const previousPolicyCheck = inputCtx.assertNativePolicyCurrent;
		const ctx = {
			...inputCtx,
			nativePolicySource: nativePolicy.source,
			assertNativePolicyCurrent: async () => {
				await previousPolicyCheck?.();
				await nativePolicy.assertCurrent();
			}
		};
		const usageCommand = normalized === "unbind" ? "detach" : normalized;
		if (rest.length > 0 && [
			"status",
			"models",
			"detach",
			"binding",
			"stop",
			"mcp",
			"skills",
			"account"
		].includes(usageCommand)) return { text: `Usage: /codex ${usageCommand}` };
		if (normalized === "plugins") {
			if (rest[0]?.toLowerCase() === "refresh") {
				if (rest.length !== 1) return { text: "Usage: /codex plugins refresh — refresh hosted app inventory for the current Codex account/runtime." };
				if (!canMutateCodexHost(ctx)) return { text: "Only an owner or operator.admin gateway client can refresh hosted app inventory." };
				return await withCodexPluginCommandContext({
					deps,
					ctx,
					pluginConfig: options.pluginConfig
				}, (context) => refreshCodexHostedApps(context));
			}
			if (!deps.codexPluginsManagementIo) return { text: "Codex sub-plugin management is not wired up (codexPluginsManagementIo dep is undefined). Edit ~/.openclaw/openclaw.json or use `openclaw config patch` until the runtime exposes the IO." };
			let appServerScope;
			await using _ = { [Symbol.asyncDispose]: async () => {
				await appServerScope?.then((scope) => scope.release(), () => {});
			} };
			const getAppServerScope = () => appServerScope ??= resolveCommandAppServerScope(deps, ctx, options.pluginConfig);
			return await handleCodexPluginsSubcommand(ctx, rest, deps.codexPluginsManagementIo, {
				withContext: (run) => withCodexPluginCommandContext({
					deps,
					ctx,
					pluginConfig: options.pluginConfig
				}, run),
				workspaceDir: async () => {
					const data = readCodexConversationBindingData(await ctx.getCurrentConversationBinding());
					return (data?.kind === "codex-app-server-session" ? data.workspaceDir : void 0)?.trim() || deps.resolveCodexDefaultWorkspaceDir(options.pluginConfig);
				},
				list: async (requestParams) => {
					const scope = await getAppServerScope();
					return await deps.codexControlRequest(options.pluginConfig, CODEX_CONTROL_METHODS.listPlugins, requestParams, {
						...scope,
						config: ctx.config
					});
				},
				install: async (requestParams) => {
					const scope = await getAppServerScope();
					return await deps.codexControlRequest(options.pluginConfig, CODEX_CONTROL_METHODS.installPlugin, requestParams, {
						...scope,
						config: ctx.config,
						assertOwnerCurrent: () => assertCodexHostOwnerCurrent(ctx)
					});
				},
				refresh: async (workspaceDir) => {
					const scope = await getAppServerScope();
					const configuredAppServer = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
					const appServer = scope.startOptions ? {
						...configuredAppServer,
						start: scope.startOptions
					} : configuredAppServer;
					const authProfileId = scope.authProfileId ?? void 0;
					const accountId = await resolveCodexAppServerAuthAccountCacheKey({
						authProfileId,
						agentDir: scope.agentDir,
						config: ctx.config
					});
					const client = await getLeasedSharedCodexAppServerClient({
						startOptions: appServer.start,
						pluginConfig: options.pluginConfig,
						authProfileId: scope.authProfileId,
						agentDir: scope.agentDir,
						config: ctx.config
					});
					try {
						const appCacheKey = buildCodexPluginAppCacheKey({
							appServer,
							agentDir: scope.agentDir,
							authProfileId,
							accountId,
							envApiKeyFingerprint: authProfileId ? void 0 : resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: appServer.start }),
							appServerVersion: client.getServerVersion(),
							runtimeIdentity: client.getRuntimeIdentity()
						});
						return await refreshCodexPluginRuntimeState({
							configCwd: workspaceDir,
							appCache: defaultCodexAppInventoryCache,
							appCacheKey,
							metadataCache: defaultCodexPluginMetadataCache,
							request: async (method, requestParams) => {
								const requestMethod = resolvePluginRuntimeRefreshMethod(method);
								return await deps.codexControlRequest(options.pluginConfig, requestMethod, requestParams, {
									...scope,
									config: ctx.config
								});
							}
						});
					} finally {
						releaseLeasedSharedCodexAppServerClient(client);
					}
				}
			});
		}
		if (normalized === "status") {
			const { agentDir } = resolveCodexConversationControlScope(ctx);
			return { text: formatCodexStatus(await deps.readCodexStatusProbes(options.pluginConfig, ctx.config, agentDir)) };
		}
		if (normalized === "models") {
			const { agentDir } = resolveCodexConversationControlScope(ctx);
			return { text: formatModels(await deps.listCodexAppServerModels(deps.requestOptions(options.pluginConfig, 100, ctx.config, agentDir))) };
		}
		if (normalized === "threads") return { text: await buildThreads(deps, ctx, options.pluginConfig, rest.join(" ")) };
		if (normalized === "goal") return { text: await handleNativeGoal(deps, ctx, options.pluginConfig, rest) };
		if (normalized === "sessions") return { text: await buildCodexCliSessions(deps, rest) };
		if (normalized === "resume") return { text: await resumeThread(deps, ctx, options.pluginConfig, rest) };
		if (normalized === "bind") return await bindConversation(deps, ctx, options.pluginConfig, rest);
		if (normalized === "detach" || normalized === "unbind") return { text: await detachConversation(deps, ctx) };
		if (normalized === "binding") return { text: await describeConversationBinding(deps, ctx) };
		if (normalized === "stop" || normalized === "steer") return { text: await controlConversationTurn(deps, ctx, normalized, rest.join(" ")) };
		if (normalized === "model") return { text: await setConversationModel(deps, ctx, rest) };
		if (normalized === "fast" || normalized === "permissions") {
			if (isMenuVerb(rest)) return buildCodexChoiceMenuReply(normalized);
			return { text: await setConversationPreference(deps, ctx, rest, normalized) };
		}
		if (normalized === "compact" || normalized === "review") return { text: await startThreadAction(deps, ctx, options.pluginConfig, normalized, rest) };
		if (normalized === "diagnostics") return await handleCodexDiagnosticsFeedback(deps, ctx, options.pluginConfig, rest.join(" "));
		if (normalized === "computer-use" || normalized === "computeruse") {
			if (isMenuVerb(rest)) return buildCodexChoiceMenuReply("computer-use");
			return { text: await handleComputerUseCommand(deps, ctx, options.pluginConfig, rest) };
		}
		if (normalized === "mcp" || normalized === "skills") {
			const scope = await resolveCommandAppServerScope(deps, ctx, options.pluginConfig);
			using _ = { [Symbol.dispose]: scope.release };
			const response = await deps.codexControlRequest(options.pluginConfig, normalized === "mcp" ? CODEX_CONTROL_METHODS.listMcpServers : CODEX_CONTROL_METHODS.listSkills, normalized === "mcp" ? { limit: 100 } : {}, {
				config: ctx.config,
				...scope
			});
			return { text: normalized === "mcp" ? formatList(response, "MCP servers") : formatSkills(response) };
		}
		if (normalized === "account") {
			const scope = await resolveCommandAppServerScope(deps, ctx, options.pluginConfig);
			using _ = { [Symbol.dispose]: scope.release };
			const requestScope = {
				config: ctx.config,
				...scope
			};
			const [account, limits] = await Promise.all([deps.safeCodexControlRequest(options.pluginConfig, CODEX_CONTROL_METHODS.account, { refreshToken: false }, requestScope), deps.safeCodexControlRequest(options.pluginConfig, CODEX_CONTROL_METHODS.rateLimits, void 0, requestScope)]);
			return { text: formatAccount(account, limits, await readCodexAccountAuthOverview({
				ctx,
				agentDir: scope.agentDir,
				authProfileId: scope.authProfileId,
				pluginConfig: options.pluginConfig,
				safeCodexControlRequest: deps.safeCodexControlRequest,
				account,
				limits
			})) };
		}
		return { text: `Unknown Codex command: ${formatCodexDisplayText(subcommand)}\n\n${buildHelp()}` };
	} finally {
		nativePolicy.release();
	}
}
function resolvePluginRuntimeRefreshMethod(method) {
	const recognized = [
		CODEX_CONTROL_METHODS.listPlugins,
		CODEX_CONTROL_METHODS.installedApps,
		CODEX_CONTROL_METHODS.readApps
	].find((candidate) => candidate === method);
	if (!recognized) throw new Error(`Unexpected Codex plugin refresh method: ${method}`);
	return recognized;
}
//#endregion
export { handleCodexSubcommand };
